import { Request, Response, NextFunction } from "express";
import { signAccessToken, signRefreshToken } from "../../helpers/__init_token";
import { createUser } from "../../services/auth.services";
import { UserReg } from "../../Types/__Interfaces";
import { logger } from "../../utils/logger";
import { registerForm } from "../../validation/auth.validation";

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
    logger.info(user);
    // Generatin access token and refresh token
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);

    res.json({ tokens: { accessToken, refreshToken } });
  } catch (error: any) {
    if (error.name === "ValidationError") error.status = 422;
    next(error);
  }
};
