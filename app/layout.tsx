import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/AuthContext'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'Authentication App',
    description: 'JWT-based authentication with Google and Telegram login',
    generator: 'enwis.uz',
    icons: {
        icon: [
            {
                url: '/favicon-32x32.png',
                media: '(prefers-color-scheme: light)',
            },
            {
                url: '/favicon-32x32.png',
                media: '(prefers-color-scheme: dark)',
            },
            {
                url: 'favicon.ico',
            },
        ],
        apple: '/apple-touch-icon.png',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`font-sans antialiased`}>
                <AuthProvider>
                    {children}
                </AuthProvider>
                <Analytics />
            </body>
        </html>
    )
}
