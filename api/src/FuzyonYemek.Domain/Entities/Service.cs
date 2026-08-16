using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class Service : BaseEntity
{
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    public string? FullDescription { get; set; }
    public string? IconName { get; set; }
    public string? HeroImageUrl { get; set; }
    public string? BackgroundImageUrl { get; set; }
    public bool IsPublished { get; set; } = true;
    public int SortOrder { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }

    // Navigation
    public ICollection<ServiceBenefit> Benefits { get; set; } = new List<ServiceBenefit>();
}
