const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  email:            { type: String, required: true, unique: true, lowercase: true },
  password:         { type: String, required: true },
  role:             { type: String, enum: ['patient', 'doctor'], required: true },

  // Patient fields
  healthId:         { type: String, unique: true, sparse: true },
  dateOfBirth:      { type: Date },
  gender:           { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup:       { type: String },
  phone:            { type: String },
  address:          { type: String },
  allergies:        [{ type: String }],
  emergencyContact: {
    name:     String,
    phone:    String,
    relation: String
  },

  // Doctor fields
  doctorId:         { type: String, unique: true, sparse: true },
  specialization:   { type: String },
  licenseNumber:    { type: String },
  hospitalName:     { type: String },
  hospitalLocation: { type: String },
  experience:       { type: Number },

  createdAt: { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Auto Health ID
userSchema.statics.generateHealthId = async function () {
  const year = new Date().getFullYear();
  const count = await this.countDocuments({ role: 'patient' });
  return `IND-HID-${year}-${String(count + 1).padStart(4, '0')}`;
};

// Auto Doctor ID
userSchema.statics.generateDoctorId = async function () {
  const count = await this.countDocuments({ role: 'doctor' });
  return `DOC-${String(count + 1).padStart(4, '0')}`;
};

module.exports = mongoose.model('User', userSchema);
