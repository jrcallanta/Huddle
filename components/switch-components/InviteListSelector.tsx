import { InviteType, UserTypeForTile } from "@/types";
import React, { useCallback, useState } from "react";
import UserAvatar from "../UserAvatar";
import UserAvatarList from "../UserAvatarList";
import { twMerge } from "tailwind-merge";
import UserTileList from "../UserTileList";
import UserTile, { INTERACTION_TYPE } from "../UserTile";

interface InviteListSelectorProps {
    owner: UserTypeForTile;
    inviteList: InviteType[];
    isEditing?: boolean;
    className?: string;
}

const InviteListSelector: React.FC<InviteListSelectorProps> = ({
    inviteList,
    owner,
    isEditing,
    className,
}) => {
    const [isExpanded, setIsExpanded] = useState(isEditing);
    const [inviteListState, setInviteListState] =
        useState<InviteType[]>(inviteList);

    const handleClick = useCallback(() => {
        if (!isEditing) setIsExpanded((prev) => !prev);
    }, [isEditing]);

    return (
        <div
            className={twMerge(
                "w-full p-4 flex items-center gap-1 [&_.avatarIcon]:bg-[var(--500)]",
                isExpanded &&
                    "p-0 gap-0 flex-col h-full overflow-hidden overflow-y-auto",
                String(className)
            )}
            onClick={handleClick}
        >
            {!isExpanded ? (
                <>
                    <UserAvatar
                        username={owner.username}
                        imgUrl={owner.imgUrl}
                        size='sm'
                    />
                    <UserAvatarList
                        inviteList={inviteListState}
                        avatarSize='sm'
                        displayLimit={5}
                    />
                </>
            ) : (
                (() => {
                    let cn =
                        "px-4 py-2 animate-none [&_p]:text-white/75 hover:bg-white/20";
                    let options = {
                        hideUsername: true,
                        hideInteractions: !isEditing,
                        avatarSize: "sm" as any,
                    };

                    return (
                        <>
                            <UserTile
                                user={{
                                    _id: owner._id,
                                    name: owner.name,
                                    username: owner.username,
                                    imgUrl: owner.imgUrl,
                                }}
                                options={{
                                    ...options,
                                    hideInteractions: true,
                                    appendName: "host",
                                }}
                                className={cn}
                            />

                            {inviteListState
                                .filter(
                                    (invite) => invite.status !== "NOT_GOING"
                                )
                                .map(({ user, status, i }) =>
                                    user ? (
                                        <UserTile
                                            key={i}
                                            user={{
                                                ...user,
                                                inviteStatus: "INVITED",
                                            }}
                                            interactions={
                                                isEditing
                                                    ? INTERACTION_TYPE.invite
                                                    : undefined
                                            }
                                            options={options}
                                            className={twMerge(
                                                cn,
                                                "[&_button]:bg-[var(--500)] [&_button]:text-white",
                                                status === "PENDING" &&
                                                    "[&_>_*]:opacity-25"
                                            )}
                                        />
                                    ) : null
                                )}
                        </>
                    );
                })()
            )}
        </div>
    );
};

export default InviteListSelector;
