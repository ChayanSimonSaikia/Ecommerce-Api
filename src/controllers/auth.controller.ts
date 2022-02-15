import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verifyRefreshToken } from "../helpers/generate_newTokens";
import { UserModel } from "../models/User.model";
import {
  createUser,
  generateTokens,
  isValidUser,
  resetPassword,
  sendResetPasswordMail,
  sendVerificationMail,
  verifyEmail,
} from "../services/auth.services";
import { UserLogin, UserReg } from "../Types/__Interfaces";
import { loginForm, registerForm } from "../validation/auth.validation";

export const POST__register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate, cleansing data
    const sanitized: UserReg = await registerForm.validateAsync(req.body);
    /* Checks if there any user already exists with same email address
    And Create user */
    const user = await createUser(sanitized);
    // Generating access token and refresh token
    const tokens = await generateTokens(user.id);
    // Send Email verification mail
    await sendVerificationMail(user.id, user.email.email_id, user.name.fname);
    res.json({ tokens });
  } catch (error: any) {
    if (error.name === "ValidationError") error.status = 422;
    next(error);
  }
};

export const POST__login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate, cleansing data
    const sanitized: UserLogin = await loginForm.validateAsync(req.body);
    // Is valid user
    const user = await isValidUser(sanitized.email);
    // Generatin access token and refresh token
    const tokens = await generateTokens(user.id);
    // response
    res.json({ tokens });
  } catch (error: any) {
    if (error.name === "ValidationError") error.status = 422;
    next(error);
  }
};

export const POST__sendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get user id
    const userid = res.locals.payload.sub;
    // find user
    const user = await UserModel.findById(userid);
    if (!user) throw new createHttpError.BadRequest();
    // if user already verified
    if (user.email.isVerified)
      throw new createHttpError.BadRequest("Email is already verified");
    // Send Email verification mail
    await sendVerificationMail(user.id, user.email.email_id, user.name.fname);
    // response
    res.json({ message: "Verification email has been sent" });
  } catch (error) {
    next(error);
  }
};

export const GET__verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get token from url
    const token = req.params.token;
    // verfiy email
    await verifyEmail(token);
    // response
    res.json({ message: "Email verified" });
  } catch (error) {
    next(error);
  }
};

export const PUT__refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken: string = req.body.refreshToken;
    // verifies token and return user id
    const userid = await verifyRefreshToken(refreshToken);
    // generates new pair of tokens
    const newTokens = await generateTokens(userid);
    res.json({ tokens: newTokens });
  } catch (error) {
    next(error);
  }
};

export const POST_forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email: string = req.body.email;
  if (!email) throw new createHttpError.BadRequest("Enter a valid email");

  try {
    await sendResetPasswordMail(email);
    res.json({ message: `Password reset link has been sent to ${email}.` });
  } catch (error) {
    next(error);
  }
};

export const PATCH_resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userid, token } = req.params;
  const password = req.body.password;
  if (!password || !token) throw new createHttpError.BadRequest();

  try {
    const user = await resetPassword(userid, password, token);
    res.json({ message: "Password has been reset", user: user });
  } catch (error) {
    next(error);
  }
};
