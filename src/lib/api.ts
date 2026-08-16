/**
 * ============================================================================
 * FÜZYON YEMEK — API İSTEMCİ MODÜLÜ (CLIENT-SIDE / SERVER-SIDE DATA FETCHING)
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Bu dosya, Frontend (Next.js) ile Backend (.NET 8 Web API) arasındaki köprüdür.
 * 
 * NEDEN BÖYLE BİR DOSYA YAPTIK?
 * 1. Tek Bir Noktadan Yönetim (Centralization): Eğer backend API adresimiz değişirse
 *    veya tüm isteklere özel bir güvenlik başlığı (header) eklememiz gerekirse,
 *    bunu 50 farklı dosyada tek tek değiştirmek yerine sadece buradan değiştiririz.
 * 2. Tip Güvenliği (TypeScript Interfaces): Backend'den ne tür bir veri geleceğini
 *    (örneğin BlogPost, Service, Stat) önceden tanımlayarak olası yazım hatalarını
 *    ve çalışma anı (runtime) çökmelerini engelleriz.
 * 3. Hata Yönetimi: Sunucudan 404 (Bulunamadı) veya 500 (Sunucu Hatası) gibi durumlar
 *    döndüğünde tek merkezden yakalayıp kontrol edebiliriz.
 */

// API'mizin ana URL adresi: Ortam değişkeninde (ör. .env.local) tanımlıysa onu alır,
// yoksa yerel geliştirme için varsayılan olarak http://localhost:5050 adresini kullanır.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

/**
 * Genel API İstek Fonksiyonu (Generic Fetch Wrapper)
 * 
 * <T> Nedir? -> TypeScript'te "Generic" (Genel Tip) anlamına gelir. Fonksiyonu
 * çağırırken "Bana BlogPost dönecek" dersek (apiFetch<BlogPost>), fonksiyonun dönüş tipi
 * otomatik olarak BlogPost olur. Böylece kod tamamlama (IntelliSense) mükemmel çalışır.
 * 
 * @param path İstek atılacak uç nokta (Örnek: '/api/blog')
 * @param options HTTP Metodu (GET, POST vs.), Başlıklar veya İstek Gövdesi
 */
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    // revalidate: 0 -> Next.js'e bu isteğin sonucunu önbelleğe (cache) almamasını,
    // her seferinde doğrudan güncel veriyi veritabanından sormasını söyler.
    next: { revalidate: 0 }, 
  });

  // Eğer HTTP yanıt kodu 200-299 aralığında değilse (örneğin 404 veya 500 ise) hata fırlatırız.
  if (!res.ok) {
    throw new Error(`API Hatası: ${res.status} ${res.statusText}`);
  }

  // Sunucudan gelen JSON metnini JavaScript nesnesine dönüştürüp döndürürüz.
  return res.json();
}

/* ============================================================================
 * 1. BLOG MODÜLÜ TİPLERİ VE FONKSİYONLARI
 * ============================================================================ */

/**
 * BlogPost Arayüzü (Interface)
 * Bir blog yazısının sahip olması gereken tüm özellikleri (alanları) tanımlar.
 */
export interface BlogPost {
  id: number;
  slug: string;                 // SEO dostu URL kısmı (Örn: "saglikli-beslenme-rehberi")
  title: string;                // Blog başlığı
  excerpt: string;              // Kısa özet metin
  content: string;              // Yazının tamamı (HTML veya Markdown formatında)
  featuredImageUrl: string | null; // Kapak görselinin internet adresi
  category: string | null;      // Kategori adı (Örn: "Beslenme & Diyet")
  categoryId: number | null;    // Kategorinin veritabanındaki ID numarası
  readTime: string;             // Okuma süresi (Örn: "4 dk")
  isPublished: boolean;         // Yazı yayında mı yoksa taslak mı?
  publishedAt: string | null;   // Yayınlanma tarihi
  metaTitle: string | null;     // Google arama sonuçlarında görünecek özel başlık
  metaDescription: string | null;// Google arama sonuçlarında görünecek açıklama
}

/**
 * Sayfalanmış Veri Sonucu (Pagination)
 * Çok sayıda veri (örneğin 1000 adet blog yazısı) tek seferde çekilirse sayfa donabilir.
 * Bu yüzden veriler sayfa sayfa (10'ar 10'ar) çekilir.
 */
export interface PaginatedResult<T> {
  data: T[];       // O sayfadaki verilerin listesi
  total: number;   // Toplam kayıt sayısı
  page: number;    // Şu anki sayfa numarası
  pageSize: number;// Bir sayfada kaç kayıt olduğu
}

/**
 * Yayınlanmış blog yazılarını liste olarak getirir.
 * @param page Hangi sayfa? (Varsayılan: 1)
 * @param pageSize Sayfa başına kaç yazı? (Varsayılan: 10)
 * @param category İsteğe bağlı kategori filtresi
 */
export async function getBlogPosts(page = 1, pageSize = 10, category?: string) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (category) params.set('category', category);
  return apiFetch<PaginatedResult<BlogPost>>(`/api/blog?${params}`);
}

/**
 * Belirli bir blog yazısını 'slug' (URL adı) ile detaylı olarak getirir.
 */
export async function getBlogPost(slug: string) {
  return apiFetch<BlogPost>(`/api/blog/${slug}`);
}

/**
 * Sistemde tanımlı blog kategorilerini getirir.
 */
export async function getBlogCategories() {
  return apiFetch<{ id: number; name: string; slug: string; postCount: number }[]>('/api/blog/categories');
}

/* ============================================================================
 * 2. İSTATİSTİKLER VE SİTE AYARLARI (BENTO GRID VERİLERİ)
 * ============================================================================ */

export interface Stat {
  id: number;
  number: string; // Örn: "15+", "50k", "%99"
  label: string;  // Örn: "Yıllık Deneyim", "Günlük Porsiyon"
}

/**
 * Ana sayfadaki sayaç/istatistik kutularının verilerini çeker.
 */
export async function getStats() {
  return apiFetch<Stat[]>('/api/stats');
}

/**
 * Sitenin dinamik metin ayarlarını (Hero başlığı, slogan, açıklama vb.) çeker.
 */
export async function getSiteSettings() {
  return apiFetch<Record<string, string>>('/api/site-settings');
}

/* ============================================================================
 * 3. HİZMETLER (SERVICES) MODÜLÜ
 * ============================================================================ */

export interface Service {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  iconName: string | null;
  backgroundImageUrl: string | null;
}

/**
 * Tüm yemek ve catering hizmetlerini listeler.
 */
export async function getServices() {
  return apiFetch<Service[]>('/api/services');
}

/**
 * Tek bir hizmetin tüm detaylarını, avantajlarını (benefits) ve tam açıklamasını çeker.
 */
export async function getServiceBySlug(slug: string) {
  return apiFetch<Service & { fullDescription: string; benefits: { id: number; title: string; description: string; iconName: string }[] }>(`/api/services/${slug}`);
}

/* ============================================================================
 * 4. DİĞER MODÜLLER (Tedarikçiler, Sertifikalar, Galeri, İletişim Formu)
 * ============================================================================ */

/**
 * Güvenilir gıda tedarikçilerinin logo listesini getirir.
 */
export async function getSuppliers() {
  return apiFetch<{ id: number; name: string; logoUrl: string }[]>('/api/suppliers');
}

/**
 * Kalite ve hijyen sertifikalarının (ISO 22000, Helal vb.) listesini çeker.
 */
export async function getCertifications() {
  return apiFetch<{ id: number; title: string; description: string; imageUrl: string }[]>('/api/certifications');
}

export interface GalleryImage {
  id: number;
  title: string | null;
  altText: string | null;
  mediaAsset: { secureUrl: string };
}

/**
 * Galeri sayfasındaki fotoğrafları çeker.
 */
export async function getGallery() {
  return apiFetch<PaginatedResult<GalleryImage>>('/api/gallery?ps=100');
}

/**
 * Müşterinin web sitesinden gönderdiği iletişim / teklif formunu API'ye iletir (POST).
 */
export async function submitContact(data: {
  name: string; company?: string; email: string;
  phone?: string; serviceType?: string; personCount?: string; message?: string;
}) {
  return apiFetch<{ message: string }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Üst menü (Navbar) bağlantılarını getirir.
 */
export async function getNavbar() {
  return apiFetch<{ links: { label: string; href: string; children?: { label: string; href: string }[] }[] }>('/api/content/navbar');
}
