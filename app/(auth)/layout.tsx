"use client"

import { useAuth } from "@/lib/AuthContext"
import { Loader2 } from "lucide-react"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { loading, user } = useAuth()

    // 1. YUKLASH HOLATI
    // Agar AuthContext hali ishini bitirmagan bo'lsa (loading) 
    // yoki User allaqachon tizimda bo'lsa (demak u Dashboardga yo'naltirilmoqda)
    // Biz Login formasini yashirib, chiroyli Spinner ko'rsatamiz.
    if (loading || user) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center relative overflow-hidden">
                {/* Orqa fon (bir xillik uchun) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[10%] -right-[10%] w-72 h-72 sm:w-[500px] sm:h-[500px] bg-[#17776A]/5 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-[10%] -left-[10%] w-72 h-72 sm:w-[500px] sm:h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
                </div>

                {/* Spinner */}
                <div className="flex flex-col items-center gap-4 z-10 animate-pulse">
                    <div className="p-4 bg-white rounded-2xl shadow-xl shadow-slate-200/50">
                        <Loader2 className="animate-spin text-[#17776A]" size={32} />
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    // 2. AGAR USER TIZIMDA BO'LMASA -> FORMALARNI KO'RSATAMIZ
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">

            {/* ================= ORQA FON BEZAKLARI ================= */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Yuqori o'ng burchakdagi Yashil (Teal) nur */}
                <div className="absolute -top-[10%] -right-[10%] w-72 h-72 sm:w-[500px] sm:h-[500px] bg-[#17776A]/5 rounded-full blur-[100px]" />

                {/* Pastki chap burchakdagi Ko'k nur */}
                <div className="absolute -bottom-[10%] -left-[10%] w-72 h-72 sm:w-[500px] sm:h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            {/* ================= SAHIFA MAZMUNI ================= */}
            <div className="relative z-10 w-full flex justify-center">
                {children}
            </div>

            {/* Footer Copyright */}
            <div className="absolute bottom-4 text-[10px] text-slate-400 font-medium tracking-widest uppercase opacity-60">
                © Enwis Platform 2026
            </div>
        </div>
    )
}