using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using FuzyonYemek.Application.Interfaces;
using FuzyonYemek.Domain.Entities;

namespace FuzyonYemek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public ServicesController(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var services = await _unitOfWork.Repository<Service>().Query()
            .Where(s => s.IsPublished)
            .OrderBy(s => s.SortOrder)
            .Select(s => new { s.Id, s.Slug, s.Title, s.ShortDescription, s.IconName, s.BackgroundImageUrl })
            .ToListAsync();
        return Ok(services);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var service = await _unitOfWork.Repository<Service>().Query()
            .Include(s => s.Benefits.OrderBy(b => b.SortOrder))
            .FirstOrDefaultAsync(s => s.Slug == slug && s.IsPublished);
        if (service == null) return NotFound();
        return Ok(service);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Service service)
    {
        await _unitOfWork.Repository<Service>().AddAsync(service);
        await _unitOfWork.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBySlug), new { slug = service.Slug }, service);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Service updated)
    {
        var service = await _unitOfWork.Repository<Service>().GetByIdAsync(id);
        if (service == null) return NotFound();

        service.Title = updated.Title;
        service.Slug = updated.Slug;
        service.ShortDescription = updated.ShortDescription;
        service.FullDescription = updated.FullDescription;
        service.IconName = updated.IconName;
        service.HeroImageUrl = updated.HeroImageUrl;
        service.BackgroundImageUrl = updated.BackgroundImageUrl;
        service.IsPublished = updated.IsPublished;
        service.SortOrder = updated.SortOrder;
        service.MetaTitle = updated.MetaTitle;
        service.MetaDescription = updated.MetaDescription;

        _unitOfWork.Repository<Service>().Update(service);
        await _unitOfWork.SaveChangesAsync();
        return Ok(service);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var service = await _unitOfWork.Repository<Service>().GetByIdAsync(id);
        if (service == null) return NotFound();
        _unitOfWork.Repository<Service>().Remove(service);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
}
