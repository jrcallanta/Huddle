import { UserType } from "@/types";
import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";

interface UserTypeForTile extends UserType {
    friendStatus: string;
}

interface UserListTileProps {
    users: UserTypeForTile[];
    className?: string;
}

const UserListTile: React.FC<UserListTileProps> = ({ users, className }) => {
    return (
        <div className='themed w-full h-fit rounded-lg overflow-clip flex flex-col'>
            {users.map((user, i) => (
                <div
                    className={twMerge(
                        "animate-fade-in relative h-fit w-full flex items-center gap-4 hover:bg-black/10 p-2 border-b-2 border-white/10 last:border-none transition-colors"
                    )}
                >
                    <div
                        className={twMerge(
                            "bannerIcon h-12 w-12 rounded-full flex-shrink-0 flex justify-center items-center border-white border-[2px] bg-black/80"
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
                        <p className='text text-lg text-black font'>
                            @{user.username}
                        </p>
                        <p className='text text-xs text-black/75'>
                            {user.name}
                        </p>
                    </div>
                    {user.friendStatus && (
                        <button className='ml-auto h-fit border-2 border-black flex justify-center items-center px-2 rounded-full'>
                            <p className='text text-sm text-black'>
                                {user.friendStatus}
                            </p>
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default UserListTile;
