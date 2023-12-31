import { connectMongoose } from "@/app/api/_store/connectMongoose";
import User from "@/app/api/_store/models/user";
import { GetUserResponse } from "@/app/api/_store/controllerResponseTypes";

export const getUserByUserName: (
    username: string
) => Promise<GetUserResponse> = async (username) => {
    try {
        await connectMongoose();

        let userDoc = (await User.find({ username: username }).exec())[0];
        return userDoc
            ? {
                  message: "Successfully retrieved user.",
                  user: {
                      _id: userDoc._id.toString(),
                      name: userDoc.name ?? "",
                      username: userDoc.username ?? "",
                      imgUrl: userDoc.imgUrl ?? "",
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
