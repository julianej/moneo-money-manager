import dbConnect from "@/db/connect";
import BankAccounts from "@/db/models/BankAccounts/BankAccounts";
import { getAuthenticatedUserId } from "@/utils/cleanUserAuth";

export default async function handler(request, response) {
  await dbConnect();

  const userId = getAuthenticatedUserId(request);

  if (!userId) {
    return response.status(401).json({
      error: "Unauthorized.",
    });
  }

  // =========================
  // POST - CREATE BANK ACCOUNT
  // =========================

  if (request.method === "POST") {
    try {
      // ---------------------------------
      // FREE PLAN: MAXIMUM 1 BANK ACCOUNT
      // ---------------------------------

      const accountCount = await BankAccounts.countDocuments({
        user: userId,
      });

      if (accountCount >= 1) {
        return response.status(403).json({
          error: "Free plan allows only 1 bank account.",
        });
      }

      // ---------------------------------
      // CREATE BANK ACCOUNT
      // ---------------------------------

      const { bank, name, iban, bic, balance } = request.body;

      const newAccount = await BankAccounts.create({
        user: userId,
        bank,
        name,
        iban,
        bic,
        balance,
      });

      return response.status(201).json(newAccount);

    } catch (error) {
      console.error("CREATE BANK ACCOUNT ERROR:", error);

      return response.status(500).json({
        error: error.message,
      });
    }
  }

  return response.status(405).json({
    error: "Method not allowed.",
  });
}