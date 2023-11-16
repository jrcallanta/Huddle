"use client";

import { LocationType } from "@/types";
import { createContext, useCallback, useEffect, useState } from "react";

type CurrentPosition =
    | {
          lat: number;
          lng: number;
      }
    | undefined;

type LocationProviderContextType = {
    states: {
        currentPosition: CurrentPosition | null;
    };
};

export const LocationProviderContext = createContext<
    LocationProviderContextType | undefined
>(undefined);

const LocationProvider = (props: { [propName: string]: any }) => {
    const [currentPosition, setCurrentPosition] = useState<
        CurrentPosition | undefined
    >(undefined);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentPosition({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        });
    }, []);

    const providerValues = {
        states: {
            currentPosition,
        },
    };

    return (
        <LocationProviderContext.Provider value={providerValues} {...props} />
    );
};

export default LocationProvider;
