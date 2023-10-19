"use client";

import { HuddleTemplateType, HuddleType } from "@/types";
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
    states: {
        selectedHuddle: HuddleType | null;
        focusedHuddle: HuddleType | HuddleTemplateType | null;
        huddleList: HuddleType[] | null;
    };
    funcs: {
        setSelectedHuddle: Dispatch<SetStateAction<HuddleType | null>>;
        setFocusedHuddle: Dispatch<
            SetStateAction<HuddleType | HuddleTemplateType | null>
        >;
        refreshHuddles: () => Promise<Response> | Promise<void>;
        getHuddleTemplate: any;
    };
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
    const [focusedHuddle, setFocusedHuddle] = useState<
        HuddleType | HuddleTemplateType | null
    >(null);

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

    const getHuddleTemplate: () => HuddleTemplateType | null =
        useCallback(() => {
            return currentUser
                ? {
                      author: currentUser,
                      author_id: currentUser._id,
                      title: "New Huddle",
                      start_time: new Date(),
                  }
                : null;
        }, [currentUser]);

    const value = {
        states: {
            selectedHuddle,
            focusedHuddle,
            huddleList,
        },
        funcs: {
            setSelectedHuddle,
            setFocusedHuddle,
            refreshHuddles,
            getHuddleTemplate,
        },
    };

    return <HuddleContext.Provider value={value} {...props} />;
};
