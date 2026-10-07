import dbConnect from "@/db/connect";
import User from "@/db/models/Users/Users";
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

    if (request.method === "GET") {
      const user = await User.findById(userId).select(
        "name email plan createdAt"
        );

      if (!user) {
        return response.status(404).json({
          error: "User not found.",
        });
      }

      return response.status(200).json(user);
    }

    return response.status(405).json({
      error: "Method not allowed",
    });
  } catch (error) {
    console.error("USER API ERROR:", error);

    return response.status(500).json({
      error: "Internal server error",
    });
  }
}