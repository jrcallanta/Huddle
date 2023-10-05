import OptionButton from "./OptionButton";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { IoMdLogOut } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { IoSettingsOutline } from "react-icons/io5";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

interface AccountButtonProps {
    className?: string;
}

const AccountButton: React.FC<AccountButtonProps> = ({ className }) => {
    const { data: session, status: sessionStatus } = useSession();
    const [isMenuDisplayed, setIsMenuDisplayed] = useState(false);

    const menuItems = [
        {
            icon: VscAccount,
            text: "Profile",
            onclick: () => {},
        },
        {
            icon: IoSettingsOutline,
            text: "Settings",
            onclick: () => {},
        },
        {
            icon: IoMdLogOut,
            text: "Sign Out",
            onclick: signOut,
        },
    ];

    return (
        <>
            {sessionStatus !== "loading" && !session && (
                <OptionButton
                    className='order-2 w-fit text-black text-sm font-semibold bg-white rounded-full py-2 px-4'
                    onClick={() => signIn()}
                >
                    login
                </OptionButton>
            )}

            {sessionStatus !== "loading" && session && (
                <div
                    className={twMerge(
                        "md:relative order-2",
                        String(className)
                    )}
                >
                    <button
                        onClick={() => setIsMenuDisplayed((prev) => !prev)}
                        className={twMerge(
                            "rounded-full flex-shrink-0 flex justify-center items-center border-white border-[2px]"
                        )}
                    >
                        <Image
                            className='rounded-full'
                            src={session.user?.image ?? ""}
                            alt={"user_avatar"}
                            width={40}
                            height={40}
                        />
                    </button>

                    {isMenuDisplayed && (
                        <div
                            onMouseLeave={() => setIsMenuDisplayed(false)}
                            className={twMerge(
                                "absolute  flex flex-col items-stretch",
                                "mt-2 top-full left-2 right-2 md:-left-3 md:right-auto h-fit md:w-56",
                                "shadow-lg rounded-[1.8rem] overflow-clip bg-neutral-800 border-[4px] border-neutral-900"
                            )}
                        >
                            {menuItems.map((item, i) => (
                                <button
                                    onClick={() => item.onclick()}
                                    className='group w-full py-2 px-3 flex items-center gap-4 hover:bg-white/10'
                                >
                                    <div className='bg-white/20 p-1 rounded-full flex justify-center items-center'>
                                        <item.icon size={26} color='white' />
                                    </div>
                                    <p className='text text-md text-white/80 group-hover:text-white font-medium'>
                                        {item.text}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default AccountButton;
