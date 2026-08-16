/**
 * ============================================================================
 * .NET 8 WEB API GİRİŞ NOKTASI (PROGRAM.CS) — Backend Mimarisi
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * ASP.NET Core 8 Web API projesinin kalbi burasıdır. Sunucu ilk açıldığında
 * bu dosya satır satır çalışır.
 * 
 * MİMARİ AŞAMALAR (2 Ana Faz):
 * 1. SERVİS KAYITLARI (builder.Services):
 *    - Dependency Injection (Bağımlılık Enjeksiyonu): Veritabanı bağlantısı (DbContext),
 *      JWT Şifreleme servisleri ve Repository'ler sisteme tanıtılır.
 *    - CORS (Cross-Origin Resource Sharing): Frontend (Next.js) ve Admin panelinin (React)
 *      bu API'ye güvenle bağlanmasına izin verir.
 *    - Serilog: Tüm istekleri ve olası hataları konsola renkli ve yapısal olarak kaydeder.
 * 
 * 2. HTTP İŞLEM BORU HATTI (Middleware Pipeline - app.Use...):
 *    Gelen bir web isteği sırasıyla bu filtrelerden geçer:
 *    Loglama -> CORS Kontrolü -> Kimlik Doğrulama (Authentication) -> Yetki Kontrolü (Authorization) -> Controller.
 *    Sıralama .NET'te çok kritiktir! Authentication her zaman Authorization'dan önce gelmelidir.
 */

using Serilog;
using FuzyonYemek.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// ─── 1. SERILOG YAPILANDIRMASI (PROFESYONEL LOGLAMA) ───
builder.Host.UseSerilog((context, config) =>
{
    config
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .WriteTo.Console();
});

// ─── 2. ALTYAPI SERVİSLERİ (DB, JWT, REPOSITORIES) ───
// Infrastructure katmanındaki PostgreSQL DbContext ve servis kayıtlarını çağırıyoruz
builder.Services.AddInfrastructure(builder.Configuration);

// ─── 3. CONTROLLERS SERVİSLERİ ───
builder.Services.AddControllers();

// ─── 4. CORS POLİTİKASI (FARKLI PORTLARDAN GELEN İSTEKLERE İZİN VERME) ───
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontends", policy =>
    {
        policy
            .SetIsOriginAllowed(_ => true) // Localhost ve Cloud Run alan adlarına izin ver
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// ─── 5. YANIT ÖNBELLEKLEME (RESPONSE CACHING) ───
builder.Services.AddResponseCaching();

var app = builder.Build();

// ─── HTTP İŞLEM BORU HATTI (MIDDLEWARE PIPELINE) ───

// Gelen istekleri logla
app.UseSerilogRequestLogging();

// CORS kurallarını uygula
app.UseCors("AllowFrontends");

// Kimlik doğrulama: "Kullanıcının gönderdiği JWT token geçerli mi?"
app.UseAuthentication();

// Yetki kontrolü: "Bu kullanıcı Admin rolüne sahip mi?"
app.UseAuthorization();

// Önbellek mekanizmasını devreye al
app.UseResponseCaching();

// Statik dosya (görseller) sunucusu
var publicPath = @"e:\projeler\fuzyonyemek\public";
if (Directory.Exists(publicPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(publicPath),
        RequestPath = "/assets"
    });
}

// Controller rotalarını (/api/blog, /api/auth vs.) eşleştir
app.MapControllers();

// ─── HEALTH CHECK (SUNUCU SAĞLIK KONTROLÜ) ───
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

// ─── PORT BINDING (DİNAMİK VEYA 5050 PORTUNDA BAŞLAT) ───
var port = Environment.GetEnvironmentVariable("PORT") ?? "5050";
app.Run($"http://0.0.0.0:{port}");
