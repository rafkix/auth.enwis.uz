"use client"

import { useState, Suspense } from "react" // Suspense qo'shildi
import { motion } from "framer-motion"
import { ArrowRight, User, Lock, Loader2, Eye, EyeOff, Smartphone } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"

// 1. Asosiy login mantiqi alohida komponentga olindi
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
                login: formData.login, // formData - kichik harf bilan!
                password: formData.password
            })
            
            if (clientId) {
                const query = new URLSearchParams({
                    client_id: clientId,
                    redirect_uri: redirectUri || "",
                    scope: scope || "profile",
                    state: state || ""
                }).toString()
                
                router.push(`/oauth/authorize?${query}`)
            } else {
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
            {/* ... Sizning barcha UI kodingiz (Logo, Card, Form) shu yerda qoladi ... */}
            <div className="flex flex-col items-center mb-6">
                 {/* Logo qismi */}
            </div>
            
            <div className="bg-white rounded-[32px] ...">
                <form onSubmit={handleLogin} className="space-y-4">
                    <input name="login" value={formData.login} onChange={handleChange} ... />
                    <input name="password" value={formData.password} onChange={handleChange} type={showPassword ? "text" : "password"} ... />
                    <button type="submit" disabled={loading}>...</button>
                </form>
            </div>
        </motion.div>
    )
}

// 2. Eksport qilinadigan asosiy funksiya Suspense bilan o'raldi
export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>}>
            <LoginForm />
        </Suspense>
    )
}