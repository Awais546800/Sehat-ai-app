const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // ─── Basic Info ───────────────────────────────────
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:    { type: String, sparse: true, trim: true },
  password: { type: String, select: false },
  avatar:   { type: String, default: null },

  // ─── Auth ─────────────────────────────────────────
  authProvider:     { type: String, default: 'email' },
  isEmailVerified:  { type: Boolean, default: false },
  otp:              { type: String, select: false },
  otpExpiry:        { type: Date, select: false },
  refreshToken:     { type: String, select: false },

  // ─── Profile ──────────────────────────────────────
  age:        { type: Number },
  gender:     { type: String, enum: ['male', 'female', 'other'] },
  bloodGroup: { type: String, default: 'unknown' },
  city:       { type: String, default: 'Lahore' },
  language:   { type: String, enum: ['en', 'ur'], default: 'en' },

  // ─── Health Profile ───────────────────────────────
  healthProfile: {
    existingConditions: [String],
    allergies:          [String],
    currentMedicines:   [String],
    emergencyContact:   { name: String, phone: String, relation: String },
  },

  // ─── SUBSCRIPTION ─────────────────────────────────
  subscription: {
    plan:      { type: String, enum: ['free', 'monthly', 'yearly'], default: 'free' },
    status:    { type: String, enum: ['active', 'inactive', 'cancelled', 'expired'], default: 'active' },
    startDate: { type: Date },
    endDate:   { type: Date },
    autoRenew: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ['stripe', 'easypaisa', 'jazzcash', 'bank', 'crypto', null], default: null },
    transactionId: { type: String },
    amount:    { type: Number },
    currency:  { type: String, enum: ['USD', 'PKR'], default: 'PKR' },
    trialUsed: { type: Boolean, default: false },
    // Discount tracking
    couponUsed:    { type: String },
    discountApplied: { type: Number, default: 0 }, // percentage
  },

  // ─── Free Trial ───────────────────────────────────
  freeTrialUsed: { type: Boolean, default: false },
  freeTrialEndDate: { type: Date },

  // ─── Notifications ────────────────────────────────
  notifications: {
    medicineReminders: { type: Boolean, default: true },
    appointmentAlerts: { type: Boolean, default: true },
    healthTips:        { type: Boolean, default: true },
    promotions:        { type: Boolean, default: true },
    pushToken:         { type: String },
  },

  // ─── Account Status ───────────────────────────────
  isActive:   { type: Boolean, default: true },
  isDeleted:  { type: Boolean, default: false },
  deletedAt:  { type: Date },
  isBanned:   { type: Boolean, default: false },
  banReason:  { type: String },

  // ─── Server Tracking (private, never sent to client) ──
  serverLogs: {
    registrationIP:  String,
    lastLoginIP:     String,
    lastLoginDevice: String,
    lastActiveAt:    { type: Date, default: Date.now },
    appOpenCount:    { type: Number, default: 0 },
    loginHistory: [{
      ip: String, device: String, method: String,
      timestamp: { type: Date, default: Date.now }
    }],
    totalConsultations: { type: Number, default: 0 },
    totalMessages:      { type: Number, default: 0 },
    revenueGenerated:   { type: Number, default: 0 },
  },

  // ─── Referral System ──────────────────────────────
  referralCode:   { type: String, unique: true, sparse: true },
  referredBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralCount:  { type: Number, default: 0 },

}, { timestamps: true });

// ─── Indexes ──────────────────────────────────────────
UserSchema.index({ 'subscription.endDate': 1 });

// ─── Hash password ────────────────────────────────────
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Generate referral code ───────────────────────────
UserSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = 'SA' + Math.random().toString(36).substr(2, 8).toUpperCase();
  }
  next();
});

UserSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Check if user is premium right now
UserSchema.methods.isPremium = function() {
  const sub = this.subscription;
  if (!sub) return false;
  if (sub.plan === 'free') return false;
  if (sub.status !== 'active') return false;
  if (sub.endDate && new Date() > sub.endDate) return false;
  return true;
};

// Get safe public profile (no sensitive data)
UserSchema.methods.getPublicProfile = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.serverLogs;
  delete obj.otp;
  delete obj.otpExpiry;
  delete obj.refreshToken;
  // Add computed fields
  obj.isPremium = this.isPremium();
  obj.premiumExpiry = this.subscription?.endDate || null;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
