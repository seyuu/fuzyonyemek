/**
 * ============================================================================
 * SCROLL REVEAL BİLEŞENİ — Modern Scroll Animasyon Yöneticisi
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Kullanıcı sayfayı aşağı kaydırdıkça yazıların ve kartların alttan yukarı doğru
 * yumuşak bir şekilde (Fade-in & Slide-up) belirmesini nasıl sağlıyoruz?
 * 
 * ESKİ YÖNTEM VS YENİ YÖNTEM (PERFORMANS FARKI):
 * - Eski Kötü Yöntem: `window.addEventListener('scroll', ...)` kullanmak.
 *   Bu yöntem her piksel kaydırmada yüzlerce kez çalışır ve tarayıcıyı kasar / dondurur.
 * - Modern & Profesyonel Yöntem: Tarayıcının yerel **`IntersectionObserver`** API'sini kullanmak.
 *   Tarayıcı, bir eleman ekranda göründüğü anda GPU hızlandırmasıyla bunu bize bildirir.
 *   Hiçbir işlemci yükü veya donma yaşanmaz!
 * 
 * NASIL ÇALIŞIR?
 * 1. Sayfa içindeki `.reveal` sınıfına sahip tüm etiketleri bulur.
 * 2. Eleman ekranın %10'una girdiğinde ona `.visible` sınıfını ekler (CSS animasyonu tetiklenir).
 * 3. `observer.unobserve(entry.target)` ile o elemanı takipten çıkarır (çünkü animasyon 1 kez oynadı, işlem tamam).
 * 4. Bileşen kapanırken `observer.disconnect()` ile tüm gözlemcileri temizler (Memory Leak önlemi).
 */

"use client";

import { useEffect, useRef } from "react";

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  // En dış div'e erişebilmek için React Ref kullanıyoruz
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Tarayıcının yerleşik Kesişim Gözlemcisi (IntersectionObserver)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Eğer eleman kullanıcının ekranına girdiyse
          if (entry.isIntersecting) {
            entry.target.classList.add("visible"); // CSS'teki .visible sınıfını ekle
            observer.unobserve(entry.target);     // Artık bu elemanı izlemeyi bırak (Performans)
          }
        });
      },
      { 
        threshold: 0.1, // Elemanın %10'u ekrana girdiğinde tetikle
        rootMargin: "0px 0px -40px 0px" // Ekranın en altından 40px önce tetikle
      }
    );

    // Kapsayıcı içindeki tüm .reveal sınıfına sahip elemanları bul ve gözlemle
    const elements = container.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    // Temizleme (Cleanup) Fonksiyonu: Sayfa değiştiğinde gözlemciyi kapat
    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
