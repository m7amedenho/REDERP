using System.ComponentModel.DataAnnotations;

namespace RedApi.Shared.Models;

public class RefreshToken
{
    public long Id { get; set; }

    [MaxLength(60)] public string UserId { get; set; } = "";
    [MaxLength(200)] public string TokenHash { get; set; } = "";
    public AppUser User { get; set; } = null!;
    public DateTimeOffset CreatedUtc { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset ExpiresUtc { get; set; }
    public DateTimeOffset? RevokedUtc { get; set; }
    [MaxLength(80)] public string? ReplacedByTokenHash { get; set; }

    [MaxLength(80)] public string CreatedByIp { get; set; } = "";
    [MaxLength(80)] public string? RevokedByIp { get; set; }
}
