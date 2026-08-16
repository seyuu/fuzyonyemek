"use client";

import { useState, useEffect } from "react";
import styles from "./GalleryGrid.module.css";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function GalleryGrid({ images }: { images: string[] }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") setSelectedImageIndex((selectedImageIndex + 1) % images.length);
      if (e.key === "ArrowLeft") setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, images.length]);

  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedImageIndex]);

  return (
    <>
      <div className={styles.grid}>
        {images.length > 0 ? (
          images.map((src, i) => (
            <div
              key={i}
              className={`${styles.item} reveal visible`}
              style={{ transitionDelay: `${(i % 10) * 50}ms` }}
              onClick={() => openLightbox(i)}
            >
              <div className={styles.itemInner}>
                <img src={src} alt={`Füzyon Yemek Galeri Görseli ${i + 1}`} className={styles.galleryImage} loading="lazy" />
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "var(--color-text-light)", gridColumn: "1 / -1" }}>
            Galeri görselleri yükleniyor...
          </p>
        )}
      </div>

      {selectedImageIndex !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.closeBtn} onClick={closeLightbox} aria-label="Kapat">
            <X size={32} />
          </button>
          <button className={styles.navBtnLeft} onClick={prevImage} aria-label="Önceki">
            <ChevronLeft size={48} />
          </button>
          <img 
            src={images[selectedImageIndex]} 
            alt="Büyük Görsel" 
            className={styles.lightboxImage} 
            onClick={(e) => e.stopPropagation()} 
          />
          <button className={styles.navBtnRight} onClick={nextImage} aria-label="Sonraki">
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </>
  );
}
