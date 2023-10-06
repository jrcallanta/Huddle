import { connectMongoose } from "@/app/api/_store/connectMongoose";
import User from "@/app/api/_store/models/user";
import { GetUserResponse } from "@/app/api/_store/controllerResponseTypes";

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
interface params {
    query: string;
    options?: resultOptions;
}

export const getUsersByStringSearch: (
    params: params
) => Promise<GetUserResponse> = async ({ query, options }) => {
    try {
        await connectMongoose();

        const page = options?.page || 1;

        // if (!currentUserId) {
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
        return userDocs
            ? {
                  message: "Successfully queried users.",
                  users: userDocs,
              }
            : {
                  message: "Could not find user.",
                  error: Error("UserNotFoundError"),
                  errorStatus: 404,
              };
        // } else {
        //     // Search username and sort results base on currentUserId
        // }
    } catch (error) {
        return {
            message: "Could not find user.",
            error: error as Error,
        };
    }
};
