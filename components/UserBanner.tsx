import { UserType } from "@/types";
import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface UserBannerProps extends React.HTMLAttributes<HTMLDivElement> {
    user: UserType;
    className?: string;
}

const UserBanner: React.FC<UserBannerProps> = ({
    user,
    className,
    ...props
}) => {
    return (
        <div
            className={twMerge(
                "w-full h-fit p-4 flex gap-4",
                "themed rounded-full bg-[var(--500)] hover:bg-[var(--600)] border-[3px] border-[var(--700)] cursor-pointer transition-all",
                String(className)
            )}
            {...props}
        >
            <div
                className={twMerge(
                    "bannerIcon h-12 w-12 rounded-full flex-shrink-0 flex justify-center items-center border-white border-[2px] bg-white/10"
                )}
            >
                {user.imgUrl ? (
                    <Image
                        className='rounded-full w-full h-full'
                        src={user.imgUrl}
                        alt={user.username}
                        width={40}
                        height={40}
                    />
                ) : (
                    <p className='text text-white'>{user.name?.slice(0, 2)}</p>
                )}
            </div>
            <div className='h-full flex flex-col justify-between'>
                <p className='text text-lg text-white font-medium'>
                    @{user.username}
                </p>
                <p className='text text-sm text-white/50'>{user.name}</p>
            </div>
        </div>
    );
};

export default UserBanner;
