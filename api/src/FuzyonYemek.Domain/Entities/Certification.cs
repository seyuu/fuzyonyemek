using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class Certification : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; }
    public bool IsVisible { get; set; } = true;
}
