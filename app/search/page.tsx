import React from "react";
import { twMerge } from "tailwind-merge";

const SearchPage = () => {
    return (
        <main
            className={twMerge(
                "h-full overflow-hidden w-full max-w-screen-2xl justify-center align-stretch",
                "flex-col overflow-hidden md:flex md:flex-row-reverse md:h-full relative"
            )}
        >
            SearchPage
        </main>
    );
};

export default SearchPage;
