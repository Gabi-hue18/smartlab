export const demoUsers = [
  { id: 'u-admin', email: 'admin@smartlab.com', password: 'admin123', full_name: 'Aarav Admin', role: 'admin' },
  { id: 'u-staff', email: 'staff@smartlab.com', password: 'staff123', full_name: 'Meera Staff', role: 'staff' },
  { id: 'u-tech', email: 'tech@smartlab.com', password: 'tech123', full_name: 'Rahul Technician', role: 'technician' },
]

export const initialEquipment = [
  { id:'eq1', asset_id:'EQP-001', name:'Digital Oscilloscope', category:'Test Equipment', manufacturer:'Tektronix', model:'TBS1102B', serial_number:'SN102938', location:'Electronics Lab', status:'available', condition:'good', purchase_date:'2024-01-18', warranty_expiry:'2027-01-18', next_maintenance:'2026-09-20', next_calibration:'2026-10-02', operating_hours:842, notes:'Primary bench oscilloscope.' },
  { id:'eq2', asset_id:'EQP-002', name:'Spectrum Analyzer', category:'Communication', manufacturer:'Rigol', model:'DSA815', serial_number:'SA552013', location:'Communication Lab', status:'maintenance', condition:'fair', purchase_date:'2023-08-05', warranty_expiry:'2026-08-05', next_maintenance:'2026-09-12', next_calibration:'2026-09-28', operating_hours:1260, notes:'RF lab shared instrument.' },
  { id:'eq3', asset_id:'EQP-003', name:'Function Generator', category:'Test Equipment', manufacturer:'Keysight', model:'33500B', serial_number:'FG33109', location:'Electronics Lab', status:'in_use', condition:'good', purchase_date:'2025-02-12', warranty_expiry:'2028-02-12', next_maintenance:'2026-10-08', next_calibration:'2026-11-15', operating_hours:519, notes:'' },
  { id:'eq4', asset_id:'EQP-004', name:'Digital Multimeter', category:'Measurement', manufacturer:'Fluke', model:'87V', serial_number:'DM87044', location:'Measurement Lab', status:'available', condition:'excellent', purchase_date:'2025-07-11', warranty_expiry:'2028-07-11', next_maintenance:'2026-11-25', next_calibration:'2026-09-17', operating_hours:238, notes:'Portable reference meter.' },
  { id:'eq5', asset_id:'EQP-005', name:'RF Signal Generator', category:'Communication', manufacturer:'Rohde & Schwarz', model:'SMB100A', serial_number:'RF10055', location:'Communication Lab', status:'damaged', condition:'poor', purchase_date:'2022-04-09', warranty_expiry:'2025-04-09', next_maintenance:'2026-09-10', next_calibration:'2026-09-10', operating_hours:2094, notes:'Output instability reported.' }
]

export const initialFaults = [
  { id:'f1', equipment_id:'eq5', asset_id:'EQP-005', equipment_name:'RF Signal Generator', description:'RF output power fluctuates after warm-up.', priority:'high', status:'assigned', reported_by:'Meera Staff', reported_at:'2026-09-13T10:30:00Z', assigned_to:'Rahul Technician' }
]

export const initialMaintenance = [
  { id:'m1', equipment_id:'eq2', asset_id:'EQP-002', equipment_name:'Spectrum Analyzer', type:'preventive', title:'Quarterly preventive maintenance', priority:'medium', status:'in_progress', assigned_to:'Rahul Technician', due_date:'2026-09-16', cost:0 },
  { id:'m2', equipment_id:'eq5', asset_id:'EQP-005', equipment_name:'RF Signal Generator', type:'corrective', title:'Investigate unstable RF output', priority:'high', status:'assigned', assigned_to:'Rahul Technician', due_date:'2026-09-15', cost:0 },
  { id:'m3', equipment_id:'eq1', asset_id:'EQP-001', equipment_name:'Digital Oscilloscope', type:'preventive', title:'Bench inspection and cleaning', priority:'low', status:'scheduled', assigned_to:'Rahul Technician', due_date:'2026-09-20', cost:0 }
]

export const initialHistory = [
 { id:'h1', equipment_id:'eq1', date:'2026-05-15', action:'Calibration completed', technician:'Rahul Technician', cost:1200, result:'passed' },
 { id:'h2', equipment_id:'eq2', date:'2026-06-20', action:'RF input inspection and fan cleaning', technician:'Rahul Technician', cost:850, result:'completed' },
 { id:'h3', equipment_id:'eq5', date:'2026-02-18', action:'Output stage service', technician:'External Service', cost:4200, result:'completed' }
]

export const initialNotifications = [
 { id:'n1', type:'warning', title:'Calibration due soon', message:'Digital Multimeter calibration is due in 3 days.', read:false, created_at:'2026-09-14T08:00:00Z' },
 { id:'n2', type:'danger', title:'Overdue maintenance', message:'RF Signal Generator maintenance is overdue.', read:false, created_at:'2026-09-14T07:15:00Z' },
 { id:'n3', type:'info', title:'Task assigned', message:'Spectrum Analyzer preventive maintenance is in progress.', read:true, created_at:'2026-09-13T12:10:00Z' }
]
