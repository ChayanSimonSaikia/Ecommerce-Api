import createHttpError from "http-errors";
import { signToken } from "../helpers/__sign_tokens";
import { UserModel } from "../models/User.model";
import { UserReg } from "../Types/__Interfaces";
import config from "config";
import JWT from "jsonwebtoken";
import client from "../utils/__init_redis";
import sendgrid from "@sendgrid/mail";
import { UserDocWithId } from "../Types/__Types";

export const createUser = async (data: UserReg): Promise<UserDocWithId> => {
  // search user by email
  const doesExists = await UserModel.findOne({
    "email.email_id": data.email,
  });
  // Checks duplicate record
  if (doesExists)
    throw new createHttpError.Conflict(`${data.email} is already exists`);
  // Creating a user object;
  const user = new UserModel({
    name: { fname: data.name.fname, lname: data.name.lname },
    email: { email_id: data.email },
    password: data.password,
  });
  // return a save user;
  return user.save();
};

export const isValidUser = async (email: string) => {
  // Search user by id
  const user = await UserModel.findOne({
    "email.email_id": email,
  });
  // Is there any user with the given email
  if (!user) throw new createHttpError.NotFound("Email/Password is invalid");
  // Compare Password
  const isMatch = user.comparePassword(user.password);
  if (!isMatch) throw new createHttpError.NotFound("Email/Password is invalid");
  // returning the valid user
  return user;
};

export const generateTokens = async (
  userid: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  // Access token
  const accessToken = await signToken(
    "ACCESS",
    config.get<string>("ACCESS_TOKEN_SECRET"),
    userid,
    "5m"
  );
  // Refresh token
  const refreshToken = await signToken(
    "REFRESH",
    config.get<string>("REFRESH_TOKEN_SECRET"),
    userid,
    "1h"
  );
  // Storing refresh token in redis
  await client.SETEX(userid, 60 * 60, refreshToken);

  return { accessToken, refreshToken };
};
