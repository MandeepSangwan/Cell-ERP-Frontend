import { useState, useEffect } from 'react';
import { Download, Users, UserCheck, CalendarDays } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { exportToExcel } from '../utils/export';

export const Dashboard = () => {
  const { members, timeSlots, attendance, markAttendance } = useAppContext();
  const [selectedSlot, setSelectedSlot] = useState('');

  // Auto select the latest timeslot if available
  useEffect(() => {
    if (timeSlots.length > 0 && !selectedSlot) {
      setSelectedSlot(timeSlots[timeSlots.length - 1].id);
    }
  }, [timeSlots, selectedSlot]);

  const handleExport = () => {
    if (members.length === 0 || timeSlots.length === 0) return;
    exportToExcel(members, timeSlots, attendance);
  };

  const getPresentCount = () => {
    if (!selectedSlot || !attendance[selectedSlot]) return 0;
    return Object.values(attendance[selectedSlot]).filter(status => status === 'Present').length;
  };

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Overview of your committee and attendance.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleExport} disabled={timeSlots.length === 0}>
            <Download size={18} /> Export to Excel
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <span className="stat-card-title">Total Members</span>
          <span className="stat-card-value">{members.length}</span>
          <Users className="stat-card-icon" size={32} />
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-card-title">Sessions Generated</span>
          <span className="stat-card-value">{timeSlots.length}</span>
          <CalendarDays className="stat-card-icon" size={32} />
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-card-title">Present in Selected Session</span>
          <span className="stat-card-value">
            {timeSlots.length > 0 && selectedSlot ? `${getPresentCount()} / ${members.length}` : '-'}
          </span>
          <UserCheck className="stat-card-icon" size={32} />
        </div>
      </div>

      <div className="glass-panel section-card" style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem' }}>Attendance Tracker</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select Session:</span>
            <select 
              value={selectedSlot} 
              onChange={(e) => setSelectedSlot(e.target.value)}
              style={{ width: 'auto' }}
            >
              {timeSlots.length === 0 && <option value="">No sessions available</option>}
              {timeSlots.map(slot => (
                <option key={slot.id} value={slot.id}>{slot.label} - {slot.date}</option>
              ))}
            </select>
          </div>
        </div>

        {timeSlots.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={48} opacity={0.3} />
            <p>No time slots defined yet.</p>
            <p style={{ fontSize: '0.9rem' }}>Go to Time Slots tab to create one before tracking attendance.</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => {
                  const status = attendance[selectedSlot]?.[member.id] || 'Pending';
                  
                  return (
                    <tr key={member.id}>
                      <td style={{ fontWeight: 500 }}>{member.name}</td>
                      <td>{member.role}</td>
                      <td>
                        <span className={`badge badge-${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className="attendance-toggle">
                          <button 
                            className={`toggle-btn present ${status === 'Present' ? 'active' : ''}`}
                            onClick={() => markAttendance(selectedSlot, member.id, 'Present')}
                          >
                            Present
                          </button>
                          <button 
                            className={`toggle-btn absent ${status === 'Absent' ? 'active' : ''}`}
                            onClick={() => markAttendance(selectedSlot, member.id, 'Absent')}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
