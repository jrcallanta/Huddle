"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import SearchBar from "./SearchBar";
import { useRouter } from "next/navigation";
import { RiHomeLine } from "react-icons/ri";
import { RxCaretLeft } from "react-icons/rx";
import AccountButton from "./AccountButton";

interface NavBarProps {
    vertical?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ vertical = false }) => {
    const router = useRouter();

    const handleSearch = (query: string) => {
        router.push(`/search/${encodeURI(query)}`);
    };

    return (
        <div
            data-vertical={vertical}
            className={twMerge(
                `themed flex sticky z-[100] top-0 w-full h-20 bg-[var(--700)] justify-between px-4`,
                vertical && "w-[8%] left-0 min-w-[8rem] h-screen px-2 py-8"
            )}
        >
            <div
                className={twMerge(
                    `w-full flex justify-end items-center gap-4`,
                    vertical && "flex-col"
                )}
            >
                <AccountButton className='[&:has(+_*_+_*_.searchbar_input.block)]:hidden md:[&:has(+_*_+_*_.searchbar_input.block)]:block' />
                <a
                    className='order-1 bg-white/20 p-2 flex rounded-full [&:has(+_*_.searchbar_input.block)]:hidden md:[&:has(+_*_.searchbar_input.block)]:block'
                    href='/'
                >
                    <RiHomeLine size={28} color='white' />
                </a>

                <div className='order-3 ml-auto flex justify-center items-center [&:has(.searchbar_input.block)]:w-full md:[&:has(.searchbar_input.block)]:w-auto'>
                    <button
                        // onClick={(e) => {
                        //     e.preventDefault();
                        //     router.back();
                        // }}
                        className='hidden -ml-2 justify-center items-center rounded-full cursor-pointer [&:has(+_.searchbar_input.block)]:flex md:[&:has(+_.searchbar_input.block)]:hidden '
                    >
                        <RxCaretLeft
                            size={32}
                            color='white'
                            strokeWidth={0.2}
                        />
                    </button>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>
        </div>
    );
};

export default NavBar;
