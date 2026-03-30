import { useState, useEffect } from 'react';
import { CalendarDays, UserCheck, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Attendance = () => {
  const { members, timeSlots, attendance, markAttendance, committees } = useAppContext();
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedCommittee, setSelectedCommittee] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (timeSlots.length > 0 && !selectedSlot) {
      setSelectedSlot(timeSlots[timeSlots.length - 1].id);
    }
  }, [timeSlots, selectedSlot]);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCommittee === 'all') return matchesSearch;
    const committee = committees.find(c => c.id === selectedCommittee);
    if (!committee) return matchesSearch;
    return matchesSearch && committee.members.includes(member.id);
  });

  const getStats = () => {
    if (!selectedSlot || !attendance[selectedSlot]) {
      return { present: 0, absent: 0, pending: members.length };
    }
    const slotData = attendance[selectedSlot];
    let present = 0, absent = 0;
    members.forEach(m => {
      if (slotData[m.id] === 'Present') present++;
      else if (slotData[m.id] === 'Absent') absent++;
    });
    return { present, absent, pending: members.length - present - absent };
  };

  const stats = getStats();

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>Mark Attendance</h1>
          <p>Track and manage member attendance across sessions.</p>
        </div>
      </div>

      {/* Session Selector & Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0ms' }}>
          <span className="stat-card-title">Session</span>
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '0.25rem' }}
          >
            {timeSlots.length === 0 && <option value="">No sessions</option>}
            {timeSlots.map(slot => (
              <option key={slot.id} value={slot.id}>{slot.label} — {slot.date}</option>
            ))}
          </select>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '50ms' }}>
          <span className="stat-card-title">Present</span>
          <span className="stat-card-value" style={{ color: 'var(--success)' }}>{stats.present}</span>
          <UserCheck className="stat-card-icon" size={28} style={{ color: 'var(--success)' }} />
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '100ms' }}>
          <span className="stat-card-title">Absent</span>
          <span className="stat-card-value" style={{ color: 'var(--danger)' }}>{stats.absent}</span>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '150ms' }}>
          <span className="stat-card-title">Pending</span>
          <span className="stat-card-value" style={{ color: 'var(--warning)' }}>{stats.pending}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="section-card animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2>
            <CalendarDays size={18} style={{ color: 'var(--blue-500)' }} />
            Attendance Roster
          </h2>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-bar">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '200px' }}
              />
            </div>
            <select
              value={selectedCommittee}
              onChange={(e) => setSelectedCommittee(e.target.value)}
              style={{ width: 'auto', fontSize: '0.8125rem' }}
            >
              <option value="all">All Members</option>
              {committees.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {timeSlots.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={48} opacity={0.25} />
            <p>No sessions available.</p>
            <p style={{ fontSize: '0.85rem' }}>Create a session in Time Slots to start tracking attendance.</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Member</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member, idx) => {
                  const status = attendance[selectedSlot]?.[member.id] || 'Pending';
                  return (
                    <tr key={member.id} className="animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="member-avatar-sm">{getInitials(member.name)}</div>
                          <div>
                            <div className="member-name">{member.name}</div>
                            {member.email && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{member.email}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{member.role}</td>
                      <td>
                        <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
                      </td>
                      <td>
                        <div className="attendance-toggle" style={{ justifyContent: 'center' }}>
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
