import { useState } from 'react';
import { CalendarPlus, Trash2, Clock, Users, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const TimeSlots = () => {
  const { timeSlots, addTimeSlot, deleteTimeSlot, members } = useAppContext();
  const [label, setLabel] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim() || !date) return;
    addTimeSlot(label, date);
    setLabel('');
  };

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>Time Slots</h1>
          <p>Create and manage attendance sessions.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>

        {/* Create Form */}
        <div className="section-card animate-fade-in">
          <h2 style={{ marginBottom: '1.25rem' }}>
            <CalendarPlus size={18} style={{ color: 'var(--blue-500)' }} /> New Session
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Session Label</label>
              <input
                type="text"
                placeholder="e.g. Weekly Standup"
                value={label}
                onChange={e => setLabel(e.target.value)}
                required
              />
              <span className="hint">A descriptive name for this session.</span>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.625rem' }}>
              <CalendarPlus size={16} /> Create Session
            </button>
          </form>
        </div>

        {/* Existing Slots */}
        <div className="section-card animate-fade-in" style={{ animationDelay: '80ms' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2><Clock size={18} style={{ color: 'var(--blue-500)' }} /> Active Sessions</h2>
            <span className="badge badge-info">{timeSlots.length} sessions</span>
          </div>

          {timeSlots.length === 0 ? (
            <div className="empty-state">
              <Calendar size={40} opacity={0.25} />
              <p>No sessions created yet.</p>
              <p style={{ fontSize: '0.85rem' }}>Use the form to create your first session.</p>
            </div>
          ) : (
            <div className="slot-list">
              {timeSlots.map((slot, idx) => (
                <div key={slot.id} className="slot-item animate-fade-in" style={{ animationDelay: `${idx * 40}ms` }}>
                  <div className="slot-info">
                    <span className="slot-label">{slot.label}</span>
                    <span className="slot-date">
                      {new Date(slot.date).toLocaleDateString('en-US', {
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
                      <Users size={14} /> {members.length}
                    </div>
                    <button
                      className="btn-icon danger"
                      onClick={() => deleteTimeSlot(slot.id)}
                      title="Delete Session"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
