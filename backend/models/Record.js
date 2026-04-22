const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  healthId:         { type: String, required: true, index: true },
  patientId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorName:       { type: String, required: true },
  hospitalName:     { type: String, required: true },
  hospitalLocation: { type: String, required: true },

  recordType: {
    type: String,
    enum: ['Diagnosis', 'Prescription', 'Lab Test', 'Procedure'],
    required: true
  },

  diagnosis: {
    disease:  String,
    severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'] },
    symptoms: [String],
    notes:    String
  },

  prescription: [{
    medicine:     String,
    dosage:       String,
    frequency:    String,
    duration:     String,
    instructions: String
  }],

  labTests: [{
    testName:    String,
    value:       String,
    unit:        String,
    normalRange: String,
    status:      { type: String, enum: ['Normal', 'Abnormal', 'Critical'] }
  }],

  procedure: {
    name:        String,
    description: String,
    outcome:     String,
    anesthesia:  String
  },

  notes:         String,
  followUpDate:  Date,
  createdAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('Record', recordSchema);
