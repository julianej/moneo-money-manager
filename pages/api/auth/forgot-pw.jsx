import crypto from "crypto";

import dbConnect from "../../../db/connect";
import User from "../../../db/models/Users/Users";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  await dbConnect();

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  /*
   * We return the same message whether the email exists or not.
   * This prevents people from discovering which email addresses
   * have accounts.
   */
  if (!user) {
    return res.status(200).json({
      message:
        "If an account exists for this email, a reset link has been created.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const resetTokenExpires = new Date(
    Date.now() + 1000 * 60 * 30
  );

  user.passwordResetToken = resetTokenHash;
  user.passwordResetExpires = resetTokenExpires;

  await user.save();

  console.log("RESET TOKEN:", resetToken);

  return res.status(200).json({
    message:
      "If an account exists for this email, a reset link has been created.",
  });
}