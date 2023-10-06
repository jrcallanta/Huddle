"use client";

import UserBanner from "@/components/UserBanner";
import UserListTile from "@/components/UserListTile";
import { useUser } from "@/hooks/useUser";
import { UserType } from "@/types";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

enum FETCH_STATUS {
    idle = "IDLE",
    loading = "LOADING",
    error = "ERROR",
}

const SearchPage = ({ params: { query } }: { params: { query: string } }) => {
    const { currentUser } = useUser();
    const [fetchStatus, setFetchStatus] = useState(FETCH_STATUS.idle);
    const [searchResults, setSearchResults] = useState<[] | null>(null);

    useEffect(() => {
        const fetchQuery = async (query: string) => {
            setFetchStatus(FETCH_STATUS.loading);
            const data = await fetch(`/api/user/search/${query}`, {
                method: "POST",
                body: JSON.stringify({
                    currentUserId: currentUser?._id,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setSearchResults(data.users?.length ? data.users : null);
                    setFetchStatus(FETCH_STATUS.idle);
                });

            return data;
        };

        if (query) fetchQuery(query);
    }, [query]);

    return (
        <main
            className={twMerge(
                "themed h-screen w-full overflow-hidden overflow-y-auto p-4 pr-6 bg-white flex flex-col gap-4 mr-auto relative",
                "[&_>_*]:animate-fade-in"
            )}
        >
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

            {query && fetchStatus === "LOADING" && (
                <div className='m-auto w-8 h-8 rounded-full border-2 border-x-black border-y-white border-black animate-spin'></div>
            )}

            {searchResults && fetchStatus !== "LOADING" && (
                // <div className='flex flex-col gap-6 mt-3 py-4 max-w-screen-lg'>
                //     {searchResults.map((user: UserType, i) => (
                //         <UserBanner
                //             user={user}
                //             className={twMerge("animate-fade-in")}
                //             style={{
                //                 animationDelay: `${i * 25}ms`,
                //                 animationTimingFunction: "ease-in",
                //                 animationFillMode: "backwards",
                //             }}
                //         />
                //     ))}
                // </div>
                <UserListTile users={searchResults} />
            )}
        </main>
    );
};

export default SearchPage;
