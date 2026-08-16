import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import api from '../services/api';
import { ImagePicker } from '../components/UI/ImagePicker';

const DEFAULT_SETTINGS = {
  heroTagline: 'Kurumsal Gastronomi',
  heroTitle: 'Geleneksel Lezzetleri, Son Teknoloji ile Üretiyoruz.',
  heroDescription: 'Hijyen ve kaliteden ödün vermeden hayatınıza sağlıklı lezzet katıyoruz. Gıda sektöründe ozon yöntemi kullanan ender firmalardan biriyiz.',
  heroBackgroundImage: 'https://fuzyonyemek-web-902651818824.europe-west3.run.app/images/slide-1.png',
  contactEmail: 'info@fuzyonyemek.com',
  contactPhone: '0212 853 03 92',
  contactAddress: 'Güzelyurt Mah. Mehmet Akif Ersoy Cad. No: 8 Zemin Kat, Esenyurt / Beylikdüzü — İstanbul'
};

export function Settings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Record<string, string>>(DEFAULT_SETTINGS);

  const { isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data } = await api.get('/api/site-settings');
      if (Object.keys(data).length > 0) {
        setFormData(prev => {
          const merged = { ...prev, ...data };
          if (!merged.heroBackgroundImage) {
            merged.heroBackgroundImage = 'https://fuzyonyemek-web-902651818824.europe-west3.run.app/images/slide-1.png';
          }
          return merged;
        });
      }
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (settings: Record<string, string>) => {
      await api.post('/api/site-settings', settings);
    },
    onSuccess: () => {
      toast.success('Ayarlar başarıyla kaydedildi.');
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
    onError: () => toast.error('Ayarlar kaydedilirken hata oluştu.'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, heroBackgroundImage: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="fade-in"><div className="empty-state">Yükleniyor...</div></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Site Ayarları</h1>
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
        {/* HERO SETTINGS CARD */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            Ana Sayfa (Hero Bölümü)
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ImagePicker 
              label="Arka Plan Görseli" 
              value={formData.heroBackgroundImage || ''} 
              onChange={handleImageChange} 
            />

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Üst Slogan</label>
              <input 
                type="text" 
                name="heroTagline" 
                className="form-input" 
                value={formData.heroTagline || ''} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Ana Başlık</label>
              <input 
                type="text" 
                name="heroTitle" 
                className="form-input" 
                value={formData.heroTitle || ''} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Açıklama Metni</label>
              <textarea 
                name="heroDescription" 
                className="form-input" 
                rows={4} 
                value={formData.heroDescription || ''} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </div>

        {/* CONTACT SETTINGS CARD */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            İletişim Bilgileri
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">E-posta</label>
              <input 
                type="email" 
                name="contactEmail" 
                className="form-input" 
                value={formData.contactEmail || ''} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Telefon</label>
              <input 
                type="text" 
                name="contactPhone" 
                className="form-input" 
                value={formData.contactPhone || ''} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Adres</label>
              <textarea 
                name="contactAddress" 
                className="form-input" 
                rows={3} 
                value={formData.contactAddress || ''} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
