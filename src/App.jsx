import { useState } from 'react';
import './App.css';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { TimeSlots } from './pages/TimeSlots';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div className="app-container">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      {currentTab === 'dashboard' && <Dashboard />}
      {currentTab === 'timeslots' && <TimeSlots />}
      
    </div>
  );
}

export default App;
