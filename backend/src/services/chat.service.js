const pool = require('../config/database');
const { getAIResponse, getFallbackResponse } = require('./gemini.service');

/**
 * Save chat message to database
 * For staff messages, sender format is "staff:StaffName" to preserve the name
 */
const saveMessage = async (sessionId, userId, message, sender, staffName = null) => {
  try {
    // If it's a staff message with a name, store as "staff:Name"
    const senderValue = (sender === 'staff' && staffName) ? `staff:${staffName}` : sender;

    await pool.query(
      'INSERT INTO chat_messages (session_id, user_id, message, sender) VALUES ($1, $2, $3, $4)',
      [sessionId, userId, message, senderValue]
    );
  } catch (error) {
    console.error('Save message error:', error.message);
  }
};

/**
 * Get conversation history for a session
 */
const getConversationHistory = async (sessionId) => {
  try {
    const result = await pool.query(
      'SELECT message, sender FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC LIMIT 20',
      [sessionId]
    );

    return result.rows.map(row => ({
      role: row.sender === 'user' ? 'user' : 'assistant',
      content: row.message
    }));
  } catch (error) {
    console.error('Get history error:', error.message);
    return [];
  }
};

/**
 * Handle incoming chat message
 * Returns AI response or fallback
 */
const handleChatMessage = async (sessionId, userId, message) => {
  // Save user message
  await saveMessage(sessionId, userId, message, 'user');

  // Get conversation history for context
  const history = await getConversationHistory(sessionId);

  let result;

  // Try Gemini first, fallback if no API key or error
  if (process.env.GEMINI_API_KEY) {
    result = await getAIResponse(message, history);
  } else {
    result = getFallbackResponse(message);
  }

  // Save bot response
  await saveMessage(sessionId, userId, result.message, 'bot');

  return result;
};

/**
 * Get chat sessions for admin (escalated chats)
 */
const getEscalatedChats = async () => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (session_id)
        session_id, user_id, message, created_at,
        u.first_name, u.last_name, u.email
      FROM chat_messages cm
      LEFT JOIN users u ON cm.user_id = u.id
      WHERE cm.sender = 'user'
      ORDER BY session_id, created_at DESC
    `);

    return result.rows;
  } catch (error) {
    console.error('Get escalated chats error:', error.message);
    return [];
  }
};

/**
 * Get chat history for a specific session (admin)
 * Parses staff names from sender field (format: "staff:Name")
 */
const getChatHistory = async (sessionId) => {
  try {
    const result = await pool.query(
      'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
      [sessionId]
    );

    // Parse staff names from sender field
    return result.rows.map(row => {
      let sender = row.sender;
      let staffName = null;

      if (sender && sender.startsWith('staff:')) {
        staffName = sender.substring(6); // Remove "staff:" prefix
        sender = 'staff';
      }

      return {
        ...row,
        sender,
        staff_name: staffName
      };
    });
  } catch (error) {
    console.error('Get chat history error:', error.message);
    return [];
  }
};

module.exports = {
  saveMessage,
  getConversationHistory,
  handleChatMessage,
  getEscalatedChats,
  getChatHistory
};
