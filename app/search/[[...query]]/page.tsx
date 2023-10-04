import React from "react";
import { twMerge } from "tailwind-merge";

const SearchPage = ({ params: { query } }: { params: { query: string } }) => {
    return (
        <main
            className={twMerge(
                "h-full overflow-hidden w-full max-w-screen-2xl justify-center align-stretch",
                "flex-col overflow-hidden md:flex md:flex-row-reverse md:h-full relative"
            )}
        >
            <div className='themed h-screen w-full bg-white flex flex-col p-8'>
                {!query && (
                    <div className=''>
                        <p className='text text-2xl text-black font-bold'>
                            {"What are you looking for?"}
                        </p>
                    </div>
                )}

                {query && (
                    <div className=''>
                        <div className='text text-lg text-black font-medium'>{`Showing results for '${decodeURI(
                            query
                        )}'...`}</div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default SearchPage;
