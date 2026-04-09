'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { authService } from '@/lib/api/auth'

/* ================= SHARED STYLE ================= */

const BUTTON_WRAPPER =
  'w-full h-[52px] rounded-xl border border-gray-200 bg-white flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition'

/* ================= GOOGLE ================= */

export const GoogleSignInButton = () => {
  const ref = useRef<HTMLDivElement>(null)

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

    if (ref.current) {
      ref.current.innerHTML = ''

        ; (window as any).google.accounts.id.renderButton(ref.current, {
          theme: 'outline',
          size: 'large',
          width: 999,
        })
    }
  }, [clientId, redirectUri, state])

  return (
    <div className="relative w-full">

      {/* FAKE PREMIUM BUTTON */}
      <button className="w-full h-[54px] rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition flex items-center justify-center gap-3 shadow-sm hover:shadow-md">

        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="w-5 h-5"
        />

        <span className="font-semibold text-gray-700">
          Continue with Google
        </span>
      </button>

      {/* REAL GOOGLE (INVISIBLE) */}
      <div
        ref={ref}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
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
    ; (window as any).onTelegramAuth = async (user: any) => {
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
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')

    if (ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(script)
    }
  }, [clientId, redirectUri, state])

  return (
    <div className="relative w-full">

      {/* FAKE PREMIUM BUTTON */}
      <button className="w-full h-[54px] rounded-xl bg-[#229ED9] text-white hover:bg-[#1c80b0] transition flex items-center justify-center gap-3 shadow-sm hover:shadow-md">

        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-white"
        >
          <path d="M9.78 18.65l-.39 5.47c.56 0 .8-.24 1.1-.52l2.63-2.5 5.46 3.98c1 .55 1.72.26 1.97-.92l3.56-16.67c.32-1.5-.54-2.08-1.52-1.72L1.2 9.6c-1.45.57-1.43 1.38-.25 1.75l5.4 1.69L19.1 6.5c.6-.4 1.15-.18.7.22" />
        </svg>

        <span className="font-semibold">
          Continue with Telegram
        </span>
      </button>

      {/* REAL TELEGRAM */}
      <div
        ref={ref}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  )
}