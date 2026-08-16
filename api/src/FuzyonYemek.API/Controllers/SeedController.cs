using Microsoft.AspNetCore.Mvc;
using FuzyonYemek.Infrastructure;

namespace FuzyonYemek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<SeedController> _logger;

    public SeedController(IServiceProvider serviceProvider, ILogger<SeedController> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    [HttpPost("init")]
    public async Task<IActionResult> SeedDatabase()
    {
        try
        {
            _logger.LogInformation("Database seed started...");
            await DbSeeder.SeedAsync(_serviceProvider);
            _logger.LogInformation("Database seed completed.");
            return Ok(new { message = "Veritabanı başarıyla dolduruldu." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database seed failed");
            return StatusCode(500, new { message = "Seed hatası", error = ex.Message });
        }
    }
}
