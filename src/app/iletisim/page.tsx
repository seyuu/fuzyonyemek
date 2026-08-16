/**
 * ============================================================================
 * İLETİŞİM VE TEKLİF TALEP SAYFASI (CONTACT PAGE) — React Client Component
 * ============================================================================
 * 
 * 🎓 ÖĞRENCİ İÇİN NOTLAR:
 * En üstteki `"use client";` ifadesi ne anlama gelir?
 * 
 * SERVER COMPONENT VS CLIENT COMPONENT:
 * Next.js'te varsayılan olarak sayfalar sunucuda çalışır. Ancak kullanıcının yazı yazacağı
 * bir form (`<input>`), buton tıklamaları (`onSubmit`, `onClick`) ve anlık durum yönetimi
 * (`useState`) varsa bu bileşenin kullanıcının tarayıcısında (Client) çalışması gerekir.
 * İşte `"use client";` direktifi Next.js'e: "Bu bileşeni tarayıcıda etkileşimli çalıştır" der.
 * 
 * FORM YÖNETİMİ ADIMLARI:
 * 1. State Yönetimi (useState): Kullanıcı her harfe bastığında `formState` güncellenir.
 * 2. e.preventDefault(): Form submit olduğunda sayfanın yenilenmesini (F5 gibi) engeller.
 * 3. POST İsteği: Formdaki veriler JSON paketine dönüştürülüp Backend'e (`/api/contact`) gönderilir.
 * 4. Geri Bildirim: İstek başarılı olduğunda form temizlenir ve teşekkür mesajı gösterilir.
 */

"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/UI/ScrollReveal";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { Button } from "@/components/UI/Button";
import { MapPin, Phone, Printer, Mail } from "lucide-react";
import styles from "./iletisim.module.css";
import { submitContact } from "@/lib/api";

// Şirket iletişim bilgileri listesi
const CONTACT_INFO = [
  {
    icon: <MapPin size={24} strokeWidth={1.5} />,
    title: "Adres",
    value: "Güzelyurt Mah. Mehmet Akif Ersoy Cad. No: 8 Zemin Kat, Esenyurt / Beylikdüzü — İstanbul",
  },
  {
    icon: <Phone size={24} strokeWidth={1.5} />,
    title: "Telefon",
    value: "0212 853 03 92 / 0212 853 03 93",
    href: "tel:+902128530392",
  },
  {
    icon: <Printer size={24} strokeWidth={1.5} />,
    title: "Faks",
    value: "0212 853 13 46",
  },
  {
    icon: <Mail size={24} strokeWidth={1.5} />,
    title: "E-posta",
    value: "info@fuzyonyemek.com",
    href: "mailto:info@fuzyonyemek.com",
  },
];

export default function IletisimPage() {
  // Formdaki girdilerin state (durum) nesnesi
  const [formState, setFormState] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    personCount: "",
    message: "",
  });

  // Gönderim esnasında butonu devre dışı bırakmak için yükleme durumu
  const [submitting, setSubmitting] = useState(false);
  // Başarılı gönderim mesajını kontrol eden durum
  const [submitted, setSubmitted] = useState(false);

  /**
   * Tüm form girdilerini tek bir fonksiyonla yakalayan değişiklik dinleyicisi (Generic Handler)
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /**
   * Form gönderildiğinde çalışan fonksiyon
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Sayfanın baştan yüklenmesini engelle
    setSubmitting(true);

    try {
      // lib/api.ts içerisindeki submitContact fonksiyonunu çağırıyoruz
      await submitContact({
        name: formState.name,
        company: formState.company,
        email: formState.email,
        phone: formState.phone,
        serviceType: formState.service,
        personCount: formState.personCount,
        message: formState.message,
      });

      // Başarılı olursa formu sıfırla ve teşekkür mesajını aç
      setSubmitted(true);
      setFormState({ name: "", company: "", email: "", phone: "", service: "", personCount: "", message: "" });
    } catch {
      alert("Mesajınız gönderilirken bir hata oluştu. Lütfen telefon ile bizimle iletişime geçiniz.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollReveal>
      {/* ── İletişim Hero Başlığı ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className="reveal">
            <span className={styles.tagline}>İletişim</span>
            <h1 className={styles.heroTitle}>Bizimle İletişime Geçin</h1>
            <p className={styles.heroDesc}>
              Kurumsal yemek ihtiyaçlarınız için size özel teklif hazırlayalım.
              İlk görüşme ve menü danışmanlığı ücretsizdir.
            </p>
          </div>
        </div>
      </section>

      {/* ── İletişim Bilgileri ve Form Alanı ── */}
      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            
            {/* Sol Taraf: İletişim Kartları */}
            <div className="reveal">
              <SectionHeading
                tagline="İletişim Bilgileri"
                title="Bize Ulaşın"
                align="left"
              />
              <div className={styles.infoList}>
                {CONTACT_INFO.map((item, i) => (
                  <div key={i} className={styles.infoItem}>
                    <span className={styles.infoIcon}>{item.icon}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <br />
                      {item.href ? (
                        <a href={item.href} className={styles.infoLink}>
                          {item.value}
                        </a>
                      ) : (
                        <span className={styles.infoValue}>{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ Taraf: Teklif Talep Formu */}
            <div className="reveal" style={{ transitionDelay: "150ms" }}>
              <form className={styles.form} onSubmit={handleSubmit} id="contact-form">
                <h3 className={styles.formTitle}>Teklif Talep Formu</h3>
                
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label htmlFor="name">Ad Soyad *</label>
                    <input type="text" id="name" name="name" required value={formState.name} onChange={handleChange} placeholder="Adınız Soyadınız" />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="company">Firma Adı</label>
                    <input type="text" id="company" name="company" value={formState.company} onChange={handleChange} placeholder="Firma adınız" />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label htmlFor="email">E-posta *</label>
                    <input type="email" id="email" name="email" required value={formState.email} onChange={handleChange} placeholder="ornek@firma.com" />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="phone">Telefon *</label>
                    <input type="tel" id="phone" name="phone" required value={formState.phone} onChange={handleChange} placeholder="05XX XXX XX XX" />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label htmlFor="service">Hizmet Türü</label>
                    <select id="service" name="service" value={formState.service} onChange={handleChange}>
                      <option value="">Seçiniz</option>
                      <option value="tasima">Taşıma Yemek</option>
                      <option value="yerinde">Yerinde Üretim</option>
                      <option value="catering">Outside Catering</option>
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="personCount">Kişi Sayısı</label>
                    <input type="number" id="personCount" name="personCount" value={formState.personCount} onChange={handleChange} placeholder="Tahmini kişi sayısı" min="1" />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="message">Mesajınız</label>
                  <textarea id="message" name="message" rows={4} value={formState.message} onChange={handleChange} placeholder="Eklemek istediğiniz özel talepler..." />
                </div>

                <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                  {submitting ? "Gönderiliyor..." : "Teklif Talep Et"}
                </Button>

                {submitted && (
                  <p style={{ marginTop: "var(--space-md)", color: "var(--color-accent)", fontWeight: 600 }}>
                    ✓ Talebiniz başarıyla alınmıştır. En kısa sürede size dönüş yapacağız.
                  </p>
                )}
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ── Harita Bölümü ── */}
      <section className={styles.mapSection}>
        <iframe
          title="Füzyon Yemek Konum"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.8!2d28.6768!3d41.0245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAxJzI4LjIiTiAyOMKwNDAnMzYuNSJF!5e0!3m2!1str!2str!4v1"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </ScrollReveal>
  );
}
