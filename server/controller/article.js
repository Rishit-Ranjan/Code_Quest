import Article from "../models/Article.js";

export const postArticle = async (req, res) => {
    const { title, content, tags, authorName } = req.body;
    const authorId = req.userId;

    const newArticle = new Article({
        title,
        content,
        tags,
        authorId,
        authorName
    });

    try {
        await newArticle.save();
        res.status(200).json({ data: newArticle });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.status(200).json({ data: articles });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
