import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      colors: {
        primary: "#615CED",
        surface: "#F7F7F8"
      },
      boxShadow: {
        card: "0 10px 50px rgba(0,0,0,0.04)"
      }
    }
  },
  plugins: []
};

export default config;

