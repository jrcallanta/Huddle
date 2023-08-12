import { HuddleType, HuddleTypeForTile } from "@/types";
import { HuddleSection } from "@/components/HuddleFeed";

const getTimeDifference = (a: Date, b: Date): number => {
    return new Date(a).getTime() - new Date(b).getTime();
};

const hoursInMS = (hours: number): number => {
    return hours * 60 * 60 * 1000;
};

const sortByStartTime = (a: HuddleType, b: HuddleType): number => {
    let aStart = new Date(a.start_time);
    let bStart = new Date(b.start_time);

    if (aStart < bStart) return -1;

    if (aStart > bStart) return 1;

    let aEnd = a.end_time ? new Date(a.end_time) : null;
    let bEnd = b.end_time ? new Date(b.end_time) : null;

    if (aEnd && bEnd) {
        if (aEnd < bEnd) return -1;
        if (aEnd > bEnd) return 1;
    }

    if (aEnd || bEnd) {
        return aEnd ? -1 : 1;
    }

    return new Date(a.created_at) < new Date(b.created_at) ? -1 : 1;
};

export const huddleSorter = (
    arr: HuddleTypeForTile[],
    sortBy: string
): HuddleSection[] => {
    arr = arr.sort(sortByStartTime);

    switch (sortBy) {
        case "timeline": {
            let now = new Date();
            return [
                {
                    title: "now",
                    emptyNote: "You do not have any huddles happening now.",
                    huddles: arr.filter(
                        (huddle) =>
                            huddle.invite_status !== "NOT_GOING" &&
                            new Date(huddle.start_time).getTime() <
                                now.getTime()
                    ),
                },
                {
                    title: "soon",
                    huddles: arr.filter(
                        (huddle) =>
                            huddle.invite_status !== "NOT_GOING" &&
                            hoursInMS(0) <=
                                getTimeDifference(huddle.start_time, now) &&
                            getTimeDifference(huddle.start_time, now) <
                                hoursInMS(3)
                    ),
                },
                {
                    title: "later",
                    huddles: arr.filter(
                        (huddle) =>
                            huddle.invite_status !== "NOT_GOING" &&
                            hoursInMS(3) <=
                                getTimeDifference(huddle.start_time, now) &&
                            getTimeDifference(huddle.start_time, now) <
                                hoursInMS(6)
                    ),
                },
                {
                    title: "much later",
                    huddles: arr.filter(
                        (huddle) =>
                            huddle.invite_status !== "NOT_GOING" &&
                            getTimeDifference(huddle.start_time, now) >=
                                hoursInMS(6)
                    ),
                },
            ];
        }

        default: {
            return [
                {
                    title: "invites",
                    emptyNote: "You do not have any invites yet.",
                    huddles: arr.filter(
                        (huddle) => huddle.invite_status === "PENDING"
                    ),
                },
                {
                    title: "declined",
                    huddles: arr.filter(
                        (huddle) => huddle.invite_status === "NOT_GOING"
                    ),
                },
                {
                    title: "my huddles",
                    emptyNote: "You do not have any huddles yet.",
                    huddles: arr.filter(
                        (huddle) => huddle.invite_status === undefined
                    ),
                },
                {
                    title: "friend huddles",
                    huddles: arr.filter(
                        (huddle) => huddle.invite_status === "GOING"
                    ),
                },
            ];
        }
    }
};
