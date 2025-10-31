const axios = require("axios");

// 🔹 Call Gemini Cloud API
const callGemini = async (prompt, apiKey) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
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

// 🔹 Generate structured report or essay (Length + Level)
const createReport = async (topic, type, apiKey, length = "medium", level = "Undergraduate") => {
  let prompt = "";
  let lengthInstruction = "";
  let tone = "";

  // 🧠 Set length instruction
  switch (length.toLowerCase()) {
    case "short":
      lengthInstruction = "Keep it concise, around 450–650 words.";
      break;
    case "medium":
      lengthInstruction = "Write around 700–900 words with balanced depth.";
      break;
    case "long":
      lengthInstruction = "Make it detailed and comprehensive, around 1200–1500 words.";
      break;
    default:
      lengthInstruction = "Write around 400–600 words with clear structure.";
  }

  // 🎓 Set academic level tone
  switch (level.toLowerCase()) {
    case "undergraduate":
      tone = "Use simple and clear language suitable for college students.";
      break;
    case "graduate":
      tone = "Use analytical and academic tone with moderate depth.";
      break;
    case "postgraduate":
      tone = "Use critical and research-oriented tone with technical vocabulary.";
      break;
    default:
      tone = "Use simple and clear academic tone.";
  }

  // 🧩 Select prompt structure based on type
  switch (type) {
    case "Essay":
      prompt = `
Write a structured essay on the topic: "${topic}".

Use Markdown formatting with the following structure:
the top title as a heading  and also in catchy title
hilights the key words accept top heading.
and formated into sections:
1. Introduction
2. Main Body (with multiple sections)
3. Conclusion but do not label them as such.
${lengthInstruction}
${tone}
Ensure section headings are bold and clearly formatted.`
break;

    case "Lab Report":
      prompt = `
Create a lab report for the topic: "${topic}".
Include:
1. Title
2. Objective
3. Materials & Methods
4. Results
5. Discussion
6. Conclusion
${lengthInstruction}
${tone}
Maintain a formal and factual presentation.
      `;
      break;

    case "Research Summary":
      prompt = `
Summarize the research topic: "${topic}".
Include:
1. Abstract
2. Research Problem
3. Methodology
4. Key Findings
5. Conclusion
${lengthInstruction}
${tone}
Focus on summarizing key research insights accurately.
      `;
      break;

    case "Case Study":
      prompt = `
Generate a case study for: "${topic}".
Include:
1. Background
2. Problem
3. Approach
4. Results
5. Conclusion
${lengthInstruction}
${tone}
Ensure a logical, analytical, and academic flow.
      `;
      break;

    default:
      prompt = `
Generate a structured academic report on: "${topic}".
Include introduction, main analysis, and conclusion.
${lengthInstruction}
${tone}
      `;
  }

  // 🪄 Call Gemini and return content
  const result = await callGemini(prompt, apiKey);
  return result || "No content generated.";
};

module.exports = { createReport };





