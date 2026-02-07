"use client"

import { useState, Suspense } from "react"
import { motion } from "framer-motion"
import { ArrowRight, User, Lock, Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { login } = useAuth()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        login: "",
        password: ""
    })

    // URL'dan OAuth parametrlarini olish
    const clientId = searchParams.get("client_id")
    const redirectUri = searchParams.get("redirect_uri")
    const scope = searchParams.get("scope")
    const state = searchParams.get("state")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await login({
                login: formData.login,
                password: formData.password
            })
            
            // Agar boshqa saytdan (cefr.enwis.uz kabi) kelgan bo'lsa
            if (clientId) {
                const query = new URLSearchParams({
                    client_id: clientId,
                    redirect_uri: redirectUri || "",
                    scope: scope || "profile",
                    state: state || ""
                }).toString()
                
                router.push(`/oauth/authorize?${query}`)
            } else {
                // Oddiy login bo'lsa shaxsiy kabinetga
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
            {/* Markaziy Logo */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-3 p-2">
                    <div className="w-full h-full bg-[#17776A] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-inner">E</div>
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Enwis ID</span>
            </div>

            <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#17776A] to-teal-400" />

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-slate-900 mb-1">Xush kelibsiz!</h1>
                    <p className="text-slate-500 text-xs sm:text-sm">Yagona login tizimi orqali kiring</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Login maydoni */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <User size={18} />
                        </div>
                        <input
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            placeholder="Email yoki Username"
                            className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#17776A] focus:bg-white outline-none text-sm font-bold text-slate-900 transition-all placeholder:font-normal"
                            required
                        />
                    </div>

                    {/* Parol maydoni */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Lock size={18} />
                        </div>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Parol"
                            className="w-full h-12 pl-12 pr-12 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#17776A] focus:bg-white outline-none text-sm font-bold text-slate-900 transition-all placeholder:font-normal"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#17776A]"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <Link href="/forgot-password" fatal-error className="text-xs font-semibold text-slate-400 hover:text-[#17776A]">
                            Parolni unutdingizmi?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-[#17776A] text-white rounded-2xl font-bold shadow-lg shadow-[#17776A]/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Kirish <ArrowRight size={18} /></>}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-slate-50">
                    <p className="text-xs text-slate-500">
                        Hisobingiz yo'qmi? <Link href="/register" className="text-[#17776A] font-bold hover:underline">Ro'yxatdan o'tish</Link>
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <Suspense fallback={<div className="flex items-center justify-center"><Loader2 className="animate-spin text-[#17776A]" /></div>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}