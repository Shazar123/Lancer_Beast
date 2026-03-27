export default function PrivacyPage() {
  return (
    <main
      className="min-h-screen py-20 px-6"
      style={{ background: "linear-gradient(135deg, #0F2D52 0%, #1A6B5A 100%)" }}
    >
      <div className="max-w-2xl mx-auto">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-10 transition-colors"
        >
          ← Back to LancerBeast
        </a>

        <h1
          className="text-4xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Privacy Policy
        </h1>
        <p className="text-white/50 text-sm mb-10">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="space-y-8 text-white/75 leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">What we collect</h2>
            <p>
              When you join the waitlist, we collect your email address. That is
              the only personal data we store during Phase 1.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">What we do not collect</h2>
            <p>
              LancerBeast does not collect, store, or transmit any data about
              the Upwork job pages you view. All job analysis happens locally in
              your browser. No job URLs, no client data, no analysis results are
              ever sent to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">How we use your email</h2>
            <p>
              We send one confirmation email when you join the waitlist. We send
              one email when the extension launches. We do not send marketing
              emails, newsletters, or promotional content.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Data storage</h2>
            <p>
              Your email address is stored in a server. Data is stored in the United States Server. We use industry-standard
              security practices including SSL/TLS encryption in transit.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Your rights</h2>
            <p>
              You can request deletion of your email address at any time by
              writing to{" "}
              <a
                href="mailto:hello@lancerbeast.com"
                className="text-mint hover:underline"
              >
                hello@lancerbeast.com
              </a>
              . We will delete your record within 7 days of receiving your
              request.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Contact</h2>
            <p>
              For any privacy questions, email{" "}
              <a
                href="mailto:hello@lancerbeast.com"
                className="text-mint hover:underline"
              >
                hello@lancerbeast.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
