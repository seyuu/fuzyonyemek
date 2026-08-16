import type { Metadata } from "next";
import { ScrollReveal } from "@/components/UI/ScrollReveal";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { Button } from "@/components/UI/Button";
import { Flame, Users, ClipboardList, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Yerinde Üretim Hizmeti — İstanbul",
  description:
    "Tesislerinizin mutfağında profesyonel şeflerimizle günlük taze yemek üretimi. Hijyenik, ekonomik ve esnek kurumsal yemek çözümü.",
  alternates: { canonical: "https://www.fuzyonyemek.com/hizmetlerimiz/yerinde-uretim" },
};

const BENEFITS = [
  { icon: <Flame size={32} strokeWidth={1.5} />, title: "Taze Üretim", desc: "Yemekler tesislerinizde günlük olarak taze üretilir, taşıma riski yoktur." },
  { icon: <Users size={32} strokeWidth={1.5} />, title: "Profesyonel Kadro", desc: "Deneyimli şef, aşçı ve servis personeli ekibimiz tesislerinize gelir." },
  { icon: <ClipboardList size={32} strokeWidth={1.5} />, title: "Özel Menü Planlaması", desc: "Diyetisyen desteğiyle çalışan profilinize uygun menüler hazırlanır." },
  { icon: <Wallet size={32} strokeWidth={1.5} />, title: "Maliyet Kontrolü", desc: "Mutfak yönetimi ve tedarik optimizasyonuyla bütçenizi verimli kullanırsınız." },
];

export default function YerindeUretimPage() {
  return (
    <ScrollReveal>
      <section style={{
        position: "relative",
        padding: "calc(var(--nav-height) + var(--space-4xl)) 0 var(--space-4xl)",
        background: "var(--color-dark)",
      }}>
        <div className="container">
          <div className="reveal">
            <span style={{ color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.2em" }}>Yerinde Üretim</span>
            <h1 style={{ fontSize: "var(--text-5xl)", color: "#fff", marginTop: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
              Tesislerinizde Taze Yemek Üretimi
            </h1>
            <p style={{ fontSize: "var(--text-lg)", color: "rgba(255,255,255,0.6)", maxWidth: 640 }}>
              Uzman kadromuz tesislerinize gelerek, taze ve kaliteli
              malzemelerle günlük yemek üretimi gerçekleştirir.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="reveal">
            <SectionHeading tagline="Avantajlar" title="Yerinde Üretimin Ayrıcalıkları" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-xl)" }}>
            {BENEFITS.map((b, i) => (
              <div key={i} className="reveal" style={{
                transitionDelay: `${i * 100}ms`,
                padding: "var(--space-2xl)",
                background: "var(--color-surface)",
                borderRadius: "var(--border-radius-lg)",
                border: "1px solid var(--border-color)",
                textAlign: "left",
              }}>
                <div style={{ color: "var(--color-primary)", marginBottom: "var(--space-md)" }}>{b.icon}</div>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 500, marginBottom: "var(--space-sm)" }}>{b.title}</h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>{b.desc}</p>
              </div>
            ))}
          </div>
          <div className="reveal" style={{ textAlign: "center", marginTop: "var(--space-3xl)" }}>
            <Button variant="primary" size="lg" href="/iletisim">Yerinde Üretim Teklifi Alın</Button>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
