import { connectMongoose } from "@/app/api/_store/connectMongoose";
import { GetUserResponse } from "@/app/api/_store/controllerResponseTypes";
import User from "@/app/api/_store/models/user";
import mongoose from "mongoose";

export const publicUserProjection: mongoose.PipelineStage.Project = {
    $project: {
        email: 0,
        createdAt: 0,
        updatedAt: 0,
    },
};

export const getAllUsers: () => Promise<GetUserResponse> = async () => {
    try {
        await connectMongoose();

        const allUsers = await User.aggregate([
            { $match: {} },
            { ...publicUserProjection },
        ]).exec();

        return {
            message: "Successfully retrieved all users.",
            users: allUsers,
        };
    } catch (error) {
        return {
            message: "Could not retrieve all users.",
            error: error as Error,
        };
    }
};
