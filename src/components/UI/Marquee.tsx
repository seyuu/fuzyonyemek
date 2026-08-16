/**
 * ============================================================================
 * MARQUEE BİLEŞENİ (SONSUZ KAYAN ŞERİT) — Infinite Scrolling UI
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Tedarikçi ve referans logolarının sağdan sola doğru durmaksızın ve takılmadan
 * kaymasını sağlayan bileşendir.
 * 
 * SONSUZ DÖNGÜ HİLESİ (CSS INFINITE SCROLL TRICK):
 * Logolar kayıp ekranın solundan çıktığında şeridin sonunda boşluk kalmaması için
 * logolar listesi JavaScript Spread operatörü ile iki kez art arda kopyalanır (`[...images, ...images]`).
 * CSS animasyonu %50 kaydığında anında başlangıç konumuna geri döner (0s geçişle).
 * İnsan gözü bu sıfırlamayı fark edemez ve logolar sanki sonsuza kadar akıyormuş gibi hisseder!
 */

import React from "react";
import styles from "./Marquee.module.css";

interface MarqueeProps {
  images: string[];
}

export function Marquee({ images }: MarqueeProps) {
  // Sonsuz akış efekti için logolar dizisini ikiye katlıyoruz
  const extendedImages = [...images, ...images];

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeInner}>
        {extendedImages.map((src, index) => (
          <div key={`${src}-${index}`} className={styles.marqueeItem}>
            <img 
              src={src} 
              alt={`Tedarikçi Logo ${index}`} 
              className={styles.marqueeImage} 
              loading="lazy" 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
