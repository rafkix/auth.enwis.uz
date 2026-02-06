// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
        colors: {
            enwis: {
            green: '#BAF43C', // Sizning logodagi yashil
            dark: '#0F172A', // Jiddiy to'q rang (Text uchun)
            gray: '#F8FAFC', // Orqa fon uchun och rang
            },
        },
        },
    },
    plugins: [],
}
export default config
