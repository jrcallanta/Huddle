"use client";

import React from "react";
import OptionButton from "./OptionButton";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import SearchBar from "./SearchBar";
import { useRouter } from "next/navigation";
import { RiHomeLine } from "react-icons/ri";
import { RxCaretLeft } from "react-icons/rx";

interface NavBarProps {
    vertical?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ vertical = false }) => {
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();

    const handleSearch = (query: string) => {
        router.push(`/search/${encodeURI(query)}`);
    };

    return (
        <div
            data-vertical={vertical}
            className={twMerge(
                `flex sticky z-10 top-0 w-full h-20 bg-black justify-between px-4`,
                vertical && "w-[8%] left-0 min-w-[8rem] h-screen px-2 py-8"
            )}
        >
            <div
                className={twMerge(
                    `w-full flex justify-end items-center gap-4`,
                    vertical && "flex-col"
                )}
            >
                {sessionStatus !== "loading" && !session && (
                    <OptionButton
                        className='w-fit text-black text-sm font-semibold bg-white rounded-full py-2 px-4'
                        onClick={() => signIn()}
                    >
                        login
                    </OptionButton>
                )}
                {sessionStatus !== "loading" && session && (
                    <>
                        <div
                            className={twMerge(
                                "order-2 [&:has(+_*_+_*_.searchbar_input.block)]:hidden md:[&:has(+_*_+_*_.searchbar_input.block)]:block",
                                "rounded-full flex-shrink-0 flex justify-center items-center border-white border-[.15rem]"
                            )}
                        >
                            <Image
                                className='rounded-full'
                                src={session.user?.image ?? ""}
                                alt={"user_avatar"}
                                width={40}
                                height={40}
                            />
                        </div>
                        {/* <div
                            className={twMerge(
                                `flex justify-center items-center gap-4`,
                                vertical && "flex-col"
                            )}
                        >
                            <div className='flex justify-center items-center h-fit'>
                                <div className='ml-auto rounded-full p-1 flex justify-center items-center border-white border-[.15rem]'>
                                    <Image
                                        className='rounded-full'
                                        src={session.user?.image ?? ""}
                                        alt={"user_avatar"}
                                        width={36}
                                        height={36}
                                    />
                                </div>
                            </div>
                            <p
                                className={twMerge(
                                    `text text-lg text-center text-white truncate whitespace-nowrap font-semibold`,
                                    vertical && "opacity-0 select-none"
                                )}
                            >
                                {session.user?.name}
                            </p>
                        </div> */}

                        {/* <OptionButton
                            className='w-fit text-black text-sm font-semibold bg-white rounded-full py-2 px-4'
                            onClick={() => signOut()}
                        >
                            logout
                        </OptionButton> */}
                    </>
                )}
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
                        className='hidden justify-center items-center rounded-full cursor-pointer [&:has(+_.searchbar_input.block)]:flex md:[&:has(+_.searchbar_input.block)]:hidden '
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
