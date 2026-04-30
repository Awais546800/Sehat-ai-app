const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');
const { readMedicineFromImage } = require('../utils/aiEngine');
const { checkLimit, incrementUsage } = require('../utils/usageLimiter');

router.get('/search', protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Search term required' });
    const isPremium = req.user.isPremium();
    const limitCheck = await checkLimit(req.user._id, 'medicines', isPremium);
    if (!limitCheck.allowed) return res.status(429).json({ success: false, limitReached: true, message: limitCheck.message, resetIn: limitCheck.resetIn });

    let medicines = [];
    try {
      const r = await axios.get(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(q)}"&limit=5`, { timeout: 10000 });
      medicines = r.data.results?.map(m => ({
        name: m.openfda?.brand_name?.[0] || q,
        genericName: m.openfda?.generic_name?.[0] || '',
        manufacturer: m.openfda?.manufacturer_name?.[0] || '',
        uses: m.indications_and_usage?.slice(0, 1) || [],
        warnings: m.warnings?.slice(0, 1) || [],
        dosage: m.dosage_and_administration?.[0]?.substring(0, 300) || '',
        sideEffects: m.adverse_reactions?.[0]?.substring(0, 300) || '',
        source: 'OpenFDA (USA Database)',
      })) || [];
    } catch {
      medicines = [{ name: q, note: 'Search result from local knowledge. Consult pharmacist for details.', source: 'local' }];
    }

    await incrementUsage(req.user._id, 'medicines');
    res.json({ success: true, data: medicines });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/scan', protect, async (req, res) => {
  try {
    const { imageBase64, language } = req.body;
    if (!imageBase64) return res.status(400).json({ success: false, message: 'Image required' });
    const isPremium = req.user.isPremium();
    const limitCheck = await checkLimit(req.user._id, 'images', isPremium);
    if (!limitCheck.allowed) return res.status(429).json({ success: false, limitReached: true, message: limitCheck.message, resetIn: limitCheck.resetIn });

    const result = await readMedicineFromImage(imageBase64, language || req.user.language || 'en');
    await incrementUsage(req.user._id, 'images');
    res.json({ success: true, data: result.response, aiUsed: result.aiUsed });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
