import { InviteType } from "@/types";
import React from "react";
import { twMerge } from "tailwind-merge";
import UserAvatar from "./UserAvatar";

interface UserAvatarListProps {
    inviteList?: InviteType[];
    displayLimit?: number;
    avatarSize?: "sm" | "md";
    className?: String;
}

const UserAvatarList: React.FC<UserAvatarListProps> = ({
    inviteList,
    displayLimit,
    avatarSize = "sm",
    className,
}) => {
    return inviteList ? (
        <div className={twMerge("flex items-center gap-1", String(className))}>
            {inviteList
                .filter((invite) => invite.status !== "NOT_GOING")
                .slice(0, Math.min(displayLimit ?? inviteList.length))
                .map(({ user, status }) =>
                    user ? (
                        <UserAvatar
                            key={user._id}
                            username={user.username}
                            imgUrl={user.imgUrl}
                            size={avatarSize}
                            className={twMerge(
                                status === "PENDING" && "opacity-25"
                            )}
                        />
                    ) : null
                )}
        </div>
    ) : null;
};

export default UserAvatarList;
