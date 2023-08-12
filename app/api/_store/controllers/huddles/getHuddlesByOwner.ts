import { HuddleType } from "@/types";
import { connectMongoose } from "@/app/api/_store/connectMongoose";
import huddle from "@/app/api/_store/models/huddle";

export const getHuddlesByOwner: (
    userId: string
) => Promise<HuddleType[]> = async (userId) => {
    await connectMongoose();

    const owned = await huddle.where("author_id").equals(userId).exec();
    let huddles = await Promise.all([owned]).then((result) => {
        return [...result[0]];
    });
    return huddles;
};
