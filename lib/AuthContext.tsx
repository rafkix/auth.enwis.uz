'use client'

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { authService } from '@/lib/api/authService'

type UserRole = 'user' | 'admin' | 'teacher'

export type UserProfile = {
    full_name?: string | null
    username?: string | null
    avatar_url?: string | null
    bio?: string | null
    birth_date?: string | null
    language?: string | null
    timezone?: string | null
    created_at: string
    updated_at: string
}

export type UserContact = {
    id: number
    contact_type: 'email' | 'phone' | 'telegram'
    value: string
    normalized_value: string
    is_verified: boolean
    is_primary: boolean
    created_at: string
    updated_at: string
}

export type UserIdentity = {
    id: number
    provider: 'google' | 'telegram' | 'phone'
    provider_id: string
    created_at: string
    updated_at: string
}

export type UserMeResponse = {
    id: number
    is_active: boolean
    global_role: UserRole
    created_at: string
    updated_at: string
    profile?: UserProfile | null
    contacts: UserContact[]
    identities: UserIdentity[]
}

type AuthContextType = {
    user: UserMeResponse | null
    isAuthenticated: boolean
    isLoading: boolean
    initialized: boolean
    setUser: React.Dispatch<React.SetStateAction<UserMeResponse | null>>
    refreshUser: () => Promise<UserMeResponse | null>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserMeResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [initialized, setInitialized] = useState(false)

    const clearAuthState = useCallback(() => {
        authService.clearTokens()
        setUser(null)
    }, [])

    const loadMe = useCallback(async (): Promise<UserMeResponse | null> => {
        const me = await authService.getMe()
        setUser(me)
        return me
    }, [])

    const refreshUser = useCallback(async (): Promise<UserMeResponse | null> => {
        const accessToken = authService.getAccessToken()
        const refreshToken = authService.getRefreshToken()

        if (!accessToken && !refreshToken) {
            setUser(null)
            return null
        }

        try {
            return await loadMe()
        } catch (error: any) {
            const status = error?.response?.status

            // access token eskirgan bo‘lsa refresh qilib qayta urinib ko‘ramiz
            if (status === 401 && refreshToken) {
                try {
                    await authService.refresh()
                    return await loadMe()
                } catch {
                    clearAuthState()
                    return null
                }
            }

            // 403 yoki boshqa xatolarda ham state ni tozalaymiz
            clearAuthState()
            return null
        }
    }, [clearAuthState, loadMe])

    const logout = useCallback(async () => {
        try {
            await authService.logout()
        } catch {
            clearAuthState()
            window.location.href = 'https://auth.enwis.uz'
        }
    }, [clearAuthState])

    useEffect(() => {
        let mounted = true

        const bootstrap = async () => {
            try {
                if (!mounted) return
                setIsLoading(true)
                await refreshUser()
            } finally {
                if (!mounted) return
                setIsLoading(false)
                setInitialized(true)
            }
        }

        bootstrap()

        return () => {
            mounted = false
        }
    }, [refreshUser])

    const value = useMemo<AuthContextType>(
        () => ({
            user,
            isAuthenticated: !!user,
            isLoading,
            initialized,
            setUser,
            refreshUser,
            logout,
        }),
        [user, isLoading, initialized, refreshUser, logout]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider')
    }

    return context
}