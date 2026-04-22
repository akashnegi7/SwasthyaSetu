const mongoose = require('mongoose');

const accessControlSchema = new mongoose.Schema({
  patientId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  healthId:       { type: String, required: true },
  status:         { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reason:         { type: String },
  requestedAt:    { type: Date, default: Date.now },
  approvedAt:     { type: Date },
  expiresAt:      { type: Date }
});

module.exports = mongoose.model('AccessControl', accessControlSchema);
