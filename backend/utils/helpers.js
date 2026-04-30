// utils/helpers.js
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const LogSchema = new mongoose.Schema({
  type: String, userId: { type: mongoose.Schema.Types.ObjectId, default: null },
  data: mongoose.Schema.Types.Mixed, clientInfo: { ip: String, device: String },
  timestamp: { type: Date, default: Date.now },
}, { collection: 'server_logs' });

const Log = mongoose.model('Log', LogSchema);

const saveLog = async (logData) => {
  try { await Log.create(logData); } catch {}
};

const getTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendOTPEmail = async (email, name, otp, type = 'verify') => {
  const subject = type === 'reset' ? 'Sehat AI — Password Reset OTP' : 'Sehat AI — Verify Your Email';
  const html = `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;background:#f9f9f9;border-radius:10px;">
    <h2 style="color:#00897B;text-align:center;">☪️ Sehat AI</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your ${type === 'reset' ? 'password reset' : 'verification'} OTP:</p>
    <div style="text-align:center;margin:24px 0;">
      <span style="font-size:40px;font-weight:bold;letter-spacing:8px;color:#00897B;background:#e8f5e9;padding:16px 24px;border-radius:8px;">${otp}</span>
    </div>
    <p style="color:#888;font-size:13px;">Expires in 10 minutes. Do not share.</p>
    <p style="color:#888;font-size:12px;">Sehat AI — Pakistan Ka AI Doctor</p>
  </div>`;
  await getTransporter().sendMail({ from: `"Sehat AI" <${process.env.EMAIL_USER}>`, to: email, subject, html });
};

const sendBackupEmail = async (stats) => {
  const html = `<h2 style="color:#00897B;">Sehat AI Weekly Backup</h2>
    <p><strong>Users:</strong> ${stats.users} | <strong>Consultations:</strong> ${stats.consultations} | <strong>Premium Users:</strong> ${stats.premium || 0}</p>
    <p><strong>Time:</strong> ${stats.time}</p>`;
  await getTransporter().sendMail({
    from: `"Sehat AI Backup" <${process.env.EMAIL_USER}>`,
    to: process.env.BACKUP_EMAIL, subject: `Sehat AI Backup — ${new Date().toDateString()}`, html,
  });
};

module.exports = { saveLog, Log, sendOTPEmail, sendBackupEmail };
