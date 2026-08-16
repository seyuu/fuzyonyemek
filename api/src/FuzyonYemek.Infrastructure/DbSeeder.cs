using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using FuzyonYemek.Domain.Entities;
using FuzyonYemek.Infrastructure.Data;

namespace FuzyonYemek.Infrastructure;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await SeedRolesAsync(context);
        await SeedAdminUserAsync(context);
        await SeedStatsAsync(context);
        await SeedBlogCategoriesAsync(context);

        await context.SaveChangesAsync();
    }

    private static async Task SeedRolesAsync(AppDbContext context)
    {
        if (await context.Roles.AnyAsync()) return;

        context.Roles.AddRange(
            new Role { Id = 1, Name = "Admin", Description = "Tam yetkili yönetici" },
            new Role { Id = 2, Name = "Editor", Description = "İçerik editörü — blog ve medya yönetimi" }
        );
        await context.SaveChangesAsync();
    }

    private static async Task SeedAdminUserAsync(AppDbContext context)
    {
        if (await context.Users.AnyAsync()) return;

        var defaultPassword = Environment.GetEnvironmentVariable("ADMIN_DEFAULT_PASSWORD") ?? "Admin123!";
        var adminId = Guid.NewGuid();
        var admin = new User
        {
            Id = adminId,
            Email = "admin@fuzyonyemek.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(defaultPassword),
            FullName = "Sistem Yöneticisi",
            IsActive = true,
        };
        context.Users.Add(admin);
        await context.SaveChangesAsync();

        context.UserRoleMappings.Add(new UserRoleMapping
        {
            UserId = adminId,
            RoleId = 1 // Admin
        });
        await context.SaveChangesAsync();
    }

    private static async Task SeedStatsAsync(AppDbContext context)
    {
        if (await context.Stats.AnyAsync()) return;

        context.Stats.AddRange(
            new Stat { Number = "15+", Label = "Yıllık Deneyim", SortOrder = 1, IsVisible = true },
            new Stat { Number = "500", Label = "Kurumsal Referans", SortOrder = 2, IsVisible = true },
            new Stat { Number = "50k", Label = "Günlük Porsiyon", SortOrder = 3, IsVisible = true },
            new Stat { Number = "%99", Label = "Hijyen & Ozon Onayı", SortOrder = 4, IsVisible = true }
        );
    }

    private static async Task SeedBlogCategoriesAsync(AppDbContext context)
    {
        if (await context.BlogCategories.AnyAsync()) return;

        context.BlogCategories.AddRange(
            new BlogCategory { Name = "Hizmet Bölgeleri", Slug = "hizmet-bolgeleri", SortOrder = 1 },
            new BlogCategory { Name = "Beslenme", Slug = "beslenme", SortOrder = 2 },
            new BlogCategory { Name = "Sektör", Slug = "sektor", SortOrder = 3 }
        );
    }
}
