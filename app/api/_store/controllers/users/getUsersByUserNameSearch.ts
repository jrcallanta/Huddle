import { connectMongoose } from "@/app/api/_store/connectMongoose";
import User from "@/app/api/_store/models/user";
import { GetUserResponse } from "@/app/api/_store/controllerResponseTypes";

export const getUsersByUserNameSearch: (
    username: string,
    currentUserId?: string
) => Promise<GetUserResponse> = async (username, currentUserId) => {
    try {
        await connectMongoose();

        console.log(username, currentUserId);

        // if (!currentUserId) {
        let userDocs = await User.find({ username: username }).exec();
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
