using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class PageSection : BaseEntity
{
    public int PageId { get; set; }
    public Page Page { get; set; } = null!;

    public string SectionKey { get; set; } = string.Empty;
    public string SectionType { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Subtitle { get; set; }
    public string? Tagline { get; set; }
    public string? ContentJson { get; set; }
    public string? BackgroundType { get; set; }
    public string? BackgroundValue { get; set; }
    public int SortOrder { get; set; }
    public bool IsVisible { get; set; } = true;

    // Navigation
    public ICollection<SectionComponent> Components { get; set; } = new List<SectionComponent>();
}
