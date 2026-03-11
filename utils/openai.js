/**
 * OpenAI Utility - Centralized AI for GOJO BOT
 * Powers all educational commands, chat AI, and smart responses
 */

const { OpenAI } = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const GOJO_SYSTEM_PROMPT = `You are GOJO BOT, an AI tutor with the personality of Satoru Gojo from Jujutsu Kaisen. You are brilliant, confident, and make learning feel effortless — just like Gojo makes sorcery look easy.

Your teaching style:
- Clear, structured, and easy to understand
- Use simple language, even for complex topics
- Always include key points and practical examples
- Format with WhatsApp-friendly markdown (*bold*, bullet points)
- Keep responses concise but complete — never spam
- Add a small Gojo-style closing remark (e.g., "Infinity holds all answers ♾️" or "The Six Eyes see all 🧿")

Do NOT use HTML tags. Do NOT use long walls of text. Structure your answers clearly.`;

/**
 * Ask OpenAI with a specific educational context
 * @param {string} userMessage - The user's question or topic
 * @param {string} contextHint - What type of response to generate (explain, quiz, essay, etc.)
 * @returns {string} Formatted AI response
 */
async function askAI(userMessage, contextHint = '') {
  const systemPrompt = contextHint
    ? `${GOJO_SYSTEM_PROMPT}\n\nFor this request, your goal is: ${contextHint}`
    : GOJO_SYSTEM_PROMPT;

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    max_tokens: 800,
    temperature: 0.7
  });

  return response.choices[0].message.content.trim();
}

/**
 * Ask OpenAI for a simple one-off chat response
 */
async function chatAI(message) {
  return askAI(message);
}

/**
 * Generate educational content with a topic-specific template
 * @param {string} command - The command type (explain, quiz, essay, etc.)
 * @param {string} topic - The topic/question from the user
 * @returns {string} AI response text
 */
async function educate(command, topic) {
  const prompts = {
    explain: `Explain "${topic}" clearly. Include: explanation, key points (as bullets), and one helpful example.`,
    shortnote: `Give quick revision bullet-point notes for: "${topic}". Keep it short and memorable.`,
    brief: `Explain "${topic}" in 2-3 short, clear sentences only.`,
    summary: `Summarize "${topic}" in a clear, student-friendly paragraph.`,
    mention: `List the most important key points about "${topic}" as bullet points.`,
    example: `Give 3 clear real-world examples to illustrate "${topic}".`,
    facts: `Share 5 interesting educational facts about "${topic}".`,
    history: `Explain the historical background and origin of "${topic}".`,
    uses: `Explain the practical uses and real-world applications of "${topic}".`,
    ask: `Answer this question clearly and educationally: "${topic}". Explain with key points.`,
    homework: `Help solve this homework question step-by-step with explanation: "${topic}".`,
    solve: `Solve this problem step-by-step, showing all working clearly: "${topic}".`,
    essay: `Write a short, structured essay on "${topic}" with introduction, body, and conclusion.`,
    research: `Provide structured research information on "${topic}": background, main findings, and significance.`,
    quiz: `Create a 3-question quiz on "${topic}" with each question on a new line. Include answers at the bottom.`,
    mcq: `Create 3 multiple choice questions (A, B, C, D) on "${topic}". Mark the correct answer.`,
    lesson: `Teach "${topic}" step-by-step as a mini lesson: intro → 3 steps → summary.`,
    study: `Create structured study notes for "${topic}" with headings, key terms, and important facts.`,
    mathsolve: `Solve this math problem step-by-step, showing every calculation: "${topic}".`,
    grammarcheck: `Check and correct the grammar in this text. Show the corrected version and explain changes: "${topic}".`,
    paraphrase: `Rewrite the following text in different, clearer words while keeping the same meaning: "${topic}".`,
    ai: `Answer this question thoroughly and helpfully: "${topic}".`,
    lesson_plan: `Create a detailed lesson plan for teaching "${topic}" to students.`
  };

  const promptText = prompts[command] || `Respond helpfully to: "${topic}"`;
  return askAI(promptText);
}

module.exports = { askAI, chatAI, educate };
