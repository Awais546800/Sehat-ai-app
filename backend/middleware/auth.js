const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sehatai_secret');
    const user = await User.findById(decoded.id);
    if (!user || user.isDeleted) return res.status(401).json({ success: false, message: 'User not found' });
    user.serverLogs.lastActiveAt = new Date();
    await user.save();
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' });
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

const adminOnly = (req, res, next) => {
  const configuredAdminKey = process.env.ADMIN_SECRET_KEY;
  const requestAdminKey = req.headers['x-admin-key'];

  // Fail closed: never allow admin access when server key is missing.
  if (!configuredAdminKey) {
    return res.status(500).json({ success: false, message: 'Admin access is not configured' });
  }

  if (!requestAdminKey || requestAdminKey !== configuredAdminKey) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  next();
};

module.exports = { protect, adminOnly };
