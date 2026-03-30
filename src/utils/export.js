import * as XLSX from 'xlsx';
import { TIMESLOTS, LECTURES } from './constants';

/**
 * Export all attendance data as a multi-sheet Excel file.
 * Sheet 1: Committee Attendance
 * Sheet 2: Startup Attendance
 * Sheet 3: Summary
 */
export const exportAllAttendance = (committees, startups, members, committeeAttendance, startupAttendance) => {
  const workbook = XLSX.utils.book_new();

  // ── Sheet 1: Committee Attendance ──
  const committeeRows = [];
  Object.entries(committeeAttendance).forEach(([date, committees_data]) => {
    Object.entries(committees_data).forEach(([committeeId, members_data]) => {
      const committee = committees.find(c => c.id === committeeId);
      Object.entries(members_data).forEach(([memberId, record]) => {
        const member = members.find(m => m.id === memberId);
        committeeRows.push({
          'Date': date,
          'Committee': committee?.name || committeeId,
          'Member Name': member?.name || memberId,
          'Roll Number': member?.rollNumber || '',
          'Check In': record.checkIn || '',
          'Check Out': record.checkOut || '',
          'Status': record.status || 'pending',
          'Lectures Covered': (record.lecturesCovered || []).join(', '),
          'Marked By': record.markedByName || '',
        });
      });
    });
  });

  if (committeeRows.length > 0) {
    const ws1 = XLSX.utils.json_to_sheet(committeeRows);
    ws1['!cols'] = [{ wch: 12 }, { wch: 22 }, { wch: 22 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 20 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(workbook, ws1, 'Committee Attendance');
  }

  // ── Sheet 2: Startup Attendance ──
  const startupRows = [];
  Object.entries(startupAttendance).forEach(([date, startups_data]) => {
    Object.entries(startups_data).forEach(([startupId, members_data]) => {
      const startup = startups.find(s => s.id === startupId);
      Object.entries(members_data).forEach(([memberId, record]) => {
        const member = members.find(m => m.id === memberId);
        const slot = TIMESLOTS[record.timeslot];
        startupRows.push({
          'Date': date,
          'Startup': startup?.name || startupId,
          'Member Name': member?.name || memberId,
          'Roll Number': member?.rollNumber || '',
          'Timeslot': slot ? `${slot.label} (${slot.time})` : record.timeslot,
          'Status': record.status || 'pending',
          'Location': record.locationStatus || 'pending',
          'Distance (m)': record.locationDistance || '',
          'Has Photo': record.photoUrl ? 'Yes' : 'No',
          'Marked By': record.markedByName || '',
        });
      });
    });
  });

  if (startupRows.length > 0) {
    const ws2 = XLSX.utils.json_to_sheet(startupRows);
    ws2['!cols'] = [{ wch: 12 }, { wch: 18 }, { wch: 22 }, { wch: 14 }, { wch: 28 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 10 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(workbook, ws2, 'Startup Attendance');
  }

  // ── Sheet 3: Summary ──
  const summaryRows = [];

  // Committee summary
  committees.forEach(c => {
    let total = 0, present = 0;
    Object.values(committeeAttendance).forEach(dayData => {
      const cData = dayData[c.id];
      if (cData) {
        Object.values(cData).forEach(rec => {
          total++;
          if (rec.status === 'present') present++;
        });
      }
    });
    summaryRows.push({
      'Type': 'Committee',
      'Name': c.name,
      'Total Records': total,
      'Present': present,
      'Absent': total - present,
      'Attendance %': total > 0 ? `${Math.round((present / total) * 100)}%` : '—',
    });
  });

  // Startup summary
  startups.forEach(s => {
    let total = 0, present = 0;
    Object.values(startupAttendance).forEach(dayData => {
      const sData = dayData[s.id];
      if (sData) {
        Object.values(sData).forEach(rec => {
          total++;
          if (rec.status === 'present') present++;
        });
      }
    });
    summaryRows.push({
      'Type': 'Startup',
      'Name': s.name,
      'Total Records': total,
      'Present': present,
      'Absent': total - present,
      'Attendance %': total > 0 ? `${Math.round((present / total) * 100)}%` : '—',
    });
  });

  if (summaryRows.length > 0) {
    const ws3 = XLSX.utils.json_to_sheet(summaryRows);
    ws3['!cols'] = [{ wch: 12 }, { wch: 24 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(workbook, ws3, 'Summary');
  }

  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `ECell_Attendance_${dateStr}.xlsx`);
};
