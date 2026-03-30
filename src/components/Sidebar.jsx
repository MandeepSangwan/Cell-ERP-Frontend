import { LayoutDashboard, CalendarClock, Settings } from 'lucide-react';

export const Sidebar = ({ currentTab, setCurrentTab }) => {
  return (
    <div className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <LayoutDashboard size={24} />
        </div>
        Cell ERP
      </div>
      
      <div className="nav-links" style={{ marginTop: '2rem' }}>
        <button 
          className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </button>
        <button 
          className={`nav-item ${currentTab === 'timeslots' ? 'active' : ''}`}
          onClick={() => setCurrentTab('timeslots')}
        >
          <CalendarClock size={20} />
          Time Slots
        </button>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: 'var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
        <button className="nav-item" style={{ color: 'var(--text-muted)' }}>
          <Settings size={20} />
          Settings
        </button>
      </div>
    </div>
  );
};
