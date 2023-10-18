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
import { INVITE_STATUS } from "@/app/api/_store/models/invite";

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
    const [isModalDisplayed, setIsModalDisplayed] = useState(false);
    const [inviteListState, setInviteListState] =
        useState<InviteType[]>(inviteList);
    let inviteListModal = document.getElementById("invite-list-modal");

    let going = inviteListState.filter(({ status }) => status === "GOING");

    return (
        <div
            className={twMerge(
                "w-full flex justify-between gap-1 [&_.userAvatar]:bg-[var(--500)]",
                String(className)
            )}
            onClick={
                !isModalDisplayed ? () => setIsModalDisplayed(true) : undefined
            }
        >
            <div className='flex flex-[4] gap-1 p-4'>
                <UserAvatarList
                    inviteList={going.length > 0 ? going : inviteListState}
                    avatarSize='sm'
                    showAll
                    displayLimit={3}
                />
                <div className='flex-1 h-full flex items-center px-2'>
                    <p className='text-xs text-white/50 truncate'>
                        {(() => {
                            let list = going.map((invite) => invite.user?.name);
                            switch (list.length) {
                                case 0:
                                    return (
                                        <>
                                            <span className='font-semibold text-white'>
                                                {inviteListState.length}
                                            </span>
                                            {" invited"}
                                        </>
                                    );
                                case 1:
                                    return (
                                        <>
                                            <span className='font-semibold text-white'>
                                                {list[0]}
                                            </span>
                                            {" is going"}
                                        </>
                                    );
                                case 2:
                                    return (
                                        <>
                                            <span className='font-semibold text-white'>
                                                {list[0]}
                                            </span>
                                            {" and "}
                                            <span className='font-semibold text-white'>
                                                {list[1]}
                                            </span>
                                            {" are going"}
                                        </>
                                    );
                                default:
                                    return (
                                        <>
                                            <span className='font-semibold text-white'>
                                                {list[0]}
                                            </span>
                                            {", "}
                                            <span className='font-semibold text-white'>
                                                {list[1]}
                                            </span>
                                            {", and "}
                                            <span className='font-semibold text-white'>
                                                {`${list.length - 2} more`}
                                            </span>
                                            {" are going."}
                                        </>
                                    );
                            }
                        })()}
                    </p>
                </div>
            </div>

            {isModalDisplayed &&
                inviteListModal &&
                createPortal(
                    <UserInviteModal
                        currentUser={currentUser}
                        owner={host}
                        inviteList={inviteListState}
                        onCloseModal={() => setIsModalDisplayed(false)}
                    />,
                    inviteListModal
                )}
        </div>
    );
};

export default InviteListSelector;
