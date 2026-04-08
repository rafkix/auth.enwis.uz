"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { authService, User } from "@/lib/api/auth"
import { useRouter } from "next/navigation"

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (data: any, redirect?: boolean) => Promise<void>
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
            const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
            if (!token) {
                setLoading(false)
                return
            }
            try {
                const userData = await authService.getMe()
                setUser(userData)
            } catch (error) {
                console.error("Auth Init Failed:", error)
                localStorage.removeItem("access_token")
            } finally {
                setLoading(false)
            }
        }
        initAuth()
    }, [])

    const login = async (data: any, redirect: boolean = true) => {
        try {
            setLoading(true)
            const res = await authService.loginByPhone(data)
            const userData = await authService.getMe()
            setUser(userData)
            if (redirect) router.push("/auth")
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        authService.logout()
        setUser(null)
        router.push("/auth")
    }

    const refreshUser = async () => {
        const token = localStorage.getItem("access_token")
        if (!token) return // Token bo'lmasa so'rov yubormaymiz

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