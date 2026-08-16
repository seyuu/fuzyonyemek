using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class GalleryImage : BaseEntity
{
    public string? Title { get; set; }
    public string? AltText { get; set; }
    public string? Category { get; set; }
    public int? MediaAssetId { get; set; }
    public MediaAsset? MediaAsset { get; set; }
    public int SortOrder { get; set; }
    public bool IsVisible { get; set; } = true;
}
