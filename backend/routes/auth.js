const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { saveLog } = require('../utils/helpers');

const genTokens = (id) => ({
  accessToken:  jwt.sign({ id }, process.env.JWT_SECRET || 'sehatai_secret', { expiresIn: '30d' }),
  refreshToken: jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'sehatai_refresh', { expiresIn: '90d' }),
});

const clientInfo = (req) => ({
  ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
  device: req.headers['user-agent'] || 'unknown',
});

// ── Register ──────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, age, gender, city, language } = req.body;

    if (!name?.trim()) return res.status(400).json({ success: false, message: 'Name is required' });
    if (!email?.trim()) return res.status(400).json({ success: false, message: 'Email is required' });
    if (!password || password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ success: false, message: 'This email is already registered. Please login.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const info = clientInfo(req);

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || undefined,
      password,
      age: age ? parseInt(age) : undefined,
      gender: gender || undefined,
      city: city || 'Lahore',
      language: language || 'en',
      otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      serverLogs: { registrationIP: info.ip, lastLoginIP: info.ip, lastLoginDevice: info.device },
    });

    await user.save();

    // Try to send email
    try {
      const { sendOTPEmail } = require('../utils/helpers');
      await sendOTPEmail(email, name, otp);
      console.log(`📧 OTP email sent to ${email}`);
    } catch (emailErr) {
      console.log(`⚠️  Email failed (non-critical): ${emailErr.message}`);
    }

    console.log(`\n✅ NEW USER REGISTERED: ${name} (${email})`);
    console.log(`🔑 OTP: ${otp} ← Use this if email doesn't arrive\n`);

    await saveLog({ type: 'registration', userId: user._id, data: { name, email, city }, clientInfo: info });

    res.status(201).json({
      success: true,
      message: 'Account created! Check your email for OTP.',
      userId: user._id,
      // DEV: Always return OTP — remove in production
      devOTP: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });

  } catch (err) {
    console.error('Register error:', err);
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Email or phone already exists' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Verify OTP ────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) return res.status(400).json({ success: false, message: 'userId and otp required' });

    const user = await User.findById(userId).select('+otp +otpExpiry');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.otp !== otp.toString()) return res.status(400).json({ success: false, message: 'Wrong OTP. Check email or terminal.' });
    if (user.otpExpiry < new Date()) return res.status(400).json({ success: false, message: 'OTP expired. Request a new one.' });

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    const tokens = genTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({ success: true, message: 'Email verified!', ...tokens, user: user.getPublicProfile() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Login ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password +refreshToken');
    if (!user) return res.status(401).json({ success: false, message: 'No account found with this email. Please register first.' });
    if (user.isDeleted) return res.status(403).json({ success: false, message: 'Account has been deactivated' });
    if (user.isBanned) return res.status(403).json({ success: false, message: `Account banned: ${user.banReason}` });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ success: false, message: 'Wrong password. Please try again.' });

    const info = clientInfo(req);
    user.serverLogs.lastLoginIP = info.ip;
    user.serverLogs.lastLoginDevice = info.device;
    user.serverLogs.lastActiveAt = new Date();
    user.serverLogs.appOpenCount = (user.serverLogs.appOpenCount || 0) + 1;
    user.serverLogs.loginHistory.push({ ip: info.ip, device: info.device, method: 'email' });

    const tokens = genTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    await saveLog({ type: 'login', userId: user._id, data: { method: 'email' }, clientInfo: info });

    res.json({ success: true, ...tokens, user: user.getPublicProfile() });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DEV: Skip Login (REMOVE IN PRODUCTION) ────────────
// This creates/returns a test user without password
router.post('/dev-skip-login', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Not available in production' });
  }
  try {
    let user = await User.findOne({ email: 'test@sehatai.dev' });
    if (!user) {
      user = new User({
        name: 'Test User', email: 'test@sehatai.dev',
        password: 'test123456', isEmailVerified: true,
        city: 'Lahore', language: 'en',
        age: 25, gender: 'male',
      });
      await user.save();
    }
    const tokens = genTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    console.log('⚡ Dev skip login used');
    res.json({ success: true, ...tokens, user: user.getPublicProfile() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Resend OTP ────────────────────────────────────────
router.post('/resend-otp', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    try { const { sendOTPEmail } = require('../utils/helpers'); await sendOTPEmail(user.email, user.name, otp); } catch {}
    console.log(`\n🔑 RESENT OTP: ${otp}\n`);
    res.json({ success: true, message: 'OTP sent', devOTP: process.env.NODE_ENV !== 'production' ? otp : undefined });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Refresh Token ─────────────────────────────────────
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token' });
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'sehatai_refresh');
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) return res.status(401).json({ success: false, message: 'Invalid token' });
    const tokens = genTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    res.json({ success: true, ...tokens });
  } catch { res.status(401).json({ success: false, message: 'Token expired or invalid' }); }
});

// ── Forgot Password ───────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.json({ success: true, message: 'If this email exists, OTP was sent' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    try { const { sendOTPEmail } = require('../utils/helpers'); await sendOTPEmail(email, user.name, otp, 'reset'); } catch {}
    console.log(`\n🔑 RESET OTP: ${otp}\n`);
    res.json({ success: true, message: 'Reset OTP sent', userId: user._id, devOTP: process.env.NODE_ENV !== 'production' ? otp : undefined });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Reset Password ────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ success: false, message: 'Password min 6 characters' });
    const user = await User.findById(userId).select('+otp +otpExpiry +password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.otp !== otp || user.otpExpiry < new Date()) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successfully!' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Logout ────────────────────────────────────────────
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body;
    if (userId) await User.findByIdAndUpdate(userId, { refreshToken: null });
    res.json({ success: true, message: 'Logged out' });
  } catch { res.status(500).json({ success: false }); }
});

module.exports = router;
