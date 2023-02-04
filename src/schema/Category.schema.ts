import { Schema } from "mongoose";

export const getCategorySchema = (): Schema => {
  return new Schema(
    {
      title: { type: String, required: true, unique: true },
      description: String,
    },
    { timestamps: true }
  );
};
