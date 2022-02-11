import { Schema } from "mongoose";

export const getCategorySchema = (): Schema => {
  return new Schema(
    {
      title: { type: String, required: true, unique: true },
      products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
      meta: {
        title: String,
        keywords: [String],
        desc: String,
      },
    },
    { timestamps: true }
  );
};
