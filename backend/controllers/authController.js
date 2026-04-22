const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, ...rest } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered.' });

    const extra = role === 'patient'
      ? { healthId: await User.generateHealthId() }
      : { doctorId: await User.generateDoctorId() };

    const user = await User.create({ name, email, password, role, ...rest, ...extra });

    await AuditLog.create({
      action: 'USER_REGISTERED', performedBy: user._id,
      performedByName: user.name, performedByRole: role,
      details: `New ${role} registered: ${name}`
    });

    res.status(201).json({
      success: true,
      message: 'Registered successfully!',
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, healthId: user.healthId, doctorId: user.doctorId, hospitalName: user.hospitalName, specialization: user.specialization, bloodGroup: user.bloodGroup, allergies: user.allergies }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    await AuditLog.create({
      action: 'USER_LOGIN', performedBy: user._id,
      performedByName: user.name, performedByRole: user.role,
      details: `${user.role} logged in`
    });

    res.json({
      success: true,
      message: 'Login successful!',
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, healthId: user.healthId, doctorId: user.doctorId, hospitalName: user.hospitalName, specialization: user.specialization, bloodGroup: user.bloodGroup, allergies: user.allergies, gender: user.gender, phone: user.phone, address: user.address, dateOfBirth: user.dateOfBirth, emergencyContact: user.emergencyContact, experience: user.experience, licenseNumber: user.licenseNumber, hospitalLocation: user.hospitalLocation }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
