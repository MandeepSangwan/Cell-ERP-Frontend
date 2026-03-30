import { History, CalendarDays } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { formatTime } from '../../utils/constants';

export const CommitteeAttendanceHistory = () => {
  const { selectedCommittee, committees, committeeAttendance, getMemberById } = useAppContext();
  const committee = committees.find(c => c.id === selectedCommittee);

  const sortedDates = Object.keys(committeeAttendance).filter(date => committeeAttendance[date]?.[selectedCommittee]).sort((a, b) => b.localeCompare(a));

  return (
    <div className="main-content">
      <div className="header-bar">
        <div><h1>Attendance History</h1><p>Past attendance records for {committee?.name}.</p></div>
      </div>

      {sortedDates.length === 0 ? (
        <div className="section-card"><div className="empty-state"><CalendarDays size={40} opacity={0.25} /><p>No past records found.</p></div></div>
      ) : (
        sortedDates.map((date, idx) => {
          const dayData = committeeAttendance[date][selectedCommittee];
          return (
            <div key={date} className="section-card animate-fade-in" style={{ marginBottom: '1rem', animationDelay: `${idx * 50}ms` }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <CalendarDays size={16} style={{ color: 'var(--blue-500)' }} />
                {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              <div className="data-table-container">
                <table className="data-table">
                  <thead><tr><th>Member</th><th>Check In</th><th>Check Out</th><th>Lectures</th><th>Status</th></tr></thead>
                  <tbody>
                    {Object.entries(dayData).map(([memberId, rec]) => {
                      const member = getMemberById(memberId);
                      return (
                        <tr key={memberId}>
                          <td style={{ fontWeight: 500 }}>{member?.name || memberId}</td>
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
            </div>
          );
        })
      )}
    </div>
  );
};
