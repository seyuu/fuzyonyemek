import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Save, BarChart3 } from 'lucide-react';

interface Stat { id: number; number: string; label: string; sortOrder: number; isVisible: boolean; }

export function StatsManager() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/stats').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  const handleChange = (id: number, field: keyof Stat, value: string | boolean) => {
    setStats(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    try {
      await api.put('/api/stats', stats);
      toast.success('İstatistikler güncellendi');
    } catch { toast.error('Güncelleme hatası'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><BarChart3 size={24} /> İstatistik Yönetimi</h1>
        <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Kaydet</button>
      </div>
      <div className="card">
        {loading ? <div className="empty-state">Yükleniyor...</div> : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {stats.map(s => (
              <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 80px', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <input className="form-input" value={s.number} onChange={e => handleChange(s.id, 'number', e.target.value)} placeholder="Sayı" />
                <input className="form-input" value={s.label} onChange={e => handleChange(s.id, 'label', e.target.value)} placeholder="Etiket" />
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  <input type="checkbox" checked={s.isVisible} onChange={e => handleChange(s.id, 'isVisible', e.target.checked)} /> Görünür
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
