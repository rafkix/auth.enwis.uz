import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['uz', 'en', 'ru']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = locales.some((loc) =>
    pathname.startsWith(`/${loc}`)
  )

  if (hasLocale) return

  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname}`

  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}