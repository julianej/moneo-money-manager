import mongoose from "mongoose";

const { Schema } = mongoose;

const bankAccountSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bank: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    iban: {
      type: String,
      trim: true,
    },

    bic: {
      type: String,
      trim: true,
      uppercase: true,
      match: /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/,

    },

    balance: {
      type: Number,
      default: 0,
    },

    lastSyncedAt: {
      type: Date,
      default: null,
    },
    // Add these fields inside bankAccountSchema in
    // db/models/BankAccounts/BankAccounts.js

    provider: {
      type: String,
      enum: ["manual", "gocardless"],
      default: "manual",
    },

    providerAccountId: {
      type: String,
      default: null,
    },

    providerRequisitionId: {
      type: String,
      default: null,
    },

    connectionStatus: {
      type: String,
      enum: ["not_connected", "pending", "connected", "expired", "error"],
      default: "not_connected",
    },

    consentExpiresAt: {
      type: Date,
      default: null,
    },

    syncError: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.BankAccounts ||
  mongoose.model("BankAccounts", bankAccountSchema);

// existing model || create new model

// const BankAccounts =
//   mongoose.models.BankAccounts ||
//   mongoose.model("BankAccounts", accountSchema);

// export default BankAccounts;