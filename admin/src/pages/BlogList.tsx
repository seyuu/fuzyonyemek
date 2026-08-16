import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  isPublished: boolean;
  publishedAt: string;
  readTime: string;
}

export function BlogList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    setLoading(true);
    api.get('/api/blog?pageSize=100').then(res => {
      setPosts(res.data.data ?? []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/api/blog/${id}`);
      toast.success('Yazı silindi');
      fetchPosts();
    } catch (err: any) { 
      console.error("Silme hatası:", err.response || err);
      toast.error(err.response?.data?.message || 'Silme işlemi başarısız oldu (API Hatası)'); 
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Blog Yazıları</h1>
        <button className="btn btn-primary" onClick={() => navigate('/blog/new')}>
          <Plus size={16} /> Yeni Yazı
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="empty-state">Yükleniyor...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">Henüz blog yazısı yok.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Kategori</th>
                <th>Durum</th>
                <th>Okuma Süresi</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td><strong>{post.title}</strong><br/><span style={{ fontSize: 12, color: '#6b7280' }}>/{post.slug}</span></td>
                  <td>{post.category ?? '—'}</td>
                  <td>
                    <span className={`badge ${post.isPublished ? 'badge-success' : 'badge-warning'}`}>
                      {post.isPublished ? <><Eye size={12} /> Yayında</> : <><EyeOff size={12} /> Taslak</>}
                    </span>
                  </td>
                  <td>{post.readTime}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px' }}
                        onClick={() => navigate(`/blog/${post.id}`)}
                      >
                        <Pencil size={14} />
                      </button>
                      <button className="btn btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleDelete(post.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
