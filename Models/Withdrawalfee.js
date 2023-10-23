const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    withdrawalfee: {
      type: Number,
    },
    deletedAt: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const withdrawal = mongoose.model("withdrawal", withdrawalSchema);

module.exports = withdrawal;