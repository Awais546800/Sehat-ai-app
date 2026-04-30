const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const DOCTORS = [
  { id:'1', name:'Dr. Ahsan Ali Khan', specialty:'General Physician', city:'Lahore', rating:4.8, reviews:320, fee:1500, available:true, platform:'marham', experience:12, hospital:'Shaukat Khanum, Lahore', phone:'+923001234567', qualifications:'MBBS, FCPS' },
  { id:'2', name:'Dr. Sara Malik', specialty:'Gynecologist', city:'Lahore', rating:4.9, reviews:280, fee:2500, available:true, platform:'oladoc', experience:15, hospital:'Services Hospital, Lahore', phone:'+923001234568', qualifications:'MBBS, FCPS (Gynae)' },
  { id:'3', name:'Dr. Faisal Ahmed', specialty:'Cardiologist', city:'Karachi', rating:4.7, reviews:190, fee:3000, available:true, platform:'marham', experience:18, hospital:'Aga Khan Hospital, Karachi', qualifications:'MBBS, MD Cardiology' },
  { id:'4', name:'Dr. Nadia Hassan', specialty:'Dermatologist', city:'Islamabad', rating:4.6, reviews:150, fee:2000, available:false, platform:'oladoc', experience:10, hospital:'PIMS, Islamabad', qualifications:'MBBS, DDV' },
  { id:'5', name:'Dr. Tariq Mehmood', specialty:'Orthopedic', city:'Lahore', rating:4.5, reviews:210, fee:2500, available:true, platform:'marham', experience:14, hospital:'General Hospital, Lahore', qualifications:'MBBS, MS Ortho' },
  { id:'6', name:'Dr. Ayesha Khalid', specialty:'Pediatrician', city:'Lahore', rating:4.9, reviews:380, fee:1800, available:true, platform:'oladoc', experience:16, hospital:'Childrens Hospital, Lahore', qualifications:'MBBS, DCH, FCPS' },
  { id:'7', name:'Dr. Usman Ghani', specialty:'Psychiatrist', city:'Karachi', rating:4.4, reviews:95, fee:3500, available:true, platform:'marham', experience:11, hospital:'Karachi Medical Center', qualifications:'MBBS, MRCPsych' },
  { id:'8', name:'Dr. Rabia Qureshi', specialty:'ENT Specialist', city:'Faisalabad', rating:4.6, reviews:120, fee:1500, available:true, platform:'oladoc', experience:9, hospital:'Allied Hospital, Faisalabad', qualifications:'MBBS, DLO' },
  { id:'9', name:'Dr. Bilal Chaudhry', specialty:'Neurologist', city:'Lahore', rating:4.7, reviews:175, fee:4000, available:false, platform:'marham', experience:20, hospital:'Mayo Hospital, Lahore', qualifications:'MBBS, MRCP, Fellowship Neurology' },
  { id:'10', name:'Dr. Sana Riaz', specialty:'Endocrinologist', city:'Islamabad', rating:4.8, reviews:140, fee:3000, available:true, platform:'oladoc', experience:13, hospital:'Shifa International, Islamabad', qualifications:'MBBS, FRCP' },
  { id:'11', name:'Dr. Imran Butt', specialty:'General Physician', city:'Karachi', rating:4.5, reviews:250, fee:1200, available:true, platform:'marham', experience:8, hospital:'Liaquat National Hospital', qualifications:'MBBS' },
  { id:'12', name:'Dr. Hina Nawaz', specialty:'Gynecologist', city:'Islamabad', rating:4.7, reviews:195, fee:2800, available:true, platform:'oladoc', experience:12, hospital:'PIMS, Islamabad', qualifications:'MBBS, FCPS (OB/GYN)' },
];

router.get('/search', protect, async (req, res) => {
  try {
    const { specialty, city, q } = req.query;
    let filtered = [...DOCTORS];
    if (specialty) filtered = filtered.filter(d => d.specialty.toLowerCase().includes(specialty.toLowerCase()));
    if (city) filtered = filtered.filter(d => d.city.toLowerCase().includes(city.toLowerCase()));
    if (q) filtered = filtered.filter(d => d.name.toLowerCase().includes(q.toLowerCase()) || d.specialty.toLowerCase().includes(q.toLowerCase()));
    res.json({ success: true, data: filtered, total: filtered.length, note: 'Live scraping from Marham/Oladoc in production version' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  const d = DOCTORS.find(doc => doc.id === req.params.id);
  if (!d) return res.status(404).json({ success: false, message: 'Doctor not found' });
  res.json({ success: true, data: d });
});

module.exports = router;
