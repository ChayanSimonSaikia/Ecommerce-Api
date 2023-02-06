import { Request, Response, NextFunction } from "express";
import {
  createProduct,
  getRecentlyAddedProducts,
  getTotalProducts,
  getProductsByCategory,
  getTotalProductsByCategory,
} from "../services/product.services";
import { addProductForm } from "../validation/product.validation";
import createHttpError from "http-errors";

export const viewRecentlyAddedProducts = async (
  req: Request<{}, {}, {}, { page: string }>,
  res: Response,
  next: NextFunction
) => {
  const current_page = +req.query.page || 1;
  const items_per_page = 4;
  try {
    const products = await getRecentlyAddedProducts(
      current_page,
      items_per_page
    );

    if (products.length === 0)
      throw new createHttpError.NotFound("Could not found any products");
    const totalProducts = await getTotalProducts();

    res.json({
      message: "Products fetched successFully",
      totalProducts,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const viewProductsByCategory = async (
  req: Request<{ category: string }, {}, {}, { page: string }>,
  res: Response,
  next: NextFunction
) => {
  const category_id = req.params.category;
  const current_page = +req.query.page || 1;
  const items_per_page = 4;

  try {
    const products = await getProductsByCategory(
      category_id,
      current_page,
      items_per_page
    );

    if (products.length === 0)
      throw new createHttpError.NotFound("Could not found any products");

    // total product
    const totalProducts = await getTotalProductsByCategory(category_id);

    res.json({
      message: "Products fetched successFully",
      totalProducts,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sanitized = await addProductForm.validateAsync(req.body);
    const product = await createProduct(sanitized);
    res.json({ message: "prodcuct created", product });
  } catch (error) {
    next(error);
  }
};
