import { Schema } from "mongoose";

export const getProductSchema = (): Schema => {
  return new Schema(
    {
      title: { type: String, required: true, unique: true },

      description: { type: String, required: true },

      price: {
        selling_price: { type: Number, required: true },
        offer_price: Number,
      },

      inSale: { type: Boolean, default: false },

      quantity: { type: Number, required: true, min: 0 },

      isAvailable: { type: Boolean, default: true },

      images: {
        display_image: { type: String, required: true },
        other_images: [{ type: String, required: true }],
      },

      categories: [
        { type: Schema.Types.ObjectId, ref: "Category", required: true },
      ],

      meta: {
        title: String,
        keywords: [String],
        desc: String,
      },
    },
    { timestamps: true }
  );
};
