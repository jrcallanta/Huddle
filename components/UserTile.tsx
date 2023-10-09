"use client";

import { FRIENDSHIP_STATUS, UserTypeForTile } from "@/types";
import Image from "next/image";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

export const enum INTERACTION_TYPE {
    friendship,
    invite,
}

interface UserTileProps {
    user: UserTypeForTile;
    interactions?: INTERACTION_TYPE;
}

const UserTile: React.FC<UserTileProps> = ({ user, interactions }) => {
    const [friendshipStatusState, setFriendshipStatusState] = useState(
        user.friendStatus
    );

    const friendshipHandlers = {
        onAccept: () => {
            setFriendshipStatusState(FRIENDSHIP_STATUS.friends);
        },
        onDeny: () => {},
        onRemove: () => {},
        onAdd: () => {
            setFriendshipStatusState(FRIENDSHIP_STATUS.pending);
            console.log("added");
        },
        onCancel: () => {
            setFriendshipStatusState(undefined);
            console.log("canceled");
        },
    };

    const inviteHandlers = {
        onToggleInvite: () => {},
    };

    return (
        <div
            key={user._id}
            className={
                "animate-fade-in relative h-fit w-full flex items-center gap-4 p-2 border-b-2 border-white/10 last:border-none transition-colors"
            }
        >
            <div
                className={
                    "bannerIcon h-12 w-12 rounded-full flex-shrink-0 flex justify-center items-center border-white border-[2px] bg-black/80"
                }
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
                {interactions === INTERACTION_TYPE.invite ? (
                    <p className='my-auto text-lg text-black/75'>{user.name}</p>
                ) : (
                    <>
                        <p className='text-lg text-black'>@{user.username}</p>
                        <p className='text-xs text-black/75'>{user.name}</p>
                    </>
                )}
            </div>

            {interactions === INTERACTION_TYPE.friendship &&
                (() => {
                    let cn =
                        "text-xs ml-auto h-fit bg-gray-100 text-gray-400 text-[var(--300)] [&:not(:not(button))]:hover:bg-gray-400 [&:not(:not(button))]:hover:text-white flex justify-center items-center px-3 py-1 rounded-full";
                    let { onAccept, onDeny, onAdd, onCancel } =
                        friendshipHandlers;

                    switch (friendshipStatusState) {
                        case FRIENDSHIP_STATUS.friends:
                            return null;
                        case FRIENDSHIP_STATUS.pending:
                            return (
                                <div className='flex gap-4 ml-auto'>
                                    {user.friendRequester ? (
                                        <>
                                            <button
                                                onClick={onAccept}
                                                className={twMerge(
                                                    cn,
                                                    "bg-[var(--200)] hover:bg-[var(--300)]"
                                                )}
                                            >
                                                confirm
                                            </button>
                                            <button
                                                onClick={onDeny}
                                                className={cn}
                                            >
                                                delete
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={onCancel}
                                                className={cn}
                                            >
                                                cancel request
                                            </button>
                                        </>
                                    )}
                                </div>
                            );
                        default:
                            return (
                                <button onClick={onAdd} className={cn}>
                                    add friend
                                </button>
                            );
                    }
                })()}

            {interactions === INTERACTION_TYPE.invite &&
                (() => {
                    let cn =
                        "ml-auto w-6 h-6 rounded-full border-[var(--400)] border-2";
                    switch (user.inviteStatus) {
                        case "INVITED":
                            return <button className={cn}></button>;
                        default:
                            return <button className={cn}></button>;
                    }
                })()}
        </div>
    );
};

export default UserTile;
