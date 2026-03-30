import { useState } from 'react';
import { UserPlus, X, Check, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const CreateCommittee = ({ setCurrentTab }) => {
  const { members, addCommittee } = useAppContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const toggleMember = (memberId) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || selectedMembers.length === 0) return;
    addCommittee(name, description, selectedMembers);
    setCurrentTab('committees');
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="main-content">
      <div className="header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn-icon" onClick={() => setCurrentTab('committees')} title="Back to Committees">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Create Committee</h1>
            <p>Set up a new committee and assign members.</p>
          </div>
        </div>
      </div>

      <div className="create-form-layout">
        {/* Form Section */}
        <div className="section-card animate-fade-in">
          <h2><UserPlus size={18} style={{ color: 'var(--blue-500)' }} /> Committee Details</h2>
          
          <form onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
            <div className="form-group">
              <label>Committee Name</label>
              <input
                type="text"
                placeholder="e.g. Events Committee"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Briefly describe this committee's purpose..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group">
              <label>Select Members ({selectedMembers.length} selected)</label>
              <div className="hint">Click on members below to add them to this committee.</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {members.map(member => {
                const isSelected = selectedMembers.includes(member.id);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleMember(member.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: isSelected ? 'var(--blue-50)' : 'var(--bg-subtle)',
                      border: `1px solid ${isSelected ? 'var(--blue-300)' : 'transparent'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="member-avatar-sm" style={{
                        width: '32px', height: '32px', fontSize: '0.6875rem',
                        background: isSelected ? 'var(--blue-600)' : 'var(--blue-50)',
                        color: isSelected ? 'var(--text-inverse)' : 'var(--blue-600)',
                      }}>
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{member.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{member.role}</div>
                      </div>
                    </div>
                    {isSelected && <Check size={18} style={{ color: 'var(--blue-600)' }} />}
                  </button>
                );
              })}
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem' }}
              disabled={!name.trim() || selectedMembers.length === 0}
            >
              Create Committee
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="section-card animate-fade-in" style={{ animationDelay: '100ms', alignSelf: 'start' }}>
          <h2>Preview</h2>
          
          <div style={{
            marginTop: '1.25rem',
            padding: '1.5rem',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
          }}>
            <h3 style={{ fontSize: '1.125rem', color: name ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
              {name || 'Committee Name'}
            </h3>
            <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem', color: 'var(--text-tertiary)' }}>
              {description || 'No description provided'}
            </p>

            <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Members ({selectedMembers.length})
              </span>
              
              {selectedMembers.length === 0 ? (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.75rem' }}>
                  No members selected yet.
                </p>
              ) : (
                <div className="members-preview" style={{ marginTop: '0.75rem' }}>
                  {selectedMembers.map(id => {
                    const member = members.find(m => m.id === id);
                    if (!member) return null;
                    return (
                      <div key={id} className="member-chip">
                        <div className="member-chip-info">
                          <span className="member-chip-name">{member.name}</span>
                          <span className="member-chip-role">{member.role}</span>
                        </div>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => toggleMember(id)}
                          style={{ width: '28px', height: '28px' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
