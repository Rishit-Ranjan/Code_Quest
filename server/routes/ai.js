import express from "express";
import { aiChat } from "../controller/ai.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/chat", auth, aiChat);

export default router;
