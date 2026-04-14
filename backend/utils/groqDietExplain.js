const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function dietExplanation(user, labs, flags, mealPlan) {
  const prompt = `
You are a clinical Indian dietician.
Generate a medically safe explanation for the diet plan:

User:
${JSON.stringify(user, null, 2)}

Lab Results:
${JSON.stringify(labs, null, 2)}

Medical Flags: ${flags.join(", ")}

Meal Plan:
${JSON.stringify(mealPlan, null, 2)}

Rules:
- Use bullet points.
- Explain why each food was selected.
- Relate choices to lab abnormalities.
- No diagnosis or medicines.
- Keep it simple but medically sound.
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  return completion.choices[0].message.content.trim();
}

module.exports = dietExplanation;
