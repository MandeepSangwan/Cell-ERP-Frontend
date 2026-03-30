import * as XLSX from 'xlsx';

export const exportToExcel = (members, timeSlots, attendance) => {
  const formattedData = members.map(member => {
    const row = {
      Name: member.name,
      Role: member.role,
    };
    
    // add all time slots as columns
    timeSlots.forEach(slot => {
      const isPresent = attendance[slot.id] && attendance[slot.id][member.id];
      row[slot.label || slot.date] = isPresent === 'Present' ? 'Present' : (isPresent === 'Absent' ? 'Absent' : 'Pending');
    });
    
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
  
  // File name creation
  const date = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `Committee_Attendance_${date}.xlsx`);
};
