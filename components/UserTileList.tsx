import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import UserTile, { INTERACTION_TYPE } from "./UserTile";
import { UserTypeForTile } from "@/types";

interface UserTileListProps {
    users: UserTypeForTile[];
    label?: string;
    interactions?: INTERACTION_TYPE;
    className?: string;
}

const UserTileList: React.FC<UserTileListProps> = ({
    users,
    label,
    interactions,
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
                <p className='text text-sm font-medium text-black/75 px-4 py-2'>
                    {label}
                </p>
            )}

            <div className='w-full h-fit rounded-lg overflow-clip flex flex-col'>
                {userListState.map((user, i) => (
                    <UserTile
                        key={user._id}
                        user={user}
                        interactions={interactions}
                        onRemoveFromUserList={() => onRemoveUser(user._id)}
                    />
                ))}
            </div>
        </div>
    ) : null;
};

export default UserTileList;
