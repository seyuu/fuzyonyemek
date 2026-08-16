import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';
import { ImagePicker } from '../components/UI/ImagePicker';

const DEFAULT_SETTINGS = {
  aboutHeroTitle: 'Lezzet, Hijyen ve Güven',
  aboutHeroDesc: 'Geleneksel lezzetleri modern teknolojiyle buluşturarak İstanbul genelinde yüzlerce kurumsal müşteriye hizmet veriyoruz.',
  aboutStoryTitle: 'Adımız, Amaçlarımızdan Gelir',
  aboutStoryText: '"Füzyon" kelimesi, farklı kültürlerin lezzetlerini bir araya getirme felsefemizi yansıtır. Geleneksel Türk mutfağının zenginliğini, dünya mutfağının yenilikçi teknikleriyle harmanlayarak eşsiz bir gastronomi deneyimi sunmayı hedefliyoruz.\n\nEsenyurt\'taki modern üretim tesisimizde, son teknoloji ozon sanitasyon sistemi ve deneyimli şeflerimizle, her gün binlerce porsiyon hijyenik ve lezzetli yemek üretiyoruz.',
  aboutStoryImage: 'https://fuzyonyemek-web-902651818824.europe-west3.run.app/images/story-chef-fuzyon.png',
  aboutValuesJson: JSON.stringify([
    { icon: 'ShieldCheck', title: 'Kalite Odaklılık', desc: 'ISO 22000, HACCP ve TSE standartlarına tam uyumlu üretim süreçleri ile her porsiyonda aynı kaliteyi sunuyoruz.' },
    { icon: 'Handshake', title: 'Güvenilirlik', desc: '15 yılı aşkın sektör deneyimimizle, 500\'den fazla kurumsal müşterinin güvenini kazandık.' },
    { icon: 'Lightbulb', title: 'İnovasyon', desc: 'Ozon sanitasyon, akıllı depolama ve dijital takip sistemleriyle sektörde öncü rol üstleniyoruz.' },
    { icon: 'Leaf', title: 'Sürdürülebilirlik', desc: 'Çevre dostu üretim politikamızla atık azaltma, enerji verimliliği ve yerel tedarik zincirine odaklanıyoruz.' }
  ]),
  aboutCertsJson: JSON.stringify([
    'ISO 22000 Gıda Güvenliği Yönetim Sistemi',
    'HACCP Tehlike Analizi ve Kritik Kontrol Noktaları',
    'TSE Hizmet Yeri Yeterlilik Belgesi',
    'İşyeri Açma ve Çalışma Ruhsatı',
    'Kapasite Raporu'
  ])
};

export function AboutSettings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Record<string, string>>(DEFAULT_SETTINGS);
  
  const [valuesArray, setValuesArray] = useState<Array<{icon: string, title: string, desc: string}>>([]);
  const [certsArray, setCertsArray] = useState<string[]>([]);

  const { isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data } = await api.get('/api/site-settings');
      if (Object.keys(data).length > 0) {
        setFormData(prev => {
          const merged = { ...prev, ...data };
          if (!merged.aboutStoryImage) merged.aboutStoryImage = 'https://fuzyonyemek-web-902651818824.europe-west3.run.app/images/story-chef-fuzyon.png';
          return merged;
        });
        
        try {
          if (data.aboutValuesJson) setValuesArray(JSON.parse(data.aboutValuesJson));
          else setValuesArray(JSON.parse(DEFAULT_SETTINGS.aboutValuesJson));
        } catch { setValuesArray(JSON.parse(DEFAULT_SETTINGS.aboutValuesJson)); }
        
        try {
          if (data.aboutCertsJson) setCertsArray(JSON.parse(data.aboutCertsJson));
          else setCertsArray(JSON.parse(DEFAULT_SETTINGS.aboutCertsJson));
        } catch { setCertsArray(JSON.parse(DEFAULT_SETTINGS.aboutCertsJson)); }
      } else {
        setValuesArray(JSON.parse(DEFAULT_SETTINGS.aboutValuesJson));
        setCertsArray(JSON.parse(DEFAULT_SETTINGS.aboutCertsJson));
      }
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (settings: Record<string, string>) => {
      await api.post('/api/site-settings', settings);
    },
    onSuccess: () => {
      toast.success('Hakkımızda ayarları başarıyla kaydedildi.');
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
    onError: () => toast.error('Ayarlar kaydedilirken hata oluştu.'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, aboutStoryImage: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { 
      ...formData, 
      aboutValuesJson: JSON.stringify(valuesArray),
      aboutCertsJson: JSON.stringify(certsArray)
    };
    mutation.mutate(finalData);
  };

  // ─── Values Handlers ───
  const addValue = () => setValuesArray([...valuesArray, { icon: 'Star', title: '', desc: '' }]);
  const removeValue = (index: number) => setValuesArray(valuesArray.filter((_, i) => i !== index));
  const updateValue = (index: number, field: string, val: string) => {
    const newArr = [...valuesArray];
    newArr[index] = { ...newArr[index], [field]: val };
    setValuesArray(newArr);
  };

  // ─── Certs Handlers ───
  const addCert = () => setCertsArray([...certsArray, '']);
  const removeCert = (index: number) => setCertsArray(certsArray.filter((_, i) => i !== index));
  const updateCert = (index: number, val: string) => {
    const newArr = [...certsArray];
    newArr[index] = val;
    setCertsArray(newArr);
  };

  if (isLoading) return <div className="fade-in"><div className="empty-state">Yükleniyor...</div></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Hakkımızda Sayfası</h1>
        <button 
          onClick={handleSubmit} 
          className="btn btn-primary" 
          disabled={mutation.isPending}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={18} />
          {mutation.isPending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* HERO CARD */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            Hero Alanı (Üst Başlık)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Ana Başlık</label>
              <input type="text" name="aboutHeroTitle" className="form-input" value={formData.aboutHeroTitle || ''} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Açıklama Metni</label>
              <textarea name="aboutHeroDesc" className="form-input" rows={3} value={formData.aboutHeroDesc || ''} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* STORY CARD */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            Hikayemiz
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Başlık</label>
              <input type="text" name="aboutStoryTitle" className="form-input" value={formData.aboutStoryTitle || ''} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Metin (Paragraflar için Enter kullanın)</label>
              <textarea name="aboutStoryText" className="form-input" rows={6} value={formData.aboutStoryText || ''} onChange={handleChange} />
            </div>
            <ImagePicker label="Hikaye Görseli" value={formData.aboutStoryImage || ''} onChange={handleImageChange} />
          </div>
        </div>

        {/* VALUES CARD */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Değerlerimiz
            </h3>
            <button className="btn btn-secondary" onClick={addValue} style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Plus size={14} /> Değer Ekle
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Küçük Üst Başlık (Tagline)</label>
              <input type="text" name="aboutValuesTagline" className="form-input" placeholder="Örn: Değerlerimiz" value={formData.aboutValuesTagline || ''} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Ana Başlık (Title)</label>
              <input type="text" name="aboutValuesTitle" className="form-input" placeholder="Örn: İlkelerimizle Fark Yaratıyoruz" value={formData.aboutValuesTitle || ''} onChange={handleChange} />
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {valuesArray.map((val, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 2fr auto', gap: '12px', alignItems: 'start', background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px' }}>İkon (Lucide)</label>
                  <input type="text" className="form-input" value={val.icon} onChange={e => updateValue(idx, 'icon', e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px' }}>Başlık</label>
                  <input type="text" className="form-input" value={val.title} onChange={e => updateValue(idx, 'title', e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px' }}>Açıklama</label>
                  <textarea className="form-input" rows={2} value={val.desc} onChange={e => updateValue(idx, 'desc', e.target.value)} />
                </div>
                <button className="btn btn-danger" onClick={() => removeValue(idx)} style={{ padding: '8px', marginTop: '24px' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {valuesArray.length === 0 && <div className="empty-state">Henüz değer eklenmemiş.</div>}
          </div>
        </div>

        {/* CERTS CARD */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Belgelerimiz
            </h3>
            <button className="btn btn-secondary" onClick={addCert} style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Plus size={14} /> Belge Ekle
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Küçük Üst Başlık (Tagline)</label>
              <input type="text" name="aboutCertsTagline" className="form-input" placeholder="Örn: Belgelerimiz" value={formData.aboutCertsTagline || ''} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Ana Başlık (Title)</label>
              <input type="text" name="aboutCertsTitle" className="form-input" placeholder="Örn: Uluslararası Standartlarda Hizmet" value={formData.aboutCertsTitle || ''} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Alt Açıklama (Subtitle)</label>
              <input type="text" name="aboutCertsSubtitle" className="form-input" placeholder="Örn: Kalite ve güvenilirliğimizi kanıtlıyoruz." value={formData.aboutCertsSubtitle || ''} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {certsArray.map((cert, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                <input type="text" className="form-input" value={cert} onChange={e => updateCert(idx, e.target.value)} placeholder="Belge Adı" />
                <button className="btn btn-danger" onClick={() => removeCert(idx)} style={{ padding: '8px 12px' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {certsArray.length === 0 && <div className="empty-state">Henüz belge eklenmemiş.</div>}
          </div>
        </div>

      </div>
    </div>
  );
}
