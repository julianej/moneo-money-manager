
import jwt from "jsonwebtoken";

export function getAuthenticatedUserId(req) {
  const cookies = req.headers.cookie || "";

  const authCookie = cookies
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("auth_token="));

  if (!authCookie) {
    console.warn("AUTH: auth_token cookie is missing.");
    return null;
  }

  const token = authCookie.slice("auth_token=".length);

  if (!process.env.AUTH_SECRET) {
    console.error("AUTH: AUTH_SECRET is not configured.");
    return null;
  }

  try {
    const decoded = jwt.verify(
      decodeURIComponent(token),
      process.env.AUTH_SECRET
    );

    if (
      typeof decoded === "string" ||
      !decoded.userId
    ) {
      console.warn("AUTH: JWT has no userId claim.");
      return null;
    }

    return decoded.userId;
  } catch (error) {
    console.warn("AUTH: JWT verification failed:", error.message);
    return null;
  }
}
