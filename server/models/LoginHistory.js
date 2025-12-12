import mongoose from "mongoose";

const loginHistorySchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    browser: { type: String },
    os: { type: String },
    deviceType: { type: String },
    ip: { type: String },
    loginTime: { type: Date, default: Date.now },
});

export default mongoose.model("LoginHistory", loginHistorySchema);
