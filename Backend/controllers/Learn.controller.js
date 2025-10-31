const { generateLearningContent } = require("../service/learn.service");
const Learn = require("../models/notes"); // 🧠 your Mongoose model

// 🎯 Generate AI-based learning content
const learn = async (req, res) => {
  const { text, type } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const apiKey = process.env.API_KEY;
    const content = await generateLearningContent(text, type, apiKey);

    res.json({ content });
  } catch (err) {
    console.error("❌ Error generating content:", err);
    res.status(500).json({ error: "Failed to generate content" });
  }
};

// 💾 Save generated content to database
const saveGeneratedContent = async (req, res) => {
  const { text, type, content } = req.body;
  if (!text || !type || !content)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const saved = await Learn.create({ text, type, content });
    res.json({ message: "Saved successfully!", saved });
  } catch (err) {
    console.error("❌ Error saving content:", err);
    res.status(500).json({ error: "Failed to save content" });
  }
};

// 📦 Get all stored content (sorted by category/type)
const getStoredContent = async (req, res) => {
  try {
    const stored = await Learn.find().sort({ type: 1, createdAt: -1 });
    res.json(stored);
  } catch (err) {
    console.error("❌ Error fetching stored:", err);
    res.status(500).json({ error: "Failed to fetch stored content" });
  }
};

module.exports = { learn, saveGeneratedContent, getStoredContent };
