import { api } from './api' // Asosiy axios instance-ni import qilamiz

// ==============================================================================
// 1. TYPES (Swaggerga moslangan tiplar)
// ==============================================================================

// Profil ma'lumotlari (Ichma-ich obyekt uchun)
export interface UserProfile {
  user_id: string // UUID
  full_name: string
  username: string
  avatar_url?: string | null
}

// Kontaktlar (Email, Phone)
export interface UserContact {
  id: number
  contact_type: 'email' | 'phone' | 'telegram'
  value: string
  is_verified: boolean
}

// ASOSIY USER OBJEKTI (Backenddan keladigan to'liq data)
export interface User {
  id: string // UUID
  is_active: boolean
  profile: UserProfile // <--- Profile obyekti
  contacts: UserContact[] // <--- Kontaktlar ro'yxati
}

// Profilni yangilash uchun DTO
export interface UpdateProfileData {
  full_name?: string
  username?: string
  avatar_url?: string
}

// Kontakt qo'shish uchun DTO
export interface AddContactData {
  contact_type: 'email' | 'phone'
  value: string
}

// ==============================================================================
// 2. USER SERVICE
// ==============================================================================

export const userService = {
  // 1. O'z profilimni olish (GET /users/me)
  async getMe() {
    const response = await api.get<User>('/users/me')
    return response.data
  },

  // 2. Profilni o'chirish (Deactivate) (DELETE /users/me)
  async deleteAccount() {
    await api.delete('/users/me')
  },

  // 3. Profil ma'lumotlarini yangilash (PATCH /users/me/profile)
  async updateProfile(data: UpdateProfileData) {
    const response = await api.patch<UserProfile>('/users/me/profile', data)
    return response.data
  },

  // 4. Kontaktlarni olish (GET /users/me/contacts)
  async getContacts() {
    const response = await api.get<UserContact[]>('/users/me/contacts')
    return response.data
  },

  // 5. Kontakt qo'shish (POST /users/me/contacts)
  async addContact(data: AddContactData) {
    const response = await api.post<UserContact>('/users/me/contacts', data)
    return response.data
  },

  // 6. Kontaktni o'chirish (DELETE /users/me/contacts/{id})
  async deleteContact(contactId: number) {
    await api.delete(`/users/me/contacts/${contactId}`)
  },

  // 7. Boshqa birovning profilini ko'rish (Public Profile)
  async getPublicProfile(userId: string) {
    const response = await api.get<UserProfile>(`/users/${userId}`)
    return response.data
  },
}
