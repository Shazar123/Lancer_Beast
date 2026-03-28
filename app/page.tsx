"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const MAX_SPOTS = 50;

function generateSessionId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("lb_sid");
  if (!id) { id = generateSessionId(); sessionStorage.setItem("lb_sid", id); }
  return id;
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ signupCount }: { signupCount: number }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const spotsLeft = Math.max(0, MAX_SPOTS - signupCount);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#060e1c]/90 backdrop-blur-xl border-b border-white/8 shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-white tracking-tight">
          LancerBeast 🦁
        </span>
        <div className="flex items-center gap-3">
          {spotsLeft > 0 && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-mint/80 bg-mint/10 border border-mint/20 rounded-full px-3 py-1">
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-mint inline-block" />
              {spotsLeft} spots left
            </span>
          )}
          <a href="#waitlist"
            className="text-sm font-bold px-4 py-2 rounded-lg text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg,#1A6B5A,#2DD4BF)", boxShadow: "0 0 16px rgba(45,212,191,0.3)" }}>
            Get free access
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection({ signupCount, onSuccess }: { signupCount: number; onSuccess: (spot: number) => void }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle"|"loading"|"success"|"full"|"error"|"duplicate">("idle");
  const [errMsg, setErrMsg] = useState("");
  const isFull = signupCount >= MAX_SPOTS;
  const spotsLeft = Math.max(0, MAX_SPOTS - signupCount);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading"); setErrMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.status === "full") setState("full");
      else if (data.status === "success") { setState("success"); onSuccess(data.spot); }
      else if (res.status === 409) setState("duplicate");
      else { setState("error"); setErrMsg(data.error || "Something went wrong."); }
    } catch { setState("error"); setErrMsg("Network error. Please try again."); }
  }

  return (
    <section id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-14 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a1f3d 0%, #0d2d24 60%, #091a2e 100%)" }}>

      <div className="blob-a absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle,#2DD4BF,#1A6B5A)" }} />
      <div className="blob-b absolute bottom-1/4 -right-40 w-[420px] h-[420px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle,#0F2D52,#1A6B5A)" }} />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(45,212,191,1) 1px,transparent 1px),linear-gradient(90deg,rgba(45,212,191,1) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="animate-fade-in delay-100 inline-flex items-center gap-2 bg-white/8 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 mb-7">
          <span className="live-dot w-2 h-2 rounded-full bg-mint inline-block" />
          <span className="text-sm font-medium text-white/85">
            {isFull ? "All 50 founding spots claimed" : `Only ${spotsLeft} of 50 free spots remaining`}
          </span>
        </div>

        <h1 className="animate-fade-up delay-200 text-5xl sm:text-6xl lg:text-[72px] font-bold text-white mb-5 leading-[1.04] tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}>
          Stop spending{" "}
          <em className="not-italic shimmer-text">$100s of connects</em>
          {" "}on jobs that won&apos;t hire you.
        </h1>

        <p className="animate-fade-up delay-300 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
          LancerBeast analyzes every Upwork job in milliseconds. Scam detection, client trust score,
          and your personal hire probability.{" "}
          <strong className="text-white font-semibold">Before you spend a single connect.</strong>
        </p>

        <div className="animate-fade-up delay-400 flex flex-wrap justify-center gap-10 mb-9">
         {[{ val: "100ms", label: "Analysis speed ⚡" }, { val: "$0", label: "Cost for first 50 🎁" }, { val: "4", label: "Protection layers 🛡️" }].map((s) => (
            <div key={s.val} className="text-center">
              <p className="text-2xl font-bold text-mint" style={{ fontFamily: "var(--font-display)" }}>{s.val}</p>
              <p className="text-xs text-white/45 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div id="waitlist" className="animate-fade-up delay-500 max-w-md mx-auto">
          {isFull || state === "full" ? (
            <div className="bg-white/8 border border-white/15 rounded-2xl p-6 text-center">
              <p className="text-white font-bold text-lg">We are full</p>
              <p className="text-white/55 text-sm mt-1">All 50 founding spots have been claimed.</p>
            </div>
          ) : state === "success" ? (
            <div className="border border-mint/30 rounded-2xl p-6 text-center"
              style={{ background: "linear-gradient(135deg,rgba(26,107,90,0.3),rgba(45,212,191,0.1))" }}>
              <p className="text-4xl mb-3">🦁</p>
              <p className="text-white font-bold text-xl mb-1">You&apos;re in. Welcome to LancerBeast.</p>
              <p className="text-white/65 text-sm">Check your inbox. We&apos;ll email you the moment the extension launches. Your spot is locked in free forever.</p>
            </div>
          ) : state === "duplicate" ? (
            <div className="bg-white/8 border border-white/15 rounded-2xl p-5 text-center">
              <p className="text-white font-semibold">You&apos;re already on the list.</p>
              <p className="text-white/55 text-sm mt-1">We&apos;ll email you on launch day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="flex-1 bg-white/8 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3.5 text-black placeholder-gray-400 text-sm outline-none focus:border-mint/50 focus:bg-white/12 transition-all" />
                <button type="submit" disabled={state === "loading"}
                  className="relative overflow-hidden rounded-xl px-6 py-3.5 font-bold text-sm text-white whitespace-nowrap transition-all hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#1A6B5A,#2DD4BF)", boxShadow: "0 0 24px rgba(45,212,191,0.35)" }}>
                  {state === "loading" ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Joining...
                    </span>
                  ) : "Claim My Free Spot"}
                </button>
              </div>
              {state === "error" && <p className="text-red-300 text-xs text-center">{errMsg}</p>}
            </form>
          )}
          <p className="mt-3 text-white/35 text-xs text-center">🔒 No credit card. No trial. No spam. One launch email only.</p>
          <p className="mt-1 text-mint/60 text-xs text-center font-medium">First 50 get Pro access free & forever.</p>
        </div>
      </div>
    </section>
  );
}

// ─── Marquee trust strip ────────────────────────────────────────────────────────
function TrustStrip() {
  const items = [
    "No automation", "Your data stays private", "Upwork ToS compliant",
    "Under 100ms analysis", "No Upwork account risk", "Works globally",
    "Free for founding 50", "Built by a freelancer for freelancers",
    "Zero data stored on server", "Personalized hire probability",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-3 border-y border-white/6" style={{ background: "rgba(45,212,191,0.04)" }}>
      <div className="marquee-track flex gap-10 w-max">
        {doubled.map((item, i) => (
          <span key={i} className="text-sm text-white/40 font-medium shrink-0">— {item}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Pain ──────────────────────────────────────────────────────────────────────
function PainSection() {
  return (
    <section className="py-14 px-6" style={{ background: "linear-gradient(180deg,#060e1c 0%,#091524 100%)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-9 reveal">
          <span className="inline-block text-xs font-bold tracking-[3px] uppercase text-mint mb-3">Sound familiar</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            You already knew something was off.
          </h2>
          <p className="text-white/50 mt-2 text-lg">But you bid anyway. That ends today.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="reveal reveal-delay-1 glow-card bg-gradient-to-br from-red-900/20 to-red-800/5 border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">👻</span>
              <span className="text-xs font-bold tracking-widest uppercase text-red-400">Ghost Job</span>
            </div>
            <p className="text-white/75 leading-relaxed text-sm">
              You spend <strong className="text-white">16 connects</strong> on a job. Write a perfect proposal. Wait a week. Nothing.
              The client hasn&apos;t hired anyone in 2 years. Job description was 12 words.{" "}
              <em className="text-white/90 not-italic font-medium">You knew something was off but bid anyway.</em>
            </p>
            <div className="mt-4 pt-4 border-t border-red-500/15 flex items-center justify-between">
              <span className="text-xs text-red-400/80 font-medium">$2.40 wasted. 0% hire chance.</span>
              <span className="text-xs bg-red-500/20 text-red-300 rounded-full px-2.5 py-0.5 font-medium">Preventable</span>
            </div>
          </div>

          <div className="reveal reveal-delay-2 glow-card bg-gradient-to-br from-yellow-900/20 to-yellow-800/5 border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🚨</span>
              <span className="text-xs font-bold tracking-widest uppercase text-yellow-400">Scam Job</span>
            </div>
            <p className="text-white/75 leading-relaxed text-sm">
              You get a message after bidding. They want you on <strong className="text-white">Telegram</strong>.
              They have a small test task first. Unpaid.{" "}
              <em className="text-white/90 not-italic font-medium">LancerBeast would have flagged it before you spent 12 connects.</em>
            </p>
            <div className="mt-4 pt-4 border-t border-yellow-500/15 flex items-center justify-between">
              <span className="text-xs text-yellow-400/80 font-medium">$1.80 wasted. Hard red flag.</span>
              <span className="text-xs bg-yellow-500/20 text-yellow-300 rounded-full px-2.5 py-0.5 font-medium">Preventable</span>
            </div>
          </div>
        </div>

        <div className="reveal glow-card relative rounded-2xl p-7 sm:p-9 text-center border border-mint/15"
          style={{ background: "linear-gradient(135deg,rgba(26,107,90,0.25),rgba(45,212,191,0.08))" }}>
          <div className="absolute inset-0 rounded-2xl opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle at 50% 50%,#2DD4BF 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
          <p className="relative text-2xl sm:text-3xl font-bold text-white leading-snug" style={{ fontFamily: "var(--font-display)" }}>
            <span className="text-mint">286 jobs posted.</span> 62% hire rate. $329K spent.
          </p>
          <p className="relative mt-2 text-white/55 text-base sm:text-lg">
            That data is on every Upwork page. You just can&apos;t read it fast enough.
          </p>
          <p className="relative mt-2 text-sm text-mint font-semibold">
            LancerBeast reads it in under 100ms. Before you bid.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: "🔍", title: "Client Trust Score", desc: "Know if this client is real before you bid.", detail: "0 to 100 score from payment verification, spend history, hire rate, rating, and account age. Scammy clients score below 30.", color: "from-blue-600/15 to-blue-500/3", border: "border-blue-400/20" },
  { icon: "🚨", title: "Scam Detector", desc: "We read the signals you miss.", detail: "Hard red flags like Telegram requests, deposit demands, unpaid test tasks. Soft yellow flags. Combined into one clear verdict.", color: "from-red-600/15 to-red-500/3", border: "border-red-400/20" },
  { icon: "📊", title: "Your Hire Probability", desc: "Personalized to your profile and rate.", detail: "Matches your badge level, hourly rate, skills, and availability against each job. Your results differ from every other freelancer.", color: "from-teal-600/20 to-teal-500/3", border: "border-teal/25" },
  { icon: "💰", title: "Connects ROI Calculator", desc: "Know exactly what this bid is worth.", detail: "Expected dollar return vs connect cost. A $300 job at 20% probability returns $60 expected vs $1.20 spent. Crystal clear.", color: "from-yellow-600/15 to-yellow-500/3", border: "border-yellow-400/20" },
];

function FeaturesSection() {
  return (
    <section className="py-14 px-6" style={{ background: "linear-gradient(180deg,#091524 0%,#060e1c 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-9 reveal">
          <span className="inline-block text-xs font-bold tracking-[3px] uppercase text-mint mb-3">Four weapons</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            Everything you need to bid smarter.
          </h2>
          <p className="text-white/45 mt-2 max-w-xl mx-auto text-sm">
            Every feature runs locally in your browser. Nothing is sent to our servers.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className={`reveal reveal-delay-${i + 1} glow-card bg-gradient-to-br ${f.color} border ${f.border} rounded-2xl p-6`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{f.icon}</span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/30 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                  Coming soon
                </span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{f.title}</h3>
              <p className="text-white/80 font-semibold text-sm mb-2">{f.desc}</p>
              <p className="text-white/45 text-xs leading-relaxed">{f.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Savings ───────────────────────────────────────────────────────────────────
function SavingsSection() {
  return (
    <section className="py-14 px-6" style={{ background: "linear-gradient(135deg,#070f1e 0%,#0d2620 100%)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-9 reveal">
          <span className="inline-block text-xs font-bold tracking-[3px] uppercase text-mint mb-3">Real numbers</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            How much LancerBeast saves you.
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Wasted daily", before: "$3.60", after: "$0", note: "3 ghost bids per day on average" },
            { label: "Wasted monthly", before: "$108", after: "$5", note: "vs $5 per month Pro plan" },
            { label: "Wasted yearly", before: "$1,296", after: "$60", note: "and get hired more often" },
          ].map((s, i) => (
            <div key={i} className={`reveal reveal-delay-${i+1} glow-card bg-white/4 border border-white/8 rounded-2xl p-5 text-center`}>
              <p className="text-xs text-white/35 uppercase tracking-widest mb-3">{s.label}</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-red-400/80 line-through text-lg font-bold">{s.before}</span>
                <span className="text-white/25 text-sm">to</span>
                <span className="text-mint font-bold text-2xl">{s.after}</span>
              </div>
              <p className="text-white/30 text-xs">{s.note}</p>
            </div>
          ))}
        </div>

        <div className="reveal glow-card border border-mint/15 rounded-2xl p-6 sm:p-8"
          style={{ background: "linear-gradient(135deg,rgba(26,107,90,0.2),rgba(9,21,36,0.8))" }}>
          <h3 className="text-white font-bold text-xl mb-5" style={{ fontFamily: "var(--font-display)" }}>
            Real scenario — Before vs After
          </h3>
          <div className="grid sm:grid-cols-2 gap-5 text-sm">
            <div className="bg-red-900/15 border border-red-500/15 rounded-xl p-5">
              <p className="text-red-400 font-bold text-base mb-3">Without LancerBeast</p>
              <ul className="space-y-1.5 text-white/60">
                <li>Bid on 10 jobs today. 3 are ghost jobs.</li>
                <li>3 are scams you could not detect.</li>
                <li>2 jobs do not match your profile at all.</li>
                <li>Only 2 were real, relevant jobs.</li>
                <li className="text-red-400 font-semibold pt-1">80 connects burned. $12 wasted. 0 interviews.</li>
              </ul>
            </div>
            <div className="bg-teal/10 border border-mint/20 rounded-xl p-5">
              <p className="text-mint font-bold text-base mb-3">With LancerBeast</p>
              <ul className="space-y-1.5 text-white/60">
                <li>Open job. Trust score: 85. Clean client.</li>
                <li>Scam score: 5. No red flags detected.</li>
                <li>Hire probability: 74%. 3 of 4 skills match.</li>
                <li>ROI: Spend $1.20. Expected return $111.</li>
                <li className="text-mint font-semibold pt-1">16 connects used. Only on real opportunities.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Who ───────────────────────────────────────────────────────────────────────
function WhoSection() {
  const tiers = [
    { icon: "🌱", badge: "New Freelancers", desc: "Every connect matters when you are starting out. Stop burning your budget on jobs that will never respond.", highlight: "Most critical" },
    { icon: "⭐", badge: "Rising Talent", desc: "You are building momentum. Do not let ghost jobs and scam listings slow you down right when things are going well.", highlight: "High impact" },
    { icon: "🏆", badge: "Top Rated", desc: "You bid on premium jobs. One scam or ghost listing wastes more money for you than anyone. Protect your connect budget.", highlight: "Saves most" },
    { icon: "💎", badge: "Top Rated Plus", desc: "You charge premium rates. LancerBeast confirms whether a client can actually afford you before you spend a single connect.", highlight: "Elite protection" },
    { icon: "🏢", badge: "Agencies", desc: "Multiple team members bidding every day. A few bad hires cost thousands. LancerBeast is your team quality filter.", highlight: "Team scale" },
    { icon: "🌍", badge: "Global Freelancers", desc: "For freelancers in Pakistan, India, Bangladesh, Philippines and everywhere else where $2 per wasted bid has real financial weight.", highlight: "Built for you" },
  ];
  return (
    <section className="py-14 px-6" style={{ background: "linear-gradient(180deg,#060e1c 0%,#091524 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-9 reveal">
          <span className="inline-block text-xs font-bold tracking-[3px] uppercase text-mint mb-3">For everyone on Upwork</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            LancerBeast works for all freelancers.
          </h2>
          <p className="text-white/45 mt-2">Whether you are just starting or billing $200 per hour, wasted connects hurt everyone.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiers.map((t, i) => (
            <div key={i} className={`reveal reveal-delay-${(i % 3) + 1} glow-card bg-white/4 border border-white/8 hover:border-mint/25 rounded-2xl p-5 transition-all`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{t.icon}</span>
                <span className="text-[10px] font-bold text-mint/70 bg-mint/10 border border-mint/20 rounded-full px-2.5 py-0.5">
                  {t.highlight}
                </span>
              </div>
              <h3 className="text-white font-bold text-base mb-1.5">{t.badge}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Urgency ───────────────────────────────────────────────────────────────────
function UrgencySection({ signupCount, visitors }: { signupCount: number; visitors: number }) {
  const spotsLeft = Math.max(0, MAX_SPOTS - signupCount);
  const pct = Math.min(100, (signupCount / MAX_SPOTS) * 100);
  const isFull = signupCount >= MAX_SPOTS;
  return (
    <section className="py-14 px-6" style={{ background: "linear-gradient(135deg,#0a1f3d 0%,#0d2d24 100%)" }}>
      <div className="max-w-3xl mx-auto text-center">
        <div className="reveal">
          <span className="inline-block text-xs font-bold tracking-[3px] uppercase text-mint mb-4">Founding offer</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            First 50 freelancers get LancerBeast{" "}
            <span className="shimmer-text">free forever.</span>
          </h2>
          <p className="text-white/55 text-lg mb-7">
            No credit card. No trial period. No catch. You get the full Pro version for life.
          </p>
        </div>

        <div className="reveal glow-card bg-white/5 border border-white/10 rounded-2xl p-6 mb-5">
          <div className="flex justify-between items-end mb-3">
            <span className="text-white font-bold text-2xl">
              {isFull ? "Closed" : `${spotsLeft} spots left`}
            </span>
            <span className="text-white/40 text-sm">{signupCount} of 50 claimed</span>
          </div>
          <div className="relative h-3 bg-white/8 rounded-full overflow-hidden mb-3">
            <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg,#1A6B5A,#2DD4BF)", boxShadow: "0 0 14px rgba(45,212,191,0.5)" }} />
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-white/45">
            <span className="live-dot w-2 h-2 rounded-full bg-mint inline-block" />
            <span>
              {visitors > 0
                ? `${visitors} freelancer${visitors !== 1 ? "s" : ""} on this page right now`
                : "Freelancers joining from around the world"}
            </span>
          </div>
        </div>

        <div className="reveal">
          <a href="#waitlist"
            className="inline-block rounded-xl px-10 py-4 font-bold text-base text-white transition-all hover:scale-105 hover:shadow-2xl active:scale-95 mb-3"
            style={{ background: "linear-gradient(135deg,#1A6B5A,#2DD4BF)", boxShadow: "0 0 40px rgba(45,212,191,0.3)" }}>
            {isFull ? "Waitlist is closed" : "Claim My Free Spot"}
          </a>
          <p className="text-white/25 text-xs">
            Already {signupCount} freelancers joined. Zero spam. One launch email.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ── fixed: no overflow-hidden on wrapper, height driven by grid rows ──
const FAQS = [
  {
    q: "Who built LancerBeast?",
    a: "LancerBeast was built by a Top Rated Upwork freelancer who was losing around $80 a month on wasted connects and could not land consistent jobs. After analyzing hundreds of job listings manually, the patterns became crystal clear: ghost clients, scam listings, and mismatched profiles. Instead of staying frustrated, we built the tool we wished existed. No VC funding. No corporate agenda. Just a freelancer who understands the pain firsthand.",
  },
  {
    q: "Will this extension get my Upwork account banned?",
    a: "No. LancerBeast is fully compliant with Upwork Terms of Service. We do not automate any actions, you navigate normally and we only read what is already visible on your screen. We do not store any job listing data on our servers. Everything is analyzed locally in your browser and discarded when you leave the page. We do not scrape Upwork or make API calls to Upwork in any way. Think of it like a very fast, very smart friend reading over your shoulder while you browse.",
  },
  {
    q: "How exactly will this help me get more jobs?",
    a: "LancerBeast helps in three ways. First, you stop wasting connects on jobs with zero chance of hiring, saving $80 to $120 per month. Second, your proposal to interview ratio improves because you only bid on jobs that match your profile. A 74% hire probability job is worth five times more effort than a 15% probability job. Third, you avoid scams and ghost clients entirely. One freelancer in our beta went from a 6% response rate to a 34% response rate simply by filtering out low-probability jobs.",
  },
  {
    q: "Who can use LancerBeast?",
    a: "Every type of Upwork freelancer benefits. New freelancers and Rising Talent where every connect is precious. Top Rated and Top Rated Plus freelancers who bid on premium jobs. Agencies whose teams bid on dozens of jobs daily. Global freelancers in Pakistan, India, Bangladesh, Philippines and everywhere else where $2 per wasted bid carries real financial weight. If you have ever looked at a job and thought 'Will this client actually hire me?' before clicking Propose, LancerBeast was built for you.",
  },
  {
    q: "What exactly do the first 50 users get for free?",
    a: "The founding 50 users get the full Pro subscription completely free, forever. Not a trial. Not a limited version. Not a discount. Free for life. When other users pay $5 per month for Pro access, you pay nothing. Ever. This is our way of saying thank you to the people who believed in us before we had a product to show. Your spot is permanently locked the moment you join the waitlist.",
  },
  {
    q: "What data do you collect and store?",
    a: "We store only your email address, used to send one confirmation and one launch email. Job data is never sent to our servers. It is analyzed entirely within your browser and discarded when you leave the page. We do not track which jobs you view, what scores you see, or any Upwork activity. Your Upwork data is yours.",
  },
  {
    q: "When is LancerBeast launching?",
    a: "We are actively building and targeting a launch within the next few weeks. Once 50 spots are filled and the extension passes Chrome Web Store review, which typically takes 1 to 3 business days, founding members get emailed immediately. You will not be waiting months.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-14 px-6" style={{ background: "linear-gradient(180deg,#091524 0%,#060e1c 100%)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-9 reveal">
          <span className="inline-block text-xs font-bold tracking-[3px] uppercase text-mint mb-3">Got questions</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            Everything you need to know.
          </h2>
        </div>

        <div className="space-y-2.5">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`border rounded-2xl transition-all duration-300 ${isOpen ? "border-mint/30 bg-white/6" : "border-white/8 bg-white/3 hover:border-white/15"}`}              >
                {/* Trigger */}
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-5 text-left gap-4"
                >
                  <span className="text-white font-semibold text-[15px] leading-snug">{faq.q}</span>
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-base font-bold transition-all duration-300 ${isOpen ? "bg-mint/20 border-mint/40 text-mint rotate-45" : "border-white/15 text-white/40"}`}
                  >
                    +
                  </span>
                </button>

                {/* Answer — rendered in DOM always, height controlled by grid trick */}
                <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.35s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <div style={{ overflow: "hidden", minHeight: 0 }}>
                    <p className="px-5 pb-5 text-white/55 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-9 px-6 border-t border-white/6" style={{ background: "#040a12" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>LancerBeast 🦁</p>
            <p className="text-white/30 text-sm mt-0.5">Stop spending $100s on connects that go nowhere.</p>
          </div>
          <div className="flex items-center gap-5 text-sm text-white/30">
            <a href="/privacy" className="hover:text-white/65 transition-colors">Privacy Policy</a>
            <a href="mailto:hello@lancerbeast.com" className="hover:text-white/65 transition-colors">hello@lancerbeast.com</a>
          </div>
        </div>
        <div className="border-t border-white/6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/18 text-xs">© {new Date().getFullYear()} LancerBeast.</p>
          <p className="text-white/15 text-xs">Not affiliated with Upwork Inc.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Success Toast ─────────────────────────────────────────────────────────────
function SuccessToast({ spot, onClose }: { spot: number; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 7000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-fade-up">
      <div className="rounded-2xl p-5 shadow-2xl border border-mint/25"
        style={{ background: "linear-gradient(135deg,#1A6B5A,#0F2D52)" }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">🦁</span>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">You are spot #{spot}. Welcome to the pride.</p>
            <p className="text-white/55 text-xs mt-1">Confirmation email sent. One email on launch day.</p>
          </div>
          <button onClick={onClose} className="text-white/25 hover:text-white text-xl leading-none">×</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [signupCount, setSignupCount] = useState(0);
  const [visitors, setVisitors] = useState(0);
  const [successSpot, setSuccessSpot] = useState<number | null>(null);
  const sessionIdRef = useRef("");

  useScrollReveal();

  useEffect(() => { sessionIdRef.current = getSessionId(); }, []);

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/api/waitlist/count");
      const data = await res.json();
      if (typeof data.count === "number") setSignupCount(data.count);
    } catch {}
  }, []);

  const fetchVisitors = useCallback(async () => {
    try {
      const res = await fetch("/api/visitors/count");
      const data = await res.json();
      if (typeof data.count === "number") setVisitors(data.count);
    } catch {}
  }, []);

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
    fetchCount(); pingVisitor(); fetchVisitors();
    const ci = setInterval(fetchCount, 30000);
    const pi = setInterval(pingVisitor, 30000);
    const vi = setInterval(fetchVisitors, 30000);
    return () => { clearInterval(ci); clearInterval(pi); clearInterval(vi); };
  }, [fetchCount, pingVisitor, fetchVisitors]);

  function handleSuccess(spot: number) { setSuccessSpot(spot); fetchCount(); }

  return (
    <main className="relative">
      <Navbar signupCount={signupCount} />
      <HeroSection signupCount={signupCount} onSuccess={handleSuccess} />
      <TrustStrip />
      <PainSection />
      <FeaturesSection />
      <SavingsSection />
      <WhoSection />
      <UrgencySection signupCount={signupCount} visitors={visitors} />
      <FAQSection />
      <Footer />
      {successSpot !== null && <SuccessToast spot={successSpot} onClose={() => setSuccessSpot(null)} />}
    </main>
  );
}