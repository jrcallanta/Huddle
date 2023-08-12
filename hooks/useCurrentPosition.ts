import { CurrentLocationContext } from "@/providers/CurrentLocationProvider";
import { useContext, useEffect } from "react";

export const useCurrentPosition = () => {
    const context = useContext(CurrentLocationContext);

    if (context === undefined) {
        throw new Error(
            "useCurrentLocation must be called within CurrentLocationProvider"
        );
    }

    return context;
};
