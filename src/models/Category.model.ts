import mongoose from "mongoose";
import { CategoryDoc } from "../Types/__Interfaces";
import { getCategorySchema } from "../schema/Category.schema";

const categorySchema = getCategorySchema();

export const CategoryModel = mongoose.model<CategoryDoc>(
  "Category",
  categorySchema
);
