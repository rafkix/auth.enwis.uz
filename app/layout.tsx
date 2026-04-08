import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import ProgressBar from "@/components/Providers/ProgressBar"
import { AuthProvider } from "@/lib/AuthContext"

import Script from "next/script"

/* ================= FONTS ================= */

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist",
})

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono",
})

/* ================= VIEWPORT ================= */

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
}

/* ================= SEO ================= */

export const metadata: Metadata = {
    metadataBase: new URL("https://cefr.enwis.uz"),

    title: {
        default: "ENWIS – CEFR imtihoniga tayyorgarlik platformasi",
        template: "%s | ENWIS",
    },

    description:
        "CEFR imtihoniga real formatda tayyorlaning: listening, reading, writing va speaking uchun tizimli platforma",

    alternates: {
        canonical: "/",
    },

    openGraph: {
        title: "ENWIS – CEFR imtihoniga tayyorgarlik platformasi",
        description:
            "CEFR imtihoni uchun real interfeys va tizimli mashqlar bilan tayyorgarlik platformasi",
        url: "https://cefr.enwis.uz",
        siteName: "ENWIS",
        locale: "uz_UZ",
        type: "website",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "ENWIS CEFR platformasi",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "ENWIS – CEFR tayyorgarlik platformasi",
        description:
            "CEFR imtihoni uchun real interfeys va tizimli mashqlar",
        images: ["/og-image.jpg"],
    },

    icons: {
        icon: "/logo_icon.png",
        apple: "/logo_icon.png",
    },

    robots: {
        index: true,
        follow: true,
    },
}

/* ================= ROOT LAYOUT ================= */

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html
            lang="uz"
            className={`${geist.variable} ${geistMono.variable}`}
        >
            <body className="antialiased">

                {/* Google Identity Script */}
                <Script
                    src="https://accounts.google.com/gsi/client"
                    strategy="afterInteractive"
                />

                {/* Route progress */}
                <Suspense fallback={null}>
                    <ProgressBar />
                </Suspense>

                {/* Global Providers */}
                <AuthProvider>
                        {children}
                </AuthProvider>

                {/* Analytics */}
                <Analytics />

            </body>
        </html>
    )
}
