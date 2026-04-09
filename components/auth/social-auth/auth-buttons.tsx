'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { authService } from '@/lib/api/auth'

/* ================= SHARED STYLE ================= */

const BUTTON_WRAPPER =
  'w-full h-[52px] rounded-xl border border-gray-200 bg-white flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition'

/* ================= GOOGLE ================= */

export const GoogleSignInButton = () => {
  const searchParams = useSearchParams()

  const clientId = searchParams.get('client_id')
  const redirectUri = searchParams.get('redirect_uri')
  const state = searchParams.get('state')

  useEffect(() => {
    const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!(window as any).google || !GOOGLE_ID) return

      ; (window as any).google.accounts.id.initialize({
        client_id: GOOGLE_ID,
        callback: async (response: any) => {
          await authService.googleLogin({
            id_token: response.credential,
          })

          const nextUrl = clientId
            ? `/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`
            : process.env.NEXT_PUBLIC_APP_URL || 'https://app.enwis.uz'

          window.location.href = nextUrl
        },
      })
  }, [])

  const handleLogin = () => {
    ; (window as any).google.accounts.id.prompt()
  }

  return (
    <button
      onClick={handleLogin}
      className="w-full h-[54px] rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition"
    >
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
    ;(window as any).onTelegramAuth = async (user: any) => {
      await authService.telegramLogin(user)

      const nextUrl = clientId
        ? `/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`
        : process.env.NEXT_PUBLIC_APP_URL || 'https://app.enwis.uz'

      window.location.href = nextUrl
    }

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true

    script.setAttribute('data-telegram-login', 'EnwisAuthBot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-radius', '12')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')

    if (ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(script)
    }
  }, [])

  return (
    <div className="w-full h-[54px] flex items-center justify-center border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div ref={ref} className="scale-[0.95]" />
    </div>
  )
}