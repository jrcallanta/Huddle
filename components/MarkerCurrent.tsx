import React from "react";
import { twMerge } from "tailwind-merge";

interface MarkerCurrentProps {
    lat?: number;
    lng?: number;
}

const MarkerCurrent: React.FC<MarkerCurrentProps> = () => {
    return (
        <div
            className={twMerge(
                "w-4 h-4 themed bg-violet-500 rounded-full flex-center border-violet-100 border-2",
                "before:content-[''] before:z-[-1] before:absolute before:rounded-full before:w-6 before:h-6 before:bg-violet-400 before:animate-[ping_1.5s_cubic-bezier(0,0,.1,1)_infinite]",
                "after:content-[''] after:z-[-1] after:absolute after:rounded-full after:w-10 after:h-10 after:bg-violet-400 after:animate-[ping_1.5s_cubic-bezier(0,0,.1,1)_infinite]"
            )}
        ></div>
    );
};

export default MarkerCurrent;
