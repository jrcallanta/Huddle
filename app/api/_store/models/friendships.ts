import mongoose from "mongoose";

export const FRIENDSHIP_STATUS = ["REQUESTING", "FRIENDS"];

const friendshipSchema = new mongoose.Schema(
    {
        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        toUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        status: {
            type: String,
            enum: FRIENDSHIP_STATUS,
            required: true,
            default: FRIENDSHIP_STATUS[0],
        },
    },
    { timestamps: true }
);

const Friendship =
    mongoose.models.friendship ||
    mongoose.model("friendship", friendshipSchema);
export default Friendship;
