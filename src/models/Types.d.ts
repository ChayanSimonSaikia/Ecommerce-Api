import { Document } from "mongoose";

export interface UserDoc extends Document {
  name: { fname: string; lname: string };
  email: { email_id: string; isVerified: boolean };
  password: string;
  phone: { phone_no: number; country_code: string; isVerified: false };
  address: {
    full_address: string;
    country: string;
    state: string;
    district: string;
    street: string;
    pincode: number;
    po: string;
  };
  isSeller: boolean;
  createdAt: Date;
  updatedAt: Date;
}
