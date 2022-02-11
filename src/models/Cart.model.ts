import mongoose from "mongoose";
import { getCartSchema } from "../schema/Cart.schema";
import { CartDoc } from "../Types/__Interfaces";

const cartSchema = getCartSchema();

export const CartModel = mongoose.model<CartDoc>("Cart", cartSchema);
