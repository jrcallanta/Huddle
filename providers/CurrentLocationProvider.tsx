import { Coords } from "google-map-react";
import { createContext } from "react";

type CurrentLocation =
    | {
          lat: number;
          lng: number;
      }
    | Coords
    | undefined;

export const CurrentLocationContext = createContext<
    CurrentLocation | undefined
>(undefined);

const CurrentLocationProvider = (props: { [propName: string]: any }) => {
    const value = undefined;

    return (
        <CurrentLocationContext.Provider value={value} {...props}>
            {props.children}
        </CurrentLocationContext.Provider>
    );
};

export default CurrentLocationProvider;
