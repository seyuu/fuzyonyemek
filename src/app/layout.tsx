/**
 * ============================================================================
 * ROOT LAYOUT (KÖK DÜZEN BİLEŞENİ) — Next.js App Router
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Bu dosya, tüm web sitesinin en dışındaki "iskelet" veya "şablon" dosyasıdır.
 * 
 * NEDEN ROOT LAYOUT KULLANILIR?
 * 1. Sayfa Değiştiğinde Tekrar Yüklenmeyen Elemanlar: Örneğin üst menü (Navbar)
 *    ve alt bilgi alanı (Footer), kullanıcı hangi sayfaya giderse gitsin sabit kalır.
 *    Root layout sayesinde her sayfa için Navbar ve Footer'ı baştan baştan yazmayız.
 * 2. {children} Mantığı: Ortadaki `<main>{children}</main>` alanı, o an ziyaret edilen
 *    sayfanın (page.tsx) içeriğinin yerleştirileceği dinamik boşluktur.
 * 3. Global Font ve Stil Yüklemesi: Google Fonts (Inter ve Playfair) ve globals.css
 *    burada yüklenerek tüm projede geçerli olur.
 * 4. Arama Motoru Optimizasyonu (SEO / Metadata): Google, Twitter ve Facebook'un
 *    sitemizi tararken okuyacağı başlık, açıklama ve anahtar kelimeler burada tanımlanır.
 */

import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import { SchemaOrg } from "@/components/SEO/SchemaOrg";

/* ── GOOGLE FONTS TANIMLAMALARI ── */
// Next.js, fontları derleme aşamasında indirip kendi sunucumuzdan sunar (Font Optimizasyonu).
// Böylece harici Google sunucusuna bağlanma gecikmesi yaşanmaz.
const inter = Inter({
  subsets: ["latin", "latin-ext"], // Türkçe karakter desteği (ğ, ü, ş, ı, ö, ç)
  variable: "--font-inter",        // CSS'te var(--font-inter) olarak kullanmak için değişken adı
  display: "swap",                 // Font yüklenene kadar sistem fontunu göster, gelince değiştir
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",     // Şık başlıklar için tırnaklı (serif) font
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* ── KÜRESEL SEO VE META VERİLERİ (METADATA) ── */
export const metadata: Metadata = {
  metadataBase: new URL("https://www.fuzyonyemek.com"),
  title: {
    default: "Füzyon Yemek | Kurumsal Yemek Hizmetleri — İstanbul",
    template: "%s | Füzyon Yemek", // Alt sayfalarda örn: "Hakkımızda | Füzyon Yemek" şeklinde görünür
  },
  description:
    "Ozon teknolojisiyle üretilmiş hijyenik ve lezzetli yemekler. İstanbul genelinde taşıma yemek, yerinde üretim ve catering hizmetleri.",
  keywords: [
    "kurumsal yemek",
    "taşıma yemek İstanbul",
    "catering İstanbul",
    "yerinde yemek üretimi",
    "toplu yemek hizmeti",
    "Esenyurt catering",
    "Beylikdüzü yemek firması",
    "ozon hijyen yemek",
  ],
  authors: [{ name: "Füzyon Yemek" }],
  creator: "Füzyon Yemek",
  // OpenGraph: Facebook, WhatsApp veya LinkedIn'de link paylaşıldığında çıkan kart önizlemesi
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Füzyon Yemek",
    title: "Füzyon Yemek | Kurumsal Yemek Hizmetleri",
    description:
      "Ozon teknolojisiyle üretilmiş hijyenik ve lezzetli yemekler. İstanbul genelinde taşıma yemek, yerinde üretim ve catering hizmetleri.",
  },
  // Twitter / X kart görünümü
  twitter: {
    card: "summary_large_image",
  },
  // Arama motoru robotlarının siteyi dizine ekleme izinleri
  robots: {
    index: true,  // Google arama sonuçlarına ekle
    follow: true, // Sayfadaki bağlantıları takip et
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.fuzyonyemek.com",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
};

/**
 * RootLayout Bileşeni
 * @param children Sayfa içeriği (React Node)
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* SchemaOrg: Google arama motorunun şirket bilgilerini (adres, telefon, logo) yapısal anlamasını sağlar */}
        <SchemaOrg />
        
        {/* Üst Menü / Navigasyon Çubuğu */}
        <Navbar />
        
        {/* Ziyaret edilen sayfanın (page.tsx) render edildiği ana alan */}
        <main>{children}</main>
        
        {/* Alt Bilgi ve Telif Alanı */}
        <Footer />
      </body>
    </html>
  );
}
