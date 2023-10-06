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
                "w-full rounded-full transition-all duration-250 group/banner",
                "themed-darker bg-[var(--500)] [&_>_*]:border-[var(--500)] [&_>_:first-child]:bg-[var(--400)]",
                String(className)
            )}
            {...props}
        >
            <div
                className={twMerge(
                    "relative h-full w-full flex gap-4 -top-2 left-2 p-2",
                    "transition-all duration-250",
                    "overflow-hidden border-4 rounded-full",
                    "hover:-top-3 hover:left-3 [&:active:not(:has(.options_button:active))]:top-0 [&:active:not(:has(.options_button:active))]:left-0"
                )}
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
                        <p className='text text-white'>
                            {user.name?.slice(0, 2)}
                        </p>
                    )}
                </div>
                <div className='h-full flex flex-col justify-between'>
                    <p className='text text-lg text-white font-medium'>
                        @{user.username}
                    </p>
                    <p className='text text-sm text-white/75'>{user.name}</p>
                </div>
            </div>
        </div>
    );
};

export default UserBanner;
