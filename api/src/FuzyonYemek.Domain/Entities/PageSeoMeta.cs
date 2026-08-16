using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class PageSeoMeta : BaseEntity
{
    public int PageId { get; set; }
    public Page Page { get; set; } = null!;

    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? OgTitle { get; set; }
    public string? OgDescription { get; set; }
    public string? OgImage { get; set; }
    public string? CanonicalUrl { get; set; }
}
