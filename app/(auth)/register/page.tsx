"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, User, AtSign, Phone, Lock, Loader2, Mail, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation" // Router qo'shildi
import { useAuth } from "@/lib/AuthContext" // Context manzili

export default function RegisterPage() {
    const { refreshUser } = useAuth()
    const router = useRouter()
    
    const [loading, setLoading] = useState(false)
    const [agreed, setAgreed] = useState(true)
    
    // Parol ko'rsatish/yashirish
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        phone: "+998",
        email: "",
        password: "",
        confirm_password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value
        if (!val.startsWith("+998")) val = "+998"
        val = val.replace(/[^0-9+]/g, "") // Faqat raqam va + qolsin
        if (val.length > 13) return 
        setFormData(prev => ({ ...prev, phone: val }))
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!agreed) return alert("Iltimos, shartlarga rozilik bildiring")
        if (formData.password !== formData.confirm_password) return alert("Parollar mos kelmadi")
        if (formData.phone.length !== 13) return alert("Telefon raqam noto'g'ri")

        setLoading(true)
        try {
            const { authService } = await import("@/lib/api")
            
            // 1. Ro'yxatdan o'tish
            await authService.register({
                full_name: formData.full_name,
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            })
            
            // 2. Userni yangilash
            await refreshUser()
            
            // 3. Dashboardga o'tish
            router.push("/dashboard")

        } catch (error: any) {
            console.error(error)
            let msg = "Xatolik yuz berdi"
            if (error.response?.data?.detail) {
                const detail = error.response.data.detail
                msg = Array.isArray(detail) ? detail[0].msg : detail
            }
            alert(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="w-full max-w-[480px]" // Login formadan biroz kengroq
        >
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-3 p-2">
                    <div className="w-full h-full bg-[#17776A] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-inner">E</div>
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-900">ENWIS ID</span>
            </div>

            {/* Asosiy Karta */}
            <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 relative overflow-hidden">
                {/* Gradient Chiziq */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#17776A] to-teal-400" />
                
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-black text-slate-900 mb-1">Ro'yxatdan o'tish</h1>
                    <p className="text-slate-500 text-xs sm:text-sm">Yangi hisob yaratish uchun ma'lumotlarni kiriting</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    
                    {/* To'liq ism */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <User size={18} />
                        </div>
                        <input 
                            name="full_name" 
                            value={formData.full_name} 
                            onChange={handleChange} 
                            placeholder="To'liq ism" 
                            className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#17776A] focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400" 
                            required 
                        />
                    </div>

                    {/* Username & Phone (Grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <AtSign size={18} />
                            </div>
                            <input 
                                name="username" 
                                value={formData.username} 
                                onChange={handleChange} 
                                placeholder="Username" 
                                className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#17776A] focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400" 
                                required 
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Phone size={18} />
                            </div>
                            <input 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handlePhoneChange} 
                                placeholder="+998" 
                                maxLength={13}
                                className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#17776A] focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Mail size={18} />
                        </div>
                        <input 
                            name="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="Email manzili" 
                            className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#17776A] focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400" 
                            required 
                        />
                    </div>

                    {/* Parollar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                className="w-full h-12 pl-12 pr-10 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#17776A] focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400" 
                                required 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#17776A]">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock size={18} />
                            </div>
                            <input 
                                name="confirm_password" 
                                type={showConfirmPassword ? "text" : "password"} 
                                value={formData.confirm_password} 
                                onChange={handleChange} 
                                placeholder="Tasdiqlash" 
                                className="w-full h-12 pl-12 pr-10 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#17776A] focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400" 
                                required 
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#17776A]">
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    
                    {/* Shartlar */}
                    <div className="flex items-start gap-2 px-1 pt-2">
                        <input 
                            type="checkbox" 
                            checked={agreed} 
                            onChange={(e) => setAgreed(e.target.checked)} 
                            className="mt-1 w-4 h-4 accent-[#17776A] rounded border-gray-300 focus:ring-[#17776A]" 
                        />
                        <span className="text-xs text-slate-500 leading-tight">
                            Men <Link href="/terms" className="text-[#17776A] font-bold hover:underline">Foydalanish shartlari</Link> va <Link href="/privacy" className="text-[#17776A] font-bold hover:underline">Maxfiylik siyosati</Link>ga roziman.
                        </span>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading || !agreed} 
                        className="w-full h-14 bg-[#17776A] text-white rounded-2xl font-bold shadow-lg shadow-[#17776A]/20 flex items-center justify-center gap-2 mt-2 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Ro'yxatdan o'tish <ArrowRight size={18} /></>}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-slate-50">
                    <p className="text-xs text-slate-500">
                        Allaqachon hisobingiz bormi? <Link href="/login" className="text-[#17776A] font-bold hover:underline">Kirish</Link>
                    </p>
                </div>
            </div>
        </motion.div>
    )
}