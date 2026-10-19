
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

    // GET: Read existing accounts or initialize a free user's Cash account.
    if (request.method === "GET") {
      let accounts = await BankAccounts.find({
        user: userId,
      }).sort({ createdAt: -1 });

      const user = await User.findById(userId);

      if (!user) {
        return response.status(404).json({
          error: "User not found.",
        });
      }

      if (user.plan === "free" && accounts.length === 0) {
        await BankAccounts.create({
          user: userId,
          name: "Cash",
          bank: "Cash",
          accountType: "cash",
          balance: 0,
          provider: "manual",
          connectionStatus: "not_connected",
        });

        accounts = await BankAccounts.find({
          user: userId,
        }).sort({ createdAt: -1 });
      }

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

      // FREE PLAN: maximum 1 account.
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

      const accountData = {
        ...request.body,
        user: userId,
      };

      // Default new accounts to cash unless explicitly created as bank accounts.
      if (!accountData.accountType) {
        accountData.accountType = "cash";
      }

      const account = await BankAccounts.create(accountData);

      return response.status(201).json(account);
    }

    return response.status(405).json({
      error: "Method not allowed",
    });
  } catch (error) {
    console.error("Bank accounts API error:", error);

    return response.status(500).json({
      error: "Internal server error",
    });
  }
}
