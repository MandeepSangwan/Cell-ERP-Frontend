import { useMemo } from 'react';
import { LayoutDashboard, Users, Rocket, CalendarDays, TrendingUp, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { today } from '../../utils/constants';

export const AdminDashboard = () => {
  const { committees, startups, members, committeeAttendance, startupAttendance } = useAppContext();

  const stats = useMemo(() => {
    let commTotal = 0, commPresent = 0;
    Object.values(committeeAttendance).forEach(dayData => {
      Object.values(dayData).forEach(cData => {
        Object.values(cData).forEach(rec => {
          commTotal++;
          if (rec.status === 'present') commPresent++;
        });
      });
    });

    let startTotal = 0, startPresent = 0, locInvalid = 0;
    Object.values(startupAttendance).forEach(dayData => {
      Object.values(dayData).forEach(sData => {
        Object.values(sData).forEach(rec => {
          startTotal++;
          if (rec.status === 'present') startPresent++;
          if (rec.locationStatus === 'invalid') locInvalid++;
        });
      });
    });

    const commRate = commTotal > 0 ? Math.round((commPresent / commTotal) * 100) : 0;
    const startRate = startTotal > 0 ? Math.round((startPresent / startTotal) * 100) : 0;

    return { commTotal, commPresent, commRate, startTotal, startPresent, startRate, locInvalid };
  }, [committeeAttendance, startupAttendance]);

  const todayComm = committeeAttendance[today()] || {};
  const todayStart = startupAttendance[today()] || {};

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Global oversight across E-Cell committees and incubated startups.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card animate-fade-in">
          <span className="stat-card-title">Committees</span>
          <span className="stat-card-value">{committees.length}</span>
          <Users className="stat-card-icon" size={28} />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            Avg. {stats.commRate}% attendance
          </div>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '60ms' }}>
          <span className="stat-card-title">Incubated Startups</span>
          <span className="stat-card-value">{startups.length}</span>
          <Rocket className="stat-card-icon" size={28} />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            Avg. {stats.startRate}% attendance
          </div>
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '120ms' }}>
          <span className="stat-card-title">Total Members</span>
          <span className="stat-card-value">{members.length}</span>
          <CalendarDays className="stat-card-icon" size={28} />
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '180ms' }}>
          <span className="stat-card-title">Proxy Alerts</span>
          <span className="stat-card-value" style={{ color: stats.locInvalid > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {stats.locInvalid}
          </span>
          <ShieldAlert className="stat-card-icon" size={28} style={{ color: stats.locInvalid > 0 ? 'var(--danger)' : 'var(--success)' }} />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            Invalid location attempts
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="section-card animate-fade-in" style={{ animationDelay: '240ms' }}>
          <h3>Today's Committees Overview</h3>
          <div className="data-table-container">
            <table className="data-table">
              <thead><tr><th>Committee</th><th>Present</th><th>Absent</th></tr></thead>
              <tbody>
                {committees.map(c => {
                  const dayData = todayComm[c.id] || {};
                  const present = Object.values(dayData).filter(r => r.status === 'present').length;
                  const total = c.memberIds.length;
                  return (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{present}</td>
                      <td>{total - present}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section-card animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h3>Today's Startups Overview</h3>
          <div className="data-table-container">
            <table className="data-table">
              <thead><tr><th>Startup</th><th>Present</th><th>Absent</th></tr></thead>
              <tbody>
                {startups.map(s => {
                  const dayData = todayStart[s.id] || {};
                  const present = Object.values(dayData).filter(r => r.status === 'present').length;
                  const total = s.memberIds.length;
                  return (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{present}</td>
                      <td>{total - present}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
