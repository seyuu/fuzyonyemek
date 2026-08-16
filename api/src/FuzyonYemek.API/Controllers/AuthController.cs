using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FuzyonYemek.Application.Interfaces;
using FuzyonYemek.Domain.Entities;
using FuzyonYemek.API.DTOs;

namespace FuzyonYemek.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IUnitOfWork unitOfWork, IJwtService jwtService, ILogger<AuthController> logger)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _unitOfWork.Repository<User>()
            .Query()
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Failed login attempt for {Email}", request.Email);
            return Unauthorized(new { message = "Geçersiz e-posta veya şifre." });
        }

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        var accessToken = _jwtService.GenerateAccessToken(user, roles);
        var refreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        user.LastLoginAt = DateTime.UtcNow;
        _unitOfWork.Repository<User>().Update(user);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("User {Email} logged in", request.Email);

        return Ok(new LoginResponse(accessToken, refreshToken, new UserInfo(user.Id, user.Email, user.FullName, roles)));
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
    {
        var userId = _jwtService.GetUserIdFromExpiredToken(request.AccessToken);
        if (userId == null)
            return Unauthorized(new { message = "Geçersiz jeton." });

        var user = await _unitOfWork.Repository<User>()
            .Query()
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == userId.Value);

        if (user == null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiryTime < DateTime.UtcNow)
            return Unauthorized(new { message = "Geçersiz veya süresi dolmuş yenileme jetonu." });

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        var newAccessToken = _jwtService.GenerateAccessToken(user, roles);
        var newRefreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        _unitOfWork.Repository<User>().Update(user);
        await _unitOfWork.SaveChangesAsync();

        return Ok(new LoginResponse(newAccessToken, newRefreshToken, new UserInfo(user.Id, user.Email, user.FullName, roles)));
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdStr == null || !Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();

        var user = await _unitOfWork.Repository<User>().GetByIdAsync(userId);
        if (user == null)
            return NotFound();

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            return BadRequest(new { message = "Mevcut şifre yanlış." });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        _unitOfWork.Repository<User>().Update(user);
        await _unitOfWork.SaveChangesAsync();

        return Ok(new { message = "Şifre başarıyla değiştirildi." });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdStr == null || !Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();

        var user = await _unitOfWork.Repository<User>()
            .Query()
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return NotFound();

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        return Ok(new UserInfo(user.Id, user.Email, user.FullName, roles));
    }
}
