"use client";

import { UserTypeForTile } from "@/types";
import { twMerge } from "tailwind-merge";
import UserAvatar from "./UserAvatar";

export interface UserTileOptions {
    hideUsername?: boolean;
    hideName?: boolean;
    hideAvatar?: boolean;
    avatarSize?: "sm" | "md";
    hideInteractions?: boolean;
    appendUsername?: string;
    appendName?: string;
    onClick?: any;
}

export interface UserTileProps {
    user: UserTypeForTile;
    interactions?: any;
    className?: string;
    options?: UserTileOptions;
    onRemoveFromUserList?: () => void;
}

const UserTile: React.FC<UserTileProps> = ({
    user,
    interactions,
    options,
    className,
}) => {
    return (
        <div
            key={user._id}
            className={twMerge(
                "animate-fade-in relative h-fit w-full flex items-center gap-4 p-2 transition-colors",
                String(className)
            )}
            onClick={options?.onClick}
        >
            {!options?.hideAvatar && (
                <UserAvatar
                    username={user.username}
                    imgUrl={user.imgUrl}
                    size={options?.avatarSize}
                />
            )}

            <div className='h-full flex flex-col justify-around'>
                {!options?.hideUsername && (
                    <p className='username text-lg text-black flex gap-2'>
                        <span>@{user.username}</span>
                        {options?.appendUsername && (
                            <span className='opacity-50'>{`(${options?.appendUsername})`}</span>
                        )}
                    </p>
                )}

                {!options?.hideName && (
                    <p className={"name text-xs text-black/75 flex gap-2"}>
                        <span>{user.name}</span>
                        {options?.appendName && (
                            <span className='opacity-50'>{`(${options?.appendName})`}</span>
                        )}
                    </p>
                )}
            </div>

            {interactions}
        </div>
    );
};

export default UserTile;
