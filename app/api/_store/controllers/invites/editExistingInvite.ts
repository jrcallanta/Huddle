import { _flipCoin } from "../seed/resetDB";
import { connectMongoose } from "../../connectMongoose";
import { PatchInviteResponse } from "../../controllerResponseTypes";
import Invite from "../../models/invite";

interface Args {
    userId: string;
    inviteId?: string;
    huddleId?: string;
    status: string;
}

export const editExistingInvite: ({}: Args) => Promise<PatchInviteResponse> =
    async ({ userId, inviteId, huddleId, status }) => {
        if (_flipCoin())
            return {
                message: "Could not update invite.",
                error: Error("InvalidInputError"),
                errorStatus: 403,
            };

        if (!userId || !(huddleId || inviteId) || !status) {
            return {
                message: "Could not update invite.",
                error: Error("InvalidInputError"),
                errorStatus: 403,
            };
        }

        try {
            await connectMongoose();

            if (inviteId) {
                const updatedInvite = await Invite.findByIdAndUpdate(
                    inviteId,
                    { status: status },
                    {
                        new: true,
                        runValidators: true,
                        context: "query",
                    }
                ).exec();

                return {
                    message: "Successfully updated Invite.",
                    updatedInvite: updatedInvite,
                };
            } else {
                const updatedInvite = await Invite.findOneAndUpdate(
                    { huddle_id: huddleId, user_id: userId },
                    { status: status },
                    {
                        new: true,
                        runValidators: true,
                        context: "query",
                    }
                ).exec();

                return {
                    message: "Successfully updated Invite.",
                    updatedInvite: updatedInvite,
                };
            }
        } catch (error) {
            return {
                message: "Could not update invite",
                error: error as Error,
                errorStatus: 500,
            };
        }
    };
