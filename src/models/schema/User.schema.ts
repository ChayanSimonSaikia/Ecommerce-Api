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
        phone_no: String,
        country_code: String,
        isVerified: { type: String, default: false },
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
      isSeller: { type: Boolean, default: false },
    },
    { timestamps: true }
  );
};
