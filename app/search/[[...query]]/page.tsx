"use client";

import { INTERACTION_TYPE } from "@/components/UserTile";
import UserTileList from "@/components/UserTileList";
import { UserTypeForTile } from "@/types";
import { useUser } from "@/hooks/useUser";
import { FRIENDSHIP_STATUS } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useSession } from "next-auth/react";

enum FETCH_STATUS {
    idle = "IDLE",
    loading = "LOADING",
    error = "ERROR",
}

const SearchPage = ({ params: { query } }: { params: { query: string } }) => {
    const { status } = useSession();
    const { currentUser } = useUser();
    const [fetchStatus, setFetchStatus] = useState(FETCH_STATUS.idle);
    const [searchResults, setSearchResults] = useState<[] | null>(null);

    const fetchQuery = useCallback(async () => {
        setFetchStatus(FETCH_STATUS.loading);
        const data = await fetch(`/api/user/search/${query}`, {
            method: "POST",
            body: JSON.stringify({
                currentUserId: currentUser?._id,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setSearchResults(data.users?.length ? data.users : null);
                setFetchStatus(FETCH_STATUS.idle);
            });

        return data;
    }, [query, currentUser]);

    useEffect(() => {
        fetchQuery();
    }, [fetchQuery]);

    return (
        <main
            className={twMerge(
                "themed h-screen w-full overflow-hidden overflow-y-auto p-4 pr-6 bg-white flex flex-col gap-4 mr-auto relative",
                "[&_>_*:not(.loader)]:animate-fade-in"
            )}
        >
            {status === "loading" ||
                (query && fetchStatus === "LOADING" && (
                    <div className='loader m-auto w-8 h-8 rounded-full border-2 border-x-black border-y-white border-black animate-spin'></div>
                ))}

            {status !== "loading" && (
                <>
                    {!query && (
                        <div className=''>
                            <p className='text text-2xl text-black font-semibold'>
                                {"What are you looking for?"}
                            </p>
                        </div>
                    )}

                    {query && searchResults && (
                        <div className=''>
                            <div className='text text-lg text-black font-medium'>
                                <span>Showing results for</span>
                                <span className='text-[var(--500)] font-semibold'>
                                    {` '${decodeURIComponent(query)}' `}
                                </span>
                            </div>
                        </div>
                    )}

                    {query && fetchStatus !== "LOADING" && !searchResults && (
                        <div className='text text-lg text-black font-medium'>
                            <span>Sorry, we couldn't find anything for</span>
                            <span className='text-[var(--500)] font-semibold'>
                                {` '${decodeURIComponent(query)}'.`}
                            </span>
                        </div>
                    )}

                    {searchResults &&
                        fetchStatus !== "LOADING" &&
                        (() => {
                            let [friends, requests, others] =
                                searchResults.reduce(
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
                                        users={friends}
                                        interactions={
                                            INTERACTION_TYPE.friendship
                                        }
                                        label={"FRIENDS"}
                                    />
                                    <UserTileList
                                        users={requests}
                                        interactions={
                                            INTERACTION_TYPE.friendship
                                        }
                                        label={"FRIEND REQUESTS"}
                                    />
                                    <UserTileList
                                        users={others}
                                        interactions={
                                            INTERACTION_TYPE.friendship
                                        }
                                        label={
                                            friends.length || requests.length
                                                ? "MORE ACCOUNTS"
                                                : undefined
                                        }
                                    />
                                </>
                            );
                        })()}
                </>
            )}
        </main>
    );
};

export default SearchPage;
