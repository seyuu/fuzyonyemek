using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;
using FuzyonYemek.Application.Interfaces;

namespace FuzyonYemek.Infrastructure.Services;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IConfiguration configuration)
    {
        var account = new Account(
            configuration["Cloudinary:CloudName"],
            configuration["Cloudinary:ApiKey"],
            configuration["Cloudinary:ApiSecret"]
        );
        _cloudinary = new Cloudinary(account);
        _cloudinary.Api.Secure = true;
    }

    public async Task<CloudinaryUploadResult> UploadImageAsync(Stream fileStream, string fileName, string? folder = null)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = folder ?? "fuzyonyemek",
            Transformation = new Transformation()
                .Quality("auto")
                .FetchFormat("auto"),
            UseFilename = true,
            UniqueFilename = true,
            Overwrite = false
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
        {
            throw new Exception($"Cloudinary upload error: {result.Error.Message}");
        }

        return new CloudinaryUploadResult
        {
            PublicId = result.PublicId,
            Url = result.Url?.ToString() ?? string.Empty,
            SecureUrl = result.SecureUrl?.ToString() ?? string.Empty,
            Width = result.Width,
            Height = result.Height,
            Bytes = result.Bytes,
            Format = result.Format
        };
    }

    public async Task<bool> DeleteImageAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        var result = await _cloudinary.DestroyAsync(deleteParams);
        return result.Result == "ok";
    }
}
