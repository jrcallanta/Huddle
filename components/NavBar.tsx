"use client";

import React from "react";
import OptionButton from "./OptionButton";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface NavBarProps {
    vertical?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ vertical = false }) => {
    const { data: session, status: sessionStatus } = useSession();

    return (
        <div
            data-vertical={vertical}
            className={twMerge(
                `flex sticky z-10 top-0 w-full h-20 bg-black justify-between px-8`,
                vertical && "w-[8%] left-0 min-w-[8rem] h-screen px-2 py-8"
            )}
        >
            <div
                className={twMerge(
                    `w-full flex justify-between items-center gap-12`,
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
                                `flex justify-center items-center gap-4`,
                                vertical && "flex-col"
                            )}
                        >
                            <div className='flex justify-center items-center h-fit'>
                                <div className='rounded-full p-1 flex justify-center items-center border-white border-[.15rem]'>
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
                        </div>
                        <OptionButton
                            className='w-fit text-black text-sm font-semibold bg-white rounded-full py-2 px-4'
                            onClick={() => signOut()}
                        >
                            logout
                        </OptionButton>
                    </>
                )}
            </div>
        </div>
    );
};

export default NavBar;
