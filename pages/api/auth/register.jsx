import dbConnect from "../../../db/connect";
import User from "../../../db/models/Users/Users";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {

  await dbConnect();

  const { name, email, password } = req.body;

 if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  // Check required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required.",
    });
  }

  // Normalize the email
  const normalizedEmail = email.trim().toLowerCase();

  // Check whether the user already exists
  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  //409 means Conflict — in this case, the email is already registered.
  if (existingUser) {
    return res.status(409).json({
      message: "A user with this email already exists.",
    });
  }

  // HASH PW
  const passwordHash = await bcrypt.hash(password, 12);

  // Create the user
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  return res.status(201).json({
    message: "User created successfully.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}