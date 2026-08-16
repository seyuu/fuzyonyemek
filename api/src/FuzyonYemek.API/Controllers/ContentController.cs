using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using FuzyonYemek.Application.Interfaces;
using FuzyonYemek.Domain.Entities;

namespace FuzyonYemek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContentController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public ContentController(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    [HttpGet("home")]
    [ResponseCache(Duration = 60)]
    public async Task<IActionResult> GetHomePage()
    {
        var stats = await _unitOfWork.Repository<Stat>().Query()
            .Where(s => s.IsVisible).OrderBy(s => s.SortOrder).ToListAsync();

        var services = await _unitOfWork.Repository<Service>().Query()
            .Where(s => s.IsPublished).OrderBy(s => s.SortOrder)
            .Select(s => new { s.Id, s.Slug, s.Title, s.ShortDescription, s.IconName, s.BackgroundImageUrl })
            .ToListAsync();

        var suppliers = await _unitOfWork.Repository<Supplier>().Query()
            .Where(s => s.IsVisible).OrderBy(s => s.SortOrder)
            .Select(s => new { s.Id, s.Name, s.LogoUrl }).ToListAsync();

        var page = await _unitOfWork.Repository<Page>().Query()
            .Include(p => p.SeoMeta)
            .Include(p => p.Sections.OrderBy(s => s.SortOrder))
            .ThenInclude(s => s.Components.OrderBy(c => c.SortOrder))
            .FirstOrDefaultAsync(p => p.Slug == "ana-sayfa");

        return Ok(new { page, stats, services, suppliers });
    }

    [HttpGet("page/{slug}")]
    [ResponseCache(Duration = 60)]
    public async Task<IActionResult> GetPageBySlug(string slug)
    {
        var page = await _unitOfWork.Repository<Page>().Query()
            .Include(p => p.SeoMeta)
            .Include(p => p.Sections.Where(s => s.IsVisible).OrderBy(s => s.SortOrder))
            .ThenInclude(s => s.Components.Where(c => c.IsVisible).OrderBy(c => c.SortOrder))
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsPublished);

        if (page == null) return NotFound();
        return Ok(page);
    }

    [HttpGet("settings")]
    [ResponseCache(Duration = 300)]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await _unitOfWork.Repository<SiteSetting>().GetAllAsync();
        var dict = settings.ToDictionary(s => s.Key, s => s.Value);
        return Ok(dict);
    }

    [HttpGet("navbar")]
    [ResponseCache(Duration = 300)]
    public async Task<IActionResult> GetNavbar()
    {
        var services = await _unitOfWork.Repository<Service>().Query()
            .Where(s => s.IsPublished).OrderBy(s => s.SortOrder)
            .Select(s => new { s.Title, s.Slug }).ToListAsync();

        return Ok(new
        {
            links = new[]
            {
                new { label = "Ana Sayfa", href = "/", children = (object?)null },
                new { label = "Hakkımızda", href = "/hakkimizda", children = (object?)null },
                new { label = "Hizmetlerimiz", href = "/hizmetlerimiz", children = (object?)services.Select(s => new { label = s.Title, href = $"/hizmetlerimiz/{s.Slug}" }) },
                new { label = "Galeri", href = "/galeri", children = (object?)null },
                new { label = "Kalite & Hijyen", href = "/kalite-ve-hijyen", children = (object?)null },
                new { label = "Blog", href = "/blog", children = (object?)null },
                new { label = "İletişim", href = "/iletisim", children = (object?)null },
            }
        });
    }
}
