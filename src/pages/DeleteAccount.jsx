export default function DeleteAccount() {
  return (
    <div className="min-h-screen bg-[#1a1a2e] text-purple-100">
      <div className="max-w-3xl mx-auto px-5 pt-10 pb-24">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-yellow-300 mb-2">Eliminar mi cuenta</h1>
          <p className="text-purple-200">
            Si deseas eliminar tu cuenta y todos tus datos de <span className="font-semibold">Guía Espiritual</span>,
            envíanos un email con tu solicitud.
          </p>
        </header>

        <div className="space-y-6">
          <section className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-6">
            <h2 className="text-yellow-300 font-bold text-xl mb-3">Cómo solicitar la eliminación</h2>
            <ul className="list-disc pl-5 space-y-2 text-purple-100 leading-relaxed">
              <li>Envía un email desde la dirección registrada en la app solicitando la eliminación.</li>
              <li>Incluye en el asunto: “Eliminar cuenta - Guía Espiritual”.</li>
              <li>
                Si tienes más de un correo registrado, indica claramente cuál cuenta deseas eliminar (por ejemplo, tu email
                de acceso).
              </li>
            </ul>
          </section>

          <section className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-6">
            <h2 className="text-yellow-300 font-bold text-xl mb-3">Email de contacto</h2>
            <p className="text-purple-100 leading-relaxed">Puedes contactarnos en:</p>
            <p className="text-purple-200 mt-2">
              <span className="text-yellow-300 font-semibold">Email:</span> soporte.guiaespiritual@gmail.com
            </p>
          </section>

          <section className="text-center text-purple-300 text-sm">
            <p>Última actualización: {new Date().toISOString().slice(0, 10)}</p>
          </section>
        </div>
      </div>
    </div>
  )
}

