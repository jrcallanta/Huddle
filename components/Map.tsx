"use client";

import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import dateFormat from "dateformat";
import { twMerge } from "tailwind-merge";
import React, { useEffect } from "react";

import { useHuddles } from "@/hooks/useHuddles";
import { useLocations } from "@/hooks/useLocations";
import UserAvatar from "./UserAvatar";

interface MapProps {
    children: React.ReactNode;
    className?: String;
}

const Map: React.FC<MapProps> = ({ children, className }) => {
    const {
        states: { currentPosition },
    } = useLocations();

    const {
        states: { selectedHuddle, focusedHuddle },
        funcs: { setFocusedHuddle },
    } = useHuddles();

    return (
        <APIProvider
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            libraries={["maps", "places"]}
        >
            <div
                className={twMerge(
                    "themed h-full w-full bg-[var(--100)] border-black overflow-clip",
                    "relative rounded-none md:rounded-3xl md:border-4",
                    String(className)
                )}
            >
                {selectedHuddle && selectedHuddle.location && (
                    <div
                        className={twMerge(
                            "absolute flex flex-col gap-3 animate-fade-in top-0 md:top-auto md:bottom-0 left-0 right-0 h-fit py-6 px-8 z-10 bg-black/60 border-b-[4px] md:border-b-0 md:border-t-[4px] border-black text-white/90",
                            "translate-y-0 transition-transform duration-300 ease-in-out",
                            focusedHuddle &&
                                "-translate-y-[100%] md:translate-y-[100%]"
                        )}
                    >
                        <p className='text text-sm'>
                            @{selectedHuddle.author?.username}
                        </p>

                        <div className='flex justify-between gap-4'>
                            {/* <UserAvatar
                                username={selectedHuddle.author.username}
                                imgUrl={selectedHuddle.author.imgUrl}
                                // size={"sm"}
                                className={"border-2 border-white self-center"}
                            /> */}
                            <div className='flex flex-col gap-1 flex-1'>
                                <p
                                    className='text text-xl inline font-semibold cursor-pointer hover:underline'
                                    onClick={() =>
                                        setFocusedHuddle(selectedHuddle)
                                    }
                                >
                                    {selectedHuddle.title}
                                </p>
                                <p className='text text-sm'>
                                    <span>
                                        {
                                            selectedHuddle.location.display
                                                .primary
                                        }
                                    </span>
                                    <span>
                                        {
                                            selectedHuddle.location.display
                                                .secondary
                                        }
                                    </span>
                                </p>
                            </div>

                            <p className='text text-2xl font-semibold'>
                                {selectedHuddle.end_time
                                    ? `${dateFormat(
                                          selectedHuddle.start_time,
                                          "h:MMtt"
                                      )} - ${dateFormat(
                                          selectedHuddle.end_time,
                                          "h:MMtt"
                                      )}`
                                    : `${dateFormat(
                                          selectedHuddle.start_time,
                                          "h:MMtt"
                                      )}`}
                            </p>
                        </div>
                    </div>
                )}

                <GoogleMap
                    zoom={selectedHuddle?.location ? 12 : 10}
                    center={
                        selectedHuddle?.location?.coordinates || currentPosition
                    }
                    mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
                    disableDefaultUI
                >
                    {children}
                </GoogleMap>
            </div>
        </APIProvider>
    );
};

export default Map;
