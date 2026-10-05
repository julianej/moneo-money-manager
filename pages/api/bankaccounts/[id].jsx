import dbConnect from "@/db/connect";
import BankAccounts from "@/db/models/BankAccounts/BankAccounts";
import Transactions from "@/db/models/Transactions/Transactions";
import { getAuthenticatedUserId } from "@/utils/cleanUserAuth";

export default async function handler(request, response) {
  await dbConnect();

  const { id } = request.query;

  if (request.method === "DELETE") {
    try {
      const userId = getAuthenticatedUserId(request);

      if (!userId) {
        return response.status(401).json({
          error: "Unauthorized.",
        });
      }

      // Check that the account belongs to the logged-in user
      const account = await BankAccounts.findOne({
        _id: id,
        user: userId,
      });

      if (!account) {
        return response.status(404).json({
          error: "Bank account not found.",
        });
      }

      // Delete all transactions belonging to this account
      await Transactions.deleteMany({
        account: id,
      });

      // Delete the bank account
      await BankAccounts.deleteOne({
        _id: id,
        user: userId,
      });

      return response.status(200).json({
        message: "Bank account and transactions deleted successfully.",
      });
    } catch (error) {
      console.error("DELETE BANK ACCOUNT ERROR:", error);

      return response.status(500).json({
        error: "Failed to delete bank account.",
      });
    }
  }

  return response.status(405).json({
    error: "Method not allowed.",
  });
}