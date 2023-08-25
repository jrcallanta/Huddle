import { HuddleTypeForTile } from "@/types";
import dateFormat from "dateformat";
import React from "react";
import { twMerge } from "tailwind-merge";
import { BsX } from "react-icons/bs";

interface DetailsModalProps {
    huddle: HuddleTypeForTile | null;
    onClose?: any;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ huddle, onClose }) => {
    return (
        <div
            className={twMerge(
                "themed",
                "absolute top-0 min-h-[calc(100%-4rem)] left-0 right-0 m-8 rounded-3xl flex flex-col justify-center p-4",
                "bg-[var(--400)] border-4 border-[var(--500)] shadow-xl",
                (!huddle?.invite_status || huddle?.invite_status === "GOING") &&
                    "bg-[var(--500)] border-4 border-[var(--700)]",
                "translate-y-0 transition-transform duration-300 ease-in-out",
                !huddle && "translate-y-[calc(100%_+_2rem)]"
            )}
        >
            {huddle && (
                <>
                    <p className='text text-white text-sm'>
                        @{huddle.author?.username}
                    </p>
                    <p className='text text-white text-lg font-semibold'>
                        {huddle.title}
                    </p>
                    <p className='text text-white text-2xl font-semibold -mb-2'>
                        {huddle.end_time
                            ? `${dateFormat(
                                  huddle.start_time,
                                  "h:MMtt"
                              )} - ${dateFormat(huddle.end_time, "h:MMtt")}`
                            : `${dateFormat(huddle.start_time, "h:MMtt")}`}
                    </p>
                </>
            )}

            <button
                className={
                    "absolute left-2 top-2 flex justify-center items-center"
                }
                onClick={onClose}
            >
                <BsX
                    size={32}
                    strokeWidth={".5px"}
                    className={twMerge(
                        "stroke-[var(--500)] fill-[var(--500)] hover:fill-white hover:stroke-white",
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
