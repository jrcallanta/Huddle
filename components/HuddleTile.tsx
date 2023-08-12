"use client";

import dateFormat from "dateformat";
import { HuddleTypeForTile } from "@/types";
import { CSSProperties, MouseEventHandler, useState } from "react";
import { twMerge } from "tailwind-merge";
import { GrLocation } from "react-icons/gr";
import { useHuddles } from "@/hooks/useHuddles";
import AvatarList from "./AvatarList";
import { useUser } from "@/hooks/useUser";
import { BsCheckCircle, BsXCircle, BsPencilFill } from "react-icons/bs";
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
    const { selectedHuddle, setSelectedHuddle, refreshHuddles } = useHuddles();
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

    const handleCancelPlans = (event: any) => {
        event.stopPropagation();
        console.log("cancel plans");
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
                `,
                String(className)
            )}
            style={style}
            onClick={handleClick}
            // onMouseLeave={() => setSelectedHuddle(null)}
        >
            <div
                className='
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
                p-4
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
                '
            >
                <div className='w-full flex flex-col gap-2 md:flex-row md:gap-4'>
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
                    />
                )}

                {huddle._id === selectedHuddle?._id && (
                    <div className='w-full h-full flex flex-col gap-4 relative'>
                        {huddle.location && (
                            <a
                                href=''
                                target={"_blank"}
                                onClick={(e) => e.stopPropagation()}
                                className='w-fit flex gap-1 items-center  [&_>_svg_path]:stroke-white/80 [&:hover_>_svg_path]:stroke-white [&:hover_>_p]:text-white'
                            >
                                <GrLocation size={24} />
                                <p className='text-white/80 text-sm font-medium'>
                                    {huddle.location}
                                </p>
                            </a>
                        )}

                        <div className='h-full'></div>

                        <div className='options w-full right-0 bottom-0 flex gap-2'>
                            {/* Displayed if creater is the author */}
                            {!huddleVariant && (
                                <>
                                    <ActionButton
                                        className={twMerge(
                                            "px-3 ml-auto [&_svg_path]:transition [&_svg_path]:fill-[var(--500)] [&:hover_svg_path]:fill-white group/button"
                                        )}
                                        icon={
                                            <div className='w-7 h-7 transition rounded-full border-[2px] border-[var(--500)] group-hover/button:border-white flex justify-center items-center'>
                                                <BsPencilFill
                                                    size={15}
                                                    className='fill-[var(--500)] group-hover/button:fill-white'
                                                />
                                            </div>
                                        }
                                        text='Edit'
                                        onClick={() => {}}
                                    />
                                </>
                            )}

                            {/* Displayed if creater is not the author */}
                            {huddleVariant && (
                                <>
                                    <ActionButton
                                        className={twMerge(
                                            "ml-auto [&_*]:transition [&_>_svg_path]:fill-[var(--500)] [&_>_svg_path]:stroke-[var(--500)] [&:hover_>_svg_path]:fill-white [&:hover_>_svg_path]:stroke-white",
                                            huddleVariant === "GOING" &&
                                                "[&_>_*]:text-white [&_>_svg_path]:fill-white [&_>_svg_path]:stroke-white"
                                        )}
                                        icon={
                                            <BsCheckCircle
                                                size={28}
                                                strokeWidth={".2px"}
                                            />
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
                                            "[&_*]:transition [&_>_svg_path]:fill-[var(--500)] [&_>_svg_path]:stroke-[var(--500)] [&:hover_>_svg_path]:fill-white [&:hover_>_svg_path]:stroke-white",
                                            huddleVariant === "NOT_GOING" &&
                                                "[&_>_*]:text-white [&_>_svg_path]:fill-white [&_>_svg_path]:stroke-white"
                                        )}
                                        icon={
                                            <BsXCircle
                                                size={28}
                                                strokeWidth={".2px"}
                                            />
                                        }
                                        text='Decline'
                                        onClick={(e) =>
                                            handleRespondInvite(
                                                e,
                                                huddle.invite_status !==
                                                    "NOT_GOING"
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
