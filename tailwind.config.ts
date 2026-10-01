import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#1E1631", soft: "#3A3150" },
        canvas: "#F7F6FB",
        line: "#E6E3EF",
        muted: "#6B6580",
        violet: { DEFAULT: "#5B3DF5", deep: "#4A2EDB", tint: "#EEEAFE" },
        highlighter: "#FFE45C",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-hanken)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        sweep: { from: { backgroundSize: "0% 100%" }, to: { backgroundSize: "100% 100%" } },
        strike: { from: { textDecorationColor: "transparent" }, to: { textDecorationColor: "#E5484D" } },
      },
      animation: {
        sweep: "sweep 900ms 700ms cubic-bezier(.65,0,.35,1) both",
        strike: "strike 300ms 300ms ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
