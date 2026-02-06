"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
    LayoutDashboard, Wallet, Settings, LogOut, User, 
    Bell, Menu, X, ShieldCheck, Smartphone, Search, 
    ChevronDown, CreditCard, Lock
} from "lucide-react"
// DIQQAT: Agar context papkada bo'lsa, manzilni to'g'rilang:
import { useAuth } from "@/lib/AuthContext" 

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    
    // State
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isProfileOpen, setProfileOpen] = useState(false)
    const [isNotifOpen, setNotifOpen] = useState(false)

    // Refs (Click outside uchun)
    const profileRef = useRef<HTMLDivElement>(null)
    const notifRef = useRef<HTMLDivElement>(null)

    // Click Outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false)
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotifOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // MENU ITEMS (Linklarni to'g'riladik)
    const menuItems = [
        { icon: LayoutDashboard, label: "Asosiy", href: "/dashboard" },
        { icon: User, label: "Profil", href: "/dashboard/profile" }, // /dashboard/profile -> /profile
        { icon: ShieldCheck, label: "Xavfsizlik", href: "/dashboard/security" },
    ]

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    const getPageTitle = () => {
        // Pathname aniq mos kelishini yoki boshlanishini tekshiramiz
        const item = menuItems.find(i => pathname === i.href || (pathname.startsWith(i.href) && i.href !== "/"))
        return item ? item.label : "Dashboard"
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
            
            {/* ================= MOBILE OVERLAY ================= */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* ================= SIDEBAR (FIXED) ================= */}
            <aside 
                className={`
                    fixed top-0 left-0 h-full w-[280px] bg-white border-r border-slate-100 z-50 flex flex-col shadow-2xl lg:shadow-xl lg:shadow-slate-200/40
                    transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
                    lg:translate-x-0 
                `}
            >
                {/* Logo Area */}
                <div className="h-20 flex-shrink-0 flex items-center px-6 border-b border-slate-50 justify-between">
                    <div className="flex items-center">
                        <div className="min-w-[40px] h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#17776A]/20">
                            E
                        </div>
                        <span className="ml-3 text-xl font-black tracking-tighter text-slate-900 whitespace-nowrap">
                            ENWIS
                        </span>
                    </div>

                    {/* Mobile Close Button */}
                    <button 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="lg:hidden text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Nav Links (Scrollable) */}
                <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                                <div className={`
                                    flex items-center px-3 py-3.5 rounded-xl transition-all group cursor-pointer relative overflow-hidden
                                    ${isActive 
                                        ? "bg-[#17776A] text-white shadow-md shadow-[#17776A]/25" 
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                                `}>
                                    <item.icon size={22} className={`min-w-[22px] ${isActive ? "text-white" : "text-slate-400 group-hover:text-[#17776A]"}`} />
                                    <span className="ml-3 font-bold text-sm whitespace-nowrap">{item.label}</span>
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                {/* Logout Button (Fixed at bottom of sidebar) */}
                <div className="p-4 border-t border-slate-50 flex-shrink-0">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-3.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors group"
                    >
                        <LogOut size={22} className="min-w-[22px]" />
                        <span className="ml-3 font-bold text-sm whitespace-nowrap">Chiqish</span>
                    </button>
                </div>
            </aside>

            {/* ================= MAIN CONTENT WRAPPER ================= */}
            {/* lg:pl-[280px] - Desktopda Sidebar eni qadar joy tashlaymiz */}
            <div className="lg:pl-[280px] min-h-screen flex flex-col transition-all duration-300">
                
                {/* --- HEADER (STICKY) --- */}
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-sm">
                    
                    {/* Chap: Toggle & Title */}
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setMobileMenuOpen(true)} 
                            className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl lg:hidden"
                        >
                            <Menu size={24} />
                        </button>
                        
                        <div>
                            <h2 className="text-xl font-black text-slate-900 capitalize">{getPageTitle()}</h2>
                            <p className="hidden sm:block text-xs text-slate-400 font-medium">One ID boshqaruv tizimi</p>
                        </div>
                    </div>

                    {/* O'ng: Actions */}
                    <div className="flex items-center gap-3 sm:gap-6">
                        
                        {/* Search */}
                        <div className="hidden md:flex items-center bg-slate-50 border border-slate-200/60 rounded-xl px-4 h-11 w-64 focus-within:ring-2 focus-within:ring-[#17776A]/10 focus-within:border-[#17776A] transition-all">
                            <Search size={18} className="text-slate-400" />
                            <input placeholder="Qidirish..." className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 placeholder:text-slate-400" />
                        </div>

                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button 
                                onClick={() => setNotifOpen(!isNotifOpen)}
                                className="w-11 h-11 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-[#17776A] hover:bg-slate-50 transition-all relative"
                            >
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            <AnimatePresence>
                                {isNotifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-2 z-50 overflow-hidden"
                                    >
                                        <div className="px-3 py-2 border-b border-slate-50"><h3 className="text-sm font-bold text-slate-900">Bildirishnoma</h3></div>
                                        <div className="max-h-64 overflow-y-auto">
                                            <div className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors flex gap-3 items-start">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1"><ShieldCheck size={14}/></div>
                                                <div><p className="text-xs font-bold text-slate-800">Yangi qurilmadan kirildi</p><p className="text-[10px] text-slate-500 mt-1">Hozirgina • Chrome Mobile</p></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button 
                                onClick={() => setProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l border-slate-200/60 group outline-none"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-slate-900 leading-tight group-hover:text-[#17776A] transition-colors">{user?.profile?.full_name || user?.full_name || "User"}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ID: {user?.id}</p>
                                </div>
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#17776A] to-teal-400 flex items-center justify-center text-white font-black shadow-lg shadow-[#17776A]/20 transition-transform group-hover:scale-105 overflow-hidden">
                                    {user?.profile?.avatar_url ? (
                                        <img src={user.profile.avatar_url} alt="Ava" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{user?.profile?.full_name?.charAt(0) || "U"}</span>
                                    )}
                                </div>
                                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 hidden sm:block ${isProfileOpen ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-2 z-50"
                                    >
                                        <div className="px-3 py-2 border-b border-slate-50 mb-1 sm:hidden">
                                            <p className="text-sm font-bold text-slate-900 truncate">{user?.profile?.full_name}</p>
                                            <p className="text-[10px] text-slate-500">ID: {user?.id}</p>
                                        </div>
                                        <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"><User size={18} /> Profil</Link>
                                        <Link href="/wallet" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"><CreditCard size={18} /> To'lovlar</Link>
                                        <Link href="/security" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"><Lock size={18} /> Xavfsizlik</Link>
                                        <div className="h-px bg-slate-50 my-1"></div>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors text-sm font-bold"><LogOut size={18} /> Chiqish</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* --- INNER CONTENT --- */}
                <main className="p-4 sm:p-8 w-full max-w-[1600px] mx-auto flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}