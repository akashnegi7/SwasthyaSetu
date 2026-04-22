const Record = require('../models/Record');
const AccessControl = require('../models/AccessControl');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({ success: true, user });
};

exports.getRecords = async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = { healthId: req.user.healthId };
    if (type && type !== 'All') query.recordType = type;

    let records = await Record.find(query).sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      records = records.filter(r =>
        r.doctorName.toLowerCase().includes(s) ||
        r.hospitalName.toLowerCase().includes(s) ||
        r.recordType.toLowerCase().includes(s) ||
        (r.diagnosis?.disease || '').toLowerCase().includes(s)
      );
    }
    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const records = await Record.find({ healthId: req.user.healthId });
    const abnormal = records.flatMap(r => r.labTests || []).filter(t => t.status !== 'Normal');
    res.json({
      success: true,
      summary: {
        total: records.length,
        diagnosis:    records.filter(r => r.recordType === 'Diagnosis').length,
        prescription: records.filter(r => r.recordType === 'Prescription').length,
        labTest:      records.filter(r => r.recordType === 'Lab Test').length,
        procedure:    records.filter(r => r.recordType === 'Procedure').length,
        abnormalLabs: abnormal,
        hospitals:    [...new Set(records.map(r => r.hospitalName))],
        lastVisit:    records.length ? records[0].createdAt : null
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAccessRequests = async (req, res) => {
  try {
    const reqs = await AccessControl.find({ patientId: req.user._id })
      .populate('doctorId', 'name specialization hospitalName hospitalLocation')
      .sort({ requestedAt: -1 });
    res.json({ success: true, requests: reqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.respondAccess = async (req, res) => {
  try {
    const { status } = req.body;
    const ac = await AccessControl.findById(req.params.id);
    if (!ac || ac.patientId.toString() !== req.user._id.toString())
      return res.status(404).json({ success: false, message: 'Request not found.' });

    ac.status = status;
    if (status === 'approved') {
      ac.approvedAt = new Date();
      ac.expiresAt  = new Date(Date.now() + 24 * 60 * 60 * 1000 * 365);
    }
    await ac.save();

    await AuditLog.create({
      action: `ACCESS_${status.toUpperCase()}`,
      performedBy: req.user._id, performedByName: req.user.name,
      performedByRole: 'patient', targetPatient: req.user.healthId,
      details: `Patient ${status} access request`
    });

    res.json({ success: true, message: `Access ${status}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({ targetPatient: req.user.healthId }).sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
