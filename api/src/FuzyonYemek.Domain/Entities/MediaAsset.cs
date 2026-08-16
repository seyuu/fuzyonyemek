using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class MediaAsset : BaseEntity
{
    public string PublicId { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string SecureUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? OriginalFileName { get; set; }
    public string? ContentType { get; set; }
    public long FileSizeBytes { get; set; }
    public int? Width { get; set; }
    public int? Height { get; set; }
    public string? AltText { get; set; }
    public string? Folder { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public Guid? UploadedByUserId { get; set; }
    public User? UploadedBy { get; set; }
}
