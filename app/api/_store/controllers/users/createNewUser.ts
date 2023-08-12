import { connectMongoose } from "@/app/api/_store/connectMongoose";
import { PostNewUserResponse } from "@/app/api/_store/controllerResponseTypes";
import User from "@/app/api/_store/models/user";
import { UserType } from "@/types";

export const createNewUser: (
    userData: UserType
) => Promise<PostNewUserResponse> = async (userData) => {
    try {
        await connectMongoose();

        const newUser = await User.create(userData);
        return {
            message: "Successfully created user.",
            newUser: newUser as UserType,
        };
    } catch (error) {
        return {
            message: "Could not create user.",
            error: error as Error,
        };
    }
};
