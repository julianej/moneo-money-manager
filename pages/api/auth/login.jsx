import dbConnect from "../../../db/dbConnect";
import User from "../../../db/models/User/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  await dbConnect();

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  // ADD IT HERE
    const token = jwt.sign(
    {
        userId: user._id.toString(),
    },
    process.env.AUTH_SECRET,
    {
        expiresIn: "7d",
    }
    );

 // COOKIES
    res.setHeader(
    "Set-Cookie",
    `auth_token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`
    );

  return res.status(200).json({
    message: "Login successful.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}