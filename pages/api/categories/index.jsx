import dbConnect from "@/db/connect";
import Categories from "@/db/models/Categories/Categories";

export default async function handler(request, response) {
  try {
    await dbConnect();

    if (request.method === "GET") {
      const categories = await Categories.find();

      return response.status(200).json(categories);
    }

    if (request.method === "POST") {
    const { category, account } = request.body;

    const newCategory = await Categories.create({
      category,
      account,
    });  
    return response.status(201).json(newCategory);
    }

    return response.status(405).json({
      error: "Method not allowed",
    });
  } catch (error) {
     console.error(error);
    return response.status(500).json({
          error: error.message,
    });
  }
}