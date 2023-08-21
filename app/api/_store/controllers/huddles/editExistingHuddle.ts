import { HuddleTypeForTile } from "@/types";
import { PatchHuddleResponse } from "../../controllerResponseTypes";
import { connectMongoose } from "../../connectMongoose";
import Huddle from "../../models/huddle";

interface Args {
    userId: string;
    huddleId: string;
    changes: HuddleTypeForTile;
}

export const editExistingHuddle: ({}: Args) => Promise<PatchHuddleResponse> =
    async ({ userId, huddleId, changes }) => {
        console.log(userId, huddleId);
        console.log(changes);

        try {
            await connectMongoose();

            const updatedHuddle = await Huddle.findByIdAndUpdate(
                huddleId,
                changes,
                {
                    new: true,
                    runValidators: true,
                    context: "query",
                }
            ).exec();

            return {
                message: "endpoint reached",
                updatedHuddle: updatedHuddle,
            };
        } catch (error) {
            return {
                message: "Could not update huddle",
                error: error as Error,
                errorStatus: 500,
            };
        }
    };
