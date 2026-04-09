'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { authService } from '@/lib/api/auth'

/* ================= SHARED STYLE ================= */

const AUTH_BUTTON =
  "w-full h-[54px] rounded-xl border border-gray-200 bg-white flex items-center justify-center gap-3 shadow-sm hover:shadow-md hover:bg-gray-50 transition active:scale-[0.98]"
/* ================= GOOGLE ================= */

export const GoogleSignInButton = () => {
  const searchParams = useSearchParams()

  const clientId = searchParams.get('client_id')
  const redirectUri = searchParams.get('redirect_uri')
  const state = searchParams.get('state')

  const handleGoogleLogin = () => {
    const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const REDIRECT = `${window.location.origin}/auth/google/callback`

    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth")

    url.searchParams.set("client_id", GOOGLE_ID!)
    url.searchParams.set("redirect_uri", REDIRECT)
    url.searchParams.set("response_type", "code")
    url.searchParams.set("scope", "openid email profile")

    if (state) url.searchParams.set("state", state)

    // 🔥 yangi oynada ochiladi
    window.open(url.toString(), "_blank", "width=500,height=600")
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="auth-btn"
    >
      <img src="/icons/google.svg" className="w-5 h-5" />
      <span>Continue with Google</span>
    </button>
  )
}

/* ================= TELEGRAM ================= */

export const TelegramSignInWidget = () => {
  const ref = useRef<HTMLDivElement>(null)

  const searchParams = useSearchParams()
  const clientId = searchParams.get('client_id')
  const redirectUri = searchParams.get('redirect_uri')
  const state = searchParams.get('state')

  useEffect(() => {
    (window as any).onTelegramAuth = async (user: any) => {
      await authService.telegramLogin(user)

      const nextUrl = clientId
        ? `/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`
        : process.env.NEXT_PUBLIC_APP_URL || 'https://app.enwis.uz'

      window.location.href = nextUrl
    }

    const script = document.createElement("script")
    script.src = "https://telegram.org/js/telegram-widget.js?22"
    script.async = true

    script.setAttribute("data-telegram-login", "EnwisAuthBot")
    script.setAttribute("data-size", "large")
    script.setAttribute("data-userpic", "false")
    script.setAttribute("data-radius", "12")
    script.setAttribute("data-onauth", "onTelegramAuth(user)")

    if (ref.current) {
      ref.current.innerHTML = ""
      ref.current.appendChild(script)
    }
  }, [])

  return (
    <div className="auth-btn p-0 overflow-hidden">
      <div ref={ref} className="w-full flex justify-center scale-[1.05]" />
    </div>
  )
}