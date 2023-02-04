import { Schema } from "mongoose";

export const getProductSchema = (): Schema => {
  return new Schema(
    {
      title: { type: String, required: true, unique: true },

      description: { type: String, required: true },

      price: { type: Number, required: true },

      quantity: { type: Number, required: true, min: 0 },

      // images: {
      //   display_image: { type: String, required: true },
      //   other_images: [{ type: String, required: true }],
      // },

      categories: [
        { type: Schema.Types.ObjectId, ref: "Category", required: true },
      ],
    },
    { timestamps: true }
  );
};
