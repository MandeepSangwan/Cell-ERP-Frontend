import { useState } from 'react';
import { FileDown, Calendar, FileSpreadsheet, Download, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { exportAllAttendance } from '../../utils/export';

export const AdminExportData = () => {
  const { committees, startups, members, committeeAttendance, startupAttendance, showToast } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    try {
      exportAllAttendance(committees, startups, members, committeeAttendance, startupAttendance);
      showToast('Attendance report generated successfully');
    } catch (err) {
      showToast('Export failed: ' + err.message, 'error');
    }
    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>Export Attendance Data</h1>
          <p>Generate comprehensive Excel reports for committees and startups.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div className="section-card animate-fade-in">
          <h2><FileSpreadsheet size={18} style={{ color: 'var(--blue-500)' }} /> Global Report Generation</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            Generating a global report will create a multi-sheet Excel file containing:
          </p>
          <ul style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', gap: '0.75rem' }}>
              <div className="avatar" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)', width: '32px', height: '32px', flexShrink: 0 }}>1</div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9375rem' }}>Committee Attendance Sheet</strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Detailed logs with check-in/out times, lectures covered, and marker details.</span>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem' }}>
              <div className="avatar" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)', width: '32px', height: '32px', flexShrink: 0 }}>2</div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9375rem' }}>Startup Attendance Sheet</strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Timeslot utilization, anti-proxy photo logs, and GPS verification status.</span>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem' }}>
              <div className="avatar" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)', width: '32px', height: '32px', flexShrink: 0 }}>3</div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9375rem' }}>Analytics Summary</strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Aggregated attendance percentages per team and member for grading/credits.</span>
              </div>
            </li>
          </ul>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>System Status</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>All records are up to date and ready for export.</div>
              </div>
              <button className="btn-primary" onClick={handleExport} disabled={isExporting} style={{ padding: '0.75rem 2rem' }}>
                {isExporting ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : <Download size={18} />}
                Export All Data
              </button>
            </div>
          </div>
        </div>

        <div className="section-card animate-fade-in" style={{ animationDelay: '150ms' }}>
          <h3>Export Settings</h3>
          <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label>File Format</label>
              <select disabled><option>.xlsx (Standard Excel)</option></select>
            </div>
            <div className="form-group">
              <label>Data Depth</label>
              <select disabled><option>Full History (All Time)</option></select>
            </div>
            <div style={{ padding: '1rem', background: '#fffbeb', borderRadius: 'var(--radius-md)', border: '1px solid #fde68a', display: 'flex', gap: '0.75rem' }}>
              <ShieldCheck size={20} style={{ color: '#d97706', flexShrink: 0 }} />
              <p style={{ fontSize: '0.75rem', color: '#92400e', margin: 0, lineHeight: 1.5 }}>
                Reports are generated locally and contain sensitive roll number data. Access should be restricted to authorized E-Cell leads only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
