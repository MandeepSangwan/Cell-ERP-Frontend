import { useState } from 'react';
import { Rocket, UserPlus, MousePointer2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';

export const ManageStartups = () => {
  const [showModal, setShowModal] = useState(false);
  const { startups, members, addMember, getMemberById, showToast } = useAppContext();
  const [formData, setFormData] = useState({ name: '', rollNumber: '', email: '', startupId: '' });

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  const handleAddMemberToStartup = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNumber || !formData.startupId) {
      showToast('Name, roll number, and startup are required', 'error');
      return;
    }

    addMember({
      name: formData.name,
      rollNumber: formData.rollNumber,
      email: formData.email,
      role: 'startup_member',
      startupId: formData.startupId
    });

    setFormData({ name: '', rollNumber: '', email: '', startupId: '' });
    setShowModal(false);
  };

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>Manage Startups</h1>
          <p>Global management of incubated startup teams and leaders.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <UserPlus size={16} /> Add Startup Member
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {startups.map((startup, idx) => {
          const leader = getMemberById(startup.leaderId);
          const startupMembers = startup.memberIds.map(id => getMemberById(id)).filter(Boolean);

          return (
            <div key={startup.id} className="section-card animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="brand-icon" style={{ background: '#ecfdf5', color: 'var(--success)', width: '40px', height: '40px' }}>
                    <Rocket size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{startup.name}</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{startup.description}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Team Slot</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--success)' }}>
                    {startup.selectedTimeslot ? startup.selectedTimeslot.replace('_', ' ').toUpperCase() : 'NOT SET'}
                  </div>
                </div>
              </div>

              <div className="data-table-container" style={{ marginTop: '1.5rem' }}>
                <table className="data-table">
                  <thead><tr><th>Name</th><th>Roll Number</th><th>Email</th><th>Role</th></tr></thead>
                  <tbody>
                    {startupMembers.map(m => (
                      <tr key={m.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div className="member-avatar-sm" style={{ width: '28px', height: '28px', fontSize: '0.625rem', background: 'var(--success)', color: 'white' }}>
                              {getInitials(m.name)}
                            </div>
                            <span style={{ fontWeight: 500 }}>{m.name}</span>
                            {m.id === leader?.id && <span className="badge badge-success" style={{ fontSize: '0.625rem' }}>LEADER</span>}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.8125rem' }}>{m.rollNumber}</td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{m.email}</td>
                        <td><span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>{m.id === leader?.id ? 'Leader' : 'Member'}</span></td>
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
        <Modal title="Add New Startup Member" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAddMemberToStartup} style={{ marginTop: '1rem' }}>
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
              <label>Assign to Startup</label>
              <select value={formData.startupId} onChange={e => setFormData({ ...formData, startupId: e.target.value })}>
                <option value="">Select Startup</option>
                {startups.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%', background: 'var(--success)', borderColor: 'var(--success)' }}>Create & Assign Member</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
