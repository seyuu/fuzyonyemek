using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class Page : BaseEntity
{
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? InternalName { get; set; }
    public bool IsPublished { get; set; } = true;
    public int SortOrder { get; set; }

    // Navigation
    public PageSeoMeta? SeoMeta { get; set; }
    public ICollection<PageSection> Sections { get; set; } = new List<PageSection>();
}
