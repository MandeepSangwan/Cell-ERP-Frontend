import { useState } from 'react';
import { LayoutDashboard, CalendarClock, Users, UserPlus, Shield, Settings, ChevronLeft, Menu } from 'lucide-react';

export const Sidebar = ({ currentTab, setCurrentTab }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance', icon: CalendarClock },
    { id: 'committees', label: 'Committees', icon: Users },
    { id: 'create-committee', label: 'New Committee', icon: UserPlus },
    { id: 'timeslots', label: 'Time Slots', icon: CalendarClock },
    { id: 'admin', label: 'Admin Panel', icon: Shield },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="brand">
        <div className="brand-icon">
          <LayoutDashboard size={20} />
        </div>
        {!collapsed && <span>Cell ERP</span>}
      </div>

      <div className="sidebar-label">
        {!collapsed ? 'Navigation' : ''}
      </div>

      <nav className="nav-links">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
            onClick={() => setCurrentTab(item.id)}
            title={item.label}
          >
            <item.icon size={19} />
            {!collapsed && item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" style={{ color: 'var(--text-tertiary)' }}>
          <Settings size={19} />
          {!collapsed && 'Settings'}
        </button>
      </div>
    </aside>
  );
};
