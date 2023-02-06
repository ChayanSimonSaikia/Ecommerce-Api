import { CategoryModel } from "../models/Category.model";
import { CategoryDoc } from "../Types/__Interfaces";

export const createCategory = (
  data: Pick<CategoryDoc, "title" | "description">
) => {
  const category = new CategoryModel(data);
  return category.save();
};

export const getCategory = () => {
  return CategoryModel.find();
};
