/**
 * ============================================================================
 * BLOG LİSTELEME SAYFASI (BLOG INDEX PAGE) — Next.js Server Component
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Bu sayfa, şirketin yayınladığı tüm blog ve rehber içeriklerini bir ızgara (grid)
 * düzeninde listeler.
 * 
 * BURADA HANGİ YAZILIM PRENSİPLERİ KULLANILDI?
 * 1. Metadata (SEO): export const metadata nesnesi sayesinde Google bu sayfanın
 *    başlığını "Blog — Kurumsal Yemek ve Beslenme Yazıları" olarak indeksler.
 * 2. Next.js Link Bileşeni: <Link href="..."> bileşeni, sayfalar arası geçişte
 *    tüm sayfayı yeniden yüklemek yerine (Single Page Application gibi) anında
 *    ve yumuşak bir geçiş sağlar.
 * 3. Hata Toleransı: Backend API'ye erişilemediğinde sayfa beyaz ekrana düşmez,
 *    sessizce boş durum listelenir.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/UI/ScrollReveal";
import { BookOpen } from "lucide-react";
import styles from "./blog.module.css";
import { getBlogPosts } from "@/lib/api";

// Arama motorları için sayfa başlığı ve açıklaması
export const metadata: Metadata = {
  title: "Blog — Kurumsal Yemek ve Beslenme Yazıları",
  description:
    "Kurumsal beslenme, gıda hijyeni, catering trendleri ve sağlıklı yaşam üzerine uzman içerikler. Füzyon Yemek blog.",
  alternates: { canonical: "https://www.fuzyonyemek.com/blog" },
};

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getBlogPosts>>["data"] = [];
  
  try {
    // API'den ilk 50 blog yazısını çekiyoruz
    const result = await getBlogPosts(1, 50);
    posts = result.data;
  } catch {
    console.error("Blog API'sine ulaşılamadı, liste boş gösteriliyor.");
  }

  return (
    <ScrollReveal>
      {/* ── Blog Giriş Başlığı ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className="reveal">
            <span className={styles.tagline}>Blog</span>
            <h1 className={styles.heroTitle}>Sektör İçgörüleri ve Uzman İçerikler</h1>
            <p className={styles.heroDesc}>
              Kurumsal beslenme, gıda güvenliği ve catering trendleri hakkında
              bilgi edinin.
            </p>
          </div>
        </div>
      </section>

      {/* ── Blog Kartları Izgarası (Grid) ── */}
      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {posts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`${styles.card} reveal`}
                // Her kartın sırayla (staggered animation) belirmesi için gecikme veriyoruz
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={styles.cardImage}>
                  {post.featuredImageUrl ? (
                    <img 
                      src={post.featuredImageUrl} 
                      alt={post.title} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    <BookOpen size={48} strokeWidth={1} color="var(--color-primary)" opacity={0.3} />
                  )}
                </div>
                
                <div className={styles.cardContent}>
                  <div className={styles.cardMeta}>
                    <span className={styles.category}>{post.category ?? "Genel"}</span>
                    <span className={styles.date}>
                      {post.publishedAt 
                        ? new Date(post.publishedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
                        : ""}
                    </span>
                    <span className={styles.readTime}>{post.readTime}</span>
                  </div>
                  
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  
                  <span className={styles.readMore}>
                    Devamını Oku <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
