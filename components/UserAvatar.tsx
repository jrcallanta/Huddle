import { UserTypeForTile } from "@/types";
import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface UserAvatarProps {
    username: string;
    imgUrl?: string;
    size?: "sm" | "md";
    className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
    username,
    imgUrl,
    size,
    className,
}) => {
    return (
        <div
            title={`@${username}`}
            className={twMerge(
                "userAvatar w-10 h-10 flex justify-center items-center",
                "cursor-default rounded-full bg-[var(--500)]",
                size === "sm" && "w-7 h-7",
                String(className)
            )}
        >
            {imgUrl ? (
                <Image
                    className='rounded-full'
                    src={imgUrl}
                    alt={username}
                    width={40}
                    height={40}
                />
            ) : (
                <p
                    className={twMerge(
                        "select-none text text-white/75",
                        size === "sm" && "text-xs"
                    )}
                >
                    {username.slice(0, 2)}
                </p>
            )}
        </div>
    );
};

export default UserAvatar;
