"use client";

import { LocationType } from "@/types";
import { Coords } from "google-map-react";
import { createContext, useEffect, useState } from "react";

type CurrentPosition =
    | {
          lat: number;
          lng: number;
      }
    | undefined;

type PrevQueries = {
    [key: string]: {
        results: LocationType[];
        exp?: number;
    };
};

type LocationProviderContextType = {
    states: {
        currentPosition: CurrentPosition | null;
        queryResults: LocationType[] | null;
        queryHistory: PrevQueries | null;
    };
    funcs: {
        searchLocation: (query: string, callback?: any) => Promise<any> | any;
    };
};

export const LocationProviderContext = createContext<
    LocationProviderContextType | undefined
>(undefined);

const LocationProvider = (props: { [propName: string]: any }) => {
    const [currentPosition, setCurrentPosition] = useState<
        CurrentPosition | undefined
    >(undefined);
    const [queryResults, setQueryResults] = useState<LocationType[] | null>(
        null
    );
    const [queryHistory, setQueryHistory] = useState<PrevQueries>({});

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentPosition({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        });
    }, []);

    /***
     * Function used to search locations based
     * on given query. History used to limit
     * unecessary repetitive requests.
     *
     */
    const searchLocation: Promise<any> | any = (
        query: string,
        callback?: any
    ) => {
        setQueryResults(null);

        // If recently searched, used recent results
        if (
            queryHistory[query.trim()] &&
            (queryHistory[query.trim()].exp === undefined ||
                Date.now() - Number(queryHistory[query.trim()].exp) < 15000)
        ) {
            setQueryResults(queryHistory[query.trim()].results);
            callback({
                message: "recent search",
                query: query.trim(),
                results: queryHistory[query.trim()].results,
            });
        }

        // Send New Reques
        else {
            // if ([0, 1][Math.floor(Math.random() * 2)]) {
            // SIMULATING RESULTS
            let results = [
                {
                    coordinates: { lat: Math.random(), lng: Math.random() },
                    display: Math.random().toString(),
                },
                {
                    coordinates: { lat: Math.random(), lng: Math.random() },
                    display: Math.random().toString(),
                },
                {
                    coordinates: { lat: Math.random(), lng: Math.random() },
                    display: Math.random().toString(),
                },
                {
                    coordinates: { lat: Math.random(), lng: Math.random() },
                    display: Math.random().toString(),
                },
            ];

            setQueryResults(results);
            setQueryHistory((prev) => {
                let newMap = { ...prev };
                newMap[query.trim()] = { results, exp: Date.now() };
                return newMap;
            });

            callback({
                message: "success",
                query: query.trim(),
                results: results,
            });
            // } else callback({ error: "some error. try again" });
        }
    };

    const value = {
        states: {
            currentPosition,
            queryResults,
            queryHistory,
        },
        funcs: {
            searchLocation,
        },
    };

    return <LocationProviderContext.Provider value={value} {...props} />;
};

export default LocationProvider;
