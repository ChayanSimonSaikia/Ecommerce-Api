import { Application, NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { errorHandlerRoute } from "./errorHanding.routes";

export const routes = (app: Application) => {
  // app.get("/", (req: Request, res: Response, next: NextFunction) => {
  //   res.send("Hello from express");
  // });

  // 404 Error || Page not found
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new createHttpError.NotFound());
  });
  // Error Handler
  app.use(errorHandlerRoute);
};
