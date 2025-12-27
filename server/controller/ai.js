import { GoogleGenerativeAI } from "@google/generative-ai";

export const aiChat = async (req, res) => {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(200).json({
            reply: "I'm the AI Assist! To enable my full capabilities, please add `GEMINI_API_KEY` to your server's `.env` file. Currently, I'm running in demo mode."
        });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });
    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ message: "Something went wrong with the AI service" });
    }
};
