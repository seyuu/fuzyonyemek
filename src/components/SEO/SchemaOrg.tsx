/**
 * ============================================================================
 * SCHEMA.ORG YAPISAL VERİ BİLEŞENİ (STRUCTURED DATA / JSON-LD)
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * Google, Yandex veya Bing gibi arama motorları web sitemizi ziyaret ettiğinde,
 * sitenin sadece sıradan bir yazı sayfası değil, "İstanbul'da bir Yemek Şirketi (LocalBusiness)"
 * olduğunu nasıl anlar?
 * 
 * JSON-LD (JavaScript Object Notation for Linked Data) NEDİR?
 * HTML kodunun içine gizlenen ve insanlara değil doğrudan arama motoru robotlarına hitap eden
 * standart bir veri formatıdır.
 * 
 * FAYDALARI:
 * 1. Google Haritalar & Yerel Arama: Şirketin telefon numarasını, çalışma saatlerini,
 *    enlem-boylam koordinatlarını ve hizmet verdiği ilçeleri Google'a doğrudan bildirir.
 * 2. Zengin Arama Sonuçları (Rich Snippets): Google aramalarında şirketin yanında
 *    yıldızlar, fiyat aralığı ($$) ve hizmet listesi çıkmasını sağlar.
 */

export function SchemaOrg() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "FoodEstablishment"],
    name: "Füzyon Yemek",
    legalName: "Füzyon Yemek Üretim Gıda San. İç ve Dış Tic. Ltd. Şti.",
    url: "https://www.fuzyonyemek.com",
    telephone: ["+90-212-853-03-92", "+90-212-853-03-93"],
    faxNumber: "+90-212-853-13-46",
    email: "info@fuzyonyemek.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Güzelyurt Mah. Mehmet Akif Ersoy Cad. No: 8 Zemin Kat",
      addressLocality: "Esenyurt",
      addressRegion: "İstanbul",
      postalCode: "34513",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.0245,
      longitude: 28.6768,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "07:00",
      closes: "20:00",
    },
    servesCuisine: "Türk Mutfağı",
    priceRange: "$$",
    image: "https://www.fuzyonyemek.com/images/og-image.jpg",
    description:
      "Ozon teknolojisiyle üretilmiş hijyenik ve lezzetli kurumsal yemek hizmetleri. İstanbul genelinde taşıma yemek, yerinde üretim ve outside catering.",
    areaServed: [
      { "@type": "City", name: "İstanbul" },
      { "@type": "AdministrativeArea", name: "Esenyurt" },
      { "@type": "AdministrativeArea", name: "Beylikdüzü" },
      { "@type": "AdministrativeArea", name: "Avcılar" },
      { "@type": "AdministrativeArea", name: "Büyükçekmece" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Yemek Hizmetleri",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Taşıma Yemek Hizmeti",
            description:
              "Fabrika, okul, hastane ve ofisler için hijyenik taşıma yemek servisi.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Yerinde Üretim Hizmeti",
            description:
              "Tesislerinizde profesyonel mutfak kadrosuyla yerinde yemek üretimi.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Outside Catering",
            description:
              "Özel etkinlik, toplantı ve organizasyonlarınız için premium catering hizmeti.",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  );
}
