import { useState } from 'react';
import { CalendarDays, Search, CheckCircle2, XCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { WorkPeriodPicker } from '../../components/committee/WorkPeriodPicker';
import { today, getCoveredLectures } from '../../utils/constants';

export const CommitteeMarkAttendance = () => {
  const { selectedCommittee, committees, getCommitteeMembers, markCommitteeAttendance, getCommitteeAttendanceForDate, findMemberByNameOrRoll, showToast } = useAppContext();
  const committee = committees.find(c => c.id === selectedCommittee);
  const teamMembers = getCommitteeMembers(selectedCommittee);
  const [date, setDate] = useState(today());
  const [searchQuery, setSearchQuery] = useState('');

  // Per-member work period state
  const [workPeriods, setWorkPeriods] = useState({});

  const existingAttendance = getCommitteeAttendanceForDate(date, selectedCommittee);

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const updateWorkPeriod = (memberId, field, value) => {
    setWorkPeriods(prev => ({
      ...prev,
      [memberId]: { ...prev[memberId], [field]: value },
    }));
  };

  const markPresent = (memberId) => {
    const wp = workPeriods[memberId] || {};
    if (!wp.checkIn || !wp.checkOut) {
      showToast('Please set check-in and check-out times', 'error');
      return;
    }
    markCommitteeAttendance(date, selectedCommittee, memberId, {
      status: 'present', checkIn: wp.checkIn, checkOut: wp.checkOut,
    });
    showToast('Marked present');
  };

  const markAbsent = (memberId) => {
    markCommitteeAttendance(date, selectedCommittee, memberId, {
      status: 'absent', checkIn: null, checkOut: null,
    });
    showToast('Marked absent');
  };

  // Quick-add by name or roll number
  const handleQuickSearch = () => {
    if (!searchQuery.trim()) return;
    const found = findMemberByNameOrRoll(searchQuery);
    if (found && teamMembers.find(m => m.id === found.id)) {
      // Scroll or highlight the member
      const el = document.getElementById(`member-${found.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast(`Found: ${found.name}`);
    } else {
      showToast('Member not found in this committee', 'error');
    }
    setSearchQuery('');
  };

  const filteredMembers = teamMembers.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>Mark Attendance</h1>
          <p>Manually mark attendance for {committee?.name} team members.</p>
        </div>
        <div className="header-actions">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            style={{ width: 'auto', fontSize: '0.875rem' }} />
        </div>
      </div>

      {/* Search / Quick Add */}
      <div className="section-card animate-fade-in" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Search by Name or Roll Number</label>
            <div className="search-bar" style={{ maxWidth: '100%' }}>
              <Search size={15} />
              <input type="text" placeholder="Type name or roll number to find a member..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()} />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Roster */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredMembers.map((member, idx) => {
          const existing = existingAttendance[member.id];
          const wp = workPeriods[member.id] || { checkIn: existing?.checkIn || '', checkOut: existing?.checkOut || '' };
          const covered = getCoveredLectures(wp.checkIn, wp.checkOut).map(l => l.id);

          return (
            <div key={member.id} id={`member-${member.id}`}
              className="section-card animate-fade-in"
              style={{ animationDelay: `${idx * 30}ms`, padding: '1.25rem',
                borderLeft: existing ? `3px solid ${existing.status === 'present' ? 'var(--success)' : 'var(--danger)'}` : '3px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Member Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '200px' }}>
                  <div className="member-avatar-sm">{getInitials(member.name)}</div>
                  <div>
                    <div className="member-name">{member.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{member.rollNumber} · {member.role}</div>
                    {existing && <span className={`badge badge-${existing.status}`} style={{ marginTop: '0.25rem' }}>{existing.status}</span>}
                  </div>
                </div>

                {/* Work Period + Actions */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <WorkPeriodPicker
                    checkIn={wp.checkIn} checkOut={wp.checkOut}
                    onChangeIn={(v) => updateWorkPeriod(member.id, 'checkIn', v)}
                    onChangeOut={(v) => updateWorkPeriod(member.id, 'checkOut', v)}
                    coveredLectures={covered} />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button className="btn-primary" onClick={() => markPresent(member.id)}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                    <CheckCircle2 size={15} /> Present
                  </button>
                  <button className="btn-danger" onClick={() => markAbsent(member.id)}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                    <XCircle size={15} /> Absent
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
