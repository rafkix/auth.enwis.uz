"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, User, Lock, Loader2, Eye, EyeOff, Smartphone } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/AuthContext" // Or lib/AuthContext

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams() // URL parametrlarini o'qish uchun
    const { login } = useAuth()
    const [loading, setLoading] = useState(false)
    
    // URL parametrlari (OAuth uchun)
    const clientId = searchParams.get("client_id")
    const redirectUri = searchParams.get("redirect_uri")
    const scope = searchParams.get("scope")
    const state = searchParams.get("state")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await login({
                login: FormData.login,
                password: FormData.password
            })
            
            // AGAR OAUTH SO'ROVI BO'LSA
            if (clientId) {
                // Hamma parametrlarni saqlab qolgan holda Consent sahifasiga yuboramiz
                const query = new URLSearchParams({
                    client_id: clientId!,
                    redirect_uri: redirectUri!,
                    scope: scope || "profile",
                    state: state || ""
                }).toString()
                
                router.push(`/login/oauth/authorize?${query}`)
            } else {
                // Oddiy login bo'lsa dashboardga
                router.push("/dashboard")
            }
        } catch (error: any) {
            alert(error.response?.data?.detail || "Login yoki parol noto'g'ri")
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
                    {/* Replace with your actual logo logic if needed */}
                    <div className="w-full h-full bg-[#17776A] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-inner">E</div>
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-900">ENWIS ID</span>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 relative overflow-hidden">
                {/* Gradient Top Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#17776A] to-teal-400" />

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-black text-slate-900 mb-1">Xush kelibsiz!</h1>
                    <p className="text-slate-500 text-xs sm:text-sm">Davom etish uchun tizimga kiring</p>
                </div>

                {/* SOCIAL LOGIN BUTTONS */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {/* Google */}
                    <button
                        type="button"
                        onClick={() => alert("Google login tez orada!")}
                        className="h-12 bg-slate-50 border border-slate-200 hover:bg-white hover:border-slate-300 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] group"
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        Google
                    </button>

                    {/* Telegram */}
                    <button
                        type="button"
                        onClick={() => router.push('/login/telegram')} // Or specific telegram login logic
                        className="h-12 bg-[#229ED9]/10 border border-[#229ED9]/20 hover:bg-[#229ED9]/20 text-[#229ED9] font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] group"
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                        Telegram
                    </button>
                </div>

                <div className="relative flex py-2 items-center mb-6">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink mx-4 text-slate-300 text-[10px] uppercase font-bold tracking-widest">Login orqali</span>
                    <div className="flex-grow border-t border-slate-100"></div>
                </div>

                {/* FORM START */}
                <form onSubmit={handleLogin} className="space-y-4">

                    {/* Login Input (Email/Username/Phone) */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <User size={18} />
                        </div>
                        <input
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            placeholder="Email, Username yoki Telefon"
                            className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#17776A] focus:bg-white outline-none text-sm font-bold text-slate-900 transition-all placeholder:text-slate-400"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Lock size={18} />
                        </div>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"} // Type Toggling
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Parol"
                            className="w-full h-12 pl-12 pr-12 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#17776A] focus:bg-white outline-none text-sm font-bold text-slate-900 transition-all placeholder:text-slate-400"
                            required
                        />
                        {/* Show/Hide Button */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#17776A] transition-colors focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="flex justify-between items-center px-1">
                        <Link href="/login/phone" className="text-xs font-semibold text-slate-400 hover:text-[#17776A] transition-colors flex items-center gap-1">
                            <Smartphone size={14} /> Telefon orqali kirish
                        </Link>
                        <Link href="/forgot-password" className="text-xs font-semibold text-slate-400 hover:text-[#17776A] transition-colors">
                            Parolni unutdingizmi?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-[#17776A] text-white rounded-2xl font-bold shadow-lg shadow-[#17776A]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Kirish <ArrowRight size={18} /></>}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-slate-50">
                    <p className="text-xs text-slate-500">
                        Hali hisobingiz yo'qmi? <Link href="/register" className="text-[#17776A] font-bold hover:underline">Ro'yxatdan o'tish</Link>
                    </p>
                </div>
            </div>
        </motion.div>
    )
}