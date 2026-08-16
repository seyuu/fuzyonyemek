/**
 * ============================================================================
 * KALİTE VE HİJYEN SAYFASI (QUALITY & HYGIENE) — React Client Component
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Bu sayfada ozon teknolojisi, sıfır hata kalite politikası ve resmi sertifikalar
 * tanıtılır.
 * 
 * BURADAKİ ÖNEMLİ FRONTEND KONSEPTLERİ:
 * 1. Modal / Lightbox Mimarisi: Kullanıcı bir sertifikaya tıkladığında o resim
 *    ekranın ortasında büyük olarak açılır (`selectedImage` state'i).
 * 2. useEffect ile Sayfa Kaydırmasını Engelleme: Modal açıkken arkadaki sayfanın
 *    kaymasını önlemek için `document.body.style.overflow = "hidden"` yapılır.
 *    Bileşen kapandığında ise "cleanup" fonksiyonu ile `overflow = ""` eski haline getirilir.
 * 3. Event Bubbling (Olay Yayılımı) ve stopPropagation():
 *    Kullanıcı modalın dışındaki siyah alana tıklarsa pencere kapanır (`setSelectedImage(null)`),
 *    ancak resmin kendisine tıklarsa kapanmaması için `e.stopPropagation()` kullanılır!
 */

"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { ShieldCheck, Target } from "lucide-react";
import { SectionHeading } from "@/components/UI/SectionHeading";

export default function KaliteVeHijyenPage() {
  // Seçilen (büyütülen) sertifika görselinin dosya yolu
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Gösterilecek resmi sertifikaların listesi
  const sertifikalar = [
    { src: "/kalite-belgeleri/4fdz64nO.jpg", alt: "ISO 22000 Gıda Güvenliği Belgesi" },
    { src: "/kalite-belgeleri/7sQZGVEX.jpg", alt: "HACCP Hijyen ve Kalite Belgesi" },
    { src: "/kalite-belgeleri/qHQltDWz.jpg", alt: "TSE Hizmet Yeri Yeterlilik Belgesi" },
    { src: "/kalite-belgeleri/RdumRLMk.jpg", alt: "İşyeri Çalışma Ruhsatı" },
    { src: "/kalite-belgeleri/VvPImPSy.png", alt: "Kapasite ve Hijyen Raporu" }
  ];

  /**
   * Modal açıldığında sayfanın arkada kaymasını engelleyen efekt
   */
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup fonksiyonu: Sayfadan çıkılırsa kaydırma çubuğunu normale döndür
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  return (
    <>
      <div className={styles.pageWrapper}>
        {/* ── 1. BÖLÜM: HERO GİRİŞ BAŞLIĞI ── */}
        <section className={styles.hero}>
          <div className="container">
            <SectionHeading
              tagline="Sıfır Hata Toleransı"
              title="Ozon, Hijyen ve Kalite"
              align="center"
            />
            <p className={styles.heroDesc}>
              Dünyada hiç kimse; bir şeyi kötü yapmadan daha ucuza satamaz. Bu nedenle; 
              bir malın sadece fiyatına bakmak, bazı hilelerini kabul etmek demektir.
            </p>
          </div>
        </section>

        {/* ── 2. BÖLÜM: HİJYEN VE KALİTE AÇIKLAMA BLOKLARI ── */}
        <section className={styles.contentSection}>
          <div className="container">
            <div className={styles.grid}>
              <div className={styles.textContent}>
                <div className={styles.block}>
                  <ShieldCheck size={40} className={styles.icon} strokeWidth={1.5} />
                  <h2>Bizim İçin Önce Hijyen</h2>
                  <p>
                    Mutfağımızın gıda hijyenine ve kurallarına uygunluğu hijyen denetim planı 
                    uyarınca günlük, haftalık ve aylık kontroller yapılarak sonuçlar kayıt edilir. 
                    Tüm aşamalarda, malzemelerde temizlik ve dezenfeksiyon işlemlerinde 
                    Winterhalter ürünleri kullanılmaktadır.
                  </p>
                </div>

                <div className={styles.block}>
                  <Target size={40} className={styles.icon} strokeWidth={1.5} />
                  <h2>Kalite ve Lezzet Adına</h2>
                  <p>
                    Sorumluluğunun bilincinde olan Füzyon Yemek en yeni teknoloji ile donatılmış 
                    kalite, hijyen ve lezzete gereken özeni gösteren, aynı zamanda üreten çağdaş 
                    servis anlayışına sahip bir kuruluştur. <strong>Hizmet aldığınız mutfağı mutlaka ziyaret ediniz.</strong>
                  </p>
                </div>
              </div>

              <div className={styles.imageContent}>
                <div className={styles.imageWrapper}>
                  <img src="/kalite.png" alt="Ozon Hijyen Sistemi" className={styles.mainImage} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. BÖLÜM: SERTİFİKALAR VE KALİTE BELGELERİ IZGARASI ── */}
        <section className={styles.certificatesSection}>
          <div className="container">
            <SectionHeading
              tagline="Uluslararası Standartlar"
              title="Kalite Belgelerimiz"
              align="center"
            />
            <div className={styles.certGrid}>
              {sertifikalar.map((cert, index) => (
                <div 
                  key={index} 
                  className={styles.certItem}
                  onClick={() => setSelectedImage(cert.src)}
                  title="Büyütmek için tıklayın"
                >
                  <img src={cert.src} alt={cert.alt} className={styles.certImage} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── 4. BÖLÜM: BÜYÜTÜLMÜŞ GÖRSEL PENCERESİ (MODAL / LIGHTBOX) ── */}
      {selectedImage && (
        <div className={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton} 
              onClick={() => setSelectedImage(null)}
              aria-label="Kapat"
            >
              &times;
            </button>
            <img src={selectedImage} alt="Sertifika Büyütülmüş Görünüm" className={styles.modalImage} />
          </div>
        </div>
      )}
    </>
  );
}
