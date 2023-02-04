import { Schema } from "mongoose";
import { UserDoc } from "./__Interfaces";

export type Address =
  | "full_address"
  | "country"
  | "state"
  | "district"
  | "street"
  | "pincode"
  | "po";

export type TokenRole = "ACCESS" | "REFRESH" | "EMAIL" | "PASSWORD";

export type UserDocWithId = UserDoc & {
  _id: Schema.Types.ObjectId;
};
