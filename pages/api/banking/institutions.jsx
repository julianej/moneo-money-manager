export default async function handler(request, response) {
  if (request.method !== "GET") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  if (process.env.NODE_ENV !== "development") {
    return response.status(403).json({
      error: "Mock banking is available only in development.",
    });
  }

  return response.status(200).json([
    { id: "mock-dkb", name: "DKB (Demo)" },
    { id: "mock-n26", name: "N26 (Demo)" },
    { id: "mock-ing", name: "ING (Demo)" },
  ]);
}