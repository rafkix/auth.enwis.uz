"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface LoadingProps {
    text?: string;
    fullScreen?: boolean;
}

export default function Loading({ text = "Yuklanmoqda", fullScreen = true }: LoadingProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? 'h-[70vh] w-full' : 'p-10'}`}>
            <div className="relative flex items-center justify-center">
                {/* Tashqi aylanuvchi xalqa */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-2 border-slate-100 border-t-[#17776A] rounded-full"
                />

                {/* Markazdagi Sparkle belgisi */}
                <motion.div
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute text-[#17776A]"
                >
                    <Sparkles size={16} fill="currentColor" />
                </motion.div>
            </div>

            <div className="flex flex-col items-center gap-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    {text}
                </p>
                {/* Harakatlanuvchi nuqtalar */}
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-0.5 h-0.5 bg-[#17776A] rounded-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}