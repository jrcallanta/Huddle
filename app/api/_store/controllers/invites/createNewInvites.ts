import { InviteType } from "@/types";
import { PostNewInviteResponse } from "../../controllerResponseTypes";
import { connectMongoose } from "../../connectMongoose";
import Invite, { INVITE_STATUS } from "../../models/invite";

interface Args {
    huddleId: string;
    userId?: string;
    userIds?: string[];
}

export const createNewInvite: ({}: Args) => Promise<PostNewInviteResponse> =
    async ({ huddleId, userId, userIds }) => {
        try {
            await connectMongoose();

            if (userId) {
                const newInvite = await Invite.create({
                    huddle_id: huddleId,
                    user_id: userId,
                    status: INVITE_STATUS[0],
                });

                return newInvite
                    ? {
                          message: "Successfully created new invite.",
                          newInvite: newInvite,
                      }
                    : {
                          message: "Could not create new invite. Try again.",
                          errorStatus: 400,
                      };
            } else if (userIds) {
                const invites = await Promise.all(
                    userIds.map((id) => ({
                        huddle_id: huddleId,
                        user_id: id,
                        status: INVITE_STATUS[0],
                    }))
                );

                const newInvites = await Invite.create(invites);

                return newInvites
                    ? {
                          message: "Successfully created new invite.",
                          newInvite: newInvites,
                      }
                    : {
                          message: "Could not create new invite. Try again.",
                          errorStatus: 400,
                      };
            } else
                return {
                    message: "No user id provided",
                    errorStatus: 400,
                };
        } catch (error) {
            return {
                message: "Could not create invite(s). Try again",
                error: error as Error,
            };
        }
    };
