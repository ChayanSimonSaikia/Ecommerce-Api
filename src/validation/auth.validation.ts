import Joi from "joi";
import { capitalized, isEmptyField } from "./functions/methods.validation";
import { password } from "./functions/regex.validation";

export const registerForm = Joi.object({
  name: {
    fname: Joi.string()
      .required()
      .min(2)
      .max(14)
      .custom(isEmptyField)
      .custom(capitalized),
    lname: Joi.string()
      .required()
      .min(2)
      .max(10)
      .custom(isEmptyField, "fname")
      .custom(capitalized),
  },
  email: Joi.string().required().email().lowercase(),
  password: Joi.string()
    .required()
    .min(8)
    .max(14)
    .regex(
      password,
      "least eight characters, including at least one number and includes both lower and uppercase letters and special characters"
    ),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .options({
      messages: {
        "any.only": "Confirm Password is not matching with Password",
      },
    }),
});
