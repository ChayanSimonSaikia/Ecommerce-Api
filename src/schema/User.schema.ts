import { Schema } from "mongoose";

export const getUserSchema = (): Schema => {
  return new Schema(
    {
      name: {
        fname: { type: String, required: true },
        lname: { type: String, required: true },
      },

      email: {
        email_id: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
        },
        isVerified: { type: Boolean, default: false },
      },

      password: { type: String, required: true },

      phone: {
        phone_no: Number,
        country_code: String,
        isVerified: { type: Boolean, default: false },
      },

      alt_phone: {
        phone_no: Number,
        country_code: String,
      },

      address: {
        full_address: String,
        country: String,
        state: String,
        district: String,
        street: String,
        pincode: Number,
        po: String,
      },

      isAdmin: { type: Boolean, default: false },
      carts: [
        {
          product_id: { type: Schema.Types.ObjectId, ref: "Product" },
          quantity: Number,
          total_price: Number,
        },
      ],
    },
    { timestamps: true }
  );
};
