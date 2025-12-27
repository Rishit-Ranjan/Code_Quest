import mongoose from "mongoose";

const userschema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatarUrl: { type: String },
  about: { type: String },
  notificationsEnabled: { type: Boolean, default: true },
  notifications: [
    {
      type: { type: String },
      message: { type: String },
      link: { type: String },
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
  ],
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
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'question' }],
});
export default mongoose.model("user", userschema);
