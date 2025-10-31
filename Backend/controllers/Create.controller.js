const { createReport } = require("../service/create.service");
const Create = require("../models/create.model"); // ✅ import your Mongo model

/**
 * @desc Generate a report based on topic, type, length, and level
 * @route POST /api/create/generate
 */
const createdfet = async (req, res) => {
  try {
    const { topic, type, length = "medium", level = "Undergraduate" } = req.body;

    // 🧩 Validate inputs
    if (!topic || !type) {
      return res.status(400).json({ success: false, error: "Topic and Type are required" });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: "API_KEY not set in environment" });
    }

    // 🚀 Generate report using Gemini or OpenAI API
    const report = await createReport(topic, type, apiKey, length, level);

    if (!report || report.trim().length === 0) {
      return res.status(500).json({
        success: false,
        error: "No content generated from Gemini API",
      });
    }

    // 💾 Save report in MongoDB
    const savedReport = await Create.create({
      topic,
      type,
      length,
      level,
      report,
    });

    // ✅ Success response
    res.status(200).json({
      success: true,
      message: "Report generated and saved successfully",
      report: savedReport.report,
      id: savedReport._id,
      meta: {
        topic,
        type,
        length,
        level,
        createdAt: savedReport.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ Error generating report:", err);
    res.status(500).json({
      success: false,
      error: "Failed to generate report",
      details: err.message,
    });
  }
};

module.exports = { createdfet };
