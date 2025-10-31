const axios = require("axios");

// 🧹 Clean text — removes scripts, styles, tags, and extra spaces
const cleanText = (input = "") =>
  input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/["']/g, "")
    .replace(/\s+/g, " ")
    .trim();

// ✂️ Split text into chunks
const chunkText = (text, size = 8000) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
  return chunks;
};

// 🔹 Gemini API call
const callGemini = async (prompt, apiKey) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  };

  try {
    const res = await axios.post(url, body, {
      headers: { "Content-Type": "application/json" },
      timeout: 60000
    });
    return res.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  } catch (err) {
    console.error("❌ Gemini API error:", err.response?.data || err.message);
    return "";
  }
};

// 🧠 Generate content
const generateLearningContent = async (text, type, apiKey) => {
  const clean = cleanText(text);
  if (!clean) return "No valid text provided.";

  const prompts = {
    Notes: `
      Create structured, educational notes on the topic **"${clean}"**.
      - Use bullet points.
      - Bold headings and highlight key terms.
      - Short, student-friendly.
      - Use emojis for readability.
    `,
    Summary: `
      Write a short, engaging summary of **"${clean}"**.
      - 3 paragraphs max.
      - Simple language.
      - Emphasize main ideas.
      - Use examples where helpful.
      - Include a  title at the top and short.
    `,
    Flashcards: `
      Create flashcards for **"${clean}"**.
      - Format: **Q:** → **A:**
      - Short, memorable.
      - Include key definitions or concepts.
      - in top add the title "Flashcards on [topic] and short ".
    `,
    Quiz: `
      Create a short quiz about **"${clean}"**.
      - 5–10 questions, 4 options each (A–D).
      - Provide correct answer + 1-line explanation.
      - Mix question types (MCQ, True/False).
      - in top add the title "Quiz on [topic] and short ".
    `
  };

  const prompt = prompts[type] || prompts.Notes;
  const chunks = chunkText(clean);
  const results = [];

  for (const chunk of chunks) {
    const response = await callGemini(`${prompt}\n\n${chunk}`, apiKey);
    if (response) results.push(response);
  }

  if (!results.length) return "No content generated.";

  // Combine & refine
  const final = await callGemini(
    `Combine and refine these ${type} outputs into a cohesive version:\n\n${results.join("\n")}`,
    apiKey
  );

  return final || results.join("\n");
};

module.exports = { generateLearningContent };
