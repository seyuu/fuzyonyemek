import type { Metadata } from "next";
import { ScrollReveal } from "@/components/UI/ScrollReveal";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { Button } from "@/components/UI/Button";
import { Thermometer, Clock, ClipboardList, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Taşıma Yemek Hizmeti — İstanbul",
  description:
    "Esenyurt merkezli üretim tesisimizden İstanbul geneline thermobox ile sıcak yemek taşıma hizmeti. Fabrika, okul, hastane ve ofisler için hijyenik kurumsal yemek.",
  alternates: { canonical: "https://www.fuzyonyemek.com/hizmetlerimiz/tasima-yemek" },
};

const BENEFITS = [
  { icon: <Thermometer size={32} strokeWidth={1.5} />, title: "Isı Kontrollü Taşıma", desc: "Thermobox sistemli araçlarla yemekleriniz ideal sıcaklıkta ulaştırılır." },
  { icon: <Clock size={32} strokeWidth={1.5} />, title: "Zamanında Teslimat", desc: "Dakik lojistik planlamayla her gün aynı saatte sofralarınızda oluruz." },
  { icon: <ClipboardList size={32} strokeWidth={1.5} />, title: "Esnek Menü Seçenekleri", desc: "Diyet, vejetaryen ve özel menü talepleri karşılanır." },
  { icon: <ShieldCheck size={32} strokeWidth={1.5} />, title: "Ozon Sanitasyon", desc: "Tüm üretim ozon teknolojisiyle %99.9 hijyen standartlarında yapılır." },
];

export default function TasimaYemekPage() {
  return (
    <ScrollReveal>
      <section style={{
        position: "relative",
        padding: "calc(var(--nav-height) + var(--space-4xl)) 0 var(--space-4xl)",
        background: "var(--color-dark)",
      }}>
        <div className="container">
          <div className="reveal">
            <span style={{ color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.2em" }}>Taşıma Yemek</span>
            <h1 style={{ fontSize: "var(--text-5xl)", color: "#fff", marginTop: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
              Hijyenik Taşıma Yemek Hizmeti
            </h1>
            <p style={{ fontSize: "var(--text-lg)", color: "rgba(255,255,255,0.6)", maxWidth: 640 }}>
              Merkez mutfağımızda ozon teknolojisiyle hazırlanan yemeklerimiz,
              thermobox kaplarla ısı kontrolü altında İstanbul genelindeki
              tesislerinize taşınır.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="reveal">
            <SectionHeading
              tagline="Avantajlar"
              title="Taşıma Yemek Hizmetinin Ayrıcalıkları"
            />
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
            <Button variant="primary" size="lg" href="/iletisim">
              Taşıma Yemek Teklifi Alın
            </Button>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
