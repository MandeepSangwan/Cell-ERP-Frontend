import { useState } from 'react';
import { Users, Rocket, Shield, ChevronRight, LayoutDashboard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const PortalSelector = () => {
  const { committees, startups, members, loginAsCommitteeHead, loginAsStartup, loginAsAdmin } = useAppContext();
  const [step, setStep] = useState('select'); // 'select' | 'committee' | 'startup'
  const [selectedStartupId, setSelectedStartupId] = useState(null);

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  if (step === 'committee') {
    return (
      <div className="portal-page">
        <div className="portal-dialog animate-scale-in">
          <button className="portal-back" onClick={() => setStep('select')}>← Back</button>
          <div className="portal-dialog-icon" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)' }}>
            <Users size={28} />
          </div>
          <h2>Select Your Committee</h2>
          <p>Choose the committee you head to start marking attendance.</p>
          <div className="portal-list">
            {committees.map(c => {
              const head = members.find(m => m.id === c.headId);
              return (
                <button key={c.id} className="portal-list-item" onClick={() => loginAsCommitteeHead(c.id)}>
                  <div>
                    <div className="portal-list-name">{c.name}</div>
                    <div className="portal-list-sub">Head: {head?.name || 'Unassigned'} · {c.memberIds.length} members</div>
                  </div>
                  <ChevronRight size={18} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'startup') {
    // If startup not yet selected, show startup list
    if (!selectedStartupId) {
      return (
        <div className="portal-page">
          <div className="portal-dialog animate-scale-in">
            <button className="portal-back" onClick={() => setStep('select')}>← Back</button>
            <div className="portal-dialog-icon" style={{ background: '#ecfdf5', color: 'var(--success)' }}>
              <Rocket size={28} />
            </div>
            <h2>Select Your Startup</h2>
            <p>Choose the startup team you belong to.</p>
            <div className="portal-list">
              {startups.map(s => {
                const leader = members.find(m => m.id === s.leaderId);
                return (
                  <button key={s.id} className="portal-list-item" onClick={() => setSelectedStartupId(s.id)}>
                    <div>
                      <div className="portal-list-name">{s.name}</div>
                      <div className="portal-list-sub">Leader: {leader?.name || 'Unassigned'} · {s.memberIds.length} members</div>
                    </div>
                    <ChevronRight size={18} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Startup selected — now pick who you are
    const startup = startups.find(s => s.id === selectedStartupId);
    const startupMembers = startup?.memberIds.map(id => members.find(m => m.id === id)).filter(Boolean) || [];

    return (
      <div className="portal-page">
        <div className="portal-dialog animate-scale-in">
          <button className="portal-back" onClick={() => setSelectedStartupId(null)}>← Back to startups</button>
          <div className="portal-dialog-icon" style={{ background: '#ecfdf5', color: 'var(--success)' }}>
            <Rocket size={28} />
          </div>
          <h2>{startup?.name}</h2>
          <p>Select your name to log in.</p>
          <div className="portal-list">
            {startupMembers.map(m => (
              <button key={m.id} className="portal-list-item" onClick={() => loginAsStartup(selectedStartupId, m.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="member-avatar-sm" style={{ width: '32px', height: '32px', fontSize: '0.6875rem' }}>
                    {getInitials(m.name)}
                  </div>
                  <div>
                    <div className="portal-list-name">{m.name}</div>
                    <div className="portal-list-sub">{m.rollNumber} · {m.id === startup.leaderId ? 'Leader' : 'Member'}</div>
                  </div>
                </div>
                <ChevronRight size={18} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Main Portal Selection ──
  return (
    <div className="portal-page">
      <div className="portal-header animate-fade-in">
        <div className="portal-brand">
          <div className="brand-icon" style={{ width: '48px', height: '48px' }}>
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Cell ERP</h1>
            <p style={{ fontSize: '0.875rem', marginTop: '0.125rem' }}>E-Cell Attendance Management</p>
          </div>
        </div>
      </div>

      <div className="portal-cards">
        <button className="portal-card animate-fade-in" style={{ animationDelay: '80ms' }} onClick={() => setStep('committee')}>
          <div className="portal-card-icon" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)' }}>
            <Users size={32} />
          </div>
          <h3>Committee Head</h3>
          <p>Mark attendance for your committee team based on work periods and lectures.</p>
          <div className="portal-card-meta">{committees.length} committees active</div>
          <span className="portal-card-arrow"><ChevronRight size={20} /></span>
        </button>

        <button className="portal-card animate-fade-in" style={{ animationDelay: '160ms' }} onClick={() => setStep('startup')}>
          <div className="portal-card-icon" style={{ background: '#ecfdf5', color: 'var(--success)' }}>
            <Rocket size={32} />
          </div>
          <h3>Startup Team</h3>
          <p>Choose a timeslot, verify location with GPS & camera to mark attendance.</p>
          <div className="portal-card-meta">{startups.length} startups incubated</div>
          <span className="portal-card-arrow"><ChevronRight size={20} /></span>
        </button>

        <button className="portal-card animate-fade-in" style={{ animationDelay: '240ms' }} onClick={() => loginAsAdmin()}>
          <div className="portal-card-icon" style={{ background: '#fffbeb', color: 'var(--warning)' }}>
            <Shield size={32} />
          </div>
          <h3>Admin Console</h3>
          <p>Manage all committees, startups, members, and export combined reports.</p>
          <div className="portal-card-meta">Full system access</div>
          <span className="portal-card-arrow"><ChevronRight size={20} /></span>
        </button>
      </div>
    </div>
  );
};
