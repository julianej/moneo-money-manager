import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankAccounts",
    required: true,
  },
});


const Categories =
  mongoose.models.Categories ||
  mongoose.model("Categories", categorySchema);

export default Categories;