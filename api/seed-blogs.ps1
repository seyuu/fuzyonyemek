# Blog Başlangıç Verilerini API'ye Aktarma Scripti
# Kullanım: PowerShell üzerinden yerel API açıkken çalıştırılır.

[CmdletBinding()]
param(
    [string]$Email = "admin@fuzyonyemek.com",
    [System.Security.SecureString]$Password
)

if (-not $Password) {
    $Password = Read-Host "Admin şifresini giriniz" -AsSecureString
}

$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)

$loginBody = @{ email = $Email; password = $plainPassword } | ConvertTo-Json
$token = (Invoke-RestMethod -Uri "http://localhost:5050/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json").accessToken
$headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }

$blogPosts = @(
  @{ slug="yenibosna-catering"; title="Yenibosna Catering"; excerpt="Yenibosna bölgesindeki kurumsal şirketler için kesintisiz, hijyenik ve yüksek kapasiteli catering çözümleri üretiyoruz."; categoryId=1; readTime="4 dk"; isPublished=$true; featuredImageUrl="/images/blog-delivery.png"; metaTitle="Yenibosna Catering | Füzyon Yemek"; metaDescription="Yenibosna bölgesinde kurumsal catering hizmetleri. Ozon teknolojili hijyenik üretim." },
  @{ slug="yenibosna-yemek-firmalari"; title="Yenibosna Yemek Firmaları"; excerpt="Yenibosna bölgesindeki kurumsal şirketler için kesintisiz, hijyenik ve yüksek kapasiteli yemek firmaları çözümleri üretiyoruz."; categoryId=1; readTime="4 dk"; isPublished=$true; featuredImageUrl="/images/blog-bento.png"; metaTitle="Yenibosna Yemek Firmaları | Füzyon Yemek"; metaDescription="Yenibosna bölgesinde profesyonel yemek firmaları hizmetleri." },
  @{ slug="hadimkoy-catering"; title="Hadımköy Catering"; excerpt="Hadımköy bölgesindeki kurumsal şirketler için kesintisiz, hijyenik ve yüksek kapasiteli catering çözümleri üretiyoruz."; categoryId=1; readTime="4 dk"; isPublished=$true; featuredImageUrl="/images/blog-kitchen.png"; metaTitle="Hadımköy Catering | Füzyon Yemek"; metaDescription="Hadımköy bölgesinde kurumsal catering hizmetleri." },
  @{ slug="hadimkoy-yemek-firmalari"; title="Hadımköy Yemek Firmaları"; excerpt="Hadımköy bölgesindeki kurumsal şirketler için kesintisiz, hijyenik ve yüksek kapasiteli yemek firmaları çözümleri üretiyoruz."; categoryId=1; readTime="4 dk"; isPublished=$true; featuredImageUrl="/images/blog-dining.png"; metaTitle="Hadımköy Yemek Firmaları | Füzyon Yemek"; metaDescription="Hadımköy bölgesinde profesyonel yemek firmaları hizmetleri." },
  @{ slug="esenyurt-catering"; title="Esenyurt Catering"; excerpt="Esenyurt bölgesindeki kurumsal şirketler için kesintisiz, hijyenik ve yüksek kapasiteli catering çözümleri üretiyoruz."; categoryId=1; readTime="4 dk"; isPublished=$true; featuredImageUrl="/images/blog-delivery.png"; metaTitle="Esenyurt Catering | Füzyon Yemek"; metaDescription="Esenyurt bölgesinde kurumsal catering hizmetleri." },
  @{ slug="esenyurt-yemek-firmalari"; title="Esenyurt Yemek Firmaları"; excerpt="Esenyurt bölgesindeki kurumsal şirketler için kesintisiz, hijyenik ve yüksek kapasiteli yemek firmaları çözümleri üretiyoruz."; categoryId=1; readTime="4 dk"; isPublished=$true; featuredImageUrl="/images/blog-bento.png"; metaTitle="Esenyurt Yemek Firmaları | Füzyon Yemek"; metaDescription="Esenyurt bölgesinde profesyonel yemek firmaları hizmetleri." },
  @{ slug="beylikduzu-catering"; title="Beylikdüzü Catering"; excerpt="Beylikdüzü bölgesindeki kurumsal şirketler için kesintisiz, hijyenik ve yüksek kapasiteli catering çözümleri üretiyoruz."; categoryId=1; readTime="4 dk"; isPublished=$true; featuredImageUrl="/images/blog-kitchen.png"; metaTitle="Beylikdüzü Catering | Füzyon Yemek"; metaDescription="Beylikdüzü bölgesinde kurumsal catering hizmetleri." },
  @{ slug="beylikduzu-yemek-firmalari"; title="Beylikdüzü Yemek Firmaları"; excerpt="Beylikdüzü bölgesindeki kurumsal şirketler için kesintisiz, hijyenik ve yüksek kapasiteli yemek firmaları çözümleri üretiyoruz."; categoryId=1; readTime="4 dk"; isPublished=$true; featuredImageUrl="/images/blog-dining.png"; metaTitle="Beylikdüzü Yemek Firmaları | Füzyon Yemek"; metaDescription="Beylikdüzü bölgesinde profesyonel yemek firmaları hizmetleri." }
)

$content = "Bu yazının tam içeriği API üzerinden yönetici panelinden düzenlenebilir."

foreach ($post in $blogPosts) {
    $post.content = $content
    $body = $post | ConvertTo-Json -Compress
    try {
        $result = Invoke-RestMethod -Uri "http://localhost:5050/api/blog" -Method Post -Body $body -Headers $headers
        Write-Host "OK: $($result.title) -> /$($result.slug)" -ForegroundColor Green
    } catch {
        Write-Host "HATA: $($post.title) -> $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host "`nBlog verileri aktarıldı!" -ForegroundColor Cyan
