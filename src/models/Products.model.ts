import mongoose from "mongoose";
import { MetaField, ProductDoc } from "../Types/__Interfaces";
import { getProductSchema } from "../schema/Product.schema";

const productSchema = getProductSchema();

productSchema.pre("save", function (next) {
  const product = this as ProductDoc;
  const meta = this.meta as MetaField;

  // if meta fields are empty, then inserting some default values
  if (meta.$isEmpty("title")) meta.title = product.title;
  if (meta.$isEmpty("desc")) meta.desc = product.description;
  if (meta.$isEmpty("keywords")) meta.keywords = product.title.split(" ");
});

export const ProductModel = mongoose.model<ProductDoc>(
  "Product",
  productSchema
);
