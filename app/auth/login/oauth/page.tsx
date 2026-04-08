// /app/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Youtube, ArrowLeft, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GoogleLoginPage() {
    return (
        <div className="flex h-screen w-full bg-white overflow-hidden">

            {/* CHAP TOMON: LOGIN QISMI */}
            <div className="w-full lg:w-[42%] h-full flex flex-col justify-center px-10 sm:px-20 z-20 bg-white">

                <div className="max-w-[400px] w-full mx-auto space-y-8">
                    {/* Sarlavha */}
                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Xush kelibsiz!</h1>
                        <p className="text-slate-500 text-sm italic">Davom etish uchun Google orqali kiring</p>
                    </div>

                    {/* Google Tugmasi (Asosiy harakat) */}
                    <div className="space-y-4">
                        <button
                            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                            className="w-full h-14 rounded-2xl border-2 border-slate-100 flex items-center justify-center gap-4 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 group"
                        >
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </div>
                            <span className="font-bold text-slate-700">Google bilan kirish</span>
                        </button>
                    </div>

                    {/* Pastki qism - Telegram Style Toggle Button */}
                    <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col items-center">
                        <Link
                            href="/login"
                            className="group relative w-full h-12 bg-slate-50 rounded-xl border border-slate-100 transition-all duration-500 overflow-hidden flex items-center justify-center"
                        >
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-all duration-500 group-hover:-translate-y-full group-hover:opacity-0">
                                Email orqali kirishni xohlaysizmi?
                            </span>
                            <span className="absolute inset-0 flex items-center justify-center gap-2 text-[10px] font-black text-[#17776A] uppercase tracking-[0.2em] transition-all duration-500 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                <ArrowLeft size={16} /> Orqaga qaytish
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* O'NG TOMON: YOUTUBE STYLE CONTENT (Minimal) */}
            <div className="hidden lg:flex w-[58%] h-full bg-[#0F0F0F] relative items-center justify-center overflow-hidden">
                {/* Chapdagi oq kavis (Curve) */}
                <div className="absolute left-0 top-0 bottom-0 w-[80px] bg-white z-10" style={{ clipPath: 'ellipse(100% 100% at 0% 50%)' }} />

                <div className="relative z-20 text-center space-y-6 max-w-[400px]">
                    <div className="w-24 h-24 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                        <Youtube size={50} className="text-[#FF0000]" fill="#FF0000" />
                    </div>
                    <h2 className="text-white text-4xl font-black tracking-tight">Enwis Academy</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Darslarimizni YouTube'da kuzatib boring va dasturlash olamiga biz bilan birga sho'ng'ing.
                    </p>
                    <div className="h-1 w-20 bg-[#FF0000] mx-auto rounded-full" />
                </div>
            </div>
        </div>
    );
}