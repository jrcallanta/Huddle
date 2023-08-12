import mongoose from "mongoose";

const huddleSchema = new mongoose.Schema(
    {
        author_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        title: { type: String, required: true },
        description: { type: String },
        location: { type: String },
        start_time: { type: mongoose.Schema.Types.Date, required: true },
        end_time: { type: mongoose.Schema.Types.Date },
    },
    { timestamps: true }
);

const Huddle = mongoose.models.huddle || mongoose.model("huddle", huddleSchema);
export default Huddle;
