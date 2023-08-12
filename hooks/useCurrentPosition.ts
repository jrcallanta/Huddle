import { CurrentPositionContext } from "@/providers/CurrentPositionProvider";
import { useContext } from "react";

export const useCurrentPosition = () => {
    const context = useContext(CurrentPositionContext);

    // if (context === undefined) {
    //     throw new Error(
    //         "useCurrentLocation must be called within CurrentLocationProvider"
    //     );
    // }

    return context;
};
