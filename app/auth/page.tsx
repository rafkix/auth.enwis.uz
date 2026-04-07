"use client"

import { useState, useEffect, useMemo, useRef, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Globe,
  Loader2,
  Phone,
  MessageCircle,
  ArrowRight,
  Star,
  Zap,
  ArrowUpRight,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { GoogleSignInButton, TelegramSignInWidget } from "@/components/auth/social-auth/auth-buttons"

type AdItem = {
  id: number
  color: string
  image: string
  icon: React.ComponentType<{ size?: number }>
  title: React.ReactNode
  description: string
  stats: string
  label: string
  tag: string
  url: string
}

const ADS: AdItem[] = [
  {
    id: 1,
    color: "#229ED9",
    image:
      "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1600&auto=format&fit=crop",
    icon: MessageCircle,
    title: (
      <>
        Telegramda bizga <br /> <span style={{ color: "#229ED9" }}>qo&apos;shiling!</span>
      </>
    ),
    description:
      "Eng so'nggi yangiliklar, foydali materiallar va yopiq guruhlarga kirish imkoniyatini boy bermang.",
    stats: "25K+",
    label: "Obunachilar",
    tag: "COMMUNITY",
    url: "https://t.me/enwis_uz",
  },
  {
    id: 2,
    color: "#17776A",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop",
    icon: Zap,
    title: (
      <>
        Premium darslar <br /> <span style={{ color: "#17776A" }}>endi ochiq!</span>
      </>
    ),
    description:
      "Barcha darajadagi darslar, interaktiv topshiriqlar va shaxsiy natijalar bitta tizimda.",
    stats: "500+",
    label: "Darsliklar",
    tag: "PREMIUM",
    url: "/courses",
  },
  {
    id: 3,
    color: "#FF5733",
    image:
      "https://images.unsplash.com/photo-1551288049-bbbda546697a?q=80&w=1600&auto=format&fit=crop",
    icon: Star,
    title: (
      <>
        Natijalarni <br /> <span style={{ color: "#FF5733" }}>kuzatib boring.</span>
      </>
    ),
    description:
      "Intellektual tahlillar orqali o'z ko'rsatkichlaringizni muntazam ravishda tahlil qiling.",
    stats: "12K+",
    label: "Talabalar",
    tag: "ANALYTICS",
    url: "/dashboard/result",
  },
]

function buildAuthQuery(params: {
  client_id: string | null
  redirect_uri: string | null
  state: string | null
}) {
  if (!params.client_id) return ""
  const qs = new URLSearchParams()
  qs.set("client_id", params.client_id)
  if (params.redirect_uri) qs.set("redirect_uri", params.redirect_uri)
  if (params.state) qs.set("state", params.state)
  return `?${qs.toString()}`
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [adIndex, setAdIndex] = useState(0)

  const clientId = searchParams.get("client_id")
  const redirectUri = searchParams.get("redirect_uri")
  const state = searchParams.get("state")

  const authQuery = useMemo(
    () => buildAuthQuery({ client_id: clientId, redirect_uri: redirectUri, state }),
    [clientId, redirectUri, state]
  )

  // Carousel with visibility pause
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const start = () => {
      if (intervalRef.current) return
      intervalRef.current = window.setInterval(() => {
        setAdIndex((prev) => (prev + 1) % ADS.length)
      }, 6000)
    }

    const stop = () => {
      if (!intervalRef.current) return
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    const onVisibility = () => {
      if (document.visibilityState === "visible") start()
      else stop()
    }

    onVisibility()
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      stop()
    }
  }, [])

  const activeAd = ADS[adIndex]
  const AdIcon = activeAd.icon

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* LEFT */}
      <div className="w-full lg:w-[44%] h-full flex flex-col justify-center px-6 sm:px-10 lg:px-16 bg-white relative overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px] mx-auto py-10"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 bg-[#17776A] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#17776A]/20">
              <Globe size={24} />
            </div>
            <span className="text-[#17776A] text-xl sm:text-2xl font-black tracking-tight uppercase">
              ENWIS HUB
            </span>
          </div>

          {/* Heading */}
          <header className="mb-10">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-3 tracking-tight">
              Xush kelibsiz
            </h1>
            <p className="text-slate-500 text-base sm:text-lg font-medium">
              Davom etish uchun kirish usulini tanlang.
            </p>
          </header>

          {/* Primary login */}
          <div className="space-y-4">
            <button
              onClick={() => router.push(`/auth/login/phone${authQuery}`)}
              className="w-full h-[78px] rounded-[26px] bg-[#17776A] text-white flex items-center justify-between px-7
                         hover:brightness-110 active:scale-[0.98] transition
                         shadow-xl shadow-[#17776A]/25 focus:outline-none focus:ring-4 focus:ring-[#17776A]/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center">
                  <Phone size={24} />
                </div>
                <div className="text-left">
                  <span className="block font-black text-lg sm:text-xl">Telefon raqam</span>
                  <span className="text-white/70 text-[11px] font-extrabold uppercase tracking-widest">
                    SMS tasdiqlash
                  </span>
                </div>
              </div>
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={22} />
            </button>

            {/* Divider */}
            <div className="relative py-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <span className="relative px-5 bg-white text-[10px] font-black text-slate-400 uppercase tracking-[0.28em] block w-max mx-auto">
                Yoki ijtimoiy tarmoqlar
              </span>
            </div>

            {/* Social */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-16">
                <GoogleSignInButton />
              </div>
              <div className="h-16">
                <TelegramSignInWidget />
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-12 text-center text-slate-500 text-xs leading-relaxed max-w-[320px] mx-auto">
            Tizimga kirish orqali siz bizning{" "}
            <Link href="/terms" className="text-slate-900 font-bold underline underline-offset-4">
              Foydalanish shartlari
            </Link>
            ga rozilik bildirasiz.
          </p>
        </motion.div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex w-[56%] h-full bg-[#0a0a0a] relative items-center justify-center overflow-hidden">
        {/* Soft white cut */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[140px] bg-white z-10"
          style={{ clipPath: "ellipse(100% 100% at 0% 50%)" }}
        />

        {/* Glow */}
        <motion.div
          key={activeAd.color}
          initial={{ opacity: 0.15 }}
          animate={{ opacity: [0.12, 0.26, 0.12], scale: [1, 1.25, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 right-0 w-[640px] h-[640px] rounded-full blur-[150px]"
          style={{ backgroundColor: activeAd.color }}
        />

        <div className="relative z-20 w-full max-w-[520px] px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeAd.id}
              initial={{ opacity: 0, scale: 0.92, x: 26 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.06, x: -26 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/[0.035] border border-white/10 rounded-[3.2rem] overflow-hidden backdrop-blur-2xl"
            >
              <div className="w-full h-56 relative">
                <img
                  src={activeAd.image}
                  className="w-full h-full object-cover opacity-35"
                  alt="Promo"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
              </div>

              <div className="p-12 pt-0">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 mb-8 -mt-8 bg-[#0a0a0a]"
                  style={{ color: activeAd.color }}
                >
                  <AdIcon size={28} />
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-[10px] font-black tracking-[0.25em] uppercase text-white/40">
                    {activeAd.tag}
                  </div>
                </div>

                <h2 className="text-4xl font-black text-white leading-tight mb-5">
                  {activeAd.title}
                </h2>
                <p className="text-slate-300/70 text-lg leading-relaxed mb-10">
                  {activeAd.description}
                </p>

                <div className="flex items-center justify-between pt-8 border-t border-white/10">
                  <div>
                    <div className="text-3xl font-black text-white">{activeAd.stats}</div>
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                      {activeAd.label}
                    </div>
                  </div>

                  <a
                    href={activeAd.url}
                    className="h-12 px-7 rounded-2xl font-black text-xs uppercase tracking-widest transition
                               flex items-center gap-2 border border-white/10 hover:border-white/20"
                    style={{ backgroundColor: activeAd.color, color: "white" }}
                  >
                    Batafsil <ArrowUpRight size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex gap-3 mt-8 justify-center">
            {ADS.map((_, i) => (
              <button
                key={i}
                aria-label={`Show ad ${i + 1}`}
                onClick={() => setAdIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  adIndex === i ? "w-14" : "w-4 bg-white/10"
                }`}
                style={{ backgroundColor: adIndex === i ? activeAd.color : undefined }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-white">
          <Loader2 className="animate-spin text-[#17776A]" size={40} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}