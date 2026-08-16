import type { Metadata } from "next";
import { ScrollReveal } from "@/components/UI/ScrollReveal";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { Button } from "@/components/UI/Button";
import { Gem, Crown, Coffee, Maximize } from "lucide-react";

export const metadata: Metadata = {
  title: "Outside Catering Hizmeti — İstanbul",
  description:
    "Açılış, seminer, toplantı, düğün ve özel etkinlikleriniz için A'dan Z'ye profesyonel catering hizmeti. İstanbul genelinde premium organizasyon.",
  alternates: { canonical: "https://www.fuzyonyemek.com/hizmetlerimiz/catering" },
};

const BENEFITS = [
  { icon: <Gem size={32} strokeWidth={1.5} />, title: "Anahtar Teslim", desc: "Menü planlamadan servis yönetimine kadar tüm süreç uzman ekibimiz tarafından yürütülür." },
  { icon: <Crown size={32} strokeWidth={1.5} />, title: "Premium Sunum", desc: "Etkinliğinizin konseptine uygun profesyonel sunum ve masaüstü düzenlemesi." },
  { icon: <Coffee size={32} strokeWidth={1.5} />, title: "Profesyonel Servis", desc: "Eğitimli garson kadromuzla kusursuz ve zamanında servis garantisi." },
  { icon: <Maximize size={32} strokeWidth={1.5} />, title: "Esnek Kapasite", desc: "10 kişilik toplantıdan 5.000 kişilik organizasyona kadar her ölçekte hizmet." },
];

export default function CateringPage() {
  return (
    <ScrollReveal>
      <section style={{
        position: "relative",
        padding: "calc(var(--nav-height) + var(--space-4xl)) 0 var(--space-4xl)",
        background: "var(--color-dark)",
      }}>
        <div className="container">
          <div className="reveal">
            <span style={{ color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.2em" }}>Outside Catering</span>
            <h1 style={{ fontSize: "var(--text-5xl)", color: "#fff", marginTop: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
              Premium Catering Deneyimi
            </h1>
            <p style={{ fontSize: "var(--text-lg)", color: "rgba(255,255,255,0.6)", maxWidth: 640 }}>
              Siz sevdiklerinizle ve konuklarınızla ilgilenirken,
              bırakın uzman ekiplerimiz servisinizi yapsın.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="reveal">
            <SectionHeading tagline="Avantajlar" title="Catering Hizmetinin Ayrıcalıkları" />
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
            <Button variant="primary" size="lg" href="/iletisim">Catering Teklifi Alın</Button>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
