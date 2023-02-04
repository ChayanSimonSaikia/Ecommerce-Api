import { ErrorRequestHandler } from "express";
import { Document, Schema } from "mongoose";
import { Address } from "./__Types";

export interface UserDoc extends Document {
  _id: Schema.Types.ObjectId;
  name: { fname: string; lname: string };
  email: { email_id: string; isVerified: boolean };
  password: string;
  phone: { phone_no: number; country_code: string; isVerified: boolean };
  alt_phone: { phone_no: number; country_code: string };
  address: Record<Address, string>;
  isSeller: boolean;
  comparePassword(candidatePssword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDoc extends Document {
  title: string;
  description: string;
  price: number;
  quantity: number;
  images: {
    display_image: string;
    other_images: string[];
  };
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryDoc extends Document {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
// Cart document type

export interface CartDoc extends Document {
  userid: Schema.Types.ObjectId;
  items: [CartItem];
  createdAt: Date;
  updatedAt: Date;
}

export interface ErrorHandler extends ErrorRequestHandler {
  status: number;
  message: string;
}

export interface CartItem extends Document {
  item: Schema.Types.ObjectId;
  quantity: number;
  total_price: number;
}

/* Validation interfaces */
export interface UserValidation extends UserDoc {
  confirmPassword: any;
}
export interface UserReg {
  name: {
    fname: string;
    lname: string;
  };
  email: string;
  password: string;
}
export interface UserLogin {
  email: string;
  password: string;
}
