/**
 * ============================================================================
 * ADMIN PANELİ ANA GİRİŞ BİLEŞENİ (APP.TSX) — React SPA Mimarisi
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Bu dosya, sadece şirket yöneticilerinin (Admin) giriş yaptığı kontrol panelinin
 * rota (routing) ve durum yöneticisidir.
 * 
 * BURADAKİ ÖNEMLİ YAZILIM KONSEPTLERİ:
 * 1. Single Page Application (SPA) & React Router:
 *    Sayfalar arasında gezinirken tarayıcı sıfırdan yüklenmez (yenilenmez),
 *    sadece ilgili bileşen anında ekrana gelir.
 * 2. TanStack React Query (`QueryClientProvider`):
 *    Backend API'den gelen verileri hafızada (önbellekte) saklar. Bir sayfaya tekrar
 *    girildiğinde kullanıcıyı bekletmeden veriyi şimşek hızında gösterir (`staleTime: 30_000`).
 * 3. Rota Koruma (ProtectedRoute / Route Guard):
 *    Giriş yapmamış (`user === null`) hiçbir kullanıcı admin sayfalarına (Dashboard, Blog vs.)
 *    erişemez; otomatik olarak `/login` sayfasına fırlatılır.
 * 4. Toaster: Sağ üst köşede beliren şık "Başarıyla Kaydedildi", "Hata Oluştu" bildirim balonları.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminLayout } from './components/Layout/AdminLayout';
import { LoginPage } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { BlogList } from './pages/BlogList';
import { BlogEditor } from './pages/BlogEditor';
import { ContactList } from './pages/ContactList';
import { StatsManager } from './pages/StatsManager';
import { AboutSettings } from './pages/AboutSettings';
import { Settings } from './pages/Settings';
import { Services } from './pages/Services';
import { Gallery } from './pages/Gallery';

// React Query İstemcisi: API verilerini 30 saniye boyunca taze kabul eder
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

/**
 * Giriş Yapmış Kullanıcı Güvenlik Kalkanı (Route Guard)
 * Kullanıcı giriş yapmamışsa /login sayfasına yönlendirir.
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  // Oturum durumu kontrol edilirken yükleme ekranı göster
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        Yönetim Paneli Yükleniyor...
      </div>
    );
  }
  
  // Giriş yapılmamışsa login sayfasına yönlendir
  if (!user) return <Navigate to="/login" replace />;
  
  // Giriş yapılmışsa sayfayı güvenle aç
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* AuthProvider: Tüm panelde geçerli kullanıcı oturum durumunu sağlar */}
        <AuthProvider>
          <Routes>
            {/* Herkese açık giriş sayfası */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Sadece giriş yapmış adminlerin görebileceği sayfalar */}
            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="blog" element={<BlogList />} />
              <Route path="blog/new" element={<BlogEditor />} />
              <Route path="blog/:id" element={<BlogEditor />} />
              <Route path="services" element={<Services />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="contact" element={<ContactList />} />
              <Route path="stats" element={<StatsManager />} />
              <Route path="about" element={<AboutSettings />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
          
          {/* İşlem bildirim mesajları kutusu (Toaster) */}
          <Toaster 
            position="top-right" 
            toastOptions={{ 
              style: { borderRadius: '10px', background: '#333', color: '#fff' } 
            }} 
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
