/**
 * ============================================================================
 * BLOG KONTROLCÜSÜ (BLOG CONTROLLER) — ASP.NET Core REST API
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Bu Controller, blog yazılarıyla ilgili tüm veritabanı (CRUD - Create, Read, Update, Delete)
 * işlemlerini yöneten RESTful web servisidir.
 * 
 * REST API HTTP METOTLARI MANTIĞI:
 * 1. GET /api/blog -> Blog yazılarını listele (Herkese Açık)
 * 2. GET /api/blog/{slug} -> Belirli bir yazının detayını getir (Herkese Açık)
 * 3. POST /api/blog -> Yeni bir blog yazısı oluştur ([Authorize] - Sadece Giriş Yapmış Admin/Editör)
 * 4. PUT /api/blog/{id} -> Mevcut yazıyı güncelle ([Authorize] - Sadece Giriş Yapmış Admin/Editör)
 * 5. DELETE /api/blog/{id} -> Yazıyı sil ([Authorize] - Sadece Admin)
 * 
 * YAZILIM DESENLERİ (PATTERNS):
 * - Unit of Work & Repository Pattern: Veritabanı sorgularını doğrudan SQL ile yazmak yerine
 *   nesne yönelimli (Entity Framework Core) repository üzerinden temiz ve güvenli yönetiriz.
 * - LINQ Sayfalama (Pagination): `.Skip((page - 1) * pageSize).Take(pageSize)` ile
 *   milyonlarca kayıt olsa bile veritabanından sadece o anki sayfa kadar veri çekilir.
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using FuzyonYemek.Application.Interfaces;
using FuzyonYemek.Domain.Entities;

namespace FuzyonYemek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    // Dependency Injection ile UnitOfWork servisini alıyoruz
    public BlogController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Yayınlanmış blog yazılarını sayfalanmış olarak listeler.
    /// GET /api/blog?page=1&pageSize=10&category=beslenme
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? category = null)
    {
        // 1. Sorgu temelini kuruyoruz (Sadece yayınlanmış olanları al)
        var query = _unitOfWork.Repository<BlogPost>().Query()
            .Include(b => b.Category)
            .Where(b => b.IsPublished)
            .AsQueryable();

        // 2. Kategori filtresi verilmişse sorguya ekle
        if (!string.IsNullOrEmpty(category))
            query = query.Where(b => b.Category != null && b.Category.Slug == category);

        // 3. Toplam kayıt sayısını bul
        var total = await query.CountAsync();

        // 4. İstenen sayfadaki verileri çek (Sayfalama)
        var posts = await query
            .OrderByDescending(b => b.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(b => new
            {
                b.Id, b.Slug, b.Title, b.Excerpt, b.FeaturedImageUrl, b.ReadTime,
                b.PublishedAt, Category = b.Category != null ? b.Category.Name : null
            })
            .ToListAsync();

        return Ok(new { data = posts, total, page, pageSize });
    }

    /// <summary>
    /// Tek bir blog yazısını slug değerine göre çeker.
    /// GET /api/blog/saglikli-beslenme-ipuclari
    /// </summary>
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var post = await _unitOfWork.Repository<BlogPost>().Query()
            .Include(b => b.Category)
            .Where(b => b.Slug == slug && b.IsPublished)
            .Select(b => new
            {
                b.Id, b.Slug, b.Title, b.Excerpt, b.Content, b.FeaturedImageUrl,
                b.ReadTime, b.IsPublished, b.PublishedAt, b.CategoryId,
                Category = b.Category != null ? b.Category.Name : null,
                b.MetaTitle, b.MetaDescription, b.CreatedAt, b.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (post == null) return NotFound(new { message = "Blog yazısı bulunamadı." });
        return Ok(post);
    }

    /// <summary>
    /// Blog kategorilerini ve içerdikleri yazı sayılarını listeler.
    /// GET /api/blog/categories
    /// </summary>
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _unitOfWork.Repository<BlogCategory>().Query()
            .OrderBy(c => c.SortOrder)
            .Select(c => new { c.Id, c.Name, c.Slug, c.Description, PostCount = c.Posts.Count(p => p.IsPublished) })
            .ToListAsync();

        return Ok(categories);
    }

    /// <summary>
    /// Admin paneli için ID ile yazı detayını getirir (Taslaklar dahil).
    /// GET /api/blog/edit/5
    /// </summary>
    [Authorize(Policy = "EditorOrAdmin")]
    [HttpGet("edit/{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var post = await _unitOfWork.Repository<BlogPost>().Query()
            .Include(b => b.Category)
            .Where(b => b.Id == id)
            .Select(b => new
            {
                b.Id, b.Slug, b.Title, b.Excerpt, b.Content, b.FeaturedImageUrl,
                b.ReadTime, b.IsPublished, b.PublishedAt, b.CategoryId,
                Category = b.Category != null ? b.Category.Name : null,
                b.MetaTitle, b.MetaDescription, b.CreatedAt, b.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (post == null) return NotFound(new { message = "Kayıt bulunamadı." });
        return Ok(post);
    }

    /// <summary>
    /// Yeni bir blog yazısı kaydeder.
    /// POST /api/blog
    /// </summary>
    [Authorize(Policy = "EditorOrAdmin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BlogPost post)
    {
        post.CreatedAt = DateTime.UtcNow;
        if (post.IsPublished && post.PublishedAt == null)
            post.PublishedAt = DateTime.UtcNow;

        await _unitOfWork.Repository<BlogPost>().AddAsync(post);
        await _unitOfWork.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBySlug), new { slug = post.Slug }, post);
    }

    /// <summary>
    /// Mevcut bir blog yazısını günceller.
    /// PUT /api/blog/5
    /// </summary>
    [Authorize(Policy = "EditorOrAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] BlogPost updated)
    {
        var post = await _unitOfWork.Repository<BlogPost>().GetByIdAsync(id);
        if (post == null) return NotFound(new { message = "Güncellenecek kayıt bulunamadı." });

        post.Title = updated.Title;
        post.Slug = updated.Slug;
        post.Excerpt = updated.Excerpt;
        post.Content = updated.Content;
        post.FeaturedImageUrl = updated.FeaturedImageUrl;
        post.CategoryId = updated.CategoryId;
        post.ReadTime = updated.ReadTime;
        post.IsPublished = updated.IsPublished;
        post.MetaTitle = updated.MetaTitle;
        post.MetaDescription = updated.MetaDescription;
        post.UpdatedAt = DateTime.UtcNow;

        if (updated.IsPublished && post.PublishedAt == null)
            post.PublishedAt = DateTime.UtcNow;

        _unitOfWork.Repository<BlogPost>().Update(post);
        await _unitOfWork.SaveChangesAsync();
        return Ok(post);
    }

    /// <summary>
    /// Bir blog yazısını siler.
    /// DELETE /api/blog/5
    /// </summary>
    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var post = await _unitOfWork.Repository<BlogPost>().GetByIdAsync(id);
        if (post == null) return NotFound(new { message = "Silinecek kayıt bulunamadı." });

        _unitOfWork.Repository<BlogPost>().Remove(post);
        await _unitOfWork.SaveChangesAsync();
        return NoContent(); // 204 No Content: Başarıyla silindi, geriye veri dönmüyor
    }
}
