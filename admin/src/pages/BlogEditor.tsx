import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { TipTapEditor } from '../components/Editor/TipTapEditor';
import { ImagePicker } from '../components/UI/ImagePicker';
import api from '../services/api';

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  categoryId: number | null;
  readTime: string;
  isPublished: boolean;
  metaTitle: string;
  metaDescription: string;
}

const DEFAULT_FORM: BlogFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImageUrl: '',
  categoryId: null,
  readTime: '5 dk',
  isPublished: false,
  metaTitle: '',
  metaDescription: '',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseLegacyContent(text: string) {
  if (!text) return '';
  if (text.includes('<p>') || text.includes('<h3>')) return text; // Zaten HTML

  let html = text
    .replace(/###\s+(.*)/g, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .split('\n\n')
    .map(p => {
      if (p.startsWith('<h3>')) return p;
      if (p.match(/^\d+\.\s/)) {
        const items = p.split('\n').map(i => `<li>${i.replace(/^\d+\.\s*/, '')}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      return `<p>${p}</p>`;
    })
    .join('');
  return html;
}

export function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined && id !== 'new';
  const [form, setForm] = useState<BlogFormData>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);
  const [isLoading, setIsLoading] = useState(isEdit);

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data } = await api.get<BlogCategory[]>('/api/blog/categories');
      return data;
    },
  });

  // Fetch existing post for edit
  useEffect(() => {
    if (isEdit) {
      api.get(`/api/blog/edit/${id}`).then(res => {
        const p = res.data;
        setForm({
          title: p.title || '',
          slug: p.slug || '',
          excerpt: p.excerpt || '',
          content: parseLegacyContent(p.content || ''),
          featuredImageUrl: p.featuredImageUrl || '',
          categoryId: p.categoryId,
          readTime: p.readTime || '5 dk',
          isPublished: p.isPublished,
          metaTitle: p.metaTitle || '',
          metaDescription: p.metaDescription || '',
        });
        setAutoSlug(false);
      }).catch(() => {
        toast.error('Yazı yüklenemedi');
        navigate('/blog');
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [id, isEdit, navigate]);

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: autoSlug ? slugify(title) : prev.slug,
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Başlık zorunludur');
      return;
    }
    if (!form.content.trim() || form.content === '<p></p>') {
      toast.error('İçerik zorunludur');
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/api/blog/${id}`, form);
        toast.success('Yazı güncellendi');
      } else {
        await api.post('/api/blog', form);
        toast.success('Yazı oluşturuldu');
      }
      navigate('/blog');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Kaydetme hatası';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="fade-in"><div className="empty-state">Yazı yükleniyor...</div></div>;
  }

  return (
    <div className="fade-in">
      {/* ─── Header ─── */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/blog')}
            style={{ padding: '8px 12px' }}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="page-title" style={{ margin: 0 }}>
            {isEdit ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setForm(prev => ({ ...prev, isPublished: !prev.isPublished }))}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {form.isPublished ? <><Eye size={16} /> Yayında</> : <><EyeOff size={16} /> Taslak</>}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Save size={16} />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        {/* ─── Left: Editor ─── */}
        <div>
          {/* Title */}
          <div className="card" style={{ marginBottom: '16px', padding: '16px 20px' }}>
            <input
              type="text"
              value={form.title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Yazı Başlığı"
              style={{
                width: '100%', border: 'none', outline: 'none',
                fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)',
                background: 'transparent',
              }}
            />
          </div>

          {/* Rich Text Editor */}
          <TipTapEditor
            content={form.content}
            onChange={(html) => setForm(prev => ({ ...prev, content: html }))}
            placeholder="Blog yazınızı buraya yazın..."
          />
        </div>

        {/* ─── Right: Sidebar ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Slug & Category */}
          <div className="card">
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Yayın Bilgileri</h3>

            <div className="form-group">
              <label className="form-label">URL Slug</label>
              <input
                type="text"
                className="form-input"
                value={form.slug}
                onChange={e => { setAutoSlug(false); setForm(prev => ({ ...prev, slug: e.target.value })); }}
                placeholder="yazi-basligi"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select
                className="form-input"
                value={form.categoryId ?? ''}
                onChange={e => setForm(prev => ({ ...prev, categoryId: e.target.value ? Number(e.target.value) : null }))}
              >
                <option value="">Kategori Seçin</option>
                {categories?.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Okuma Süresi</label>
              <input
                type="text"
                className="form-input"
                value={form.readTime}
                onChange={e => setForm(prev => ({ ...prev, readTime: e.target.value }))}
                placeholder="5 dk"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="card">
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Özet</h3>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <textarea
                className="form-input"
                value={form.excerpt}
                onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Yazının kısa özeti (SEO için önemli)..."
                rows={3}
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="card">
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Öne Çıkan Görsel</h3>
            <ImagePicker 
              label="" 
              value={form.featuredImageUrl} 
              onChange={(url) => setForm(prev => ({ ...prev, featuredImageUrl: url }))} 
            />
          </div>

          {/* SEO Meta */}
          <div className="card">
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEO</h3>
            <div className="form-group">
              <label className="form-label">Meta Başlık</label>
              <input
                type="text"
                className="form-input"
                value={form.metaTitle}
                onChange={e => setForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                placeholder="Sayfa başlığı (Google'da görünecek)"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Meta Açıklama</label>
              <textarea
                className="form-input"
                value={form.metaDescription}
                onChange={e => setForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                placeholder="Kısa sayfa açıklaması (max 160 karakter)"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
