import mongoose from "mongoose";

const userschema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  joinDate: { type: Date, default: Date.now },
  lastPasswordResetRequest: { type: Date },
  otp: { type: String },
  otpExpires: { type: Date },
  phoneNumber: { type: String },
  phoneVerified: { type: Boolean, default: false },
  languagePreference: { type: String, default: 'en' },
  languageSwitchOtp: { type: String },
  languageSwitchOtpExpires: { type: Date },
});
export default mongoose.model("user", userschema);
