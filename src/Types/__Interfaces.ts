import { ErrorRequestHandler } from "express";
import { Document, Schema } from "mongoose";
import { Address } from "./__Types";

export interface UserDoc extends Document {
  _id: Schema.Types.ObjectId;
  name: { fname: string; lname: string };
  email: { email_id: string; isVerified: boolean };
  password: string;
  phone: { phone_no: number; country_code: string; isVerified: false };
  alt_phone: { phone_no: number; country_code: string };
  address: Record<Address, string>;
  isSeller: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface ProductDoc extends Document {
  title: string;
  description: string;
  price: {
    selling_price: number;
    offer_price: number;
  };
  inSale: boolean;
  quantity: number;
  isAvailable: boolean;
  images: {
    display_image: string;
    other_images: string[];
  };
  categories: string[];
  meta: MetaField;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryDoc extends Document {
  title: string;
  products: string[];
  meta: MetaField;
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

// It is meta field used for purpose of imporving SEO
export interface MetaField extends Document {
  title: string;
  keywords: string[];
  desc: string;
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
