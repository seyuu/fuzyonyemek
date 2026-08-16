import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Upload, Trash2 } from 'lucide-react';
import api from '../services/api';

interface MediaAsset {
  id: number;
  secureUrl: string;
}

interface GalleryImage {
  id: number;
  title: string | null;
  altText: string | null;
  mediaAssetId: number;
  mediaAsset: MediaAsset;
}

export function Gallery() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: gallery, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data } = await api.get('/api/gallery?ps=100');
      return data.data as GalleryImage[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/gallery/${id}`);
    },
    onSuccess: () => {
      toast.success('Görsel galeriden silindi');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload to Cloudinary
      const mediaRes = await api.post<MediaAsset>('/api/media/upload?folder=galeri', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 2. Add to Gallery
      await api.post('/api/gallery', {
        mediaAssetId: mediaRes.data.id,
        isVisible: true,
        sortOrder: 0
      });

      toast.success('Görsel başarıyla eklendi');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    } catch (error) {
      toast.error('Görsel yüklenirken hata oluştu');
    } finally {
      setUploading(false);
      // reset file input
      if (e.target) e.target.value = '';
    }
  };

  if (isLoading) return <div>Yükleniyor...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Galeri Yönetimi</h1>
        <div style={{ position: 'relative' }}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            disabled={uploading}
          />
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} disabled={uploading}>
            <Upload size={18} />
            {uploading ? 'Yükleniyor...' : 'Yeni Görsel Yükle'}
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {gallery?.map((img) => (
            <div key={img.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', aspectRatio: '1/1' }}>
              <img 
                src={img.mediaAsset?.secureUrl || ''} 
                alt="Galeri" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <button 
                onClick={() => {
                  if (window.confirm('Bu görseli silmek istediğinize emin misiniz?')) {
                    deleteMutation.mutate(img.id);
                  }
                }}
                style={{ 
                  position: 'absolute', top: '10px', right: '10px', 
                  background: 'rgba(255,0,0,0.8)', color: 'white', 
                  border: 'none', borderRadius: '50%', width: '30px', height: '30px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {gallery?.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
              Galeride henüz görsel bulunmuyor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
