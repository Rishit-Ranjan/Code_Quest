import mongoose from "mongoose";

const articleSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    authorName: { type: String, required: true },
    tags: { type: [String], default: [] },
    upvotes: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Article", articleSchema);
