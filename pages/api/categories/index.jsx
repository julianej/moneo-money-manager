import dbConnect from "@/db/connect";
import Categories from "@/db/models/Categories/Categories";

export default async function handler(request, response) {
  try {
    await dbConnect();

    if (request.method === "GET") {
      //take the account value from the URL query string
      ///api/categories?account=6abd055ad28881b6bcbb58b9
      //account === "6abd055ad28881b6bcbb58b9"
      const { account } = request.query;
      const filter = account ? { account } : {};

      //That returns all categories from all bank accounts.
      //const categories = await Categories.find();
      //filters categories for specific {account}
      const categories = await Categories.find(filter);

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