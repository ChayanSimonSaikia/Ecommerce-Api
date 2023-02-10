import { Request, Response, NextFunction } from "express";
import { verifyRefreshToken } from "../helpers/generate_newTokens";
import {
  createUser,
  generateTokens,
  isValidUser,
  getUserById,
} from "../services/auth.services";
import { getProductById } from "../services/product.services";
import mongoose from "mongoose";

import createHttpError from "http-errors";
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

export const addToCart = async (
  req: Request<{ product_id: string }>,
  res: Response<{}, { payload: { sub: string } }>,
  next: NextFunction
) => {
  // If product id is empty
  const cart_id = req.params.product_id;
  if (cart_id.trim() === "")
    return next(
      new createHttpError.BadRequest("Something went wrong, Please try again.")
    );

  try {
    // getting user id
    const user_id = res.locals.payload.sub;
    const user = await getUserById(user_id);
    if (!user)
      return next(
        new createHttpError.InternalServerError("Somewent went wrong")
      );

    let new_cart = [...user.carts];

    for (let i = new_cart.length - 1; i >= 0; i--) {
      // if product already exists increase the quantity and calculate total price
      if (cart_id == new_cart[i].product_id.toString()) {
        const ind_price = new_cart[i].total_price / new_cart[i].quantity;
        new_cart[i].quantity++;
        new_cart[i].total_price = new_cart[i].total_price + ind_price;

        user.carts = new_cart;
        await user.save();

        return res.json({ message: "Added to cart" });
      }
    }
    // if dont exists
    // get the product details and push to new_cart
    const product = await getProductById(cart_id);
    if (!product)
      throw new createHttpError.InternalServerError("Invalid product id");

    new_cart.push({
      product_id: product._id,
      quantity: 1,
      total_price: product.price,
    });

    user.carts = new_cart;
    await user.save();

    res.json({ message: "Added to cart" });
  } catch (error) {
    let errorName;
    if (error instanceof Error) {
      errorName = error.name;
    }

    if (errorName === "CastError")
      return next(new createHttpError.BadRequest("Invalid product"));
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
