'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '@/lib/api/auth'
import { useAuth } from '@/lib/AuthContext'

/**
 * GOOGLE SIGN IN
 */
export const GoogleSignInButton = () => {
  const buttonRef = useRef<HTMLDivElement>(null)
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
          try {
            await authService.googleLogin({
              id_token: response.credential,
            })

            const nextUrl = clientId
              ? `/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`
              : process.env.NEXT_PUBLIC_APP_URL || 'https://app.enwis.uz'

            window.location.href = nextUrl
          } catch (err) {
            console.error(err)
            alert('Google login xato')
          }
        },
      })

    // 🔥 MUHIM: button render
    if (buttonRef.current) {
      ; (window as any).google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        shape: 'pill',
        text: 'continue_with',
      })
    }
  }, [clientId, redirectUri, state])

  return (
    <div className="flex justify-center">
      <div ref={buttonRef} />
    </div>
  )
}


/**
 * TELEGRAM SIGN IN
 */
export const TelegramSignInWidget = () => {
  const ref = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  const clientId = searchParams.get('client_id')
  const redirectUri = searchParams.get('redirect_uri')
  const state = searchParams.get('state')

  useEffect(() => {
    ;(window as any).onTelegramAuth = async (user: any) => {
      try {
        await authService.telegramLogin(user)

        const nextUrl = clientId
          ? `/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`
          : process.env.NEXT_PUBLIC_APP_URL || 'https://app.enwis.uz'

        window.location.href = nextUrl
      } catch {
        alert('Telegram login xato')
      }
    }

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.setAttribute('data-telegram-login', 'EnwisAuthBot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')

    if (ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(script)
    }
  }, [clientId, redirectUri, state])

  return (
    <div className="flex justify-center mt-4">
      <div ref={ref} />
    </div>
  )
}