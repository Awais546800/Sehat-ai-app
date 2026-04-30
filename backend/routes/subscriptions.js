const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Payment, Coupon } = require('../models/Models');
const { protect } = require('../middleware/auth');
const { saveLog } = require('../utils/helpers');

// Pricing plans
const PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Monthly Premium',
    nameUr: 'ماہانہ پریمیم',
    priceUSD: parseFloat(process.env.PREMIUM_PRICE_MONTHLY_USD) || 5,
    pricePKR: parseInt(process.env.PREMIUM_PRICE_MONTHLY_PKR)   || 1400,
    duration: 30, // days
    features: ['Unlimited AI consultations','Unlimited image scans','Priority AI responses','Medicine database access','Appointment booking priority','Download health reports','No daily limits'],
    popular: true,
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly Premium',
    nameUr: 'سالانہ پریمیم',
    priceUSD: parseFloat(process.env.PREMIUM_PRICE_YEARLY_USD) || 30,
    pricePKR: parseInt(process.env.PREMIUM_PRICE_YEARLY_PKR)   || 8000,
    duration: 365,
    savings: '55% OFF',
    features: ['Everything in Monthly','Extra 55% discount','Family sharing (2 accounts)','Priority customer support','Annual health report','Exclusive health tips'],
    popular: false,
  },
};

// Active discount offers
const ACTIVE_OFFERS = [
  { id: 'launch', title: '🎉 Launch Offer', titleUr: '🎉 لانچ آفر', discount: 30, code: 'SEHATLAUNCH', validUntil: '2025-06-30', description: '30% off for first 1000 users' },
  { id: 'student', title: '🎓 Student Discount', titleUr: '🎓 طالب علم رعایت', discount: 20, code: 'STUDENT20', validUntil: '2025-12-31', description: '20% off for students' },
  { id: 'eid', title: '🌙 Eid Special', titleUr: '🌙 عید اسپیشل', discount: 25, code: 'EIDMUBARAK', validUntil: '2025-04-30', description: 'Eid celebration discount' },
];

// GET /api/subscriptions/plans
router.get('/plans', async (req, res) => {
  res.json({
    success: true,
    plans: PLANS,
    offers: ACTIVE_OFFERS,
    freeTier: {
      dailyMessages:      parseInt(process.env.FREE_DAILY_MESSAGES)     || 10,
      dailyImageScans:    parseInt(process.env.FREE_DAILY_IMAGE_SCANS)  || 2,
      dailyConsultations: parseInt(process.env.FREE_CONSULTATIONS_PER_DAY) || 3,
      medicineSearches:   parseInt(process.env.FREE_MEDICINE_SEARCHES)  || 5,
    },
  });
});

// GET /api/subscriptions/my-plan
router.get('/my-plan', protect, async (req, res) => {
  const user = req.user;
  const isPremium = user.isPremium();
  const sub = user.subscription;
  const daysLeft = sub?.endDate
    ? Math.max(0, Math.ceil((new Date(sub.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;
  res.json({
    success: true,
    isPremium,
    plan: sub?.plan || 'free',
    status: sub?.status || 'active',
    endDate: sub?.endDate || null,
    daysLeft,
    autoRenew: sub?.autoRenew || false,
  });
});

// POST /api/subscriptions/validate-coupon
router.post('/validate-coupon', protect, async (req, res) => {
  try {
    const { code, plan } = req.body;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
    if (!coupon) {
      // Check hardcoded offers
      const offer = ACTIVE_OFFERS.find(o => o.code === code?.toUpperCase());
      if (offer && new Date(offer.validUntil) > new Date()) {
        return res.json({ success: true, valid: true, discount: offer.discount, code: offer.code, description: offer.description });
      }
      return res.status(400).json({ success: false, message: 'Invalid coupon code' });
    }
    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) return res.status(400).json({ success: false, message: 'Coupon expired' });
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ success: false, message: 'Coupon limit reached' });
    res.json({ success: true, valid: true, discount: coupon.discountValue, discountType: coupon.discountType, code: coupon.code });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST /api/payments/initiate
router.post('/initiate', protect, async (req, res) => {
  try {
    const { plan, method, currency, couponCode } = req.body;
    const planData = PLANS[plan];
    if (!planData) return res.status(400).json({ success: false, message: 'Invalid plan' });

    let amount = currency === 'USD' ? planData.priceUSD : planData.pricePKR;
    let discount = 0;

    // Apply coupon
    if (couponCode) {
      const offer = ACTIVE_OFFERS.find(o => o.code === couponCode.toUpperCase());
      if (offer) {
        discount = offer.discount;
        amount = Math.round(amount * (1 - discount / 100));
      }
    }

    const invoice = `SA-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const payment = new Payment({
      userId: req.user._id,
      plan, amount, currency: currency || 'PKR', method,
      status: 'pending',
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + planData.duration * 24 * 60 * 60 * 1000),
      discount, couponCode, invoiceNumber: invoice,
    });
    await payment.save();

    // Method-specific instructions
    let paymentInstructions = {};
    switch (method) {
      case 'easypaisa':
        paymentInstructions = {
          method: 'EasyPaisa',
          steps: [
            '1. Open EasyPaisa app or dial *786#',
            '2. Select "Send Money" or "Mobile Account"',
            `3. Send PKR ${amount} to: ${process.env.EASYPAISA_ACCOUNT_NUM || '03XX-XXXXXXX'}`,
            `4. Use reference: ${invoice}`,
            '5. Screenshot the transaction and send to: support@sehatai.pk',
            '6. Your account will be activated within 2 hours',
          ],
          accountNumber: process.env.EASYPAISA_ACCOUNT_NUM || 'Contact support',
          amount, currency: 'PKR', reference: invoice,
        };
        break;
      case 'jazzcash':
        paymentInstructions = {
          method: 'JazzCash',
          steps: [
            '1. Open JazzCash app or dial *786#',
            '2. Select "Send Money"',
            `3. Send PKR ${amount} to: ${process.env.JAZZCASH_MERCHANT_ID || '03XX-XXXXXXX'}`,
            `4. Reference: ${invoice}`,
            '5. Send screenshot to: support@sehatai.pk',
            '6. Activation within 2 hours',
          ],
          amount, currency: 'PKR', reference: invoice,
        };
        break;
      case 'bank':
        paymentInstructions = {
          method: 'Bank Transfer',
          steps: [
            'Bank: Meezan Bank / HBL / UBL',
            'Account Title: Sehat AI (Pvt) Ltd',
            'Account Number: [Will be provided after registration]',
            `Amount: PKR ${amount}`,
            `Reference: ${invoice}`,
            'After transfer, email: payments@sehatai.pk',
          ],
          amount, currency: 'PKR', reference: invoice,
        };
        break;
      case 'stripe':
        paymentInstructions = {
          method: 'Credit/Debit Card',
          note: 'Stripe payment integration - redirect to secure payment page',
          amount, currency: currency || 'USD', reference: invoice,
          // In production: create Stripe payment intent here
        };
        break;
      case 'crypto':
        paymentInstructions = {
          method: 'Cryptocurrency',
          accepted: ['BTC', 'ETH', 'USDT (TRC20)', 'USDT (ERC20)'],
          steps: [
            `Send equivalent of USD ${planData.priceUSD} in crypto`,
            'BTC wallet: [Add your wallet address]',
            'USDT (TRC20): [Add your TRON wallet]',
            `Reference: ${invoice}`,
            'Email proof to: crypto@sehatai.pk',
          ],
          amountUSD: planData.priceUSD, reference: invoice,
        };
        break;
    }

    await saveLog({ type: 'payment_initiated', userId: req.user._id, data: { plan, method, amount, currency, invoice } });

    res.json({
      success: true,
      paymentId: payment._id,
      invoiceNumber: invoice,
      amount, discount, currency,
      plan: planData.name,
      instructions: paymentInstructions,
      message: 'Payment initiated. Follow the instructions to complete.',
    });

  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/payments/confirm (admin confirms manual payments)
router.post('/confirm', protect, async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    if (payment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Mark as pending confirmation (admin approves)
    payment.status = 'pending';
    payment.transactionId = transactionId;
    await payment.save();

    res.json({
      success: true,
      message: 'Payment submitted for verification. Your account will be activated within 2 hours.',
      status: 'pending_verification',
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/payments/history
router.get('/history', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
