import { Application, NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { errorHandlerRoute } from "./__errorHanding.routes";
import auth_routes from "./auth.routes";
import category_routes from "./category.routes";
import { product_router } from "./product.routes";

export const routes = (app: Application) => {
  app.use("/auth", auth_routes); //Auth routes
  app.use(product_router); //Product routes
  app.use(category_routes); //Category routes

  // 404 Error || Page not found
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new createHttpError.NotFound());
  });
  // Error Handler
  app.use(errorHandlerRoute);
};
