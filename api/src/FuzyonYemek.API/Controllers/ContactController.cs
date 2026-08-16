using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using FuzyonYemek.Application.Interfaces;
using FuzyonYemek.Domain.Entities;

namespace FuzyonYemek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ContactController> _logger;

    public ContactController(IUnitOfWork unitOfWork, ILogger<ContactController> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] ContactSubmission submission)
    {
        submission.SubmittedAt = DateTime.UtcNow;
        submission.IsRead = false;
        await _unitOfWork.Repository<ContactSubmission>().AddAsync(submission);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation("New contact from {Name}", submission.Name);
        return Ok(new { message = "Talebiniz alindi." });
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _unitOfWork.Repository<ContactSubmission>().Query();
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(c => c.SubmittedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return Ok(new { data = items, total, page, pageSize });
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var s = await _unitOfWork.Repository<ContactSubmission>().GetByIdAsync(id);
        if (s == null) return NotFound();
        s.IsRead = true;
        _unitOfWork.Repository<ContactSubmission>().Update(s);
        await _unitOfWork.SaveChangesAsync();
        return Ok(s);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var s = await _unitOfWork.Repository<ContactSubmission>().GetByIdAsync(id);
        if (s == null) return NotFound();
        _unitOfWork.Repository<ContactSubmission>().Remove(s);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
}
