/**
 * ============================================================================
 * HAKKIMIZDA SAYFASI (ABOUT PAGE) — Next.js Server Component
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Bu sayfa, şirketin hikayesini, kurumsal değerlerini ve resmi kalite sertifikalarını
 * tanıtır.
 * 
 * KODDA DİKKAT EDİLMESİ GEREKEN TEKNİK DETAYLAR:
 * 1. Dinamik CMS Entegrasyonu: Sayfadaki hikaye, değerler ve sertifikalar doğrudan
 *    veritabanından (SiteSettings) çekilir. Admin panelinden yönetici bir yazı değiştirdiğinde
 *    burası anında güncellenir.
 * 2. Güvenli JSON Ayrıştırma (Safe JSON Parsing): Değerler ve sertifikalar veritabanında
 *    JSON metni olarak saklanır. `try-catch` blokları ile `JSON.parse` yapılarak
 *    herhangi bir bozuk veri durumunda varsayılan (DEFAULT_SETTINGS) veriye dönülmesi
 *    sağlanır (Savunmacı Programlama / Defensive Programming).
 * 3. Dinamik İkon Eşleme (getIconComponent): Veritabanından gelen "ShieldCheck" veya "Leaf"
 *    gibi metin karşılıklarını React Lucide ikon bileşenine dönüştürür.
 */

import type { Metadata } from "next";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { ScrollReveal } from "@/components/UI/ScrollReveal";
import { ShieldCheck, Target, Handshake, Lightbulb, Leaf, ChefHat, Star } from "lucide-react";
import styles from "./hakkimizda.module.css";
import { getSiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "Hakkımızda — Biz Kimiz",
  description:
    "Füzyon Yemek, ozon teknolojisiyle hijyenik yemek üretimi yapan, İstanbul merkezli kurumsal catering firmasıdır. Değerlerimiz, belgelerimiz ve ekibimizle tanışın.",
  alternates: { canonical: "https://www.fuzyonyemek.com/hakkimizda" },
};

export const dynamic = 'force-dynamic';

// Backend'e ulaşılamadığında gösterilecek varsayılan güvenli içerikler
const DEFAULT_SETTINGS = {
  aboutHeroTitle: 'Lezzet, Hijyen ve Güven',
  aboutHeroDesc: 'Geleneksel lezzetleri modern teknolojiyle buluşturarak İstanbul genelinde yüzlerce kurumsal müşteriye hizmet veriyoruz.',
  aboutStoryTitle: 'Adımız, Amaçlarımızdan Gelir',
  aboutStoryText: '"Füzyon" kelimesi, farklı kültürlerin lezzetlerini bir araya getirme felsefemizi yansıtır. Geleneksel Türk mutfağının zenginliğini, dünya mutfağının yenilikçi teknikleriyle harmanlayarak eşsiz bir gastronomi deneyimi sunmayı hedefliyoruz.\n\nEsenyurt\'taki modern üretim tesisimizde, son teknoloji ozon sanitasyon sistemi ve deneyimli şeflerimizle, her gün binlerce porsiyon hijyenik ve lezzetli yemek üretiyoruz.',
  aboutStoryImage: '/kalite.png',
  aboutValuesJson: JSON.stringify([
    { icon: 'ShieldCheck', title: 'Kalite Odaklılık', desc: 'ISO 22000, HACCP ve TSE standartlarına tam uyumlu üretim süreçleri ile her porsiyonda aynı kaliteyi sunuyoruz.' },
    { icon: 'Handshake', title: 'Güvenilirlik', desc: '15 yılı aşkın sektör deneyimimizle, 500\'den fazla kurumsal müşterinin güvenini kazandık.' },
    { icon: 'Lightbulb', title: 'İnovasyon', desc: 'Ozon sanitasyon, akıllı depolama ve dijital takip sistemleriyle sektörde öncü rol üstleniyoruz.' },
    { icon: 'Leaf', title: 'Sürdürülebilirlik', desc: 'Çevre dostu üretim politikamızla atık azaltma, enerji verimliliği ve yerel tedarik zincirine odaklanıyoruz.' }
  ]),
  aboutCertsJson: JSON.stringify([
    'ISO 22000 Gıda Güvenliği Yönetim Sistemi',
    'HACCP Tehlike Analizi ve Kritik Kontrol Noktaları',
    'TSE Hizmet Yeri Yeterlilik Belgesi',
    'İşyeri Açma ve Çalışma Ruhsatı',
    'Kapasite Raporu'
  ])
};

/**
 * İkon Adına Göre İlgili Lucide İkonunu Döndüren Yardımcı Fonksiyon
 */
function getIconComponent(iconName: string, size = 32) {
  switch (iconName) {
    case 'ShieldCheck': return <ShieldCheck size={size} strokeWidth={1.5} />;
    case 'Handshake': return <Handshake size={size} strokeWidth={1.5} />;
    case 'Lightbulb': return <Lightbulb size={size} strokeWidth={1.5} />;
    case 'Leaf': return <Leaf size={size} strokeWidth={1.5} />;
    case 'ChefHat': return <ChefHat size={size} strokeWidth={1.5} />;
    case 'Target': return <Target size={size} strokeWidth={1.5} />;
    default: return <Star size={size} strokeWidth={1.5} />;
  }
}

export default async function HakkimizdaPage() {
  let settings: Record<string, string> = {};
  try {
    settings = await getSiteSettings();
  } catch {
    // Fallback: API kapalıysa varsayılan ayarları kullan
  }

  const heroTitle = settings.aboutHeroTitle || DEFAULT_SETTINGS.aboutHeroTitle;
  const heroDesc = settings.aboutHeroDesc || DEFAULT_SETTINGS.aboutHeroDesc;
  const storyTitle = settings.aboutStoryTitle || DEFAULT_SETTINGS.aboutStoryTitle;
  const storyTextRaw = settings.aboutStoryText || DEFAULT_SETTINGS.aboutStoryText;
  const storyImage = settings.aboutStoryImage || DEFAULT_SETTINGS.aboutStoryImage;
  
  // JSON verilerini diziye çeviriyoruz
  let valuesArray: Array<{icon: string, title: string, desc: string}> = [];
  try {
    valuesArray = JSON.parse(settings.aboutValuesJson || DEFAULT_SETTINGS.aboutValuesJson);
  } catch {
    valuesArray = JSON.parse(DEFAULT_SETTINGS.aboutValuesJson);
  }

  let certsArray: string[] = [];
  try {
    certsArray = JSON.parse(settings.aboutCertsJson || DEFAULT_SETTINGS.aboutCertsJson);
  } catch {
    certsArray = JSON.parse(DEFAULT_SETTINGS.aboutCertsJson);
  }

  return (
    <ScrollReveal>
      {/* ── Üst Banner (Hero) ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <div className="reveal">
            <span className={styles.tagline}>Hakkımızda</span>
            <h1 className={styles.heroTitle}>
              {heroTitle}
            </h1>
            <p className={styles.heroDesc}>
              {heroDesc}
            </p>
          </div>
        </div>
      </section>

      {/* ── Hikayemiz Bölümü ── */}
      <section className="section">
        <div className="container">
          <div className={`${styles.storyGrid} reveal`}>
            <div className={styles.storyImage}>
              <img src={storyImage} alt="Füzyon Yemek Catering Hizmeti" />
            </div>
            <div>
              <SectionHeading
                tagline="Hikayemiz"
                title={storyTitle}
                align="left"
              />
              {storyTextRaw.split('\n').filter(p => p.trim() !== '').map((paragraph, idx) => (
                <p key={idx} className={styles.storyText}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Temel Değerlerimiz Bölümü ── */}
      <section className="section section--alt" id="degerlerimiz">
        <div className="container">
          <div className="reveal">
            <SectionHeading
              tagline={settings.aboutValuesTagline || "Değerlerimiz"}
              title={settings.aboutValuesTitle || "İlkelerimizle Fark Yaratıyoruz"}
            />
          </div>
          <div className={styles.valuesGrid}>
            {valuesArray.map((v, i) => (
              <div
                key={i}
                className={`${styles.valueCard} reveal`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={styles.valueIcon}>{getIconComponent(v.icon)}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Resmi Kalite Belgelerimiz Bölümü ── */}
      <section className="section" id="belgelerimiz">
        <div className="container">
          <div className="reveal">
            <SectionHeading
              tagline={settings.aboutCertsTagline || "Belgelerimiz"}
              title={settings.aboutCertsTitle || "Uluslararası Standartlarda Hizmet"}
              subtitle={settings.aboutCertsSubtitle || "Kalite ve güvenilirliğimizi belgelerimizle kanıtlıyoruz."}
            />
          </div>
          <div className={styles.certList}>
            {certsArray.map((cert, i) => (
              <div
                key={i}
                className={`${styles.certItem} reveal`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <ShieldCheck className={styles.certIcon} size={20} />
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
