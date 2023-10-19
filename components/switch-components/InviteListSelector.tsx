"use client";

import { HuddleTypeForTile, UserType } from "@/types";
import React, { useState } from "react";
import UserAvatarList from "../UserAvatarList";
import { twMerge } from "tailwind-merge";
import { createPortal } from "react-dom";
import UserInviteModal from "../UserInviteModal";

interface InviteListSelectorProps {
    currentUser?: UserType;
    huddle: HuddleTypeForTile;
    className?: string;
}

const InviteListSelector: React.FC<InviteListSelectorProps> = ({
    currentUser,
    huddle,
    className,
}) => {
    const { invite_list: inviteList } = huddle;

    const [isModalDisplayed, setIsModalDisplayed] = useState(false);
    let inviteListModal = document.getElementById("invite-list-modal");

    let going = inviteList?.filter(({ status }) => status === "GOING");

    return !(inviteList && going) ? null : (
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
                    inviteList={going.length > 0 ? going : inviteList}
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
                                                {inviteList.length}
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
                        huddle={huddle}
                        onCloseModal={() => setIsModalDisplayed(false)}
                    />,
                    inviteListModal
                )}
        </div>
    );
};

export default InviteListSelector;
