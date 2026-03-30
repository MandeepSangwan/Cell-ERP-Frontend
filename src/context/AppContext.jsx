import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const initialMembers = [
  { id: '1', name: 'Alex Johnson', role: 'Event Coordinator' },
  { id: '2', name: 'Samantha Lee', role: 'Marketing Lead' },
  { id: '3', name: 'Michael Chen', role: 'Sponsorship Head' },
  { id: '4', name: 'Emily Davis', role: 'Creative Director' },
  { id: '5', name: 'James Wilson', role: 'Logistics Manager' },
];

export const AppProvider = ({ children }) => {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('erp_members');
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [timeSlots, setTimeSlots] = useState(() => {
    const saved = localStorage.getItem('erp_timeslots');
    return saved ? JSON.parse(saved) : [{ id: 'ts-1', label: 'Orientation Meeting', date: new Date().toISOString().split('T')[0] }];
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('erp_attendance');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('erp_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('erp_timeslots', JSON.stringify(timeSlots));
  }, [timeSlots]);

  useEffect(() => {
    localStorage.setItem('erp_attendance', JSON.stringify(attendance));
  }, [attendance]);

  const addTimeSlot = (label, date) => {
    const newSlot = {
      id: `ts-${Date.now()}`,
      label,
      date,
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const deleteTimeSlot = (id) => {
    setTimeSlots(timeSlots.filter(ts => ts.id !== id));
    const newAttendance = { ...attendance };
    delete newAttendance[id];
    setAttendance(newAttendance);
  };

  const markAttendance = (timeSlotId, memberId, status) => {
    setAttendance(prev => {
      const slotData = prev[timeSlotId] || {};
      return {
        ...prev,
        [timeSlotId]: {
          ...slotData,
          [memberId]: status
        }
      };
    });
  };

  const addMember = (name, role) => {
    setMembers([...members, { id: `m-${Date.now()}`, name, role }]);
  };

  return (
    <AppContext.Provider value={{
      members, setMembers, addMember,
      timeSlots, addTimeSlot, deleteTimeSlot,
      attendance, markAttendance
    }}>
      {children}
    </AppContext.Provider>
  );
};
