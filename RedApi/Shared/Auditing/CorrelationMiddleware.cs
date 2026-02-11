using System.Diagnostics;

namespace RedApi.Shared.Auditing;

public class CorrelationMiddleware
{
    private readonly RequestDelegate _next;
    public const string HeaderName = "X-Correlation-Id";

    public CorrelationMiddleware(RequestDelegate next) => _next = next;

    public async Task Invoke(HttpContext ctx)
    {
        var cid = ctx.Request.Headers[HeaderName].FirstOrDefault();
        if (string.IsNullOrWhiteSpace(cid))
            cid = Activity.Current?.Id ?? Guid.NewGuid().ToString("N");

        ctx.Items["CorrelationId"] = cid;
        ctx.Response.Headers[HeaderName] = cid;

        await _next(ctx);
    }
}
