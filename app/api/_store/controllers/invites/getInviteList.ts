import { connectMongoose } from "@/app/api/_store/connectMongoose";
import Invite from "@/app/api/_store/models/invite";
import User from "@/app/api/_store/models/user";
import { UserType } from "@/types";

export const getInviteList: (huddleId: string) => Promise<UserType[]> = async (
    huddleId
) => {
    await connectMongoose();

    let invites = await Invite.where("huddle_id").equals(huddleId).exec();
    let users = invites
        .map((invite) => invite.user_id)
        .map(async (userId) => {
            let user = await User.findById(userId, {
                _id: 1,
                username: 1,
            }).exec();
            return user;
        });

    const inviteList = await Promise.all(users);
    return inviteList;
};
