"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Sparkles, ArrowLeft, MessageCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// API va Context
import { authService } from "@/lib/api"
import { useAuth } from "@/lib/AuthContext"

export default function TelegramLoginPage() {
    const router = useRouter()
    const { refreshUser } = useAuth()
    
    const [loading, setLoading] = useState(false)
    const [widgetLoaded, setWidgetLoaded] = useState(false)
    const telegramWrapperRef = useRef<HTMLDivElement>(null)

    // --- TELEGRAM SCRIPTINI YUKLASH ---
    useEffect(() => {
        if (widgetLoaded) return

        const script = document.createElement("script")
        script.src = "https://telegram.org/js/telegram-widget.js?22"
        script.async = true
        
        // ⚙️ SOZLAMALAR (O'zingiznikiga almashtiring)
        script.setAttribute("data-telegram-login", "EnwisAuthBot") // BOT USERNAME
        script.setAttribute("data-size", "large")
        script.setAttribute("data-radius", "12")
        script.setAttribute("data-request-access", "write")
        script.setAttribute("data-userpic", "false")
        script.setAttribute("data-onauth", "onTelegramAuth(user)")

        if (telegramWrapperRef.current) {
            telegramWrapperRef.current.appendChild(script)
            setWidgetLoaded(true)
        }

        // Global funksiyani oynaga bog'lash
        // @ts-ignore
        window.onTelegramAuth = async (user: any) => {
            handleTelegramResponse(user)
        }

        return () => {
            // @ts-ignore
            window.onTelegramAuth = undefined
        }
    }, [])

    const handleTelegramResponse = async (user: any) => {
        setLoading(true)
        try {
            console.log("Telegram User:", user)
            
            // 1. Backendga yuborish
            await authService.telegramLogin(user)

            // 2. User holatini yangilash
            await refreshUser()

            // 3. Dashboardga o'tish
            router.push('/dashboard')
        } catch (error: any) {
            console.error("Telegram login error", error)
            alert(error.response?.data?.detail || "Xatolik yuz berdi. Qaytadan urinib ko'ring.")
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[420px]"
        >
            {/* Logo Qismi */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-3 p-2">
                     <div className="w-full h-full bg-[#17776A] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-inner">E</div>
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-900">ENWIS ID</span>
            </div>

            {/* Asosiy Karta */}
            <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-10 relative overflow-hidden text-center">

                {/* Yuqori gradient chiziq */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#17776A] to-[#229ED9]" />

                <div className="mb-8">
                    <div className="w-16 h-16 bg-[#229ED9]/10 text-[#229ED9] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/10">
                        <MessageCircle size={32} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Telegram orqali</h1>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed px-2">
                        Tizimga tezkor kirish uchun pastdagi tugmani bosing va Telegramdan ruxsat bering.
                    </p>
                </div>

                {/* Telegram Widget joyi */}
                <div className="flex flex-col items-center justify-center min-h-[60px] mb-8 relative">
                    
                    {/* Loading Spinner */}
                    {loading && (
                        <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                            <div className="flex flex-col items-center gap-2 text-[#17776A] text-sm font-bold">
                                <Loader2 className="animate-spin" size={24} />
                                Tasdiqlanmoqda...
                            </div>
                        </div>
                    )}

                    {/* Haqiqiy Telegram Button */}
                    <div 
                        ref={telegramWrapperRef} 
                        className="transform scale-110 sm:scale-125 transition-transform flex justify-center"
                    />
                    
                    {/* Widget yuklangunicha Skeleton */}
                    {!widgetLoaded && !loading && (
                        <div className="animate-pulse flex flex-col items-center gap-2">
                            <div className="w-40 h-10 bg-slate-200 rounded-full"></div>
                            <span className="text-xs text-slate-400">Yuklanmoqda...</span>
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-slate-50">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#17776A] transition-colors uppercase tracking-wider"
                    >
                        <ArrowLeft size={14} /> Bekor qilish
                    </Link>
                </div>
            </div>

            {/* Footer Icons */}
            <div className="mt-6 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <ShieldCheck size={14} className="text-teal-600" /> Secure
                </div>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <Sparkles size={14} className="text-amber-500" /> Fast
                </div>
            </div>

        </motion.div>
    )
}