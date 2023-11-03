import { InviteType } from "@/types";
import React from "react";
import { twMerge } from "tailwind-merge";
import UserAvatar from "./UserAvatar";

interface UserAvatarListProps {
    inviteList?: InviteType[];
    showAll?: boolean;
    displayLimit?: number;
    avatarSize?: "sm" | "md";
    className?: String;
}

const UserAvatarList: React.FC<UserAvatarListProps> = ({
    inviteList,
    displayLimit,
    showAll = false,
    avatarSize = "sm",
    className,
}) => {
    return inviteList && (!displayLimit || displayLimit > 0) ? (
        <div className={twMerge("flex items-center gap-1", String(className))}>
            {inviteList
                .filter((invite) => invite.status !== "NOT_GOING" || showAll)
                .slice(0, Math.min(displayLimit ?? inviteList.length))
                .map(({ user, status }) =>
                    user ? (
                        <UserAvatar
                            key={user._id}
                            username={user.username}
                            imgUrl={user.imgUrl}
                            size={avatarSize}
                            className={twMerge(
                                !showAll && status !== "GOING" && "opacity-25"
                            )}
                        />
                    ) : null
                )}
        </div>
    ) : null;
};

export default UserAvatarList;
