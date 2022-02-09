import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { UserDoc } from "./Types";
import { getUserSchema } from "./schema/User.schema";
import createHttpError from "http-errors";
import { logger } from "../utils/logger";

// User Schema
const userSchema = getUserSchema();

userSchema.pre("save", async function (next) {
  const user = this as UserDoc;
  // Password Hashing
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(user.password, salt);
  } catch (error: any) {
    logger.error(error);
    throw new createHttpError.InternalServerError();
  }
});

// Compare Password
userSchema.methods.comparePasswordasync = function (
  candidatePssword: string
): Promise<boolean> {
  const user = this as UserDoc;
  return bcrypt.compare(candidatePssword, user.password).catch((err: any) => {
    logger.error(err);
    throw new createHttpError.InternalServerError();
  });
};

export const UserModel = mongoose.model<UserDoc>("User", userSchema);
