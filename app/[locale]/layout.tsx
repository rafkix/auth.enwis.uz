import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "../globals.css"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import ProgressBar from "@/components/Providers/ProgressBar"
import { AuthProvider } from "@/lib/AuthContext"
import Script from "next/script"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { locales } from "@/lib/i18n/locales"
import { notFound } from "next/navigation"
import { cache } from "react"

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

/* ================= HELPERS ================= */

function isValidLocale(locale: string): locale is (typeof locales)[number] {
    return locales.includes(locale as any)
}

const localeMap: Record<string, string> = {
    uz: "uz_UZ",
    en: "en_US",
    ru: "ru_RU",
}

const getCachedDictionary = cache(getDictionary)

/* ================= SEO ================= */

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params

    if (!locale || !isValidLocale(locale)) {
        return {}
    }

    const dict = await getCachedDictionary(locale)

    const baseUrl = "https://cefr.enwis.uz"

    return {
        metadataBase: new URL(baseUrl),

        title: {
            default: dict.seo.title,
            template: `%s | ENWIS`,
        },

        description: dict.seo.description,

        alternates: {
            canonical: `/${locale}`,
            languages: {
                uz: `${baseUrl}/uz`,
                en: `${baseUrl}/en`,
                ru: `${baseUrl}/ru`,
            },
        },

        openGraph: {
            title: dict.seo.title,
            description: dict.seo.description,
            url: `${baseUrl}/${locale}`,
            siteName: "ENWIS",
            locale: localeMap[locale],
            type: "website",
            images: [
                {
                    url: "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: "ENWIS",
                },
            ],
        },

        // ✅ Twitter preview
        twitter: {
            card: "summary_large_image",
            title: dict.meta.home.title,
            description: dict.meta.home.description,
        },

        // ✅ Icons / favicon
        icons: {
            icon: [
                { url: "/favicon.ico" },
                { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
                { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            ],
            apple: [
                { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
            ],
            other: [
                {
                    rel: "android-chrome-192x192",
                    url: "/android-chrome-192x192.png",
                },
                {
                    rel: "android-chrome-512x512",
                    url: "/android-chrome-512x512.png",
                },
            ],
        },

        manifest: "/site.webmanifest",

        robots: {
            index: true,
            follow: true,
        },
    }
}

/* ================= LAYOUT ================= */

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params

    if (!locale || !isValidLocale(locale)) {
        notFound()
    }

    const dict = await getCachedDictionary(locale)

    return (
        <html
            lang={locale}
            className={`${geist.variable} ${geistMono.variable}`}
        >
            <body className="antialiased">

                {/* Google Identity */}
                <script src="https://accounts.google.com/gsi/client" async defer></script>

                {/* Progress */}
                <Suspense fallback={null}>
                    <ProgressBar />
                </Suspense>

                {/* Providers */}
                <AuthProvider>
                    {children}
                </AuthProvider>

                {/* Analytics */}
                <Analytics />

            </body>
        </html>
    )
}