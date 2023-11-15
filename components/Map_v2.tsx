"use client";

import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import dateFormat from "dateformat";
import { twMerge } from "tailwind-merge";
import React from "react";

import { useHuddles } from "@/hooks/useHuddles";
import { useLocations } from "@/hooks/useLocations";

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
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
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
                            "absolute animate-fade-in top-0 md:top-auto md:bottom-0 left-0 right-0 h-fit py-6 px-8 z-10 bg-black/60 border-b-[4px] md:border-b-0 md:border-t-[4px] border-black text-white/90",
                            "translate-y-0 transition-transform duration-300 ease-in-out",
                            focusedHuddle &&
                                "-translate-y-[100%] md:translate-y-[100%]"
                        )}
                    >
                        <p className='text text-sm mb-2'>
                            @{selectedHuddle.author?.username}
                        </p>
                        <p className='text text-2xl font-semibold -mb-2'>
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
                        <p
                            className='text text-lg inline font-semibold cursor-pointer hover:underline'
                            onClick={() => setFocusedHuddle(selectedHuddle)}
                        >
                            {selectedHuddle.title}
                        </p>
                    </div>
                )}

                <GoogleMap
                    zoom={9}
                    center={
                        selectedHuddle?.location?.coordinates || currentPosition
                    }
                    mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
                    options={{
                        disableDefaultUI: true,
                    }}
                >
                    {children}
                </GoogleMap>
            </div>
        </APIProvider>
    );
};

export default Map;
