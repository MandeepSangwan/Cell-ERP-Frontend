import { useState } from 'react';
import { Users, UserPlus, Trash2, Mail, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';

export const ManageCommittees = () => {
  const [showModal, setShowModal] = useState(false);
  const { committees, members, addMember, getMemberById, showToast } = useAppContext();
  const [formData, setFormData] = useState({ name: '', rollNumber: '', email: '', committeeId: '' });

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  const handleAddMemberToCommittee = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNumber || !formData.committeeId) {
      showToast('Name, roll number, and committee are required', 'error');
      return;
    }

    addMember({
      name: formData.name,
      rollNumber: formData.rollNumber,
      email: formData.email,
      role: 'committee_member',
      committeeId: formData.committeeId
    });

    setFormData({ name: '', rollNumber: '', email: '', committeeId: '' });
    setShowModal(false);
  };

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>Manage Committees</h1>
          <p>Global management of student team committees and heads.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <UserPlus size={16} /> Add Committee Member
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {committees.map((committee, idx) => {
          const head = getMemberById(committee.headId);
          const committeeMembers = committee.memberIds.map(id => getMemberById(id)).filter(Boolean);

          return (
            <div key={committee.id} className="section-card animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="brand-icon" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)', width: '40px', height: '40px' }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{committee.name}</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{committee.description}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Marked by</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{head?.name || 'Unassigned'} (Head)</div>
                </div>
              </div>

              <div className="data-table-container" style={{ marginTop: '1.5rem' }}>
                <table className="data-table">
                  <thead><tr><th>Name</th><th>Roll Number</th><th>Email</th><th>Role</th></tr></thead>
                  <tbody>
                    {committeeMembers.map(m => (
                      <tr key={m.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div className="member-avatar-sm" style={{ width: '28px', height: '28px', fontSize: '0.625rem' }}>{getInitials(m.name)}</div>
                            <span style={{ fontWeight: 500 }}>{m.name}</span>
                            {m.id === head?.id && <span className="badge badge-info" style={{ fontSize: '0.625rem' }}>HEAD</span>}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.8125rem' }}>{m.rollNumber}</td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{m.email}</td>
                        <td><span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>{m.id === head?.id ? 'Head' : 'Member'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal title="Add New Committee Member" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAddMemberToCommittee} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Member's full name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Roll Number</label>
              <input type="text" placeholder="College roll number" value={formData.rollNumber} onChange={e => setFormData({ ...formData, rollNumber: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="example@college.edu" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Assign to Committee</label>
              <select value={formData.committeeId} onChange={e => setFormData({ ...formData, committeeId: e.target.value })}>
                <option value="">Select Committee</option>
                {committees.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create & Assign Member</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
