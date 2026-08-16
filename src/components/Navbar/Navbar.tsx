/**
 * ============================================================================
 * NAVBAR BİLEŞENİ (NAVİGASYON ÇUBUĞU) — Responsive Header
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Web sitelerinin en önemli kullanıcı arayüzü bileşenidir.
 * 
 * KULLANILAN TEKNİK ÖZELLİKLER:
 * 1. Dinamik Şeffaflık / Arka Plan (`scrolled` state):
 *    Kullanıcı sayfanın en üstündeyken menü şeffaftır; 40 piksel aşağı kaydırdığında
 *    araya cam efekti (Glassmorphism / Blur) ve gölge eklenir.
 * 2. usePathname() Hook'u: Next.js'te kullanıcının o an hangi sayfada olduğunu
 *    anlamamızı sağlar (Örn: Ana sayfada mıyız yoksa /blog sayfasında mıyız?).
 * 3. Çok Katmanlı Açılır Menü (Dropdown): "Hizmetlerimiz" linkinin üzerine gelindiğinde
 *    alt hizmetler (Taşıma Yemek, Yerinde Üretim vs.) açılır.
 * 4. Mobil Uyumlu Hamburger Menü: Ekran küçüldüğünde buton açılıp tüm ekranı
 *    kaplayan şık bir mobil menüye dönüşür.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import styles from "./Navbar.module.css";

// Menüdeki ana ve alt bağlantıların veri listesi
const NAV_LINKS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  {
    label: "Hizmetlerimiz",
    href: "/hizmetlerimiz",
    children: [
      { label: "Taşıma Yemek", href: "/hizmetlerimiz/tasima-yemek" },
      { label: "Yerinde Üretim", href: "/hizmetlerimiz/yerinde-uretim" },
      { label: "Outside Catering", href: "/hizmetlerimiz/catering" },
    ],
  },
  { label: "Galeri", href: "/galeri" },
  { label: "Kalite & Hijyen", href: "/kalite-ve-hijyen" },
  { label: "E-Katalog", href: "/katalog.pdf", target: "_blank" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  
  // Sayfanın aşağı kaydırılıp kaydırılmadığı
  const [scrolled, setScrolled] = useState(false);
  // Mobilde hamburger menünün açık olup olmadığı
  const [mobileOpen, setMobileOpen] = useState(false);
  // Mobilde alt menülerin açık/kapalı durumları
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  /**
   * Sayfa kaydırma dinleyicisi (Scroll Listener)
   */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Mobil menü açıkken arka planın kaymasını engelleyen kilit
   */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleMobileMenu = (label: string) => {
    setExpandedMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      <nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ""} ${isHomePage ? styles.navLight : ""}`}
        id="main-navigation"
      >
        <div className={styles.navInner}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="Füzyon Yemek Ana Sayfa">
            <img src="/images/logo-new.png" alt="Füzyon Yemek Logo" className={styles.logoImage} />
          </Link>

          {/* Masaüstü Menü Bağlantıları */}
          <div className={styles.links}>
            {NAV_LINKS.map((item) =>
              item.children ? (
                // Alt menüsü olan bağlantı (Dropdown)
                <div key={item.label} className={styles.dropdown}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                  <div className={styles.dropdownMenu}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={styles.dropdownLink}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                // Tekil bağlantı
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={styles.link} 
                  target={item.target} 
                  rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                >
                  {item.label}
                </Link>
              )
            )}
            
            {/* Hızlı Teklif Al Butonu */}
            <Link href="/iletisim" className={styles.ctaButton}>
              Teklif Al
            </Link>
          </div>

          {/* Mobil Cihazlar İçin Hamburger Menü Butonu */}
          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.open : ""}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menüyü aç/kapat"
            aria-expanded={mobileOpen}
            id="mobile-menu-toggle"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </nav>

      {/* ── Mobil Menü Çekmecesi (Drawer) ── */}
      <div
        className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ""}`}
        id="mobile-menu"
      >
        {NAV_LINKS.map((item) => (
          <div key={item.label} className={styles.mobileItemWrap}>
            <div className={styles.mobileLinkRow}>
              <Link
                href={item.href}
                className={styles.mobileLink}
                onClick={() => setMobileOpen(false)}
                target={item.target}
                rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
              >
                {item.label}
              </Link>
              
              {/* Varsa mobil alt menü açma oku */}
              {item.children && (
                <button
                  className={styles.mobileSubToggle}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMobileMenu(item.label);
                  }}
                  aria-label="Alt menüyü aç/kapat"
                >
                  <ChevronDown
                    size={24}
                    style={{
                      transform: expandedMenus[item.label] ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </button>
              )}
            </div>

            {/* Mobil Alt Menü Elemanları */}
            {item.children && (
              <div 
                className={`${styles.mobileSub} ${expandedMenus[item.label] ? styles.open : ""}`}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={styles.mobileSubLink}
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <Link
          href="/iletisim"
          className={styles.ctaButton}
          onClick={() => setMobileOpen(false)}
          style={{ alignSelf: "flex-start", marginTop: "var(--space-lg)" }}
        >
          Teklif Al
        </Link>
      </div>
    </>
  );
}
