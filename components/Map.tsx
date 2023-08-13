import { useHuddles } from "@/hooks/useHuddles";
import { twMerge } from "tailwind-merge";
import GoogleMapReact, { Coords } from "google-map-react";
import { useCurrentPosition } from "@/hooks/useCurrentPosition";
import dateFormat from "dateformat";

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

    const createMapOptions = (maps: {
        ControlPosition: { RIGHT_CENTER: any; TOP_RIGHT: any };
        ZoomControlStyle: { SMALL: any };
    }) => {
        return {
            fullscreenControl: false,
            zoomControlOptions: {
                position: maps.ControlPosition.RIGHT_CENTER,
                style: maps.ZoomControlStyle.SMALL,
            },
        };
    };

    return (
        <div
            className={twMerge(
                `h-full w-full bg-neutral-100 border-black overflow-clip`,
                // `absolute -z-20`,
                `relative rounded-3xl border-4 `
            )}
        >
            {selectedHuddle && (
                <div className='absolute bottom-0 animate-fade-in left-0 right-0  h-fit py-4 px-8 z-10 bg-black/60 border-t-[4px] border-black text-white/90'>
                    <p>@{selectedHuddle.author?.username}</p>
                    <p>{selectedHuddle.title}</p>
                    <p>{selectedHuddle.location?.display}</p>
                    {selectedHuddle.end_time ? (
                        <p>{`${dateFormat(
                            selectedHuddle.start_time,
                            "h:MMtt"
                        )} - ${dateFormat(
                            selectedHuddle.end_time,
                            "h:MMtt"
                        )}`}</p>
                    ) : (
                        <p>{`${dateFormat(
                            selectedHuddle.start_time,
                            "h:MMtt"
                        )}`}</p>
                    )}
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
                options={createMapOptions}
                {...props}
            >
                {children}
            </GoogleMapReact>
        </div>
    );
};

export default Map;
