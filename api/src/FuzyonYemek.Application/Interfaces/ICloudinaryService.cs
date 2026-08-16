namespace FuzyonYemek.Application.Interfaces;

public interface ICloudinaryService
{
    Task<CloudinaryUploadResult> UploadImageAsync(Stream fileStream, string fileName, string? folder = null);
    Task<bool> DeleteImageAsync(string publicId);
}

public class CloudinaryUploadResult
{
    public string PublicId { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string SecureUrl { get; set; } = string.Empty;
    public int Width { get; set; }
    public int Height { get; set; }
    public long Bytes { get; set; }
    public string Format { get; set; } = string.Empty;
}
