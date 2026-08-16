import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

interface MediaAsset {
  id: number;
  secureUrl: string;
}

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImagePicker({ value, onChange, label = 'Görsel Seç' }: ImagePickerProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch gallery images to pick from
  const { data: gallery } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data } = await api.get('/api/gallery?ps=100');
      return data.data as any[];
    },
    enabled: isOpen
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Upload to Cloudinary
      const mediaRes = await api.post<MediaAsset>('/api/media/upload?folder=site_assets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Add to Gallery automatically
      await api.post('/api/gallery', {
        mediaAssetId: mediaRes.data.id,
        isVisible: true,
        sortOrder: 0
      });

      onChange(mediaRes.data.secureUrl);
      toast.success('Görsel başarıyla yüklendi');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Görsel yüklenirken hata oluştu. Cloudinary API ayarlarınızı kontrol edin.');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      {label && <label className="form-label">{label}</label>}
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        {value ? (
          <div style={{ position: 'relative', width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src={value} alt="Seçilen" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button 
              type="button"
              onClick={() => onChange('')}
              style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div style={{ width: '150px', height: '100px', borderRadius: '8px', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', background: '#f9fafb' }}>
            <ImageIcon size={32} opacity={0.5} />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              disabled={uploading}
            />
            <button type="button" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} disabled={uploading}>
              <Upload size={16} /> {uploading ? 'Yükleniyor...' : 'Yeni Yükle'}
            </button>
          </div>
          
          <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(!isOpen)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ImageIcon size={16} /> Galeriden Seç
          </button>
        </div>
      </div>

      {isOpen && (
        <div style={{ marginTop: '16px', padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Galeriden Seç</h4>
            <button type="button" onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
            {gallery?.map(img => (
              <div 
                key={img.id} 
                onClick={() => { onChange(img.mediaAsset?.secureUrl); setIsOpen(false); }}
                style={{ aspectRatio: '1/1', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', border: value === img.mediaAsset?.secureUrl ? '2px solid var(--accent)' : '1px solid #eee' }}
              >
                <img src={img.mediaAsset?.secureUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
            {gallery?.length === 0 && <div style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: '13px', color: '#666' }}>Galeri boş.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
