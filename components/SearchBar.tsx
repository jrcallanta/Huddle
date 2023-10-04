import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
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
                "themed bg-white/20 p-2 flex rounded-full transition-all",
                className
            )}
            onClick={() => {
                setIsExpanded(true);
                setTimeout(
                    () => document.getElementById("searchbar-input")?.focus(),
                    0
                );
            }}
        >
            <FiSearch size={28} color='white' strokeWidth={2} />
            <input
                id='searchbar-input'
                type='text'
                className={twMerge(
                    "opacity-0 w-0 bg-transparent outline-none text-white placeholder:text-white/30 transition-all",
                    isExpanded && "block opacity-100 w-full max-w-36 mx-4"
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
