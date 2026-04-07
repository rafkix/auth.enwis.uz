'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '@/lib/api/authService'
import { useAuth } from '@/lib/AuthContext'

function buildSsoParams(searchParams: ReturnType<typeof useSearchParams>) {
  const clientId = searchParams.get('client_id')
  const redirectUri = searchParams.get('redirect_uri')
  const state = searchParams.get('state')

  const hasSsoParams = Boolean(clientId && redirectUri && state)

  return {
    clientId,
    redirectUri,
    state,
    hasSsoParams,
  }
}

async function handlePostLoginRedirect(options: {
  searchParams: ReturnType<typeof useSearchParams>
  defaultRedirect?: string | null
}) {
  const { searchParams, defaultRedirect } = options
  const { clientId, redirectUri, state, hasSsoParams } = buildSsoParams(searchParams)

  // Agar bu login boshqa subdomain/app uchun boshlangan bo‘lsa,
  // auth service orqali auth code redirect olamiz
  if (hasSsoParams && clientId && redirectUri && state) {
    const authorizeRes = await authService.authorize({
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
    })

    if (authorizeRes.redirect_to) {
      window.location.href = authorizeRes.redirect_to
      return
    }
  }

  // Oddiy login flow
  if (defaultRedirect) {
    window.location.href = defaultRedirect
    return
  }

  window.location.href = 'https://app.enwis.uz'
}

/**
 * GOOGLE SIGN IN
 */
export const GoogleSignInButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()

  const handleGoogleLogin = () => {
    const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!GOOGLE_ID || !(window as any).google) {
      alert('Google xizmati yuklanmadi. Sahifani yangilang.')
      return
    }

    setIsLoading(true)

    try {
      ; (window as any).google.accounts.id.initialize({
        client_id: GOOGLE_ID,
        callback: async (response: any) => {
          try {
            setIsLoading(true)

            const res = await authService.googleLogin({
              id_token: response.credential,
            })

            // tokenlarni authService o‘zi saqlaydi
            await refreshUser()

            await handlePostLoginRedirect({
              searchParams,
              defaultRedirect: res.redirect_to,
            })
          } catch (error: any) {
            console.error('Google login error:', error?.response?.data || error)
            alert(error?.response?.data?.detail || 'Google orqali kirishda xatolik yuz berdi')
          } finally {
            setIsLoading(false)
          }
        },
      })

        ; (window as any).google.accounts.id.prompt()
    } catch (err) {
      setIsLoading(false)
      console.error(err)
    }
  }

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="flex h-[48px] w-full items-center justify-center gap-3 rounded-xl bg-white px-4 text-[15px] font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98] disabled:opacity-70"
    >
      {isLoading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      ) : (
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      <span>Google</span>
    </button>
  )
}

/**
 * TELEGRAM SIGN IN
 */
export const TelegramSignInWidget = () => {
  const telegramWrapperRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()

  useEffect(() => {
    ; (window as any).onTelegramAuth = async (user: any) => {
      try {
        const res = await authService.telegramLogin(user)

        await refreshUser()

        await handlePostLoginRedirect({
          searchParams,
          defaultRedirect: res.redirect_to,
        })
      } catch (error: any) {
        console.error('Telegram login error:', error?.response?.data || error)
        alert(error?.response?.data?.detail || 'Telegram login xatosi')
      }
    }

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.setAttribute('data-telegram-login', 'EnwisAuthBot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-radius', '5')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    script.setAttribute('data-userpic', 'false')

    if (telegramWrapperRef.current) {
      telegramWrapperRef.current.innerHTML = ''
      telegramWrapperRef.current.appendChild(script)
    }

    return () => {
      try {
        delete (window as any).onTelegramAuth
      } catch { }
    }
  }, [refreshUser, searchParams])

  return (
    <div className="w-full">
      <div className="relative flex h-[48px] w-full items-center justify-center overflow-hidden rounded-xl border border-transparent bg-[#54a9eb] shadow-sm transition-all hover:border-[#54a9eb]">
        <div
          ref={telegramWrapperRef}
          className="telegram-widget-container flex items-center justify-center"
          style={{
            transform: 'scale(0.9)',
            transformOrigin: 'center',
          }}
        />
      </div>

      <style jsx global>{`
        .telegram-widget-container iframe {
          margin: 0 !important;
          display: block !important;
          min-height: 40px !important;
        }
      `}</style>
    </div>
  )
}