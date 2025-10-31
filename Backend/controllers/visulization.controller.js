const { generateVisualization } = require("../service/visulization.service");
const Visualization = require("../models/visulize.model"); // ✅ Mongoose model

/**
 * 🧠 Generate AI-based Visualization using Gemini API
 */
const visualize = async (req, res) => {
  const { text, type } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured in environment" });
    }

    const visualization = await generateVisualization(text, apiKey);

    // ✅ Send output in a consistent format expected by frontend
    return res.status(200).json({ visualization });
  } catch (err) {
    console.error("❌ Error generating visualization:", err);
    return res.status(500).json({ error: "Failed to generate visualization" });
  }
};

/**
 * 💾 Save generated visualization to database
 */
const saveVisualization = async (req, res) => {
  const { text, type, visualization } = req.body;

  if (!text || !visualization) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const saved = await Visualization.create({ text, type, visualization });
    return res.status(201).json({
      message: "Visualization saved successfully!",
      saved,
    });
  } catch (err) {
    console.error("❌ Error saving visualization:", err);
    return res.status(500).json({ error: "Failed to save visualization" });
  }
};

/**
 * 📦 Fetch all stored visualizations
 */
const getStoredVisualizations = async (req, res) => {
  try {
    const stored = await Visualization.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, stored });
  } catch (err) {
    console.error("❌ Error fetching stored visualizations:", err);
    return res.status(500).json({ error: "Failed to fetch stored visualizations" });
  }
};

/**
 * ❌ Delete visualization by ID
 */
const deleteVisualization = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Visualization.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Visualization not found" });
    }

    return res.status(200).json({ message: "Visualization deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting visualization:", err);
    return res.status(500).json({ error: "Failed to delete visualization" });
  }
};

module.exports = {
  visualize,
  saveVisualization,
  getStoredVisualizations,
  deleteVisualization,
};
