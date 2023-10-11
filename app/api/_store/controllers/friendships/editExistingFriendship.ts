import { FRIENDSHIP_STATUS } from "@/types";
import { PatchFriendshipResponse } from "../../controllerResponseTypes";
import { connectMongoose } from "../../connectMongoose";
import Friendship from "../../models/friendship";
import mongoose from "mongoose";

interface Args {
    userId: string;
    otherUserId: string;
    changes: FRIENDSHIP_STATUS;
}

export const editExistingFriendship: ({}: Args) => Promise<PatchFriendshipResponse> =
    async ({ userId, otherUserId, changes }) => {
        try {
            await connectMongoose();
            console.log(userId, otherUserId, changes);

            const updatedFriendship = await Friendship.findOneAndUpdate(
                {
                    $or: [
                        {
                            fromUser: new mongoose.Types.ObjectId(userId),
                            toUser: new mongoose.Types.ObjectId(otherUserId),
                        },
                        {
                            toUser: new mongoose.Types.ObjectId(userId),
                            fromUser: new mongoose.Types.ObjectId(otherUserId),
                        },
                    ],
                },
                { status: FRIENDSHIP_STATUS.friends },
                { new: true }
            );

            return updatedFriendship
                ? {
                      message: "Successfully updated friendship.",
                      updatedFriendship: updatedFriendship,
                  }
                : {
                      message: "Could not update frienship.",
                      errorStatus: 404,
                  };
        } catch (error) {
            return {
                message: "Could not update friendship",
                error: error as Error,
            };
        }
    };
