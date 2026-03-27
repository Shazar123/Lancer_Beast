"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const MAX_SPOTS = 50;
const INITIAL_COUNT = 6;

function generateSessionId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("lb_sid");
  if (!id) {
    id = generateSessionId();
    sessionStorage.setItem("lb_sid", id);
  }
  return id;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy/80 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span
          style={{ fontFamily: "var(--font-display)" }}
          className="text-xl font-bold text-white tracking-tight"
        >
          LancerBeast 🦁
        </span>
        <a
          href="#waitlist"
          className="text-sm font-semibold text-mint hover:text-white transition-colors"
        >
          Get early access →
        </a>
      </div>
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({
  signupCount,
  onSuccess,
}: {
  signupCount: number;
  onSuccess: (spot: number) => void;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "full" | "error" | "duplicate"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const isFull = signupCount >= MAX_SPOTS;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.status === "full") {
        setState("full");
      } else if (data.status === "success") {
        setState("success");
        onSuccess(data.spot);
      } else if (res.status === 409) {
        setState("duplicate");
      } else {
        setState("error");
        setErrorMsg(data.error || "Something went wrong.");
      }
    } catch {
      setState("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  const spotsLeft = MAX_SPOTS - signupCount;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0F2D52 0%, #1A6B5A 100%)" }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "#2DD4BF" }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "#0F2D52" }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(45,212,191,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Badge */}
        <div className="animate-fade-in delay-100 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
          <span className="text-sm font-medium text-white/90">
            {isFull
              ? "All 50 spots taken"
              : `${spotsLeft} of 50 spots remaining`}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up delay-200 text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Stop wasting connects on jobs that{" "}
          <em className="not-italic shimmer-text">won&apos;t hire you.</em>
        </h1>

        {/* Sub */}
        <p className="animate-fade-up delay-300 text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
          LancerBeast analyzes every Upwork job in milliseconds — scam
          detection, client trust score, and your personal hire probability.{" "}
          <strong className="text-white font-semibold">Before you bid.</strong>
        </p>

        {/* Form */}
        <div id="waitlist" className="animate-fade-up delay-400 max-w-md mx-auto">
          {isFull || state === "full" ? (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
              <p className="text-2xl mb-2">😔</p>
              <p className="text-white font-semibold text-lg">We are full.</p>
              <p className="text-white/60 text-sm mt-1">
                All 50 founding spots have been claimed.
              </p>
            </div>
          ) : state === "success" ? (
            <div className="bg-teal/20 border border-mint/30 rounded-2xl p-6 text-center">
              <p className="text-3xl mb-3">🦁</p>
              <p className="text-white font-bold text-xl mb-1">
                You&apos;re in!
              </p>
              <p className="text-white/70 text-sm">
                Check your inbox, we sent you a confirmation. We&apos;ll email
                you the moment LancerBeast launches.
              </p>
            </div>
          ) : state === "duplicate" ? (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
              <p className="text-2xl mb-2">✓</p>
              <p className="text-white font-semibold">
                You&apos;re already on the list.
              </p>
              <p className="text-white/60 text-sm mt-1">
                We&apos;ll email you when we launch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-white/10 backdrop-blur-sm border border-white/25 rounded-xl px-4 py-3.5 text-white placeholder-white/40 text-sm outline-none focus:border-mint/60 focus:bg-white/15 transition-all"
                />
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="relative overflow-hidden rounded-xl px-6 py-3.5 font-semibold text-sm text-white whitespace-nowrap transition-all hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, #1A6B5A 0%, #2DD4BF 100%)",
                    boxShadow: "0 0 20px rgba(45,212,191,0.3)",
                  }}
                >
                  {state === "loading" ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Joining…
                    </span>
                  ) : (
                    "Join the Waitlist"
                  )}
                </button>
              </div>

              {(state === "error") && (
                <p className="text-red-300 text-xs text-center">{errorMsg}</p>
              )}
            </form>
          )}

          {/* Honest founder line */}
          <p className="animate-fade-up delay-500 mt-4 text-white/45 text-xs text-center leading-relaxed">
            Built by a freelancer who lost $400 in connects before building
            this.
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <span className="text-white/60 text-xs">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}

// ─── Pain Section ─────────────────────────────────────────────────────────────
function PainSection() {
  return (
    <section
      className="py-24 px-6"
      style={{ background: "linear-gradient(180deg, #0a2340 0%, #0d1f35 100%)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold tracking-[3px] uppercase text-mint mb-4">
            Sound familiar?
          </span>
          <h2
            className="text-4xl sm:text-5xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            You already knew something was off.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {/* Case 1 */}
          <div className="group relative bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-2xl p-8 transition-all duration-300">
            <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-red-500/20 border border-red-400/30 flex items-center justify-center">
              <span className="text-sm">👻</span>
            </div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-red-400 mb-4">
              Ghost Job
            </span>
            <p className="text-white/75 leading-relaxed text-base">
              You spend{" "}
              <strong className="text-white">16 connects on a job.</strong>{" "}
              Write a perfect proposal. Wait a week. Nothing. The client
              hasn&apos;t hired anyone in 2 years. The job description was 12
              words.{" "}
              <em className="text-white/90 not-italic font-medium">
                You knew something was off but bid anyway.
              </em>
            </p>
            <div className="mt-6 pt-5 border-t border-white/8">
              <p className="text-xs text-red-400/80 font-medium">
                Cost: 16 connects · $2.40 lost · 0% chance of hire
              </p>
            </div>
          </div>

          {/* Case 2 */}
          <div className="group relative bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-2xl p-8 transition-all duration-300">
            <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-400/30 flex items-center justify-center">
              <span className="text-sm">🚨</span>
            </div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-yellow-400 mb-4">
              Scam Job
            </span>
            <p className="text-white/75 leading-relaxed text-base">
              You get a message after bidding. They want you on{" "}
              <strong className="text-white">Telegram.</strong> They have a
              small test task first. Unpaid. You&apos;ve seen this before.{" "}
              <em className="text-white/90 not-italic font-medium">
                LancerBeast would have flagged it before you spent 12 connects.
              </em>
            </p>
            <div className="mt-6 pt-5 border-t border-white/8">
              <p className="text-xs text-yellow-400/80 font-medium">
                Cost: 12 connects · $1.80 lost · Hard red flag missed
              </p>
            </div>
          </div>
        </div>

        {/* Data point */}
        <div
          className="relative rounded-2xl p-8 sm:p-10 text-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(26,107,90,0.3) 0%, rgba(45,212,191,0.1) 100%)",
            border: "1px solid rgba(45,212,191,0.2)",
          }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, #2DD4BF 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <p
            className="relative text-2xl sm:text-3xl font-bold text-white leading-snug"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-mint">286 jobs posted.</span> 62% hire rate.{" "}
            $329K spent.
          </p>
          <p className="relative mt-3 text-white/60 text-base sm:text-lg">
            That data is on every Upwork page. You just can&apos;t read it fast
            enough.
          </p>
          <p className="relative mt-2 text-sm text-mint/70 font-medium">
            LancerBeast reads it in under 100ms. Before you bid.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "🔍",
    title: "Client Trust Score",
    desc: "Know if this client is real before you bid.",
    detail:
      "0–100 score built from payment verification, spend history, hire rate, rating, and account age.",
    color: "from-blue-500/20 to-blue-400/5",
    border: "border-blue-400/20",
    tag: "blue",
  },
  {
    icon: "🚨",
    title: "Scam Detector",
    desc: "We read the signals you miss.",
    detail:
      "Hard red flags (Telegram, deposits, unpaid tasks) + soft yellow flags, combined into a verdict.",
    color: "from-red-500/20 to-red-400/5",
    border: "border-red-400/20",
    tag: "red",
  },
  {
    icon: "📊",
    title: "Your Hire Probability",
    desc: "Personalized to your profile and rate.",
    detail:
      "Matches your badge, rate, skills, and availability against each job's specific requirements.",
    color: "from-teal/30 to-teal/5",
    border: "border-teal/30",
    tag: "teal",
  },
  {
    icon: "💰",
    title: "Connects ROI Calculator",
    desc: "Know exactly what this bid is worth before you click send.",
    detail:
      "Expected dollar return vs. connect cost. Clear bid/skip verdict on every single job.",
    color: "from-yellow-500/20 to-yellow-400/5",
    border: "border-yellow-400/20",
    tag: "yellow",
  },
];

function FeaturesSection() {
  return (
    <section
      className="py-24 px-6"
      style={{ background: "linear-gradient(180deg, #0d1f35 0%, #0F2D52 100%)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold tracking-[3px] uppercase text-mint mb-4">
            Four weapons
          </span>
          <h2
            className="text-4xl sm:text-5xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything you need to bid smarter.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className={`group relative bg-gradient-to-br ${f.color} border ${f.border} rounded-2xl p-7 hover:scale-[1.02] transition-all duration-300 cursor-default`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{f.icon}</span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/30 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                  Coming soon
                </span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/80 font-medium text-base mb-3">
                {f.desc}
              </p>
              <p className="text-white/45 text-sm leading-relaxed">{f.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Urgency Section ──────────────────────────────────────────────────────────
function UrgencySection({
  signupCount,
  visitors,
}: {
  signupCount: number;
  visitors: number;
}) {
  const spotsLeft = Math.max(0, MAX_SPOTS - signupCount);
  const pct = Math.min(100, (signupCount / MAX_SPOTS) * 100);
  const isFull = signupCount >= MAX_SPOTS;

  return (
    <section
      className="py-24 px-6"
      style={{
        background: "linear-gradient(135deg, #0F2D52 0%, #1A6B5A 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block text-xs font-bold tracking-[3px] uppercase text-mint mb-6">
          Founding offer
        </span>
        <h2
          className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          First 50 freelancers get LancerBeast{" "}
          <span className="shimmer-text">free & forever.</span>
        </h2>
        <p className="text-white/65 text-lg mb-12">
          No credit card. No trial. No catch. You get the Pro version, free,
          for life.
        </p>

        {/* Progress bar */}
        <div className="bg-white/10 border border-white/15 rounded-2xl p-8 mb-8">
          <div className="flex justify-between items-end mb-3">
            <span className="text-white font-bold text-2xl">
              {isFull ? "Full" : `${spotsLeft} spots left`}
            </span>
            <span className="text-white/50 text-sm">
              {signupCount} / 50 claimed
            </span>
          </div>

          <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-4">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, #1A6B5A, #2DD4BF)",
                boxShadow: "0 0 12px rgba(45,212,191,0.5)",
              }}
            />
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            <span>
              {visitors > 0
                ? `${visitors} freelancer${visitors !== 1 ? "s" : ""} viewing this right now`
                : "Live — people are joining"}
            </span>
          </div>
        </div>

        <a
          href="#waitlist"
          className="inline-block rounded-xl px-10 py-4 font-bold text-base text-white transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
          style={{
            background: "linear-gradient(135deg, #1A6B5A 0%, #2DD4BF 100%)",
            boxShadow: "0 0 30px rgba(45,212,191,0.35)",
          }}
        >
          {isFull ? "Waitlist is closed" : "Claim your free spot →"}
        </a>

        <p className="mt-4 text-white/35 text-xs">
          Already {signupCount} freelancers joined. No spam. One launch email.
        </p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="py-12 px-6 border-t border-white/10"
      style={{ background: "#080f1e" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p
              className="text-white font-bold text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              LancerBeast 🦁
            </p>
            <p className="text-white/40 text-sm mt-0.5">
              Stop wasting connects.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <a
              href="/privacy"
              className="hover:text-white/80 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="mailto:hello@lancerbeast.com"
              className="hover:text-white/80 transition-colors"
            >
              hello@lancerbeast.com
            </a>
          </div>
        </div>
        <p className="text-center text-white/20 text-xs mt-8">
          © {new Date().getFullYear()} LancerBeast. Built for Upwork
          freelancers.
        </p>
      </div>
    </footer>
  );
}

// ─── Success Toast ────────────────────────────────────────────────────────────
function SuccessToast({ spot, onClose }: { spot: number; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-fade-up">
      <div
        className="rounded-2xl p-5 shadow-2xl border border-mint/30"
        style={{
          background: "linear-gradient(135deg, #1A6B5A, #0F2D52)",
        }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">🦁</span>
          <div>
            <p className="text-white font-bold text-sm">
              You&apos;re spot #{spot}!
            </p>
            <p className="text-white/65 text-xs mt-0.5">
              Confirmation email sent. We&apos;ll email you on launch day.
            </p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white ml-auto text-lg leading-none">
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [signupCount, setSignupCount] = useState(INITIAL_COUNT);
  const [visitors, setVisitors] = useState(0);
  const [successSpot, setSuccessSpot] = useState<number | null>(null);
  const sessionIdRef = useRef<string>("");

  // Init session id
  useEffect(() => {
    sessionIdRef.current = getSessionId();
  }, []);

  // Fetch real signup count
  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/api/waitlist/count");
      const data = await res.json();
      if (typeof data.count === "number") {
        setSignupCount(Math.max(INITIAL_COUNT, data.count));
      }
    } catch {}
  }, []);

  // Fetch visitor count
  const fetchVisitors = useCallback(async () => {
    try {
      const res = await fetch("/api/visitors/count");
      const data = await res.json();
      if (typeof data.count === "number") {
        setVisitors(data.count);
      }
    } catch {}
  }, []);

  // Ping visitor
  const pingVisitor = useCallback(async () => {
    if (!sessionIdRef.current) return;
    try {
      await fetch("/api/visitors/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current }),
      });
    } catch {}
  }, []);

  useEffect(() => {
    fetchCount();
    pingVisitor();
    fetchVisitors();

    const countInterval = setInterval(fetchCount, 30000);
    const pingInterval = setInterval(pingVisitor, 30000);
    const visitorInterval = setInterval(fetchVisitors, 30000);

    return () => {
      clearInterval(countInterval);
      clearInterval(pingInterval);
      clearInterval(visitorInterval);
    };
  }, [fetchCount, pingVisitor, fetchVisitors]);

  function handleSuccess(spot: number) {
    setSuccessSpot(spot);
    fetchCount();
  }

  return (
    <main className="relative">
      <Navbar />
      <HeroSection signupCount={signupCount} onSuccess={handleSuccess} />
      <PainSection />
      <FeaturesSection />
      <UrgencySection signupCount={signupCount} visitors={visitors} />
      <Footer />

      {successSpot !== null && (
        <SuccessToast spot={successSpot} onClose={() => setSuccessSpot(null)} />
      )}
    </main>
  );
}
