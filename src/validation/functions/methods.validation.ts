import { error } from "console";
import Joi from "joi";

export const capitalized = (value: any, helper: Joi.CustomHelpers<any>) => {
  console.log(typeof value);

  const whiteSpaceRemoved: string = value
    .replace(/\s{2,}/g, " ")
    .trimEnd()
    .trimStart();
  if (whiteSpaceRemoved.split(" ").length === 1)
    return (
      whiteSpaceRemoved.charAt(0).toUpperCase() + whiteSpaceRemoved.slice(1)
    );

  let name = "";
  whiteSpaceRemoved.split(" ").map((val) => {
    name += val.charAt(0).toUpperCase() + val.slice(1);
  });
  return name;
};

export const isEmptyField: Joi.CustomValidator<string> = (value, helper) => {
  if (value.trim() === "") return helper.error("any.invalid");
  return value;
};
