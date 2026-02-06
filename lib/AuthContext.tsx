"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { authService, User } from "@/lib/api"
import { useRouter } from "next/navigation"

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (data: any) => Promise<void>
    logout: () => void
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("access_token")
            if (!token) {
                setLoading(false)
                return
            }
            try {
                // Token bor bo'lsa, userni yuklaymiz
                // Agar token eskirgan bo'lsa, api.ts dagi interceptor avtomatik refresh qiladi
                const userData = await authService.getMe()
                setUser(userData)
            } catch (error) {
                console.error("Auth Init Failed:", error)
                // Agar refresh ham o'xshamasa, logout bo'ladi
            } finally {
                setLoading(false)
            }
        }
        initAuth()
    }, [])

    const login = async (data: any) => {
        await authService.login(data)
        const userData = await authService.getMe()
        setUser(userData)
        router.push("/dashboard")
    }

    const logout = () => {
        authService.logout()
        setUser(null)
        router.push("/login")
    }

    const refreshUser = async () => {
        try {
            const userData = await authService.getMe()
            setUser(userData)
        } catch (error) {
            console.error("User refresh failed", error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) throw new Error("useAuth must be used within AuthProvider")
    return context
}