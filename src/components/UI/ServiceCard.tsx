/**
 * ============================================================================
 * SERVİS KARTI BİLEŞENİ (SERVICE CARD UI) — Reusable UI Card
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Bu bileşen; Taşıma Yemek, Yerinde Üretim ve Catering gibi hizmetlerin
 * ana sayfada ve hizmetler sayfasında görsel kartlar olarak sergilenmesini sağlar.
 * 
 * TASARIM VE KODLAMA PRENSİPLERİ:
 * 1. Bütünsel Tıklanabilirlik: Kartın tamamı bir `<Link>` etiketi ile sarılmıştır.
 *    Kullanıcı kartın neresine basarsa bassın ilgili hizmet sayfasına yönlendirilir.
 * 2. Asimetrik Bento Grid Desteği (`large?: boolean`): İlk kartı diğerlerinden daha geniş
 *    yaparak modern ve dinamik bir web tasarımı oluşturur.
 * 3. Çok Katmanlı Görsel Efekt (Layering & Overlay): Arka plandaki fotoğrafın üzerine
 *    hafif koyu bir gradyan (`styles.overlay`) eklenerek beyaz yazıların her zaman
 *    okunabilir (Accessible / Contrast uyumlu) kalması sağlanır.
 */

import Link from "next/link";
import styles from "./ServiceCard.module.css";
import React from "react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  large?: boolean;
  bgImage?: string;
}

export function ServiceCard({ 
  icon, 
  title, 
  description, 
  href, 
  large = false, 
  bgImage 
}: ServiceCardProps) {
  return (
    <Link 
      href={href} 
      className={`${styles.card} ${large ? styles.cardLarge : ""} ${bgImage ? styles.hasBg : ""}`}
    >
      {/* Eğer bir arka plan resmi varsa katmanları ekle */}
      {bgImage && (
        <>
          <div className={styles.bgImage} style={{ backgroundImage: `url(${bgImage})` }} />
          <div className={styles.overlay} />
        </>
      )}
      
      {/* Kart İçerik Alanı */}
      <div className={styles.content}>
        <div className={styles.iconWrapper}>{icon}</div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <span className={styles.linkText}>
          İnceleyin <span className={styles.arrow}>→</span>
        </span>
      </div>
    </Link>
  );
}
