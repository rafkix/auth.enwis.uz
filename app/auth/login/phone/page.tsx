'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Phone,
  Loader2,
  MessageCircle,
  ArrowLeft,
  Globe,
  CheckCircle2,
  Send,
  ShieldCheck,
  Zap,
  Sparkles,
  Lock,
  Check,
  Youtube,
  ExternalLink,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/api/auth'
import { useAuth } from '@/lib/AuthContext'

const BOT_USERNAME = 'EnwisAuthBot'
const OTP_TIMEOUT = 300 // 5 minut

// Karusel uchun ma'lumotlar
const PROMO_SLIDES = [
  {
    id: 1,
    type: 'youtube',
    icon: <Youtube size={32} className="text-red-600" />,
    title: 'Enwis Academy YouTube',
    description:
      "Platformadan foydalanish bo'yicha eng so'nggi video darsliklar va master-klasslarni kuzatib boring.",
    link: 'https://youtube.com/@enwis',
    buttonText: "Kanalga o'tish",
    color: 'from-red-600/20',
  },
  {
    id: 2,
    type: 'telegram',
    icon: <MessageCircle size={32} className="text-[#229ED9]" />,
    title: 'Enwis Hub Telegram',
    description:
      'Muhim yangiliklar, yangi funksiyalar va hamjamiyat bilan muloqot qilish uchun rasmiy kanalimizga ulaning.',
    link: 'https://t.me/enwis_hub',
    buttonText: "Obuna bo'lish",
    color: 'from-[#229ED9]/20',
  },
]

const TELEGRAM_BOT_TOKEN = '8542032478:AAH8CiqFMrRLxTZ6k6bbRKHtl5P9X8Yc98s'
const TELEGRAM_CHANNEL_ID = '@enwis_uz'

function PhoneLoginForm() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [subscriberCount, setSubscriberCount] = useState<string>('5K+')
  const [step, setStep] = useState<'PHONE' | 'CODE'>('PHONE')
  const [phone, setPhone] = useState('+998')
  const [loading, setLoading] = useState(false)
  const [method, setMethod] = useState<'SMS' | 'BOT'>('BOT')
  const [timeLeft, setTimeLeft] = useState(0)
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Taymer mantiqi
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  // Avtomatik karusel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PROMO_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchTelegramSubs = async () => {
      try {
        const response = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMemberCount?chat_id=${TELEGRAM_CHANNEL_ID}`
        )
        const data = await response.json()
        if (data.ok) {
          const count = data.result
          setSubscriberCount(
            count >= 1000 ? `${(count / 1000).toFixed(1)}K+` : count.toString()
          )
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchTelegramSubs()
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // 1-QADAM: OTP KODNI SO'RASH
  const handleRequestCode = async (type: 'SMS' | 'BOT') => {
    const cleanPhone = phone.replace(/[^\d+]/g, '')
    if (cleanPhone.length < 13) {
      alert("Iltimos, telefon raqamingizni to'liq kiriting!")
      return
    }

    setLoading(true)
    setMethod(type)

    try {
      if (type === 'BOT') {
        // Backend: /auth/bot/send-otp
        await authService.sendOtpBot({ phone: cleanPhone })
        window.open(`https://t.me/${BOT_USERNAME}?start=${cleanPhone}`, '_blank')
      } else {
        // Backend: /auth/send-otp
        await authService.sendOtp({ phone: cleanPhone })
      }

      setStep('CODE')
      setTimeLeft(OTP_TIMEOUT)
    } catch (error: any) {
      alert(
        error.response?.data?.detail || "Xatolik yuz berdi. Qaytadan urinib ko'ring."
      )
    } finally {
      setLoading(false)
    }
  }

  // 2-QADAM: KODNI TASDIQLASH (LOGIN)
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const finalCode = otp.join('')
    if (finalCode.length < 4) return

    setLoading(true)
    try {
      const cleanPhone = phone.replace(/[^\d+]/g, '')
      const res = await authService.loginByPhone({
        phone: cleanPhone,
        code: finalCode,
      })

      if (res.status === 'need_registration') {
        router.push(`/auth`)
        return
      }

      if (res.token?.access_token) {
        localStorage.setItem('access_token', res.token.access_token)
        localStorage.setItem('refresh_token', res.token.refresh_token)
        await refreshUser()
        router.push('/dashboard')
      }
    } catch (error: any) {
      alert(error.response?.data?.detail || "Kod noto'g'ri yoki muddati o'tgan")
      setOtp(new Array(6).fill(''))
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    const val = value.replace(/\D/g, '').slice(-1)
    const newOtp = [...otp]
    newOtp[index] = val
    setOtp(newOtp)
    if (val && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col lg:flex-row bg-white overflow-hidden font-sans text-slate-900">
      {/* CHAP TOMON: FORM */}
      <div className="w-full lg:w-[45%] h-full flex flex-col justify-center px-8 lg:px-20 bg-white z-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px] mx-auto"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-[#17776A] to-[#249788] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Globe size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[#17776A] text-xl font-black tracking-tighter leading-none italic uppercase">
                ENWIS HUB
              </span>
              <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">
                Smart Learning
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 'PHONE' ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <header>
                  <h1 className="text-4xl font-black leading-tight mb-3 tracking-tighter italic uppercase">
                    Xush kelibsiz!
                  </h1>
                  <p className="text-slate-400 font-medium text-sm">
                    Kirish uchun telefon raqamingizni kiriting.
                  </p>
                </header>

                <div className="space-y-4">
                  <div className="group relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#229ED9] transition-colors">
                      <Phone size={20} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-16 py-4 pl-14 pr-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#229ED9]/20 focus:bg-white outline-none transition-all font-bold text-xl tracking-wide"
                      placeholder="+998"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleRequestCode('BOT')}
                      disabled={loading}
                      className="w-full h-16 bg-[#229ED9] text-white rounded-2xl font-black italic uppercase shadow-xl shadow-[#229ED9]/20 hover:bg-[#1c80b0] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
                    >
                      {loading && method === 'BOT' ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : (
                        <>
                          <MessageCircle size={22} fill="white" /> Bot orqali kirish
                        </>
                      )}
                    </button>

                    <div className="relative py-2 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100"></div>
                      </div>
                      <span className="relative px-4 bg-white text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                        yoki muqobil variant
                      </span>
                    </div>

                    <button
                      onClick={() => handleRequestCode('SMS')}
                      disabled={loading}
                      className="w-full h-14 bg-white text-slate-500 border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 hover:text-[#17776A] hover:border-[#17776A]/20 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      {loading && method === 'SMS' ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          <Send size={18} /> SMS orqali kod olish
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <button
                  onClick={() => setStep('PHONE')}
                  className="flex items-center gap-2 text-slate-400 hover:text-[#17776A] group transition-colors"
                >
                  <ArrowLeft
                    size={18}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    Raqamni tahrirlash
                  </span>
                </button>
                <header>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="text-[#17776A]" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#17776A]">
                      Xavfsiz verifikatsiya
                    </span>
                  </div>
                  <h1 className="text-4xl font-black mb-3 tracking-tighter italic uppercase">
                    Tasdiqlash
                  </h1>
                  <p className="text-slate-400 font-medium text-sm">
                    Kod{' '}
                    <span className="text-[#229ED9] font-bold">
                      {method === 'BOT' ? 'Telegram' : 'SMS'}
                    </span>{' '}
                    orqali yuborildi:{' '}
                    <span className="text-slate-900 font-bold">{phone}</span>
                  </p>
                </header>

                <div className="flex justify-between gap-2">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      ref={(el) => {
                        inputRefs.current[index] = el
                      }}
                      value={data}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-full h-14 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all
                                                ${otp[index] ? 'border-[#17776A] bg-white text-[#17776A]' : 'border-slate-100 bg-slate-50'}`}
                    />
                  ))}
                </div>

                <div className="space-y-6">
                  <button
                    onClick={handleVerify}
                    disabled={loading || otp.join('').length < 4}
                    className="w-full h-16 bg-[#17776A] text-white rounded-2xl font-black italic uppercase shadow-xl hover:bg-[#136359] disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center gap-3 text-lg"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        Platformaga kirish <CheckCircle2 size={20} />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    {timeLeft > 0 ? (
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.1em]">
                        Qayta yuborish:{' '}
                        <span className="text-[#17776A]">{formatTime(timeLeft)}</span>
                      </p>
                    ) : (
                      <button
                        onClick={() => handleRequestCode(method)}
                        className="text-[11px] text-[#17776A] font-black uppercase tracking-[0.1em] hover:underline"
                      >
                        Yangi kodni so'rash
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* O'NG TOMON: PREMIUM DIZAYN */}
      <div className="hidden lg:flex w-[55%] h-full bg-[#0a0a0a] relative items-center justify-center overflow-hidden">
        {/* 1. Asosiy Kavisli Fon (Oq yarim oy) */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[120px] bg-white z-10"
          style={{ clipPath: 'ellipse(100% 100% at 0% 50%)' }}
        />

        {/* 2. Dinamik Neon Effektlar (Faqat o'ng tomonda chegaralangan) */}
        <div className="absolute inset-0 z-0">
          {/* Yuqori o'ng burchakdagi yashil nur */}
          <div className="absolute -top-20 -right-20 w-[450px] h-[450px] bg-[#17776A] opacity-[0.15] rounded-full blur-[100px]" />

          {/* O'rta qismdagi havo rang nur */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/2 right-10 -translate-y-1/2 w-[350px] h-[350px] bg-[#229ED9] rounded-full blur-[120px]"
          />

          {/* Siz aytgan o'sha xato joylashgan doiralarni TUZATILGAN holati: */}
          {/* O'ng tepa kichik doira */}
          <div className="absolute top-[15%] right-[10%] w-48 h-48 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md" />

          {/* Pastki o'rta kichik doira (Chapga o'tib ketmasligi uchun right-40 qilingan) */}
          <div className="absolute bottom-[10%] right-[35%] w-24 h-24 rounded-full bg-[#17776A]/10 border border-white/5 backdrop-blur-sm" />
        </div>

        {/* 3. Markaziy Premium Karta */}
        <div className="relative z-20 w-full max-w-[440px] px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/[0.02] border border-white/10 rounded-[3.5rem] p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              {/* Card ichidagi dekoratsiya */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#229ED9]/10 rounded-full blur-2xl group-hover:bg-[#229ED9]/20 transition-colors" />

              <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-20 h-20 bg-gradient-to-tr from-[#229ED9] to-[#4fc3f7] rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-[#229ED9]/30 border border-white/20"
                >
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .33z" />
                  </svg>
                </motion.div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
                    English with <br />
                    <span className="text-[#229ED9]">Enwis Premium</span>
                  </h3>
                  <p className="text-slate-400 text-sm font-medium opacity-70">
                    Darslar, testlar va yopiq hamjamiyat.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-white/[0.04] border border-white/5 rounded-2xl py-5 hover:bg-white/10 transition-colors">
                    <div className="text-2xl font-black text-white leading-none">
                      {subscriberCount}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                      Students
                    </div>
                  </div>
                  <div className="bg-white/[0.04] border border-white/5 rounded-2xl py-5 hover:bg-white/10 transition-colors">
                    <div className="text-2xl font-black text-white leading-none">
                      500+
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                      Darsliklar
                    </div>
                  </div>
                </div>

                <a
                  href="https://t.me/enwis_uz"
                  target="_blank"
                  className="w-full h-14 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#229ED9] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Telegram Kanal <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4. Subtle Dots Grid (O'ng tomonda orqa fonda) */}
        <div className="absolute inset-0 z-[-1] opacity-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function PhoneLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center bg-white">
          <Loader2 className="animate-spin text-[#17776A]" size={48} />
        </div>
      }
    >
      <PhoneLoginForm />
    </Suspense>
  )
}

function setCurrentSlide(arg0: (prev: any) => number) {
  throw new Error('Function not implemented.')
}
