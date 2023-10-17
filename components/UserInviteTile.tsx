"use client";

import React, { useCallback } from "react";
import { BsCheck } from "react-icons/bs";
import UserTileGeneric, { UserTileProps } from "./UserTileGeneric";

interface UserInviteTileProps extends UserTileProps {
    onToggleInvite?: any;
}

const UserInviteTile: React.FC<UserInviteTileProps> = ({
    user,
    options,
    className,
    onToggleInvite,
}) => {
    const handleClick = useCallback(() => {
        let checkbox = document.getElementById(
            `invite-${user._id}`
        ) as HTMLInputElement;
        checkbox.checked = !checkbox.checked;
        if (onToggleInvite) onToggleInvite();
    }, []);

    return (
        <UserTileGeneric
            user={user}
            className={className}
            options={{ ...options, onClick: handleClick }}
            interactions={
                user.inviteStatus && user.inviteStatus !== "NEW_INVITE" ? (
                    <div className='ml-auto bg-white/20 rounded px-2 py-1'>
                        <p className='text-xs text-[var(--500)]'>
                            {user.inviteStatus.replace("_", " ")}
                        </p>
                    </div>
                ) : (
                    <label
                        className='ml-auto rounded-full w-5 h-5 border-2 border-[var(--300)] flex justify-center items-center  cursor-pointer'
                        onClick={(e) => e.preventDefault()}
                    >
                        <span className='rounded-full w-full h-full hover:bg-[var(--300)] [&:has(+_input:checked)]:bg-[var(--300)] [&:has(+_input:checked)_svg]:block flex justify-center items-center'>
                            <BsCheck className='hidden' color='white' />
                        </span>
                        <input
                            className={"hidden"}
                            type='checkbox'
                            id={`invite-${user._id}`}
                            checked={user.inviteStatus === "NEW_INVITE"}
                        />
                    </label>
                )
            }
        />
    );
};

export default UserInviteTile;
