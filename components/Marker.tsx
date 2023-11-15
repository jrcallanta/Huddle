import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

interface MarkerProps {
    lat?: number;
    lng?: number;
    selected?: boolean;
    authorImgUrl?: any;
    authorInitials: string;
    onClick?: () => void;
}

const Marker: React.FC<MarkerProps> = ({
    lat,
    lng,
    selected,
    authorImgUrl,
    authorInitials,
    onClick,
}) => {
    const DISPLAY_CN =
        "flex justify-center items-center rounded-full bg-black overflow-clip";

    return (
        <AdvancedMarker position={{ lat, lng }} onClick={onClick}>
            <div
                className={twMerge(
                    "flex justify-center items-center w-fit h-fit p-[6px] cursor-pointer bg-black/40 rounded-full z-10",
                    selected && "animate-bounce z-20"
                )}
            >
                {authorImgUrl && (
                    <Image
                        className={DISPLAY_CN}
                        src={authorImgUrl}
                        alt={authorInitials}
                        width={selected ? 28 : 24}
                        height={selected ? 28 : 24}
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
        </AdvancedMarker>
    );
};

export default Marker;
