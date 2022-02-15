// import { Request, Response, NextFunction } from "express";
// import createHttpError from "http-errors";
// import { UserModel } from "../models/User.model";
// export const isEmailVerified = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userid = res.locals.payload.sub;
//   const user = await UserModel.findById(userid);
//   if (!user) throw new createHttpError.BadRequest();

//   if(user.email.isVerified) throw new createHttpError.
// };
