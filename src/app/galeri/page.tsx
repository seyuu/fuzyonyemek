/**
 * ============================================================================
 * GALERİ SAYFASI (GALLERY PAGE) — Next.js Server Component
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Bu sayfa, yemek fabrikasının, hijyenik mutfakların ve sunulan yemeklerin
 * fotoğraflarını dinamik bir ızgara (Grid) ve Lightbox (Büyüteç/Modal) eşliğinde sunar.
 * 
 * ÇİFT KATMANLI VERİ GÜVENLİĞİ (FALLBACK PATTERN):
 * 1. Öncelikle veritabanından / API'den (`getGallery()`) fotoğraflar çekilir.
 * 2. Eğer API kapalıysa veya veritabanı henüz boşsa, Node.js `fs` modülü ile
 *    `public/galeri` klasöründeki yerel fotoğraflar taranıp otomatik gösterilir.
 * 3. Böylece web sitesi hiçbir zaman boş bir galeriyle kalmaz!
 */

import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { ScrollReveal } from "@/components/UI/ScrollReveal";
import { GalleryGrid } from "@/components/GalleryGrid/GalleryGrid";
import styles from "./galeri.module.css";
import { getGallery } from "@/lib/api";

export const metadata: Metadata = {
  title: "Galeri — Üretim Tesisi ve Hizmetlerimiz",
  description:
    "Füzyon Yemek üretim tesisi, mutfak ekibimiz ve hizmet alanlarımızdan fotoğraflar. Hijyenik, modern ve profesyonel çalışma ortamımızı keşfedin.",
  alternates: { canonical: "https://www.fuzyonyemek.com/galeri" },
};

export default async function GaleriPage() {
  let images: string[] = [];

  try {
    // 1. Adım: API'den galeri verilerini çekmeyi dene
    const apiGallery = await getGallery();
    if (apiGallery && apiGallery.data.length > 0) {
      images = apiGallery.data.map(g => g.mediaAsset.secureUrl);
    } else {
      throw new Error("Veritabanında henüz fotoğraf yok, yerel klasöre geçiliyor.");
    }
  } catch {
    // 2. Adım (Fallback): Yerel public/galeri klasöründeki görselleri tara
    try {
      const galeriDir = path.join(process.cwd(), "public", "galeri");
      if (fs.existsSync(galeriDir)) {
        const files = fs.readdirSync(galeriDir);
        images = files
          .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
          .map((file) => `/galeri/${file}`);
      }
    } catch (fsErr) {
      console.error("Yerel galeri klasörü okunamadı:", fsErr);
    }
  }

  return (
    <ScrollReveal>
      {/* ── Galeri Başlık Alanı ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className="reveal">
            <span className={styles.tagline}>Galeri</span>
            <h1 className={styles.heroTitle}>Tesisimiz ve Hizmetlerimiz</h1>
            <p className={styles.heroDesc}>
              Modern üretim altyapımız, profesyonel hizmet süreçlerimiz ve nefis 
              lezzetlerimizden kareler.
            </p>
          </div>
        </div>
      </section>

      {/* ── Fotoğraf Izgarası (GalleryGrid) ── */}
      <section className="section">
        <div className="container">
          <GalleryGrid images={images} />
        </div>
      </section>
    </ScrollReveal>
  );
}
