import { HuddleType } from "@/types";
import { connectMongoose } from "@/app/api/_store/connectMongoose";
import huddle from "@/app/api/_store/models/huddle";
import invite from "@/app/api/_store/models/invite";

export const getHuddlesByInvited: (
    userId: string
) => Promise<HuddleType[]> = async (userId) => {
    await connectMongoose();

    const invited = await invite
        .find({ user_id: userId })
        .exec()
        .then(async (invites) => {
            let huddles = invites.map((invite) => invite.huddle_id);
            return await huddle.where("_id").in(huddles);
        });
    let huddles = await Promise.all([invited]).then((result) => {
        return [...result[0]];
    });

    return huddles;
};
