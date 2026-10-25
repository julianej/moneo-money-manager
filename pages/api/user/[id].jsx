
import dbConnect from "@/db/connect";
import User from "@/db/models/Users/Users";
import BankAccounts from "@/db/models/BankAccounts/BankAccounts";
import Transactions from "@/db/models/Transactions/Transactions";
import Categories from "@/db/models/Categories/Categories";
import { getAuthenticatedUserId } from "@/utils/cleanUserAuth";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return res.status(405).json({
      error: "Method not allowed.",
    });
  }

  try {
    await dbConnect();

    // Authenticate the request.
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized.",
      });
    }

    // Verify that the user exists before deleting anything.
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    // Delete the user's financial records first.
    await Transactions.deleteMany({
      user: user._id,
    });

    await Categories.deleteMany({
      user: user._id,
    });

    // Delete parent bank accounts and their cash sub-wallets.
    await BankAccounts.deleteMany({
      user: user._id,
    });

    // Delete the user record last.
    await User.deleteOne({
      _id: user._id,
    });

    // Clear the authentication cookie.
    const cookieParts = [
      "auth_token=",
      "Path=/",
      "Max-Age=0",
      "HttpOnly",
      "SameSite=Lax",
    ];

    if (process.env.NODE_ENV === "production") {
      cookieParts.push("Secure");
    }

    res.setHeader("Set-Cookie", cookieParts.join("; "));

    return res.status(200).json({
      success: true,
      message: "Your account has been permanently deleted.",
    });
  } catch (error) {
    console.error("ACCOUNT DELETION ERROR:", error);

    return res.status(500).json({
      error: "Account deletion failed. Please try again.",
    });
  }
}
