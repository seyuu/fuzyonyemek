import { useEffect, useState } from 'react';
import api from '../services/api';
import { Mail, Trash2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Contact {
  id: number; name: string; company: string; email: string; phone: string;
  serviceType: string; personCount: string; message: string;
  isRead: boolean; submittedAt: string;
}

export function ContactList() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    api.get('/api/contact?pageSize=100').then(r => setItems(r.data.data ?? [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const markRead = async (id: number) => {
    await api.put(`/api/contact/${id}/read`);
    toast.success('Okundu olarak işaretlendi');
    fetch();
  };

  const remove = async (id: number) => {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/api/contact/${id}`);
      toast.success('Silindi');
      fetch();
    } catch (err: any) {
      console.error("Silme hatası:", err.response || err);
      toast.error('Silme işlemi başarısız oldu');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><Mail size={24} /> İletişim Gönderimleri</h1>
      </div>
      <div className="card">
        {loading ? <div className="empty-state">Yükleniyor...</div> : items.length === 0 ? (
          <div className="empty-state">Henüz iletişim formu gönderimi yok.</div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Ad</th><th>Şirket</th><th>E-posta</th><th>Hizmet</th><th>Tarih</th><th>Durum</th><th>İşlem</th></tr></thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id} style={{ background: c.isRead ? undefined : '#fef3c7' }}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.company ?? '—'}</td>
                  <td>{c.email}</td>
                  <td>{c.serviceType ?? '—'}</td>
                  <td style={{ fontSize: 12 }}>{new Date(c.submittedAt).toLocaleDateString('tr-TR')}</td>
                  <td><span className={`badge ${c.isRead ? 'badge-success' : 'badge-warning'}`}>{c.isRead ? 'Okundu' : 'Yeni'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {!c.isRead && <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => markRead(c.id)}><CheckCircle size={14} /></button>}
                      <button className="btn btn-danger" style={{ padding: '4px 8px' }} onClick={() => remove(c.id)}><Trash2 size={14} /></button>
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
