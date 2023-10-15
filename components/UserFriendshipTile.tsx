"use client";

import { useUser } from "@/hooks/useUser";
import { FRIENDSHIP_STATUS, UserTypeForTile } from "@/types";
import { GrClose } from "react-icons/gr";
import React, { useCallback, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import UserAvatar from "./UserAvatar";
import { BsCheck } from "react-icons/bs";
import UserTileGeneric, { UserTileProps } from "./UserTileGeneric";

interface UserFriendshipTileProps extends UserTileProps {}

const UserFriendshipTile: React.FC<UserFriendshipTileProps> = ({
    user,
    options,
    className,
    onRemoveFromUserList,
}) => {
    const [friendshipStatusState, setFriendshipStatusState] = useState<
        string | undefined
    >(user.friendStatus);

    const { currentUser } = useUser();

    const friendshipHandlers = useMemo(
        () =>
            currentUser
                ? {
                      onAdd: async () => {
                          setFriendshipStatusState(FRIENDSHIP_STATUS.pending);
                          fetch(
                              `/api/friendships/${currentUser?._id}/${user._id}`,
                              {
                                  method: "POST",
                              }
                          )
                              .then((res) => res.json())
                              .then((data) => console.log(data))
                              .catch((error) =>
                                  setFriendshipStatusState(undefined)
                              );
                      },
                      onCancel: async (remove?: boolean) => {
                          setFriendshipStatusState(undefined);
                          fetch(
                              `/api/friendships/${currentUser?._id}/${user._id}`,
                              {
                                  method: "DELETE",
                              }
                          )
                              .then((res) => res.json())
                              .then((data) => console.log(data))
                              .catch((error) =>
                                  setFriendshipStatusState(
                                      FRIENDSHIP_STATUS.pending
                                  )
                              );
                          if (remove && onRemoveFromUserList)
                              onRemoveFromUserList();
                      },
                      onAccept: async () => {
                          setFriendshipStatusState(FRIENDSHIP_STATUS.friends);
                          fetch(
                              `/api/friendships/${currentUser?._id}/${user._id}`,
                              {
                                  method: "PATCH",
                                  body: JSON.stringify({
                                      changes: FRIENDSHIP_STATUS.friends,
                                  }),
                              }
                          )
                              .then((res) => res.json())
                              .then((data) => console.log(data))
                              .catch((error) =>
                                  setFriendshipStatusState(
                                      FRIENDSHIP_STATUS.pending
                                  )
                              );
                      },
                      onIgnore: async (remove?: boolean) => {
                          setFriendshipStatusState(undefined);
                          fetch(
                              `/api/friendships/${currentUser?._id}/${user._id}`,
                              {
                                  method: "DELETE",
                              }
                          )
                              .then((res) => res.json())
                              .then((data) => console.log(data))
                              .catch((error) =>
                                  setFriendshipStatusState(
                                      FRIENDSHIP_STATUS.pending
                                  )
                              );
                          if (remove && onRemoveFromUserList)
                              onRemoveFromUserList();
                      },
                      onRemove: async (remove?: boolean) => {
                          setFriendshipStatusState(undefined);
                          fetch(
                              `/api/friendships/${currentUser?._id}/${user._id}`,
                              {
                                  method: "DELETE",
                              }
                          )
                              .then((res) => res.json())
                              .then((data) => console.log(data))
                              .catch((error) =>
                                  setFriendshipStatusState(
                                      FRIENDSHIP_STATUS.friends
                                  )
                              );
                          if (remove && onRemoveFromUserList)
                              onRemoveFromUserList();
                      },
                  }
                : undefined,
        [currentUser]
    );

    return (
        <UserTileGeneric
            user={user}
            options={options}
            className={className}
            interactions={
                !friendshipHandlers
                    ? undefined
                    : (() => {
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
                      })()
            }
        />
    );
};

export default UserFriendshipTile;
