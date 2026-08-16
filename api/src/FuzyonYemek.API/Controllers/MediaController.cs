using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FuzyonYemek.Application.Interfaces;
using FuzyonYemek.Domain.Entities;

namespace FuzyonYemek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MediaController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICloudinaryService _cloudinary;

    public MediaController(IUnitOfWork unitOfWork, ICloudinaryService cloudinary)
    {
        _unitOfWork = unitOfWork;
        _cloudinary = cloudinary;
    }

    [HttpPost("migrate-local-files")]
    public async Task<IActionResult> MigrateLocalFiles()
    {
        var envPath = @"E:\projeler\fuzyonyemek\public\images";
        var envPath2 = @"E:\projeler\fuzyonyemek\public\galeri";
        if (!Directory.Exists(envPath)) return Ok(new { message = "images not found", p = envPath });
        
        var results = new List<string>();
        foreach (var file in Directory.GetFiles(envPath).Concat(Directory.Exists(envPath2) ? Directory.GetFiles(envPath2) : Array.Empty<string>()))
        {
            if (!file.EndsWith(".png") && !file.EndsWith(".jpg") && !file.EndsWith(".jpeg")) continue;
            
            using var stream = System.IO.File.OpenRead(file);
            var fName = Path.GetFileName(file);
            var result = await _cloudinary.UploadImageAsync(stream, fName, "site_assets");
            
            var asset = new MediaAsset
            {
                PublicId = result.PublicId,
                Url = result.Url,
                SecureUrl = result.SecureUrl,
                ThumbnailUrl = result.SecureUrl.Replace("/upload/", "/upload/c_thumb,w_200,h_200/"),
                OriginalFileName = fName,
                ContentType = "image/png",
                FileSizeBytes = result.Bytes,
                Width = result.Width,
                Height = result.Height,
                Folder = "site_assets",
                UploadedAt = DateTime.UtcNow
            };
            await _unitOfWork.Repository<MediaAsset>().AddAsync(asset);
            results.Add(result.SecureUrl);
        }
        await _unitOfWork.SaveChangesAsync();
        return Ok(results);
    }

    [Authorize(Policy = "EditorOrAdmin")]
    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file, [FromQuery] string? folder = null)
    {
        if (file.Length == 0) return BadRequest(new { message = "Dosya boş." });
        if (file.Length > 10 * 1024 * 1024) return BadRequest(new { message = "Dosya 10MB'dan büyük olamaz." });

        using var stream = file.OpenReadStream();
        var result = await _cloudinary.UploadImageAsync(stream, file.FileName, folder);

        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid.TryParse(userIdStr, out var userId);

        var asset = new MediaAsset
        {
            PublicId = result.PublicId,
            Url = result.Url,
            SecureUrl = result.SecureUrl,
            ThumbnailUrl = result.SecureUrl.Replace("/upload/", "/upload/c_thumb,w_200,h_200/"),
            OriginalFileName = file.FileName,
            ContentType = file.ContentType,
            FileSizeBytes = result.Bytes,
            Width = result.Width,
            Height = result.Height,
            Folder = folder,
            UploadedByUserId = userId == Guid.Empty ? null : userId,
        };

        await _unitOfWork.Repository<MediaAsset>().AddAsync(asset);
        await _unitOfWork.SaveChangesAsync();

        return Ok(asset);
    }

    [Authorize(Policy = "EditorOrAdmin")]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? folder = null)
    {
        var query = _unitOfWork.Repository<MediaAsset>().Query().AsQueryable();
        if (!string.IsNullOrEmpty(folder))
            query = query.Where(m => m.Folder == folder);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(m => m.UploadedAt)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .ToListAsync();

        return Ok(new { data = items, total, page, pageSize });
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var asset = await _unitOfWork.Repository<MediaAsset>().GetByIdAsync(id);
        if (asset == null) return NotFound();

        await _cloudinary.DeleteImageAsync(asset.PublicId);
        _unitOfWork.Repository<MediaAsset>().Remove(asset);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
}
