import jwt from "jsonwebtoken";

export function getAuthenticatedUserId(req) {
  const cookies = req.headers.cookie || "";

  const authCookie = cookies
    .split(";")
    .find((cookie) =>
      cookie.trim().startsWith("auth_token=")
    );

  if (!authCookie) {
    return null;
  }

  const token = authCookie
    .trim()
    .replace("auth_token=", "");

  try {
    const decoded = jwt.verify(
      token,
      process.env.AUTH_SECRET
    );

    return decoded.userId;
  } catch (error) {
    return null;
  }
}