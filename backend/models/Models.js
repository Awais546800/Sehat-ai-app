const mongoose = require('mongoose');

// ─── CONSULTATION MODEL ───────────────────────────────
const MessageSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'ai'], required: true },
  content:   { type: String, required: true },
  language:  { type: String, default: 'en' },
  images:    [{ url: String, publicId: String }],
  aiProvider:{ type: String }, // which AI responded
  isDeletedByUser: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const ConsultationSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:     { type: String, default: 'New Consultation' },
  language:  { type: String, default: 'en' },
  messages:  [MessageSchema],
  diagnosis: {
    condition:       String,
    confidence:      { type: Number, default: 0 },
    severity:        { type: String, enum: ['low','medium','high','critical'], default: 'low' },
    recommendations: [String],
    medicines:       [String],
    homeRemedies:    [String],
    specialtyNeeded: String,
    rawResponse:     String,
    aiUsed:          String,
  },
  images:    [{ url: String, publicId: String, uploadedAt: { type: Date, default: Date.now } }],
  status:    { type: String, enum: ['active','completed','referred'], default: 'active' },
  isDeletedByUser: { type: Boolean, default: false },
  deletedByUserAt: Date,
  // Server always keeps everything
  serverMetadata: { userIP: String, userDevice: String, sessionStart: { type: Date, default: Date.now } },
}, { timestamps: true });

ConsultationSchema.index({ userId: 1, createdAt: -1 });

// ─── APPOINTMENT MODEL ────────────────────────────────
const AppointmentSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorName:  { type: String, required: true },
  doctorPhoto: String,
  specialty:   String,
  platform:    { type: String, enum: ['marham','oladoc','direct'], default: 'marham' },
  platformDoctorId: String,
  clinicAddress: String,
  fee:         Number,
  dateTime:    { type: Date, required: true },
  type:        { type: String, enum: ['in-person','video','phone'], default: 'in-person' },
  status:      { type: String, enum: ['pending','confirmed','cancelled','completed'], default: 'pending' },
  symptoms:    String,
  notes:       String,
  formData:    mongoose.Schema.Types.Mixed,
  confirmationNumber: String,
  isDeletedByUser: { type: Boolean, default: false },
}, { timestamps: true });

AppointmentSchema.index({ userId: 1, dateTime: -1 });

// ─── PAYMENT/SUBSCRIPTION MODEL ───────────────────────
const PaymentSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan:            { type: String, enum: ['monthly','yearly'], required: true },
  amount:          { type: Number, required: true },
  currency:        { type: String, default: 'PKR' },
  method:          { type: String, enum: ['stripe','easypaisa','jazzcash','bank','crypto'], required: true },
  status:          { type: String, enum: ['pending','completed','failed','refunded'], default: 'pending' },
  transactionId:   { type: String },
  gatewayResponse: mongoose.Schema.Types.Mixed,
  subscriptionStart: Date,
  subscriptionEnd:   Date,
  discount:        { type: Number, default: 0 },
  couponCode:      String,
  invoiceNumber:   String,
}, { timestamps: true });

PaymentSchema.index({ userId: 1, createdAt: -1 });

// ─── COUPON / DISCOUNT MODEL ──────────────────────────
const CouponSchema = new mongoose.Schema({
  code:           { type: String, unique: true, uppercase: true, required: true },
  discountType:   { type: String, enum: ['percentage','fixed'], default: 'percentage' },
  discountValue:  { type: Number, required: true },
  validFrom:      { type: Date, default: Date.now },
  validUntil:     Date,
  maxUses:        { type: Number, default: 100 },
  usedCount:      { type: Number, default: 0 },
  isActive:       { type: Boolean, default: true },
  applicablePlans:{ type: [String], default: ['monthly','yearly'] },
  description:    String,
}, { timestamps: true });

// ─── REVIEW MODEL ─────────────────────────────────────
const ReviewSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:   { type: Number, min: 1, max: 5, required: true },
  comment:  String,
  category: { type: String, enum: ['app','ai_accuracy','doctor','medicine'], default: 'app' },
}, { timestamps: true });

module.exports = {
  Consultation: mongoose.model('Consultation', ConsultationSchema),
  Appointment:  mongoose.model('Appointment', AppointmentSchema),
  Payment:      mongoose.model('Payment', PaymentSchema),
  Coupon:       mongoose.model('Coupon', CouponSchema),
  Review:       mongoose.model('Review', ReviewSchema),
};
