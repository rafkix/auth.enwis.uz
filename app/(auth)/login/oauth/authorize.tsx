"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ShieldCheck, Loader2 } from "lucide-react"

export default function AuthorizePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [clientName, setClientName] = useState("Yuklanmoqda...")

    const params = {
        client_id: searchParams.get("client_id"),
        redirect_uri: searchParams.get("redirect_uri"),
        scope: searchParams.get("scope"),
        state: searchParams.get("state"),
    }

    useEffect(() => {
        // Backend'dan client nomini va borligini tekshiramiz
        fetch(`https://api.auth.enwis.uz/api/v1/oauth/authorize/validate?client_id=${params.client_id}&redirect_uri=${params.redirect_uri}`)
            .then(res => res.json())
            .then(data => setClientName(data.name))
            .catch(() => setClientName("Noma'lum ilova"))
    }, [])

    const handleApprove = async () => {
        setLoading(true)
        try {
            const res = await fetch('https://api.auth.enwis.uz/api/v1/oauth/authorize', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Tokenni olish
                },
                body: JSON.stringify(params)
            })
            const data = await res.json()
            if (data.redirect_to) {
                window.location.href = data.redirect_to // Client saytiga qaytish
            }
        } catch (e) {
            alert("Xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-[32px] shadow-2xl max-w-md w-full border border-slate-100">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-teal-50 text-[#17776A] rounded-2xl flex items-center justify-center">
                        <ShieldCheck size={32} />
                    </div>
                </div>
                
                <h1 className="text-xl font-black text-center text-slate-900 mb-2">Ruxsat so'ralmoqda</h1>
                <p className="text-center text-slate-500 text-sm mb-8">
                    <span className="font-bold text-slate-900">{clientName}</span> ilovasi sizning profilingizga ruxsat so'ramoqda.
                </p>

                <div className="space-y-3">
                    <button onClick={handleApprove} disabled={loading} className="w-full h-12 bg-[#17776A] text-white rounded-xl font-bold flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : "Ruxsat berish"}
                    </button>
                    <button onClick={() => router.back()} className="w-full h-12 bg-slate-100 text-slate-600 rounded-xl font-bold">
                        Bekor qilish
                    </button>
                </div>
            </motion.div>
        </div>
    )
}