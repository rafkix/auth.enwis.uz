// 1. Google orqali kirish (Faqat id_token)
export interface GoogleLoginPayload {
  id_token: string;
}

// 2. Telegram orqali kirish
export interface TelegramLoginPayload {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

// 3. Telefon orqali kirish (OTP yuborish)
export interface SendOtpPayload {
  phone: string; // Format: +998901234567
}

// 4. Telefon + Kod orqali login
export interface PhoneLoginPayload {
  phone: string;
  code: string;
}

// 5. Standart Token javobi
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// 6. Login Phone uchun maxsus javob (Backend'da structure biroz boshqacha ekan)
export interface PhoneLoginResponse {
  status: string;
  token: AuthResponse;
  message: string;
}

// 7. User ma'lumotlari (Get Me)
export interface UserProfile {
  full_name: string;
  username: string;
  avatar_url: string;
  bio: string | null;
  birth_date: string | null;
  gender: string | null;
}

export interface UserMeResponse {
  id: number;
  is_active: boolean;
  global_role: string;
  created_at: string;
  profile: UserProfile;
  contacts: any[];
}