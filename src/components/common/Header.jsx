import { Bell, Search, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const Header = ({ title }) => {
  const { currentUser, logout, portal } = useAppContext();

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';

  const portalLabel = portal === 'committee' ? 'Committee Portal' : portal === 'startup' ? 'Startup Portal' : 'Admin Console';

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="header-title">{title || portalLabel}</div>
        <span className={`badge badge-${portal === 'committee' ? 'info' : portal === 'startup' ? 'success' : 'warning'}`} style={{ fontSize: '0.6875rem' }}>
          {portalLabel}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button className="btn-icon" title="Notifications">
          <Bell size={18} />
        </button>

        {currentUser && (
          <div className="user-profile">
            <div className="avatar">{getInitials(currentUser.name)}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{currentUser.name}</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>{currentUser.rollNumber}</span>
            </div>
          </div>
        )}

        <button className="btn-icon" onClick={logout} title="Log Out" style={{ color: 'var(--danger)' }}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
