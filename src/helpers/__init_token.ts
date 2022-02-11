import JWT, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import config from "config";
import createHttpError from "http-errors";

export const signAccessToken = (userid: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const payload: JwtPayload = { role: "Access Token" };
    const secret: Secret = config.get<string>("ACCESS_TOKEN_SECRET");
    const options: SignOptions = {
      subject: userid,
      audience: "http://localhost:" + config.get<number>("PORT"),
      issuer: "Chayan Simon Saikia",
      expiresIn: "1m",
    };
    return JWT.sign(payload, secret, options, (err, token) => {
      if (err) return reject(new createHttpError.InternalServerError());
      if (!token) return reject(new createHttpError.InternalServerError());
      resolve(token);
    });
  });
};

export const signRefreshToken = (userid: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const payload: JwtPayload = { role: "Refresh Token" };
    const secret: Secret = config.get<string>("REFRESH_TOKEN_SECRET");
    const options: SignOptions = {
      subject: userid,
      audience: "http://localhost:" + config.get<number>("PORT"),
      issuer: "Chayan Simon Saikia",
      expiresIn: "6m",
    };

    return JWT.sign(payload, secret, options, (err, token) => {
      if (err) return reject(new createHttpError.InternalServerError());
      if (!token) return reject(new createHttpError.InternalServerError());
      resolve(token);
    });
  });
};
