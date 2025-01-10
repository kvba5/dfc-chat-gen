import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        monsterfriendfore: ["var(--font-monsterfriendfore)"],
        toublebenaththedome: ["var(--font-toublebenaththedome)"]
      },
      colors: {
        bg: "var(--bg)",
        text: "var(--text)",
        textsecond: "var(--text-second)",
        primary: "var(--primary)",
        primarysecond: "var(--primary-second)",
        btn: "var(--btn)",
        btnsecond: "var(--btn-second)"
      }
    },
  },
  experimental: {
    optimizeUniversalDefaults: true
  },
  plugins: [],
} satisfies Config;
