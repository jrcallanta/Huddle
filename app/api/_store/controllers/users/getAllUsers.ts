import { connectMongoose } from "@/app/api/_store/connectMongoose";
import { GetUserResponse } from "@/app/api/_store/controllerResponseTypes";
import User from "@/app/api/_store/models/user";

export const getAllUsers: () => Promise<GetUserResponse> = async () => {
    try {
        await connectMongoose();

        const allUsers = await User.find({});
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
