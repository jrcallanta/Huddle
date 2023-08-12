import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, select: false },
        username: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        imgUrl: { type: String },
    },
    { timestamps: true }
);

const User = mongoose.models.user || mongoose.model("user", userSchema);
export default User;
