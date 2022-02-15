import JWT from "jsonwebtoken";
import config from "config";
import client from "../utils/__init_redis";
import createHttpError from "http-errors";

export const verifyRefreshToken = (refreshToken: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      config.get<string>("REFRESH_TOKEN_SECRET"),
      async (err, payload) => {
        try {
          if (err) return reject(new createHttpError.Unauthorized());
          if (!payload)
            return reject(new createHttpError.InternalServerError());

          const userid = payload.sub;
          if (typeof userid !== "string")
            return reject(new createHttpError.InternalServerError());

          const refresh_token = await client.GET(userid);
          if (refresh_token !== refreshToken)
            return reject(new createHttpError.Unauthorized());

          return resolve(userid);
        } catch (error: any) {
          console.log(error.message);
          reject(new createHttpError.InternalServerError());
        }
      }
    );
  });
};
