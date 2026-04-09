"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

import {
  GoogleSignInButton,
  TelegramSignInWidget,
} from "@/components/auth/social-auth/auth-buttons"

export default function AuthPage() {
  const { locale } = useParams()
  const [dict, setDict] = useState<any>(null)

  useEffect(() => {
    if (!locale) return
    import(`@/lib/i18n/messages/${locale}.json`).then((m) => {
      setDict(m.default)
    })
  }, [locale])

  if (!dict) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#f54a00]" size={40} />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">

      {/* ================= PREMIUM GRID BACKGROUND ================= */}
      <div className="absolute inset-0">

        {/* BASE GRID */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* SECOND GRID (offset for depth) */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(rgba(245,74,0,0.08) 5px, transparent 1px),
              linear-gradient(90deg, rgba(231,0,11,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
          }}
        />

        {/* GRADIENT LIGHT */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ffedd5]/70 via-white to-[#ffe3cc]/60" />

        {/* SOFT BLOBS */}
        <div className="absolute top-[10%] left-[15%] w-[300px] h-[300px] bg-[#f54a00]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-[#e7000b]/20 rounded-full blur-[120px]" />
      </div>

      {/* ================= MAIN CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-4"
      >

        {/* gradient border */}
        <div className="p-[1px] rounded-[30px] bg-gradient-to-br from-[#f54a00]/40 via-[#e17100]/30 to-[#e7000b]/40">

          <div className="relative bg-white/80 backdrop-blur-2xl rounded-[30px] p-8 border border-white/40 shadow-[0_30px_100px_rgba(0,0,0,0.15)] overflow-hidden">

            {/* GLOW */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#f54a00]/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#e7000b]/20 blur-3xl rounded-full" />

            {/* HEADER */}
            <div className="flex flex-col items-center text-center relative z-10">

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f54a00] to-[#e7000b] text-white flex items-center justify-center font-black text-xl shadow-xl">
                EN
              </div>

              <h1 className="text-3xl font-black mt-4 text-gray-900 tracking-tight">
                {dict.auth.welcome}
              </h1>

              <p className="text-gray-500 text-sm mt-2 max-w-xs">
                {dict.auth.subtitle}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 space-y-3 relative z-10">

              <div className="transition hover:scale-[1.02] active:scale-[0.98]">
                <GoogleSignInButton />
              </div>

              <div className="transition hover:scale-[1.02] active:scale-[0.98]">
                <TelegramSignInWidget />
              </div>

            </div>

            {/* TRUST */}
            <div className="mt-6 flex items-center justify-between text-xs text-gray-500 relative z-10">
              <span>🔒 Secure</span>
              <span>25K+ students</span>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap justify-center gap-2 mt-6 text-[10px] relative z-10">
              {["IELTS", "Speaking", "Grammar", "AI", "Kids", "Tests"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-black/5 text-gray-600 hover:bg-[#f54a00]/10 hover:text-[#f54a00] transition"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* TERMS */}
            <p className="text-xs text-center text-gray-500 mt-6 relative z-10">
              {dict.auth.agree}{" "}
              <Link
                href={`/${locale}/terms`}
                className="text-[#f54a00] font-semibold underline"
              >
                {dict.auth.terms}
              </Link>
            </p>

          </div>
        </div>
      </motion.div>
    </div>
  )
} 