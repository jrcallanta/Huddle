import { HuddleTypeForTile } from "@/types";
import dateFormat from "dateformat";
import React from "react";
import { twMerge } from "tailwind-merge";
import { BsX } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import AvatarList from "./AvatarList";

interface DetailsModalProps {
    huddle: HuddleTypeForTile | null;
    onClose?: any;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ huddle, onClose }) => {
    return (
        <div
            className={twMerge(
                "themed",
                "absolute overflow-clip top-0 min-h-[calc(100%-4rem)] left-0 right-0 m-8 mr-4 md:mr-8 rounded-3xl flex flex-col",
                !huddle?.invite_status || huddle?.invite_status === "GOING"
                    ? "bg-[var(--600)] border-4 border-[var(--700)] [&_.section]:bg-[var(--500)]"
                    : "bg-[var(--500)] border-4 border-[var(--600)] [&_.section]:bg-[var(--400)]",
                "[&_>_.section]:border-b-2 [&_>_.section]:border-inherit [&_>_.section]:transition-colors",
                "translate-y-0 transition-all duration-300 ease-in-out",
                !huddle && "translate-y-[calc(100%_+_2rem)]"
            )}
        >
            {huddle && (
                <>
                    <div className='section border-none w-full flex justify-center items-center p-4 gap-2'>
                        <p className='text text-sm text-center text-white/75 hover:text-white font-medium cursor-pointer'>{`@${huddle.author.username}`}</p>
                    </div>

                    <div id='header' className='section flex flex-col p-4'>
                        <div id='header-title' className='w-full flex'>
                            <p className='text text-2xl text-white font-bold pb-6'>
                                {huddle.title}
                            </p>
                        </div>
                        <div
                            id='header-time'
                            className='w-full flex justify-stretch'
                        >
                            <div className='w-full flex'>
                                <div className='w-full flex items-baseline gap-4'>
                                    <p className='text text-sm font-bold text-white/50'>
                                        from
                                    </p>
                                    <p className='text text-xl font-bold text-white w-full'>
                                        {dateFormat(
                                            huddle.start_time,
                                            "h:MMtt"
                                        )}
                                    </p>
                                </div>
                                <div className='w-full flex items-baseline gap-4'>
                                    <p className='text text-sm font-bold text-white/50'>
                                        to
                                    </p>
                                    <p className='text text-xl font-bold text-white w-full'>
                                        {huddle.end_time
                                            ? dateFormat(
                                                  huddle.end_time,
                                                  "h:MMtt"
                                              )
                                            : "?"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {huddle.location && (
                        <div className='section flex flex-col p-4 cursor-pointer [&.section:hover]:brightness-[1.1] transition-all'>
                            <a
                                href=''
                                target={"_blank"}
                                onClick={(e) => e.stopPropagation()}
                                className='location w-fit flex gap-1 items-center  [&_>_svg_path]:stroke-white/80 [&:hover_>_svg_path]:stroke-white [&:hover_>_p]:text-white'
                            >
                                <GrLocation size={24} />
                                <p className='text-white/80 text-sm font-medium'>
                                    {huddle.location.display}
                                </p>
                            </a>
                        </div>
                    )}

                    {huddle.invite_list && (
                        <div className='section flex flex-col p-4 cursor-pointer [&.section:hover]:brightness-[1.1] transition-all'>
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
                        </div>
                    )}
                </>
            )}

            <button
                className={
                    "absolute left-2 top-3 flex justify-center items-center"
                }
                onClick={onClose}
            >
                <BsX
                    size={32}
                    strokeWidth={".5px"}
                    className={twMerge(
                        "stroke-[var(--700)] fill-[var(--700)] hover:fill-white hover:stroke-white",
                        (!huddle?.invite_status ||
                            huddle?.invite_status === "GOING") &&
                            "stroke-[var(--700)] fill-[var(--700)]"
                    )}
                />
            </button>
        </div>
    );
};

export default DetailsModal;
