import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCoveredLectures, today } from '../utils/constants';
import { isWithinCollege } from '../utils/location';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

// ══════════════════════════════════════════════
// SEED DATA — matches PostgreSQL schema
// ══════════════════════════════════════════════

const seedMembers = [
  // Admin
  { id: 'a-1', name: 'Admin User', rollNumber: 'ADMIN001', email: 'admin@ecell.org', role: 'admin' },
  // Committee Heads
  { id: 'ch-1', name: 'Aarav Mehta',   rollNumber: 'A2024001', email: 'aarav@ecell.org',   role: 'committee_head' },
  { id: 'ch-2', name: 'Diya Kapoor',   rollNumber: 'A2024002', email: 'diya@ecell.org',    role: 'committee_head' },
  { id: 'ch-3', name: 'Rohan Gupta',   rollNumber: 'A2024003', email: 'rohan@ecell.org',   role: 'committee_head' },
  // Committee Members
  { id: 'cm-1', name: 'Neha Singh',    rollNumber: 'A2024010', email: 'neha@ecell.org',    role: 'committee_member' },
  { id: 'cm-2', name: 'Karan Verma',   rollNumber: 'A2024011', email: 'karan@ecell.org',   role: 'committee_member' },
  { id: 'cm-3', name: 'Priya Joshi',   rollNumber: 'A2024012', email: 'priya.j@ecell.org', role: 'committee_member' },
  { id: 'cm-4', name: 'Vikram Rao',    rollNumber: 'A2024013', email: 'vikram@ecell.org',  role: 'committee_member' },
  { id: 'cm-5', name: 'Ananya Desai',  rollNumber: 'A2024014', email: 'ananya@ecell.org',  role: 'committee_member' },
  { id: 'cm-6', name: 'Arjun Nair',    rollNumber: 'A2024015', email: 'arjun@ecell.org',   role: 'committee_member' },
  // Startup Leaders
  { id: 'sl-1', name: 'Ishaan Kumar',  rollNumber: 'A2024020', email: 'ishaan@ecell.org',  role: 'startup_leader' },
  { id: 'sl-2', name: 'Meera Patel',   rollNumber: 'A2024021', email: 'meera@ecell.org',   role: 'startup_leader' },
  // Startup Members
  { id: 'sm-1', name: 'Rahul Sharma',  rollNumber: 'A2024030', email: 'rahul@ecell.org',   role: 'startup_member' },
  { id: 'sm-2', name: 'Sneha Iyer',    rollNumber: 'A2024031', email: 'sneha@ecell.org',   role: 'startup_member' },
  { id: 'sm-3', name: 'Aditya Chopra', rollNumber: 'A2024032', email: 'aditya@ecell.org',  role: 'startup_member' },
  { id: 'sm-4', name: 'Kavya Reddy',   rollNumber: 'A2024033', email: 'kavya@ecell.org',   role: 'startup_member' },
];

const seedCommittees = [
  { id: 'com-1', name: 'Technical Committee',  description: 'App development and tech infrastructure', headId: 'ch-1', memberIds: ['ch-1', 'cm-1', 'cm-2'] },
  { id: 'com-2', name: 'Events Committee',     description: 'All E-Cell events and workshops',         headId: 'ch-2', memberIds: ['ch-2', 'cm-3', 'cm-4'] },
  { id: 'com-3', name: 'Marketing Committee',  description: 'Brand management and outreach',           headId: 'ch-3', memberIds: ['ch-3', 'cm-5', 'cm-6'] },
];

const seedStartups = [
  { id: 'str-1', name: 'EcoTrack', description: 'Sustainability tracking platform', leaderId: 'sl-1', memberIds: ['sl-1', 'sm-1', 'sm-2'], selectedTimeslot: 'slot_1' },
  { id: 'str-2', name: 'FinPulse', description: 'Student fintech micro-lending app', leaderId: 'sl-2', memberIds: ['sl-2', 'sm-3', 'sm-4'], selectedTimeslot: null },
];

// Sample committee attendance: { date: { committeeId: { memberId: record } } }
const seedCommitteeAttendance = {
  '2026-03-28': {
    'com-1': {
      'ch-1': { status: 'present', checkIn: '09:30', checkOut: '12:50', lecturesCovered: ['L1','L2','L3','L4'], markedBy: 'ch-1', markedByName: 'Aarav Mehta' },
      'cm-1': { status: 'present', checkIn: '09:30', checkOut: '11:10', lecturesCovered: ['L1','L2'], markedBy: 'ch-1', markedByName: 'Aarav Mehta' },
      'cm-2': { status: 'absent',  checkIn: null,    checkOut: null,    lecturesCovered: [],           markedBy: 'ch-1', markedByName: 'Aarav Mehta' },
    },
  },
};

// Sample startup attendance: { date: { startupId: { memberId: record } } }
const seedStartupAttendance = {
  '2026-03-28': {
    'str-1': {
      'sl-1': { status: 'present', timeslot: 'slot_1', photoUrl: null, latitude: 28.5449, longitude: 77.3341, locationStatus: 'valid', locationDistance: 15, markedBy: 'sl-1', markedByName: 'Ishaan Kumar' },
      'sm-1': { status: 'present', timeslot: 'slot_1', photoUrl: null, latitude: 28.5449, longitude: 77.3341, locationStatus: 'valid', locationDistance: 15, markedBy: 'sl-1', markedByName: 'Ishaan Kumar' },
      'sm-2': { status: 'absent',  timeslot: 'slot_1', photoUrl: null, latitude: null,    longitude: null,    locationStatus: 'pending', locationDistance: null, markedBy: 'sl-1', markedByName: 'Ishaan Kumar' },
    },
  },
};


// ══════════════════════════════════════════════
// PROVIDER
// ══════════════════════════════════════════════

export const AppProvider = ({ children }) => {
  // ── Portal State ──
  const [portal, setPortal] = useState(() => localStorage.getItem('erp_portal') || null);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('erp_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedCommittee, setSelectedCommittee] = useState(() => localStorage.getItem('erp_selected_committee') || null);
  const [selectedStartup, setSelectedStartup] = useState(() => localStorage.getItem('erp_selected_startup') || null);

  // ── Data State ──
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('erp_v2_members');
    return saved ? JSON.parse(saved) : seedMembers;
  });

  const [committees, setCommittees] = useState(() => {
    const saved = localStorage.getItem('erp_v2_committees');
    return saved ? JSON.parse(saved) : seedCommittees;
  });

  const [startups, setStartups] = useState(() => {
    const saved = localStorage.getItem('erp_v2_startups');
    return saved ? JSON.parse(saved) : seedStartups;
  });

  const [committeeAttendance, setCommitteeAttendance] = useState(() => {
    const saved = localStorage.getItem('erp_v2_committee_attendance');
    return saved ? JSON.parse(saved) : seedCommitteeAttendance;
  });

  const [startupAttendance, setStartupAttendance] = useState(() => {
    const saved = localStorage.getItem('erp_v2_startup_attendance');
    return saved ? JSON.parse(saved) : seedStartupAttendance;
  });

  const [toasts, setToasts] = useState([]);

  // ── Persistence ──
  useEffect(() => { localStorage.setItem('erp_portal', portal || ''); }, [portal]);
  useEffect(() => { localStorage.setItem('erp_current_user', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('erp_selected_committee', selectedCommittee || ''); }, [selectedCommittee]);
  useEffect(() => { localStorage.setItem('erp_selected_startup', selectedStartup || ''); }, [selectedStartup]);
  useEffect(() => { localStorage.setItem('erp_v2_members', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem('erp_v2_committees', JSON.stringify(committees)); }, [committees]);
  useEffect(() => { localStorage.setItem('erp_v2_startups', JSON.stringify(startups)); }, [startups]);
  useEffect(() => { localStorage.setItem('erp_v2_committee_attendance', JSON.stringify(committeeAttendance)); }, [committeeAttendance]);
  useEffect(() => { localStorage.setItem('erp_v2_startup_attendance', JSON.stringify(startupAttendance)); }, [startupAttendance]);

  // ── Toasts ──
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  // ══════════════════════════════════════════
  // PORTAL ACTIONS
  // ══════════════════════════════════════════

  const loginAsCommitteeHead = (committeeId) => {
    const committee = committees.find(c => c.id === committeeId);
    if (!committee) return;
    const head = members.find(m => m.id === committee.headId);
    setPortal('committee');
    setCurrentUser(head);
    setSelectedCommittee(committeeId);
  };

  const loginAsStartup = (startupId, userId) => {
    const startup = startups.find(s => s.id === startupId);
    if (!startup) return;
    const user = members.find(m => m.id === userId);
    setPortal('startup');
    setCurrentUser(user);
    setSelectedStartup(startupId);
  };

  const loginAsAdmin = () => {
    const admin = members.find(m => m.role === 'admin');
    setPortal('admin');
    setCurrentUser(admin);
  };

  const logout = () => {
    setPortal(null);
    setCurrentUser(null);
    setSelectedCommittee(null);
    setSelectedStartup(null);
  };

  // ══════════════════════════════════════════
  // MEMBER ACTIONS
  // ══════════════════════════════════════════

  const getMemberById = (id) => members.find(m => m.id === id);

  const findMemberByNameOrRoll = (query) => {
    const q = query.toLowerCase().trim();
    return members.find(m =>
      m.name.toLowerCase() === q ||
      m.rollNumber?.toLowerCase() === q
    );
  };

  const addMember = (data) => {
    const newMember = { id: `m-${Date.now()}`, ...data };
    setMembers(prev => [...prev, newMember]);
    showToast(`"${data.name}" added`);
    return newMember;
  };

  const removeMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setCommittees(prev => prev.map(c => ({ ...c, memberIds: c.memberIds.filter(mId => mId !== id) })));
    setStartups(prev => prev.map(s => ({ ...s, memberIds: s.memberIds.filter(mId => mId !== id) })));
    showToast('Member removed');
  };

  // ══════════════════════════════════════════
  // COMMITTEE ACTIONS
  // ══════════════════════════════════════════

  const getCommitteeMembers = (committeeId) => {
    const committee = committees.find(c => c.id === committeeId);
    if (!committee) return [];
    return committee.memberIds.map(id => getMemberById(id)).filter(Boolean);
  };

  const addCommittee = (data) => {
    const newCommittee = { id: `com-${Date.now()}`, ...data, memberIds: data.memberIds || [] };
    setCommittees(prev => [...prev, newCommittee]);
    showToast(`"${data.name}" committee created`);
  };

  const deleteCommittee = (id) => {
    setCommittees(prev => prev.filter(c => c.id !== id));
    showToast('Committee deleted');
  };

  // ══════════════════════════════════════════
  // STARTUP ACTIONS
  // ══════════════════════════════════════════

  const getStartupMembers = (startupId) => {
    const startup = startups.find(s => s.id === startupId);
    if (!startup) return [];
    return startup.memberIds.map(id => getMemberById(id)).filter(Boolean);
  };

  const setStartupTimeslot = (startupId, timeslot) => {
    setStartups(prev => prev.map(s => s.id === startupId ? { ...s, selectedTimeslot: timeslot } : s));
    showToast(`Timeslot updated to ${timeslot === 'slot_1' ? 'Slot 1' : 'Slot 2'}`);
  };

  const addStartup = (data) => {
    const newStartup = { id: `str-${Date.now()}`, ...data, memberIds: data.memberIds || [], selectedTimeslot: null };
    setStartups(prev => [...prev, newStartup]);
    showToast(`"${data.name}" startup created`);
  };

  const deleteStartup = (id) => {
    setStartups(prev => prev.filter(s => s.id !== id));
    showToast('Startup deleted');
  };

  // ══════════════════════════════════════════
  // COMMITTEE ATTENDANCE ACTIONS
  // ══════════════════════════════════════════

  const markCommitteeAttendance = (date, committeeId, memberId, record) => {
    // Auto-compute lectures covered
    const lectures = getCoveredLectures(record.checkIn, record.checkOut).map(l => l.id);
    const head = getMemberById(committees.find(c => c.id === committeeId)?.headId);

    setCommitteeAttendance(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [committeeId]: {
          ...prev[date]?.[committeeId],
          [memberId]: {
            ...record,
            lecturesCovered: lectures,
            markedBy: currentUser?.id,
            markedByName: currentUser?.name || head?.name,
          },
        },
      },
    }));
  };

  const getCommitteeAttendanceForDate = (date, committeeId) => {
    return committeeAttendance[date]?.[committeeId] || {};
  };

  // ══════════════════════════════════════════
  // STARTUP ATTENDANCE ACTIONS
  // ══════════════════════════════════════════

  const markStartupAttendance = (date, startupId, memberId, record) => {
    // Verify location
    let locationResult = { valid: false, distance: null };
    if (record.latitude && record.longitude) {
      locationResult = isWithinCollege(record.latitude, record.longitude);
    }

    setStartupAttendance(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [startupId]: {
          ...prev[date]?.[startupId],
          [memberId]: {
            ...record,
            locationStatus: record.latitude ? (locationResult.valid ? 'valid' : 'invalid') : 'pending',
            locationDistance: locationResult.distance,
            status: record.latitude ? (locationResult.valid ? 'present' : 'invalid') : record.status,
            markedBy: currentUser?.id,
            markedByName: currentUser?.name,
          },
        },
      },
    }));

    return locationResult;
  };

  const markStartupTeamAttendance = (date, startupId, timeslot, presentMemberIds, photoUrl, coords) => {
    const startup = startups.find(s => s.id === startupId);
    if (!startup) return;

    // Set timeslot if not already set
    if (!startup.selectedTimeslot) {
      setStartupTimeslot(startupId, timeslot);
    }

    startup.memberIds.forEach(memberId => {
      const isPresent = presentMemberIds.includes(memberId);
      markStartupAttendance(date, startupId, memberId, {
        timeslot,
        status: isPresent ? 'present' : 'absent',
        photoUrl: isPresent ? photoUrl : null,
        latitude: isPresent ? coords?.latitude : null,
        longitude: isPresent ? coords?.longitude : null,
      });
    });

    showToast('Team attendance marked');
  };

  const getStartupAttendanceForDate = (date, startupId) => {
    return startupAttendance[date]?.[startupId] || {};
  };

  // ══════════════════════════════════════════
  // CLEAR DATA
  // ══════════════════════════════════════════

  const clearAllData = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('erp_')) localStorage.removeItem(key);
    });
    window.location.reload();
  };

  return (
    <AppContext.Provider value={{
      // Portal
      portal, setPortal, currentUser, logout,
      loginAsCommitteeHead, loginAsStartup, loginAsAdmin,
      selectedCommittee, selectedStartup,
      // Members
      members, addMember, removeMember, getMemberById, findMemberByNameOrRoll,
      // Committees
      committees, addCommittee, deleteCommittee, getCommitteeMembers,
      // Startups
      startups, addStartup, deleteStartup, getStartupMembers, setStartupTimeslot,
      // Committee Attendance
      committeeAttendance, markCommitteeAttendance, getCommitteeAttendanceForDate,
      // Startup Attendance
      startupAttendance, markStartupAttendance, markStartupTeamAttendance, getStartupAttendanceForDate,
      // Toasts & Utils
      toasts, showToast, clearAllData,
    }}>
      {children}
    </AppContext.Provider>
  );
};
