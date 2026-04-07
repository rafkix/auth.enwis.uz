"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { KeyRound, Send, ArrowLeft, Globe, Loader2, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const BOT_USERNAME = "EnwisAuthBot"
    const telegramBotLink = `https://t.me/${BOT_USERNAME}?start=forgot_password`

    const handleBotRedirect = () => {
        setLoading(true)
        window.open(telegramBotLink, "_blank")
        setTimeout(() => setLoading(false), 2000)
    }

    return (
        <div className="fixed inset-0 w-full h-full flex flex-col lg:flex-row bg-white overflow-hidden font-sans">
            
            {/* CHAP TOMON: TIKLASH FORMASI */}
            <div className="w-full lg:w-[45%] h-full flex flex-col justify-center px-8 lg:px-16 bg-white z-20 relative">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="w-full max-w-[400px] mx-auto py-10"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#17776A]/20">
                            <Globe size={22} />
                        </div>
                        <span className="text-[#17776A] text-xl font-black tracking-tighter uppercase">ENWIS HUB</span>
                    </div>

                    <header className="mb-8">
                        <h1 className="text-4xl font-black text-slate-800 leading-tight mb-2 tracking-tight">
                            Parolni tiklash
                        </h1>
                        <p className="text-slate-400 font-medium">
                            Xavfsizlik nuqtai nazaridan parolni tiklash faqat Telegram botimiz orqali amalga oshiriladi.
                        </p>
                    </header>

                    <div className="space-y-6">
                        <div className="rounded-2xl bg-slate-50 p-6 border-2 border-slate-50 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                                    <span className="text-xs font-bold">1</span>
                                </div>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                    Pastdagi tugma orqali <span className="text-[#229ED9] font-bold">Telegram</span> botimizga o'ting.
                                </p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                                    <span className="text-xs font-bold">2</span>
                                </div>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                    Botda <span className="font-bold">/start</span> buyrug'ini bosing va hisobingizni tasdiqlang.
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={handleBotRedirect}
                            disabled={loading}
                            className="w-full h-15 bg-[#229ED9] text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin" size={22} /> : (
                                <>
                                    <MessageCircle size={20} />
                                    Telegram orqali tiklash
                                </>
                            )}
                        </button>

                        <button 
                            onClick={() => router.push('/auth')}
                            className="w-full h-15 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 hover:text-slate-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            Orqaga qaytish
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* O'NG TOMON: DEKORATIV QISM */}
            <div className="hidden lg:flex w-[55%] h-full bg-[#0a0a0a] relative items-center justify-center overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[120px] bg-white z-10" style={{ clipPath: 'ellipse(100% 100% at 0% 50%)' }} />
                
                {/* Dinamik Glow */}
                <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />

                <div className="relative z-20 text-center px-12">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-white mb-8 mx-auto backdrop-blur-xl"
                    >
                        <KeyRound size={40} className="text-blue-400" />
                    </motion.div>
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Xavfsiz tiklash</h2>
                    <p className="text-slate-400 max-w-[400px] mx-auto leading-relaxed">
                        Biz sizning xavfsizligingizni birinchi o'ringa qo'yamiz. Telegram orqali tiklash bu sizning shaxsingizni 100% kafolatlash usulidir.
                    </p>
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 z-[-1] opacity-5">
                    <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                </div>
            </div>
        </div>
    )
}