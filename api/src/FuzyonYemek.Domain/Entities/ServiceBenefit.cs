using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class ServiceBenefit : BaseEntity
{
    public int ServiceId { get; set; }
    public Service Service { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IconName { get; set; }
    public int SortOrder { get; set; }
}
