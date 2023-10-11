import { HuddleTypeForTile } from "@/types";
import { connectMongoose } from "@/app/api/_store/connectMongoose";
import Huddle from "@/app/api/_store/models/huddle";
import Invite from "@/app/api/_store/models/invite";
import mongoose from "mongoose";
import { publicUserProjection } from "../users/getAllUsers";

export const getHuddlesByRelevance: (
    userId: string
) => Promise<HuddleTypeForTile[]> = async (userId) => {
    await connectMongoose();

    const inviteListSorterPipeline: (userId: string) => any[] = (userId) => [
        {
            $addFields: {
                sorterIndex: {
                    $switch: {
                        branches: [
                            // {
                            //     case: {
                            //         $eq: [
                            //             "$user_id",
                            //             new mongoose.Types.ObjectId(userId),
                            //         ],
                            //     },
                            //     then: 0,
                            // },
                            {
                                case: { $eq: ["$status", "GOING"] },
                                then: 1,
                            },
                            {
                                case: {
                                    $eq: ["$status", "PENDING"],
                                },
                                then: 2,
                            },
                            {
                                case: {
                                    $eq: ["$status", "NOT_GOING"],
                                },
                                then: 3,
                            },
                        ],
                    },
                },
            },
        },
        {
            $sort: {
                sorterIndex: 1,
            },
        },
    ];

    const owned = await Huddle.aggregate([
        { $match: { author_id: new mongoose.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: "users",
                localField: "author_id",
                foreignField: "_id",
                as: "author",
                pipeline: [publicUserProjection],
            },
        },
        { $unwind: { path: "$author" } },
        {
            $lookup: {
                from: "invites",
                localField: "_id",
                foreignField: "huddle_id",
                as: "invite_list",
                pipeline: [
                    ...inviteListSorterPipeline(userId),
                    {
                        $lookup: {
                            from: "users",
                            localField: "user_id",
                            foreignField: "_id",
                            as: "user",
                            pipeline: [publicUserProjection],
                        },
                    },
                    {
                        $project: {
                            huddle_id: 0,
                            user_id: 0,
                        },
                    },
                    { $unwind: { path: "$user" } },
                ],
            },
        },
    ]).exec();

    const invited = await Invite.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: "huddles",
                localField: "huddle_id",
                foreignField: "_id",
                as: "huddle",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "author_id",
                            foreignField: "_id",
                            as: "author",
                            pipeline: [publicUserProjection],
                        },
                    },
                    { $unwind: { path: "$author" } },
                ],
            },
        },
        { $unwind: { path: "$huddle" } },
        {
            $replaceWith: {
                $mergeObjects: [{ invite_status: "$status" }, "$huddle"],
            },
        },
        {
            $lookup: {
                from: "invites",
                localField: "_id",
                foreignField: "huddle_id",
                as: "invite_list",
                pipeline: [
                    ...inviteListSorterPipeline(userId),
                    {
                        $lookup: {
                            from: "users",
                            localField: "user_id",
                            foreignField: "_id",
                            as: "user",
                            pipeline: [publicUserProjection],
                        },
                    },
                    {
                        $project: {
                            huddle_id: 0,
                            user_id: 0,
                        },
                    },
                    { $unwind: { path: "$user" } },
                ],
            },
        },
    ]).exec();

    return [...owned, ...invited];
};
