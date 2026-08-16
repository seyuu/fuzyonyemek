using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class Role : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Navigation
    public ICollection<UserRoleMapping> UserRoles { get; set; } = new List<UserRoleMapping>();
}
