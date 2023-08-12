import { connectMongoose } from "@/app/api/_store/connectMongoose";
import User from "@/app/api/_store/models/user";
import { GetUserResponse } from "@/app/api/_store/controllerResponseTypes";

export const getUserById: (email: string) => Promise<GetUserResponse> = async (
    id
) => {
    try {
        await connectMongoose();

        let userDoc = await User.findById(id).exec();
        return userDoc
            ? {
                  message: "Successfully retrieved user.",
                  user: {
                      _id: userDoc._id.toString(),
                      email: userDoc.email,
                      name: userDoc.name ?? "",
                      username: userDoc.username ?? "",
                  },
              }
            : {
                  message: "Could not find user.",
                  error: Error("UserNotFoundError"),
                  errorStatus: 404,
              };
    } catch (error) {
        return {
            message: "Could not find user.",
            error: error as Error,
        };
    }
};
