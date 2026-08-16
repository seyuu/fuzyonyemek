/**
 * ============================================================================
 * ANA SAYFA (HOME PAGE) — Next.js Server Component
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Bu dosya, ziyaretçilerin web sitemize (fuzyonyemek.com) girdiğinde gördüğü ilk sayfadır.
 * 
 * NEDEN SERVER COMPONENT?
 * Next.js 13+ ile gelen App Router'da varsayılan olarak tüm bileşenler "Server Component"tir.
 * Yani bu kod tarayıcıda değil, doğrudan sunucuda çalışır!
 * 
 * AVANTAJLARI:
 * 1. Hız & Performans: Veritabanı / API sorguları sunucu tarafında yapılır, tarayıcıya
 *    sadece hazır HTML ve CSS gönderilir. Kullanıcının bilgisayarı yorulmaz.
 * 2. Mükemmel SEO: Google robotları sayfaya geldiğinde boş bir JavaScript dosyası yerine
 *    tüm içeriği (başlıklar, yazılar, resimler) dolu dolu görür.
 * 3. Fallback (Yedek Veri) Güvenliği: Eğer Backend API sunucusu anlık olarak kapalıysa
 *    veya bakım yapılıyorsa, sayfa çökmek yerine FALLBACK_STATS gibi hazır verileri
 *    göstererek kullanıcının kusursuz bir deneyim yaşamasını sağlar.
 */

import styles from "./page.module.css";
import { Button } from "@/components/UI/Button";
import { ServiceCard } from "@/components/UI/ServiceCard";
import { ScrollReveal } from "@/components/UI/ScrollReveal";
import { Truck, ChefHat, GlassWater, ShieldCheck, Leaf, Target } from "lucide-react";
import { Marquee } from "@/components/UI/Marquee";
import { getStats, getSiteSettings, getServices } from "@/lib/api";

// API'ye ulaşılamazsa gösterilecek varsayılan güvenli veriler (Fallback Data)
const FALLBACK_STATS = [
  { number: "15+", label: "Yıllık Deneyim" },
  { number: "500", label: "Kurumsal Referans" },
  { number: "50k", label: "Günlük Porsiyon" },
  { number: "%99", label: "Hijyen & Ozon Onayı" },
];

// force-dynamic: Sayfanın her istek geldiğinde sunucuda canlı olarak yeniden hesaplanmasını sağlar
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Başlangıç değerlerini fallback verilerimizle ayarlıyoruz
  let STATS = FALLBACK_STATS;
  let settings: Record<string, string> = {};
  let services: { iconName: string | null; title: string; shortDescription: string; slug: string; backgroundImageUrl?: string | null }[] = [];
  
  // Sunucudan (API) güncel verileri çekmeyi deniyoruz
  try {
    const apiStats = await getStats();
    if (apiStats.length > 0) {
      STATS = apiStats.map(s => ({ number: s.number, label: s.label }));
    }
    settings = await getSiteSettings();
    const apiServices = await getServices();
    if (apiServices && apiServices.length > 0) {
      services = apiServices;
    }
  } catch {
    // Backend API çalışmıyorsa sessizce fallback verilerine döner, sayfa ASLA çökmez!
  }

  // Dinamik site ayarlarından metinleri alıyoruz (Admin panelinden değiştirilebilen alanlar)
  const heroTagline = settings.heroTagline || "Kurumsal Gastronomi";
  const heroTitle = settings.heroTitle || "Geleneksel Lezzetleri, Son Teknoloji ile Üretiyoruz.";
  const heroDesc = settings.heroDescription || "Hijyen ve kaliteden ödün vermeden hayatınıza sağlıklı lezzet katıyoruz. Gıda sektöründe ozon yöntemi kullanan ender firmalardan biriyiz.";

  // Başlığı iki parçaya bölüyoruz (Görsel vurgu ve tipografi efekti için)
  const titleParts = heroTitle.split(/(?<=[.,])\s+/);
  const mainTitle = titleParts[0] || heroTitle;
  const accentTitle = titleParts.slice(1).join(" ");

  return (
    // ScrollReveal: Sayfa aşağı kaydırıldıkça elemanların yumuşakça belirmesini (fade-in) sağlar
    <ScrollReveal>
      
      {/* ═══════ 1. BÖLÜM: HERO (GİRİŞ MANŞETİ) ═══════ */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <span className={styles.heroTagline}>{heroTagline}</span>
            <h1 className={styles.heroTitle}>
              {mainTitle}
              {accentTitle && <span className={styles.heroTitleAccent}> {accentTitle}</span>}
            </h1>
            <p className={styles.heroDesc}>
              {heroDesc}
            </p>
            <div className={styles.heroButtons}>
              <Button variant="primary" size="lg" href="/iletisim">
                Özel Teklif Alın
              </Button>
              <Button variant="outlineDark" size="lg" href="/hizmetlerimiz">
                Uzmanlıklarımız
              </Button>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={styles.heroImageMask} />
            <img src={settings.heroBackgroundImage || "/images/slide-1.png"} alt="Profesyonel Şef ve Premium Mutfak Ortamı" />
          </div>
        </div>
      </section>

      {/* ═══════ 2. BÖLÜM: SAYAÇLAR / İSTATİSTİK BENTO GRID ═══════ */}
      <section className={`${styles.stats} container`}>
        <div className={`${styles.statsGrid} reveal`}>
          {STATS.map((stat, i) => (
            <div key={i} className={styles.statItem}>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ 3. BÖLÜM: HİZMETLER (SERVICES) ASİMETRİK KARTLAR ═══════ */}
      <section className={styles.services} id="hizmetlerimiz">
        <div className="container">
          <div className={`reveal ${styles.servicesHeader}`}>
            <span className={styles.heroTagline}>Çözümler</span>
            <h2 className={styles.heroTitle} style={{ fontSize: "var(--text-4xl)", marginBottom: "var(--space-sm)" }}>
              Her Ölçekte Kusursuz Operasyon
            </h2>
          </div>

          <div className={styles.servicesGrid}>
            {services.slice(0, 3).map((service, index) => {
              // İlk kartı CSS Grid asimetrik düzeninde daha büyük (large) gösteriyoruz
              const isLarge = index === 0;
              let IconComponent = <Truck size={isLarge ? 32 : 28} strokeWidth={1.5} />;
              if (service.iconName === 'ChefHat') IconComponent = <ChefHat size={isLarge ? 32 : 28} strokeWidth={1.5} />;
              if (service.iconName === 'GlassWater') IconComponent = <GlassWater size={isLarge ? 32 : 28} strokeWidth={1.5} />;

              return (
                <div key={index} className={`reveal ${isLarge ? styles.serviceLarge : ''}`} style={{ transitionDelay: `${index * 100}ms` }}>
                  <ServiceCard 
                    icon={IconComponent}
                    title={service.title}
                    description={service.shortDescription}
                    href={`/hizmetlerimiz/${service.slug}`}
                    large={isLarge}
                    bgImage={service.backgroundImageUrl || (index === 0 ? "/images/services/tasima_yemek_bg.png" : index === 1 ? "/images/services/yerinde_uretim_bg.png" : "/images/services/outside_catering_bg.png")}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ 4. BÖLÜM: NEDEN BİZ? (OZON TEKNOLOJİSİ & KALİTE) ═══════ */}
      <section className={styles.whyUs} id="neden-biz">
        <div className="container">
          <div className={styles.whyUsGrid}>
            <div className={`${styles.whyUsImage} reveal`}>
              <img src="/kalite.png" alt="Ozon Teknolojisi ve Hijyenik Mutfak" />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3xl)" }}>
              <div className={`${styles.whyUsContent} reveal`} style={{ transitionDelay: "100ms" }}>
                <span className={styles.heroTagline} style={{ color: "var(--color-accent)" }}>Felsefemiz</span>
                <h2 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-md)'}}>
                  "Dünyada hiç kimse; bir şeyi kötü yapmadan daha ucuza satamaz."
                </h2>
                <p>
                  Bu nedenle; bir malın sadece fiyatına bakmak, bazı hilelerini kabul etmek demektir.
                  Biz, ozon teknolojimiz ve sıfır hata toleransımızla personelinize güvenilir bir sofra sunuyoruz.
                </p>
              </div>
              
              <div className={`${styles.featureList} reveal`} style={{ transitionDelay: "150ms" }}>
                <div className={styles.featureItem}>
                  <ShieldCheck className={styles.featureIcon} size={28} strokeWidth={1.5} />
                  <h4>Ozon Sanitasyonu</h4>
                  <p>Su ve gıda sterilizasyonunda %99.9 oranında hijyen sağlayan sistem.</p>
                </div>
                <div className={styles.featureItem}>
                  <Target className={styles.featureIcon} size={28} strokeWidth={1.5} />
                  <h4>Sıfır Hata Toleransı</h4>
                  <p>Tedarikten sevkiyata tüm aşamalar uluslararası kalite standartlarındadır.</p>
                </div>
                <div className={styles.featureItem}>
                  <Leaf className={styles.featureIcon} size={28} strokeWidth={1.5} />
                  <h4>Besleyici Menüler</h4>
                  <p>Mevsiminde, yerel üreticilerden sağlanan taze malzemeler.</p>
                </div>
                <div className={styles.featureItem}>
                  <ChefHat className={styles.featureIcon} size={28} strokeWidth={1.5} />
                  <h4>Usta Şefler</h4>
                  <p>Geleneksel Türk mutfağına hakim deneyimli gastronomi uzmanları.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 5. BÖLÜM: TEDARİKÇİ LOGOLARI (SONSUZ KAYAN ŞERİT - MARQUEE) ═══════ */}
      <section className={styles.suppliers} style={{ padding: "var(--space-xl) 0" }}>
        <div className="container" style={{ marginBottom: "var(--space-md)", textAlign: "center" }}>
          <span className={styles.heroTagline}>Güçlü İş Birlikleri</span>
          <h2 style={{ fontSize: "var(--text-3xl)" }}>Tedarikçilerimiz</h2>
        </div>
        <Marquee images={[
          "/tedarikciler/4ItDSzHK.png", "/tedarikciler/7GbNa7eE.png", "/tedarikciler/8UNpQhsE.jpg",
          "/tedarikciler/9bXatpHf.jpg", "/tedarikciler/BRyX2LHe.jpg", "/tedarikciler/CMEReghN.png",
          "/tedarikciler/eJS8laba.jpg", "/tedarikciler/FCL1uU1Y.jpg", "/tedarikciler/GC4jUuV1.jpg",
          "/tedarikciler/gOzxSvPo.jpg", "/tedarikciler/hbtah6yC.jpg", "/tedarikciler/hGCHcaSt.png",
          "/tedarikciler/ivO7rbSA.jpg", "/tedarikciler/JB5rySYH.jpg", "/tedarikciler/kxz4kNmO.jpg",
          "/tedarikciler/mwDNflZd.png", "/tedarikciler/o3LLBECS.jpg", "/tedarikciler/q4ZP5RKj.jpg",
          "/tedarikciler/qIc2F6a6.gif", "/tedarikciler/s4CzJNZp.jpg", "/tedarikciler/SEMoumNm.png",
          "/tedarikciler/STX6q5fH.jpg", "/tedarikciler/T96FbblB.jpg", "/tedarikciler/TQ8JGetV.jpg",
          "/tedarikciler/TYyOvsP1.png", "/tedarikciler/Vu1a4KNO.png", "/tedarikciler/WySoWeIQ.jpg",
          "/tedarikciler/xfoUGtuo.jpg", "/tedarikciler/xvPWVKIq.png"
        ]} />
      </section>

      {/* ═══════ 6. BÖLÜM: AKSİYON ÇAĞRISI (CALL TO ACTION - CTA) ═══════ */}
      <section className={styles.cta}>
        <div className={`container reveal ${styles.ctaWrapper}`}>
          <span className={styles.heroTagline}>Sonraki Adım</span>
          <h2 className={styles.ctaTitle}>Kurumunuza Değer Katın.</h2>
          <Button variant="primary" size="lg" href="/iletisim">
            Teklif Dosyası İsteyin
          </Button>
        </div>
      </section>
      
    </ScrollReveal>
  );
}
