import { Users } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const StartupTeamManagement = () => {
  const { selectedStartup, startups, getStartupMembers, currentUser } = useAppContext();
  const startup = startups.find(s => s.id === selectedStartup);
  const teamMembers = getStartupMembers(selectedStartup);
  const isLeader = currentUser?.id === startup?.leaderId;

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>My Team</h1>
          <p>{startup?.name} — {teamMembers.length} members</p>
        </div>
      </div>

      <div className="section-card animate-fade-in">
        <h2><Users size={18} style={{ color: 'var(--success)' }} /> Startup Members</h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Roll Number</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((m, idx) => (
                <tr key={m.id} className="animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="member-avatar-sm" style={{ background: 'var(--success)', color: 'white' }}>
                        {getInitials(m.name)}
                      </div>
                      <div>
                        <div className="member-name">{m.name}</div>
                        {m.id === startup?.leaderId && (
                          <span className="badge badge-success" style={{ fontSize: '0.625rem' }}>LEADER</span>
                        )}
                        {m.id === currentUser?.id && (
                          <span className="badge badge-neutral" style={{ fontSize: '0.625rem', marginLeft: '0.25rem' }}>YOU</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{m.rollNumber}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{m.email}</td>
                  <td>
                    <span className="badge badge-neutral">
                      {m.id === startup?.leaderId ? 'Leader' : 'Member'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-card animate-fade-in" style={{ marginTop: '1.5rem', animationDelay: '100ms' }}>
        <h3>Team Guidelines</h3>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', marginTop: '0.75rem' }}>
          <li>Attendance can be marked by the Leader or any team member if the leader is absent.</li>
          <li>The entire team must follow the same timeslot (Slot 1 or Slot 2).</li>
          <li>GPS and photo verification are mandatory for every attendance mark.</li>
          <li>Location must be within 500m of the college campus center.</li>
        </ul>
      </div>
    </div>
  );
};
