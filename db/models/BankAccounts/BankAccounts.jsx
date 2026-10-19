
import mongoose from "mongoose";

const { Schema } = mongoose;

const bankAccountSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    bank: {
      type: String,
      required: true,
      trim: true,
    },

    // ACCOUNt TYPE
    accountType: {
      type: String,
      enum: ["cash", "bank"],
      default: "cash",
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
