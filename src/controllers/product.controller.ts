import { Request, Response, NextFunction } from "express";
import { createProduct } from "../services/product.services";
import { addProductForm } from "../validation/product.validation";

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
