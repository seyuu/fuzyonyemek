using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class SiteSetting : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string? Value { get; set; }
    public string? ValueType { get; set; }
    public string? GroupName { get; set; }
    public string? Description { get; set; }
}
