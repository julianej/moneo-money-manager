import dbConnect from "@/db/connect";
import BankAccounts from "@/db/models/BankAccounts/BankAccounts";
import { getAuthenticatedUserId } from "@/utils/cleanUserAuth";
import User from "@/db/models/Users/Users";

export default async function handler(request, response) {
  try {
    await dbConnect();

    const userId = getAuthenticatedUserId(request);

    if (!userId) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    // CREATE
      if (request.method === "POST") {
        const user = await User.findById(userId);

        if (!user) {
          return response.status(404).json({
            error: "User not found.",
          });
        }

        // FREE PLAN: maximum 1 bank account
        if (user.plan === "free") {
          const accountCount = await BankAccounts.countDocuments({
            user: userId,
          });

          if (accountCount >= 1) {
            return response.status(403).json({
              error: "Free plan allows only 1 bank account.",
            });
          }
        }

        const account = await BankAccounts.create({
          ...request.body,
          user: userId,
        });

        return response.status(201).json(account);
      }

    // READ
    if (request.method === "GET") {
      const accounts = await BankAccounts.find({
        user: userId,
      }).sort({ createdAt: -1 });

      return response.status(200).json(accounts);
    }

    return response.status(405).json({
      error: "Method not allowed",
    });
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      error: "Internal server error",
    });
  }
}