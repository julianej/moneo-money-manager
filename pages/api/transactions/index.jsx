import dbConnect from "@/db/connect";
import Transactions from "@/db/models/Transactions/Transactions";

export default async function handler(request, response) {
  try {
    await dbConnect();

    // CREATE
    if (request.method === "POST") {
      const transaction = await Transactions.create(request.body);

      return response.status(201).json(transaction);
    }

    // READ
    if (request.method === "GET") {

      // NEW SCHEMA OBJECT
      const { account } = request.query;


      const filter = account
        ? { account }
        : {};

      const transactions = await Transactions.find(filter).sort({
        date: -1,
      });

      return response.status(200).json(transactions);
    }

    return response.status(405).json({
      error: "Method not allowed",
    });
  } catch (error) {
    console.error(error);

    return response.status(500).json({
        error: error.message,
    });
  }
}