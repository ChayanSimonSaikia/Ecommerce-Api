import { NextFunction, Request, Response } from "express";
import { createCategory } from "../services/category.services";
import { categoryFrom } from "../validation/category.validation";

export const POST__category = async (
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
