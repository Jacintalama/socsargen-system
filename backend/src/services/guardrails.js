/**
 * LAYER 1: Input guardrails — run BEFORE sending to Gemini.
 * Returns { blocked: boolean, response?: string, truncated?: string }
 */
function validateInput(message) {
  const lowerMsg = message.toLowerCase().trim();

  if (lowerMsg.length < 2) {
    return { blocked: true, response: 'Please type a message so I can help you.' };
  }

  const injectionPatterns = [
    'ignore previous instructions',
    'ignore your instructions',
    'ignore all instructions',
    'you are now',
    'pretend you are',
    'act as if',
    'forget your rules',
    'system prompt',
    'override your',
    'jailbreak',
    'bypass your',
    'disregard your',
    'new persona',
    'roleplay as'
  ];

  if (injectionPatterns.some(p => lowerMsg.includes(p))) {
    return {
      blocked: true,
      response: "I can only assist with Socsargen County Hospital inquiries. How can I help you with appointments, services, or doctor information?"
    };
  }

  if (message.length > 1000) {
    return { blocked: false, truncated: message.substring(0, 1000) };
  }

  return { blocked: false };
}

/**
 * LAYER 4: Output guardrails — run AFTER receiving from Gemini.
 * Validates response and adds disclaimers if needed.
 */
function validateOutput(response) {
  let cleanResponse = response;

  const medicalTerms = ['symptom', 'diagnos', 'treatment plan', 'medication', 'prescri', 'dosage'];
  if (medicalTerms.some(t => cleanResponse.toLowerCase().includes(t))) {
    if (!cleanResponse.includes('Disclaimer') && !cleanResponse.includes('consult')) {
      cleanResponse += '\n\n_Please consult with our doctors for proper medical advice._';
    }
  }

  return cleanResponse;
}

module.exports = { validateInput, validateOutput };
