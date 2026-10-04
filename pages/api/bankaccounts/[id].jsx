import dbConnect from "@/db/connect";
import BankAccounts from "@/db/models/BankAccounts/BankAccounts";
import Transactions from "@/db/models/Transactions/Transactions";

export default async function handler(request, response) {
  await dbConnect();

  // BANKACCOUNT DELETE 
  const { id } = request.query;

  if (request.method === "DELETE") {
    try {
      // Delete all transactions belonging to this account
      await Transactions.deleteMany({
        account: id,
      });

      // Delete the bank account with USER ID
     const userId = getAuthenticatedUserId(req);

      if (!userId) {
        return response.status(404).json({
          error: "Bank account not found.",
        });
      }

      // Get the user ID from the account
      const accounts = await BankAccounts.find({
      user: userId,});

      return response.status(200).json({
        message: "Bank account and transactions deleted successfully.",
      });
    } catch (error) {
      console.error(error);

      return response.status(500).json({
        error: "Failed to delete bank account.",
      });
    }
  }

  return response.status(405).json({
    error: "Method not allowed.",
  });
}