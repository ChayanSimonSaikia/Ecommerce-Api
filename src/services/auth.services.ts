import createHttpError from "http-errors";
import { UserModel } from "../models/User.model";
import { UserReg } from "../Types/__Interfaces";

export const createUser = async (data: UserReg) => {
  try {
    const doesExists = await UserModel.findOne({ email: data.email });
    if (doesExists)
      throw new createHttpError.Conflict(`${data.email} is already exists`);
    const user = new UserModel({
      name: { fname: data.name.fname, lname: data.name.lname },
      email: { email_id: data.email },
      password: data.password,
    });
    return await user.save();
  } catch (error) {
    throw error;
  }
};
