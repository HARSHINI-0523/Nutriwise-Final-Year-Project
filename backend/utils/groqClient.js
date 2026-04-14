// backend/utils/groqClient.js
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function generateMedicalAnalysis(values) {
  const systemPrompt = `
You are a medical analysis engine. 
Given lab test values, generate a short, medically-correct summary.
Do NOT diagnose. Only explain possible interpretations.
Mention only the values that are abnormal or interesting.
Output plain text.
`;

  const userPrompt = `
Here are the extracted lab values:

${JSON.stringify(values, null, 2)}

Generate insights.
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.3
  });

  return completion.choices[0].message.content;
}

module.exports = { generateMedicalAnalysis };
