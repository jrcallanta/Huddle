import { FRIENDSHIP_STATUS } from "@/types";
import { PostFriendshipResponse } from "../../controllerResponseTypes";
import { connectMongoose } from "../../connectMongoose";
import Friendship from "../../models/friendship";

interface Args {
    userId: string;
    otherUserId: string;
}

export const createNewFriendship: ({}: Args) => Promise<PostFriendshipResponse> =
    async ({ userId, otherUserId }) => {
        try {
            await connectMongoose();
            console.log(userId, otherUserId);

            const newFriendship = await Friendship.create({
                fromUser: userId,
                toUser: otherUserId,
                status: FRIENDSHIP_STATUS.pending,
            });

            return newFriendship
                ? {
                      message:
                          "Successfully created friendship with pending status.",
                      newFriendship,
                  }
                : {
                      message: "Could not create friendship. Try again.",
                  };
        } catch (error) {
            return {
                message: "Could not create friendship",
                error: error as Error,
            };
        }
    };
