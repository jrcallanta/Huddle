import OptionButton from "./OptionButton";
import { signIn, signOut, useSession } from "next-auth/react";
import { IoMdLogOut } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { IoSettingsOutline } from "react-icons/io5";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import UserAvatar from "./UserAvatar";
import { useUser } from "@/hooks/useUser";

interface AccountButtonProps {
    className?: string;
}

const AccountButton: React.FC<AccountButtonProps> = ({ className }) => {
    const { status: sessionStatus } = useSession();
    const { currentUser } = useUser();
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
            {/* {sessionStatus !== "loading" && !currentUser && (
                <OptionButton
                    className='order-2 w-fit text-black text-sm font-semibold bg-white rounded-full py-2 px-4'
                    onClick={() => signIn()}
                >
                    login
                </OptionButton>
            )} */}

            {sessionStatus !== "loading" && currentUser && (
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
                        <UserAvatar
                            username={currentUser.username}
                            imgUrl={currentUser.imgUrl}
                        />
                    </button>

                    {isMenuDisplayed && (
                        <div
                            onMouseLeave={() => setIsMenuDisplayed(false)}
                            className={twMerge(
                                "absolute flex flex-col items-stretch",
                                "mt-2 top-full md:top-[calc(100%_+_1rem)] left-2 right-2 md:-left-3 h-fit md:w-64",
                                "shadow-lg rounded-[1.8rem] overflow-clip bg-[var(--600)] border-[4px] border-[var(--700)]"
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
                                    <p className='text text-md text-white/80 group-hover:text-white font-medium whitespace-nowrap'>
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
