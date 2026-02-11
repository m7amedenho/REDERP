using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using RedApi.Shared.Data;
using RedApi.Shared.Models;

namespace RedApi.Services;

public interface IRefreshTokenService
{
    Task<RefreshToken> CreateAsync(string userId, string tokenHash, string ip);
    Task<(bool ok, RefreshToken? token, string? reason)> ValidateAsync(string tokenHash);
    Task RotateAsync(RefreshToken current, string newTokenHash, string ip);
    Task RevokeAllAsync(string userId, string ip);
}

public class RefreshTokenService : IRefreshTokenService
{
    private readonly AppDbContext _db;
    private readonly JwtOptions _opt;

    public RefreshTokenService(AppDbContext db, IOptions<JwtOptions> opt)
    {
        _db = db;
        _opt = opt.Value;
    }

    public async Task<RefreshToken> CreateAsync(string userId, string tokenHash, string ip)
    {
        var rt = new RefreshToken
        {
            UserId = userId,
            TokenHash = tokenHash,
            CreatedByIp = ip,
            CreatedUtc = DateTimeOffset.UtcNow,
            ExpiresUtc = DateTimeOffset.UtcNow.AddDays(_opt.RefreshTokenDays)
        };

        _db.RefreshTokens.Add(rt);
        await _db.SaveChangesAsync();
        return rt;
    }

    public async Task<(bool ok, RefreshToken? token, string? reason)> ValidateAsync(string tokenHash)
    {
        var rt = await _db.RefreshTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.TokenHash == tokenHash);

        if (rt == null) return (false, null, "Invalid refresh token");
        if (!rt.User.IsActive) return (false, rt, "User is inactive");

        return (true, rt, null);
    }

    public async Task RotateAsync(RefreshToken current, string newTokenHash, string ip)
    {
        current.RevokedUtc = DateTimeOffset.UtcNow;
        current.RevokedByIp = ip;
        current.ReplacedByTokenHash = newTokenHash;

        _db.RefreshTokens.Update(current);
        await _db.SaveChangesAsync();
    }

    public async Task RevokeAllAsync(string userId, string ip)
    {
        var tokens = await _db.RefreshTokens
            .Where(x => x.UserId == userId && x.RevokedUtc == null)
            .ToListAsync();

        foreach (var t in tokens)
        {
            t.RevokedUtc = DateTimeOffset.UtcNow;
            t.RevokedByIp = ip;
        }

        await _db.SaveChangesAsync();
    }
}
