import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import dbConnect from "../../../db/connect";
import User from "../../../db/models/Users/Users";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    await dbConnect();

    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required.",
      });
    }

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        message: "Invalid Google token.",
      });
    }

    const { sub, email, name } = payload;

    if (!email || !sub) {
      return res.status(401).json({
        message: "Google account information is incomplete.",
      });
    }

    // Find existing Google user
    let user = await User.findOne({
      googleId: sub,
    });

    // If no Google user exists, check email
    if (!user) {
      user = await User.findOne({
        email: email.toLowerCase(),
      });

      if (user) {
        // Link Google account to existing user
        user.googleId = sub;
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          googleId: sub,
          email: email.toLowerCase(),
          name: name || "Google User",
          passwordHash: null,
          plan: "free",
        });
      }
    }

    // Check JWT secret
    if (!process.env.AUTH_SECRET) {
      console.error("AUTH_SECRET is missing.");

      return res.status(500).json({
        message: "Authentication configuration is missing.",
      });
    }

    // Create your existing JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.AUTH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Create the same authentication cookie
    res.setHeader(
      "Set-Cookie",
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax${
        process.env.NODE_ENV === "production"
          ? "; Secure"
          : ""
      }`
    );

    return res.status(200).json({
      message: "Google login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Google login failed.",
    });
  }
}