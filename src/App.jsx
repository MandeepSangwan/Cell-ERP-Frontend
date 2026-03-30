import { useState, useEffect } from 'react';
import { useAppContext } from './context/AppContext';

// Common
import { PortalSelector } from './pages/PortalSelector';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';

// Committee Portal
import { CommitteeSidebar } from './components/committee/CommitteeSidebar';
import { CommitteeDashboard } from './pages/committee/CommitteeDashboard';
import { CommitteeMarkAttendance } from './pages/committee/MarkAttendance';
import { CommitteeTeamManagement } from './pages/committee/TeamManagement';
import { CommitteeAttendanceHistory } from './pages/committee/AttendanceHistory';

// Startup Portal
import { StartupSidebar } from './components/startup/StartupSidebar';
import { StartupDashboard } from './pages/startup/StartupDashboard';
import { StartupMarkAttendance } from './pages/startup/MarkAttendance';
import { StartupTeamManagement } from './pages/startup/TeamManagement';
import { StartupAttendanceHistory } from './pages/startup/AttendanceHistory';

// Admin Portal
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageCommittees } from './pages/admin/ManageCommittees';
import { ManageStartups } from './pages/admin/ManageStartups';
import { AdminExportData } from './pages/admin/ExportData';

import './App.css';

function App() {
  const { portal } = useAppContext();
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Reset tab when switching portal
  useEffect(() => {
    setCurrentTab('dashboard');
  }, [portal]);

  if (!portal) {
    return (
      <>
        <PortalSelector />
        <ToastContainer />
      </>
    );
  }

  // ── Committee Portal Routing ──
  if (portal === 'committee') {
    return (
      <div className="app-container">
        <CommitteeSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <div className="content-wrapper">
          <Header />
          {currentTab === 'dashboard' && <CommitteeDashboard />}
          {currentTab === 'mark-attendance' && <CommitteeMarkAttendance />}
          {currentTab === 'team' && <CommitteeTeamManagement />}
          {currentTab === 'history' && <CommitteeAttendanceHistory />}
        </div>
        <ToastContainer />
      </div>
    );
  }

  // ── Startup Portal Routing ──
  if (portal === 'startup') {
    return (
      <div className="app-container app-startup">
        <StartupSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <div className="content-wrapper">
          <Header />
          {currentTab === 'dashboard' && <StartupDashboard />}
          {currentTab === 'mark-attendance' && <StartupMarkAttendance />}
          {currentTab === 'team' && <StartupTeamManagement />}
          {currentTab === 'history' && <StartupAttendanceHistory />}
        </div>
        <ToastContainer />
      </div>
    );
  }

  // ── Admin Portal Routing ──
  if (portal === 'admin') {
    return (
      <div className="app-container app-admin">
        <AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <div className="content-wrapper">
          <Header />
          {currentTab === 'dashboard' && <AdminDashboard />}
          {currentTab === 'committees' && <ManageCommittees />}
          {currentTab === 'startups' && <ManageStartups />}
          {currentTab === 'export' && <AdminExportData />}
        </div>
        <ToastContainer />
      </div>
    );
  }

  return null;
}

export default App;
