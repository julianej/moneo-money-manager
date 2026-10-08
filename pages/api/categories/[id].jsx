import dbConnect from "@/db/connect";
import Categories from "@/db/models/Categories/Categories";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      const deletedCategory = await Categories.findByIdAndDelete(id);

      if (!deletedCategory) {
        return res.status(404).json({
          error: "Category not found.",
        });
      }

      return res.status(200).json({
        message: "Category deleted.",
        category: deletedCategory,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Could not delete category.",
      });
    }
  }

  return res.status(405).json({
    error: "Method not allowed.",
  });
}