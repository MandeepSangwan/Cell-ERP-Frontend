import { useMemo } from 'react';
import { Users, UserCheck, CalendarDays, TrendingUp, Clock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { today, formatTime } from '../../utils/constants';

export const CommitteeDashboard = () => {
  const { selectedCommittee, committees, getCommitteeMembers, committeeAttendance } = useAppContext();
  const committee = committees.find(c => c.id === selectedCommittee);
  const teamMembers = getCommitteeMembers(selectedCommittee);

  const stats = useMemo(() => {
    let totalRecords = 0, presentCount = 0, totalLectures = 0;
    Object.values(committeeAttendance).forEach(dayData => {
      const cData = dayData[selectedCommittee];
      if (cData) {
        Object.values(cData).forEach(rec => {
          totalRecords++;
          if (rec.status === 'present') presentCount++;
          totalLectures += (rec.lecturesCovered || []).length;
        });
      }
    });
    const rate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;
    return { totalRecords, presentCount, rate, totalLectures };
  }, [committeeAttendance, selectedCommittee]);

  const todayData = committeeAttendance[today()]?.[selectedCommittee] || {};
  const todayPresent = Object.values(todayData).filter(r => r.status === 'present').length;

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>{committee?.name || 'Dashboard'}</h1>
          <p>{committee?.description}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card animate-fade-in">
          <span className="stat-card-title">Team Members</span>
          <span className="stat-card-value">{teamMembers.length}</span>
          <Users className="stat-card-icon" size={28} />
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '60ms' }}>
          <span className="stat-card-title">Present Today</span>
          <span className="stat-card-value" style={{ color: 'var(--success)' }}>{todayPresent}/{teamMembers.length}</span>
          <UserCheck className="stat-card-icon" size={28} style={{ color: 'var(--success)' }} />
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '120ms' }}>
          <span className="stat-card-title">Attendance Rate</span>
          <span className="stat-card-value">{stats.rate}%</span>
          <TrendingUp className="stat-card-icon" size={28} />
        </div>
      </div>

      <div className="section-card animate-fade-in" style={{ animationDelay: '180ms' }}>
        <h2><Clock size={18} style={{ color: 'var(--blue-500)' }} /> Today's Attendance</h2>
        {Object.keys(todayData).length === 0 ? (
          <div className="empty-state"><p>No attendance marked for today yet.</p></div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead><tr><th>Member</th><th>Check In</th><th>Check Out</th><th>Lectures</th><th>Status</th></tr></thead>
              <tbody>
                {teamMembers.map(m => {
                  const rec = todayData[m.id];
                  if (!rec) return (
                    <tr key={m.id}><td style={{ fontWeight: 500 }}>{m.name}</td><td colSpan={4} style={{ color: 'var(--text-tertiary)' }}>Not marked</td></tr>
                  );
                  return (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 500 }}>{m.name}</td>
                      <td>{formatTime(rec.checkIn)}</td>
                      <td>{formatTime(rec.checkOut)}</td>
                      <td>{(rec.lecturesCovered || []).join(', ') || '—'}</td>
                      <td><span className={`badge badge-${rec.status}`}>{rec.status}</span></td>
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
