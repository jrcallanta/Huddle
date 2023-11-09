import { useHuddles } from "@/hooks/useHuddles";
import { twMerge } from "tailwind-merge";
import GoogleMapReact, { Coords } from "google-map-react";
import { useLocations } from "@/hooks/useLocations";
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
    className?: string;
}

const Map: React.FC<MapProps> = ({
    markers = [],
    children,
    className,
    ...props
}) => {
    const {
        states: { currentPosition },
    } = useLocations();

    const {
        states: { selectedHuddle, focusedHuddle },
        funcs: { setFocusedHuddle },
    } = useHuddles();

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
                `themed h-full w-full bg-[var(--100)] border-black overflow-clip`,
                // `absolute -z-20`,
                `relative rounded-none md:rounded-3xl md:border-4`,
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

            <GoogleMapReact
                bootstrapURLKeys={{
                    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
                }}
                defaultCenter={DEFAULT.center}
                defaultZoom={DEFAULT.zoom}
                center={
                    selectedHuddle?.location?.coordinates ||
                    (currentPosition as Coords)
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
