import { HuddleContext } from "@/providers/HuddleProvider";
import { useContext } from "react";

export const useHuddles = () => {
    const context = useContext(HuddleContext);

    if (context === undefined) {
        throw new Error(
            "useSelectedHuddle must be called within HuddleProvider"
        );
    }

    return context;
};
