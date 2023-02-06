import { NextFunction, Request, Response } from "express";
import { createCategory, getCategory } from "../services/category.services";
import { categoryFrom } from "../validation/category.validation";

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const santized = await categoryFrom.validateAsync(req.body);
    const category = await createCategory(santized);
    res.json({ message: "New Category Created", category });
  } catch (error) {
    next(error);
  }
};

export const viewCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await getCategory();

    res.json({ message: "New Category Created", categories });
  } catch (error) {
    next(error);
  }
};
