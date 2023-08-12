import { useHuddles } from "@/hooks/useHuddles";
import { twMerge } from "tailwind-merge";
import GoogleMapReact, { Coords } from "google-map-react";
import { useEffect, useState } from "react";

interface MapProps {
    initialCenter?: Coords;
    initialZoom?: number;
    markers?: Coords[];
}

const Map: React.FC<MapProps> = ({
    initialCenter = {
        lat: 34.0522,
        lng: -118.2437,
    },
    initialZoom = 10,
    markers = [],
}) => {
    const { selectedHuddle } = useHuddles();

    return (
        <div
            className={twMerge(
                `h-full w-full bg-neutral-100 border-black overflow-clip`,
                // `absolute -z-20`,
                `relative rounded-[3rem] border-4 `
            )}
        >
            {selectedHuddle && (
                <div className='absolute top-0 bottom-0 left-0 right-0 w-1/2 h-fit m-auto p-2 z-10 bg-black/50 rounded-lg text-white/90'>
                    <p>@{selectedHuddle.author?.username}</p>
                    <p>{selectedHuddle.title}</p>
                    <p>{selectedHuddle.location?.display}</p>
                    <p>{selectedHuddle.start_time.toString()}</p>
                    <p>{selectedHuddle.end_time?.toString()}</p>
                </div>
            )}

            <GoogleMapReact
                bootstrapURLKeys={{
                    key: "AIzaSyDExzFXgONOvnFvnc1N4ahZ8fp-gMy8_vM",
                }}
                defaultCenter={initialCenter}
                defaultZoom={initialZoom}
            ></GoogleMapReact>
        </div>
    );
};

export default Map;
