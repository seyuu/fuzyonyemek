/**
 * ============================================================================
 * FOOTER BİLEŞENİ (ALT BİLGİ ALANI) — Kurumsal Bilgi ve Telif Bloğu
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Sitenin tüm sayfalarının en altında yer alan kurumsal alt bilgi alanıdır.
 * 
 * YAPISI VE PRENSİPLERİ:
 * 1. Dinamik Telif Yılı: `new Date().getFullYear()` kullanılarak telif yılı (Copyright)
 *    her sene otomatik olarak güncel yılı (2026, 2027...) gösterir. Elle değiştirmek gerekmez!
 * 2. 4 Sütunlu Grid Düzeni:
 *    - Sütun 1: Logo, şirket sloganı ve sosyal medya ikonları (Instagram, Facebook)
 *    - Sütun 2: Kurumsal sayfalar (Hakkımızda, Değerlerimiz, Belgelerimiz, Blog, Galeri)
 *    - Sütun 3: Hizmet modelleri (Taşıma Yemek, Yerinde Üretim, Catering)
 *    - Sütun 4: Fiziksel adres, telefon ve kurumsal e-posta bağlantıları
 * 3. Hukuki Bağlantılar: KVKK Aydınlatma Metni ve Gizlilik Politikası bağlantıları.
 */

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import styles from "./Footer.module.css";

export function Footer() {
  // Dinamik olarak içinde bulunulan yılı alır (Örn: 2026)
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="site-footer">
      <div className="container">
        <div className={styles.footerGrid}>
          
          {/* 1. Sütun: Marka, Logo ve Sosyal Medya */}
          <div className={styles.brand}>
            <Link href="/" className={styles.brandName}>
              <img src="/images/logo-new.png" alt="Füzyon Yemek Logo" className={styles.logoImage} />
            </Link>
            <p className={styles.brandDesc}>
              Hijyen ve kaliteden ödün vermeden, ozon teknolojisiyle üretilen
              sağlıklı lezzetleri sofranıza getiriyoruz.
            </p>
            <div className={styles.socialLinks} style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-md)" }}>
              <a href="https://www.instagram.com/fuzyonyemek" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} aria-label="Instagram Hesabımız">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://tr-tr.facebook.com/fuzyon.yemek" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} aria-label="Facebook Sayfamız">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* 2. Sütun: Kurumsal Sayfa Bağlantıları */}
          <div>
            <h3 className={styles.colTitle}>Kurumsal</h3>
            <div className={styles.colLinks}>
              <Link href="/hakkimizda" className={styles.colLink}>Hakkımızda</Link>
              <Link href="/hakkimizda#degerlerimiz" className={styles.colLink}>Değerlerimiz</Link>
              <Link href="/hakkimizda#belgelerimiz" className={styles.colLink}>Belgelerimiz</Link>
              <Link href="/blog" className={styles.colLink}>Blog</Link>
              <Link href="/galeri" className={styles.colLink}>Galeri</Link>
            </div>
          </div>

          {/* 3. Sütun: Hizmetlerimiz */}
          <div>
            <h3 className={styles.colTitle}>Hizmetlerimiz</h3>
            <div className={styles.colLinks}>
              <Link href="/hizmetlerimiz/tasima-yemek" className={styles.colLink}>Taşıma Yemek</Link>
              <Link href="/hizmetlerimiz/yerinde-uretim" className={styles.colLink}>Yerinde Üretim</Link>
              <Link href="/hizmetlerimiz/catering" className={styles.colLink}>Outside Catering</Link>
            </div>
          </div>

          {/* 4. Sütun: İletişim Bilgileri */}
          <div className={styles.colContactBlock}>
            <h3 className={styles.colTitle}>İletişim</h3>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}><MapPin size={20} /></span>
              <span>
                Güzelyurt Mah. Mehmet Akif Ersoy Cad. No: 8 Zemin Kat,
                Esenyurt / Beylikdüzü — İstanbul
              </span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}><Phone size={20} /></span>
              <span>
                <a href="tel:+902128530392">0212 853 03 92</a>
                {" / "}
                <a href="tel:+902128530393">0212 853 03 93</a>
              </span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}><Mail size={20} /></span>
              <a href="mailto:info@fuzyonyemek.com">info@fuzyonyemek.com</a>
            </div>
          </div>
        </div>

        {/* ── Alt Çizgi ve Telif Hakları ── */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Füzyon Yemek Üretim Gıda San. İç ve Dış Tic. Ltd. Şti. Tüm hakları saklıdır.
          </p>

          <a href="https://kio.com.tr" target="_blank" rel="noopener noreferrer" className={styles.developedBy}>
            <span>Developed by</span>
            <img src="/kio-logo-dark.png" alt="Kio" className={styles.kioLogoImage} />
          </a>

          <div className={styles.bottomLinks}>
            <Link href="/gizlilik-politikasi" className={styles.bottomLink}>
              Gizlilik Politikası
            </Link>
            <Link href="/kvkk" className={styles.bottomLink}>
              KVKK Aydınlatma
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
