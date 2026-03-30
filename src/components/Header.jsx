import { Bell, Search } from 'lucide-react';

export const Header = ({ title }) => {
  return (
    <header className="top-header">
      <div className="header-title">{title || 'Cell ERP'}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="search-bar" style={{ width: '240px' }}>
          <Search size={16} />
          <input type="text" placeholder="Search..." />
        </div>
        
        <button className="btn-icon" title="Notifications">
          <Bell size={20} />
        </button>

        <div className="user-profile">
          <div className="avatar">AD</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Admin</span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>E-Cell Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
};
