import { connectMongoose } from "@/app/api/_store/connectMongoose";
import User from "@/app/api/_store/models/user";
import { GetUserResponse } from "@/app/api/_store/controllerResponseTypes";
import Friendship from "../../models/friendships";
import { publicUserProjection } from "./getAllUsers";
import mongoose from "mongoose";

export enum UserSearchFilterGroups {
    ALL = "ALL",
    FRIENDS = "FRIENDS",
    REQUESTS = "REQUESTS",
    SUGGESTED = "SUGGESTED",
}
interface resultOptions {
    currentUserId?: string;
    page?: number;
    filters?: UserSearchFilterGroups[];
}

export const getUsersByStringSearch: (
    query: string,
    options?: resultOptions
) => Promise<GetUserResponse> = async (query, options) => {
    try {
        await connectMongoose();

        const page = options?.page || 1;
        const currentUserId = options?.currentUserId;

        let userDocs = currentUserId
            ? await _queryFriendshipsFirst({
                  currentUserId,
                  query,
                  page,
              })
            : await _queryAllUsers({ query, page });

        return userDocs
            ? {
                  message: "Successfully queried users.",
                  users: userDocs,
              }
            : {
                  message: "",
                  error: Error("UsersNotFoundError"),
                  errorStatus: 404,
              };
    } catch (error) {
        return {
            message: "Could not find users.",
            error: error as Error,
        };
    }
};

async function _queryFriendshipsFirst({
    currentUserId,
    query,
    page,
}: {
    currentUserId: string;
    query: string;
    page: number;
}) {
    let regex = new RegExp(
        `${decodeURIComponent(query)
            .trim()
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            .split(" ")
            .join("|")}`,
        "ig"
    );

    let id = new mongoose.Types.ObjectId(currentUserId);
    let limit = 10 * page;

    const friendSearch = await Friendship.aggregate([
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
                status: 1,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    publicUserProjection,
                    {
                        $match: {
                            $or: [
                                { username: { $regex: regex } },
                                { name: { $regex: regex } },
                            ],
                        },
                    },
                ],
            },
        },
        { $unwind: { path: "$user" } },
        {
            $replaceWith: {
                $mergeObjects: ["$user", { friendStatus: "$status" }],
            },
        },
        { $sort: { friendStatus: 1 } },
        { $limit: limit },
    ]);

    const strangerSearch = await User.aggregate([
        {
            $match: {
                $and: [
                    {
                        $or: [
                            { username: { $regex: regex } },
                            { name: { $regex: regex } },
                        ],
                    },
                    {
                        $nor: [
                            {
                                _id: {
                                    $in: friendSearch.map((user) => user._id),
                                },
                            },
                            { _id: id },
                        ],
                    },
                ],
            },
        },
        { $limit: limit },
    ]);
    return [...friendSearch, ...strangerSearch];
}

async function _queryAllUsers({
    query,
    page,
}: {
    query: string;
    page: number;
}) {
    let regex = new RegExp(
        `${decodeURIComponent(query)
            .trim()
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            .split(" ")
            .join("|")}`,
        "ig"
    );
    let userDocs = await User.find({
        $or: [{ username: { $regex: regex } }, { name: { $regex: regex } }],
    })
        .limit(10 * page)
        .exec();
    return userDocs;
}
