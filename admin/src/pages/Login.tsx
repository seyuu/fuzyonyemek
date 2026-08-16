import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Giriş başarılı!');
      navigate('/');
    } catch {
      toast.error('Geçersiz e-posta veya şifre.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff', padding: '48px', borderRadius: '16px', width: '100%', maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '48px' }}>🍽️</span>
          <h1 style={{ fontSize: '22px', fontWeight: 700, marginTop: '12px', color: '#1f2937' }}>Füzyon Yemek</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Yönetici Paneli Girişi</p>
        </div>

        <div className="form-group">
          <label className="form-label"><Mail size={14} style={{ marginRight: 6 }} />E-posta</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@fuzyonyemek.com" />
        </div>

        <div className="form-group">
          <label className="form-label"><Lock size={14} style={{ marginRight: 6 }} />Şifre</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '12px' }}>
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
}
