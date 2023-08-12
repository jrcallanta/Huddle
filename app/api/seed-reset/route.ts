import mongoose from "mongoose";
import User from "@/app/api/_store/models/user";
import Invite, { INVITE_STATUS } from "@/app/api/_store/models/invite";
import Huddle from "@/app/api/_store/models/huddle";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

const HUDDLE_COUNT = 20;

const USER_TO_EMAIL_DICT: { [key: string]: string } = {
    _jelito: "jrscallanta@gmail.com",
    thejr: "thejayyyr@gmail.com",
};

const USER_NAMES = [
    "Himothy",
    "JENNIE",
    "jungkook",
    "Jimin",
    "CHAE1",
    "joji",
    "beatrice",
    "_jelito",
    "thejr",
    "loreiiii",
    "Hanni",
    "Hyein",
];
const EMAIL_DOMAINS = [
    "gmail.com",
    "email.com",
    "yahoo.com",
    "website.net",
    "example.org",
    "domain.dev",
];
const HUDDLE_NAMES: string[] = [
    "beach day",
    "movie night",
    "disney",
    "game seshh",
    "Valorant",
    "mile run?",
    "leg day",
    "foooood",
    "7Leaves Study Sesh",
    "exam prep",
];

export const _flipCoin = () => {
    return Math.floor(Math.random() * 10) % 2 == 0;
};

export const _chooseRandom = (arr: any[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

export const _generateTime = (
    start: Date,
    maxHours: number,
    minuteIncrement: number
) => {
    return new Date(
        new Date().setHours(
            start.getHours() + Math.floor(Math.random() * maxHours),
            Math.floor(1 + Math.random() * 3) * minuteIncrement
        )
    );
};

const _generateUsers = () => {
    return USER_NAMES.map((name) => ({
        name,
        username: name,
        email:
            USER_TO_EMAIL_DICT[name] ??
            `${name}@${_chooseRandom(EMAIL_DOMAINS)}`,
    }));
};

const _generateHuddle = () => {
    let author_ind = Math.floor(Math.random() * USER_NAMES.length);
    let start_time = _generateTime(new Date(), 5, 15);

    return {
        author_ind: author_ind,
        title: _chooseRandom(HUDDLE_NAMES),
        start_time: start_time,
        end_time: _flipCoin() ? _generateTime(start_time, 3, 15) : undefined,
        location: _flipCoin()
            ? `${Math.floor(
                  Math.random() *
                      Math.pow(10, Math.floor(Math.random() * 6) + 1)
              )} Street, Cityville`
            : undefined,
    };
};

const _generateHuddles = (amount: Number) => {
    return Array(amount)
        .fill(0)
        .map(() => _generateHuddle());
};

export async function GET(req: NextApiRequest) {
    let main = async function () {
        await mongoose.connect(process.env.DATABASE_URL ?? "");

        // DELETE EVERYTHING
        await Invite.deleteMany({});
        await Huddle.deleteMany({});
        await User.deleteMany({});

        // SEED RANDOM USERS
        console.log(`Seeding users...`);
        const savedUsers = await User.create(_generateUsers());
        console.log(`Saved ${savedUsers.length} users...`);

        // SEED RANDOM HUDDLES
        console.log(`Seeding huddles...`);
        const savedHuddles = await Huddle.create(
            _generateHuddles(HUDDLE_COUNT).map((huddle) => ({
                author_id: _chooseRandom(savedUsers)._id,
                title: huddle.title,
                start_time: huddle.start_time,
                location: huddle.location,
                end_time: huddle.end_time,
            }))
        );
        console.log(`Saved ${savedHuddles.length} users...`);

        // SEED RANDOM INVITES
        console.log(`Seeding invites...`);
        const savedInvites = await Promise.all(
            savedHuddles.map(async (huddle) => {
                const invites = await Promise.all(
                    savedUsers
                        .filter(
                            (user) =>
                                user._id !== huddle.author_id && _flipCoin()
                        )
                        .map((invitedUser) => ({
                            huddle_id: huddle._id,
                            user_id: invitedUser._id,
                            status: _chooseRandom(INVITE_STATUS),
                        }))
                );

                let invite_list = await Invite.create(invites);
                console.log(`\tSaved ${invite_list.length} invites...`);
                return {
                    huddle_id: huddle._id,
                    invite_list: invite_list,
                };
            })
        );

        savedInvites.forEach((invite, i) => {
            console.log(`Huddle ${i}: ${invite.huddle_id.toString()} [`);
            invite.invite_list.forEach((invitedUser) =>
                console.log(
                    `\t${
                        savedUsers.find(
                            (user) => user._id === invitedUser.user_id
                        ).email
                    }`
                )
            );
            console.log("]");
        });
    };

    try {
        await main();
        return NextResponse.json({
            message: "Succesfully reset",
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Could not reset", data: error },
            { status: 500 }
        );
    } finally {
        await mongoose.disconnect();
    }
}

/*  MONGOSH COMMANDS FOR HUDDLE INVITE VISUALIZATION

db.createView("invite_list", "huddles", [
    {
        $lookup: {
            from: "users",
            localField: "author_id",
            foreignField: "_id",
            as: "host",
        },
    },
    {
        $lookup: {
            from: "invites",
            localField: "_id",
            foreignField: "huddle_id",
            as: "invitedDocs",
        },
    },
    {
        $project: {
            _id: 1,
            host: "$host.username",
            title: 1,
            invited: "$invitedDocs.user_id",
        },
    },
    { $unwind: { path: "$host" } },
    {
        $lookup: {
            from: "users",
            localField: "invited",
            foreignField: "_id",
            as: "invitedUser",
        },
    },
    {
        $project: {
            _id: 1,
            host: 1,
            title: 1,
            invitedUser: { name: 1, email: 1 },
        },
    },
]);

*/
