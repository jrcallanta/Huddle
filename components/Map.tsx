import { useHuddles } from "@/hooks/useHuddles";
import { twMerge } from "tailwind-merge";
import GoogleMapReact, { Coords } from "google-map-react";
import { useCurrentPosition } from "@/hooks/useCurrentPosition";

const DEFAULT = {
    center: {
        lat: 34.0522,
        lng: -118.2437,
    },
    zoom: 10,
};

interface MapProps {
    markers?: Coords[];
    children: any;
}

const Map: React.FC<MapProps> = ({ markers = [], children, ...props }) => {
    const currentPosition = useCurrentPosition();
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
                    <p>{selectedHuddle.location?.coordinates.lat}</p>
                    <p>{selectedHuddle.location?.coordinates.lng}</p>
                    <p>{selectedHuddle.start_time.toString()}</p>
                    <p>{selectedHuddle.end_time?.toString()}</p>
                </div>
            )}

            {/* {currentPosition && (
                <div className='absolute top-0 bottom-0 left-0 right-0 w-fit h-fit m-auto p-2 z-10 bg-black/50 rounded-lg text-white/90'>
                    <p>{currentPosition.lat}</p>
                    <p>{currentPosition.lng}</p>
                </div>
            )} */}

            <GoogleMapReact
                bootstrapURLKeys={{
                    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
                }}
                defaultCenter={DEFAULT.center}
                defaultZoom={DEFAULT.zoom}
                center={
                    selectedHuddle?.location?.coordinates || currentPosition
                }
                zoom={selectedHuddle?.location?.coordinates ? 12 : DEFAULT.zoom}
                yesIWantToUseGoogleMapApiInternals
                {...props}
            >
                {children}
            </GoogleMapReact>
        </div>
    );
};

export default Map;
