using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class User : BaseEntity<Guid>
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    // Navigation
    public ICollection<UserRoleMapping> UserRoles { get; set; } = new List<UserRoleMapping>();
    public ICollection<MediaAsset> UploadedMedia { get; set; } = new List<MediaAsset>();
}
