import dbConnect from "@/db/connect";
import Transactions from "@/db/models/Transactions/Transactions";
import { getAuthenticatedUserId } from "../../../utils/cleanUserAuth";


export default async function handler(request, response) {
  try {
    await dbConnect();

    // CREATE
    if (request.method === "POST") {
      // const transaction = await Transactions.create(request.body);
      const userId = getAuthenticatedUserId(request);

      if (!userId) {
        return response.status(401).json({
          error: "Unauthorized",
        });
      }

      const transaction = await Transactions.create({
        ...request.body,
        user: userId,
      });

      return response.status(201).json(transaction);
    }

    // READ
    if (request.method === "GET") {

      // NEW SCHEMA OBJECT
      const userId = getAuthenticatedUserId(request);

      if (!userId) {
        return response.status(401).json({
          error: "Unauthorized",
        });
      }

      const { account } = request.query;

      const filter = account
        ? { account, user: userId }
        : { user: userId };

      // const filter = account
      //   ? { account }
      //   : {};

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