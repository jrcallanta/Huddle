import { FRIENDSHIP_STATUS } from "@/types";
import { PatchFriendshipResponse } from "../../controllerResponseTypes";
import { connectMongoose } from "../../connectMongoose";

interface Args {
    userId: string;
    changes: FRIENDSHIP_STATUS | "REMOVE";
}


export const editExistingFriendships: ({}: Args) => Promise<PatchFriendshipResponse> = async ({
    userId,
    changes,
}) => {
    try {
        await connectMongoose();
        console.log(userId, changes)
        
        return {
            message: ""
        }
    } catch (error) {
        return {
            message: "Could not update friendship",
            error: error as Error;
        }
    }
}