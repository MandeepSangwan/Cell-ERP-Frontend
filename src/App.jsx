import { useState } from 'react';
import './App.css';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { Dashboard } from './pages/Dashboard';
import { Attendance } from './pages/Attendance';
import { Committees } from './pages/Committees';
import { CreateCommittee } from './pages/CreateCommittee';
import { TimeSlots } from './pages/TimeSlots';
import { AdminPanel } from './pages/AdminPanel';

const TAB_TITLES = {
  dashboard: 'Dashboard',
  attendance: 'Mark Attendance',
  committees: 'Committees',
  'create-committee': 'Create Committee',
  timeslots: 'Time Slots',
  admin: 'Admin Panel',
};

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderPage = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'attendance':
        return <Attendance />;
      case 'committees':
        return <Committees setCurrentTab={setCurrentTab} />;
      case 'create-committee':
        return <CreateCommittee setCurrentTab={setCurrentTab} />;
      case 'timeslots':
        return <TimeSlots />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="main-wrapper">
        <Header title={TAB_TITLES[currentTab]} />
        {renderPage()}
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
