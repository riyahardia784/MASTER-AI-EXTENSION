const express = require("express");
const router = express.Router();
const {
  learn,
  saveGeneratedContent,
  getStoredContent,
} = require("../controllers/Learn.controller");

// 🧠 Generate AI learning content
router.post("/generate", learn);

// 💾 Save generated output to DB
router.post("/save", saveGeneratedContent);

// 📦 Fetch stored items from DB
router.get("/stored", getStoredContent);

module.exports = router;

