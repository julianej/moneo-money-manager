import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    match: /^[A-Za-zÄÖÜäöüß0-9 ]+$/,
  },

  amount: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankAccounts",
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  invoice: {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    filename: {
      type: String,
    },

    uploadedAt: {
      type: Date,
    },
  },
});

const Transactions =
  mongoose.models.Transactions ||
  mongoose.model("Transactions", transactionSchema);

export default Transactions;