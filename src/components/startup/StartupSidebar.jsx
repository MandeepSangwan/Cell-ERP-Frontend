import { LayoutDashboard, CalendarClock, Users, History, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { TIMESLOTS } from '../../utils/constants';

export const StartupSidebar = ({ currentTab, setCurrentTab }) => {
  const { startups, selectedStartup, currentUser, logout } = useAppContext();
  const startup = startups.find(s => s.id === selectedStartup);
  const slot = startup?.selectedTimeslot ? TIMESLOTS[startup.selectedTimeslot] : null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mark-attendance', label: 'Mark Attendance', icon: CalendarClock },
    { id: 'team', label: 'My Team', icon: Users },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon" style={{ background: 'var(--success)' }}><LayoutDashboard size={20} /></div>
        <span>Cell ERP</span>
      </div>

      {startup && (
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Startup</div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.25rem' }}>{startup.name}</div>
          {slot && (
            <div className="badge badge-success" style={{ marginTop: '0.5rem', fontSize: '0.6875rem' }}>
              {slot.label}: {slot.time}
            </div>
          )}
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
