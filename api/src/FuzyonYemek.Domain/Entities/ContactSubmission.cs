using FuzyonYemek.Domain.Common;

namespace FuzyonYemek.Domain.Entities;

public class ContactSubmission : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? ServiceType { get; set; }
    public string? PersonCount { get; set; }
    public string? Message { get; set; }
    public bool IsRead { get; set; } = false;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}
