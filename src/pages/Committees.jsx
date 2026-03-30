import { Users, Trash2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Committees = ({ setCurrentTab }) => {
  const { committees, deleteCommittee, getCommitteeMembers } = useAppContext();

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>Committees</h1>
          <p>Manage your E-Cell committees and their members.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setCurrentTab('create-committee')}>
            <Users size={16} /> Create Committee
          </button>
        </div>
      </div>

      {committees.length === 0 ? (
        <div className="section-card">
          <div className="empty-state">
            <Users size={48} opacity={0.25} />
            <p>No committees created yet.</p>
            <button className="btn-primary" onClick={() => setCurrentTab('create-committee')}>
              Create Your First Committee
            </button>
          </div>
        </div>
      ) : (
        <div className="committees-grid">
          {committees.map((committee, idx) => {
            const committeeMembers = getCommitteeMembers(committee.id);
            return (
              <div key={committee.id} className="committee-card animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="committee-header">
                  <div>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{committee.name}</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', margin: 0 }}>
                      {committee.description}
                    </p>
                  </div>
                  <button className="btn-icon danger" onClick={(e) => { e.stopPropagation(); deleteCommittee(committee.id); }}>
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Member Avatars Stack */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex' }}>
                    {committeeMembers.slice(0, 4).map((member, i) => (
                      <div
                        key={member.id}
                        className="member-avatar-sm"
                        style={{
                          marginLeft: i > 0 ? '-0.5rem' : 0,
                          border: '2px solid var(--bg-panel)',
                          zIndex: 4 - i,
                          width: '32px', height: '32px', fontSize: '0.6875rem',
                        }}
                        title={member.name}
                      >
                        {getInitials(member.name)}
                      </div>
                    ))}
                    {committeeMembers.length > 4 && (
                      <div
                        className="member-avatar-sm"
                        style={{
                          marginLeft: '-0.5rem',
                          background: 'var(--bg-subtle)',
                          color: 'var(--text-tertiary)',
                          border: '2px solid var(--bg-panel)',
                          width: '32px', height: '32px', fontSize: '0.6875rem',
                        }}
                      >
                        +{committeeMembers.length - 4}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: '0.25rem' }}>
                    {committeeMembers.length} member{committeeMembers.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="committee-meta">
                  <div className="committee-meta-item">
                    <span className="committee-meta-label">Created</span>
                    <span className="committee-meta-value">
                      {new Date(committee.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="committee-meta-item">
                    <span className="committee-meta-label">Status</span>
                    <span className="badge badge-success" style={{ marginTop: '0.125rem' }}>Active</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
