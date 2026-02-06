"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck, Lock, UserCheck, Zap } from "lucide-react"
import { useAuth } from "@/lib/AuthContext" // Yoki lib/AuthContext

export default function HomePage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    // 1. Agar user allaqachon kirgan bo'lsa, Dashboardga yo'naltiramiz
    useEffect(() => {
        if (!loading && user) {
            router.push("/dashboard")
        }
    }, [user, loading, router])

    if (loading) return null // Yoki loading spinner

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#17776A] selection:text-white">
            
            {/* ================= NAVBAR ================= */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#17776A]/20">
                            E
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900">ENWIS ID</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-[#17776A] transition-colors hidden sm:block">
                            Kirish
                        </Link>
                        <Link href="/register" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95">
                            Ro'yxatdan o'tish
                        </Link>
                    </div>
                </div>
            </header>

            {/* ================= HERO SECTION ================= */}
            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                
                {/* Left Content */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="flex-1 text-center lg:text-left"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
                        <Zap size={14} fill="currentColor" /> Yagona identifikatsiya tizimi
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
                        Bitta hisob. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#17776A] to-teal-400">
                            Cheksiz imkoniyat.
                        </span>
                    </h1>
                    
                    <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                        Enwis ekotizimidagi barcha loyihalar uchun yagona kirish kaliti. 
                        Xavfsiz, tezkor va ishonchli.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <Link href="/register" className="w-full sm:w-auto h-14 px-8 bg-[#17776A] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#126156] transition-all shadow-xl shadow-[#17776A]/30 active:scale-95 text-lg">
                            Boshlash <ArrowRight size={20} />
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto h-14 px-8 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95 text-lg">
                            Tizimga kirish
                        </Link>
                    </div>

                    <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-slate-400 text-sm font-medium">
                        <span className="flex items-center gap-2"><ShieldCheck size={18} /> Himoyalangan</span>
                        <span className="flex items-center gap-2"><Lock size={18} /> Shifrlangan</span>
                        <span className="flex items-center gap-2"><UserCheck size={18} /> Verifikatsiya</span>
                    </div>
                </motion.div>

                {/* Right Visual (Abstract Card) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex-1 relative hidden lg:block"
                >
                    <div className="relative w-[500px] h-[600px] mx-auto">
                        {/* Orqa fon bezaklari */}
                        <div className="absolute top-10 -right-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>

                        {/* Asosiy Karta */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#17776A] to-teal-800 rounded-[40px] shadow-2xl p-10 flex flex-col justify-between text-white overflow-hidden border border-white/10">
                            
                            {/* Pattern */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                    <span className="text-3xl font-black">E</span>
                                </div>
                                <h3 className="text-2xl font-bold opacity-80">Enwis ID Card</h3>
                            </div>

                            <div className="relative z-10 space-y-4">
                                <div className="space-y-2">
                                    <div className="h-2 w-1/2 bg-white/20 rounded-full"></div>
                                    <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
                                </div>
                                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                    <div>
                                        <p className="text-xs font-bold uppercase opacity-60 mb-1">Foydalanuvchi</p>
                                        <p className="text-xl font-bold tracking-wide">Aziz Rahimov</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <ShieldCheck size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div 
                            animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-12 top-20 bg-white p-5 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-100"
                        >
                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><ShieldCheck size={20}/></div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Xavfsiz Kirish</p>
                                <p className="text-xs text-slate-500">2FA Yoqilgan</p>
                            </div>
                        </motion.div>

                        <motion.div 
                            animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -left-12 bottom-32 bg-white p-5 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-100"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Zap size={20}/></div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Tezkor Login</p>
                                <p className="text-xs text-slate-500">0.2 soniya</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

            </main>

            {/* ================= FOOTER ================= */}
            <footer className="border-t border-slate-100 py-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-slate-500 text-sm font-medium">© 2026 Enwis Platform. Barcha huquqlar himoyalangan.</p>
                    <div className="flex gap-6 text-sm font-bold text-slate-600">
                        <Link href="#" className="hover:text-[#17776A]">Yordam</Link>
                        <Link href="#" className="hover:text-[#17776A]">Maxfiylik</Link>
                        <Link href="#" className="hover:text-[#17776A]">Shartlar</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}