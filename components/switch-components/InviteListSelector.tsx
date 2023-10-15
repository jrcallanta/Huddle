"use client";

import { InviteType, UserType, UserTypeForTile } from "@/types";
import React, { useCallback, useState } from "react";
import UserAvatar from "../UserAvatar";
import UserAvatarList from "../UserAvatarList";
import { twMerge } from "tailwind-merge";
import UserInviteTile from "../UserInviteTile";
import UserTileGeneric from "../UserTileGeneric";

interface InviteListSelectorProps {
    currentUser?: UserType;
    owner: UserTypeForTile;
    inviteList: InviteType[];
    isEditing?: boolean;
    className?: string;
}

const InviteListSelector: React.FC<InviteListSelectorProps> = ({
    currentUser,
    owner,
    inviteList,
    isEditing,
    className,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [inviteListState, setInviteListState] =
        useState<InviteType[]>(inviteList);
    const [newInviteList, setNewInviteList] = useState<UserTypeForTile[]>([]);
    const [friendsList, setFriendsList] = useState<UserTypeForTile[] | null>(
        null
    );

    const getFriends = useCallback(async () => {
        if (currentUser)
            fetch(`/api/friendships/${currentUser._id}`)
                .then((res) => res.json())
                .then((data) => setFriendsList(data.friendships));
    }, [currentUser]);

    const handleClick = useCallback(
        async (e: any) => {
            e.stopPropagation();

            if (!friendsList) await getFriends();

            setIsExpanded((prev) => !prev);
        },
        [friendsList, getFriends]
    );

    const handleToggleUserSelect = (user: UserTypeForTile) => {
        setNewInviteList((prev) => {
            let newList = [...prev];
            let index = newList.map((user) => user._id).indexOf(user._id);
            if (index < 0) newList.push(user);
            else newList.splice(index, 1);
            console.log(newList);
            return newList;
        });
    };

    return (
        <div
            className={twMerge(
                "relative w-full p-4 flex items-center gap-1 [&_.userAvatar]:bg-[var(--500)]",
                isExpanded &&
                    "h-full p-0 gap-0 flex-col overflow-hidden overflow-y-auto",
                // isExpanded &&
                //     isEditing &&
                //     "bg-[var(--500)] [&_.userAvatar]:bg-[var(--900)]",
                String(className)
            )}
            onClick={!isExpanded ? handleClick : () => {}}
        >
            {!isExpanded ? (
                <>
                    <UserAvatar
                        username={owner.username}
                        imgUrl={owner.imgUrl}
                        size='sm'
                        className='border-2 border-white'
                    />
                    <UserAvatarList
                        inviteList={inviteListState}
                        avatarSize='sm'
                        displayLimit={5}
                    />
                    <div className='ml-auto'>
                        <button
                            className='px-2 py-1 bg-white/20 rounded text-xs text-white/75 font-medium hover:text-white hover:bg-white/40'
                            onClick={!isExpanded ? handleClick : () => {}}
                        >
                            view all
                        </button>
                    </div>
                </>
            ) : (
                (() => {
                    let usertile_cn =
                        "px-4 py-2 animate-none [&_p]:text-white/75 hover:bg-white/10";
                    let label_cn =
                        "pt-2 text-sm text-white/80 font-medium uppercase";
                    let options = {
                        hideUsername: true,
                        avatarSize: "sm" as any,
                    };
                    return (
                        <>
                            {isEditing && (
                                <div className='w-full px-4 py-2'>
                                    <p className={label_cn}>Hosts</p>
                                </div>
                            )}
                            <UserTileGeneric
                                user={{
                                    _id: owner._id,
                                    name: owner.name,
                                    username: owner.username,
                                    imgUrl: owner.imgUrl,
                                }}
                                options={{
                                    ...options,
                                    appendName: !isEditing ? "host" : undefined,
                                }}
                                className={twMerge(
                                    usertile_cn,
                                    "[&_>_.userAvatar]:border-2 [&_>_.userAvatar]:border-white "
                                )}
                            />

                            {inviteListState.length > 0 && (
                                <>
                                    {isEditing && (
                                        <div className='w-full px-4 py-2'>
                                            <p className={label_cn}>
                                                Already Invited
                                            </p>
                                        </div>
                                    )}
                                    {inviteListState
                                        .filter(
                                            ({ status }) =>
                                                isEditing ||
                                                status !== "NOT_GOING"
                                        )
                                        .map(({ user, status }, i) =>
                                            user ? (
                                                <UserInviteTile
                                                    key={i}
                                                    user={{
                                                        ...user,
                                                        inviteStatus: status,
                                                    }}
                                                    options={options}
                                                    className={twMerge(
                                                        usertile_cn,
                                                        "[&_button]:bg-[var(--500)] [&_button]:text-white",
                                                        status !== "GOING" &&
                                                            "[&_>_*]:opacity-50 [&:hover_>_*]:opacity-100"
                                                    )}
                                                />
                                            ) : null
                                        )}
                                </>
                            )}

                            {isEditing && friendsList && (
                                <>
                                    <div className='w-full px-4 py-2'>
                                        <p className={label_cn}>
                                            Invite Others
                                        </p>
                                    </div>
                                    {friendsList
                                        .filter(
                                            ({ _id }) =>
                                                !inviteListState
                                                    .map(
                                                        (invite) =>
                                                            invite.user?._id
                                                    )
                                                    .includes(_id.toString())
                                        )
                                        .map((user, i) => (
                                            <UserInviteTile
                                                key={i}
                                                user={user}
                                                options={options}
                                                onToggleInvite={() =>
                                                    handleToggleUserSelect(user)
                                                }
                                                className={twMerge(
                                                    usertile_cn,
                                                    "[&_button]:bg-[var(--500)] [&_button]:text-white"
                                                )}
                                            />
                                        ))}
                                </>
                            )}

                            <div className='sticky z-[2] bottom-0 w-full group/hidebutton bg-[var(--400)] border-t-2 border-[var(--500)]'>
                                <button
                                    className={
                                        "w-full px-4 py-3 text-xs font-medium text-[var(--600)] group-hover/hidebutton:text-white group-hover/hidebutton:bg-white/10"
                                    }
                                    onClick={() => setIsExpanded(false)}
                                >
                                    show less
                                </button>
                            </div>
                        </>
                    );
                })()
            )}
        </div>
    );
};

export default InviteListSelector;
