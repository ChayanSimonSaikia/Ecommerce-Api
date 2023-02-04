import createHttpError from "http-errors";
import { CategoryModel } from "../models/Category.model";
import { ProductModel } from "../models/Products.model";
import { ProductDoc } from "../Types/__Interfaces";

export const createProduct = async (data: ProductDoc) => {
  try {
    const category = await CategoryModel.findOne({ title: data.categories[0] });
    if (!category) throw new createHttpError.NotFound("category not found");
    data.categories[0] = category.id;
    const product: ProductDoc = new ProductModel(data);
    return product.save();
  } catch (error) {}
};
