/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#135bec",
                secondary: "#1f2937",
                gold: {
                    DEFAULT: '#D4AF37',
                    light: '#F4DF4E',
                    dark: '#AA8C2C',
                },
                charcoal: {
                    DEFAULT: '#101622', // Updated to match new background-dark
                    light: '#1a2232',   // Updated to match new surface-dark
                    dark: '#0a0e17',
                },
                "background-light": "#f6f6f8",
                "background-dark": "#101622",
                "surface-dark": "#1a2232",
                "premium": "#D4AF37",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
                display: ['Lexend', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-subtle': 'bounce 2s infinite',
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F4DF4E 50%, #D4AF37 100%)',
                'pro-blue-gradient': 'linear-gradient(135deg, #0d47a1 0%, #135bec 100%)',
                'premium-gold-gradient': 'linear-gradient(135deg, #b8860b 0%, #daa520 50%, #ffd700 100%)',
            },
        },
    },
    plugins: [],
}
