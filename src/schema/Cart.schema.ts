import { Schema } from "mongoose";

export const getCartSchema = () => {
  return new Schema({
    userid: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        total_price: { type: Number, required: true },
      },
    ],
  });
};
