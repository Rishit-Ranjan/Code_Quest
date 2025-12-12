import mongoose from "mongoose";
import user from "../models/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userAgent from "user-agent";
import requestIp from "request-ip";
import nodemailer from "nodemailer";
import LoginHistory from "../models/LoginHistory.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Login OTP",
    text: `Your OTP for login is: ${otp}`,
  };
  await transporter.sendMail(mailOptions);
};
export const Signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exisitinguser = await user.findOne({ email });
    if (exisitinguser) {
      return res.status(404).json({ message: "User already exist" });
    }
    const token = jwt.sign(
      { email: newuser.email, id: newuser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const hashpassword = await bcrypt.hash(password, 12);
    const newuser = await user.create({
      name,
      email,
      password: hashpassword,
    });
    res.status(200).json({ data: newuser, token });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};
export const Login = async (req, res) => {
  const { email, password } = req.body;
  const clientIp = requestIp.getClientIp(req);
  const agent = userAgent.parse(req.headers["user-agent"]);
  const browser = agent.toAgent();
  const os = agent.os;
  const device = agent.device; // 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone', 'Android' etc. or 'Other'

  // Determine if mobile
  const isMobile = /mobile/i.test(req.headers["user-agent"]);

  console.log("Login Attempt:", { email, browser, os, device, isMobile, clientIp });

  // 1. Mobile Time Restriction (10 AM - 1 PM)
  if (isMobile) {
    const currentHour = new Date().getHours();
    if (currentHour < 10 || currentHour >= 13) {
      return res.status(403).json({ message: "Mobile access is only allowed between 10 AM and 1 PM." });
    }
  }

  try {
    const exisitinguser = await user.findOne({ email });
    if (!exisitinguser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // 2. Microsoft Edge Bypass (Login without password)
    // Check if browser string contains "Edg" (Edge)
    const isEdge = /Edg/.test(req.headers["user-agent"]);
    if (isEdge) {
      const token = jwt.sign(
        { email: exisitinguser.email, id: exisitinguser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      // Record History
      await LoginHistory.create({
        userId: exisitinguser._id,
        browser: browser,
        os: os,
        deviceType: isMobile ? "Mobile" : "Desktop",
        ip: clientIp,
      });
      return res.status(200).json({ data: exisitinguser, token });
    }

    // 3. Google Chrome OTP
    const isChrome = /Chrome/.test(req.headers["user-agent"]) && !/Edg/.test(req.headers["user-agent"]); // Edge also has Chrome in UA
    if (isChrome) {
      const ispasswordcrct = await bcrypt.compare(password, exisitinguser.password);
      if (!ispasswordcrct) {
        return res.status(400).json({ message: "Invalid password" });
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      exisitinguser.otp = otp;
      exisitinguser.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
      await exisitinguser.save();

      try {
        await sendOTP(email, otp);
        return res.status(200).json({ otpRequired: true, userId: exisitinguser._id, message: "OTP sent to your email" });
      } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Failed to send OTP" });
      }
    }

    // 4. Default Login
    const ispasswordcrct = await bcrypt.compare(password, exisitinguser.password);
    if (!ispasswordcrct) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { email: exisitinguser.email, id: exisitinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // Record History
    await LoginHistory.create({
      userId: exisitinguser._id,
      browser: browser,
      os: os,
      deviceType: isMobile ? "Mobile" : "Desktop",
      ip: clientIp,
    });
    res.status(200).json({ data: exisitinguser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};

export const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;
  const clientIp = requestIp.getClientIp(req);
  const agent = userAgent.parse(req.headers["user-agent"]);

  try {
    const exisitinguser = await user.findById(userId);
    if (!exisitinguser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (exisitinguser.otp !== otp || exisitinguser.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP
    exisitinguser.otp = undefined;
    exisitinguser.otpExpires = undefined;
    await exisitinguser.save();

    const token = jwt.sign(
      { email: exisitinguser.email, id: exisitinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Record History
    await LoginHistory.create({
      userId: exisitinguser._id,
      browser: agent.toAgent(),
      os: agent.os,
      deviceType: /mobile/i.test(req.headers["user-agent"]) ? "Mobile" : "Desktop",
      ip: clientIp,
    });

    res.status(200).json({ data: exisitinguser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getLoginHistory = async (req, res) => {
  try {
    const history = await LoginHistory.find({ userId: req.userId }).sort({ loginTime: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
export const getallusers = async (req, res) => {
  try {
    const alluser = await user.find();
    res.status(200).json({ data: alluser });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};
export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body.editForm;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "User unavailable" });
  }
  try {
    const updateprofile = await user.findByIdAndUpdate(
      _id,
      { $set: { name: name, about: about, tags: tags } },
      { new: true }
    );
    res.status(200).json({ data: updateprofile });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    if (existingUser.lastPasswordResetRequest) {
      const timeSinceLastRequest =
        Date.now() - existingUser.lastPasswordResetRequest.getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      if (timeSinceLastRequest < oneDay) {
        return res.status(429).json({
          message:
            "You can only request a password reset once per day.",
        });
      }
    }

    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    existingUser.password = hashedPassword;
    existingUser.lastPasswordResetRequest = new Date();
    await existingUser.save();

    res.status(200).json({
      message: "Password has been reset. Please check your email.",
      password: newPassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};
