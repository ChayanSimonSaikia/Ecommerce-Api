import createHttpError from "http-errors";
import { CategoryModel } from "../models/Category.model";
import { ProductModel } from "../models/Products.model";
import { ProductDoc } from "../Types/__Interfaces";

// Get All products with pagination in decending order by date
export const getRecentlyAddedProducts = (
  current_page: number,
  items_per_page: number
) => {
  return ProductModel.find()
    .sort({ createdAt: -1 })
    .skip((current_page - 1) * items_per_page)
    .limit(items_per_page);
};

// Get All products by Category with pagination in decending order by date
export const getProductsByCategory = (
  category_id: string,
  current_page: number,
  items_per_page: number
) => {
  return ProductModel.find({ categories: category_id })
    .sort({ createdAt: -1 })
    .skip((current_page - 1) * items_per_page)
    .limit(items_per_page);
};

export const getTotalProducts = () => {
  return ProductModel.find().countDocuments();
};

export const getProductById = (product_id: string) => {
  return ProductModel.findById(product_id);
};

export const getTotalProductsByCategory = (category_id: string) => {
  return ProductModel.find({ categories: category_id }).countDocuments();
};

export const createProduct = async (data: ProductDoc) => {
  try {
    const category = await CategoryModel.findOne({ title: data.categories[0] });
    if (!category) throw new createHttpError.NotFound("category not found");
    data.categories[0] = category.id;
    const product: ProductDoc = new ProductModel(data);
    return product.save();
  } catch (error) {
    throw new createHttpError.InternalServerError();
  }
};

export const searchProduct = (
  search: string,
  filter: { price: number[]; category?: string }
) => {
  // if user filtered the category else normal search;
  return filter.category
    ? ProductModel.find({
        $text: { $search: search },
        price: { $gt: filter.price[0], $lt: filter.price[1] },
        categories: filter.category,
      })
    : ProductModel.find({
        $text: { $search: search },
        price: { $gt: filter.price[0], $lt: filter.price[1] },
      });
};
