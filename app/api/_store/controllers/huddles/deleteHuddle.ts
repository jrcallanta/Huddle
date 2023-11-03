import { connectMongoose } from "../../connectMongoose";
import { DeleteHuddleResponse } from "../../controllerResponseTypes";
import Huddle from "../../models/huddle";
import Invite from "../../models/invite";

interface Args {
    huddleId: string;
}

export const deleteHuddle: ({}: Args) => Promise<DeleteHuddleResponse> =
    async ({ huddleId }) => {
        try {
            await connectMongoose();

            const deletedInvites = await Invite.deleteMany({
                huddle_id: huddleId,
            });
            const deletedHuddle = await Huddle.findByIdAndRemove(huddleId);

            return deletedHuddle
                ? {
                      message: "Successfully deleted huddle.",
                      deletedHuddle: deletedHuddle,
                      deletedInvites: deletedInvites,
                  }
                : {
                      message: "Could not delete huddle. Try again.",
                      error: new Error("HuddleDeleteError"),
                  };
        } catch (error) {
            return {
                message: "Could not delete huddle.",
                error: error as Error,
            };
        }
    };
