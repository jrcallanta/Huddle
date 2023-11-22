import mongoose from "mongoose";

const huddleSchema = new mongoose.Schema(
    {
        author_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        title: { type: String, required: true },
        description: { type: String },
        location: {
            type: {
                _id: false,
                display: {
                    type: {
                        _id: false,
                        primary: { type: String, required: true },
                        secondary: { type: String },
                        description: { type: String },
                    },
                    required: true,
                },
                coordinates: {
                    type: {
                        _id: false,
                        lat: { type: Number, required: true },
                        lng: { type: Number, required: true },
                    },
                    required: true,
                },
            },
        },
        start_time: { type: mongoose.Schema.Types.Date, required: true },
        end_time: { type: mongoose.Schema.Types.Date },
    },
    { timestamps: true }
);

const Huddle = mongoose.models.huddle || mongoose.model("huddle", huddleSchema);
export default Huddle;
