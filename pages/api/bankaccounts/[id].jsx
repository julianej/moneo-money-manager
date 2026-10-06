import dbConnect from "@/db/connect";
import BankAccounts from "@/db/models/BankAccounts/BankAccounts";
import Transactions from "@/db/models/Transactions/Transactions";
import { getAuthenticatedUserId } from "@/utils/cleanUserAuth";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method !== "DELETE") {
    return response.status(405).json({
      error: "Method not allowed.",
    });
  }

  try {
    const userId = getAuthenticatedUserId(request);
    const { id } = request.query;

    console.log("DELETE ACCOUNT ID:", id);
    console.log("DELETE USER ID:", userId);

    if (!userId) {
      return response.status(401).json({
        error: "Unauthorized.",
      });
    }

    const account = await BankAccounts.findOne({
      _id: id,
      user: userId,
    });

    console.log("ACCOUNT FOUND:", account);

    if (!account) {
      return response.status(404).json({
        error: "Bank account not found.",
      });
    }

    const deletedTransactions =
      await Transactions.deleteMany({
        account: id,
      });

    console.log(
      "TRANSACTIONS DELETED:",
      deletedTransactions.deletedCount
    );

    const deletedAccount =
      await BankAccounts.deleteOne({
        _id: id,
        user: userId,
      });

    console.log(
      "ACCOUNT DELETED:",
      deletedAccount.deletedCount
    );

    return response.status(200).json({
      message:
        "Bank account and transactions deleted successfully.",
      deletedTransactions:
        deletedTransactions.deletedCount,
      deletedAccount:
        deletedAccount.deletedCount,
    });
  } catch (error) {
    console.error("DELETE BANK ACCOUNT ERROR:", error);

    return response.status(500).json({
      error: error.message,
    });
  }
}