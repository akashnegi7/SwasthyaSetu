require('dotenv').config();
const mongoose = require('mongoose');

const User          = require('./models/User');
const Record        = require('./models/Record');
const AccessControl = require('./models/AccessControl');
const AuditLog      = require('./models/AuditLog');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB connected');

  // Clear everything
  await Promise.all([User.deleteMany(), Record.deleteMany(), AccessControl.deleteMany(), AuditLog.deleteMany()]);
  console.log('🧹 Old data cleared');

  // Don't hash here - let the User model's pre-save hook do it
  const pw = 'password123';

  // ── Patients ────────────────────────────────────────────────────
  const p1 = await User.create({
    name: 'Rahul Sharma', email: 'rahul@example.com', password: pw, role: 'patient',
    healthId: 'IND-HID-2026-0001', dateOfBirth: new Date('1990-05-15'),
    gender: 'Male', bloodGroup: 'B+', phone: '9876543210',
    address: 'Sector 21, Chandigarh, Punjab',
    allergies: ['Penicillin', 'Dust'],
    emergencyContact: { name: 'Sunita Sharma', phone: '9876500001', relation: 'Wife' }
  });

  const p2 = await User.create({
    name: 'Priya Verma', email: 'priya@example.com', password: pw, role: 'patient',
    healthId: 'IND-HID-2026-0002', dateOfBirth: new Date('1995-08-22'),
    gender: 'Female', bloodGroup: 'A+', phone: '9876543211',
    address: 'Andheri West, Mumbai, Maharashtra',
    allergies: ['Sulfa drugs'],
    emergencyContact: { name: 'Rakesh Verma', phone: '9876500002', relation: 'Father' }
  });

  // ── Doctors ─────────────────────────────────────────────────────
  const d1 = await User.create({
    name: 'Dr. Amit Sharma', email: 'amit.doctor@example.com', password: pw, role: 'doctor',
    doctorId: 'DOC-0001', specialization: 'Cardiology',
    licenseNumber: 'MCI-DEL-2015-4521',
    hospitalName: 'AIIMS Delhi', hospitalLocation: 'Ansari Nagar, New Delhi', experience: 12
  });

  const d2 = await User.create({
    name: 'Dr. Neha Gupta', email: 'neha.doctor@example.com', password: pw, role: 'doctor',
    doctorId: 'DOC-0002', specialization: 'General Medicine & Endocrinology',
    licenseNumber: 'MCI-MUM-2018-7832',
    hospitalName: 'Fortis Hospital Mumbai', hospitalLocation: 'Mulund West, Mumbai', experience: 8
  });

  // ── Access Permissions ───────────────────────────────────────────
  await AccessControl.create({
    patientId: p1._id, doctorId: d1._id, healthId: 'IND-HID-2026-0001',
    status: 'approved', reason: 'Cardiac follow-up',
    approvedAt: new Date('2026-01-10'), expiresAt: new Date('2027-12-31')
  });
  await AccessControl.create({
    patientId: p2._id, doctorId: d2._id, healthId: 'IND-HID-2026-0002',
    status: 'approved', reason: 'Diabetes management',
    approvedAt: new Date('2026-01-15'), expiresAt: new Date('2027-12-31')
  });
  await AccessControl.create({
    patientId: p1._id, doctorId: d2._id, healthId: 'IND-HID-2026-0001',
    status: 'pending', reason: 'Second opinion required'
  });

  // ── 10 Medical Records ───────────────────────────────────────────
  // 1 — Rahul: Diagnosis
  await Record.create({
    healthId: 'IND-HID-2026-0001', patientId: p1._id, doctorId: d1._id,
    doctorName: 'Dr. Amit Sharma', hospitalName: 'AIIMS Delhi', hospitalLocation: 'Ansari Nagar, New Delhi',
    recordType: 'Diagnosis',
    diagnosis: { disease: 'Hypertension (Stage 2)', severity: 'Moderate', symptoms: ['High BP 160/100', 'Persistent headache', 'Dizziness', 'Fatigue'], notes: 'Stage 2 hypertension. Lifestyle modification advised. Review in 4 weeks.' },
    followUpDate: new Date('2026-02-10'), createdAt: new Date('2026-01-10')
  });

  // 2 — Rahul: Prescription
  await Record.create({
    healthId: 'IND-HID-2026-0001', patientId: p1._id, doctorId: d1._id,
    doctorName: 'Dr. Amit Sharma', hospitalName: 'AIIMS Delhi', hospitalLocation: 'Ansari Nagar, New Delhi',
    recordType: 'Prescription',
    prescription: [
      { medicine: 'Amlodipine 5mg', dosage: '5mg', frequency: 'Once daily (morning)', duration: '30 days', instructions: 'Take after breakfast' },
      { medicine: 'Losartan 50mg', dosage: '50mg', frequency: 'Once daily (evening)', duration: '30 days', instructions: 'Avoid potassium-rich foods' },
      { medicine: 'Aspirin 75mg', dosage: '75mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take after meals' }
    ],
    notes: 'Avoid salt. Walk 30 min daily. Check BP weekly.', createdAt: new Date('2026-01-10')
  });

  // 3 — Rahul: Lab Test
  await Record.create({
    healthId: 'IND-HID-2026-0001', patientId: p1._id, doctorId: d1._id,
    doctorName: 'Dr. Amit Sharma', hospitalName: 'AIIMS Delhi', hospitalLocation: 'Ansari Nagar, New Delhi',
    recordType: 'Lab Test',
    labTests: [
      { testName: 'Serum Cholesterol', value: '220', unit: 'mg/dL', normalRange: '<200 mg/dL', status: 'Abnormal' },
      { testName: 'LDL Cholesterol', value: '145', unit: 'mg/dL', normalRange: '<100 mg/dL', status: 'Abnormal' },
      { testName: 'Blood Glucose (Fasting)', value: '105', unit: 'mg/dL', normalRange: '70-100 mg/dL', status: 'Abnormal' },
      { testName: 'Serum Creatinine', value: '1.1', unit: 'mg/dL', normalRange: '0.7-1.2 mg/dL', status: 'Normal' },
      { testName: 'CBC', value: 'Normal', unit: '', normalRange: 'Within range', status: 'Normal' }
    ],
    notes: 'Elevated cholesterol. Lipid management required.', createdAt: new Date('2026-01-11')
  });

  // 4 — Rahul: Lab Test (follow-up)
  await Record.create({
    healthId: 'IND-HID-2026-0001', patientId: p1._id, doctorId: d1._id,
    doctorName: 'Dr. Amit Sharma', hospitalName: 'AIIMS Delhi', hospitalLocation: 'Ansari Nagar, New Delhi',
    recordType: 'Lab Test',
    labTests: [
      { testName: 'ECG', value: 'Normal sinus rhythm', unit: '', normalRange: 'Normal sinus rhythm', status: 'Normal' },
      { testName: 'Echocardiogram (EF)', value: '58', unit: '%', normalRange: '>55%', status: 'Normal' },
      { testName: 'Blood Pressure', value: '135/88', unit: 'mmHg', normalRange: '<120/80 mmHg', status: 'Abnormal' }
    ],
    notes: 'Cardiac function improving. Continue medication.', createdAt: new Date('2026-02-10')
  });

  // 5 — Rahul: Diagnosis (URI)
  await Record.create({
    healthId: 'IND-HID-2026-0001', patientId: p1._id, doctorId: d1._id,
    doctorName: 'Dr. Amit Sharma', hospitalName: 'AIIMS Delhi', hospitalLocation: 'Ansari Nagar, New Delhi',
    recordType: 'Diagnosis',
    diagnosis: { disease: 'Viral Upper Respiratory Infection', severity: 'Mild', symptoms: ['Sore throat', 'Runny nose', 'Fever 99.5°F', 'Body aches'], notes: 'Common cold. Symptomatic treatment. Resolves in 5-7 days.' },
    createdAt: new Date('2026-03-08')
  });

  // 6 — Rahul: Procedure
  await Record.create({
    healthId: 'IND-HID-2026-0001', patientId: p1._id, doctorId: d1._id,
    doctorName: 'Dr. Amit Sharma', hospitalName: 'AIIMS Delhi', hospitalLocation: 'Ansari Nagar, New Delhi',
    recordType: 'Procedure',
    procedure: {
      name: 'Coronary Angiography',
      description: 'Diagnostic coronary angiography via right radial artery under local anesthesia.',
      outcome: 'Mild stenosis (30%) in LAD artery. Medical management continued. No stenting required.',
      anesthesia: 'Local anesthesia with conscious sedation'
    },
    notes: 'Patient tolerated well. Discharged after 4 hrs observation.', createdAt: new Date('2026-04-01')
  });

  // 7 — Priya: Diagnosis
  await Record.create({
    healthId: 'IND-HID-2026-0002', patientId: p2._id, doctorId: d2._id,
    doctorName: 'Dr. Neha Gupta', hospitalName: 'Fortis Hospital Mumbai', hospitalLocation: 'Mulund West, Mumbai',
    recordType: 'Diagnosis',
    diagnosis: { disease: 'Type 2 Diabetes Mellitus', severity: 'Moderate', symptoms: ['Frequent urination', 'Excessive thirst', 'Weight loss', 'Blurred vision', 'Fatigue'], notes: 'Newly diagnosed T2DM. HbA1c 8.2%. Starting Metformin. Dietary counseling provided.' },
    followUpDate: new Date('2026-04-20'), createdAt: new Date('2026-01-20')
  });

  // 8 — Priya: Lab Test
  await Record.create({
    healthId: 'IND-HID-2026-0002', patientId: p2._id, doctorId: d2._id,
    doctorName: 'Dr. Neha Gupta', hospitalName: 'Fortis Hospital Mumbai', hospitalLocation: 'Mulund West, Mumbai',
    recordType: 'Lab Test',
    labTests: [
      { testName: 'HbA1c', value: '8.2', unit: '%', normalRange: '<5.7% (Normal)', status: 'Abnormal' },
      { testName: 'Fasting Blood Glucose', value: '186', unit: 'mg/dL', normalRange: '70-100 mg/dL', status: 'Abnormal' },
      { testName: 'Post Prandial Glucose', value: '265', unit: 'mg/dL', normalRange: '<140 mg/dL', status: 'Critical' },
      { testName: 'TSH (Thyroid)', value: '2.8', unit: 'mIU/L', normalRange: '0.4-4.0 mIU/L', status: 'Normal' },
      { testName: 'Urine Microalbumin', value: '28', unit: 'mg/g', normalRange: '<30 mg/g', status: 'Normal' }
    ],
    notes: 'Post-prandial glucose critically elevated. Strict diet control.', createdAt: new Date('2026-01-20')
  });

  // 9 — Priya: Prescription
  await Record.create({
    healthId: 'IND-HID-2026-0002', patientId: p2._id, doctorId: d2._id,
    doctorName: 'Dr. Neha Gupta', hospitalName: 'Fortis Hospital Mumbai', hospitalLocation: 'Mulund West, Mumbai',
    recordType: 'Prescription',
    prescription: [
      { medicine: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily (after meals)', duration: '90 days', instructions: 'Take with food. Do not crush.' },
      { medicine: 'Glimepiride 1mg', dosage: '1mg', frequency: 'Once daily (before breakfast)', duration: '90 days', instructions: 'Report hypoglycemia symptoms.' },
      { medicine: 'Vitamin D3 60000 IU', dosage: '60000 IU', frequency: 'Once weekly', duration: '8 weeks', instructions: 'Take with milk.' }
    ],
    notes: 'Diet: <1800 kcal/day. Walk 45 min daily. Monitor fasting sugar.', createdAt: new Date('2026-01-20')
  });

  // 10 — Priya: Lab Test (3-month follow-up)
  await Record.create({
    healthId: 'IND-HID-2026-0002', patientId: p2._id, doctorId: d2._id,
    doctorName: 'Dr. Neha Gupta', hospitalName: 'Fortis Hospital Mumbai', hospitalLocation: 'Mulund West, Mumbai',
    recordType: 'Lab Test',
    labTests: [
      { testName: 'HbA1c (3-month follow-up)', value: '7.1', unit: '%', normalRange: '<7% for diabetics', status: 'Abnormal' },
      { testName: 'Fasting Blood Glucose', value: '128', unit: 'mg/dL', normalRange: '70-100 mg/dL', status: 'Abnormal' },
      { testName: 'Kidney Function (Creatinine)', value: '0.9', unit: 'mg/dL', normalRange: '0.5-1.1 mg/dL', status: 'Normal' },
      { testName: 'Liver Function (SGPT)', value: '32', unit: 'U/L', normalRange: '7-56 U/L', status: 'Normal' }
    ],
    notes: 'Good progress! HbA1c improved from 8.2% → 7.1%. Target <7% next visit.', createdAt: new Date('2026-04-15')
  });

  // ── Audit Logs ───────────────────────────────────────────────────
  await AuditLog.create([
    { action: 'USER_REGISTERED', performedBy: p1._id, performedByName: 'Rahul Sharma', performedByRole: 'patient', details: 'Patient registered', timestamp: new Date('2026-01-05') },
    { action: 'USER_REGISTERED', performedBy: p2._id, performedByName: 'Priya Verma', performedByRole: 'patient', details: 'Patient registered', timestamp: new Date('2026-01-10') },
    { action: 'ACCESS_APPROVED', performedBy: p1._id, performedByName: 'Rahul Sharma', performedByRole: 'patient', targetPatient: 'IND-HID-2026-0001', details: 'Rahul approved access to Dr. Amit Sharma', timestamp: new Date('2026-01-10') },
    { action: 'RECORDS_VIEWED', performedBy: d1._id, performedByName: 'Dr. Amit Sharma', performedByRole: 'doctor', targetPatient: 'IND-HID-2026-0001', details: 'Dr. Amit Sharma viewed records of IND-HID-2026-0001', timestamp: new Date('2026-01-10') },
    { action: 'RECORD_ADDED', performedBy: d1._id, performedByName: 'Dr. Amit Sharma', performedByRole: 'doctor', targetPatient: 'IND-HID-2026-0001', details: 'Diagnosis record added for IND-HID-2026-0001', timestamp: new Date('2026-01-10') }
  ]);

  console.log('');
  console.log('🎉 ══════════════════════════════════════════════');
  console.log('     DATABASE SEEDED SUCCESSFULLY!');
  console.log('🎉 ══════════════════════════════════════════════');
  console.log('');
  console.log('  👤 PATIENT LOGINS:');
  console.log('     Rahul Sharma  →  rahul@example.com  /  password123');
  console.log('     Priya Verma   →  priya@example.com  /  password123');
  console.log('');
  console.log('  👨‍⚕️ DOCTOR LOGINS:');
  console.log('     Dr. Amit Sharma  →  amit.doctor@example.com  /  password123');
  console.log('     Dr. Neha Gupta   →  neha.doctor@example.com  /  password123');
  console.log('');
  console.log('  📊 10 medical records seeded!');
  console.log('');
  console.log('  ✅ Now run:  node server.js');
  console.log('  ✅ Open:     http://localhost:5000');
  console.log('');
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1); });
