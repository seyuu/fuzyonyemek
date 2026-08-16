using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using FuzyonYemek.Application.Interfaces;
using FuzyonYemek.Infrastructure.Data;
using FuzyonYemek.Infrastructure.Repositories;
using FuzyonYemek.Infrastructure.Services;

namespace FuzyonYemek.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // ─── Database ───
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"), npgsqlOptions =>
            {
                npgsqlOptions.EnableRetryOnFailure(3);
                npgsqlOptions.CommandTimeout(30);
            })
            .EnableDetailedErrors();
        });

        // ─── Repositories ───
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // ─── Services ───
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<ICloudinaryService, CloudinaryService>();

        // ─── JWT Authentication ───
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured"))),
                ClockSkew = TimeSpan.FromMinutes(1)
            };
        });

        // ─── Authorization Policies ───
        services.AddAuthorizationBuilder()
            .AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"))
            .AddPolicy("EditorOrAdmin", policy => policy.RequireRole("Admin", "Editor"));

        return services;
    }
}
