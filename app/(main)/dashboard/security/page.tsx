"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
    Lock, Shield, Smartphone, Laptop, Trash2, Key, Save, Loader2, AlertTriangle 
} from "lucide-react"
import { authService, Session } from "@/lib/api"

export default function SecurityPage() {
    const [loading, setLoading] = useState(false)
    
    // Parol o'zgartirish state
    const [passData, setPassData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    })

    // Sessiyalar state
    const [sessions, setSessions] = useState<Session[]>([])
    const [loadingSessions, setLoadingSessions] = useState(true)

    // Dastlabki yuklash
    useEffect(() => {
        loadSessions()
    }, [])

    const loadSessions = async () => {
        try {
            const data = await authService.getSessions()
            setSessions(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingSessions(false)
        }
    }

    // Parolni o'zgartirish
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passData.new_password !== passData.confirm_password) {
            return alert("Yangi parollar mos kelmadi")
        }
        setLoading(true)
        try {
            await authService.changePassword(passData)
            alert("Parol muvaffaqiyatli o'zgartirildi!")
            setPassData({ old_password: "", new_password: "", confirm_password: "" })
        } catch (error: any) {
            const msg = error.response?.data?.detail || "Xatolik yuz berdi"
            alert(msg)
        } finally {
            setLoading(false)
        }
    }

    // Sessiyani o'chirish
    const handleTerminate = async (id: string) => {
        if (!confirm("Haqiqatan ham bu qurilmani tizimdan chiqarmoqchimisiz?")) return
        try {
            await authService.terminateSession(id)
            loadSessions() // Ro'yxatni yangilash
        } catch (error) {
            alert("Xatolik yuz berdi")
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Shield className="text-[#17776A]" /> Xavfsizlik
                </h1>
                <p className="text-slate-500 text-sm">Parol va qurilmalarni boshqarish</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. PAROLNI O'ZGARTIRISH */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/40"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Key size={20} className="text-slate-400" /> Parolni yangilash
                    </h3>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Eski parol</label>
                            <input 
                                type="password" 
                                value={passData.old_password}
                                onChange={e => setPassData({...passData, old_password: e.target.value})}
                                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#17776A] outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Yangi parol</label>
                            <input 
                                type="password" 
                                value={passData.new_password}
                                onChange={e => setPassData({...passData, new_password: e.target.value})}
                                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#17776A] outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Parolni tasdiqlang</label>
                            <input 
                                type="password" 
                                value={passData.confirm_password}
                                onChange={e => setPassData({...passData, confirm_password: e.target.value})}
                                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#17776A] outline-none"
                                required
                            />
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full h-12 bg-[#17776A] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#126156] transition-colors disabled:opacity-50 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Saqlash</>}
                        </button>
                    </form>
                </motion.div>

                {/* 2. AKTIV SESSIYALAR */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white p-6 sm:p-8 rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/40"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Smartphone size={20} className="text-slate-400" /> Faol qurilmalar
                    </h3>

                    {loadingSessions ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" /></div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center text-slate-400 py-10">Faol sessiyalar yo'q</div>
                    ) : (
                        <div className="space-y-4">
                            {sessions.map((session) => (
                                <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-500 shadow-sm">
                                            {session.user_agent?.toLowerCase().includes("mobile") ? <Smartphone size={20} /> : <Laptop size={20} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 line-clamp-1 w-40">
                                                {session.user_agent || "Noma'lum qurilma"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(session.created_at).toLocaleDateString()} da kirilgan
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleTerminate(session.id)}
                                        className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Chiqarib yuborish"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="mt-6 bg-amber-50 p-4 rounded-xl flex items-start gap-3 border border-amber-100">
                        <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                        <p className="text-xs text-amber-800 leading-relaxed">
                            Agar notanish qurilmani ko'rsangiz, uni darhol o'chirib tashlang va parolingizni yangilang.
                        </p>
                    </div>
                </motion.div>

            </div>
        </div>
    )
}