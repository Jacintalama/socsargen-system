const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  searchDoctors,
  getDoctorAvailability,
  getHospitalServices,
  getLatestNews,
  getDepartments
} = require('./chatbot-tools');
const { validateInput, validateOutput } = require('./guardrails');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Model fallback chain - if primary model quota is exhausted, try the next
const MODEL_CHAIN = ['gemini-2.0-flash', 'gemini-2.0-flash-lite'];

// ============================================
// FUNCTION DECLARATIONS (Gemini Tool Schema)
// ============================================
const functionDeclarations = [
  {
    name: 'searchDoctors',
    description: 'Search for doctors at Socsargen County Hospital by name, specialization, or department. Use this when the user asks about doctors, specialists, or medical staff.',
    parameters: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING', description: "Doctor's name to search for (partial match)" },
        specialization: { type: 'STRING', description: 'Medical specialization (e.g., Cardiology, Pediatrics, OB-GYN, Surgery)' },
        department: { type: 'STRING', description: 'Hospital department (e.g., Internal Medicine, Surgery, Pediatrics)' }
      }
    }
  },
  {
    name: 'getDoctorAvailability',
    description: 'Check if a specific doctor is available on a given date and show open appointment slots. Use this when the user asks about availability, schedules, or wants to know open time slots.',
    parameters: {
      type: 'OBJECT',
      properties: {
        doctorName: { type: 'STRING', description: "The doctor's name to check availability for" },
        date: { type: 'STRING', description: 'The date to check in YYYY-MM-DD format. Calculate the actual date if user says tomorrow, next Monday, etc.' }
      },
      required: ['doctorName', 'date']
    }
  },
  {
    name: 'getHospitalServices',
    description: 'Get information about medical services offered at Socsargen County Hospital. Use this when the user asks about services, treatments, lab tests, facilities, or what the hospital offers.',
    parameters: {
      type: 'OBJECT',
      properties: {
        category: { type: 'STRING', description: 'Service category or keyword to filter (e.g., Emergency, Laboratory, Surgery, Radiology)' }
      }
    }
  },
  {
    name: 'getLatestNews',
    description: 'Get latest hospital news, announcements, events, and updates. Use this when the user asks about events, news, announcements, or what is happening at the hospital.',
    parameters: {
      type: 'OBJECT',
      properties: {
        topic: { type: 'STRING', description: 'Optional topic or keyword to filter news' }
      }
    }
  },
  {
    name: 'getDepartments',
    description: 'List all hospital departments with the number of doctors in each. Use this when the user asks about departments, divisions, or the organizational structure.',
    parameters: {
      type: 'OBJECT',
      properties: {}
    }
  }
];

// Map function names to implementations
const availableFunctions = {
  searchDoctors,
  getDoctorAvailability,
  getHospitalServices,
  getLatestNews,
  getDepartments
};

// ============================================
// SYSTEM PROMPT
// ============================================
const getSystemPrompt = () => `You are the official AI assistant for Socsargen County Hospital (SCH) in General Santos City, Philippines.

YOUR ROLE: Help patients and visitors with hospital inquiries. You have access to LIVE hospital data through function calls — always use them for accurate answers.

HOSPITAL INFO (static):
- Name: Socsargen County Hospital
- Address: L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City, 9500
- Phone: 553-8906 / 553-8907 | Mobile: 0932-692-4708
- Email: socsargencountyhospital@gmail.com
- Emergency Room: Open 24/7
- OPD Hours: 8:00 AM - 5:00 PM, Monday to Saturday

ACCEPTED HMO PARTNERS:
Maxicare, Intellicare, Medicard, PhilCare, Cocolife Healthcare, Caritas Health Shield, Asianlife, Valucare, Eastwest Healthcare, Insular Health Care, Medicare Plus, Pacific Cross

CRITICAL RULES:
1. ONLY answer questions about Socsargen County Hospital. For off-topic questions, respond: "I can only assist with Socsargen County Hospital inquiries. How can I help you with appointments, services, doctors, or hospital information?"
2. ALWAYS use function calls to get real data about doctors, schedules, services, and news. NEVER make up doctor names, schedules, or services.
3. NEVER provide medical diagnoses, treatment plans, or medication advice. For medical concerns, say: "For medical concerns, please consult with our doctors. Would you like help finding a specialist or booking an appointment?"
4. For emergencies: "Please call our Emergency hotline at 553-8906 or 0932-692-4708, or visit our 24/7 Emergency Room immediately."
5. If a function returns no results, say so honestly. Never fabricate data.
6. When showing available time slots, always use 12-hour format (e.g., 9:00 AM, 2:30 PM).
7. After showing doctor availability, ask if they want to book an appointment.
8. To book an appointment, guide the user: "To book, please register or login on our website, then visit the Doctors page and select your preferred doctor and time slot."
9. Today's date is ${new Date().toISOString().split('T')[0]}.
10. For billing inquiries: "Please contact our Billing Department directly at 553-8906."

LANGUAGE: Understand and respond naturally to English, Tagalog (Magandang umaga, Kumusta, etc.), and Bisaya/Cebuano (Maayong buntag, Kumusta ka, Unsay, Asa, etc.). Reply in the language the user uses.

RESPONSE STYLE: Concise (2-4 sentences), friendly, professional. Use bullet points for lists of doctors or services.`;

// ============================================
// Determine dynamic suggested follow-up questions
// ============================================
function determineSuggestions(functionCallsUsed) {
  if (functionCallsUsed.includes('searchDoctors')) {
    return ['Check their availability', 'See another department', 'Book an appointment'];
  }
  if (functionCallsUsed.includes('getDoctorAvailability')) {
    return ['How do I book?', 'Check another date', 'Find a different doctor'];
  }
  if (functionCallsUsed.includes('getHospitalServices')) {
    return ['Find a doctor for this', 'Book an appointment', 'Other services'];
  }
  if (functionCallsUsed.includes('getLatestNews')) {
    return ['Hospital services', 'Find a doctor', 'Contact info'];
  }
  if (functionCallsUsed.includes('getDepartments')) {
    return ['Find a doctor', 'Check availability', 'Our services'];
  }
  return ['Find a Doctor', 'Our Services', 'Hours & Location', 'Contact Info'];
}

// ============================================
// MAIN: Get AI response with function calling
// ============================================
const getAIResponse = async (message, conversationHistory = []) => {
  // Layer 1: Input guardrails
  const inputCheck = validateInput(message);
  if (inputCheck.blocked) {
    return { message: inputCheck.response, escalate: false, suggestions: ['Find a Doctor', 'Our Services', 'Contact Info'] };
  }
  const cleanMessage = inputCheck.truncated || message;

  if (!process.env.GEMINI_API_KEY) {
    return getFallbackResponse(cleanMessage);
  }

  // Try each model in the fallback chain
  for (const modelName of MODEL_CHAIN) {
    try {
      const result = await tryModelResponse(modelName, cleanMessage, conversationHistory);
      return result;
    } catch (error) {
      const isRateLimit = error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('Too Many Requests');
      console.error(`[Chatbot] ${modelName} failed:`, isRateLimit ? 'Rate limited / quota exceeded' : error.message);

      if (isRateLimit) {
        console.log(`[Chatbot] Trying next model in fallback chain...`);
        continue;
      }
      // For other errors, still try next model as a safety net
      console.log(`[Chatbot] Non-rate-limit error, trying next model...`);
      continue;
    }
  }

  // All models failed — gracefully degrade to keyword-based fallback
  console.log('[Chatbot] All models exhausted, using keyword fallback');
  return getFallbackResponse(cleanMessage);
};

/**
 * Attempt to get a response from a specific Gemini model
 */
const tryModelResponse = async (modelName, cleanMessage, conversationHistory) => {
  const model = genAI.getGenerativeModel({
    model: modelName,
    tools: [{ functionDeclarations }],
    systemInstruction: getSystemPrompt()
  });

  // Build history, ensuring it starts with a 'user' role (Gemini requirement)
  const mapped = conversationHistory.slice(-10).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
  // Drop leading 'model' messages — Gemini requires first message to be 'user'
  const firstUserIdx = mapped.findIndex(m => m.role === 'user');
  const history = firstUserIdx > 0 ? mapped.slice(firstUserIdx) : (firstUserIdx === 0 ? mapped : []);

  const chat = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.3
    }
  });

  let response = await chat.sendMessage(cleanMessage);
  let result = response.response;

  // Function calling loop (max 3 iterations)
  const functionCallsUsed = [];
  let iterations = 3;

  while (iterations > 0) {
    const candidate = result.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const functionCallPart = parts.find(p => p.functionCall);

    if (!functionCallPart) break;

    const { name: fnName, args: fnArgs } = functionCallPart.functionCall;
    console.log(`[Chatbot] ${modelName} → ${fnName}(${JSON.stringify(fnArgs)})`);
    functionCallsUsed.push(fnName);

    let functionResult;
    try {
      if (availableFunctions[fnName]) {
        functionResult = await availableFunctions[fnName](fnArgs || {});
      } else {
        functionResult = { error: `Unknown function: ${fnName}` };
      }
    } catch (err) {
      console.error(`[Chatbot] Function ${fnName} error:`, err.message);
      functionResult = { error: 'Failed to retrieve hospital data. Please try again.' };
    }

    response = await chat.sendMessage([{
      functionResponse: {
        name: fnName,
        response: { result: functionResult }
      }
    }]);
    result = response.response;
    iterations--;
  }

  const aiMessage = result.text();

  // Layer 4: Output guardrails
  const cleanOutput = validateOutput(aiMessage);

  const shouldEscalate = [
    'connect you with', 'speak to', 'talk to a human', 'escalate',
    'billing department', 'connect with our staff'
  ].some(kw => cleanOutput.toLowerCase().includes(kw));

  const suggestions = determineSuggestions(functionCallsUsed);
  console.log(`[Chatbot] Response from ${modelName} ✓`);

  return { message: cleanOutput, escalate: shouldEscalate, suggestions };
};

/**
 * Keyword-based fallback (when no Gemini API key configured)
 */
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.match(/hello|hi|hey|good\s?morning|good\s?afternoon|maganda|kumusta|maayong/)) {
    return { message: "Hello! Welcome to Socsargen County Hospital. How can I help you today?", escalate: false, suggestions: ['Find a Doctor', 'Book Appointment', 'Our Services', 'Hours & Location'] };
  }
  if (lowerMessage.match(/doctor|doktor|specialist|dr\./)) {
    return { message: "You can view our doctors and their specializations on the Doctors page. Each doctor has their schedule and available time slots listed.", escalate: false, suggestions: ['Book Appointment', 'Our Services', 'Contact Info'] };
  }
  if (lowerMessage.match(/appointment|book|schedule|pa-?appointment|pila|kanus-a/)) {
    return { message: "To book an appointment, please register or login on our website, then go to the Doctors page to select your preferred doctor and time slot.", escalate: false, suggestions: ['Find a Doctor', 'Our Services', 'Contact Info'] };
  }
  if (lowerMessage.match(/emergency|urgent|emerhensya/)) {
    return { message: "For emergencies, please call our Emergency hotline at 553-8906 or 0932-692-4708, or visit our Emergency Room which is open 24/7.", escalate: true, suggestions: ['Contact Info', 'Find a Doctor'] };
  }
  if (lowerMessage.match(/location|address|where|asa|diin/)) {
    return { message: "Socsargen County Hospital is located at L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City, 9500.", escalate: false, suggestions: ['Hours & Location', 'Contact Info', 'Our Services'] };
  }
  if (lowerMessage.match(/hours|open|time|oras/)) {
    return { message: "Our Emergency Room is open 24/7. Outpatient Department (OPD) hours are 8:00 AM to 5:00 PM, Monday to Saturday.", escalate: false, suggestions: ['Find a Doctor', 'Our Services', 'Contact Info'] };
  }
  if (lowerMessage.match(/service|serbisyo/)) {
    return { message: "We offer 31+ medical services including Emergency Care, ICU, Hemodialysis, Outpatient Services, Laboratory, Radiology, Pharmacy, and Surgery. Visit our Services page for details.", escalate: false, suggestions: ['Find a Doctor', 'Book Appointment', 'Contact Info'] };
  }
  if (lowerMessage.match(/contact|phone|email|tawag/)) {
    return { message: "Phone: 553-8906, 553-8907 | Mobile: 0932-692-4708 | Email: socsargencountyhospital@gmail.com", escalate: false, suggestions: ['Find a Doctor', 'Our Services', 'Hours & Location'] };
  }
  if (lowerMessage.match(/hmo|insurance|philhealth|philcare|maxicare/)) {
    return { message: "We accept these HMO partners: Maxicare, Intellicare, Medicard, PhilCare, Cocolife Healthcare, Caritas Health Shield, Asianlife, Valucare, Eastwest Healthcare, Insular Health Care, Medicare Plus, and Pacific Cross.", escalate: false, suggestions: ['Find a Doctor', 'Our Services', 'Contact Info'] };
  }

  return { message: "Thank you for your message. For specific inquiries, please contact us at 553-8906 or email socsargencountyhospital@gmail.com.", escalate: false, suggestions: ['Find a Doctor', 'Our Services', 'Contact Info', 'Hours & Location'] };
};

module.exports = { getAIResponse, getFallbackResponse };
