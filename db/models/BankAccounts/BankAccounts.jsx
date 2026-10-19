
import mongoose from "mongoose";

const { Schema } = mongoose;

const bankAccountSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    purpose: {
      type: String,
      enum: ["private", "business", "rent"],
      default: "private",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      default: "Pocket Wallet",
    },

    bank: {
      type: String,
      required: true,
      trim: true,
      default: "Manual",
    },

    accountType: {
      type: String,
      enum: ["manual", "bank"],
      default: "manual",
    },

    provider: {
      type: String,
      enum: ["manual", "gocardless"],
      default: "manual",
    },

    iban: {
      type: String,
      trim: true,
      default: undefined,
    },

    bic: {
      type: String,
      trim: true,
      uppercase: true,
      match: /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
      default: undefined,
    },

    balance: {
      type: Number,
      default: 0,
    },

    lastSyncedAt: {
      type: Date,
      default: null,
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

// Clear the cached model during development
export default mongoose.models.BankAccounts
  ? mongoose.models.BankAccounts
  : mongoose.model("BankAccounts", bankAccountSchema);
