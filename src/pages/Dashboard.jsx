import { useState, useEffect, useMemo } from 'react';
import { Download, Users, UserCheck, CalendarDays, TrendingUp, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { exportToExcel } from '../utils/export';

export const Dashboard = () => {
  const { members, timeSlots, attendance, committees } = useAppContext();

  const stats = useMemo(() => {
    const totalSessions = timeSlots.length;
    const totalMembers = members.length;
    const totalCommittees = committees.length;

    // Calculate overall attendance rate
    let totalMarks = 0;
    let presentCount = 0;
    Object.values(attendance).forEach(slotData => {
      Object.values(slotData).forEach(status => {
        totalMarks++;
        if (status === 'Present') presentCount++;
      });
    });
    const attendanceRate = totalMarks > 0 ? Math.round((presentCount / totalMarks) * 100) : 0;

    return { totalSessions, totalMembers, totalCommittees, attendanceRate };
  }, [members, timeSlots, attendance, committees]);

  const recentActivity = useMemo(() => {
    const activities = [];
    
    // Show last 3 time slots with attendance summary
    const recent = [...timeSlots].reverse().slice(0, 5);
    recent.forEach(slot => {
      const slotData = attendance[slot.id] || {};
      const present = Object.values(slotData).filter(s => s === 'Present').length;
      const total = members.length;
      activities.push({
        id: slot.id,
        label: slot.label,
        date: slot.date,
        present,
        total,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0,
      });
    });

    return activities;
  }, [timeSlots, attendance, members]);

  const handleExport = () => {
    if (members.length === 0 || timeSlots.length === 0) return;
    exportToExcel(members, timeSlots, attendance);
  };

  return (
    <div className="main-content">
      <div className="header-bar">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your E-Cell ecosystem and attendance metrics.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleExport} disabled={timeSlots.length === 0}>
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card animate-fade-in" style={{ animationDelay: '0ms' }}>
          <span className="stat-card-title">Total Members</span>
          <span className="stat-card-value">{stats.totalMembers}</span>
          <Users className="stat-card-icon" size={32} />
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '60ms' }}>
          <span className="stat-card-title">Active Committees</span>
          <span className="stat-card-value">{stats.totalCommittees}</span>
          <CalendarDays className="stat-card-icon" size={32} />
        </div>
        <div className="stat-card animate-fade-in" style={{ animationDelay: '120ms' }}>
          <span className="stat-card-title">Attendance Rate</span>
          <span className="stat-card-value">{stats.attendanceRate}%</span>
          <TrendingUp className="stat-card-icon" size={32} />
        </div>
      </div>

      {/* Quick Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        
        {/* Recent Sessions */}
        <div className="section-card animate-fade-in" style={{ animationDelay: '180ms' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2><Clock size={18} style={{ color: 'var(--blue-500)' }} /> Recent Sessions</h2>
            <span className="badge badge-info">{timeSlots.length} total</span>
          </div>

          {recentActivity.length === 0 ? (
            <div className="empty-state">
              <CalendarDays size={40} opacity={0.3} />
              <p>No sessions created yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentActivity.map(activity => (
                <div key={activity.id} className="slot-item">
                  <div className="slot-info">
                    <span className="slot-label">{activity.label}</span>
                    <span className="slot-date">
                      {new Date(activity.date).toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {activity.present}/{activity.total}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>present</span>
                    </div>
                    <div style={{
                      width: '48px', height: '48px',
                      borderRadius: 'var(--radius-full)',
                      background: `conic-gradient(var(--blue-500) ${activity.percentage * 3.6}deg, var(--bg-subtle) 0deg)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: '38px', height: '38px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--bg-panel)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.6875rem', fontWeight: 700, color: 'var(--blue-600)',
                      }}>
                        {activity.percentage}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Committees Overview */}
        <div className="section-card animate-fade-in" style={{ animationDelay: '240ms' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2><Users size={18} style={{ color: 'var(--blue-500)' }} /> Committees</h2>
            <span className="badge badge-info">{committees.length} active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {committees.map(committee => (
              <div key={committee.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.875rem 1rem',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                transition: 'all var(--transition-fast)',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                    {committee.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.125rem' }}>
                    {committee.description}
                  </div>
                </div>
                <div className="badge badge-neutral">
                  {committee.members.length} members
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
