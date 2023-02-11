import { Request, Response, NextFunction } from "express";
import { verifyRefreshToken } from "../helpers/generate_newTokens";
import {
  createUser,
  generateTokens,
  isValidUser,
  getUserById,
} from "../services/auth.services";
import { getProductById } from "../services/product.services";

import createHttpError from "http-errors";
import { UserLogin, UserReg } from "../Types/__Interfaces";
import { loginForm, registerForm } from "../validation/auth.validation";
import { updateCart } from "../validation/product.validation";

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
        new createHttpError.InternalServerError("Something went wrong")
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

export const modifyCart = async (
  req: Request<{ product_id: string; op: "DEL" | "MOD" }>,
  res: Response<{}, { payload: { sub: string } }>,
  next: NextFunction
) => {
  // If product id is empty
  const cart_id = req.params.product_id;
  if (cart_id.trim() === "")
    return next(
      new createHttpError.BadRequest("Something went wrong, Please try again.")
    );
  /* storing operation value and checking whether
  it is invalid operation request */
  const op = req.params.op;
  if (op !== "DEL" && op !== "MOD") return next(new createHttpError.NotFound());

  try {
    // getting user id
    const user_id = res.locals.payload.sub;
    const user = await getUserById(user_id);
    if (!user)
      return next(
        new createHttpError.InternalServerError("Something went wrong")
      );

    const carts = [...user.carts];
    // Finding desired cart index
    let indx;
    for (let i = 0; i < carts.length; i++) {
      if (cart_id == carts[i].product_id.toString()) {
        indx = i;
        break;
      }
    }
    // No index found that's means no cart with that product_id
    if (indx === undefined)
      return next(new createHttpError.InternalServerError("Product Not found"));
    /*  For Deleting a cart */
    if (op === "DEL") {
      carts.splice(indx, 1);
      user.carts = carts;
      await user.save();
      return res.json({ message: "Cart got deleted." });
    }
    /* For Updation of a cart  */
    // Validating Body
    const { quantity }: { quantity: number } = await updateCart.validateAsync(
      req.body
    );
    // Finding the individual product price
    const ind_price = carts[indx].total_price / carts[indx].quantity;
    // Updating the values
    carts[indx].quantity = quantity;
    carts[indx].total_price = ind_price * quantity;
    user.carts = carts;

    await user.save();
    res.json({ message: "Cart updated." });
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
