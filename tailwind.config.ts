import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { fontFamily: { display: ["var(--font-space)"], mono: ["var(--font-mono)"] } } },
  plugins: [],
} satisfies Config;
