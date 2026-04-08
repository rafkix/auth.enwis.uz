"use client"

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default function ProgressBar() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        nProgress.configure({ showSpinner: false, speed: 400 })
        nProgress.done()
        return () => { nProgress.start() }
    }, [pathname, searchParams])

    return null
}