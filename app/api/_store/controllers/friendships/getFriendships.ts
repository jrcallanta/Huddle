import mongoose from "mongoose";
import { GetFriendshipsResponse } from "../../controllerResponseTypes";
import Friendship from "../../models/friendship";
import { connectMongoose } from "../../connectMongoose";
import { publicUserProjection } from "../users/getAllUsers";
import { FRIENDSHIP_STATUS } from "@/types";

interface params {
    userId: string;
}

export const getFriendships: (
    params: params
) => Promise<GetFriendshipsResponse> = async ({ userId }) => {
    try {
        await connectMongoose();

        let id = new mongoose.Types.ObjectId(userId);

        // const friendships = await Friendship.aggregate([
        //     { $match: { $or: [{ fromUser: id }, { toUser: id }] } },
        //     { $match: { status: FRIENDSHIP_STATUS.friends } },
        //     {
        //         $project: {
        //             user: {
        //                 $cond: {
        //                     if: { $eq: ["$fromUser", id] },
        //                     then: "$toUser",
        //                     else: "$fromUser",
        //                 },
        //             },
        //             friendshipId: "$_id",
        //         },
        //     },
        //     {
        //         $lookup: {
        //             from: "users",
        //             localField: "user",
        //             foreignField: "_id",
        //             as: "user_doc",
        //             pipeline: [publicUserProjection],
        //         },
        //     },
        //     { $unwind: { path: "$user_doc" } },
        //     {
        //         $replaceWith: {
        //             $mergeObjects: ["$user_doc"],
        //         },
        //     },
        //     { $addFields: { lowerName: { $toLower: "$name" } } },
        //     { $sort: { lowerName: 1 } },
        //     { $project: { lowerName: 0 } },
        // ]).exec();

        const friendships = await Friendship.aggregate([
            { $match: { $or: [{ fromUser: id }, { toUser: id }] } },
            {
                $project: {
                    user: {
                        $cond: {
                            if: { $eq: ["$fromUser", id] },
                            then: "$toUser",
                            else: "$fromUser",
                        },
                    },
                    friendshipId: "$_id",
                    status: 1,
                    requester: {
                        $cond: {
                            if: {
                                $or: [
                                    {
                                        $eq: [
                                            "$status",
                                            FRIENDSHIP_STATUS.friends,
                                        ],
                                    },
                                    { $eq: ["$fromUser", id] },
                                ],
                            },
                            then: undefined,
                            else: true,
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user_doc",
                    pipeline: [publicUserProjection],
                },
            },
            { $unwind: { path: "$user_doc" } },
            {
                $replaceWith: {
                    $mergeObjects: [
                        "$user_doc",
                        {
                            friendStatus: "$status",
                            friendshipId: "$friendshipId",
                            friendRequester: "$requester",
                        },
                    ],
                },
            },
            { $sort: { friendStatus: 1, friendRequester: -1 } },
        ]);

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
