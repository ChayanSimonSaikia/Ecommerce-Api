import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../Types/__Interfaces";

// Express Error Handler
export const errorHandlerRoute = (
  error: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status: number = error.status || 500;
  const message: string = error.message || "Internal Server Error";
  console.log(error);
  res.status(status).json({ status, message });
};
