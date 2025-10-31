const axios = require("axios");

// 🔹 Helper: Call Gemini API
const callGemini = async (prompt, apiKey) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

  try {
    const res = await axios.post(url, body, {
      headers: { "Content-Type": "application/json" },
      timeout: 60000,
    });
    return res.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  } catch (err) {
    console.error("❌ Gemini API error:", err.response?.data || err.message);
    return "";
  }
};

// 🔹 Single Prompt: Text-Based Mind Map (Default)
const generateVisualization = async (text, apiKey) => {
  const prompt = `
You are a text-based mind map generator.

Your task:
Convert the given content into a hierarchical, mind map using Markdown with the following rules:
-make emojis for each main branch.

- CENTRAL TOPIC must be in UPPERCASE and centered on the first line. don't add the text intially markdown syntax.
- Use connectors (│, ├, └, ↳, →) to show hierarchy clearly.
- Main branches (first-level topics) must be bold and highlighted as key ideas. make them stand out.
- Subtopics should be indented properly to reflect their levels.
- Use bullet points (-) for subtopics under each main branch.
- Use Title Case for main branches and sentence case for subtopics.
- Keep the text concise, clean, and well-indented for monospaced display.
- Do NOT include any explanations, only output the mind map content.

Content:
${text}
`;

  const result = await callGemini(prompt, apiKey);
  return result || "No visualization generated.";
};

module.exports = { generateVisualization };
