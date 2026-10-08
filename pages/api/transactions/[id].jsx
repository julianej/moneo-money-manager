import dbConnect from "@/db/connect";
import Transactions from "@/db/models/Transactions/Transactions";

export default async function handler(request, response) {
  try {
    await dbConnect();

    const { id } = request.query;

    if (request.method === "PATCH") {
      const transaction = await Transactions.findByIdAndUpdate(
        id,
        request.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!transaction) {
        return response.status(404).json({
          error: "Transaction not found",
        });
      }

      return response.status(200).json(transaction);
    }

    if (request.method === "DELETE") {
      const transaction = await Transactions.findByIdAndDelete(id);

      if (!transaction) {
        return response.status(404).json({
          error: "Transaction not found",
        });
      }

      return response.status(200).json(transaction);
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