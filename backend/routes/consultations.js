const express = require('express');
const router = express.Router();
const { Consultation } = require('../models/Models');
const { protect } = require('../middleware/auth');
const { callAI, buildSystemPrompt, analyzeImage } = require('../utils/aiEngine');
const { checkLimit, incrementUsage } = require('../utils/usageLimiter');
const { saveLog } = require('../utils/helpers');

// Get all consultations for user
router.get('/', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const data = await Consultation.find({ userId: req.user._id, isDeletedByUser: false }).sort({ createdAt: -1 }).limit(limit);
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Create new consultation
router.post('/', protect, async (req, res) => {
  try {
    const isPremium = req.user.isPremium();
    const limitCheck = await checkLimit(req.user._id, 'consultations', isPremium);

    if (!limitCheck.allowed) {
      return res.status(429).json({
        success: false,
        limitReached: true,
        message: limitCheck.message,
        resetIn: limitCheck.resetIn,
        upgradeCTA: true,
      });
    }

    const c = new Consultation({
      userId: req.user._id,
      language: req.body.language || req.user.language || 'en',
      serverMetadata: { userIP: req.ip, userDevice: req.headers['user-agent'] },
    });
    await c.save();
    await incrementUsage(req.user._id, 'consultations');
    res.status(201).json({ success: true, data: c });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Get single consultation
router.get('/:id', protect, async (req, res) => {
  try {
    const c = await Consultation.findOne({ _id: req.params.id, userId: req.user._id });
    if (!c) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: c });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Send message — calls AI
router.post('/:id/message', protect, async (req, res) => {
  try {
    const { content, language, imageBase64 } = req.body;
    const isPremium = req.user.isPremium();

    // Check message limit
    const limitCheck = await checkLimit(req.user._id, 'messages', isPremium);
    if (!limitCheck.allowed) {
      return res.status(429).json({
        success: false,
        limitReached: true,
        message: limitCheck.message,
        messagePKR: limitCheck.messagePKR,
        resetIn: limitCheck.resetIn,
        upgradeCTA: true,
      });
    }

    // Check image limit
    if (imageBase64) {
      const imgCheck = await checkLimit(req.user._id, 'images', isPremium);
      if (!imgCheck.allowed) {
        return res.status(429).json({
          success: false,
          limitReached: true,
          message: imgCheck.message,
          resetIn: imgCheck.resetIn,
          upgradeCTA: true,
        });
      }
    }

    const c = await Consultation.findOne({ _id: req.params.id, userId: req.user._id });
    if (!c) return res.status(404).json({ success: false, message: 'Consultation not found' });

    const lang = language || c.language || 'en';

    // Add user message
    c.messages.push({ role: 'user', content: content || '[Image uploaded]', language: lang });
    if (c.messages.length === 1) {
      c.title = (content || 'Consultation').substring(0, 60) + (content?.length > 60 ? '...' : '');
    }

    // Build AI message history
    const aiMessages = c.messages
      .filter(m => !m.isDeletedByUser)
      .map(m => ({ role: m.role, content: m.content }));

    // Call AI engine (tries all providers)
    const systemPrompt = buildSystemPrompt(req.user, lang);
    const aiResult = await callAI({
      messages: aiMessages,
      systemPrompt,
      imageBase64: imageBase64 || null,
      language: lang,
      userId: req.user._id,
    });

    const aiText = aiResult.response;

    // Parse diagnosis data from response
    const confMatch = aiText.match(/CONFIDENCE_SCORE:\s*(\d+)/i);
    const sevMatch  = aiText.match(/SEVERITY_LEVEL:\s*(\w+)/i);
    const specMatch = aiText.match(/SPECIALIST_NEEDED:\s*(.+)/i);
    const condMatch = aiText.match(/Condition:\s*(.+)/i);

    const confidence = confMatch ? parseInt(confMatch[1]) : 0;
    const severity   = sevMatch  ? sevMatch[1].toLowerCase() : 'low';
    const specialist = specMatch ? specMatch[1].trim() : '';
    const condition  = condMatch ? condMatch[1].trim() : '';

    // Add AI response to messages
    c.messages.push({ role: 'ai', content: aiText, language: lang, aiProvider: aiResult.aiUsed });

    // Update diagnosis if confident enough
    if (confidence > 30 || condition) {
      c.diagnosis = { condition, confidence, severity, specialtyNeeded: specialist, rawResponse: aiText, aiUsed: aiResult.aiUsed };
      if (confidence >= 60) c.status = 'completed';
    }

    await c.save();

    // Increment usage
    await incrementUsage(req.user._id, 'messages');
    if (imageBase64) await incrementUsage(req.user._id, 'images');

    // Update server stats
    req.user.serverLogs.totalMessages = (req.user.serverLogs.totalMessages || 0) + 1;
    await req.user.save();

    // Real-time notification
    if (global.io) global.io.to(req.user._id.toString()).emit('ai_response', { consultationId: c._id });

    await saveLog({ type: 'ai_consultation', userId: req.user._id, data: { aiUsed: aiResult.aiUsed, confidence, severity } });

    res.json({
      success: true,
      aiMessage: { role: 'ai', content: aiText, language: lang, aiProvider: aiResult.aiUsed, timestamp: new Date() },
      diagnosis: c.diagnosis,
      aiUsed: aiResult.aiUsed,
      consultationId: c._id,
      limitRemaining: limitCheck.remaining,
    });

  } catch (err) {
    console.error('Message error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Analyze image only
router.post('/analyze-image', protect, async (req, res) => {
  try {
    const { imageBase64, prompt, language } = req.body;
    const isPremium = req.user.isPremium();
    const limitCheck = await checkLimit(req.user._id, 'images', isPremium);
    if (!limitCheck.allowed) {
      return res.status(429).json({ success: false, limitReached: true, message: limitCheck.message, resetIn: limitCheck.resetIn });
    }
    const result = await analyzeImage(imageBase64, prompt, language || req.user.language || 'en');
    await incrementUsage(req.user._id, 'images');
    res.json({ success: true, result: result.response, aiUsed: result.aiUsed });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Soft delete consultation
router.delete('/:id', protect, async (req, res) => {
  try {
    await Consultation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isDeletedByUser: true, deletedByUserAt: new Date() }
    );
    res.json({ success: true, message: 'Removed from your view' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
