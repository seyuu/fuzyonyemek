/**
 * ============================================================================
 * BLOG YAZISI VARLIĞI (BLOG POST ENTITY) — Domain Katmanı
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Veritabanındaki `BlogPosts` tablosunun C# nesnesi (Object-Relational Mapping / ORM) karşılığıdır.
 * 
 * DOMAIN KATMANI PRENSİPLERİ:
 * 1. Saf İş Mantığı: Bu katmanda hiçbir harici kütüphane (örneğin SQL veya Web API) bulunmaz.
 *    Sadece projenin varlıkları (Entity) ve kuralları yer alır (Clean Architecture).
 * 2. BaseEntity Kalıtımı (Inheritance): `Id`, `CreatedAt` ve `UpdatedAt` gibi tüm tablolarda
 *    ortak olan alanları tekrar tekrar yazmak yerine `BaseEntity` sınıfından miras alırız.
 * 3. İlişkisel Veri Modeli (Navigation Property):
 *    - `CategoryId`: Kategorinin veritabanındaki yabancı anahtarı (Foreign Key).
 *    - `Category`: EF Core'un bu yazıya ait kategoriyi nesne olarak otomatik yüklemesini
 *      sağlayan Gezinme Özelliği (Navigation Property).
 */

using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class BlogPost : BaseEntity
{
    // SEO dostu URL adresi (Örn: "hijyenik-yemek-uretimi")
    public string Slug { get; set; } = string.Empty;
    
    // Blog başlığı
    public string Title { get; set; } = string.Empty;
    
    // Kısa önizleme metni (? işareti: Bu alan boş / null bırakılabilir demektir)
    public string? Excerpt { get; set; }
    
    // Yazının tam metni (HTML veya Markdown)
    public string Content { get; set; } = string.Empty;
    
    // Kapak resmi URL adresi
    public string? FeaturedImageUrl { get; set; }
    
    // Kategori İlişkisi (Foreign Key)
    public int? CategoryId { get; set; }
    public BlogCategory? Category { get; set; }
    
    // Tahmini okuma süresi (Örn: "3 dk")
    public string? ReadTime { get; set; }
    
    // Yayın durumu (Taslak mı yoksa yayında mı?)
    public bool IsPublished { get; set; } = false;
    
    // Yayınlanma tarihi
    public DateTime? PublishedAt { get; set; }
    
    // SEO Arama Motoru Özel Başlığı ve Açıklaması
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
}
