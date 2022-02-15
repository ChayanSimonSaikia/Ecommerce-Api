import Joi from "joi";

export const capitalized = (value: any, helper: Joi.CustomHelpers<any>) => {
  const whiteSpaceRemoved: string = value
    .replace(/\s{2,}/g, " ")
    .trimEnd()
    .trimStart();
  if (whiteSpaceRemoved.split(" ").length === 1)
    return (
      whiteSpaceRemoved.charAt(0).toUpperCase() + whiteSpaceRemoved.slice(1)
    );

  let name = "";
  const nameArray = whiteSpaceRemoved.split(" ");
  nameArray.map((val, index) => {
    name += val.charAt(0).toUpperCase() + val.slice(1);
    // adding space
    if (index !== nameArray.length - 1) name += " ";
  });
  return name;
};

export const isEmptyField: Joi.CustomValidator<string> = (value, helper) => {
  if (value.trim() === "") return helper.error("any.invalid");
  return value;
};
