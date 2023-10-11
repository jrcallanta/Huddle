import { FRIENDSHIP_STATUS } from "@/types";
import mongoose from "mongoose";

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
            enum: Object.values(FRIENDSHIP_STATUS),
            required: true,
            default: FRIENDSHIP_STATUS.pending,
        },
    },
    { timestamps: true }
);
const Friendship =
    mongoose.models.friendship ||
    mongoose.model("friendship", friendshipSchema);
export default Friendship;
