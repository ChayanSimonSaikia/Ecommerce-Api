import createHttpError from "http-errors";
import { signToken } from "../helpers/__sign_tokens";
import { UserModel } from "../models/User.model";
import { UserReg } from "../Types/__Interfaces";
import config from "config";
import JWT from "jsonwebtoken";
import client from "../utils/__init_redis";
import sendgrid from "@sendgrid/mail";
import { password } from "../validation/custom/regex.validation";
// TODO: Optimize services module
export const createUser = async (data: UserReg) => {
  try {
    const doesExists = await UserModel.findOne({
      "email.email_id": data.email,
    });
    if (doesExists) {
      throw new createHttpError.Conflict(`${data.email} is already exists`);
    }
    const user = new UserModel({
      name: { fname: data.name.fname, lname: data.name.lname },
      email: { email_id: data.email },
      password: data.password,
    });
    return user.save();
  } catch (error) {
    throw error;
  }
};

export const isValidUser = async (email: string) => {
  try {
    const user = await UserModel.findOne({
      "email.email_id": email,
    });
    // Is there any user with the given email
    if (!user) throw new createHttpError.NotFound("Email/Password is invalid");

    // Compare Password
    const isMatch = user.comparePassword(user.password);
    if (!isMatch)
      throw new createHttpError.NotFound("Email/Password is invalid");
    return user;
  } catch (error) {
    throw error;
  }
};

export const generateTokens = async (
  userid: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const accessToken = await signToken(
      "ACCESS",
      config.get<string>("ACCESS_TOKEN_SECRET"),
      userid,
      "1m"
    );
    const refreshToken = await signToken(
      "REFRESH",
      config.get<string>("REFRESH_TOKEN_SECRET"),
      userid,
      "1h"
    );
    // Storing refresh token in redis
    await client.SETEX(userid, 60 * 60, refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

export const sendVerificationMail = async (
  userid: string,
  email: string,
  fname: string
) => {
  try {
    const token = await signToken(
      "EMAIL",
      config.get<string>("EMAIL_TOKEN_SECRET"),
      userid,
      "5m"
    );
    const verificationURL = `http://localhost:3000/auth/verify/${token}`;
    const styleBtn = `background-color: #398AB9; color: white; padding: 1rem 2rem`;
    sendgrid.setApiKey(config.get<string>("SENDGRID_API"));
    await sendgrid.send({
      to: email,
      from: config.get<string>("EMAIL"),
      subject: "Email Verfification",
      html: `<p>Hello ${fname},</p>
      <span>It is mail from <strong>E-Com Test</strong>, to verify 
      your email please click on below button</span><br/><br/><br/>
      <a href="${verificationURL}" style="${styleBtn}">Verify Your Email</a>`,
    });
  } catch (error: any) {
    console.log(error);
    throw new createHttpError.InternalServerError();
  }
};

export const verifyEmail = async (token: string) => {
  if (!token) throw new createHttpError.BadRequest("Email verification failed");

  return JWT.verify(
    token,
    config.get<string>("EMAIL_TOKEN_SECRET"),
    async (err, payload) => {
      try {
        if (err) {
          const message =
            err.name === "TokenExpiredError"
              ? "Email Verification time has been expired"
              : "Bad Request";
          throw new createHttpError.BadRequest(message);
        }
        if (!payload) throw new createHttpError.InternalServerError();
        const userid = payload.sub;

        const user = await UserModel.findById(userid);
        if (!user)
          throw new createHttpError.InternalServerError(
            "Can not find the user"
          );

        user.email.isVerified = true;
        return user.save();
      } catch (error) {
        throw error;
      }
    }
  );
};

export const sendResetPasswordMail = async (email: string) => {
  try {
    const user = await UserModel.findOne({ "email.email_id": email });
    if (!user)
      throw new createHttpError.NotFound("No user found with that email");

    const secret = config.get<string>("PASSWORD_TOKEN_SECRET") + user.password;
    const token = await signToken("PASSWORD", secret, user.id, "5m");

    const verificationURL = `http://localhost:3000/auth/resetPassword/${user.id}/${token}`;
    const styleBtn = `background-color: #398AB9; color: white; padding: 1rem 2rem`;
    sendgrid.setApiKey(config.get<string>("SENDGRID_API"));
    await sendgrid.send({
      to: email,
      from: config.get<string>("EMAIL"),
      subject: "Reset Password",
      html: `<p>Hello</p>
    <span><p>You have requested to reset password as you forgot your password. 
    Click on the below button for resetting password, If you have not sent
    password reset request, please report it.</p></span><br/><br/><br/>
    <a href="${verificationURL}" style="${styleBtn}">Reset Password</a>`,
    });
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const resetPassword = async (
  userid: string,
  password: string,
  token: string
) => {
  try {
    const user = await UserModel.findById(userid);

    if (!user) throw new createHttpError.InternalServerError();
    const secret = config.get<string>("PASSWORD_TOKEN_SECRET") + user.password;

    return JWT.verify(token, secret, async (err, payload) => {
      if (err)
        throw new createHttpError.Unauthorized(
          "This link can be used one time only"
        );
      if (!payload || typeof payload.sub !== "string")
        throw new createHttpError.InternalServerError();

      try {
        const isSame = await user.comparePassword(password);
        if (isSame)
          throw new createHttpError.BadRequest("Please different password");

        user.password = password;
        return user.save();
      } catch (error) {
        throw error;
      }
    });
  } catch (error) {
    throw error;
  }
};
