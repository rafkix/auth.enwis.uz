import api from './axios'
import {
  GoogleLoginPayload,
  TelegramLoginPayload,
  SendOtpPayload,
  PhoneLoginPayload,
  PhoneLoginResponse,
  AuthResponse,
  UserMeResponse,
} from '../types/auth'

export const authService = {
  // Google: { id_token: "..." }
  googleLogin: async (payload: GoogleLoginPayload) => {
    const response = await api.post<AuthResponse>('/auth/google', payload)
    if (response.data.access_token) authService.saveTokens(response.data)
    return response.data
  },

  // Telegram: { id, hash, ... }
  telegramLogin: async (payload: TelegramLoginPayload) => {
    const response = await api.post<AuthResponse>('/auth/telegram', payload)
    if (response.data.access_token) authService.saveTokens(response.data)
    return response.data
  },

  // OTP yuborish: { phone: "+998..." }
  sendOtp: (payload: SendOtpPayload) => {
    return api.post<string>('/auth/send-otp', payload)
  },
  
  sendOtpBot: (payload: SendOtpPayload) => {
    return api.post<string>('/auth/bot/send-otp', payload)
  },

  // OTP tasdiqlash: { phone, code }
  loginByPhone: async (payload: PhoneLoginPayload) => {
    const response = await api.post<PhoneLoginResponse>('/auth/login/phone', payload)
    // Swagger structure: response.data.token.access_token
    if (response.data.token?.access_token) {
      authService.saveTokens(response.data.token)
    }
    return response.data
  },

  getMe: () => api.get<UserMeResponse>('/auth/me').then(res => res.data),

  logout: async () => {
    try { await api.post('/auth/logout') } 
    finally { 
      localStorage.clear()
      window.location.href = '/auth'
    }
  },

  saveTokens: (data: AuthResponse) => {
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('login_at', Date.now().toString())
  },
}