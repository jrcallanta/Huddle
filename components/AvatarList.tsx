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
    className?: String;
}

const AvatarList: React.FC<AvatarListProps> = ({
    inviteList,
    userList,
    userIDList,
    displayLimit,
    tight = false,
    className,
}) => {
    const going = useMemo(
        () => inviteList?.filter((invite) => invite.status !== "NOT_GOING"),
        [inviteList]
    );

    return (
        <div className={twMerge("flex gap-1", String(className))}>
            {going && (
                <>
                    {going
                        .slice(0, Math.min(displayLimit ?? going.length))
                        .map((invite, i) => (
                            <div
                                key={i}
                                className={twMerge(
                                    `
                                    user-avatar
                                    bg-blend-color-dodge bg-[var(--500)]
                                    w-7 h-7
                                    rounded-full
                                    flex justify-center items-center
                                `,
                                    `border-[2px] border-[var(--300)]`,
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
                                    <p className='text-xs text-white/75'>
                                        {invite.user?.name?.slice(0, 2)}
                                    </p>
                                )}
                            </div>
                        ))}
                </>
            )}
        </div>
    );
};

export default AvatarList;
