const express = require('express');
const router = express.Router();
const { adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const { Consultation, Payment } = require('../models/Models');

router.get('/stats', adminOnly, async (req, res) => {
  try {
    const [users, consultations, payments, premiumUsers] = await Promise.all([
      User.countDocuments(),
      Consultation.countDocuments(),
      Payment.countDocuments({ status: 'completed' }),
      User.countDocuments({ 'subscription.plan': { $ne: 'free' }, 'subscription.status': 'active' }),
    ]);
    const revenue = await Payment.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    res.json({ success: true, data: { users, consultations, payments, premiumUsers, revenue: revenue[0]?.total || 0, time: new Date() } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/users', adminOnly, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, data: users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Activate a user's subscription (after manual payment verification)
router.post('/activate-subscription', adminOnly, async (req, res) => {
  try {
    const { userId, plan, paymentId } = req.body;
    const duration = plan === 'yearly' ? 365 : 30;
    const endDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
    const user = await User.findByIdAndUpdate(userId, {
      'subscription.plan': plan,
      'subscription.status': 'active',
      'subscription.startDate': new Date(),
      'subscription.endDate': endDate,
    }, { new: true });
    if (paymentId) {
      const { Payment } = require('../models/Models');
      await Payment.findByIdAndUpdate(paymentId, { status: 'completed', subscriptionEnd: endDate });
    }
    res.json({ success: true, message: `Subscription activated for ${user.name}`, endDate });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
