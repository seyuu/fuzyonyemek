/**
 * ============================================================================
 * KİMLİK DOĞRULAMA CONTEXT'İ (AUTH CONTEXT) — Global State Management
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Kullanıcının giriş yapıp yapmadığını, e-posta adresini ve yetkilerini (Admin vb.)
 * tüm sayfalarda ayrı ayrı sorgulamak yerine TEK BİR MERKEZDEN nasıl yönetiriz?
 * 
 * REACT CONTEXT API MANTIĞI:
 * Context, React'in en güçlü özelliklerinden biridir. Veriyi en üstteki `AuthProvider`
 * bileşeninde tutarız ve projedeki herhangi bir alt bileşen `useAuth()` diyerek
 * anında kullanıcının bilgilerine ulaşabilir (Prop Drilling yapmaya gerek kalmaz).
 * 
 * ÇALIŞMA ADIMLARI:
 * 1. Sayfa İlk Açıldığında (`useEffect`): Tarayıcının `localStorage` deposunda
 *    daha önce kaydedilmiş bir `accessToken` (JWT) var mı diye bakar. Varsa `/api/auth/me`
 *    ile kullanıcı profilini çeker.
 * 2. Giriş (login): E-posta ve şifreyle API'ye istek atar, gelen token'ları kaydeder.
 * 3. Çıkış (logout): Depodaki token'ları temizler ve kullanıcıyı çıkış yaptırır.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

// Giriş yapan kullanıcının veri yapısı
interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
}

// Context üzerinden dışarıya sunulan fonksiyonlar ve durumlar
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

// Context'in oluşturulması
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Sayfa yenilendiğinde oturumu otomatik hatırla
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => { 
          // Token geçersizse veya süresi dolmuşsa depoyu temizle
          localStorage.removeItem('accessToken'); 
          localStorage.removeItem('refreshToken'); 
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // 2. Giriş Yapma Fonksiyonu
  const login = async (email: string, password: string) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
  };

  // 3. Güvenli Çıkış Yapma Fonksiyonu
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  // Kullanıcının "Admin" rolüne sahip olup olmadığını kontrol eden kısayol
  const isAdmin = user?.roles.includes('Admin') ?? false;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Custom Hook'u
 * Bileşenlerin `const { user, logout } = useAuth();` şeklinde kolayca
 * oturum verilerine erişmesini sağlar.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth, AuthProvider sarmalayıcısı içinde kullanılmalıdır.');
  return ctx;
}
