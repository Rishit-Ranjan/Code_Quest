import express from "express";
import {
  getallusers,
  Login,
  Signup,
  updateprofile,
  forgotPassword,
  verifyOTP,
  getLoginHistory,
  requestLanguageSwitch,
  verifyLanguageSwitch,
  updatePhoneNumber,
  verifyPhoneNumber,
} from "../controller/auth.js";

const router = express.Router();
import auth from "../middleware/auth.js";
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/verify-otp", verifyOTP);
router.get("/history", auth, getLoginHistory);
router.post("/request-language-switch", auth, requestLanguageSwitch);
router.post("/verify-language-switch", auth, verifyLanguageSwitch);
router.post("/update-phone", auth, updatePhoneNumber);
router.post("/verify-phone", auth, verifyPhoneNumber);

router.post("/forgot-password", forgotPassword);
router.get("/getalluser", getallusers);
router.patch("/update/:id", auth, updateprofile);
export default router;
