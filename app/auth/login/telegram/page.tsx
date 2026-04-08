"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ShieldCheck, ArrowLeft, Loader2, Globe, Send,
    Youtube, MessageCircle, ExternalLink, ChevronRight, ChevronLeft
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { authService } from "@/lib/api/auth"
import { useAuth } from "@/lib/AuthContext"

// Karusel uchun ma'lumotlar
const PROMO_SLIDES = [
    {
        id: 1,
        type: "youtube",
        icon: <Youtube size={32} className="text-red-600" />,
        title: "Enwis Academy YouTube",
        description: "Platformadan foydalanish bo'yicha eng so'nggi video darsliklar va master-klasslarni kuzatib boring.",
        link: "https://youtube.com/@enwis",
        buttonText: "Kanalga o'tish",
        color: "from-red-600/20"
    },
    {
        id: 2,
        type: "telegram",
        icon: <MessageCircle size={32} className="text-[#229ED9]" />,
        title: "Enwis Hub Telegram",
        description: "Muhim yangiliklar, yangi funksiyalar va hamjamiyat bilan muloqot qilish uchun rasmiy kanalimizga ulaning.",
        link: "https://t.me/enwis_hub",
        buttonText: "Obuna bo'lish",
        color: "from-[#229ED9]/20"
    }
]

const TELEGRAM_BOT_TOKEN = "8542032478:AAH8CiqFMrRLxTZ6k6bbRKHtl5P9X8Yc98s";
const TELEGRAM_CHANNEL_ID = "@enwis_uz";

function TelegramLoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { refreshUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [widgetLoaded, setWidgetLoaded] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)
    const telegramWrapperRef = useRef<HTMLDivElement>(null)
    const [subscriberCount, setSubscriberCount] = useState<string>("5K+")

    const clientId = searchParams.get("client_id")
    const redirectUri = searchParams.get("redirect_uri")
    const state = searchParams.get("state")
    const getQueryString = () => clientId ? `?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}` : ""

    // Avtomatik karusel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % PROMO_SLIDES.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
            const fetchTelegramSubs = async () => {
                try {
                    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMemberCount?chat_id=${TELEGRAM_CHANNEL_ID}`);
                    const data = await response.json();
                    if (data.ok) {
                        const count = data.result;
                        setSubscriberCount(count >= 1000 ? `${(count / 1000).toFixed(1)}K+` : count.toString());
                    }
                } catch (error) { console.error(error); }
            };
            fetchTelegramSubs();
        }, []);
    

    useEffect(() => {
        if (widgetLoaded) return
        const script = document.createElement("script")
        script.src = "https://telegram.org/js/telegram-widget.js?22"
        script.async = true
        script.setAttribute("data-telegram-login", "EnwisAuthBot")
        script.setAttribute("data-size", "large")
        script.setAttribute("data-radius", "20")
        script.setAttribute("data-onauth", "onTelegramAuth(user)")

        if (telegramWrapperRef.current) {
            telegramWrapperRef.current.appendChild(script)
            setWidgetLoaded(true)
        }

        (window as any).onTelegramAuth = async (user: any) => {
            setLoading(true)
            try {
                await authService.telegramLogin(user)
                await refreshUser()
                clientId ? router.push(`/auth/authorize${getQueryString()}`) : router.push('/dashboard')
            } catch (error: any) {
                alert(error.response?.data?.detail || "Xatolik yuz berdi.")
                setLoading(false)
            }
        }
    }, [widgetLoaded])

    return (
        <div className="fixed inset-0 w-full h-full flex flex-col lg:flex-row bg-white overflow-hidden font-sans m-0 p-0">

            {/* CHAP TOMON: TELEGRAM AUTH */}
            <div className="w-full lg:w-[45%] h-full flex flex-col justify-center items-center bg-white px-6 z-20 relative">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px]">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Globe size={22} />
                        </div>
                        <span className="text-[#17776A] text-xl font-black tracking-tighter uppercase">ENWIS HUB</span>
                    </div>

                    <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-[0_30px_60px_rgba(0,0,0,0.06)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#229ED9]" />
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Xush kelibsiz</h1>
                            <p className="text-slate-400 font-medium text-sm mt-2 leading-relaxed">Platformaga Telegram orqali xavfsiz kiring</p>
                        </div>

                        <div className="flex flex-col items-center justify-center min-h-[100px] py-6 bg-slate-50/50 rounded-[30px] border border-slate-100">
                            <AnimatePresence>
                                {loading && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-[30px]">
                                        <Loader2 className="animate-spin text-[#229ED9]" size={32} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div ref={telegramWrapperRef} className="scale-110" />
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-50 flex justify-center">
                            <Link href={`/auth${getQueryString()}`} className="flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-[#17776A] uppercase tracking-widest transition-all group">
                                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Parol orqali kirish
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="hidden lg:flex w-[55%] h-full bg-[#0a0a0a] relative items-center justify-center overflow-hidden">

                {/* 1. Asosiy Kavisli Fon (Oq yarim oy) */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-[120px] bg-white z-10"
                    style={{ clipPath: 'ellipse(100% 100% at 0% 50%)' }}
                />

                {/* 2. Dinamik Neon Effektlar (Faqat o'ng tomonda chegaralangan) */}
                <div className="absolute inset-0 z-0">
                    {/* Yuqori o'ng burchakdagi yashil nur */}
                    <div className="absolute -top-20 -right-20 w-[450px] h-[450px] bg-[#17776A] opacity-[0.15] rounded-full blur-[100px]" />

                    {/* O'rta qismdagi havo rang nur */}
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-1/2 right-10 -translate-y-1/2 w-[350px] h-[350px] bg-[#229ED9] rounded-full blur-[120px]"
                    />

                    {/* Siz aytgan o'sha xato joylashgan doiralarni TUZATILGAN holati: */}
                    {/* O'ng tepa kichik doira */}
                    <div className="absolute top-[15%] right-[10%] w-48 h-48 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md" />

                    {/* Pastki o'rta kichik doira (Chapga o'tib ketmasligi uchun right-40 qilingan) */}
                    <div className="absolute bottom-[10%] right-[35%] w-24 h-24 rounded-full bg-[#17776A]/10 border border-white/5 backdrop-blur-sm" />
                </div>

                {/* 3. Markaziy Premium Karta */}
                <div className="relative z-20 w-full max-w-[440px] px-8">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                        <div className="bg-white/[0.02] border border-white/10 rounded-[3.5rem] p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">

                            {/* Card ichidagi dekoratsiya */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#229ED9]/10 rounded-full blur-2xl group-hover:bg-[#229ED9]/20 transition-colors" />

                            <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-20 h-20 bg-gradient-to-tr from-[#229ED9] to-[#4fc3f7] rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-[#229ED9]/30 border border-white/20"
                                >
                                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .33z" />
                                    </svg>
                                </motion.div>

                                <div className="space-y-3">
                                    <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
                                        English with <br />
                                        <span className="text-[#229ED9]">Enwis Premium</span>
                                    </h3>
                                    <p className="text-slate-400 text-sm font-medium opacity-70">
                                        Darslar, testlar va yopiq hamjamiyat.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="bg-white/[0.04] border border-white/5 rounded-2xl py-5 hover:bg-white/10 transition-colors">
                                        <div className="text-2xl font-black text-white leading-none">{subscriberCount}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Students</div>
                                    </div>
                                    <div className="bg-white/[0.04] border border-white/5 rounded-2xl py-5 hover:bg-white/10 transition-colors">
                                        <div className="text-2xl font-black text-white leading-none">500+</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Darsliklar</div>
                                    </div>
                                </div>

                                <a href="https://t.me/enwis_uz" target="_blank" className="w-full h-14 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#229ED9] hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                                    Telegram Kanal <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 4. Subtle Dots Grid (O'ng tomonda orqa fonda) */}
                <div className="absolute inset-0 z-[-1] opacity-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
                    <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                </div>
            </div>
        </div>
    )
}

export default function TelegramLoginPage() {
    return (
        <Suspense fallback={null}>
            <TelegramLoginContent />
        </Suspense>
    )
}