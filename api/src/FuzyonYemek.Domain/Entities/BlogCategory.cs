using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class BlogCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int SortOrder { get; set; }

    // Navigation
    public ICollection<BlogPost> Posts { get; set; } = new List<BlogPost>();
}
