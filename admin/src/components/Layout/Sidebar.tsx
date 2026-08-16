import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, FileText, Briefcase, Image, Mail,
  Settings, Users, LogOut, ImagePlus, BarChart3
} from 'lucide-react';
import './Layout.css';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Panel' },
  { to: '/blog', icon: FileText, label: 'Blog' },
  { to: '/services', icon: Briefcase, label: 'Hizmetler' },
  { to: '/gallery', icon: Image, label: 'Galeri' },
  { to: '/media', icon: ImagePlus, label: 'Medya' },
  { to: '/contact', icon: Mail, label: 'İletişim' },
  { to: '/stats', icon: BarChart3, label: 'İstatistikler' },
  { to: '/about', icon: FileText, label: 'Hakkımızda' },
  { to: '/settings', icon: Settings, label: 'Site Ayarları' },
  { to: '/users', icon: Users, label: 'Kullanıcılar', adminOnly: true },
];

export function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">🍽️</span>
          <div>
            <h2>Füzyon Yemek</h2>
            <span className="sidebar-subtitle">Yönetici Paneli</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.filter(item => !item.adminOnly || isAdmin).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.fullName?.charAt(0) ?? 'A'}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.fullName}</span>
            <span className="sidebar-user-role">{user?.roles[0]}</span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={18} /> Çıkış
        </button>
      </div>
    </aside>
  );
}
