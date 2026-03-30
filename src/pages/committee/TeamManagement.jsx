import { Users } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const CommitteeTeamManagement = () => {
  const { selectedCommittee, committees, getCommitteeMembers, getMemberById } = useAppContext();
  const committee = committees.find(c => c.id === selectedCommittee);
  const teamMembers = getCommitteeMembers(selectedCommittee);
  const head = getMemberById(committee?.headId);

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>My Team</h1>
          <p>{committee?.name} — {teamMembers.length} members</p>
        </div>
      </div>

      <div className="section-card animate-fade-in">
        <h2><Users size={18} style={{ color: 'var(--blue-500)' }} /> Team Members</h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead><tr><th>Member</th><th>Roll Number</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              {teamMembers.map((m, idx) => (
                <tr key={m.id} className="animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="member-avatar-sm">{getInitials(m.name)}</div>
                      <div>
                        <div className="member-name">{m.name}</div>
                        {m.id === committee?.headId && <span className="badge badge-info" style={{ fontSize: '0.625rem' }}>HEAD</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{m.rollNumber}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{m.email}</td>
                  <td><span className="badge badge-neutral">{m.role?.replace('_', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
