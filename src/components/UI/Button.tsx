/**
 * ============================================================================
 * BUTTON BİLEŞENİ (REUSABLE UI BUTTON) — Polimorfik React Bileşeni
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Neden projede doğrudan `<button>` kullanmak yerine böyle bir bileşen yaptık?
 * 
 * 1. Tekrarı Önleme (DRY - Don't Repeat Yourself): Sitedeki tüm butonların kenar
 *    yuvarlaklığı (border-radius), gölgesi, yazı boyutu ve üzerine gelindiğindeki
 *    (hover) animasyonları tek bir CSS dosyasından yönetilir.
 * 2. Polimorfik Tasarım (Polymorphic Component):
 *    - Eğer butona bir internet adresi (`href="/iletisim"`) verirsek, otomatik olarak
 *      Next.js'in hızlı sayfa geçişi sağlayan `<Link>` etiketine dönüşür.
 *    - Eğer `href` vermezsek standart form butonu olan `<button>` olarak davranır.
 * 3. Variant & Size Mantığı:
 *    - `variant="primary"` -> Ana altın/turuncu buton
 *    - `variant="outlineDark"` -> Siyah çerçeveli şık buton
 *    - `size="lg"` -> Büyük buton
 */

import Link from "next/link";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "outlineDark";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  href?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  href,
  children,
  className,
  ...props
}: ButtonProps) {
  // CSS sınıflarını dinamik olarak birleştiriyoruz
  const classes = [
    styles.btn,
    styles[variant],
    size !== "md" ? styles[size] : "",
    isLoading ? styles.loading : "",
    className ?? "",
  ]
    .filter(Boolean) // Boş veya tanımsız string'leri diziden temizler
    .join(" ");

  // 1. Durum: Eğer bir link hedefi (href) varsa Next.js <Link> olarak render et
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  // 2. Durum: Standart tıklanabilir HTML butonu
  return (
    <button className={classes} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <span className={styles.spinner} /> : children}
    </button>
  );
}
