"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    ShieldCheck, Smartphone, Wallet, Copy, CheckCircle2, AlertCircle
} from "lucide-react"

// Contextni to'g'ri joydan import qilamiz
import { useAuth } from "@/lib/AuthContext"
import ConnectPhoneModal from "@/components/ConnectPhoneModal"

// Agar bu komponent hali yo'q bo'lsa, pastda vaqtincha kodini yozib turaman
// import ConnectPhoneModal from "@/components/ConnectPhoneModal" 

export default function DashboardPage() {
    const { user } = useAuth()
    const [copied, setCopied] = useState(false)
    const [isPhoneModalOpen, setPhoneModalOpen] = useState(false)

    // 1. DATA PARSING: User obyektidan kerakli kontaktlarni ajratib olamiz
    const phoneContact = user?.contacts.find(c => c.contact_type === "phone")
    const telegramContact = user?.contacts.find(c => c.contact_type === "telegram") // Yoki identity dan qarash mumkin
    const telegramIdentity = user?.identities?.find(i => i.provider === "telegram")

    // ID nusxalash
    const copyToClipboard = () => {
        if (user?.id) {
            navigator.clipboard.writeText(user.id.toString())
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="space-y-6">

            {/* ==================================================================================
                1. KATTA ID CARD (USER INFO) - Yangi Profile strukturasiga moslandi
               ================================================================================== */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#17776A] to-teal-600 rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl shadow-[#17776A]/30"
            >
                {/* Orqa fon bezaklari */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 opacity-20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl font-black shadow-lg flex-shrink-0 overflow-hidden">
                        {user?.profile?.avatar_url ? (
                            <img src={user.profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span>{user?.profile?.full_name?.charAt(0) || "U"}</span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="text-center sm:text-left flex-1 min-w-0">
                        <div className="flex justify-center sm:justify-start">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/10 text-xs font-bold uppercase tracking-wider mb-2">
                                <ShieldCheck size={12} /> One ID: {user?.global_role === 'admin' ? 'Administrator' : 'Foydalanuvchi'}
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-black mb-1 truncate">{user?.profile?.full_name || "Noma'lum"}</h1>
                        <p className="text-white/80 font-medium text-sm mb-4 truncate">@{user?.profile?.username || "username"}</p>

                        {/* UID nusxalash */}
                        <div className="flex items-center justify-center sm:justify-start gap-3">
                            <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                                <span className="text-xs text-white/60 font-bold uppercase hidden sm:inline">ID:</span>
                                <span className="text-lg sm:text-xl font-mono font-black tracking-widest">{user?.id || "-------"}</span>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="w-10 h-10 bg-white text-[#17776A] rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg flex-shrink-0"
                            >
                                {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ==================================================================================
                2. STATUS VIDJETLARI
               ================================================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

                {/* Kontaktlar Holati */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <ShieldCheck size={24} />
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${user?.is_active ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                            {user?.is_active ? "Aktiv" : "Bloklangan"}
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Kontaktlar</p>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${phoneContact?.is_verified ? 'text-green-600' : 'text-slate-400'}`}>
                                Tel {phoneContact?.is_verified ? '✅' : '❌'}
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className={`text-sm font-bold ${telegramIdentity ? 'text-blue-500' : 'text-slate-400'}`}>
                                Tg {telegramIdentity ? '✅' : '❌'}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Ro'yxatdan o'tgan sana */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Smartphone size={24} />
                        </div>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Info</span>
                    </div>
                    <div className="mt-4">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">A'zo bo'lgan sana</p>
                        <h3 className="text-lg font-bold text-slate-900">
                            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "..."}
                        </h3>
                    </div>
                </motion.div>
            </div>

            {/* ==================================================================================
                3. BOG'LANGAN TIZIMLAR (Contacts arraydan olinadi)
               ================================================================================== */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-5 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-slate-900">Bog'langan hisoblar</h3>
                </div>

                <div className="space-y-4">

                    {/* --- TELEFON RAQAM --- */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 gap-3">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-slate-600 flex-shrink-0">
                                <Smartphone size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900">Telefon raqam</p>
                                <p className="text-xs text-slate-500 truncate">
                                    {phoneContact ? phoneContact.value : "Raqam bog'lanmagan"}
                                </p>
                            </div>
                        </div>

                        {phoneContact ? (
                            phoneContact.is_verified ? (
                                <span className="text-emerald-600 bg-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm border border-emerald-100 text-center flex items-center gap-1 justify-center min-w-[100px]">
                                    <CheckCircle2 size={14} /> Tasdiqlangan
                                </span>
                            ) : (
                                <button
                                    onClick={() => setPhoneModalOpen(true)}
                                    className="text-amber-600 bg-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm border border-amber-100 text-center flex items-center gap-1 justify-center min-w-[100px]"
                                >
                                    <AlertCircle size={14} /> Tasdiqlash
                                </button>
                            )
                        ) : (
                            <button
                                onClick={() => setPhoneModalOpen(true)}
                                className="text-white text-xs font-bold bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 min-w-[100px]"
                            >
                                Ulash
                            </button>
                        )}
                    </div>

                    {/* --- TELEGRAM --- */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 gap-3">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#229ED9] flex items-center justify-center shadow-sm text-white flex-shrink-0">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Telegram</p>
                                <p className="text-xs text-slate-500">
                                    {telegramIdentity ? "Ulangan" : (telegramContact ? telegramContact.value : "Bog'lanmagan")}
                                </p>
                            </div>
                        </div>

                        {telegramIdentity ? (
                            <span className="text-emerald-600 bg-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm border border-emerald-100 text-center flex items-center gap-1 justify-center min-w-[100px]">
                                <CheckCircle2 size={14} /> Ulangan
                            </span>
                        ) : (
                            <button
                                onClick={() => alert("Tez kunda!")}
                                className="text-white text-xs font-bold bg-[#229ED9] hover:bg-[#1e8cc2] active:scale-95 transition-all px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 min-w-[100px]"
                            >
                                Ulash
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <ConnectPhoneModal
                isOpen={isPhoneModalOpen}
                onClose={() => setPhoneModalOpen(false)}
            />
        </div>
    )
}