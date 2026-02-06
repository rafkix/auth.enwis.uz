"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { 
    User, Camera, Calendar, Mail, Save, X, Edit3, Loader2 
} from "lucide-react"
import { useAuth } from "@/lib/AuthContext" // Yoki @/lib/AuthContext (qaysi biri sizda bo'lsa)
import { authService, UserProfileUpdate } from "@/lib/api"

export default function ProfilePage() {
    const { user, refreshUser } = useAuth()
    
    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null)

    // UI States
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Form Data
    const [formData, setFormData] = useState<UserProfileUpdate>({
        full_name: "",
        bio: "",
        birth_date: "",
        gender: "",
        avatar_url: ""
    })

    // 1. User ma'lumotlari kelganda formani to'ldirish
    useEffect(() => {
        if (user?.profile) {
            setFormData({
                full_name: user.profile.full_name || "",
                bio: user.profile.bio || "",
                birth_date: user.profile.birth_date ? String(user.profile.birth_date).split('T')[0] : "",
                gender: user.profile.gender || "",
                avatar_url: user.profile.avatar_url || ""
            })
        }
    }, [user])

    // 2. Input o'zgarishini ushlash
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    // 3. Fayl yuklash (Avatar)
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            alert("Rasm hajmi 5MB dan oshmasligi kerak.")
            return
        }

        try {
            setUploading(true)
            await authService.uploadAvatar(file)
            await refreshUser() // Avatarni darhol yangilash
        } catch (error: any) {
            console.error("Upload error:", error)
            alert("Rasmni yuklashda xatolik yuz berdi.")
        } finally {
            setUploading(false)
        }
    }

    // Rasmni bosganda inputni ochish
    const handleAvatarClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    // 4. Saqlash
    const handleSave = async () => {
        setLoading(true)
        try {
            const payload: UserProfileUpdate = {
                ...formData,
                birth_date: formData.birth_date || null 
            }
            // Avatar URLni qo'lda o'zgartirishni o'chirdik, shuning uchun
            // formData.avatar_url eski qiymatda qoladi yoki upload qilingan bo'lsa yangilanadi.

            await authService.updateProfile(payload)
            await refreshUser()
            setIsEditing(false)
        } catch (error: any) {
            console.error(error)
            const msg = error.response?.data?.detail || "Saqlashda xatolik yuz berdi"
            alert(typeof msg === "string" ? msg : JSON.stringify(msg))
        } finally {
            setLoading(false)
        }
    }

    // 5. Bekor qilish
    const handleCancel = () => {
        setIsEditing(false)
        if (user?.profile) {
            setFormData({
                full_name: user.profile.full_name || "",
                bio: user.profile.bio || "",
                birth_date: user.profile.birth_date ? String(user.profile.birth_date).split('T')[0] : "",
                gender: user.profile.gender || "",
                avatar_url: user.profile.avatar_url || ""
            })
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            
            {/* Yashirin Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/png, image/jpeg, image/jpg, image/webp"
            />

            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Mening Profilim</h1>
                    <p className="text-slate-500 text-sm">Shaxsiy ma'lumotlarni boshqarish</p>
                </div>
                
                {/* Tugmalar */}
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm active:scale-95"
                    >
                        <Edit3 size={18} /> Tahrirlash
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleCancel}
                            disabled={loading || uploading}
                            className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-slate-200 transition-colors active:scale-95 disabled:opacity-50"
                        >
                            <X size={18} /> Bekor qilish
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={loading || uploading}
                            className="flex items-center gap-2 bg-[#17776A] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#126156] transition-colors shadow-lg shadow-[#17776A]/20 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Saqlash</>}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* =========================================================
                    CHAP TOMON: AVATAR
                   ========================================================= */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 bg-white rounded-[24px] p-6 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center h-fit"
                >
                    <div 
                        className={`relative group ${isEditing ? "cursor-pointer" : ""}`}
                        onClick={handleAvatarClick}
                        title={isEditing ? "Rasmni o'zgartirish uchun bosing" : ""}
                    >
                        <div className="w-32 h-32 rounded-full border-4 border-slate-50 bg-slate-100 flex items-center justify-center text-4xl font-black text-slate-400 overflow-hidden shadow-inner object-cover relative">
                            {/* Avatar Rasm */}
                            {user?.profile?.avatar_url ? (
                                <img src={user.profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span>{formData.full_name?.charAt(0) || "U"}</span>
                            )}
                            
                            {/* Yuklanmoqda animatsiyasi */}
                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="text-white animate-spin" size={32} />
                                </div>
                            )}
                        </div>
                        
                        {/* Tahrirlash belgisi (faqat isEditing bo'lsa chiqadi) */}
                        {isEditing && !uploading && (
                            <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white p-2 rounded-full shadow-lg">
                                    <Camera className="text-slate-700" size={18} />
                                </div>
                            </div>
                        )}
                    </div>

                    <h2 className="mt-4 text-xl font-black text-slate-900 break-words w-full">{user?.profile?.full_name || "Foydalanuvchi"}</h2>
                    <p className="text-slate-400 font-medium text-sm">@{user?.profile?.username}</p>

                    <div className="mt-6 w-full space-y-3">
                        <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                            <Mail size={16} className="text-[#17776A]" />
                            <span className="truncate">{user?.email || "Email yo'q"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                            <Calendar size={16} className="text-[#17776A]" />
                            <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-"} da qo'shilgan</span>
                        </div>
                    </div>
                </motion.div>

                {/* =========================================================
                    O'NG TOMON: FORMALAR
                   ========================================================= */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    className="lg:col-span-2 bg-white rounded-[24px] p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-200/40"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Asosiy ma'lumotlar</h3>
                    
                    <div className="space-y-5">
                        {/* Ism va Username */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">To'liq ism</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        name="full_name"
                                        value={formData.full_name || ""}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#17776A] outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-slate-900"
                                        placeholder="Ism Familiya"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Username</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                                    <input 
                                        value={user?.profile?.username || ""}
                                        disabled
                                        className="w-full h-12 pl-8 pr-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
                                        title="Usernameni o'zgartirish uchun adminga murojaat qiling"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio (Qisqacha)</label>
                            <div className="relative">
                                <textarea 
                                    name="bio"
                                    value={formData.bio || ""}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    rows={3}
                                    placeholder="O'zingiz haqingizda yozing..."
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#17776A] outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-slate-900 resize-none"
                                />
                            </div>
                        </div>

                        {/* Sana va Jins */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tug'ilgan sana</label>
                                <input 
                                    name="birth_date"
                                    type="date"
                                    value={formData.birth_date || ""}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#17776A] outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-slate-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jins</label>
                                <select 
                                    name="gender"
                                    value={formData.gender || ""}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#17776A] outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-slate-900 appearance-none"
                                >
                                    <option value="">Tanlanmagan</option>
                                    <option value="male">Erkak</option>
                                    <option value="female">Ayol</option>
                                </select>
                            </div>
                        </div>

                        {/* Avatar URL inputi olib tashlandi */}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}