/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0b61ee",
        "primary-dark": "#083ba3",
        secondary: "#ffffff",
        dark: "#121212",
        light: "#ffffff",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        'jetbrains-mono': ['var(--font-jetbrains-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
} 