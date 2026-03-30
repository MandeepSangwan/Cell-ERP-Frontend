import { LayoutDashboard, CalendarClock, Users, History, Settings, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const CommitteeSidebar = ({ currentTab, setCurrentTab }) => {
  const { committees, selectedCommittee, currentUser, logout } = useAppContext();
  const committee = committees.find(c => c.id === selectedCommittee);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mark-attendance', label: 'Mark Attendance', icon: CalendarClock },
    { id: 'team', label: 'My Team', icon: Users },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon"><LayoutDashboard size={20} /></div>
        <span>Cell ERP</span>
      </div>

      {committee && (
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Committee</div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--blue-700)', marginTop: '0.25rem' }}>{committee.name}</div>
        </div>
      )}

      <div className="sidebar-label">Navigation</div>
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
          <LogOut size={19} /> Switch Portal
        </button>
      </div>
    </aside>
  );
};
