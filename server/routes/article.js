import express from "express";
import { postArticle, getAllArticles } from "../controller/article.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/post", auth, postArticle);
router.get("/get", getAllArticles);

export default router;
