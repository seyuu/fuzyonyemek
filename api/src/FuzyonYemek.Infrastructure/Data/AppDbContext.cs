using Microsoft.EntityFrameworkCore;
using FuzyonYemek.Domain.Entities;

namespace FuzyonYemek.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRoleMapping> UserRoleMappings => Set<UserRoleMapping>();
    public DbSet<Page> Pages => Set<Page>();
    public DbSet<PageSeoMeta> PageSeoMetas => Set<PageSeoMeta>();
    public DbSet<PageSection> PageSections => Set<PageSection>();
    public DbSet<SectionComponent> SectionComponents => Set<SectionComponent>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<BlogCategory> BlogCategories => Set<BlogCategory>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<ServiceBenefit> ServiceBenefits => Set<ServiceBenefit>();
    public DbSet<GalleryImage> GalleryImages => Set<GalleryImage>();
    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<ContactSubmission> ContactSubmissions => Set<ContactSubmission>();
    public DbSet<Certification> Certifications => Set<Certification>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<Stat> Stats => Set<Stat>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all configurations from this assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // ─── UserRoleMapping (composite PK) ───
        modelBuilder.Entity<UserRoleMapping>(e =>
        {
            e.HasKey(ur => new { ur.UserId, ur.RoleId });
            e.HasOne(ur => ur.User).WithMany(u => u.UserRoles).HasForeignKey(ur => ur.UserId);
            e.HasOne(ur => ur.Role).WithMany(r => r.UserRoles).HasForeignKey(ur => ur.RoleId);
        });

        // ─── User ───
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
        });

        // ─── Page ───
        modelBuilder.Entity<Page>(e =>
        {
            e.HasIndex(p => p.Slug).IsUnique();
            e.HasOne(p => p.SeoMeta).WithOne(s => s.Page).HasForeignKey<PageSeoMeta>(s => s.PageId);
            e.HasMany(p => p.Sections).WithOne(s => s.Page).HasForeignKey(s => s.PageId).OnDelete(DeleteBehavior.Cascade);
        });

        // ─── PageSection ───
        modelBuilder.Entity<PageSection>(e =>
        {
            e.HasMany(s => s.Components).WithOne(c => c.Section).HasForeignKey(c => c.SectionId).OnDelete(DeleteBehavior.Cascade);
        });

        // ─── BlogPost ───
        modelBuilder.Entity<BlogPost>(e =>
        {
            e.HasIndex(b => b.Slug).IsUnique();
            e.HasOne(b => b.Category).WithMany(c => c.Posts).HasForeignKey(b => b.CategoryId).OnDelete(DeleteBehavior.SetNull);
        });

        // ─── BlogCategory ───
        modelBuilder.Entity<BlogCategory>(e =>
        {
            e.HasIndex(c => c.Name).IsUnique();
            e.HasIndex(c => c.Slug).IsUnique();
        });

        // ─── Service ───
        modelBuilder.Entity<Service>(e =>
        {
            e.HasIndex(s => s.Slug).IsUnique();
            e.HasMany(s => s.Benefits).WithOne(b => b.Service).HasForeignKey(b => b.ServiceId).OnDelete(DeleteBehavior.Cascade);
        });

        // ─── GalleryImage ───
        modelBuilder.Entity<GalleryImage>(e =>
        {
            e.HasOne(g => g.MediaAsset).WithMany().HasForeignKey(g => g.MediaAssetId).OnDelete(DeleteBehavior.SetNull);
        });

        // ─── MediaAsset ───
        modelBuilder.Entity<MediaAsset>(e =>
        {
            e.HasIndex(m => m.PublicId).IsUnique();
            e.HasOne(m => m.UploadedBy).WithMany(u => u.UploadedMedia).HasForeignKey(m => m.UploadedByUserId).OnDelete(DeleteBehavior.SetNull);
        });

        // ─── SiteSetting ───
        modelBuilder.Entity<SiteSetting>(e =>
        {
            e.HasIndex(s => s.Key).IsUnique();
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<Domain.Common.BaseEntity>())
        {
            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
        foreach (var entry in ChangeTracker.Entries<Domain.Common.BaseEntity<Guid>>())
        {
            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}
