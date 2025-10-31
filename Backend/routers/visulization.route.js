const express = require("express");
const router = express.Router();
const {
  visualize,
  getStoredVisualizations,
  deleteVisualization,
} = require("../controllers/visulization.controller");

// 🧠 Generate & Save Visualization
router.post("/generate", visualize);

// 📦 Get All Stored Visualizations
router.get("/stored", getStoredVisualizations);

// ❌ Delete Visualization by ID
router.delete("/:id", deleteVisualization);

module.exports = router;
