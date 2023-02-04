import { Request, Response, NextFunction } from "express";
import { verifyRefreshToken } from "../helpers/generate_newTokens";
import {
  createUser,
  generateTokens,
  isValidUser,
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
    // response
    res.json({ tokens });
  } catch (error: any) {
    // For validation error
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
