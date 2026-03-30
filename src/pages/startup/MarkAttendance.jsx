import { useState } from 'react';
import { Camera, MapPin, Clock, CheckCircle2, Users, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { CameraCapture } from '../../components/startup/CameraCapture';
import { LocationBadge } from '../../components/startup/LocationBadge';
import { TIMESLOTS, today } from '../../utils/constants';
import { getCurrentPosition } from '../../utils/location';

export const StartupMarkAttendance = () => {
  const { selectedStartup, startups, getStartupMembers, markStartupTeamAttendance, getStartupAttendanceForDate, currentUser, showToast, setStartupTimeslot } = useAppContext();
  const startup = startups.find(s => s.id === selectedStartup);
  const teamMembers = getStartupMembers(selectedStartup);
  const isLeader = currentUser?.id === startup?.leaderId;
  const existingAttendance = getStartupAttendanceForDate(today(), selectedStartup);

  const [selectedTimeslot, setSelectedTimeslotLocal] = useState(startup?.selectedTimeslot || '');
  const [presentMembers, setPresentMembers] = useState(teamMembers.map(m => m.id));
  const [photoUrl, setPhotoUrl] = useState(null);
  const [coords, setCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState(null); // { valid, distance }
  const [fetchingGPS, setFetchingGPS] = useState(false);
  const [step, setStep] = useState(1); // 1: timeslot, 2: members, 3: camera+gps, 4: confirm

  const alreadyMarked = Object.keys(existingAttendance).length > 0;

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const toggleMember = (memberId) => {
    setPresentMembers(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  const fetchGPS = async () => {
    setFetchingGPS(true);
    try {
      const position = await getCurrentPosition();
      setCoords(position);
      // Location validation will happen in context
      const { isWithinCollege } = await import('../../utils/location');
      const result = isWithinCollege(position.latitude, position.longitude);
      setLocationStatus(result);
      if (result.valid) {
        showToast(`Location verified — ${result.distance}m from campus`);
      } else {
        showToast(`Location invalid — ${result.distance}m from campus (max ${500}m)`, 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
    setFetchingGPS(false);
  };

  const handleSubmit = () => {
    if (!selectedTimeslot) { showToast('Select a timeslot', 'error'); return; }
    if (!photoUrl) { showToast('Photo is required for verification', 'error'); return; }
    if (!coords) { showToast('GPS location is required', 'error'); return; }
    if (!locationStatus?.valid) { showToast('Cannot mark attendance — location is outside campus', 'error'); return; }

    markStartupTeamAttendance(today(), selectedStartup, selectedTimeslot, presentMembers, photoUrl, coords);

    // Lock the timeslot for the startup
    if (!startup?.selectedTimeslot) {
      setStartupTimeslot(selectedStartup, selectedTimeslot);
    }

    showToast('Attendance marked successfully!');
    setStep(4);
  };

  if (alreadyMarked && step !== 4) {
    return (
      <div className="main-content">
        <div className="header-bar"><div><h1>Mark Attendance</h1><p>Today's attendance has already been recorded.</p></div></div>
        <div className="section-card animate-fade-in">
          <div className="empty-state" style={{ padding: '3rem 2rem' }}>
            <CheckCircle2 size={48} style={{ color: 'var(--success)' }} />
            <h3 style={{ marginTop: '1rem' }}>Attendance Already Marked</h3>
            <p>Today's attendance for {startup?.name} has been recorded. Check the Dashboard for details.</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="main-content">
        <div className="header-bar"><div><h1>Attendance Submitted</h1></div></div>
        <div className="section-card animate-scale-in" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <CheckCircle2 size={56} style={{ color: 'var(--success)' }} />
          <h2 style={{ marginTop: '1rem' }}>Attendance Marked Successfully!</h2>
          <p style={{ color: 'var(--text-tertiary)', maxWidth: '400px', margin: '0.5rem auto 0' }}>
            {presentMembers.length} of {teamMembers.length} members marked present for {TIMESLOTS[selectedTimeslot]?.label}.
          </p>
          {locationStatus && (
            <div style={{ marginTop: '1.5rem' }}>
              <LocationBadge locationStatus={locationStatus.valid ? 'valid' : 'invalid'} distance={locationStatus.distance} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>Mark Attendance</h1>
          <p>{startup?.name} — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="header-actions">
          {!isLeader && <span className="badge badge-warning"><AlertTriangle size={12} /> Marking as substitute</span>}
        </div>
      </div>

      {/* Step indicator */}
      <div className="step-indicator" style={{ marginBottom: '1.5rem' }}>
        {[{ n: 1, label: 'Timeslot' }, { n: 2, label: 'Team' }, { n: 3, label: 'Verify' }].map(s => (
          <div key={s.n} className={`step-dot ${step >= s.n ? 'active' : ''} ${step === s.n ? 'current' : ''}`}>
            <span className="step-number">{s.n}</span>
            <span className="step-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Timeslot Selection */}
      {step === 1 && (
        <div className="section-card animate-fade-in">
          <h2><Clock size={18} style={{ color: 'var(--blue-500)' }} /> Choose Timeslot</h2>
          {startup?.selectedTimeslot && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
              Your team's timeslot is locked to <strong>{TIMESLOTS[startup.selectedTimeslot]?.label}</strong>. All members share this slot.
            </p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
            {Object.values(TIMESLOTS).map(slot => {
              const isLocked = startup?.selectedTimeslot && startup.selectedTimeslot !== slot.id;
              const isSelected = selectedTimeslot === slot.id;
              return (
                <button key={slot.id} disabled={isLocked}
                  onClick={() => setSelectedTimeslotLocal(slot.id)}
                  style={{
                    padding: '1.5rem', borderRadius: 'var(--radius-lg)',
                    border: `2px solid ${isSelected ? 'var(--blue-500)' : isLocked ? 'var(--border-light)' : 'var(--border-default)'}`,
                    background: isSelected ? 'var(--blue-50)' : 'var(--bg-panel)',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.5 : 1,
                    textAlign: 'left', transition: 'all var(--transition-fast)',
                  }}>
                  <div style={{ fontWeight: 700, fontSize: '1.125rem', color: isSelected ? 'var(--blue-700)' : 'var(--text-primary)' }}>{slot.label}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{slot.time}</div>
                  {isLocked && <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.5rem' }}>Locked — team already chose another slot</div>}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" disabled={!selectedTimeslot} onClick={() => setStep(2)}>
              Next: Select Team →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Present Members */}
      {step === 2 && (
        <div className="section-card animate-fade-in">
          <h2><Users size={18} style={{ color: 'var(--blue-500)' }} /> Who's Present?</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
            Select the team members who are present today. All members are selected by default.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem' }}>
            {teamMembers.map(m => {
              const isSelected = presentMembers.includes(m.id);
              return (
                <button key={m.id} onClick={() => toggleMember(m.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isSelected ? 'var(--success)' : 'var(--border-light)'}`,
                    background: isSelected ? '#f0fdf4' : 'var(--bg-subtle)',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'all var(--transition-fast)',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="member-avatar-sm" style={{
                      background: isSelected ? 'var(--success)' : 'var(--blue-50)',
                      color: isSelected ? '#fff' : 'var(--blue-600)',
                      width: '34px', height: '34px', fontSize: '0.75rem',
                    }}>{getInitials(m.name)}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{m.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{m.rollNumber} · {m.id === startup?.leaderId ? 'Leader' : 'Member'}</div>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
            <button className="btn-primary" onClick={() => { setStep(3); fetchGPS(); }}>
              Next: Verify Location →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Camera + GPS Verification */}
      {step === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="section-card animate-fade-in">
            <h2><Camera size={18} style={{ color: 'var(--blue-500)' }} /> Photo Verification</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
              Take a photo as proof of presence. This will be stored with your attendance record.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <CameraCapture onCapture={setPhotoUrl} />
            </div>
          </div>

          <div className="section-card animate-fade-in" style={{ animationDelay: '80ms' }}>
            <h2><MapPin size={18} style={{ color: 'var(--blue-500)' }} /> GPS Location</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
              Your location is checked against the college campus boundary.
            </p>
            <div style={{ marginTop: '1rem' }}>
              {fetchingGPS ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <div className="spinner" />
                  <p>Fetching GPS location...</p>
                </div>
              ) : locationStatus ? (
                <LocationBadge locationStatus={locationStatus.valid ? 'valid' : 'invalid'} distance={locationStatus.distance} />
              ) : (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <MapPin size={32} style={{ color: 'var(--text-tertiary)' }} />
                  <button className="btn-primary" onClick={fetchGPS} style={{ marginTop: '0.75rem' }}>Get Location</button>
                </div>
              )}

              {coords && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-tertiary)' }}>
                  Lat: {coords.latitude.toFixed(6)}, Lng: {coords.longitude.toFixed(6)}<br />
                  Accuracy: ±{Math.round(coords.accuracy)}m
                </div>
              )}
            </div>

            {/* Submit */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
              <button className="btn-primary" onClick={handleSubmit}
                disabled={!photoUrl || !locationStatus?.valid}
                style={{ width: '100%', padding: '0.75rem' }}>
                <CheckCircle2 size={18} /> Confirm & Submit Attendance
              </button>
              <button className="btn-secondary" onClick={() => setStep(2)} style={{ width: '100%' }}>← Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
