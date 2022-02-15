import { Application, NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { errorHandlerRoute } from "./errorHanding.routes";
import auth_routes from "./auth.routes";
import { product_router } from "./product.routes";

export const routes = (app: Application) => {
  app.use(product_router); //Auth routes
  app.use("/auth", auth_routes); //Auth routes

  // 404 Error || Page not found
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new createHttpError.NotFound());
  });
  // Error Handler
  app.use(errorHandlerRoute);
};
