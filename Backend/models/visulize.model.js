const mongoose = require("mongoose");

const visualizationSchema = new mongoose.Schema(
  {
    // 🧠 Input text provided by user
    text: {
      type: String,
      required: [true, "Input text is required"],
      trim: true,
    },

    // 🗂️ Visualization type (for now, defaults to "mindmap")
    type: {
      type: String,
      enum: ["mindmap", "concept", "creative", "default"],
      default: "mindmap",
    },

    // 🎨 Gemini-generated visualization content (Markdown-style text)
    visualization: {
      type: String,
      required: [true, "Generated visualization is required"],
    },

    // 🤖 Model used — currently fixed to Gemini 2.0 Flash
    modelUsed: {
      type: String,
      default: "gemini-2.0-flash",
    },

    // ⚡ Optional: Store Gemini API response duration (in ms)
    responseTime: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true, // ✅ adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Visualization", visualizationSchema);
