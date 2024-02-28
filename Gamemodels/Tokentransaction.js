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
    gasfeehash: {
      type: String,
    },
    mmthash: {
      type: String,
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
    status: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

const TokenTransactions = mongoose.model("TokenTransactions", TokenTransactionsSchema);

module.exports = TokenTransactions;
