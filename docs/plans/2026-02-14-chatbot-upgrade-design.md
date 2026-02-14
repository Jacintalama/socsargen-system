# Chatbot Upgrade Design: Live Database Access via Gemini Function Calling

## Problem

The existing chatbot has hardcoded hospital information in its system prompt. When a user asks "Is Dr. Santos available tomorrow?", it cannot check the actual schedule. It gives generic advice instead of real-time data. Doctor names, services, schedules, and availability are all invisible to the chatbot despite being stored in PostgreSQL.

## Solution

Upgrade the chatbot to use **Gemini 2.0 Flash Function Calling**. Gemini declares "tools" (database query functions). When the user asks a data question, Gemini returns a structured function call, the backend runs the SQL query, sends results back, and Gemini writes a natural-language answer grounded in real data.

## Architecture

```
User message --> Input Guardrails --> Gemini 2.0 Flash (with function declarations)
                                           |
                                    (function call?)
                                    /              \
                                  YES               NO
                                   |                 |
                            chatbot-tools.js     Output Guardrails
                            (PostgreSQL query)        |
                                   |             Final response
                            Send results back    + suggestions
                            to Gemini
                                   |
                            Gemini generates
                            natural answer
                                   |
                            Output Guardrails
                                   |
                            Final response + suggestions
```

## Database Functions (6 Tools)

| Function | Purpose | Tables Queried |
|----------|---------|---------------|
| searchDoctors | Find doctors by name/specialty/department | doctors, users |
| getDoctorAvailability | Check real-time open appointment slots | doctor_schedules, appointments |
| getHospitalServices | List services by category | services |
| getLatestNews | Show recent news/events/announcements | news |
| getHMOPartners | List accepted HMO/insurance partners | Static data |
| getHospitalInfo | Hours, location, contact, emergency info | Static data |

## Guardrails (4 Layers)

1. **Input validation**: Block prompt injection, detect medical symptom queries
2. **System prompt rules**: Never diagnose, only use function call data, say "not found" when DB returns empty
3. **Function call grounding**: All facts from PostgreSQL, Gemini cannot fabricate doctor names
4. **Output validation**: Verify mentioned doctor names against function call results, add medical disclaimer if needed

## Dynamic Suggested Questions

Context-aware quick action buttons that change based on conversation state:
- After searching doctors: "Check availability", "See another department"
- After checking availability: "How to book?", "Try another date"
- After viewing services: "Which doctors for this?", "Book appointment"

## Language Support

English + Tagalog + Bisaya/Cebuano. Gemini 2.0 Flash handles multilingual input natively with examples in the system prompt.

## Files to Change

| File | Action |
|------|--------|
| backend/src/services/chatbot-tools.js | CREATE - 6 database query functions |
| backend/src/services/guardrails.js | CREATE - Input/output validation |
| backend/src/services/gemini.service.js | REWRITE - Function calling + Gemini 2.0 Flash |
| backend/src/services/chat.service.js | MODIFY - Include suggestions in response |
| backend/src/index.js | MODIFY - Pass suggestions through Socket.IO |
| frontend/src/components/Chat/ChatWidget.jsx | MODIFY - Dynamic suggestion buttons |
| frontend/src/hooks/useChat.jsx | MODIFY - Handle suggestions field |

## Cost

$0. Gemini 2.0 Flash free tier (1,500 requests/day) + existing PostgreSQL.

## Decisions Made

- **Approach**: Gemini Function Calling (over context injection or keyword routing)
- **Model**: Gemini 2.0 Flash (free tier, supports function calling)
- **Languages**: English + Tagalog + Bisaya
- **Suggestions**: Dynamic/context-aware (not static)
- **Capabilities**: Full database access (doctors, schedules, services, news)
