using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RedApi.Shared.Auditing;
using RedApi.Shared.Data;
using RedApi.Shared.Models;

namespace RedApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<AppUser> _userMgr;
    private readonly IConfiguration _cfg;
    private readonly IAuditService _audit;

    public AuthController(AppDbContext db, UserManager<AppUser> userMgr, IConfiguration cfg, IAuditService audit)
    {
        _db = db;
        _userMgr = userMgr;
        _cfg = cfg;
        _audit = audit;
    }

    public record LoginDto(string Identifier, string Password);

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _userMgr.FindByNameAsync(dto.Identifier)
                   ?? await _userMgr.FindByEmailAsync(dto.Identifier);

        if (user == null || !user.IsActive) return Unauthorized("Invalid credentials");

        var ok = await _userMgr.CheckPasswordAsync(user, dto.Password);
        if (!ok) return Unauthorized("Invalid credentials");

        var (accessToken, expiresUtc) = await CreateJwtAsync(user);
        var refresh = await CreateRefreshTokenAsync(user.Id);

        await _audit.LogAsync(HttpContext, "Login", "AppUser", user.Id, null, new { user.UserName, user.Email }, null);

        return Ok(new
        {
            accessToken,
            refreshToken = refresh.plain,
            expiresUtc
        });
    }

    public record RefreshDto(string RefreshToken);

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> Refresh([FromBody] RefreshDto dto)
    {
        var hash = Sha256(dto.RefreshToken);

        var rt = await _db.RefreshTokens.FirstOrDefaultAsync(x => x.TokenHash == hash);
        if (rt == null || rt.RevokedUtc != null || rt.ExpiresUtc <= DateTimeOffset.UtcNow)
            return Unauthorized("Invalid refresh token");

        var user = await _userMgr.FindByIdAsync(rt.UserId);
        if (user == null || !user.IsActive) return Unauthorized();

        // rotate
        rt.RevokedUtc = DateTimeOffset.UtcNow;
        rt.RevokedByIp = HttpContext.Connection.RemoteIpAddress?.ToString();

        var newRt = await CreateRefreshTokenAsync(user.Id);
        rt.ReplacedByTokenHash = Sha256(newRt.plain);

        await _db.SaveChangesAsync();

        var (accessToken, expiresUtc) = await CreateJwtAsync(user);
        await _audit.LogAsync(HttpContext, "Refresh", "AppUser", user.Id, null, null, null);

        return Ok(new { accessToken, refreshToken = newRt.plain, expiresUtc });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await _audit.LogAsync(HttpContext, "Logout", "AppUser", User.FindFirst("Id")?.Value, null, null, null);
        return Ok();
    }

    private async Task<(string token, DateTimeOffset expiresUtc)> CreateJwtAsync(AppUser user)
    {
        var jwtKey = _cfg["Jwt:Key"] ?? "DEV_ONLY_CHANGE_ME_very_long_key";
        var issuer = _cfg["Jwt:Issuer"] ?? "RedERP";
        var audience = _cfg["Jwt:Audience"] ?? "RedERP.Client";

        var roles = await _userMgr.GetRolesAsync(user);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim("Id", user.Id),
            new Claim(ClaimTypes.Name, user.UserName ?? ""),
            new Claim(ClaimTypes.Email, user.Email ?? ""),
            new Claim("FullName", user.FullName ?? "")
        };

        foreach (var r in roles)
            claims.Add(new Claim(ClaimTypes.Role, r));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expires = DateTimeOffset.UtcNow.AddHours(1);

        var jwt = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expires.UtcDateTime,
            signingCredentials: creds
        );

        return (new JwtSecurityTokenHandler().WriteToken(jwt), expires);
    }

    private async Task<(string plain, string hash)> CreateRefreshTokenAsync(string userId)
    {
        var plain = Base64Url(RandomBytes(48));
        var hash = Sha256(plain);

        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = userId,
            TokenHash = hash,
            ExpiresUtc = DateTimeOffset.UtcNow.AddDays(14),
            CreatedByIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? ""
        });

        await _db.SaveChangesAsync();
        return (plain, hash);
    }

    private static byte[] RandomBytes(int len)
    {
        var b = new byte[len];
        RandomNumberGenerator.Fill(b);
        return b;
    }

    private static string Base64Url(byte[] bytes) =>
        Convert.ToBase64String(bytes).Replace("+", "-").Replace("/", "_").Replace("=", "");

    private static string Sha256(string input)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes);
    }
}
