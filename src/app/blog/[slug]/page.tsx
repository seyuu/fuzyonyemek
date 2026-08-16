/**
 * ============================================================================
 * BLOG DETAY SAYFASI (DYNAMIC ROUTING: /blog/[slug]) — Next.js Server Component
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Klasör adındaki köşeli parantez `[slug]` ne anlama gelir?
 * Bu, Next.js'in "Dinamik Rota" (Dynamic Route) özelliğidir.
 * Örneğin kullanıcı `/blog/saglikli-beslenme` veya `/blog/ozon-nedir` adresine gittiğinde
 * Next.js bu tek dosyayı çalıştırır ve URL'deki değişken kısmı `params.slug` olarak bize verir.
 * 
 * BURADAKİ İLERİ DÜZEY KONSEPTLER:
 * 1. generateStaticParams(): Derleme anında (build time) veritabanındaki tüm blog
 *    yazılarını öğrenip sayfalarını önceden oluşturur (SSG - Static Site Generation).
 *    Böylece sayfalar ışık hızında açılır!
 * 2. generateMetadata(): Her blog yazısının kendi özel başlığını (title) ve açıklamasını
 *    (description) dinamik olarak oluşturarak Google'a bildirir.
 * 3. dangerouslySetInnerHTML vs renderContent: Admin panelinden zengin metin (Rich Text / HTML)
 *    veya sade Markdown formatında içerik gelse bile güvenle render eden yardımcı fonksiyon.
 * 4. notFound(): Eğer istenen slug veritabanında yoksa kullanıcıyı otomatik olarak
 *    şık bir 404 (Sayfa Bulunamadı) sayfasına yönlendirir.
 */

import { notFound } from "next/navigation";
import { ScrollReveal } from "@/components/UI/ScrollReveal";
import styles from "../blog.module.css";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { getBlogPost, getBlogPosts } from "@/lib/api";
import type { Metadata } from "next";

/**
 * Statik Sayfa Parametreleri Üreticisi (SSG)
 * Tüm blog yazılarının slug listesini Next.js'e bildirir.
 */
export async function generateStaticParams() {
  try {
    const result = await getBlogPosts(1, 100);
    return result.data.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

/**
 * Dinamik SEO Meta Verisi Üreticisi
 * Blog yazısına özel Google başlığı ve açıklaması üretir.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getBlogPost(slug);
    return {
      title: post.metaTitle || `${post.title} | Füzyon Yemek Blog`,
      description: post.metaDescription || post.excerpt,
      alternates: { canonical: `https://www.fuzyonyemek.com/blog/${slug}` },
    };
  } catch {
    return { title: "Blog Yazısı Bulunamadı" };
  }
}

/**
 * Sade Markdown metinlerini HTML bloklarına dönüştüren yardımcı fonksiyon.
 * (### Başlık, **kalın yazı**, 1. Liste elemanları vb.)
 */
const renderContent = (content: string) => {
  return content.split('\n\n').map((paragraph, i) => {
    // 3 diyez ile başlayan satırları H3 başlık yap
    if (paragraph.startsWith('### ')) {
      return <h3 key={i} style={{ fontSize: "var(--text-xl)", marginTop: "var(--space-2xl)", marginBottom: "var(--space-md)", color: "var(--color-primary)" }}>{paragraph.replace('### ', '')}</h3>;
    }
    
    // **kalın** yazılmış kısımları <strong> etiketi ile çevrele
    const parseBold = (text: string) => {
      return text.split(/\*\*(.*?)\*\*/g).map((part, k) => k % 2 === 1 ? <strong key={k}>{part}</strong> : part);
    };

    // Numaralı listeleri güzel onay işaretli (✓) listeye dönüştür
    if (paragraph.match(/^\d+\.\s\*\*/)) {
      return (
        <ul key={i} style={{ paddingLeft: "var(--space-lg)", marginBottom: "var(--space-lg)", lineHeight: "1.8", color: "var(--color-text)", listStyleType: "none" }}>
          {paragraph.split('\n').map((item, j) => {
            const text = item.replace(/^\d+\.\s*/, '');
            return (
              <li key={j} style={{ marginBottom: "var(--space-md)", position: "relative" }}>
                <span style={{ color: "var(--color-accent)", position: "absolute", left: "-24px", fontWeight: "bold" }}>✓</span>
                {parseBold(text)}
              </li>
            );
          })}
        </ul>
      );
    }
    
    // Standart paragraf
    return <p key={i} style={{ marginBottom: "var(--space-lg)", lineHeight: "1.9", fontSize: "1.05rem", color: "var(--color-text)" }}>{parseBold(paragraph)}</p>;
  });
};

/**
 * Blog Detay Sayfası Ana Bileşeni
 */
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let post;
  try {
    post = await getBlogPost(slug);
  } catch {
    // API'de bulunamazsa 404 sayfasına yönlendir
    notFound();
  }

  if (!post) notFound();

  return (
    <ScrollReveal>
      {/* ── Üst Başlık ve Kapak Görseli ── */}
      <section className={styles.hero} style={{ 
        paddingBottom: "var(--space-3xl)",
        backgroundImage: post.featuredImageUrl ? `linear-gradient(rgba(0,0,0,0.7), rgba(26,10,10,0.95)), url(${post.featuredImageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}>
        <div className="container">
          <div className="reveal">
            <Link href="/blog" className={styles.tagline} style={{ display: "inline-block", marginBottom: "var(--space-lg)", textDecoration: "none", transition: "color 0.3s", color: "var(--color-accent)", opacity: 0.9 }}>
              ← Tüm Yazılara Dön
            </Link>
            <h1 className={styles.heroTitle}>{post.title}</h1>
            <div className={styles.cardMeta} style={{ justifyContent: "flex-start", gap: "var(--space-xl)", color: "rgba(255,255,255,0.7)", marginTop: "var(--space-lg)" }}>
              <span className={styles.category} style={{ display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={16}/> {post.category ?? "Genel"}</span>
              <span className={styles.date}>
                {post.publishedAt 
                  ? new Date(post.publishedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
                  : ""}
              </span>
              <span className={styles.readTime}>{post.readTime} Okuma</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog İçeriği ve Okuma Alanı ── */}
      <section className="section" style={{ padding: "var(--space-4xl) 0", backgroundColor: "var(--color-light)" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div className="reveal">
            
            {/* HTML içerik mi yoksa sade metin mi kontrolü */}
            <div className="blog-content-wrapper" style={{ backgroundColor: "white", padding: "var(--space-3xl)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", border: "1px solid var(--color-border)" }}>
              {post.content?.includes('<p>') || post.content?.includes('<h') ? (
                <div 
                  className={styles.richText} 
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />
              ) : (
                renderContent(post.content)
              )}
            </div>
            
            {/* Yazı Sonu İletişim & Teklif Kutusu (Call to Action) */}
            <div style={{ marginTop: "var(--space-3xl)", padding: "var(--space-2xl)", background: "var(--color-bg)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", textAlign: "center" }}>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-md)", color: "var(--color-primary)" }}>
                İşletmenize Özel Teklif Alın
              </h3>
              <p style={{ color: "var(--color-text)", lineHeight: "1.6", marginBottom: "var(--space-lg)" }}>
                Füzyon Yemek olarak {post.title.split(' ')[0]} bölgesine yüksek kapasiteli ve hijyen standartları onaylanmış taşıma yemek hizmetleri sunmaktayız.
              </p>
              <Link href="/iletisim" style={{ display: "inline-block", padding: "12px 32px", backgroundColor: "var(--color-accent)", color: "white", borderRadius: "50px", fontWeight: "600", textDecoration: "none", transition: "transform 0.3s" }}>
                Bizimle İletişime Geçin
              </Link>
            </div>

          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
