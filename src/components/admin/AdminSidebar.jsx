import { LayoutDashboard, Users, Rocket, FileDown, Shield, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const AdminSidebar = ({ currentTab, setCurrentTab }) => {
  const { logout } = useAppContext();

  const navItems = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'committees', label: 'Manage Committees', icon: Users },
    { id: 'startups', label: 'Manage Startups', icon: Rocket },
    { id: 'export', label: 'Export Data', icon: FileDown },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon" style={{ background: 'var(--warning)', color: 'var(--text-primary)' }}>
          <Shield size={20} />
        </div>
        <span>Cell ERP</span>
      </div>

      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>System</div>
        <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--warning-700)', marginTop: '0.25rem' }}>Administrator</div>
      </div>

      <div className="sidebar-label">Global Access</div>
      <nav className="nav-links">
        {navItems.map(item => (
          <button key={item.id} className={`nav-item ${currentTab === item.id ? 'active' : ''}`} onClick={() => setCurrentTab(item.id)}>
            <item.icon size={19} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={logout} style={{ color: 'var(--danger)' }}>
          <LogOut size={19} /> Exit Admin
        </button>
      </div>
    </aside>
  );
};
