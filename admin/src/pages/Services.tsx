import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { ImagePicker } from '../components/UI/ImagePicker';
import api from '../services/api';

interface Service {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  iconName: string;
  backgroundImageUrl?: string;
  isPublished: boolean;
  sortOrder: number;
}

export function Services() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({});

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await api.get<Service[]>('/api/services');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (service: Partial<Service>) => {
      await api.post('/api/services', service);
    },
    onSuccess: () => {
      toast.success('Hizmet eklendi');
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setEditingId(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (service: Partial<Service>) => {
      await api.put(`/api/services/${service.id}`, service);
    },
    onSuccess: () => {
      toast.success('Hizmet güncellendi');
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/services/${id}`);
    },
    onSuccess: () => {
      toast.success('Hizmet silindi');
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: () => {
      toast.error('Silme işlemi başarısız oldu');
    }
  });

  const handleEdit = (service: Service) => {
    const data = { ...service };
    if (!data.backgroundImageUrl) {
      if (data.slug === 'tasima-yemek') data.backgroundImageUrl = 'https://fuzyonyemek-web-902651818824.europe-west3.run.app/images/services/tasima_yemek_bg.png';
      else if (data.slug === 'yerinde-uretim') data.backgroundImageUrl = 'https://fuzyonyemek-web-902651818824.europe-west3.run.app/images/services/yerinde_uretim_bg.png';
      else if (data.slug === 'catering') data.backgroundImageUrl = 'https://fuzyonyemek-web-902651818824.europe-west3.run.app/images/services/outside_catering_bg.png';
    }
    setFormData(data);
    setEditingId(service.id);
  };

  const handleSave = () => {
    if (!formData.title) {
      toast.error('Başlık zorunludur');
      return;
    }
    if (editingId === 0) {
      createMutation.mutate({ ...formData, isPublished: true, sortOrder: 0 });
    } else {
      updateMutation.mutate(formData);
    }
  };

  if (isLoading) return <div className="fade-in"><div className="empty-state">Yükleniyor...</div></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Hizmet Yönetimi</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => { setEditingId(0); setFormData({ title: '', slug: '', shortDescription: '', iconName: '', backgroundImageUrl: '' }); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Yeni Hizmet
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        
        {editingId === 0 && (
          <div className="card" style={{ border: '2px solid var(--accent)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--accent)' }}>Yeni Hizmet Ekle</h3>
            <div className="form-group">
              <label className="form-label">Başlık</label>
              <input type="text" className="form-input" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Açıklama</label>
              <textarea className="form-input" rows={3} value={formData.shortDescription || ''} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">İkon (Lucide adı)</label>
              <input type="text" className="form-input" value={formData.iconName || ''} onChange={e => setFormData({ ...formData, iconName: e.target.value })} placeholder="örn: Truck" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Arka Plan Resmi</label>
              <ImagePicker label="" value={formData.backgroundImageUrl || ''} onChange={(url) => setFormData({ ...formData, backgroundImageUrl: url })} />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <button className="btn btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '6px' }} onClick={handleSave}><Check size={16} /> Kaydet</button>
              <button className="btn btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '6px' }} onClick={() => setEditingId(null)}><X size={16} /> İptal</button>
            </div>
          </div>
        )}

        {services?.map((service) => (
          editingId === service.id ? (
            <div key={service.id} className="card" style={{ border: '2px solid var(--text-primary)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Hizmeti Düzenle</h3>
              <div className="form-group">
                <label className="form-label">Başlık</label>
                <input type="text" className="form-input" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Açıklama</label>
                <textarea className="form-input" rows={3} value={formData.shortDescription || ''} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">İkon (Lucide adı)</label>
                <input type="text" className="form-input" value={formData.iconName || ''} onChange={e => setFormData({ ...formData, iconName: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Arka Plan Resmi</label>
                <ImagePicker label="" value={formData.backgroundImageUrl || ''} onChange={(url) => setFormData({ ...formData, backgroundImageUrl: url })} />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <button className="btn btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '6px' }} onClick={handleSave}><Check size={16} /> Güncelle</button>
                <button className="btn btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '6px' }} onClick={() => setEditingId(null)}><X size={16} /> İptal</button>
              </div>
            </div>

          ) : (
            <div key={service.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{service.title}</h3>
                  <span style={{ fontSize: '12px', padding: '4px 8px', background: '#f3f4f6', borderRadius: '4px', color: '#6b7280', fontFamily: 'monospace' }}>
                    {service.iconName || '—'}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
                  {service.shortDescription}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <button className="btn btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '6px' }} onClick={() => handleEdit(service)}>
                  <Edit2 size={16} /> Düzenle
                </button>
                <button className="btn btn-danger" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '40px' }} onClick={() => {
                  if (confirm('Silmek istediğinize emin misiniz?')) {
                    deleteMutation.mutate(service.id);
                  }
                }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        ))}
        
        {services?.length === 0 && editingId !== 0 && (
          <div style={{ gridColumn: '1 / -1' }} className="empty-state">
            Henüz hizmet eklenmemiş. Yeni bir tane oluşturarak başlayın.
          </div>
        )}
      </div>
    </div>
  );
}
