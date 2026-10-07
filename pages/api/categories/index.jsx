import dbConnect from "@/db/connect";
import Categories from "@/db/models/Categories/Categories";
import { getAuthenticatedUserId } from "@/utils/cleanUserAuth";

export default async function handler(request, response) {
  try {
    await dbConnect();

    const userId = getAuthenticatedUserId(request);

    if (!userId) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    // GET CATEGORIES
    if (request.method === "GET") {
      const { account } = request.query;

      const filter = {
        user: userId,
      };

      if (account) {
        filter.account = account;
      }

      const categories = await Categories.find(filter);

      return response.status(200).json(categories);
    }

    // CREATE CATEGORY
    if (request.method === "POST") {
      const { category, account } = request.body;

      if (!category || !account) {
        return response.status(400).json({
          error: "Category and account are required.",
        });
      }

      const newCategory = await Categories.create({
        category,
        account,
        user: userId,
      });

      return response.status(201).json(newCategory);
    }

    return response.status(405).json({
      error: "Method not allowed",
    });

  } catch (error) {
    console.error("CATEGORY API ERROR:", error);

    return response.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}