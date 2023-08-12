import { connectMongoose } from "@/app/api/_store/connectMongoose";
import { PatchUserResponse } from "@/app/api/_store/controllerResponseTypes";
import User from "@/app/api/_store/models/user";

export const editExistingUser: (
    userId: string,
    changes: { [key: string]: any }
) => Promise<PatchUserResponse> = async (userId, changes) => {
    if (!Object.keys(changes).length)
        return {
            message: "Could not update user.",
            error: Error("InvalidInputError"),
            errorStatus: 403,
        };

    try {
        await connectMongoose();
        console.log(changes);

        const updatedUser = await User.findByIdAndUpdate(userId, changes, {
            new: true,
            runValidators: true,
            context: "query",
        }).exec();

        return {
            message: "Successfully updated user.",
            updatedUser: updatedUser,
        };
    } catch (error) {
        return {
            message: "Could not update user.",
            error: error as Error,
            errorStatus: 500,
        };
    }
};
