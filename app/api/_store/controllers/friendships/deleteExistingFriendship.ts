import mongoose from "mongoose";
import { connectMongoose } from "../../connectMongoose";
import Friendship from "../../models/friendship";
import { DeleteFriendshipResponse } from "../../controllerResponseTypes";

interface Args {
    friendshipId?: string;
    userId?: string;
    otherUserId?: string;
}

export const deleteExistingFriendship: ({}: Args) => Promise<DeleteFriendshipResponse> =
    async ({ friendshipId, userId, otherUserId }) => {
        try {
            await connectMongoose();

            let deletedFriendship;
            deletedFriendship = friendshipId
                ? await Friendship.findByIdAndDelete(friendshipId, {
                      rawResult: true,
                  })
                : await Friendship.findOneAndDelete({
                      $or: [
                          {
                              fromUser: new mongoose.Types.ObjectId(userId),
                              toUser: new mongoose.Types.ObjectId(otherUserId),
                          },
                          {
                              toUser: new mongoose.Types.ObjectId(userId),
                              fromUser: new mongoose.Types.ObjectId(
                                  otherUserId
                              ),
                          },
                      ],
                  });

            return deletedFriendship
                ? {
                      message: "Successfully deleted friendship",
                      deletedFriendship,
                  }
                : {
                      message: "Could not find friendship",
                      errorStatus: 404,
                  };
        } catch (error) {
            return {
                message: "Could not delete friendship",
                error: error as Error,
            };
        }
    };
