
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed.",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Gemini API key is not configured.",
    });
  }

  const accountName = req.body?.accountName?.trim();

  if (!accountName) {
    return res.status(400).json({
      error: "Account name is required.",
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `
        Generate exactly 5 useful transaction categories
        for a personal finance application.

        Account name: "${accountName}"

        Requirements:
        - Base all 5 categories on the account name.
        - Consider the account's likely purpose.
        - Use short, clear category names.
        - Each category must be 3 to 30 characters.
        - Avoid duplicates.
        - Return only a JSON array of 5 strings.
      `,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: {
          type: "ARRAY",
          items: {
            type: "STRING",
          },
        },
      },
    });

    const suggestions = JSON.parse(response.text || "[]");

    const categories = [
      ...new Set(
        suggestions
          .filter((item) => typeof item === "string")
          .map((item) => item.trim())
          .filter((item) => item.length >= 3 && item.length <= 30)
      ),
    ].slice(0, 5);

    if (categories.length !== 5) {
      return res.status(502).json({
        error: "Could not generate 5 valid categories. Please try again.",
      });
    }

    return res.status(200).json({ categories });
  } catch (error) {
    console.error("GEMINI CATEGORY ERROR:", error);

    return res.status(503).json({
      error: "Category generation is temporarily unavailable. Please try again.",
    });
  }
}