# Füzyon Yemek - Deployment (Canlıya Alma) Rehberi

Bu doküman, sistemin üç ayrı bileşeninin (Frontend, Admin, API) nereye ve nasıl deploy edileceğini tanımlar.

## 1. Mimari Genel Bakış
Sistem 3 ayrı alt alan adına (subdomain) bölünerek izole bir şekilde çalışacaktır:
- **Ana Site:** `fuzyonyemek.com` (veya `www.fuzyonyemek.com`)
- **Admin Paneli:** `admin.fuzyonyemek.com`
- **Backend API:** `api.fuzyonyemek.com`

---

## 2. Bileşen Dağılımı

### 🔹 Frontend (Next.js)
Ana müşteri sitesi, Next.js tabanlıdır. Google Cloud Run üzerinde konteyner olarak çalıştırılır.
- **Hedef Sunucu:** Google Cloud Run.
- **Nasıl Yapılır:** 
  1. Frontend kök dizininde (`e:\projeler\fuzyonyemek`) terminal açılır.
  2. Komut: `gcloud run deploy fuzyonyemek-web --source . --region europe-west3 --allow-unauthenticated --project=kaliteliisler`
  3. Cloud Run'ın vereceği adres `fuzyonyemek.com` alan adına haritalanır.

### 🔹 Admin Paneli (Vite + React)
Sadece yöneticilerin kullanacağı istemci taraflı (Client-side) SPA uygulamasıdır. Google Cloud Run'da Node.js/Nginx üzerinden sunulur.
- **Hedef Sunucu:** Google Cloud Run.
- **Nasıl Yapılır:**
  1. Admin dizininde (`admin/`) terminal açılır.
  2. Komut: `gcloud run deploy fuzyonyemek-admin --source . --region europe-west3 --allow-unauthenticated --project=kaliteliisler`
  3. Cloud Run'ın vereceği adres `admin.fuzyonyemek.com` alan adına haritalanır.

### 🔹 Backend API (.NET 8)
Sistemin beyni, veritabanı işlemleri ve JWT doğrulamalarının yapıldığı yerdir.
- **Hedef Sunucu:** Google Cloud Run (Serverless, Ölçeklenebilir, Maliyet Etkin).
- **Nasıl Yapılır:**
  1. API dizininde (`api/`) Google Cloud CLI kullanılarak deploy edilir.
  2. Komut: `gcloud run deploy fuzyonyemek --source . --region europe-west3 --allow-unauthenticated --project=kaliteliisler --set-build-env-vars=GOOGLE_BUILDABLE=src/FuzyonYemek.API`
  3. Cloud Run'ın verdiği servis URL'si (ör. `https://fuzyonyemek-xxxx.a.run.app`), Cloud Domains / DNS üzerinden `api.fuzyonyemek.com` adresine haritalanır (Custom Domain Mapping).

---

## 3. Veritabanı ve Depolama
- **Veritabanı:** PostgreSQL (Neon.tech veya VPS üzerinde kendi kurduğumuz bir PostgreSQL sunucusu).
- **Medya / Görseller:** Cloudinary (Admin paneli zaten buraya yükleyecek şekilde ayarlandı, `VITE_CLOUDINARY_URL` ortam değişkeni girilecek).

## 4. Ortam Değişkenleri (Environment Variables)

Canlı ortama atarken ayarlanması gereken değişkenler:

**Frontend (.env.local / Vercel Env):**
```
NEXT_PUBLIC_API_URL=https://api.fuzyonyemek.com
```

**Admin Paneli (Netlify / cPanel Env):**
```
VITE_API_URL=https://api.fuzyonyemek.com
```

**API (Google Cloud Run Environment Variables / Secrets):**
`appsettings.Production.json` kullanmak yerine, Cloud Run paneli üzerinden (veya CLI ile) aşağıdaki ortam değişkenleri güvenli bir şekilde girilir:

- `ConnectionStrings__DefaultConnection` = `Host=...;Database=...;Username=...;Password=...`
- `Jwt__Issuer` = `https://api.fuzyonyemek.com`
- `Jwt__Audience` = `https://fuzyonyemek.com`
- `Jwt__Key` = `(Güçlü bir secret key)`

*Not: Cloud Run'da hiyerarşik JSON yapıları (ör. `ConnectionStrings:DefaultConnection`), ortam değişkeni olarak tanımlanırken iki alt çizgi (`__`) ile yazılır.*
