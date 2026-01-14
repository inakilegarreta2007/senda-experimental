/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./views/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./utils/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}"
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "var(--color-primary)",
                "secondary": "var(--color-secondary)",
                "accent": "var(--color-accent)",
                "celeste": "var(--color-celeste)",
                "background-light": "#f6f6f8",
                "background-dark": "#111521",
                "surface-light": "#ffffff",
                "surface-dark": "#1a1d2d",
                "text-main": "#111318",
                "text-secondary": "#636c88",
                "border-light": "#dcdee5",
                "border-dark": "#2a2f45",
            },
            fontFamily: {
                "display": ["Public Sans", "sans-serif"],
                "sans": ["Public Sans", "sans-serif"],
                "body": ["Noto Sans", "sans-serif"],
            },
        },
    },
    plugins: [],
}
