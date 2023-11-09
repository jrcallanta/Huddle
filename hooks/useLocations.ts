import { LocationProviderContext } from "@/providers/LocationProvider";
import { useContext } from "react";

export const useLocations = () => {
    const context = useContext(LocationProviderContext);

    if (context === undefined) {
        throw new Error("useLocations must be called within LocationsProvider");
    }

    return context;
};
