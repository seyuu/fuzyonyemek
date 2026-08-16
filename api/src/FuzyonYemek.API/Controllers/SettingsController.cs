using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using FuzyonYemek.Application.Interfaces;
using FuzyonYemek.Domain.Entities;

namespace FuzyonYemek.API.Controllers;

[ApiController]
[Route("api")]
[Authorize(Policy = "AdminOnly")]
public class SettingsController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    public SettingsController(IUnitOfWork uow) => _uow = uow;

    // ─── Stats ───
    [HttpGet("stats")]
    [AllowAnonymous]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _uow.Repository<Stat>().Query()
            .Where(s => s.IsVisible).OrderBy(s => s.SortOrder).ToListAsync();
        return Ok(stats);
    }

    [HttpPut("stats")]
    public async Task<IActionResult> UpdateStats([FromBody] List<Stat> stats)
    {
        foreach (var s in stats) _uow.Repository<Stat>().Update(s);
        await _uow.SaveChangesAsync();
        return Ok(stats);
    }

    // ─── Suppliers ───
    [HttpGet("suppliers")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSuppliers()
    {
        var items = await _uow.Repository<Supplier>().Query()
            .Where(s => s.IsVisible).OrderBy(s => s.SortOrder).ToListAsync();
        return Ok(items);
    }

    [HttpPost("suppliers")]
    public async Task<IActionResult> CreateSupplier([FromBody] Supplier s)
    {
        await _uow.Repository<Supplier>().AddAsync(s);
        await _uow.SaveChangesAsync();
        return Ok(s);
    }

    [HttpPut("suppliers/{id}")]
    public async Task<IActionResult> UpdateSupplier(int id, [FromBody] Supplier updated)
    {
        var s = await _uow.Repository<Supplier>().GetByIdAsync(id);
        if (s == null) return NotFound();
        s.Name = updated.Name; s.LogoUrl = updated.LogoUrl;
        s.WebsiteUrl = updated.WebsiteUrl; s.SortOrder = updated.SortOrder;
        s.IsVisible = updated.IsVisible;
        _uow.Repository<Supplier>().Update(s);
        await _uow.SaveChangesAsync();
        return Ok(s);
    }

    [HttpDelete("suppliers/{id}")]
    public async Task<IActionResult> DeleteSupplier(int id)
    {
        var s = await _uow.Repository<Supplier>().GetByIdAsync(id);
        if (s == null) return NotFound();
        _uow.Repository<Supplier>().Remove(s);
        await _uow.SaveChangesAsync();
        return NoContent();
    }

    // ─── Certifications ───
    [HttpGet("certifications")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCerts()
    {
        var items = await _uow.Repository<Certification>().Query()
            .Where(c => c.IsVisible).OrderBy(c => c.SortOrder).ToListAsync();
        return Ok(items);
    }

    [HttpPost("certifications")]
    public async Task<IActionResult> CreateCert([FromBody] Certification c)
    {
        await _uow.Repository<Certification>().AddAsync(c);
        await _uow.SaveChangesAsync();
        return Ok(c);
    }

    [HttpPut("certifications/{id}")]
    public async Task<IActionResult> UpdateCert(int id, [FromBody] Certification updated)
    {
        var c = await _uow.Repository<Certification>().GetByIdAsync(id);
        if (c == null) return NotFound();
        c.Title = updated.Title; c.Description = updated.Description;
        c.ImageUrl = updated.ImageUrl; c.SortOrder = updated.SortOrder;
        c.IsVisible = updated.IsVisible;
        _uow.Repository<Certification>().Update(c);
        await _uow.SaveChangesAsync();
        return Ok(c);
    }

    [HttpDelete("certifications/{id}")]
    public async Task<IActionResult> DeleteCert(int id)
    {
        var c = await _uow.Repository<Certification>().GetByIdAsync(id);
        if (c == null) return NotFound();
        _uow.Repository<Certification>().Remove(c);
        await _uow.SaveChangesAsync();
        return NoContent();
    }

    // ─── Site Settings ───
    [HttpGet("site-settings")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSiteSettings()
    {
        var settings = await _uow.Repository<SiteSetting>().Query().ToListAsync();
        // Convert to a dictionary for easy frontend access
        var dict = settings.ToDictionary(s => s.Key, s => s.Value);
        return Ok(dict);
    }

    [HttpGet("site-settings/all")]
    public async Task<IActionResult> GetAllSiteSettings()
    {
        var settings = await _uow.Repository<SiteSetting>().Query()
            .OrderBy(s => s.GroupName).ThenBy(s => s.Key).ToListAsync();
        return Ok(settings);
    }

    [HttpPost("site-settings")]
    public async Task<IActionResult> SaveSiteSettings([FromBody] Dictionary<string, string> settings)
    {
        var existing = await _uow.Repository<SiteSetting>().Query().ToListAsync();
        
        foreach (var kvp in settings)
        {
            var setting = existing.FirstOrDefault(s => s.Key == kvp.Key);
            if (setting != null)
            {
                setting.Value = kvp.Value;
                _uow.Repository<SiteSetting>().Update(setting);
            }
            else
            {
                await _uow.Repository<SiteSetting>().AddAsync(new SiteSetting
                {
                    Key = kvp.Key,
                    Value = kvp.Value,
                    GroupName = "General"
                });
            }
        }
        await _uow.SaveChangesAsync();
        return Ok(new { message = "Settings updated successfully" });
    }
}
