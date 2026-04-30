const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { getUsageStats } = require('../utils/usageLimiter');
const { saveLog } = require('../utils/helpers');

router.get('/me', protect, async (req, res) => {
  const stats = await getUsageStats(req.user._id).catch(()=>({}));
  res.json({ success: true, user: req.user.getPublicProfile(), usageStats: stats });
});

router.put('/me', protect, async (req, res) => {
  try {
    const allowed = ['name','age','gender','city','language','avatar','notifications'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ success: true, user: user.getPublicProfile() });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/health-profile', protect, async (req, res) => {
  try {
    const { existingConditions, allergies, currentMedicines, emergencyContact, bloodGroup } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, {
      bloodGroup, healthProfile: { existingConditions, allergies, currentMedicines, emergencyContact }
    }, { new: true });
    await saveLog({ type: 'health_profile_updated', userId: req.user._id, data: { bloodGroup } });
    res.json({ success: true, user: user.getPublicProfile() });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/language', protect, async (req, res) => {
  try {
    const { language } = req.body;
    if (!['en','ur'].includes(language)) return res.status(400).json({ success: false, message: 'Invalid language' });
    await User.findByIdAndUpdate(req.user._id, { language });
    res.json({ success: true, language });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/account', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isDeleted: true, isActive: false, deletedAt: new Date(), refreshToken: null });
    await saveLog({ type: 'account_deleted', userId: req.user._id, data: { note: 'DATA_KEPT_ON_SERVER' } });
    res.json({ success: true, message: 'Account deactivated. Data kept securely per privacy policy.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
