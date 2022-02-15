import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import config from "config";
import JWT from "jsonwebtoken";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers["authorization"];
  if (!header) return next(new createHttpError.Unauthorized());

  const token = header.split(" ")[1]; // TOKEN

  JWT.verify(
    token,
    config.get<string>("ACCESS_TOKEN_SECRET"),
    (err, payload) => {
      if (err) {
        const message =
          err.name ===
          ("JsonWebTokenError" || "NotBeforeError" || "SyntaxError")
            ? "Unauthorized"
            : err.message;
        return next(new createHttpError.Unauthorized(message));
      }
      res.locals.payload = payload;
      next();
    }
  );
};
