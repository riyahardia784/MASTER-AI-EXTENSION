const mongoose = require("mongoose");

const createSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    type: { type: String, required: true },
    length: { type: String, default: "medium" },
    level: { type: String, default: "Undergraduate" },
    report: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ Export the model correctly
module.exports = mongoose.model("Create", createSchema);
