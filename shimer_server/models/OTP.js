import { Schema, model } from "mongoose";

// OTP model
const OTPSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
});

OTPSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
  this.otp = otp.toString();
  this.expiry = new Date(Date.now() + 10 * 60 * 1000); // Set expiry time (e.g., 10 minutes)
  return otp;
};

export default model("OTP", OTPSchema);
