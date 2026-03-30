import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const initialMembers = [
  { id: '1', name: 'Alex Johnson', role: 'Event Coordinator', email: 'alex.j@ecell.org' },
  { id: '2', name: 'Samantha Lee', role: 'Marketing Lead', email: 'sam.lee@ecell.org' },
  { id: '3', name: 'Michael Chen', role: 'Sponsorship Head', email: 'michael.c@ecell.org' },
  { id: '4', name: 'Emily Davis', role: 'Creative Director', email: 'emily.d@ecell.org' },
  { id: '5', name: 'James Wilson', role: 'Logistics Manager', email: 'james.w@ecell.org' },
  { id: '6', name: 'Priya Sharma', role: 'Finance Lead', email: 'priya.s@ecell.org' },
  { id: '7', name: 'Ravi Patel', role: 'Tech Lead', email: 'ravi.p@ecell.org' },
  { id: '8', name: 'Sophie Turner', role: 'PR Manager', email: 'sophie.t@ecell.org' },
];

const initialCommittees = [
  {
    id: 'c-1',
    name: 'Events Committee',
    description: 'Handles all E-Cell events and workshops',
    members: ['1', '5', '8'],
    createdAt: '2026-03-15',
  },
  {
    id: 'c-2',
    name: 'Marketing Committee',
    description: 'Brand management and outreach',
    members: ['2', '4'],
    createdAt: '2026-03-18',
  },
  {
    id: 'c-3',
    name: 'Technical Committee',
    description: 'App development and tech infrastructure',
    members: ['7', '3'],
    createdAt: '2026-03-20',
  },
  {
    id: 'c-4',
    name: 'Finance Committee',
    description: 'Budget planning and sponsorships',
    members: ['6', '3'],
    createdAt: '2026-03-22',
  },
];

export const AppProvider = ({ children }) => {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('erp_members');
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [committees, setCommittees] = useState(() => {
    const saved = localStorage.getItem('erp_committees');
    return saved ? JSON.parse(saved) : initialCommittees;
  });

  const [timeSlots, setTimeSlots] = useState(() => {
    const saved = localStorage.getItem('erp_timeslots');
    return saved ? JSON.parse(saved) : [
      { id: 'ts-1', label: 'Orientation Meeting', date: '2026-03-28' },
      { id: 'ts-2', label: 'Weekly Standup', date: '2026-03-29' },
      { id: 'ts-3', label: 'Sprint Review', date: '2026-03-30' },
    ];
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('erp_attendance');
    return saved ? JSON.parse(saved) : {
      'ts-1': { '1': 'Present', '2': 'Present', '3': 'Absent', '4': 'Present', '5': 'Present', '6': 'Present', '7': 'Absent', '8': 'Present' },
      'ts-2': { '1': 'Present', '2': 'Absent', '3': 'Present', '4': 'Present', '5': 'Present', '6': 'Present', '7': 'Present', '8': 'Absent' },
    };
  });

  const [toasts, setToasts] = useState([]);

  // Persist
  useEffect(() => { localStorage.setItem('erp_members', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem('erp_committees', JSON.stringify(committees)); }, [committees]);
  useEffect(() => { localStorage.setItem('erp_timeslots', JSON.stringify(timeSlots)); }, [timeSlots]);
  useEffect(() => { localStorage.setItem('erp_attendance', JSON.stringify(attendance)); }, [attendance]);

  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const addTimeSlot = (label, date) => {
    const newSlot = { id: `ts-${Date.now()}`, label, date };
    setTimeSlots(prev => [...prev, newSlot]);
    showToast(`Session "${label}" created`);
  };

  const deleteTimeSlot = (id) => {
    setTimeSlots(prev => prev.filter(ts => ts.id !== id));
    setAttendance(prev => {
      const newA = { ...prev };
      delete newA[id];
      return newA;
    });
    showToast('Session deleted');
  };

  const markAttendance = (timeSlotId, memberId, status) => {
    setAttendance(prev => ({
      ...prev,
      [timeSlotId]: {
        ...prev[timeSlotId],
        [memberId]: status,
      },
    }));
  };

  const addMember = (name, role, email = '') => {
    const newMember = { id: `m-${Date.now()}`, name, role, email };
    setMembers(prev => [...prev, newMember]);
    showToast(`"${name}" added to members`);
    return newMember;
  };

  const removeMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setCommittees(prev => prev.map(c => ({
      ...c,
      members: c.members.filter(mId => mId !== id),
    })));
    showToast('Member removed');
  };

  const addCommittee = (name, description, memberIds) => {
    const newCommittee = {
      id: `c-${Date.now()}`,
      name,
      description,
      members: memberIds,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCommittees(prev => [...prev, newCommittee]);
    showToast(`"${name}" committee created`);
  };

  const deleteCommittee = (id) => {
    setCommittees(prev => prev.filter(c => c.id !== id));
    showToast('Committee deleted');
  };

  const getMemberById = (id) => members.find(m => m.id === id);

  const getCommitteeMembers = (committeeId) => {
    const committee = committees.find(c => c.id === committeeId);
    if (!committee) return [];
    return committee.members.map(mId => getMemberById(mId)).filter(Boolean);
  };

  return (
    <AppContext.Provider value={{
      members, setMembers, addMember, removeMember, getMemberById,
      committees, addCommittee, deleteCommittee, getCommitteeMembers,
      timeSlots, addTimeSlot, deleteTimeSlot,
      attendance, markAttendance,
      toasts,
    }}>
      {children}
    </AppContext.Provider>
  );
};
