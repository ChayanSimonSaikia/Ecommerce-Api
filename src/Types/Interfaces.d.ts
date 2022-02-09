import { ErrorRequestHandler } from "express";

export interface ErrorHandler extends ErrorRequestHandler {
  status: number;
  message: string;
}
