import Joi from "joi";
import { CategoryDoc } from "../Types/__Interfaces";

export const categoryFrom = Joi.object<CategoryDoc>({
  title: Joi.string().required(),
  description: Joi.string().required(),
});
