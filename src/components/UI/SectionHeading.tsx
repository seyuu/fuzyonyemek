/**
 * ============================================================================
 * SECTION HEADING (BÖLÜM BAŞLIĞI) — Tipografi ve Başlık Bileşeni
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Sitedeki tüm bölümlerin (Hizmetler, Neden Biz, Hakkımızda vs.) üstünde yer alan
 * standartlaştırılmış başlık bileşenidir.
 * 
 * YAPISI (3 Katman):
 * 1. Tagline (Üst Rozet/Kategori): Küçük altın rengi ön başlık (Örn: "ÇÖZÜMLER")
 * 2. Title (Ana Başlık): Serif tipografide büyük H2 başlığı
 * 3. Subtitle (Açıklama): Başlığın altındaki bilgilendirici paragraf
 * 
 * Hizalama Desteği: `align="center"` veya `align="left"` ile esnek kullanım sağlar.
 */

import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  tagline?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
}

export function SectionHeading({
  tagline,
  title,
  subtitle,
  align = "center",
  dark = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`${styles.wrapper} ${align === "left" ? styles.left : ""} ${
        dark ? styles.dark : ""
      }`}
    >
      {tagline && <span className={styles.tagline}>{tagline}</span>}
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
