import { HuddleType } from "@/types";
import { connectMongoose } from "../../connectMongoose";
import { PostHuddleResponse } from "../../controllerResponseTypes";
import Huddle from "../../models/huddle";
import User from "../../models/user";

interface Args {
    huddle: HuddleType;
}

export const createNewHuddle: ({}: Args) => Promise<PostHuddleResponse> =
    async ({ huddle }) => {
        if (!huddle)
            return {
                message: "Invalid input. Try again",
                errorStatus: 400,
            };

        try {
            await connectMongoose();

            let foundUser = await User.findById(huddle.author._id);
            if (!foundUser)
                return {
                    message: "User not found. Try again",
                    errorStatus: 400,
                };

            let newHuddle = await Huddle.create(huddle);
            return newHuddle
                ? {
                      message: "Successfully created huddle",
                      newHuddle: newHuddle,
                  }
                : {
                      message: "Could not create huddle. Try again.",
                      error: "HuddleSaveError",
                  };
        } catch (error) {
            return {
                message: "Could not create huddle. Try again.",
                error: error as Error,
            };
        }
    };
