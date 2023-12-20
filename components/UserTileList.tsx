import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
// import UserTile, { INTERACTION_TYPE } from "./UserTile";
import UserFriendshipTile from "./UserFriendshipTile";
import { UserTypeForTile } from "@/types";
import UserTileGeneric from "./UserTileGeneric";
import UserInviteTile from "./UserInviteTile";

export const enum INTERACTION_TYPE {
    friendship,
    invite,
}

interface UserTileListProps {
    users: UserTypeForTile[];
    label?: string;
    interactionType?: INTERACTION_TYPE;
    className?: string;
}

const UserTileList: React.FC<UserTileListProps> = ({
    users,
    label,
    interactionType,
    className,
}) => {
    const [userListState, setUserListState] =
        useState<UserTypeForTile[]>(users);

    const onRemoveUser = (userId: string) =>
        setUserListState((prev) => prev.filter((user) => user._id !== userId));

    return userListState.length ? (
        <div
            className={twMerge(
                "flex flex-col w-full rounded-lg",
                String(className)
            )}
        >
            {label && (
                <p className='text text-sm font-medium text-black/75 px-2 py-2'>
                    {label}
                </p>
            )}

            <div className='w-full h-fit rounded-lg overflow-clip flex flex-col'>
                {interactionType === undefined &&
                    userListState.map((user, i) => (
                        <UserTileGeneric
                            key={user._id}
                            user={user}
                            onRemoveFromUserList={() => onRemoveUser(user._id)}
                        />
                    ))}

                {interactionType === INTERACTION_TYPE.friendship &&
                    userListState.map((user, i) => (
                        <UserFriendshipTile
                            key={user._id}
                            user={user}
                            onRemoveFromUserList={() => onRemoveUser(user._id)}
                        />
                    ))}

                {interactionType === INTERACTION_TYPE.invite &&
                    userListState.map((user, i) => (
                        <UserInviteTile
                            key={user._id}
                            user={user}
                            onRemoveFromUserList={() => onRemoveUser(user._id)}
                        />
                    ))}
            </div>
        </div>
    ) : null;
};

export default UserTileList;
