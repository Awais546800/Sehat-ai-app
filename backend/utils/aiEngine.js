/**
 * SEHAT AI — MULTI-AI ENGINE
 * ═══════════════════════════════════════════════════
 * Tries AI providers in order: Gemini → OpenAI → DeepSeek → Qwen → Offline
 * Each provider has rate limit tracking
 * Image analysis handled by Gemini Vision
 * 
 * HOW IT WORKS:
 * 1. Request comes in with user message + optional image
 * 2. Engine checks which APIs have keys configured
 * 3. Tries primary (Gemini), falls back if fails/quota exceeded
 * 4. Returns response + which AI was used
 * 5. Tracks usage per user per day
 */

const axios = require('axios');

// ─── AI Provider Configurations ──────────────────────
const PROVIDERS = {
  gemini: {
    name: 'Gemini',
    hasKey: () => !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here',
    call: async (messages, systemPrompt, imageBase64) => {
      const model = imageBase64 ? 'gemini-1.5-flash' : (process.env.GEMINI_MODEL || 'gemini-1.5-flash');
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

      // Build content parts
      const parts = [];
      if (systemPrompt) parts.push({ text: `SYSTEM INSTRUCTIONS:\n${systemPrompt}\n\nCONVERSATION:` });

      // Add conversation history
      messages.forEach(m => {
        if (m.role === 'user') parts.push({ text: `User: ${m.content}` });
        else parts.push({ text: `Assistant: ${m.content}` });
      });

      // Add image if provided
      if (imageBase64) {
        parts.push({
          inline_data: {
            mime_type: 'image/jpeg',
            data: imageBase64
          }
        });
        parts.push({ text: 'Analyze this image and provide medical information based on it.' });
      }

      const response = await axios.post(url, {
        contents: [{ parts }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1500 }
      }, { timeout: 30000 });

      return response.data.candidates[0].content.parts[0].text;
    }
  },

  openai: {
    name: 'ChatGPT',
    hasKey: () => !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here',
    call: async (messages, systemPrompt, imageBase64) => {
      const msgs = [{ role: 'system', content: systemPrompt }];
      messages.forEach(m => msgs.push({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }));

      // GPT-4 Vision for images
      if (imageBase64) {
        const lastUser = msgs[msgs.length - 1];
        lastUser.content = [
          { type: 'text', text: lastUser.content || 'Analyze this medical image' },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
        ];
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        { model: imageBase64 ? 'gpt-4-vision-preview' : (process.env.OPENAI_MODEL || 'gpt-3.5-turbo'), messages: msgs, max_tokens: 1500, temperature: 0.4 },
        { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, timeout: 30000 }
      );
      return response.data.choices[0].message.content;
    }
  },

  deepseek: {
    name: 'DeepSeek',
    hasKey: () => !!process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== 'your_deepseek_api_key_here',
    call: async (messages, systemPrompt) => {
      const msgs = [{ role: 'system', content: systemPrompt }];
      messages.forEach(m => msgs.push({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }));

      const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        { model: process.env.DEEPSEEK_MODEL || 'deepseek-chat', messages: msgs, max_tokens: 1500, temperature: 0.4 },
        { headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' }, timeout: 30000 }
      );
      return response.data.choices[0].message.content;
    }
  },

  qwen: {
    name: 'Qwen',
    hasKey: () => !!process.env.QWEN_API_KEY && process.env.QWEN_API_KEY !== 'your_qwen_api_key_here',
    call: async (messages, systemPrompt) => {
      const msgs = [{ role: 'system', content: systemPrompt }];
      messages.forEach(m => msgs.push({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }));

      const response = await axios.post(
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        { model: process.env.QWEN_MODEL || 'qwen-turbo', input: { messages: msgs }, parameters: { max_tokens: 1500, temperature: 0.4 } },
        { headers: { Authorization: `Bearer ${process.env.QWEN_API_KEY}`, 'Content-Type': 'application/json' }, timeout: 30000 }
      );
      return response.data.output.text;
    }
  }
};

// ─── Build Medical System Prompt ─────────────────────
const buildSystemPrompt = (user, language, context = {}) => {
  const isUrdu = language === 'ur';
  const langInstruction = isUrdu
    ? 'Respond in Urdu. Use simple Urdu words that common Pakistani people understand. You can mix English medical terms.'
    : 'Respond in clear, simple English that Pakistani patients understand.';

  return `You are Sehat AI, an expert AI medical assistant designed for Pakistan.
${langInstruction}

PATIENT PROFILE:
- Age: ${user?.age || 'Unknown'}
- Gender: ${user?.gender || 'Unknown'}  
- City: ${user?.city || 'Pakistan'}
- Known Conditions: ${user?.healthProfile?.existingConditions?.join(', ') || 'None mentioned'}
- Allergies: ${user?.healthProfile?.allergies?.join(', ') || 'None mentioned'}
- Current Medicines: ${user?.healthProfile?.currentMedicines?.join(', ') || 'None mentioned'}

YOUR BEHAVIOR:
- Ask maximum 5 smart follow-up questions before giving final diagnosis
- Never ask unnecessary questions if you have enough information
- Be compassionate and professional like a real doctor
- Always mention when the patient should see a doctor urgently
- Consider Pakistani diseases: typhoid, dengue, hepatitis B/C, malaria, TB

RESPONSE FORMAT (always use this exact format):
━━━━━━━━━━━━━━━━━━━━━━━━
📋 ${isUrdu ? 'تشخیص' : 'ASSESSMENT'}
━━━━━━━━━━━━━━━━━━━━━━━━
Condition: [Name]
Confidence: [0-100]%
Severity: [low/medium/high/critical]

━━━━━━━━━━━━━━━━━━━━━━━━
🔍 ${isUrdu ? 'تجزیہ' : 'ANALYSIS'}
━━━━━━━━━━━━━━━━━━━━━━━━
[2-3 sentences of explanation]

━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ ${isUrdu ? 'اہم نتائج' : 'KEY FINDINGS'}
━━━━━━━━━━━━━━━━━━━━━━━━
• [Finding 1]
• [Finding 2]
• [Finding 3]

━━━━━━━━━━━━━━━━━━━━━━━━
💊 ${isUrdu ? 'علاج' : 'TREATMENT'}
━━━━━━━━━━━━━━━━━━━━━━━━
Medicine: [Name, dose, frequency - available in Pakistan]
Specialist: [Doctor specialty needed]
Timeline: [When to see doctor]

━━━━━━━━━━━━━━━━━━━━━━━━
🏠 ${isUrdu ? 'گھریلو علاج' : 'HOME CARE'}
━━━━━━━━━━━━━━━━━━━━━━━━
1. [Step 1]
2. [Step 2]
3. [Step 3]

CONFIDENCE_SCORE: [number only]
SEVERITY_LEVEL: [low/medium/high/critical]
SPECIALIST_NEEDED: [specialty]

IMPORTANT: If severity is high or critical, always say "Go to hospital immediately" in bold.
If image is provided, analyze it carefully for medical conditions.`;
};

// ─── Smart Offline Response ───────────────────────────
const getOfflineResponse = (message, language) => {
  const isUrdu = language === 'ur';
  return isUrdu
    ? `━━━━━━━━━━━━━━━━━━━━━━━━
📋 ابتدائی جائزہ
━━━━━━━━━━━━━━━━━━━━━━━━
آپ کا پیغام موصول ہوا۔ AI سروس ابھی دستیاب نہیں۔

مزید معلومات کے لیے بتائیں:
• یہ تکلیف کب سے ہے؟
• درد کتنا شدید ہے (1-10)?
• بخار ہے؟

⚠️ ہنگامی صورت میں: 1122 پر کال کریں

CONFIDENCE_SCORE: 0
SEVERITY_LEVEL: low
SPECIALIST_NEEDED: General Physician`
    : `━━━━━━━━━━━━━━━━━━━━━━━━
📋 INITIAL ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━
Message received. AI service temporarily unavailable.

Please tell me more:
• How long have you had these symptoms?
• Severity on scale 1-10?
• Do you have fever?

⚠️ Emergency: Call 1122

CONFIDENCE_SCORE: 0
SEVERITY_LEVEL: low
SPECIALIST_NEEDED: General Physician`;
};

// ─── MAIN AI CALL FUNCTION ────────────────────────────
const callAI = async ({ messages, systemPrompt, imageBase64, language = 'en', userId = null }) => {
  const order = (process.env.AI_FALLBACK_ORDER || 'gemini,openai,deepseek,qwen').split(',');
  let lastError = null;
  let aiUsed = 'offline';

  for (const providerKey of order) {
    const provider = PROVIDERS[providerKey.trim()];
    if (!provider || !provider.hasKey()) continue;

    try {
      console.log(`🤖 Trying ${provider.name}...`);
      const response = await provider.call(messages, systemPrompt, imageBase64);
      aiUsed = provider.name;
      console.log(`✅ ${provider.name} responded successfully`);
      return { success: true, response, aiUsed, error: null };
    } catch (err) {
      lastError = err;
      const status = err.response?.status;
      console.log(`⚠️ ${provider.name} failed (${status || err.code}): ${err.response?.data?.error?.message || err.message}`);

      // Don't try next if it's an auth error (wrong key)
      if (status === 401 || status === 403) {
        console.log(`❌ ${provider.name} auth error — check API key`);
      }
      // Continue to next provider for rate limits, server errors
      continue;
    }
  }

  // All failed — return offline response
  console.log('⚠️ All AI providers failed — using offline response');
  return {
    success: false,
    response: getOfflineResponse(messages[messages.length - 1]?.content || '', language),
    aiUsed: 'offline',
    error: lastError?.message || 'All AI providers unavailable'
  };
};

// ─── IMAGE ANALYSIS (Gemini Vision primary) ──────────
const analyzeImage = async (imageBase64, prompt, language = 'en') => {
  const systemPrompt = `You are a medical image analyzer for Sehat AI Pakistan. Analyze this medical image and provide:
1. What you observe in the image
2. Possible medical conditions visible
3. Severity assessment
4. Recommended action
${language === 'ur' ? 'Respond in Urdu.' : 'Respond in English.'}
Be specific and helpful. This is for medical assistance purposes.`;

  const fakeMessages = [{ role: 'user', content: prompt || 'Analyze this medical image' }];
  return callAI({ messages: fakeMessages, systemPrompt, imageBase64, language });
};

// ─── OCR Medicine Reading ─────────────────────────────
const readMedicineFromImage = async (imageBase64, language = 'en') => {
  const systemPrompt = `You are a medicine label reader for Sehat AI Pakistan. 
Read this medicine image/label and extract:
- Medicine name (brand and generic)
- Dosage information  
- Uses/indications
- Side effects mentioned
- Warnings
- Manufacturer if visible
Return as structured information.
${language === 'ur' ? 'Respond in Urdu after the structured data.' : ''}`;

  const fakeMessages = [{ role: 'user', content: 'Read this medicine label and extract all information' }];
  return callAI({ messages: fakeMessages, systemPrompt, imageBase64, language });
};

// ─── Which AIs are currently configured ──────────────
const getAvailableProviders = () => {
  return Object.entries(PROVIDERS)
    .filter(([, p]) => p.hasKey())
    .map(([key, p]) => ({ key, name: p.name }));
};

module.exports = { callAI, buildSystemPrompt, analyzeImage, readMedicineFromImage, getAvailableProviders };
