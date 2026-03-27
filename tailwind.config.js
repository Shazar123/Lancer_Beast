/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-clash)", "Georgia", "serif"],
        body: ["var(--font-satoshi)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        navy: "#0F2D52",
        teal: "#1A6B5A",
        mint: "#2DD4BF",
        foam: "#F0FAF8",
      },
      backgroundImage: {
        "hero-grad": "linear-gradient(135deg, #0F2D52 0%, #1A6B5A 100%)",
        "cta-grad": "linear-gradient(135deg, #1A6B5A 0%, #2DD4BF 100%)",
        "section-fade": "linear-gradient(180deg, #F0FAF8 0%, #FFFFFF 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        pulse2: "pulse2 2s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        pulse2: {
          "0%, 100%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(1.03)", opacity: 0.9 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
