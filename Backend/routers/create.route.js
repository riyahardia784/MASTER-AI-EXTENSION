const express = require("express");
const router = express.Router();
const { createdfet } = require("../controllers/Create.controller");
const Create = require("../models/create.model"); // ✅ import model for DB actions

// Generate
router.post("/generate", createdfet);

// Save generated content (frontend posts { topic, type, length, level, content })
router.post("/save", async (req, res) => {
  try {
    const { topic = "", type = "Essay", length = "medium", level = "Undergraduate", content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "content is required" });
    }

    // 🔍 Check if a report already exists for the same topic/type/length/level
    const existing = await Create.findOne({ topic, type, length, level });
    if (existing) {
      // Update existing report
      existing.report = content;
      existing.createdAt = new Date();
      await existing.save();
      return res.status(200).json({ message: "Report updated instead of creating duplicate", report: existing });
    }

    // Save new report if no existing one
    const doc = await Create.create({
      topic: topic || "Untitled",
      type,
      length,
      level,
      report: content,
    });

    res.status(201).json(doc);
  } catch (error) {
    console.error("❌ Error saving report:", error);
    res.status(500).json({ error: "Failed to save report" });
  }
});

// Get stored
router.get("/stored", async (req, res) => {
  try {
    const reports = await Create.find().sort({ type: 1, createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error("❌ Error fetching stored reports:", error);
    res.status(500).json({ error: "Failed to fetch stored reports" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Create.findByIdAndDelete(id);
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting report:", error);
    res.status(500).json({ error: "Failed to delete report" });
  }
});

module.exports = router;
