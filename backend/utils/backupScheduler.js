const cron = require('node-cron');
const User = require('../models/User');
const { Consultation } = require('../models/Models');
const { sendBackupEmail, saveLog } = require('./helpers');
cron.schedule('0 2 * * 0', async () => {
  try {
    const [users, consultations, premium] = await Promise.all([User.countDocuments(), Consultation.countDocuments(), User.countDocuments({ 'subscription.plan': { $ne: 'free' }, 'subscription.status': 'active' })]);
    await sendBackupEmail({ users, consultations, premium, time: new Date().toISOString() });
    await saveLog({ type: 'weekly_backup_sent', data: { users, consultations, premium } });
    console.log('✅ Weekly backup email sent');
  } catch (err) { console.error('Backup error:', err.message); }
});
console.log('✅ Backup scheduler ready (Sundays 2AM PKT)');
