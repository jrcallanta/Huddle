import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { RxCaretLeft } from "react-icons/rx";
import { twMerge } from "tailwind-merge";

interface SearchBarProps {
    onSearch?: any;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleKeyDown = (e: any) => {
        if (e.key === "Enter") onSearch(e.target.value);
    };

    return (
        <div
            className={twMerge(
                "searchbar bg-white/20 p-2 flex rounded-full transition-all cursor-pointer",
                isExpanded && "w-full md:w-auto",
                className
            )}
            onClick={() => {
                if (!isExpanded) {
                    setIsExpanded(true);
                    setTimeout(
                        () =>
                            document.getElementById("searchbar-input")?.focus(),
                        0
                    );
                }
            }}
        >
            <FiSearch
                className='flex-shrink-0'
                size={28}
                color='white'
                strokeWidth={2}
            />
            <input
                id='searchbar-input'
                type='text'
                className={twMerge(
                    "opacity-0 w-0 bg-transparent outline-none text-white truncate placeholder:text-white/30 transition-all",
                    isExpanded && "block opacity-100 w-full md:w-64 mx-4"
                )}
                disabled={!isExpanded}
                placeholder='Search users'
                onBlur={() => setIsExpanded(false)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default SearchBar;
