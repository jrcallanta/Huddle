"use client";

import { InviteType, UserType, UserTypeForTile } from "@/types";
import React, { useCallback, useState } from "react";
import UserAvatar from "../UserAvatar";
import UserAvatarList from "../UserAvatarList";
import { twMerge } from "tailwind-merge";
import UserInviteTile from "../UserInviteTile";
import UserTileGeneric from "../UserTileGeneric";
import { PiCaretLeftBold } from "react-icons/pi";
import { createPortal } from "react-dom";
import UserInviteModal from "../UserInviteModal";

interface InviteListSelectorProps {
    currentUser?: UserType;
    host: UserTypeForTile;
    inviteList: InviteType[];
    className?: string;
}

const InviteListSelector: React.FC<InviteListSelectorProps> = ({
    currentUser,
    host,
    inviteList,
    className,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [inviteListState, setInviteListState] =
        useState<InviteType[]>(inviteList);
    let inviteListModal = document.getElementById("invite-list-modal");

    return (
        <div
            className={twMerge(
                "w-full flex justify-between gap-1 bg-[var(--400)] [&_.userAvatar]:bg-[var(--500)]",
                String(className)
            )}
            onClick={!isExpanded ? () => setIsExpanded(true) : undefined}
        >
            <div className='flex flex-[4] gap-1 p-4'>
                <UserAvatar
                    username={host.username}
                    imgUrl={host.imgUrl}
                    size='sm'
                    className='border-2 border-white'
                />
                <UserAvatarList
                    inviteList={inviteListState}
                    avatarSize='sm'
                    displayLimit={5}
                />
            </div>

            {isExpanded &&
                inviteListModal &&
                createPortal(
                    <UserInviteModal
                        currentUser={currentUser}
                        owner={host}
                        inviteList={inviteListState}
                        onCloseModal={() => setIsExpanded(false)}
                    />,
                    inviteListModal
                )}
        </div>
    );
};

export default InviteListSelector;
