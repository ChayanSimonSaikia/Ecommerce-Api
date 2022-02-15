export type Address =
  | "full_address"
  | "country"
  | "state"
  | "district"
  | "street"
  | "pincode"
  | "po";

export type TokenRole = "ACCESS" | "REFRESH" | "EMAIL" | "PASSWORD";
