/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                indigo: {
                    DEFAULT: "#4F46E5",
                    hover: "#4338CA",
                    light: "#EEF2FF",
                },
                saffron: {
                    DEFAULT: "#F59E0B",
                    hover: "#D97706",
                },
                navy: "#0F1729",
                offwhite: "#F8F7F4",
                border: "#E5E7EB",
                muted: "#6B7280",
            },
            fontFamily: {
                heading: ["Plus Jakarta Sans", "sans-serif"],
                body: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
};