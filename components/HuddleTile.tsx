"use client";

import dateFormat from "dateformat";
import { HuddleTypeForTile } from "@/types";
import { CSSProperties, MouseEventHandler, useState } from "react";
import { twMerge } from "tailwind-merge";
import { GrLocation } from "react-icons/gr";
import { useHuddles } from "@/hooks/useHuddles";
import AvatarList from "./AvatarList";
import { useUser } from "@/hooks/useUser";
import { BsCheck, BsX, BsPencilFill } from "react-icons/bs";
import { CgNotes } from "react-icons/cg";
import ActionButton from "./ActionButton";

interface HuddleTileProps {
    huddle: HuddleTypeForTile;
    className?: String;
    style?: CSSProperties;
}

let StatusIndicator: { [key: string]: string } = {
    GOING: "ACCEPTED",
    NOT_GOING: "DECLINED",
    PENDING: "PENDING",
};

const HuddleTile: React.FC<HuddleTileProps> = ({
    huddle,
    className,
    style,
}) => {
    const { currentUser } = useUser();
    const {
        states: { selectedHuddle },
        funcs: { setSelectedHuddle, setFocusedHuddle, refreshHuddles },
    } = useHuddles();

    const [huddleVariant, setHuddleVariant] = useState(huddle.invite_status);
    const [isShowingOptions, setIsShowingOptions] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    // const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const handleClick: MouseEventHandler = (event) => {
        if (selectedHuddle?._id === huddle._id) {
            // setIsExpanded(false);
            setSelectedHuddle(null);
        } else {
            // setIsExpanded(true);
            setSelectedHuddle(huddle);
        }
        setFocusedHuddle(null);
    };

    const handleRespondInvite = async (event: any, respond: string) => {
        event.stopPropagation();
        setHuddleVariant(respond);
        setIsUpdating(true);

        await fetch("/api/invite", {
            method: "PATCH",
            body: JSON.stringify({
                userId: currentUser?._id,
                huddleId: huddle._id,
                status: respond,
            }),
        })
            .then((res) => res.json())
            .then(async (data) => {
                if (data.updatedInvite) {
                    await refreshHuddles();
                    setIsShowingOptions(false);
                    setIsUpdating(false);
                } else {
                    setTimeout(() => {
                        setHuddleVariant(huddle.invite_status);
                        setIsShowingOptions(false);
                        setIsUpdating(false);
                    }, 500);
                }
            });
    };

    const handleViewDetails = (event: any) => {
        event.stopPropagation();
        if (selectedHuddle) setFocusedHuddle(selectedHuddle);
    };

    return (
        <div
            data-variant={huddleVariant}
            data-expanded={huddle._id === selectedHuddle?._id}
            // data-selected={huddle._id === selectedHuddle?._id}
            className={twMerge(
                `
                huddleTile
                relative
                bg-[var(--500)]
                w-full
                rounded-xl
                transition-all
                duration-250
                group/huddle
                `,
                String(className)
            )}
            style={style}
            onClick={handleClick}
            // onMouseLeave={() => setSelectedHuddle(null)}
        >
            <div
                className={twMerge(
                    `
                    content
                    absolute
                    peer
                    group
                    h-full 
                    w-full
                    flex
                    flex-col
                    gap-4
                    border-4
                    rounded-xl
                    -top-2
                    left-2
                    transition-all
                    duration-250
                    overflow-hidden
                    hover:-top-3
                    hover:left-3
                    [&:active:not(:has(.options_button:active))]:top-0
                    [&:active:not(:has(.options_button:active))]:left-0
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
                    <AvatarList
                        inviteList={[
                            {
                                status: "GOING",
                                user: huddle.author,
                                huddle_id: huddle._id,
                                created_at: huddle.created_at,
                            },
                            ...huddle.invite_list,
                        ]}
                        className={"px-4"}
                    />
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

                        <div className='empty:hidden border-t-2 border-t-[var(--500)] last:mt-auto options w-full flex justify-around md:justify-between '>
                            <ActionButton
                                className={twMerge(
                                    "w-full rounded-none border-r-2 border-solid border-r-[var(--500)] last:border-r-0 group/button"
                                )}
                                icon={
                                    <div className='w-7 h-7 md:w-6 md:h-6 flex justify-center items-center'>
                                        <CgNotes
                                            size={18}
                                            strokeWidth={".5px"}
                                            className='stroke-[var(--500)] [&_path]:fill-[var(--500)] group-hover/button:[&_path]:fill-white group-hover/button:stroke-white'
                                        />
                                    </div>
                                }
                                text='Details'
                                onClick={handleViewDetails}
                            />

                            {/* Displayed if creater is the author */}
                            {!huddleVariant && (
                                <ActionButton
                                    className={twMerge(
                                        "w-full rounded-none border-r-2 border-solid border-r-[var(--500)] last:border-r-0 group/button"
                                    )}
                                    icon={
                                        <div className='w-7 h-7 md:w-6 md:h-6 flex justify-center items-center'>
                                            <BsPencilFill
                                                size={16}
                                                className='fill-[var(--500)] group-hover/button:fill-white'
                                            />
                                        </div>
                                    }
                                    text='Edit'
                                    onClick={() => {}}
                                />
                            )}

                            {huddleVariant && (
                                <>
                                    <ActionButton
                                        className={twMerge(
                                            "w-full rounded-none border-r-2 border-solid border-r-[var(--500)] last:border-r-0 group/button",
                                            huddleVariant === "GOING" &&
                                                "[&_>_*]:text-white"
                                        )}
                                        icon={
                                            <div
                                                className={twMerge(
                                                    "w-7 h-7 md:w-6 md:h-6 rounded-full flex justify-center items-center border-[var(--500)] group-hover/button:border-white ",
                                                    huddleVariant === "GOING" &&
                                                        "bg-white border-white"
                                                )}
                                            >
                                                <BsCheck
                                                    size={26}
                                                    strokeWidth={"0px"}
                                                    className={twMerge(
                                                        "fill-[var(--500)]",
                                                        huddleVariant !==
                                                            "GOING" &&
                                                            "group-hover/button:fill-white",
                                                        huddleVariant ===
                                                            "GOING" &&
                                                            "fill-[var(--300)]"
                                                    )}
                                                />
                                            </div>
                                        }
                                        text='Accept'
                                        onClick={(e) =>
                                            handleRespondInvite(
                                                e,
                                                huddleVariant !== "GOING"
                                                    ? "GOING"
                                                    : "PENDING"
                                            )
                                        }
                                    />

                                    <ActionButton
                                        className={twMerge(
                                            "w-full border-r-2 border-solid border-r-[var(--500)] last:border-r-0 rounded-none group/button",
                                            huddleVariant === "NOT_GOING" &&
                                                "[&_>_*]:text-white"
                                        )}
                                        icon={
                                            <div
                                                className={twMerge(
                                                    "w-7 h-7 md:w-6 md:h-6 rounded-full flex justify-center items-center border-[var(--500)] group-hover/button:border-white ",
                                                    huddleVariant ===
                                                        "NOT_GOING" &&
                                                        "bg-white border-white"
                                                )}
                                            >
                                                <BsX
                                                    size={26}
                                                    strokeWidth={".2px"}
                                                    className={twMerge(
                                                        "fill-[var(--500)] stroke-[var(--500)]",
                                                        huddleVariant !==
                                                            "NOT_GOING" &&
                                                            "group-hover/button:fill-white group-hover/button:stroke-white ",
                                                        huddleVariant ===
                                                            "NOT_GOING" &&
                                                            "fill-[var(--300)]"
                                                    )}
                                                />
                                            </div>
                                        }
                                        text='Decline'
                                        onClick={(e) =>
                                            handleRespondInvite(
                                                e,
                                                huddleVariant !== "NOT_GOING"
                                                    ? "NOT_GOING"
                                                    : "PENDING"
                                            )
                                        }
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {huddle.invite_status === "PENDING" && (
                <p
                    className='
                    status
                    absolute
                    py-1
                    px-2
                    rounded-lg
                    bg-[var(--500)]
                    text-white/75
                    text-xs
                    font-semibold
                    z-10
                    -top-4
                    left-5
                    peer-hover:-top-5
                    peer-hover:left-6
                    peer-[:active:not(:has(button:active))]:-top-2
                    peer-[:active:not(:has(button:active))]:left-3
                    transition-all
                    '
                >
                    {isUpdating
                        ? "UPDATING..."
                        : StatusIndicator[huddle.invite_status]}
                </p>
            )}
        </div>
    );
};

export default HuddleTile;
