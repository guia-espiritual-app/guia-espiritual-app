export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#1a1a2e] text-purple-100">
      <div className="max-w-3xl mx-auto px-5 pt-10 pb-24">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-yellow-300 mb-2">Privacy Policy</h1>
          <p className="text-purple-200">
            This Privacy Policy describes how <span className="font-semibold">Guía Espiritual</span> (“we”, “our”, or
            “the app”) collects and uses information.
          </p>
        </header>

        <div className="space-y-6">
          <section className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-6">
            <h2 className="text-yellow-300 font-bold text-xl mb-3">Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2 text-purple-100 leading-relaxed">
              <li>
                <span className="font-semibold">Account information</span>: email address and (when provided) your name,
                used for authentication through Firebase.
              </li>
              <li>
                <span className="font-semibold">Premium subscription status</span>: information related to whether you
                have access to Premium features.
              </li>
              <li>
                <span className="font-semibold">App usage data you create</span>: content you voluntarily save in the
                app (for example, readings you choose to store), if applicable.
              </li>
            </ul>
          </section>

          <section className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-6">
            <h2 className="text-yellow-300 font-bold text-xl mb-3">How We Use It</h2>
            <ul className="list-disc pl-5 space-y-2 text-purple-100 leading-relaxed">
              <li>To create and manage your account and let you sign in securely.</li>
              <li>To provide core features of the app (Tarot, Horoscope, Numerology) and saved experiences.</li>
              <li>To enable and manage Premium access and related functionality.</li>
              <li>To maintain, protect, and improve the app (e.g., troubleshooting and security).</li>
            </ul>
          </section>

          <section className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-6">
            <h2 className="text-yellow-300 font-bold text-xl mb-3">Data Security</h2>
            <p className="text-purple-100 leading-relaxed">
              We take reasonable measures to protect your information. We use Firebase services that provide security
              features such as encrypted connections and access controls. However, no method of transmission or storage
              is 100% secure.
            </p>
          </section>

          <section className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-6">
            <h2 className="text-yellow-300 font-bold text-xl mb-3">Third Party Services (Firebase)</h2>
            <p className="text-purple-100 leading-relaxed mb-3">
              We use Google Firebase for authentication and database functionality. Firebase may process data on our
              behalf to provide these services.
            </p>
            <p className="text-purple-100 leading-relaxed">
              Learn more in Google’s documentation and privacy information for Firebase. (We do not sell your data and
              we do not share your personal data with third parties for advertising.)
            </p>
          </section>

          <section className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-6">
            <h2 className="text-yellow-300 font-bold text-xl mb-3">Your Rights</h2>
            <ul className="list-disc pl-5 space-y-2 text-purple-100 leading-relaxed">
              <li>You can access and update certain account details within the app.</li>
              <li>You can request deletion of your account data by contacting us.</li>
              <li>You may withdraw consent by stopping use of the app and requesting deletion.</li>
            </ul>
          </section>

          <section className="bg-purple-900/40 border-2 border-purple-500/60 rounded-2xl p-6">
            <h2 className="text-yellow-300 font-bold text-xl mb-3">Contact</h2>
            <p className="text-purple-100 leading-relaxed">
              If you have questions about this Privacy Policy or your data, contact us at:
            </p>
            <p className="text-purple-200 mt-2">
              <span className="text-yellow-300 font-semibold">Email:</span> support@guiaespiritual.app
            </p>
          </section>

          <section className="text-center text-purple-300 text-sm">
            <p>Last updated: {new Date().toISOString().slice(0, 10)}</p>
          </section>
        </div>
      </div>
    </div>
  )
}

