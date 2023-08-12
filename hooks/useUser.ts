import { UserContext } from "@/providers/UserProvider";
import { useContext } from "react";

export const useUser = () => {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error("useUser must be called within UserContextProvider");
    }

    return context;
};
