"use client";

import { LocationType } from "@/types";
import { APIProvider } from "@vis.gl/react-google-maps";
import { createContext, useCallback, useEffect, useState } from "react";

type LocationProviderContextType = {
    states: {
        currentPosition: LocationType | undefined;
    };
};

export const LocationProviderContext = createContext<
    LocationProviderContextType | undefined
>(undefined);

const LocationProvider = (props: { [propName: string]: any }) => {
    const [currentPosition, setCurrentPosition] = useState<
        LocationType | undefined
    >(undefined);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentPosition({
                display: {
                    primary: "Current Location",
                },
                coordinates: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                },
            });
        });
    }, []);

    const providerValues = {
        states: {
            currentPosition,
        },
    };

    return (
        <APIProvider
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            libraries={["maps", "places"]}
        >
            <LocationProviderContext.Provider
                value={providerValues}
                {...props}
            />
        </APIProvider>
    );
};

export default LocationProvider;
