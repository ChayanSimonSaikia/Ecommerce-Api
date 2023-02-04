import Joi from "joi";
import { ProductDoc } from "../Types/__Interfaces";

export const addProductForm = Joi.object<ProductDoc>({
  title: Joi.string().required().min(4),
  description: Joi.string().required(),
  price: Joi.number().required().min(1),
  quantity: Joi.number().required().min(0),
  // images: {
  //   display_image: Joi.string().required(),
  //   other_images: [Joi.string().required()],
  // },
  categories: Joi.array().items(Joi.string().required()),
});
