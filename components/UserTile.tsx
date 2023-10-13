"use client";

import { useUser } from "@/hooks/useUser";
import { FRIENDSHIP_STATUS, UserTypeForTile } from "@/types";
import { GrClose } from "react-icons/gr";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import UserAvatar from "./UserAvatar";
import { BsCheck } from "react-icons/bs";

export const enum INTERACTION_TYPE {
    friendship,
    invite,
}

interface DisplayOptions {
    hideUsername?: boolean;
    hideName?: boolean;
    hideAvatar?: boolean;
    avatarSize?: "sm" | "md";
    hideInteractions?: boolean;
    appendUsername?: string;
    appendName?: string;
}

interface UserTileProps {
    user: UserTypeForTile;
    interactions?: INTERACTION_TYPE;
    className?: string;
    options?: DisplayOptions;
    onRemoveFromUserList?: () => void;
}

const UserTile: React.FC<UserTileProps> = ({
    user,
    interactions,
    options,
    className,
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
            className={twMerge(
                "animate-fade-in relative h-fit w-full flex items-center gap-4 p-2 transition-colors",
                String(className)
            )}
        >
            {!options?.hideAvatar && (
                <UserAvatar
                    username={user.username}
                    imgUrl={user.imgUrl}
                    size={options?.avatarSize}
                />
            )}

            <div className='h-full flex flex-col justify-around'>
                {!options?.hideUsername && (
                    <p className='username text-lg text-black flex gap-2'>
                        <span>@{user.username}</span>
                        {options?.appendUsername && (
                            <span className='opacity-50'>{`(${options?.appendUsername})`}</span>
                        )}
                    </p>
                )}

                {!options?.hideName && (
                    <p className={"name text-xs text-black/75 flex gap-2"}>
                        <span>{user.name}</span>
                        {options?.appendName && (
                            <span className='opacity-50'>{`(${options?.appendName})`}</span>
                        )}
                    </p>
                )}
            </div>

            {!options?.hideInteractions && (
                <>
                    {interactions === INTERACTION_TYPE.friendship &&
                        friendshipHandlers &&
                        (() => {
                            let cn =
                                "text-xs ml-auto h-fit bg-gray-100 text-gray-400 text-[var(--300)] [&:not(:not(button))]:hover:bg-gray-400 [&:not(:not(button))]:hover:text-white flex justify-center items-center px-3 py-1 rounded-full";
                            let {
                                onRemove,
                                onAccept,
                                onIgnore,
                                onAdd,
                                onCancel,
                            } = friendshipHandlers;

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
                                                        onClick={() =>
                                                            onIgnore(true)
                                                        }
                                                        className={cn}
                                                    >
                                                        ignore
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            onCancel(false)
                                                        }
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

                    {interactions === INTERACTION_TYPE.invite && (
                        <label className='ml-auto rounded-full w-5 h-5 border-2 border-[var(--500)] flex justify-center items-center  cursor-pointer'>
                            <span className='rounded-full w-full h-full hover:bg-[var(--500)] [&:has(+_input:checked)]:bg-[var(--500)] [&:has(+_input:checked)_svg]:block flex justify-center items-center'>
                                <BsCheck className='hidden' color='white' />
                            </span>
                            <input
                                className={"hidden"}
                                type='checkbox'
                                defaultChecked={user.inviteStatus === "INVITED"}
                            />
                        </label>
                    )}
                </>
            )}
        </div>
    );
};

export default UserTile;
