const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))
      return res.status(401).json({ success: false, message: 'No token provided.' });

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found.' });
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

const doctorOnly = (req, res, next) => {
  if (req.user.role !== 'doctor')
    return res.status(403).json({ success: false, message: 'Doctors only.' });
  next();
};

const patientOnly = (req, res, next) => {
  if (req.user.role !== 'patient')
    return res.status(403).json({ success: false, message: 'Patients only.' });
  next();
};

module.exports = { protect, doctorOnly, patientOnly };
