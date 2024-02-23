const mongoose = require("mongoose");

const TokenTransactionsSchema = new mongoose.Schema(
  {
    owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gameusers"
    },
    wallet: {
      type: String,
      required: true,
      trim: true,
    },
    hash: {
      type: String,
      required: true
    },
    type: {
      type: String, // MCT or MMT
    },
    amount: {
      type: Number,
      required: true,
    },
    claimedAt: {
      type: String,
    },
    depositAt: {
        type: String,
    },
  },
  {
    timestamps: true,
  }
);

const TokenTransactions = mongoose.model("TokenTransactions", TokenTransactionsSchema);

module.exports = TokenTransactions;
