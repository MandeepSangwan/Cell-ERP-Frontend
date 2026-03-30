import { useMemo } from 'react';
import { Rocket, Users, Clock, TrendingUp, MapPin } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { today, TIMESLOTS } from '../../utils/constants';

export const StartupDashboard = () => {
  const { selectedStartup, startups, getStartupMembers, startupAttendance, currentUser } = useAppContext();
  const startup = startups.find(s => s.id === selectedStartup);
  const teamMembers = getStartupMembers(selectedStartup);
  const slot = startup?.selectedTimeslot ? TIMESLOTS[startup.selectedTimeslot] : null;
  const isLeader = currentUser?.id === startup?.leaderId;

  const stats = useMemo(() => {
    let total = 0, present = 0, validLocation = 0;
    Object.values(startupAttendance).forEach(dayData => {
      const sData = dayData[selectedStartup];
      if (sData) {
        Object.values(sData).forEach(rec => {
          total++;
          if (rec.status === 'present') present++;
          if (rec.locationStatus === 'valid') validLocation++;
        });
      }
    });
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, rate, validLocation };
  }, [startupAttendance, selectedStartup]);

  const todayData = startupAttendance[today()]?.[selectedStartup] || {};
  const todayPresent = Object.values(todayData).filter(r => r.status === 'present').length;

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>{startup?.name || 'Dashboard'}</h1>
          <p>{startup?.description}</p>
        </div>
        <div className="header-actions">
          {isLeader && <span className="badge badge-success">You are the Team Leader</span>}
          {!isLeader && <span className="badge badge-neutral">Team Member</span>}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card animate-fade-in">
          <span className="stat-card-title">Team Members</span>
          <span className="stat-card-value">{teamMembers.length}</span>
          <Users className="stat-card-icon" size={28} />
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '60ms' }}>
          <span className="stat-card-title">Active Timeslot</span>
          <span className="stat-card-value" style={{ fontSize: '1.25rem' }}>
            {slot ? `${slot.label}` : 'Not set'}
          </span>
          <Clock className="stat-card-icon" size={28} />
          {slot && <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{slot.time}</span>}
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '120ms' }}>
          <span className="stat-card-title">Attendance Rate</span>
          <span className="stat-card-value">{stats.rate}%</span>
          <TrendingUp className="stat-card-icon" size={28} />
        </div>
      </div>

      {/* Today's Status */}
      <div className="section-card animate-fade-in" style={{ animationDelay: '180ms' }}>
        <h2><Rocket size={18} style={{ color: 'var(--success)' }} /> Today's Status</h2>
        {Object.keys(todayData).length === 0 ? (
          <div className="empty-state"><p>No attendance marked for today.</p></div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead><tr><th>Member</th><th>Timeslot</th><th>Location</th><th>Status</th></tr></thead>
              <tbody>
                {teamMembers.map(m => {
                  const rec = todayData[m.id];
                  if (!rec) return (
                    <tr key={m.id}><td style={{ fontWeight: 500 }}>{m.name}</td><td colSpan={3} style={{ color: 'var(--text-tertiary)' }}>Not marked</td></tr>
                  );
                  return (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 500 }}>
                        {m.name}
                        {m.id === startup?.leaderId && <span className="badge badge-info" style={{ marginLeft: '0.5rem', fontSize: '0.625rem' }}>LEADER</span>}
                      </td>
                      <td>{TIMESLOTS[rec.timeslot]?.label || rec.timeslot}</td>
                      <td>
                        <span className={`badge badge-${rec.locationStatus === 'valid' ? 'success' : rec.locationStatus === 'invalid' ? 'danger' : 'warning'}`}>
                          {rec.locationStatus} {rec.locationDistance ? `(${rec.locationDistance}m)` : ''}
                        </span>
                      </td>
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
