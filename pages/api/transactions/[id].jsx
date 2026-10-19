import mongoose from "mongoose";

import dbConnect from "@/db/connect";
import Transactions from "@/db/models/Transactions/Transactions";
import { getAuthenticatedUserId } from "@/utils/cleanUserAuth";

export default async function handler(request, response) {
  if (!["PATCH", "DELETE"].includes(request.method)) {
    response.setHeader("Allow", "PATCH, DELETE");
    return response.status(405).json({
      error: "Method not allowed.",
    });
  }

  try {
    await dbConnect();

    const userId = getAuthenticatedUserId(request);
    const { id } = request.query;

    if (!userId) {
      return response.status(401).json({
        error: "Unauthorized.",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({
        error: "Invalid transaction ID.",
      });
    }

    const filter = {
      _id: id,
      user: userId,
    };

    if (request.method === "DELETE") {
      const deleted = await Transactions.findOneAndDelete(filter);

      if (!deleted) {
        return response.status(404).json({
          error: "Transaction not found.",
        });
      }

      return response.status(200).json({
        message: "Transaction deleted.",
      });
    }

    const existing = await Transactions.findOne(filter);

    if (!existing) {
      return response.status(404).json({
        error: "Transaction not found.",
      });
    }

    // Bank-sourced records must not be silently overwritten by edits.
    if (existing.provider === "gocardless") {
      return response.status(409).json({
        error:
          "Bank-synchronized transactions cannot be edited through this endpoint.",
      });
    }

    const allowedFields = [
      "title",
      "amount",
      "category",
      "type",
      "date",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (request.body?.[field] !== undefined) {
        updates[field] = request.body[field];
      }
    }

    const updated = await Transactions.findOneAndUpdate(
      filter,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    return response.status(200).json(updated);
  } catch (error) {
    console.error("TRANSACTION API ERROR:", error.message);

    return response.status(500).json({
      error: "Internal server error.",
    });
  }
}