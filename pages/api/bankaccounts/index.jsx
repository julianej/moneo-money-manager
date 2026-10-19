
import dbConnect from "@/db/connect";
import BankAccounts from "@/db/models/BankAccounts/BankAccounts";
import { getAuthenticatedUserId } from "@/utils/cleanUserAuth";
import User from "@/db/models/Users/Users";

export default async function handler(request, response) {
  try {
    await dbConnect();

    const userId = await getAuthenticatedUserId(request);

    if (!userId) {
      return response.status(401).json({
            error: "Unauthorized",
          });
        }

      if (request.method === "GET") {
      const user = await User.findById(userId);

      if (!user) {
        return response.status(404).json({
          error: "User not found.",
        });
      }

      const accounts = await BankAccounts.find({
        user: userId,
      }).sort({ createdAt: -1 });

      return response.status(200).json(accounts);
    }
     

    // POST: Create an account explicitly requested by the user.
    if (request.method === "POST") {
      const user = await User.findById(userId);

      if (!user) {
        return response.status(404).json({
          error: "User not found.",
        });
      }

      const {
        name,
        bank,
        accountType = "manual",
        balance = 0,
        iban,
        bic,
        parentAccount,
      } = request.body || {};

      // Validate account type.
      if (!["manual", "bank"].includes(accountType)) {
        return response.status(400).json({
          error: "Invalid account type.",
        });
      }

      // Free plan: maximum one account.
      if (user.plan === "free") {
        const accountCount = await BankAccounts.countDocuments({
          user: userId,
        });

        if (accountCount >= 1) {
          return response.status(403).json({
            error: "Free plan allows only 1 account.",
          });
        }
      }

      const normalizedBank =
      typeof bank === "string" ? bank.trim() : "";

      const normalizedName =
      typeof name === "string" ? name.trim() : "";

      const finalName =
        normalizedName ||
        (accountType === "manual" ? "Pocket Wallet" : "");

      const finalBank =
        normalizedBank ||
        (accountType === "manual" ? "Manual" : "");

      if (!finalName || !finalBank) {
        return response.status(400).json({
          error: "Name and bank are required for bank accounts.",
        });
      }

      const parsedBalance = Number(balance);

      if (!Number.isFinite(parsedBalance)) {
        return response.status(400).json({
          error: "Balance must be a valid number.",
        });
      }

      const accountData = {
        user: userId,
        name: finalName,
        bank: finalBank,
        accountType,
        balance: parsedBalance,
        provider: "manual",
        connectionStatus: "not_connected",
      };

      if (iban) accountData.iban = iban;
      if (bic) accountData.bic = bic;
      if (parentAccount) accountData.parentAccount = parentAccount;

      const account = await BankAccounts.create(accountData);

      return response.status(201).json(account);
    }

    return response.status(405).json({
      error: "Method not allowed",
      allowedMethods: ["GET", "POST"],
    });
  } catch (error) {
    console.error("BANK ACCOUNTS API ERROR:", error);
    console.error("ERROR NAME:", error.name);
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR STACK:", error.stack);

    return response.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}