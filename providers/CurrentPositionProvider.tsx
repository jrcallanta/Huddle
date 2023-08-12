"use client";

import { Coords } from "google-map-react";
import { createContext, useEffect, useState } from "react";

type CurrentPosition =
    | {
          lat: number;
          lng: number;
      }
    | Coords
    | undefined;

export const CurrentPositionContext = createContext<
    CurrentPosition | undefined
>(undefined);

const CurrentPositionProvider = (props: { [propName: string]: any }) => {
    const [currentPosition, setCurrentPosition] =
        useState<CurrentPosition>(undefined);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentPosition({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        });
    }, []);

    const value = currentPosition;

    return <CurrentPositionContext.Provider value={value} {...props} />;
};

export default CurrentPositionProvider;
