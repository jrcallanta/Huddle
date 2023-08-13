import mongoose from "mongoose";
import User from "@/app/api/_store/models/user";
import Invite, { INVITE_STATUS } from "@/app/api/_store/models/invite";
import Huddle from "@/app/api/_store/models/huddle";
import { Coords } from "google-map-react";
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

const HUDDLE_LOCATIONS: [Number, Number, String][] = [
    [33.77214650876379, -118.20248388295758, "Long Beach"],
    [33.82701765276833, -118.1893717253211, "Steelcraft @ Long Beach"],
    [33.77467363025807, -118.18028338105408, "MOLAA"],
    [33.76232700027981, -118.19709714751423, "Aquarium of the Pacific"],
    [33.76746930177294, -118.18456409453917, "The Breakfast Bar"],
    [33.83586122861145, -118.33729352873509, "Torrance"],
    [33.82352565655463, -118.33632473896469, "Kings Hawaiian"],
    [33.83306805915092, -118.35025409204677, "Mitsuwa @ Torrence"],
    [33.818480019017024, -118.34975056749369, "Raising Cane's"],
    [33.8224017797407, -118.32602197276154, "CoCo Ichibanya"],
    [33.683762591408474, -117.82129319136999, "Irvine"],
    [33.744678645649486, -117.86535891569346, "Santa Ana"],
    [33.83509964749566, -117.91202147447613, "Anaheim"],
    [34.07404761448137, -118.3975614342641, "Beverly Hills"],
    [34.088501435141474, -118.36709582927672, "West Hollywood"],
    [34.07698757475187, -118.47121130299499, "The Getty"],
    [34.006645576605116, -118.43453426398108, "Mitsuwa @ Culver"],
    [33.98024597253167, -118.45019519648329, "Marina Del Rey"],
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

export const _randomCoordinateInCA = () => {
    let [lat, lng, display] = _chooseRandom(HUDDLE_LOCATIONS);
    return {
        display,
        coordinates: { lat, lng },
    };
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
        location: _flipCoin() ? _randomCoordinateInCA() : undefined,
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
        console.log(`Saved ${savedHuddles.length} huddles...`);

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
