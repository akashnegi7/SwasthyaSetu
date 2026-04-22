const User = require('../models/User');
const Record = require('../models/Record');
const AccessControl = require('../models/AccessControl');
const AuditLog = require('../models/AuditLog');

exports.searchPatient = async (req, res) => {
  try {
    const patient = await User.findOne({ healthId: req.params.healthId, role: 'patient' }).select('-password');
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });

    const access = await AccessControl.findOne({
      patientId: patient._id, doctorId: req.user._id,
      status: 'approved', expiresAt: { $gt: new Date() }
    });

    res.json({ success: true, patient, hasAccess: !!access });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.requestAccess = async (req, res) => {
  try {
    const { healthId, reason } = req.body;
    const patient = await User.findOne({ healthId, role: 'patient' });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });

    const existing = await AccessControl.findOne({ patientId: patient._id, doctorId: req.user._id, status: 'pending' });
    if (existing) return res.status(400).json({ success: false, message: 'Request already pending.' });

    const ac = await AccessControl.create({ patientId: patient._id, doctorId: req.user._id, healthId, reason: reason || 'Medical consultation' });

    await AuditLog.create({
      action: 'ACCESS_REQUESTED', performedBy: req.user._id,
      performedByName: req.user.name, performedByRole: 'doctor',
      targetPatient: healthId,
      details: `Dr. ${req.user.name} requested access to patient ${healthId}`
    });

    res.status(201).json({ success: true, message: 'Access request sent to patient.', access: ac });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addRecord = async (req, res) => {
  try {
    const { healthId } = req.body;
    const patient = await User.findOne({ healthId, role: 'patient' });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });

    const access = await AccessControl.findOne({
      patientId: patient._id, doctorId: req.user._id,
      status: 'approved', expiresAt: { $gt: new Date() }
    });
    if (!access) return res.status(403).json({ success: false, message: 'You do not have approved access.' });

    const record = await Record.create({
      ...req.body,
      patientId:        patient._id,
      doctorId:         req.user._id,
      doctorName:       req.user.name,
      hospitalName:     req.user.hospitalName,
      hospitalLocation: req.user.hospitalLocation
    });

    await AuditLog.create({
      action: 'RECORD_ADDED', performedBy: req.user._id,
      performedByName: req.user.name, performedByRole: 'doctor',
      targetPatient: healthId,
      details: `New ${record.recordType} record added for ${healthId}`
    });

    res.status(201).json({ success: true, message: 'Record added!', record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPatientRecords = async (req, res) => {
  try {
    const patient = await User.findOne({ healthId: req.params.healthId, role: 'patient' });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });

    const access = await AccessControl.findOne({
      patientId: patient._id, doctorId: req.user._id,
      status: 'approved', expiresAt: { $gt: new Date() }
    });
    if (!access) return res.status(403).json({ success: false, message: 'Access denied.' });

    const records = await Record.find({ healthId: req.params.healthId }).sort({ createdAt: -1 });

    await AuditLog.create({
      action: 'RECORDS_VIEWED', performedBy: req.user._id,
      performedByName: req.user.name, performedByRole: 'doctor',
      targetPatient: req.params.healthId,
      details: `Dr. ${req.user.name} viewed records of ${req.params.healthId}`
    });

    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getActivity = async (req, res) => {
  try {
    const logs = await AuditLog.find({ performedBy: req.user._id }).sort({ timestamp: -1 }).limit(30);
    const accessRequests = await AccessControl.find({ doctorId: req.user._id })
      .populate('patientId', 'name healthId').sort({ requestedAt: -1 });
    res.json({ success: true, logs, accessRequests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
