"use client";

import { HuddleType } from "@/types";
import { useState } from "react";
import HuddleTile from "./HuddleTile";
import { twMerge } from "tailwind-merge";
import { PiCaretDownBold } from "react-icons/pi";
import { useHuddles } from "@/hooks/useHuddles";

interface HuddleSectionProps {
    title: String;
    huddles: HuddleType[];
    emptyNote?: String;
    className?: String;
}

const HuddleSection: React.FC<HuddleSectionProps> = ({
    title,
    huddles,
    emptyNote,
    className,
}) => {
    const { setSelectedHuddle } = useHuddles();
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpanded: React.MouseEventHandler = () => {
        setSelectedHuddle(null);
        setIsExpanded((prev) => !prev);
    };

    return (
        <div
            className={twMerge(
                "relative flex flex-col [&:last-of-type_.divider]:hidden",
                String(className)
            )}
        >
            <div className='flex items-center'>
                <p className='text text-sm uppercase font-extrabold whitespace-nowrap py-1 px-4 border-[3px] border-black rounded-full'>
                    {title}
                </p>
                <hr className='flex-grow h-[4px] bg-black' />
                <button
                    className={twMerge(
                        "h-8 w-8 border-[3px] border-black rounded-full flex justify-center items-center",
                        isExpanded && "rotate-90"
                    )}
                    onClick={toggleExpanded}
                >
                    <PiCaretDownBold size={20} color='black' strokeWidth={6} />
                </button>
            </div>

            {isExpanded && (
                <div className={twMerge("flex flex-col gap-8 py-3 pr-2 pt-8")}>
                    {!huddles.length && (
                        <div className='w-full'>
                            <p className='text text-sm text-center font-medium'>
                                {emptyNote}
                            </p>
                        </div>
                    )}
                    {huddles.map((huddle, j) => (
                        <HuddleTile
                            key={huddle._id}
                            huddle={{
                                ...huddle,
                            }}
                            // className={"animate-fade-in"}
                            // style={{ animationDelay: `${j * 0.05}s` }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HuddleSection;
