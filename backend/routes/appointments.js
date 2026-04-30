const express = require('express');
const router = express.Router();
const { Appointment } = require('../models/Models');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const data = await Appointment.find({ userId: req.user._id, isDeletedByUser: false }).sort({ dateTime: -1 });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const appt = new Appointment({ userId: req.user._id, ...req.body, confirmationNumber: 'SA' + Date.now() });
    await appt.save();
    res.status(201).json({ success: true, data: appt });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const appt = await Appointment.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
    res.json({ success: true, data: appt });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
