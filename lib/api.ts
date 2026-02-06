import axios, { AxiosError } from 'axios'

// ==============================================================================
// 1. TYPES (Backend Schemasiga 100% mos)
// ==============================================================================

export type VerificationPurpose =
  | 'register'
  | 'reset_password'
  | 'verify_email'
  | 'verify_phone'

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface UserProfile {
  full_name: string
  username: string
  avatar_url?: string | null
  bio?: string | null
}

export interface PhoneLoginResponse {
  message: string
  method: 'sms' | 'telegram'
  debug_code?: string // Test uchun
  telegram_url: string // Backenddan keladigan tayyor link
}

export interface UserProfileUpdate {
  full_name?: string
  bio?: string | null
  avatar_url?: string | null
  gender?: string | null
  birth_date?: string | null // YYYY-MM-DD formatida yuboriladi
}

export interface PasswordChangeData {
  old_password: string
  new_password: string
  confirm_password: string
}

export interface Session {
  id: string
  user_agent: string
  ip_address: string
  created_at: string
  is_current: boolean
}

export interface UserContact {
  id: number
  contact_type: 'email' | 'phone' | 'telegram'
  value: string
  is_verified: boolean
  is_primary: boolean
}

export interface UserRole {
  name: 'user' | 'admin' | 'developer'
}

// ASOSIY USER
export interface User {
  id: number
  is_active: boolean
  global_role: string
  created_at: string

  // Ichma-ich obyektlar
  profile: UserProfile | null
  contacts: UserContact[]
  // identities va connected_services kerak bo'lsa shu yerga qo'shiladi
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface RegisterData {
  full_name: string
  username: string
  email: string
  phone: string
  password: string
}

export interface LoginData {
  login: string
  password: string
}

// ==============================================================================
// 2. CONFIG & AXIOS INSTANCE
// ==============================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// ==============================================================================
// 3. INTERCEPTORS (Eng muhim qism)
// ==============================================================================

// Request: Har bir so'rovga Access Token qo'shish
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response: 401 xatosini ushlab, Refresh Token ishlatish
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // Agar xato 401 bo'lsa va biz hali refresh qilib ko'rmagan bo'lsak
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // Cheksiz siklga tushmaslik uchun

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) throw new Error('No refresh token')

        // Backendga refresh so'rovini yuborish (Header orqali)
        // Backend: router.post("/refresh") -> x-refresh-token header
        const { data } = await axios.post<AuthResponse>(
          `${API_URL}/auth/refresh`,
          {},
          { headers: { 'x-refresh-token': refreshToken } }
        )

        // Yangi tokenlarni saqlash
        authService.saveTokens(data)

        // Eski so'rovga yangi tokenni qo'yib, qayta yuborish
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        // Agar Refresh Token ham o'lsa -> Logout
        authService.logout()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

// ==============================================================================
// 4. SERVICE FUNCTIONS
// ==============================================================================

export const authService = {
  saveTokens(data: AuthResponse) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
    }
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  },

  async updateProfile(data: UserProfileUpdate) {
    // PUT /users/profile ga so'rov yuboramiz
    // Backend yangilangan User obyektini qaytaradi
    const response = await api.put<User>('/auth/profile', data)
    return response.data
  },

  async uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('file', file) // Backend "file" deb kutyapti (parametr nomi)

    const response = await api.post<User>('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // <--- BU JUDA MUHIM
      },
    })
    return response.data
  },
  
  async telegramLogin(data: TelegramUser) {
    // Backend: @router.post("/auth/login/telegram")
    const response = await api.post<AuthResponse>("/auth/login/telegram", data);
    this.saveTokens(response.data);
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await api.post<AuthResponse>('/auth/register', data)
    this.saveTokens(response.data)
    return response.data
  },

  async login(data: LoginData) {
    const response = await api.post<AuthResponse>('/auth/login', data)
    this.saveTokens(response.data)
    return response.data
  },
  // XAVFSIZLIK
  async changePassword(data: PasswordChangeData) {
    const response = await api.put('/auth/security/password', data)
    return response.data
  },

  async getSessions() {
    const response = await api.get<Session[]>('/auth/security/sessions')
    return response.data
  },

  async terminateSession(sessionId: string) {
    const response = await api.delete(`/auth/security/sessions/${sessionId}`)
    return response.data
  },

  async getMe() {
    // /auth/me endpointi orqali userni to'liq olamiz
    const response = await api.get<User>('/auth/me')
    return response.data
  },
  async sendPhoneCode(phone: string) {
    // Bu yerda telegram_url qaytadi
    const response = await api.post<PhoneLoginResponse>(
      `/auth/send-code?target=${encodeURIComponent(phone)}&purpose=login`
    )
    return response.data
  },

  // 2. LOGIN QILISH (Muhim joyi shu!)
  async verifyPhoneCode(phone: string, code: string) {
    // DIQQAT: Bu yerda /verify-code EMAS, balki /login/phone bo'lishi kerak!
    // Chunki bizga Token kerak.
    const response = await api.post<AuthResponse>('/auth/login/phone', {
      phone,
      code,
    })

    // Tokenni saqlaymiz
    this.saveTokens(response.data)
    return response.data
  },
}
