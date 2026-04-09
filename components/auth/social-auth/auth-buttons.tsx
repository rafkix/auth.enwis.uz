'use client'

import React, { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { authService } from '@/lib/api/auth'

/* ================= COMMON STYLE ================= */

const AUTH_BTN =
  "w-full h-[54px] rounded-xl border border-gray-200 bg-white flex items-center justify-center gap-3 shadow-sm hover:shadow-md hover:bg-gray-50 active:scale-[0.98] transition"

/* ================= GOOGLE ================= */

export const GoogleSignInButton = () => {
  const searchParams = useSearchParams()

  const clientId = searchParams.get('client_id')
  const redirectUri = searchParams.get('redirect_uri')
  const state = searchParams.get('state')

  const handleGoogleLogin = () => {
    const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!GOOGLE_ID) {
      alert('Google client ID yoq')
      return
    }

    const REDIRECT = `${window.location.origin}/auth/google/callback`

    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth")

    url.searchParams.set("client_id", GOOGLE_ID)
    url.searchParams.set("redirect_uri", REDIRECT)
    url.searchParams.set("response_type", "code")
    url.searchParams.set("scope", "openid email profile")
    url.searchParams.set("prompt", "select_account")

    if (state) url.searchParams.set("state", state)

    // 🔥 popup ochish
    const popup = window.open(
      url.toString(),
      "googleLogin",
      "width=500,height=600"
    )

    // 🔥 popup yopilganda refresh
    const timer = setInterval(() => {
      if (popup?.closed) {
        clearInterval(timer)
        window.location.reload()
      }
    }, 500)
  }

  return (
    <button onClick={handleGoogleLogin} className={AUTH_BTN}>
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        className="w-5 h-5"
      />
      <span className="font-semibold text-gray-700">
        Continue with Google
      </span>
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
    let mounted = true

      ; (window as any).onTelegramAuth = async (user: any) => {
        try {
          await authService.telegramLogin(user)

          const nextUrl = clientId
            ? `/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`
            : process.env.NEXT_PUBLIC_APP_URL || 'https://app.enwis.uz'

          window.location.href = nextUrl
        } catch (err) {
          console.error(err)
          alert('Telegram login error')
        }
      }

    if (!ref.current || !mounted) return

    // 🔥 reset
    ref.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://telegram.org/js/telegram-widget.js?22"
    script.async = true

    script.setAttribute("data-telegram-login", "EnwisAuthBot")
    script.setAttribute("data-size", "large")
    script.setAttribute("data-userpic", "false")
    script.setAttribute("data-radius", "12")
    script.setAttribute("data-request-access", "write")
    script.setAttribute("data-onauth", "onTelegramAuth(user)")

    ref.current.appendChild(script)

    return () => {
      mounted = false
    }
  }, [clientId, redirectUri, state])

  return (
    <div className={AUTH_BTN + " p-0 overflow-hidden"}>
      <div className="w-full flex justify-center scale-[1.05]" ref={ref} />
    </div>
  )
}