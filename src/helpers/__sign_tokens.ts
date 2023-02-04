import JWT, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import config from "config";
import createHttpError from "http-errors";
import { TokenRole } from "../Types/__Types";

export const signToken = (
  role: TokenRole,
  key: string,
  subject: string,
  expiresIn: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const payload: JwtPayload = { role: role };
    const secret: Secret = key;
    const options: SignOptions = {
      subject: subject,
      audience: "http://localhost:" + config.get<number>("PORT"),
      issuer: "Chayan Simon Saikia",
      expiresIn: expiresIn,
    };

    return JWT.sign(payload, secret, options, (err, token) => {
      if (err) return reject(new createHttpError.InternalServerError());
      if (!token) return reject(new createHttpError.InternalServerError());

      resolve(token);
    });
  });
};
