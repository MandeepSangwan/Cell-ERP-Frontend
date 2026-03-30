import { LECTURES, formatTime } from '../../utils/constants';

export const WorkPeriodPicker = ({ checkIn, checkOut, onChangeIn, onChangeOut, coveredLectures = [] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label>Check In</label>
          <input type="time" value={checkIn || ''} onChange={(e) => onChangeIn(e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label>Check Out</label>
          <input type="time" value={checkOut || ''} onChange={(e) => onChangeOut(e.target.value)} />
        </div>
      </div>

      {coveredLectures.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {LECTURES.map(l => {
            const isCovered = coveredLectures.includes(l.id);
            return (
              <span key={l.id} className={`badge ${isCovered ? 'badge-success' : 'badge-neutral'}`}
                style={{ fontSize: '0.6875rem', transition: 'all 0.15s ease' }}>
                {l.id}: {formatTime(l.start)}–{formatTime(l.end)}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
