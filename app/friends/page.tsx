"use client";

import UserTileList, { INTERACTION_TYPE } from "@/components/UserTileList";
import { useUser } from "@/hooks/useUser";
import { FRIENDSHIP_STATUS, UserTypeForTile } from "@/types";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

enum FETCH_STATUS {
    idle = "IDLE",
    loading = "LOADING",
    error = "ERROR",
}

export default function Friends() {
    const { status } = useSession();
    const { currentUser } = useUser();
    const [fetchStatus, setFetchStatus] = useState(FETCH_STATUS.idle);
    const [friendsList, setFriendsList] = useState<[] | null>(null);

    useEffect(() => {
        const fetchQuery = async () => {
            setFetchStatus(FETCH_STATUS.loading);
            const data = await fetch(`/api/friendships/${currentUser?._id}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setFriendsList(
                        data.friendships?.length ? data.friendships : null
                    );
                    setFetchStatus(FETCH_STATUS.idle);
                });

            return data;
        };

        fetchQuery();
    }, [currentUser]);

    return (
        <main
            className={twMerge(
                "themed h-screen w-full overflow-hidden overflow-y-auto p-4 pr-6 bg-white flex flex-col gap-4 mr-auto relative",
                "[&_>_*:not(.loader)]:animate-fade-in"
            )}
        >
            {status === "loading" ||
                (fetchStatus === "LOADING" && (
                    <div className='loader m-auto w-8 h-8 rounded-full border-2 border-x-black border-y-white border-black animate-spin'></div>
                ))}

            {friendsList &&
                fetchStatus !== "LOADING" &&
                (() => {
                    let [friends, requests, others] = friendsList.reduce(
                        (
                            accum: UserTypeForTile[][],
                            current: UserTypeForTile
                        ) => {
                            switch (current.friendStatus) {
                                case FRIENDSHIP_STATUS.friends: {
                                    accum[0].push(current);
                                    break;
                                }
                                case FRIENDSHIP_STATUS.pending: {
                                    accum[1].push(current);
                                    break;
                                }
                                default: {
                                    accum[2].push(current);
                                }
                            }
                            return accum;
                        },
                        [[], [], []]
                    );
                    return (
                        <>
                            <UserTileList
                                users={requests}
                                interactionType={INTERACTION_TYPE.friendship}
                                label={"FRIEND REQUESTS"}
                            />
                            <UserTileList
                                users={friends}
                                interactionType={INTERACTION_TYPE.friendship}
                                label={"FRIENDS"}
                            />
                        </>
                    );
                })()}
        </main>
    );
}
