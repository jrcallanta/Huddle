"use client";

import { HuddleType } from "@/types";
import { useUser } from "@/hooks/useUser";
import {
    Dispatch,
    SetStateAction,
    createContext,
    useCallback,
    useEffect,
    useState,
} from "react";

type HuddleContextType = {
    selectedHuddle: HuddleType | null;
    huddleList: HuddleType[] | null;
    setSelectedHuddle: Dispatch<SetStateAction<HuddleType | null>>;
    refreshHuddles: () => Promise<Response> | Promise<void>;
};

export const HuddleContext = createContext<HuddleContextType | undefined>(
    undefined
);

export const HuddleProvider = (props: { [propName: string]: any }) => {
    const { currentUser } = useUser();
    const [huddleList, setHuddleList] = useState<HuddleType[] | null>(null);
    const [selectedHuddle, setSelectedHuddle] = useState<HuddleType | null>(
        null
    );

    useEffect(() => {
        console.log(huddleList);
    }, [huddleList]);

    const refreshHuddles = useCallback(async () => {
        if (currentUser) {
            let res = await fetch(
                `api/huddle/search/relevant/${currentUser._id}`
            )
                .then((res) => res.json())
                .then((data) => {
                    setHuddleList(data.huddles ?? []);
                });
            return res;
        }
    }, [currentUser]);

    // Get Huddles
    useEffect(() => {
        refreshHuddles();
    }, [refreshHuddles]);

    const updateHuddle = (huddle: HuddleType) => {
        setHuddleList((prev) => {
            if (prev?.length) {
                let newList = [...prev];
                let ind = newList.findIndex((e) => e._id === huddle._id);
                if (ind < 0) return newList;

                newList.splice(ind, 1, huddle);
                return newList;
            }
            return prev;
        });
    };

    const value = {
        selectedHuddle,
        huddleList,
        setSelectedHuddle,
        refreshHuddles,
    };

    return <HuddleContext.Provider value={value} {...props} />;
};
