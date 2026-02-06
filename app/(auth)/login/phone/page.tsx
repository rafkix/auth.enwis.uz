"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Phone, Loader2, RefreshCw, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// API va Context (Manzillarni o'zingiznikiga to'g'rilang)
import { authService } from "@/lib/api"
import { useAuth } from "@/lib/AuthContext" 

export default function PhoneLoginPage() {
    const router = useRouter()
    const { refreshUser } = useAuth()

    // --- STATES ---
    const [step, setStep] = useState<"PHONE" | "CODE">("PHONE")
    const [phone, setPhone] = useState("+998")
    const [loading, setLoading] = useState(false)
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""))
    const [agreed, setAgreed] = useState(true)
    
    // Backenddan keladigan Telegram Link
    const [telegramLink, setTelegramLink] = useState("")

    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // --- OTP LOGIKA (Kodni avto tekshirish) ---
    useEffect(() => {
        const fullOtp = otp.join("")
        if (fullOtp.length === 6 && step === "CODE") {
            handleVerify(fullOtp)
        }
    }, [otp, step])

    // --- INPUT HANDLERS ---
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value
        // Faqat raqamlar va + belgisini qoldirish
        if (!val.startsWith("+998")) val = "+998"
        setPhone(val)
    }

    const handleOtpChange = (element: HTMLInputElement, index: number) => {
        const value = element.value.replace(/\D/g, "")
        if (!value) return

        const newOtp = [...otp]
        newOtp[index] = value.substring(value.length - 1)
        setOtp(newOtp)

        if (index < 5) inputRefs.current[index + 1]?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus()
            } else {
                const newOtp = [...otp]; newOtp[index] = ""; setOtp(newOtp)
            }
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasteData = e.clipboardData.getData("text").replace(/\D/g, "")
        if (pasteData.length > 0) {
            const newOtp = [...otp]
            pasteData.split("").slice(0, 6).forEach((char, index) => { newOtp[index] = char })
            setOtp(newOtp)
            const targetIndex = Math.min(pasteData.length, 5)
            inputRefs.current[targetIndex]?.focus()
        }
    }

    // --- API ACTIONS ---
    
    // 1. KOD SO'RASH
    const handleRequestCode = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!agreed) return alert("Iltimos, shartlarga rozilik bildiring")
        if (phone.length < 13) return alert("Telefon raqam noto'g'ri")

        setLoading(true)
        setTelegramLink("") // Linkni tozalash
        setOtp(new Array(6).fill("")) // OTP ni tozalash
        
        try {
            // Backendga so'rov
            const res = await authService.sendPhoneCode(phone.replace(/\s/g, ""))
            
            // Debug kod (SMS o'rniga consolega chiqadi)
            if (res.debug_code) {
                console.log("🔒 SMS KOD (Debug):", res.debug_code)
            }

            // Telegram linkni saqlash
            if (res.telegram_url) {
                setTelegramLink(res.telegram_url)
            }

            setStep("CODE")
        } catch (error: any) {
            console.error(error)
            alert(error.response?.data?.detail || "Xatolik yuz berdi. Qayta urinib ko'ring.")
        } finally {
            setLoading(false)
        }
    }

    // 2. KODNI TEKSHIRISH VA KIRISH
    const handleVerify = async (finalCode: string) => {
        setLoading(true)
        try {
            // Login qilish
            await authService.verifyPhoneCode(phone.replace(/\s/g, ""), finalCode)
            
            // User ma'lumotlarini yuklash
            await refreshUser()
            
            // Dashboardga yo'naltirish
            router.push("/dashboard")
        } catch (error: any) {
            console.error(error)
            alert(error.response?.data?.detail || "Kod noto'g'ri!")
            // Xato bo'lsa tozalab, boshiga focus qilamiz
            setOtp(new Array(6).fill(""))
            inputRefs.current[0]?.focus()
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[420px]"
        >
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-3 p-2">
                    <div className="w-full h-full bg-[#17776A] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-inner">E</div>
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-900">ENWIS ID</span>
            </div>

            {/* KARTA */}
            <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#17776A] to-teal-400" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        {/* HEADER MATNI */}
                        <div className="text-center">
                            <h1 className="text-2xl font-black text-slate-900 mb-1">
                                {step === 'PHONE' ? "Telefon orqali" : "Kodni kiriting"}
                            </h1>
                            <p className="text-slate-500 text-xs sm:text-sm">
                                {step === 'PHONE'
                                    ? "Kirish yoki ro'yxatdan o'tish uchun raqamingizni kiriting"
                                    : `${phone} raqamiga yuborilgan kodni kiriting`}
                            </p>
                        </div>

                        {/* STEP 1: PHONE INPUT */}
                        {step === "PHONE" ? (
                            <form onSubmit={handleRequestCode} className="space-y-4">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        placeholder="+998"
                                        maxLength={13}
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#17776A] focus:bg-white outline-none font-bold text-slate-900 transition-all placeholder:text-slate-400 tracking-wider"
                                        required
                                    />
                                </div>

                                <div className="flex items-start space-x-2 px-1 py-1">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="mt-1 w-4 h-4 text-[#17776A] rounded border-gray-300 focus:ring-[#17776A]"
                                    />
                                    <label className="text-[11px] leading-tight text-slate-500 select-none cursor-pointer" onClick={() => setAgreed(!agreed)}>
                                        Men <Link href="/terms" className="text-blue-600 underline" onClick={e => e.stopPropagation()}>Ommaviy oferta</Link> shartlariga roziman.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !agreed}
                                    className="w-full h-14 bg-[#17776A] text-white rounded-2xl font-bold shadow-lg shadow-[#17776A]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <>Kodni olish <ArrowRight size={18} /></>}
                                </button>
                            </form>
                        ) : (
                            // STEP 2: OTP INPUT
                            <div className="space-y-6">
                                {/* Raqamni o'zgartirish */}
                                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="font-bold text-sm text-slate-700">{phone}</span>
                                    <button
                                        onClick={() => setStep("PHONE")}
                                        className="text-[10px] font-black uppercase text-[#17776A] tracking-wider hover:underline flex items-center gap-1"
                                    >
                                        <RefreshCw size={10} /> O'zgartirish
                                    </button>
                                </div>

                                {/* TELEGRAM LINK (Agra mavjud bo'lsa) */}
                                {telegramLink && (
                                    <a
                                        href={telegramLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3 px-4 rounded-xl bg-[#229ED9]/10 text-[#229ED9] border border-[#229ED9]/20 flex items-center justify-center gap-3 hover:bg-[#229ED9]/20 transition-all group active:scale-[0.98]"
                                    >
                                        <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold uppercase opacity-70 leading-none mb-1">Eng oson usul</p>
                                            <p className="text-sm font-bold leading-none">Telegram orqali kodni olish</p>
                                        </div>
                                    </a>
                                )}

                                {/* 6 ta katakcha */}
                                <div className="flex justify-between gap-1 sm:gap-2">
                                    {otp.map((data, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            ref={(el) => { inputRefs.current[index] = el }}
                                            value={data}
                                            onPaste={handlePaste}
                                            onChange={(e) => handleOtpChange(e.target, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            className="w-full h-12 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-xl border-2 border-slate-100 bg-slate-50 focus:border-[#17776A] focus:bg-white outline-none transition-all caret-[#17776A]"
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleVerify(otp.join(""))}
                                    disabled={loading || otp.join("").length !== 6}
                                    className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-slate-900/10"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : "Kirishni tasdiqlash"}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Back Link */}
                {step === "PHONE" && (
                    <div className="mt-6 pt-4 border-t border-slate-50 text-center">
                        <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#17776A] transition-colors uppercase tracking-wider">
                            <ArrowLeft size={14} /> Login orqali kirish
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    )
}