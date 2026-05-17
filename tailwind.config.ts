import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        cream: "var(--cream)",
        ivory: "var(--ivory)",
        charcoal: "var(--charcoal)",
        gold: "var(--gold)",
        "gold-lt": "var(--gold-lt)",
        terra: "var(--terra)",
        cool: "var(--cool)",
        "warm-gray": "var(--warm-gray)",
        border: "var(--border)",
        "green-ok": "var(--green-ok)",
        "red-no": "var(--red-no)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(184,144,96,0.10)",
        "card-hover": "0 8px 40px rgba(184,144,96,0.18)",
      },
      animation: {
        "spin-slow": "spin 1.2s linear infinite",
        "fade-up": "fadeUp 0.4s ease-out both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      fontFamily: {
        sans: ["Noto Sans SC", "system-ui", "sans-serif"],
        serif: ["Noto Serif SC", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
