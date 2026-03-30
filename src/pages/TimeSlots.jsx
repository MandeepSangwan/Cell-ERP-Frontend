import { useState } from 'react';
import { CalendarPlus, Trash2, Clock, Users } from 'lucide-react';
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
    // keep date same for convenience
  };

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>Time Slots</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage meeting and event sessions.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Create Form */}
        <div className="glass-panel section-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CalendarPlus size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.2rem' }}>New Session</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Session Label (e.g. Weekly Meet)</label>
              <input 
                type="text" 
                placeholder="Enter session name..." 
                value={label}
                onChange={e => setLabel(e.target.value)}
                required
              />
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
            
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Create Session
            </button>
          </form>
        </div>

        {/* Existing Slots List */}
        <div className="glass-panel section-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Clock size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.2rem' }}>Active Sessions</h2>
          </div>

          {timeSlots.length === 0 ? (
            <div className="empty-state">
              <p>No active sessions.</p>
            </div>
          ) : (
            <div className="slot-list">
              {timeSlots.map(slot => (
                <div key={slot.id} className="slot-item">
                  <div className="slot-info">
                    <span className="slot-label">{slot.label}</span>
                    <span className="slot-date">
                      {new Date(slot.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <Users size={16} /> {members.length} Members
                    </div>
                    <button 
                      className="btn-icon" 
                      onClick={() => deleteTimeSlot(slot.id)}
                      title="Delete Session"
                    >
                      <Trash2 size={18} />
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
