import mongoose from "mongoose";
import { ProductDoc } from "../Types/__Interfaces";
import { getProductSchema } from "../schema/Product.schema";

const productSchema = getProductSchema();

productSchema.index({ title: "text", description: "text", categories: "text" });

export const ProductModel = mongoose.model<ProductDoc>(
  "Product",
  productSchema
);
