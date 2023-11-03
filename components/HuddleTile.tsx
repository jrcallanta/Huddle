"use client";

import dateFormat from "dateformat";
import { HuddleType, HuddleTypeForTile } from "@/types";
import { CSSProperties, MouseEventHandler, useState } from "react";
import { twMerge } from "tailwind-merge";
import { GrLocation } from "react-icons/gr";
import { useHuddles } from "@/hooks/useHuddles";
import { useUser } from "@/hooks/useUser";
import DetailsModal from "./DetailsModal";
import ActionsBar from "./ActionsBar";
import UserAvatar from "./UserAvatar";
import UserAvatarList from "./UserAvatarList";

interface HuddleTileProps {
    huddle: HuddleTypeForTile;
    className?: String;
    style?: CSSProperties;
}

const HuddleTile: React.FC<HuddleTileProps> = ({
    huddle,
    className,
    style,
}) => {
    const { currentUser } = useUser();
    const {
        states: { selectedHuddle, focusedHuddle },
        funcs: {
            setSelectedHuddle,
            setFocusedHuddle,
            refreshHuddles,
            respondToInvite,
        },
    } = useHuddles();

    const [huddleInviteStatusState, setHuddleInviteStatusState] = useState(
        huddle.invite_status
    );
    const [isUpdatingInviteStatus, setIsUpdatingInviteStatus] = useState(false);
    const [isInEditingMode, setIsInEditingMode] = useState(false);

    const handleClick: MouseEventHandler = (event) => {
        setSelectedHuddle(selectedHuddle?._id === huddle._id ? null : huddle);
    };

    const handleRespondInvite = async (event: any, respond: string) => {
        event.stopPropagation();
        if (huddle._id) {
            setHuddleInviteStatusState(respond);
            setIsUpdatingInviteStatus(true);
            await respondToInvite(
                {
                    huddleId: huddle._id,
                    response: respond,
                },
                async (data: any) => {
                    if (data.updatedInvite) {
                        await refreshHuddles();
                        setIsUpdatingInviteStatus(false);
                    } else {
                        setTimeout(() => {
                            setHuddleInviteStatusState(huddle.invite_status);
                            setIsUpdatingInviteStatus(false);
                        }, 500);
                    }
                }
            );
        }
    };

    const handleToggleAcceptInvite = (event: any) =>
        handleRespondInvite(
            event,
            huddleInviteStatusState !== "GOING" ? "GOING" : "PENDING"
        );

    const handleToggleDeclineInvite = (event: any) =>
        handleRespondInvite(
            event,
            huddleInviteStatusState !== "NOT_GOING" ? "NOT_GOING" : "PENDING"
        );

    const handleViewDetailsModal = (event: any) => {
        event.stopPropagation();
        if (selectedHuddle) setFocusedHuddle(selectedHuddle);
    };

    const handleEditDetails = async (event: any) => {
        event.stopPropagation();
        if (selectedHuddle) {
            setFocusedHuddle(selectedHuddle);
            setIsInEditingMode(true);
        }
    };

    const handleCloseDetailsModal = (event: any) => {
        event.stopPropagation();
        setIsInEditingMode(false);
        setFocusedHuddle(null);
    };

    return (
        <div
            data-variant={huddleInviteStatusState}
            data-expanded={huddle._id === selectedHuddle?._id}
            className={twMerge(
                !huddleInviteStatusState || huddleInviteStatusState === "GOING"
                    ? "themed-darker"
                    : "themed",
                "huddleTile relative w-full rounded-xl transition-all duration-250 group/huddle",
                "bg-[var(--500)] [&_>_*]:border-[var(--500)] [&_>_:first-child]:bg-[var(--400)]",

                String(className)
            )}
            style={style}
            onClick={handleClick}
        >
            <div
                className={twMerge(
                    `
                    content absolute peer group h-full  w-full flex flex-col gap-4 -top-2 left-2
                    transition-all duration-250
                    overflow-hidden border-4 rounded-xl
                    hover:-top-3 hover:left-3 [&:active:not(:has(button:active))]:top-0 [&:active:not(:has(button:active))]:left-0
                    `
                )}
            >
                <div className='pt-4 px-4 w-full flex flex-col gap-2 md:flex-row md:gap-4 '>
                    <div className='w-full overflow-hidden text-white font-semibold'>
                        <p className='text-md truncate'>{huddle.title}</p>
                    </div>
                    <div className='flex-1 text-xl font-extrabold whitespace-nowrap text-white/80 group-hover:text-white transition'>
                        {huddle.end_time ? (
                            <p>{`${dateFormat(
                                huddle.start_time,
                                "h:MMtt"
                            )} - ${dateFormat(huddle.end_time, "h:MMtt")}`}</p>
                        ) : (
                            <p>{`${dateFormat(
                                huddle.start_time,
                                "h:MMtt"
                            )}`}</p>
                        )}
                    </div>
                </div>

                {huddle.invite_list && (
                    <div className='flex items-center gap-1 px-4'>
                        <UserAvatar
                            username={huddle.author.username}
                            imgUrl={huddle.author.imgUrl}
                            size='sm'
                            className='border-2 border-white'
                        />
                        <UserAvatarList inviteList={huddle.invite_list} />
                    </div>
                )}

                {huddle._id === selectedHuddle?._id && (
                    <div className='w-full h-full flex flex-col gap-2 relative'>
                        {huddle.location && (
                            <a
                                href=''
                                target={"_blank"}
                                onClick={(e) => e.stopPropagation()}
                                className='location px-4 w-fit flex gap-1 items-center  [&_>_svg_path]:stroke-white/80 [&:hover_>_svg_path]:stroke-white [&:hover_>_p]:text-white'
                            >
                                <GrLocation size={24} />
                                <p className='text-white/80 text-sm font-medium'>
                                    {huddle.location.display}
                                </p>
                            </a>
                        )}

                        {/* DESCRIPTION BOX */}
                        {/* <div
                            className={twMerge(
                                "description h-full rounded-lg",
                                "p-2 hover:bg-black hover:bg-opacity-[.1] transition-all"
                            )}
                        ></div> */}

                        {huddleInviteStatusState && (
                            <ActionsBar
                                interactions={"invite"}
                                onView={handleViewDetailsModal}
                                onAccept={handleToggleAcceptInvite}
                                isAccepted={huddleInviteStatusState === "GOING"}
                                onDecline={handleToggleDeclineInvite}
                                isDeclined={
                                    huddleInviteStatusState === "NOT_GOING"
                                }
                            />
                        )}

                        {!huddleInviteStatusState && !isInEditingMode && (
                            <ActionsBar
                                interactions='owner'
                                onView={handleViewDetailsModal}
                                onEdit={handleEditDetails}
                            />
                        )}
                    </div>
                )}
            </div>

            {(huddle.invite_status === "PENDING" || isUpdatingInviteStatus) && (
                <p
                    className={twMerge(
                        "status",
                        "absolute py-1 px-2",
                        "rounded-lg bg-[var(--500)]",
                        "text-white/75 text-xs font-semibold",
                        "-top-4 left-5",
                        "peer-hover:-top-5",
                        "peer-hover:left-6",
                        "peer-[:active:not(:has(button:active))]:-top-2",
                        "peer-[:active:not(:has(button:active))]:left-3",
                        "transition-all"
                    )}
                >
                    {isUpdatingInviteStatus ? "UPDATING..." : "PENDING"}
                </p>
            )}

            {(focusedHuddle as HuddleType)?._id === huddle._id && (
                <DetailsModal
                    huddle={huddle}
                    isInEditingMode={isInEditingMode}
                    onClose={handleCloseDetailsModal}
                />
            )}
        </div>
    );
};

export default HuddleTile;
