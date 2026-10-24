
import dbConnect from "@/db/connect";
import BankAccounts from "@/db/models/BankAccounts/BankAccounts";
import User from "@/db/models/Users/Users";
import { getAuthenticatedUserId } from "@/utils/cleanUserAuth";

const mockBanks = {
  "mock-dkb": {
    name: "Mietkonto",
    bank: "DKB (Demo)",
    balance: 2450,
  },
  "mock-n26": {
    name: "Geschäftskonto",
    bank: "N26 Business (Demo)",
    balance: 5800,
  },
  "mock-ing": {
    name: "Privatkonto",
    bank: "ING Tagesgeld (Demo)",
    balance: 3200,
  },
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  if (process.env.NODE_ENV !== "development") {
    return response.status(403).json({
      error: "Mock banking is available only in development.",
    });
  }

  try {
    await dbConnect();

    const userId = await getAuthenticatedUserId(request);

    if (!userId) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return response.status(404).json({
        error: "User not found.",
      });
    }

    const { institutionId, purpose } = request.body || {};
    const mockBank = mockBanks[institutionId];

    if (!mockBank) {
      return response.status(400).json({
        error: "Unknown mock institution.",
      });
    }

    const accountCount = await BankAccounts.countDocuments({
      user: userId,
    });

    if (accountCount >= 3) {
      return response.status(403).json({
        error: "You already have 3 development accounts.",
      });
    }

    const existingAccount = await BankAccounts.findOne({
      user: userId,
      provider: "mock",
      bank: mockBank.bank,
    });

    if (existingAccount) {
      return response.status(200).json(existingAccount);
    }

    const account = await BankAccounts.create({
      user: userId,
      name: mockBank.name,
      bank: mockBank.bank,
      accountType: "bank",
      balance: mockBank.balance,
      provider: "mock",
      connectionStatus: "connected",
      purpose,
      lastSyncedAt: new Date(),
    });

    return response.status(201).json(account);
  } catch (error) {
    console.error("MOCK BANK CONNECT ERROR:", error);

    return response.status(500).json({
      error: "Could not connect mock bank.",
    });
  }
}