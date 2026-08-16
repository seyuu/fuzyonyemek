/**
 * ============================================================================
 * ADMIN API İSTEMCİSİ (AXIOS & INTERCEPTORS) — Güvenli HTTP İstemcisi
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Profesyonel yazılım dünyasında en çok kullanılan ve iş mülakatlarında en çok
 * sorulan konulardan biri: **"Axios Interceptors (Araya Giriciler)"** nedir?
 * 
 * NEDEN INTERCEPTOR KULLANIRIZ?
 * 1. Request Interceptor (İstek Öncesi):
 *    Admin panelindeki 100 farklı API çağrısına tek tek "Authorization: Bearer token"
 *    yazmak yerine, Axios her istek yola çıkmadan önce araya girer, depodan JWT token'ı
 *    alır ve HTTP başlığına (Header) otomatik ekler.
 * 2. Response Interceptor & Refresh Token (Yanıt Sonrası):
 *    Eğer sunucu "401 Unauthorized" (Yetkisiz / Token Süresi Doldu) hatası dönerse,
 *    kullanıcıyı hemen sayfadan atmak yerine arkaplanda sessizce `refreshToken` ile
 *    yeni bir token alır ve yarıda kalan isteği baştan tekrarlar (`original._retry = true`).
 *    Eğer refresh token da eskiyse kullanıcıyı güvenle `/login` sayfasına yönlendirir.
 */

import axios from 'axios';

// Vite ortam değişkenlerinden API adresini alır (Örn: .env.production)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * 1. İSTEK ARACISI (REQUEST INTERCEPTOR)
 * Giden her isteğe otomatik olarak JWT kimlik doğrulama başlığı ekler.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 2. YANIT ARACISI (RESPONSE INTERCEPTOR)
 * 401 Yetki Hatası geldiğinde Token Yenileme (Refresh Token) döngüsünü yönetir.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    
    // Eğer hata 401 ise ve bu isteği daha önce tekrar denemediysek (_retry)
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true; // Sonsuz döngüye girmemesi için işaretle
      
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        // Yenileme uç noktasına POST isteği at
        const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { accessToken, refreshToken });
        
        // Yeni token'ları kaydet
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // Yarıda kalan asıl isteğin başlığına yeni token'ı koy ve isteği baştan çalıştır
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        // Yenileme de başarısız olduysa oturumu tamamen kapat ve login sayfasına gönder
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
