import mongoose from "mongoose";
import { GetFriendshipsResponse } from "../../controllerResponseTypes";
import Friendship from "../../models/friendship";
import { connectMongoose } from "../../connectMongoose";
import { publicUserProjection } from "../users/getAllUsers";

interface params {
    userId: string;
}

export const getFriendships: (
    params: params
) => Promise<GetFriendshipsResponse> = async ({ userId }) => {
    try {
        await connectMongoose();

        let id = new mongoose.Types.ObjectId(userId);

        const friendships = await Friendship.aggregate([
            { $match: { $or: [{ fromUser: id }, { toUser: id }] } },
            {
                $lookup: {
                    from: "users",
                    localField: "fromUser",
                    foreignField: "_id",
                    as: "fromUser",
                    pipeline: [publicUserProjection],
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "toUser",
                    foreignField: "_id",
                    as: "toUser",
                    pipeline: [publicUserProjection],
                },
            },
            { $unwind: { path: "$fromUser" } },
            { $unwind: { path: "$toUser" } },
            { $project: { fromUser: 1, toUser: 1, status: 1, _id: 0 } },
        ]).exec();

        return {
            message: `Successfully retrieved friendships for ${id}`,
            friendships: friendships,
        };
    } catch (error) {
        return {
            message: "Could not retrieve friendships.",
            error: error as Error,
        };
    }
};
