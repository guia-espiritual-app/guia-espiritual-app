const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret, defineString } = require('firebase-functions/params')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore, FieldValue, Timestamp } = require('firebase-admin/firestore')
const logger = require('firebase-functions/logger')

initializeApp()

/** Secrets: configurar con `firebase functions:secrets:set ...` */
const paypalClientId = defineSecret('PAYPAL_CLIENT_ID')
const paypalSecret = defineSecret('PAYPAL_SECRET')

/**
 * Base de la API PayPal.
 * Sandbox: https://api-m.sandbox.paypal.com
 * Live:    https://api-m.paypal.com
 */
const paypalApiBase = defineString('PAYPAL_API_BASE', {
  default: 'https://api-m.sandbox.paypal.com',
})

const paypalPlanId = defineString('PAYPAL_PLAN_ID', {
  default: 'P-5U595314UB224684ENKGNQ2A',
})

/** ID del webhook en el panel de PayPal. Vacío = rechazar todos los eventos. */
const paypalWebhookId = defineString('PAYPAL_WEBHOOK_ID', {
  default: '',
})

/**
 * Obtiene access token OAuth2 de PayPal (client credentials).
 */
async function getPayPalAccessToken(apiBase, clientId, secret) {
  const credentials = Buffer.from(`${clientId}:${secret}`).toString('base64')

  const response = await fetch(`${apiBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    logger.error('PayPal OAuth failed', {
      status: response.status,
      body,
    })
    throw new HttpsError(
      'internal',
      'No se pudo autenticar con PayPal. Intenta más tarde.'
    )
  }

  if (!body.access_token) {
    logger.error('PayPal OAuth sin access_token', { body })
    throw new HttpsError('internal', 'Respuesta inválida de PayPal (token).')
  }

  return body.access_token
}

/**
 * Consulta una suscripción en PayPal Billing API.
 */
async function fetchPayPalSubscription(apiBase, accessToken, subscriptionId) {
  const response = await fetch(
    `${apiBase}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    logger.error('PayPal get subscription failed', {
      status: response.status,
      subscriptionId,
      body,
    })
    throw new HttpsError(
      'not-found',
      'No se encontró la suscripción en PayPal o no se pudo consultar.'
    )
  }

  return body
}

/**
 * Callable: verifyPayPalSubscription
 * Input: { subscriptionId: string }
 * Auth: requerida
 */
exports.verifyPayPalSubscription = onCall(
  {
    region: 'us-central1',
    secrets: [paypalClientId, paypalSecret],
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError('unauthenticated', 'Debes iniciar sesión.')
    }

    const uid = request.auth.uid
    const subscriptionId = String(request.data?.subscriptionId || '').trim()

    if (!subscriptionId) {
      return { success: false, reason: 'Falta subscriptionId.' }
    }

    const apiBase = paypalApiBase.value().replace(/\/$/, '')
    const expectedPlanId = paypalPlanId.value()
    const clientId = paypalClientId.value()
    const secret = paypalSecret.value()

    if (!clientId || !secret) {
      logger.error('PayPal secrets ausentes en Functions')
      throw new HttpsError(
        'failed-precondition',
        'PayPal no está configurado en el servidor.'
      )
    }

    try {
      logger.info('Verificando suscripción PayPal', {
        uid,
        subscriptionId,
        apiBase,
      })

      const accessToken = await getPayPalAccessToken(apiBase, clientId, secret)
      const subscription = await fetchPayPalSubscription(
        apiBase,
        accessToken,
        subscriptionId
      )

      const status = subscription.status
      const planId = subscription.plan_id

      logger.info('Suscripción PayPal consultada', {
        uid,
        subscriptionId,
        status,
        planId,
      })

      if (status !== 'ACTIVE') {
        return {
          success: false,
          reason: `La suscripción no está ACTIVE (status: ${status || 'desconocido'}).`,
        }
      }

      if (planId !== expectedPlanId) {
        logger.warn('Plan ID no coincide', {
          expectedPlanId,
          planId,
          subscriptionId,
        })
        return {
          success: false,
          reason: 'El plan de la suscripción no coincide con el plan Premium.',
        }
      }

      const db = getFirestore()
      await db.doc(`users/${uid}`).set(
        {
          isPremium: true,
          premiumSource: 'paypal',
          paypalSubscriptionId: subscriptionId,
          premiumUpdatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      )

      logger.info('Usuario marcado premium vía PayPal', { uid, subscriptionId })

      return { success: true, isPremium: true }
    } catch (error) {
      if (error instanceof HttpsError) {
        throw error
      }

      logger.error('Error inesperado en verifyPayPalSubscription', {
        uid,
        subscriptionId,
        message: error?.message,
        stack: error?.stack,
      })

      throw new HttpsError(
        'internal',
        'Error al verificar la suscripción. Intenta de nuevo.'
      )
    }
  }
)

const HANDLED_SUBSCRIPTION_EVENTS = new Set([
  'BILLING.SUBSCRIPTION.ACTIVATED',
  'BILLING.SUBSCRIPTION.RE-ACTIVATED',
  'BILLING.SUBSCRIPTION.CANCELLED',
  'BILLING.SUBSCRIPTION.SUSPENDED',
  'BILLING.SUBSCRIPTION.EXPIRED',
  'PAYMENT.SALE.COMPLETED',
])

function readWebhookEvent(req) {
  try {
    if (req.rawBody && req.rawBody.length) {
      return JSON.parse(req.rawBody.toString('utf8'))
    }
  } catch (error) {
    logger.error('PayPal webhook: body JSON inválido', { message: error?.message })
    return null
  }

  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body
  }

  return null
}

function headerValue(req, name) {
  const value = req.get?.(name) || req.headers?.[name.toLowerCase()]
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * POST /v1/notifications/verify-webhook-signature
 * Devuelve true solo si PayPal responde verification_status === 'SUCCESS'.
 */
async function verifyPayPalWebhookSignature(apiBase, accessToken, webhookId, req, webhookEvent) {
  const payload = {
    auth_algo: headerValue(req, 'paypal-auth-algo'),
    cert_url: headerValue(req, 'paypal-cert-url'),
    transmission_id: headerValue(req, 'paypal-transmission-id'),
    transmission_sig: headerValue(req, 'paypal-transmission-sig'),
    transmission_time: headerValue(req, 'paypal-transmission-time'),
    webhook_id: webhookId,
    webhook_event: webhookEvent,
  }

  const missing = Object.entries(payload)
    .filter(([key, value]) => key !== 'webhook_event' && !value)
    .map(([key]) => key)

  if (missing.length) {
    logger.error('PayPal webhook: faltan datos para verificar la firma', { missing })
    return false
  }

  const response = await fetch(`${apiBase}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    logger.error('PayPal verify-webhook-signature falló', {
      status: response.status,
      body,
    })
    return false
  }

  if (body.verification_status !== 'SUCCESS') {
    logger.error('PayPal webhook: firma rechazada', {
      verification_status: body.verification_status || null,
      transmission_id: payload.transmission_id,
    })
    return false
  }

  return true
}

function subscriptionIdFromResource(eventType, resource) {
  if (eventType === 'PAYMENT.SALE.COMPLETED') {
    return String(resource?.billing_agreement_id || '').trim()
  }
  return String(resource?.id || '').trim()
}

function timestampFromPayPalDate(value) {
  if (typeof value !== 'string' || !value.trim()) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return Timestamp.fromDate(date)
}

/**
 * custom_id (uid) primero. Si no viene, busca paypalSubscriptionId.
 * En un pago renovado el id de la suscripción es billing_agreement_id, no resource.id.
 */
async function findPayPalUserRef(db, eventType, resource) {
  const customId = String(resource?.custom_id || '').trim()
  const subscriptionId = subscriptionIdFromResource(eventType, resource)

  if (customId) {
    return { uid: customId, subscriptionId, ref: db.doc(`users/${customId}`) }
  }

  const lookupId = subscriptionId || String(resource?.id || '').trim()
  if (!lookupId) return null

  const snap = await db
    .collection('users')
    .where('paypalSubscriptionId', '==', lookupId)
    .limit(1)
    .get()

  if (snap.empty) return null

  const docSnap = snap.docs[0]
  return { uid: docSnap.id, subscriptionId: lookupId, ref: docSnap.ref }
}

function premiumPatchForEvent(eventType, resource) {
  const paypalStatus = resource?.status || eventType

  if (
    eventType === 'BILLING.SUBSCRIPTION.ACTIVATED' ||
    eventType === 'BILLING.SUBSCRIPTION.RE-ACTIVATED' ||
    eventType === 'PAYMENT.SALE.COMPLETED'
  ) {
    return {
      isPremium: true,
      premiumExpiresAt: null,
      paypalStatus,
    }
  }

  if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED') {
    const premiumExpiresAt = timestampFromPayPalDate(resource?.billing_info?.next_billing_time)
    if (!premiumExpiresAt) {
      return { isPremium: false, premiumExpiresAt: null, paypalStatus }
    }
    return { isPremium: true, premiumExpiresAt, paypalStatus }
  }

  if (
    eventType === 'BILLING.SUBSCRIPTION.SUSPENDED' ||
    eventType === 'BILLING.SUBSCRIPTION.EXPIRED'
  ) {
    return { isPremium: false, premiumExpiresAt: null, paypalStatus }
  }

  return null
}

/**
 * Webhook PayPal: cancelaciones, suspensiones y renovaciones.
 * Público para que PayPal pueda llamarlo; la firma se verifica antes de escribir.
 */
exports.paypalWebhook = onRequest(
  {
    region: 'us-central1',
    secrets: [paypalClientId, paypalSecret],
    invoker: 'public',
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.set('Allow', 'POST')
      res.status(405).send('Method Not Allowed')
      return
    }

    const webhookId = paypalWebhookId.value().trim()
    if (!webhookId) {
      logger.error('PayPal webhook rechazado: PAYPAL_WEBHOOK_ID está vacío')
      res.status(400).send('Webhook no configurado')
      return
    }

    const webhookEvent = readWebhookEvent(req)
    if (!webhookEvent || typeof webhookEvent !== 'object') {
      logger.error('PayPal webhook rechazado: body vacío o inválido')
      res.status(400).send('Body inválido')
      return
    }

    const apiBase = paypalApiBase.value().replace(/\/$/, '')
    const clientId = paypalClientId.value()
    const secret = paypalSecret.value()

    if (!clientId || !secret) {
      logger.error('PayPal secrets ausentes en paypalWebhook')
      res.status(500).send('PayPal no configurado')
      return
    }

    let signatureOk = false
    try {
      const accessToken = await getPayPalAccessToken(apiBase, clientId, secret)
      signatureOk = await verifyPayPalWebhookSignature(
        apiBase,
        accessToken,
        webhookId,
        req,
        webhookEvent
      )
    } catch (error) {
      logger.error('PayPal webhook: error verificando firma', {
        message: error?.message,
      })
      res.status(400).send('No se pudo verificar la firma')
      return
    }

    if (!signatureOk) {
      res.status(400).send('Firma no válida')
      return
    }

    const eventType = webhookEvent.event_type
    if (!HANDLED_SUBSCRIPTION_EVENTS.has(eventType)) {
      res.status(200).json({ received: true })
      return
    }

    const resource = webhookEvent.resource || {}
    const patch = premiumPatchForEvent(eventType, resource)
    if (!patch) {
      res.status(200).json({ received: true })
      return
    }

    try {
      const db = getFirestore()
      const match = await findPayPalUserRef(db, eventType, resource)

      if (!match) {
        logger.error('PayPal webhook: usuario no encontrado', {
          eventType,
          eventId: webhookEvent.id || null,
          resourceId: resource.id || null,
          billingAgreementId: resource.billing_agreement_id || null,
        })
        res.status(200).json({ received: true, updated: false })
        return
      }

      const userSnap = await match.ref.get()
      const existingSub = userSnap.exists ? userSnap.data()?.paypalSubscriptionId : null
      if (existingSub && match.subscriptionId && existingSub !== match.subscriptionId) {
        logger.error('PayPal webhook: la suscripción no coincide con la del usuario', {
          uid: match.uid,
          eventType,
          existingSub,
          subscriptionId: match.subscriptionId,
        })
        res.status(200).json({ received: true, updated: false })
        return
      }

      await match.ref.set(
        {
          ...patch,
          ...(match.subscriptionId ? { paypalSubscriptionId: match.subscriptionId } : {}),
          premiumSource: 'paypal',
          premiumUpdatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      )

      logger.info('PayPal webhook aplicado', {
        uid: match.uid,
        eventType,
        isPremium: patch.isPremium,
        paypalStatus: patch.paypalStatus,
      })

      res.status(200).json({ received: true, updated: true })
    } catch (error) {
      logger.error('PayPal webhook: error actualizando Firestore', {
        eventType,
        message: error?.message,
      })
      res.status(500).send('Error al actualizar la suscripción')
    }
  }
)
