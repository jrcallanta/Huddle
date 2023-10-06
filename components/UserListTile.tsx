import { UserType } from "@/types";
import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";

interface UserListTileProps {
    users: UserType[];
    className?: string;
}

const UserListTile: React.FC<UserListTileProps> = ({ users, className }) => {
    return (
        <div className='themed w-full h-fit rounded overflow-clip flex flex-col'>
            {users.map((user, i) => (
                <div
                    className={twMerge(
                        "relative h-fit w-full flex gap-4 hover:bg-black/10 p-2 border-b-2 border-white/10 last:border-none"
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
                </div>
            ))}
        </div>
    );
};

export default UserListTile;
