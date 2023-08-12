import mongoose from "mongoose";

export const INVITE_STATUS = ["PENDING", "GOING", "NOT_GOING"];

const inviteSchema = new mongoose.Schema(
    {
        huddle_id: {
            type: mongoose.Schema.Types.ObjectId,
            refs: "huddle",
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            refs: "user",
            required: true,
        },
        status: {
            type: String,
            enum: INVITE_STATUS,
            required: true,
            default: INVITE_STATUS[0],
        },
    },
    { timestamps: true }
);

const Invite = mongoose.models.invite || mongoose.model("invite", inviteSchema);
export default Invite;
