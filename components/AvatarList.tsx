import { InviteType, UserType } from "@/types";
import React, { useMemo } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface AvatarListProps {
    inviteList?: InviteType[];
    userList?: UserType[];
    userIDList?: string[];
    displayLimit?: number;
    tight?: boolean;
}

const AvatarList: React.FC<AvatarListProps> = ({
    inviteList,
    userList,
    userIDList,
    displayLimit,
    tight = false,
}) => {
    const going = useMemo(
        () => inviteList?.filter((invite) => invite.status !== "NOT_GOING"),
        [inviteList]
    );

    return !tight ? (
        <div className={"flex gap-2"}>
            {going && (
                <>
                    {going
                        .slice(0, Math.min(displayLimit ?? going.length))
                        .map((invite, i) => (
                            <div
                                key={i}
                                className={twMerge(
                                    `
                                    bg-blend-color-dodge bg-[var(--500)]
                                    outline
                                    outline-[2px]
                                    outline-[var(--300)]
                                    user-avatar
                                    w-7
                                    h-7
                                    rounded-full
                                    flex
                                    justify-center
                                    items-center
                                `,
                                    invite.status === "PENDING" && "opacity-50"
                                )}
                            >
                                {invite.user?.imgUrl ? (
                                    <Image
                                        className='rounded-full'
                                        src={invite.user.imgUrl}
                                        alt={invite.user.username}
                                        width={40}
                                        height={40}
                                    />
                                ) : (
                                    <p className='text-xs'>
                                        {invite.user?.name?.slice(0, 2)}
                                    </p>
                                )}
                            </div>
                        ))}
                </>
            )}
        </div>
    ) : (
        <div className='flex gap-2'>
            {going && (
                <div className='h-7 relative'>
                    {going
                        .slice(0, displayLimit ?? going.length)
                        .map((invite, i) => (
                            <div
                                key={i}
                                className={twMerge(
                                    `       
                                    absolute
                                    bg-blend-color-dodge bg-[var(--500)]
                                    outline
                                    outline-[2px]
                                    outline-[var(--300)]
                                    user-avatar
                                    w-7
                                    h-7
                                    rounded-full
                                    flex
                                    justify-center
                                    items-center
                                `,
                                    invite.status === "PENDING" &&
                                        "outline-[var(--300)] [&_img]:opacity-30 bg-[var(--400)]"
                                )}
                                style={{
                                    left: `${i * 1.5}rem`,
                                    zIndex: `${
                                        going.slice(
                                            0,
                                            displayLimit ?? going.length
                                        ).length - i
                                    }`,
                                }}
                            >
                                {invite.user?.imgUrl ? (
                                    <Image
                                        className='rounded-full'
                                        src={invite.user.imgUrl}
                                        alt={invite.user.username}
                                        width={40}
                                        height={40}
                                    />
                                ) : (
                                    <p className='text-xs'>
                                        {invite.user?.name?.slice(0, 2)}
                                    </p>
                                )}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default AvatarList;
