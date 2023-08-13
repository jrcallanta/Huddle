import React from "react";
import Image from "next/image";
import { TiLocation } from "react-icons/ti";
import { twMerge } from "tailwind-merge";

interface MarkerProps {
    lat?: number;
    lng?: number;
    selected?: boolean;
    authorImgUrl?: any;
    authorInitials: string;
    onClick?: () => void;
}

const Marker: React.FC<MarkerProps> = ({
    selected,
    authorImgUrl,
    authorInitials,
    onClick,
}) => {
    const DISPLAY_CN =
        "flex justify-center items-center rounded-full bg-black overflow-clip";

    return (
        <div
            className={twMerge(
                "flex justify-center items-center w-fit h-fit p-[6px] cursor-pointer bg-black/40 rounded-full z-10",
                selected && "animate-bounce z-30"
            )}
            onClick={onClick}
        >
            {authorImgUrl && (
                <Image
                    className={DISPLAY_CN}
                    src={authorImgUrl}
                    alt={authorInitials}
                    width={selected ? 32 : 24}
                    height={selected ? 32 : 24}
                />
            )}

            {!authorImgUrl && (
                <div
                    className={twMerge(
                        DISPLAY_CN,
                        selected ? "w-8 h-8" : "w-6 h-6"
                    )}
                >
                    <p
                        className={twMerge(
                            "text-center font-semibold text-white",
                            selected && "text-lg"
                        )}
                    >
                        {authorInitials}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Marker;
