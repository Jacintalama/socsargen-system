const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System prompt for the hospital chatbot - STRICT MODE
const SYSTEM_PROMPT = `You are the official AI assistant for Socsargen County Hospital in General Santos City, Philippines.

YOUR ONLY PURPOSE: Help with Socsargen County Hospital inquiries. You must REFUSE all other requests.

ALLOWED TOPICS (respond helpfully):
- Hospital services and departments
- Appointment booking guidance
- Doctor information and schedules
- Operating hours and contact information
- Hospital location and directions
- Emergency services information
- HMO and insurance partners (general info only)
- Hospital facilities and amenities

HOSPITAL INFORMATION:
- Name: Socsargen County Hospital
- Address: L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City, 9500
- Phone: 553-8906 / 553-8907
- Mobile: 0932-692-4708
- Email: socsargencountyhospital@gmail.com
- Emergency: 24/7
- OPD Hours: 8:00 AM - 5:00 PM, Monday to Saturday
- Services: 31 medical services (Emergency, ICU, Hemodialysis, Laboratory, Radiology, Surgery, etc.)
- Departments: 14 departments (Internal Medicine, Pediatrics, OB-GYN, Cardiology, Orthopedics, Neurology, etc.)

STRICT RULES - YOU MUST FOLLOW:
1. ONLY answer questions related to Socsargen County Hospital
2. For ANY off-topic question (weather, jokes, math, general knowledge, coding, etc.), respond: "I can only assist with Socsargen County Hospital inquiries. How can I help you with appointments, services, doctors, or hospital information?"
3. NEVER provide medical diagnoses or specific medical advice
4. For medical symptoms/conditions, say: "For medical concerns, please consult with our doctors. Would you like help booking an appointment?"
5. For emergencies, always direct to: "Please call our Emergency hotline at 553-8906 or visit our 24/7 Emergency Room immediately."
6. For billing/insurance details, say: "For billing inquiries, please contact our Billing Department at 553-8906."
7. Be polite but firm - do not get sidetracked by off-topic conversations

RESPONSE STYLE:
- Keep responses concise (2-3 sentences)
- Be friendly, professional, and helpful
- Understand Filipino/Tagalog greetings (Magandang umaga, Kumusta, etc.)
- Always redirect back to hospital services if conversation drifts`;

/**
 * Get AI response from Gemini
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Object} - { message: string, escalate: boolean }
 */
const getAIResponse = async (message, conversationHistory = []) => {
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return {
        message: "I'm currently in basic mode. For better assistance, please contact our staff directly or call 553-8906.",
        escalate: false
      };
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build conversation history for Gemini format
    // Gemini uses 'user' and 'model' roles
    const history = conversationHistory.slice(-10).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Start a chat session with history
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7
      }
    });

    // Combine system prompt with user message for context
    const promptWithContext = history.length === 0
      ? `${SYSTEM_PROMPT}\n\nUser message: ${message}`
      : message;

    // Send message and get response
    const result = await chat.sendMessage(promptWithContext);
    const response = await result.response;
    const aiMessage = response.text();

    // Check if AI wants to escalate
    const escalateKeywords = [
      'connect you with',
      'connect with our staff',
      'billing department',
      'speak to',
      'talk to a human',
      'escalate'
    ];

    const shouldEscalate = escalateKeywords.some(keyword =>
      aiMessage.toLowerCase().includes(keyword)
    );

    return {
      message: aiMessage,
      escalate: shouldEscalate
    };
  } catch (error) {
    console.error('Gemini error:', error.message);

    // Fallback response if Gemini fails
    return {
      message: "I apologize, I'm having some technical difficulties. Let me connect you with our staff for better assistance.",
      escalate: true
    };
  }
};

/**
 * Simple keyword-based fallback (when no Gemini key)
 */
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('good')) {
    return { message: "Hello! Welcome to Socsargen County Hospital. How can I help you today?", escalate: false };
  }

  if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
    return { message: "To book an appointment, please register or login first, then go to the Doctors page and select your preferred doctor and time slot.", escalate: false };
  }

  if (lowerMessage.includes('doctor') || lowerMessage.includes('specialist')) {
    return { message: "You can view our doctors and their specializations on the Doctors page. Each doctor has their schedule and available time slots listed.", escalate: false };
  }

  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
    return { message: "For emergencies, please call our Emergency hotline at 553-8906 or 0932-692-4708, or visit our Emergency Room which is open 24/7.", escalate: true };
  }

  if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
    return { message: "Socsargen County Hospital is located at L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City, 9500. You can contact us at 553-8906 for directions.", escalate: false };
  }

  if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('time')) {
    return { message: "Our Emergency Room is open 24/7. Outpatient Department (OPD) hours are 8:00 AM to 5:00 PM, Monday to Saturday.", escalate: false };
  }

  if (lowerMessage.includes('service')) {
    return { message: "We offer 31 medical services including Emergency Care, ICU, Hemodialysis, Outpatient Services, Laboratory, Radiology, Pharmacy, and Surgery. Visit our Services page for more details.", escalate: false };
  }

  if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
    return { message: "You can reach us at Phone: 553-8906, 553-8907, or 0932-692-4708. Email: socsargencountyhospital@gmail.com", escalate: false };
  }

  // Default response
  return { message: "Thank you for your message. For specific inquiries, please contact our staff at 553-8906 or email socsargencountyhospital@gmail.com.", escalate: false };
};

module.exports = { getAIResponse, getFallbackResponse };
