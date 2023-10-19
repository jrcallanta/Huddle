import React from "react";
import { BsPencilFill, BsCheck, BsX } from "react-icons/bs";
import { CgNotes } from "react-icons/cg";
import { twMerge } from "tailwind-merge";
import ActionButton from "./ActionButton";

export interface HuddleInviteResponseActions {
    onToggleAccept: (e: any) => Promise<void>;
    onToggleDecline: (e: any) => Promise<void>;
}

export interface HuddleEditActions {
    onEditDetails?: (args: any) => Promise<any>;
    onSaveChanges?: (args: any) => Promise<any>;
    onDiscardChanges?: (args: any) => Promise<any>;
    preventDiscard?: boolean;
}

interface ActionsBarProps {
    inviteStatus: string | undefined;
    onViewDetails?: (e: any) => void;
    huddleInviteResponseActions?: HuddleInviteResponseActions;
    huddleEditActions?: HuddleEditActions;
    className?: string;
}

const ActionsBar: React.FC<ActionsBarProps> = ({
    inviteStatus: huddleVariant,
    onViewDetails,
    huddleInviteResponseActions,
    huddleEditActions,
    className,
}) => {
    return (
        <div
            className={twMerge(
                "empty:hidden border-t-2 border-t-[var(--500)] last:mt-auto options w-full flex justify-around md:justify-between",
                String(className)
            )}
        >
            {onViewDetails && (
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
                    onClick={onViewDetails}
                />
            )}

            {huddleEditActions && (
                <>
                    {huddleEditActions.onEditDetails ? (
                        <>
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
                                onClick={huddleEditActions.onEditDetails}
                            />
                        </>
                    ) : (
                        <>
                            <ActionButton
                                className={twMerge(
                                    " w-full h-10 rounded-none border-r-2 border-solid border-r-[var(--500)] last:border-r-0 group/button"
                                )}
                                text='Save Changes'
                                type='submit'
                            />

                            {huddleEditActions.onDiscardChanges && (
                                <ActionButton
                                    className={twMerge(
                                        "bg-red-300 hover:!bg-red-400 w-full h-10 rounded-none border-r-2 border-solid border-r-[var(--500)] last:border-r-0 group/button"
                                    )}
                                    text='Cancel'
                                    onClick={huddleEditActions.onDiscardChanges}
                                />
                            )}
                        </>
                    )}
                </>
            )}

            {huddleInviteResponseActions && (
                <>
                    <ActionButton
                        className={twMerge(
                            "w-full rounded-none border-r-2 border-solid border-r-[var(--500)] last:border-r-0 group/button",
                            huddleVariant === "GOING" && "[&_>_*]:text-white"
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
                                        huddleVariant !== "GOING" &&
                                            "group-hover/button:fill-white",
                                        huddleVariant === "GOING" &&
                                            "fill-[var(--300)]"
                                    )}
                                />
                            </div>
                        }
                        text='Accept'
                        onClick={huddleInviteResponseActions.onToggleAccept}
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
                                    huddleVariant === "NOT_GOING" &&
                                        "bg-white border-white"
                                )}
                            >
                                <BsX
                                    size={26}
                                    strokeWidth={".2px"}
                                    className={twMerge(
                                        "fill-[var(--500)] stroke-[var(--500)]",
                                        huddleVariant !== "NOT_GOING" &&
                                            "group-hover/button:fill-white group-hover/button:stroke-white ",
                                        huddleVariant === "NOT_GOING" &&
                                            "fill-[var(--300)]"
                                    )}
                                />
                            </div>
                        }
                        text='Decline'
                        onClick={huddleInviteResponseActions.onToggleDecline}
                    />
                </>
            )}
        </div>
    );
};

export default ActionsBar;
