/**
 * ============================================================================
 * HİZMETLERİMİZ SAYFASI (SERVICES PAGE) — Next.js Server Component
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Bu sayfa, şirketin sunduğu 3 ana hizmet modelini (Taşıma Yemek, Yerinde Üretim,
 * Outside Catering) ve 4 adımlı müşteri çalışma sürecini tanıtır.
 * 
 * KODLAMA İPUÇLARI VE TEKNİK DETAYLAR:
 * 1. Fallback Hizmet Listesi: API'den veri gelmediğinde sitenin boş kalmasını önleyen
 *    FALLBACK_SERVICES dizisi.
 * 2. Record<string, React.ReactNode> Tipi: TypeScript'te anahtar-değer (Key-Value)
 *    sözlüklerini tanımlamak için kullanılan en temiz yöntemdir.
 * 3. Spread Operator ({...s}): Servis nesnesindeki tüm alanları (icon, title, description, href)
 *    `<ServiceCard {...s} />` şeklinde tek hamlede bileşene prop olarak aktarmamızı sağlar.
 */

import type { Metadata } from "next";
import { ScrollReveal } from "@/components/UI/ScrollReveal";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { ServiceCard } from "@/components/UI/ServiceCard";
import { Truck, ChefHat, GlassWater } from "lucide-react";
import styles from "./hizmetlerimiz.module.css";
import { getServices } from "@/lib/api";

export const metadata: Metadata = {
  title: "Hizmetlerimiz — Kurumsal Yemek Çözümleri",
  description:
    "Taşıma yemek, yerinde üretim ve outside catering hizmetleriyle İstanbul genelinde kurumsal müşterilerimize hijyenik, lezzetli ve ekonomik yemek çözümleri sunuyoruz.",
  alternates: { canonical: "https://www.fuzyonyemek.com/hizmetlerimiz" },
};

// API erişilemezse devreye girecek varsayılan hizmetler
const FALLBACK_SERVICES = [
  {
    iconName: "Truck",
    title: "Taşıma Yemek Hizmeti",
    shortDescription: "Merkez mutfağımızda hazırlanan yemeklerimiz, özel thermobox kaplarla ısı kontrolü altında taşınarak tesislerinize ulaştırılır.",
    slug: "tasima-yemek",
  },
  {
    iconName: "ChefHat",
    title: "Yerinde Üretim Hizmeti",
    shortDescription: "Tesislerinizin mutfak altyapısını kullanarak deneyimli şeflerimizle yerinde, taze ve günlük yemek üretimi gerçekleştiriyoruz.",
    slug: "yerinde-uretim",
  },
  {
    iconName: "GlassWater",
    title: "Outside Catering",
    shortDescription: "Kokteyl, açılış, seminer, düğün ve özel davetleriniz için A'dan Z'ye profesyonel catering organizasyonu sunuyoruz.",
    slug: "catering",
  },
];

// İkon isimlerini React bileşenleriyle eşleştiren sözlük
const ICONS: Record<string, React.ReactNode> = {
  Truck: <Truck size={28} strokeWidth={1.5} />,
  ChefHat: <ChefHat size={28} strokeWidth={1.5} />,
  GlassWater: <GlassWater size={28} strokeWidth={1.5} />
};

export default async function HizmetlerimizPage() {
  let services: { iconName: string | null; title: string; shortDescription: string; slug: string; backgroundImageUrl?: string | null }[] = FALLBACK_SERVICES;
  
  try {
    const apiServices = await getServices();
    if (apiServices && apiServices.length > 0) {
      services = apiServices;
    }
  } catch {
    // Fallback verilerini kullan
  }

  // Verileri ServiceCard bileşeninin beklediği formata dönüştürüyoruz
  const formattedServices = services.map((s, index) => ({
    icon: ICONS[s.iconName || "Truck"] || ICONS["Truck"],
    title: s.title,
    description: s.shortDescription,
    href: `/hizmetlerimiz/${s.slug}`,
    bgImage: s.backgroundImageUrl || (index === 0 ? "/images/services/tasima_yemek_bg.png" : index === 1 ? "/images/services/yerinde_uretim_bg.png" : "/images/services/outside_catering_bg.png")
  }));

  return (
    <ScrollReveal>
      {/* ── 1. BÖLÜM: HERO BAŞLIĞI ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <div className="reveal">
            <span className={styles.tagline}>Hizmetlerimiz</span>
            <h1 className={styles.heroTitle}>
              Her İhtiyaca Özel Çözümler
            </h1>
            <p className={styles.heroDesc}>
              15 yılı aşkın tecrübemizle İstanbul'un her noktasına hijyenik,
              lezzetli ve ekonomik kurumsal yemek hizmeti sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. BÖLÜM: 3 ANA HİZMET MODELİ KARTLARI ── */}
      <section className="section">
        <div className="container">
          <div className="reveal">
            <SectionHeading
              tagline="Çözümlerimiz"
              title="Üç Temel Hizmet Modelimiz"
              subtitle="İşletmenizin büyüklüğüne, konumuna ve ihtiyaçlarına göre en uygun modeli birlikte belirleyelim."
            />
          </div>
          <div className={styles.grid}>
            {formattedServices.map((s, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                <ServiceCard {...s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. BÖLÜM: 4 ADIMLI NASIL ÇALIŞIYORUZ SÜRECİ ── */}
      <section className="section section--alt">
        <div className="container">
          <div className="reveal">
            <SectionHeading
              tagline="Süreç"
              title="Nasıl Çalışıyoruz?"
              subtitle="Teklif almadan teslimat sürecine kadar şeffaf ve profesyonel bir iş akışı."
            />
          </div>
          <div className={styles.processGrid}>
            {[
              { step: "01", title: "Talep & Analiz", desc: "İhtiyaçlarınızı dinliyor, personel sayısı ve menü tercihlerinizi analiz ediyoruz." },
              { step: "02", title: "Özel Teklif", desc: "Size özel hazırlanan menü planı ve fiyat teklifini sunuyoruz." },
              { step: "03", title: "Deneme Yemeği", desc: "Karar sürecinizi kolaylaştırmak için ücretsiz deneme yemeği organizasyonu." },
              { step: "04", title: "Hizmet Başlangıcı", desc: "Anlaşma sonrası düzenli, kesintisiz ve kaliteli yemek hizmetine başlıyoruz." },
            ].map((p, i) => (
              <div
                key={i}
                className={`${styles.processCard} reveal`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className={styles.processStep}>{p.step}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
