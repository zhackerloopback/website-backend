const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {                      // 👈 NEW
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
