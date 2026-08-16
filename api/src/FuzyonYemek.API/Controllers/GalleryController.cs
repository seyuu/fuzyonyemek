using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using FuzyonYemek.Application.Interfaces;
using FuzyonYemek.Domain.Entities;

namespace FuzyonYemek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GalleryController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    public GalleryController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int ps = 30)
    {
        var q = _uow.Repository<GalleryImage>().Query().Where(g => g.IsVisible);
        var total = await q.CountAsync();
        var items = await q.OrderBy(g => g.SortOrder).Skip((page-1)*ps).Take(ps)
            .Include(g => g.MediaAsset).ToListAsync();
        return Ok(new { data = items, total, page, pageSize = ps });
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] GalleryImage img)
    {
        await _uow.Repository<GalleryImage>().AddAsync(img);
        await _uow.SaveChangesAsync();
        return Ok(img);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] GalleryImage updated)
    {
        var img = await _uow.Repository<GalleryImage>().GetByIdAsync(id);
        if (img == null) return NotFound();
        img.Title = updated.Title; img.AltText = updated.AltText;
        img.Category = updated.Category; img.SortOrder = updated.SortOrder;
        img.IsVisible = updated.IsVisible;
        _uow.Repository<GalleryImage>().Update(img);
        await _uow.SaveChangesAsync();
        return Ok(img);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var img = await _uow.Repository<GalleryImage>().GetByIdAsync(id);
        if (img == null) return NotFound();
        _uow.Repository<GalleryImage>().Remove(img);
        await _uow.SaveChangesAsync();
        return NoContent();
    }
}
