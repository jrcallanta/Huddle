"use client";

import UserBanner from "@/components/UserBanner";
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
            const data = await fetch(`/api/user/username/${query}`, {
                method: "POST",
                body: JSON.stringify({
                    currentUser: currentUser,
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
                "themed h-screen w-full overflow-hidden overflow-y-auto p-8 bg-white flex flex-col mr-auto relative"
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
                <div className='flex flex-col gap-6 mt-3 py-4 max-w-screen-lg'>
                    {searchResults.map((user: UserType, i) => (
                        <UserBanner
                            user={user}
                            className={twMerge(
                                "animate-fade-in hover:-translate-y-2 hover:translate-x-2"
                                // "animate-fade-in shadow bg-neutral-800 hover:bg-neutral-600 hover:-translate-y-2 hover:translate-x-2 [&_.text]:text-white [&_>_*]:border-white [&_.bannerIcon]:bg-white/25 border-black",
                                // "bg-white shadow hover:shadow-lg hover:bg-neutral-200  [&_.text]:text-black [&_>_*]:border-black [&_.bannerIcon]:bg-black/25 border-black"
                            )}
                            style={{
                                animationDelay: `${i * 25}ms`,
                                animationTimingFunction: "ease-in",
                                animationFillMode: "backwards",
                            }}
                        />
                    ))}
                </div>
            )}
        </main>
    );
};

export default SearchPage;
