import { History, CalendarDays, Camera, MapPin } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { TIMESLOTS, formatTime } from '../../utils/constants';

export const StartupAttendanceHistory = () => {
  const { selectedStartup, startups, startupAttendance, getMemberById } = useAppContext();
  const startup = startups.find(s => s.id === selectedStartup);

  const sortedDates = Object.keys(startupAttendance)
    .filter(date => startupAttendance[date]?.[selectedStartup])
    .sort((a, b) => b.localeCompare(a));

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>Attendance History</h1>
          <p>Verified attendance logs for {startup?.name}.</p>
        </div>
      </div>

      {sortedDates.length === 0 ? (
        <div className="section-card">
          <div className="empty-state">
            <CalendarDays size={40} opacity={0.25} />
            <p>No verified records found.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {sortedDates.map((date, idx) => {
            const dayData = startupAttendance[date][selectedStartup];
            return (
              <div key={date} className="section-card animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <CalendarDays size={18} style={{ color: 'var(--success)' }} />
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
                
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>Timeslot</th>
                        <th>Location</th>
                        <th>Proof</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(dayData).map(([memberId, rec]) => {
                        const member = getMemberById(memberId);
                        return (
                          <tr key={memberId}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{member?.name || memberId}</div>
                              <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>By: {rec.markedByName}</div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 500 }}>{TIMESLOTS[rec.timeslot]?.label}</div>
                              <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>{TIMESLOTS[rec.timeslot]?.time}</div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <MapPin size={12} style={{ color: rec.locationStatus === 'valid' ? 'var(--success)' : 'var(--danger)' }} />
                                <span className={`badge badge-${rec.locationStatus === 'valid' ? 'success' : 'danger'}`} style={{ fontSize: '0.625rem' }}>
                                  {rec.locationStatus}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                                {rec.locationDistance}m from college
                              </div>
                            </td>
                            <td>
                              {rec.photoUrl ? (
                                <div className="proof-thumbnail" style={{ cursor: 'pointer' }} onClick={() => window.open(rec.photoUrl, '_blank')}>
                                  <Camera size={14} /> View
                                </div>
                              ) : (
                                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>No Photo</span>
                              )}
                            </td>
                            <td>
                              <span className={`badge badge-${rec.status}`}>
                                {rec.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
