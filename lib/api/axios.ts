import axios from "axios";

// Backend URL ni environment variable orqali boshqarish tavsiya etiladi
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, ''); // Oxiridagi / ni olib tashlaymiz

const api = axios.create({
    baseURL: `${API_URL}/api/v1`, // Agar API v1 bo'lsa, yo'lni shu yerda yakunlash qulay
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false 
});

/**
 * Request Interceptor
 * Har bir so'rov yuborilishidan oldin tokenni Header'ga qo'shadi
 */
api.interceptors.request.use(
    (config) => {
        // Faqat Client-side (brauzer) da ishlashini ta'minlaymiz
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("access_token") || localStorage.getItem("token");

            // Token string ekanligini va oddiy "null"/"undefined" emasligini tekshiramiz
            if (token && token !== "undefined" && token !== "null") {
                config.headers.Authorization = `Bearer ${token}`;
                
                // Debug uchun (faqat development rejimida ko'rinadi)
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🚀 [API] ${config.method?.toUpperCase()} ${config.url} - Auth OK`);
                }
            } else {
                if (process.env.NODE_ENV === 'development') {
                    console.warn(`⚠️ [API] ${config.url} - Token topilmadi`);
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * Backend'dan kelgan javoblarni qayta ishlaydi (masalan, 401 xatoni ushlash)
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 401 Unauthorized - Token eskirgan yoki noto'g'ri
        if (error.response?.status === 401) {
            console.error("⛔ [401] Ruxsat rad etildi. Token xato yoki muddati o'tgan.");
            
            if (typeof window !== "undefined") {
                // Tozalash
                localStorage.removeItem("access_token");
                localStorage.removeItem("token");
                
                // Agar joriy sahifa auth sahifalaridan biri bo'lmasa, login'ga yuborish
                const currentPath = window.location.pathname;
                if (!currentPath.includes('/auth') && !currentPath.includes('/auth/register')) {
                    // Muhim: window.location.href sahifani to'liq yangilab yuboradi
                    // Bu Auth holatini reset qilish uchun eng ishonchli yo'l
                    window.location.href = "/auth";
                }
            }
        }

        // Boshqa xatolar (500, 404, 400 va h.k.)
        return Promise.reject(error);
    }
);

export default api;