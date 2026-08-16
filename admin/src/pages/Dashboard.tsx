import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Briefcase, Image, Mail, TrendingUp } from 'lucide-react';
import api from '../services/api';

interface DashboardStats {
  blogPosts: number;
  services: number;
  gallery: number;
  unreadContacts: number;
}

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ blogPosts: 0, services: 0, gallery: 0, unreadContacts: 0 });

  useEffect(() => {
    Promise.allSettled([
      api.get('/api/blog?pageSize=1'),
      api.get('/api/services'),
      api.get('/api/gallery?ps=1'),
      api.get('/api/contact?pageSize=1'),
    ]).then(([blog, services, gallery, contact]) => {
      setStats({
        blogPosts: blog.status === 'fulfilled' ? blog.value.data?.total ?? 0 : 0,
        services: services.status === 'fulfilled' ? services.value.data?.length ?? 0 : 0,
        gallery: gallery.status === 'fulfilled' ? gallery.value.data?.total ?? 0 : 0,
        unreadContacts: contact.status === 'fulfilled' ? contact.value.data?.unreadCount ?? 0 : 0,
      });
    });
  }, []);

  const cards = [
    { label: 'Blog Yazıları', value: stats.blogPosts, icon: FileText, color: '#3b82f6' },
    { label: 'Hizmetler', value: stats.services, icon: Briefcase, color: '#10b981' },
    { label: 'Galeri Görselleri', value: stats.gallery, icon: Image, color: '#f59e0b' },
    { label: 'Okunmamış İletişim', value: stats.unreadContacts, icon: Mail, color: '#ef4444' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Hoş Geldiniz, {user?.fullName} 👋</h1>
      </div>

      <div className="card-grid">
        {cards.map(card => (
          <div key={card.label} className="card stat-card">
            <div className="stat-icon" style={{ background: `${card.color}15`, color: card.color }}>
              <card.icon size={24} />
            </div>
            <div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} /> Hızlı İşlemler
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/blog" className="btn btn-primary">+ Yeni Blog Yazısı</a>
          <a href="/gallery" className="btn btn-secondary">📷 Galeri Yönetimi</a>
          <a href="/contact" className="btn btn-secondary">📬 İletişim Kutusu</a>
          <a href="/stats" className="btn btn-secondary">📊 İstatistikler</a>
        </div>
      </div>
    </div>
  );
}
