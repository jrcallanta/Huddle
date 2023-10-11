"use client";

import { useUser } from "@/hooks/useUser";
import { FRIENDSHIP_STATUS, UserTypeForTile } from "@/types";
import Image from "next/image";
import { GrClose } from "react-icons/gr";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

export const enum INTERACTION_TYPE {
    friendship,
    invite,
}

interface UserTileProps {
    user: UserTypeForTile;
    interactions?: INTERACTION_TYPE;
    onRemoveFromUserList?: () => void;
}

const UserTile: React.FC<UserTileProps> = ({
    user,
    interactions,
    onRemoveFromUserList,
}) => {
    const [friendshipStatusState, setFriendshipStatusState] = useState<
        string | undefined
    >(user.friendStatus);

    const { currentUser } = useUser();

    const friendshipHandlers = currentUser
        ? {
              onAdd: async () => {
                  setFriendshipStatusState(FRIENDSHIP_STATUS.pending);
                  fetch(`/api/friendships/${currentUser?._id}/${user._id}`, {
                      method: "POST",
                  })
                      .then((res) => res.json())
                      .then((data) => console.log(data))
                      .catch((error) => setFriendshipStatusState(undefined));
              },
              onCancel: async (remove?: boolean) => {
                  setFriendshipStatusState(undefined);
                  fetch(`/api/friendships/${currentUser?._id}/${user._id}`, {
                      method: "DELETE",
                  })
                      .then((res) => res.json())
                      .then((data) => console.log(data))
                      .catch((error) =>
                          setFriendshipStatusState(FRIENDSHIP_STATUS.pending)
                      );
                  if (remove && onRemoveFromUserList) onRemoveFromUserList();
              },
              onAccept: async () => {
                  setFriendshipStatusState(FRIENDSHIP_STATUS.friends);
                  fetch(`/api/friendships/${currentUser?._id}/${user._id}`, {
                      method: "PATCH",
                      body: JSON.stringify({
                          changes: FRIENDSHIP_STATUS.friends,
                      }),
                  })
                      .then((res) => res.json())
                      .then((data) => console.log(data))
                      .catch((error) =>
                          setFriendshipStatusState(FRIENDSHIP_STATUS.pending)
                      );
              },
              onIgnore: async (remove?: boolean) => {
                  setFriendshipStatusState(undefined);
                  fetch(`/api/friendships/${currentUser?._id}/${user._id}`, {
                      method: "DELETE",
                  })
                      .then((res) => res.json())
                      .then((data) => console.log(data))
                      .catch((error) =>
                          setFriendshipStatusState(FRIENDSHIP_STATUS.pending)
                      );
                  if (remove && onRemoveFromUserList) onRemoveFromUserList();
              },
              onRemove: async (remove?: boolean) => {
                  setFriendshipStatusState(undefined);
                  fetch(`/api/friendships/${currentUser?._id}/${user._id}`, {
                      method: "DELETE",
                  })
                      .then((res) => res.json())
                      .then((data) => console.log(data))
                      .catch((error) =>
                          setFriendshipStatusState(FRIENDSHIP_STATUS.friends)
                      );
                  if (remove && onRemoveFromUserList) onRemoveFromUserList();
              },
          }
        : undefined;

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
                friendshipHandlers &&
                (() => {
                    let cn =
                        "text-xs ml-auto h-fit bg-gray-100 text-gray-400 text-[var(--300)] [&:not(:not(button))]:hover:bg-gray-400 [&:not(:not(button))]:hover:text-white flex justify-center items-center px-3 py-1 rounded-full";
                    let { onRemove, onAccept, onIgnore, onAdd, onCancel } =
                        friendshipHandlers;

                    switch (friendshipStatusState) {
                        case FRIENDSHIP_STATUS.friends:
                            return (
                                <button
                                    className={"ml-auto"}
                                    onClick={() => onRemove(false)}
                                >
                                    <GrClose
                                        size={12}
                                        className='opacity-25 hover:opacity-100'
                                    />
                                </button>
                            );
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
                                                accept
                                            </button>
                                            <button
                                                onClick={() => onIgnore(true)}
                                                className={cn}
                                            >
                                                ignore
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => onCancel(false)}
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
