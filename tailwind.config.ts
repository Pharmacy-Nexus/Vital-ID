import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bone: "#F5F1E8",
        ink: "#16171B",
        coral: "#E65B4D",
        lime: "#B6E36E",
        aubergine: "#51405D",
        surface: "#EAE5DA",
        muted: "#737373"
      }
    }
  },
  plugins: []
} satisfies Config;
