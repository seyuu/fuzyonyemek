using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class Stat : BaseEntity
{
    public string Number { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsVisible { get; set; } = true;
}
