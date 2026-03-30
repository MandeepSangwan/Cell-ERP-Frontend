import { useState } from 'react';
import { Shield, UserPlus, Trash2, Download, Database, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { exportToExcel } from '../utils/export';

export const AdminPanel = () => {
  const { members, addMember, removeMember, committees, timeSlots, attendance } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) return;
    addMember(newName, newRole, newEmail);
    setNewName('');
    setNewRole('');
    setNewEmail('');
    setShowAddModal(false);
  };

  const handleExport = () => {
    exportToExcel(members, timeSlots, attendance);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>Admin Panel</h1>
          <p>Manage members, export data, and system settings.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleExport}>
            <Download size={16} /> Export All Data
          </button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <UserPlus size={16} /> Add Member
          </button>
        </div>
      </div>

      <div className="admin-grid">
        {/* Members Management */}
        <div className="section-card animate-fade-in">
          <h3>
            <Shield size={18} style={{ color: 'var(--blue-500)' }} />
            Members Directory
            <span className="badge badge-neutral" style={{ marginLeft: 'auto' }}>{members.length}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {members.map((member, idx) => (
              <div key={member.id} className="member-manage-row animate-fade-in" style={{ animationDelay: `${idx * 20}ms` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="member-avatar-sm" style={{ width: '34px', height: '34px', fontSize: '0.75rem' }}>
                    {getInitials(member.name)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{member.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{member.role}</div>
                  </div>
                </div>
                <button className="btn-icon danger" onClick={() => removeMember(member.id)}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="section-card animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3>
              <Database size={18} style={{ color: 'var(--blue-500)' }} />
              System Overview
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Members</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{members.length}</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Committees</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{committees.length}</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sessions</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{timeSlots.length}</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Records</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {Object.values(attendance).reduce((acc, slot) => acc + Object.keys(slot).length, 0)}
                </div>
              </div>
            </div>
          </div>

          <div className="section-card animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 style={{ marginBottom: '1rem' }}>Danger Zone</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
              Permanently reset all application data. This action cannot be undone.
            </p>
            <button className="btn-danger" onClick={handleClearData}>
              <Trash2 size={16} /> Clear All Data
            </button>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Member</h2>
              <button className="btn-icon" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  placeholder="e.g. Marketing Lead"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email (optional)</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
