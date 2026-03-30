// ══════════════════════════════════════════════
// CONSTANTS — E-Cell Attendance System
// ══════════════════════════════════════════════

// ── College Location (for GPS verification) ──
export const COLLEGE = {
  name: 'CGC University, Mohali',
  latitude: 30.681557,
  longitude: 76.608154,
  radiusMeters: 1000,     // acceptable distance
};

// ── Fixed Timeslots ──
export const TIMESLOTS = {
  slot_1: { id: 'slot_1', label: 'Slot 1', time: '9:30 AM – 12:50 PM', start: '09:30', end: '12:50' },
  slot_2: { id: 'slot_2', label: 'Slot 2', time: '1:35 PM – 4:35 PM',  start: '13:35', end: '16:35' },
};

// ── Lecture Periods ──
export const LECTURES = [
  { id: 'L1', label: 'Lecture 1', start: '09:30', end: '10:20', timeslot: 'slot_1', order: 1 },
  { id: 'L2', label: 'Lecture 2', start: '10:20', end: '11:10', timeslot: 'slot_1', order: 2 },
  { id: 'L3', label: 'Lecture 3', start: '11:10', end: '12:00', timeslot: 'slot_1', order: 3 },
  { id: 'L4', label: 'Lecture 4', start: '12:00', end: '12:50', timeslot: 'slot_1', order: 4 },
  { id: 'L5', label: 'Lecture 5', start: '13:35', end: '14:25', timeslot: 'slot_2', order: 5 },
  { id: 'L6', label: 'Lecture 6', start: '14:25', end: '15:15', timeslot: 'slot_2', order: 6 },
  { id: 'L7', label: 'Lecture 7', start: '15:15', end: '16:05', timeslot: 'slot_2', order: 7 },
  { id: 'L8', label: 'Lecture 8', start: '16:05', end: '16:35', timeslot: 'slot_2', order: 8 },
];

// ── Helper: get lectures covered by a time range ──
export const getCoveredLectures = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return [];
  return LECTURES.filter(l => l.start < checkOut && l.end > checkIn);
};

// ── User Roles ──
export const USER_ROLES = {
  ADMIN: 'admin',
  COMMITTEE_HEAD: 'committee_head',
  COMMITTEE_MEMBER: 'committee_member',
  STARTUP_LEADER: 'startup_leader',
  STARTUP_MEMBER: 'startup_member',
};

// ── Attendance Statuses ──
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  PENDING: 'pending',
};

// ── Location Statuses ──
export const LOCATION_STATUS = {
  VALID: 'valid',
  INVALID: 'invalid',
  PENDING: 'pending',
};

// ── Today's date helper ──
export const today = () => new Date().toISOString().split('T')[0];

// ── Format time for display ──
export const formatTime = (time24) => {
  if (!time24) return '—';
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};
