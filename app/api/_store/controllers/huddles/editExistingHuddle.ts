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
        try {
            await connectMongoose();

            const foundHuddle = await Huddle.findById(huddleId);
            if (String(foundHuddle.author_id) !== userId)
                return {
                    message: "User not authorized",
                    errorStatus: 401,
                };

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
