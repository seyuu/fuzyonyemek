using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class SectionComponent : BaseEntity
{
    public int SectionId { get; set; }
    public PageSection Section { get; set; } = null!;

    public string ComponentType { get; set; } = string.Empty;
    public string? ContentJson { get; set; }
    public string? IconName { get; set; }
    public string? ImageUrl { get; set; }
    public string? LinkUrl { get; set; }
    public string? LinkText { get; set; }
    public int SortOrder { get; set; }
    public bool IsVisible { get; set; } = true;
}
