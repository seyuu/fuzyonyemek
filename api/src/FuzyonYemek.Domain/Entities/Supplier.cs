using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class Supplier : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public int SortOrder { get; set; }
    public bool IsVisible { get; set; } = true;
}
