"use client";

import {
    HuddleTemplateType,
    HuddleType,
    HuddleTypeForTile,
    InviteType,
} from "@/types";
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
        getHuddleTemplate: () => HuddleType | null;
        respondToInvite: (
            args: {
                huddleId: string;
                response: string;
            },
            callback?: any
        ) => Promise<InviteType | null>;
        createNewHuddle: (
            newHuddle: HuddleType,
            callback?: any
        ) => Promise<HuddleTypeForTile | null>;
        updateHuddleDetails: (
            args: {
                huddleId: string;
                changes: {
                    title: string;
                    startTime: Date;
                    endTime: Date | undefined;
                };
            },
            callback?: any
        ) => Promise<HuddleTypeForTile | null>;
        deleteHuddle: (
            args: {
                huddleId: string;
            },
            callback?: any
        ) => Promise<HuddleTypeForTile | null>;
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

    /***
     * Function used to generate a template for a
     * Huddle, primarily used for creating new Huddle
     * with starting values.
     *
     */
    const getHuddleTemplate: () => HuddleType | null = useCallback(() => {
        return currentUser
            ? {
                  _id: undefined,
                  author: currentUser,
                  author_id: currentUser._id,
                  title: "New Huddle",
                  start_time: new Date(),
              }
            : null;
    }, [currentUser]);

    /***
     * Function used to refresh huddle list, retrieving
     * new data from api endpoint.
     *
     */
    const refreshHuddles: () => any = useCallback(async () => {
        if (currentUser) {
            let res = await fetch(
                `api/huddle/search/relevant/${currentUser._id}`
            )
                .then((res) => res.json())
                .then((data) => {
                    setHuddleList(data.huddles ?? []);
                    return data;
                });
            return res;
        }
    }, [currentUser]);

    /***
     * Function used to update currentUser's response for
     * an invite to a friend's huddle.
     *
     */
    const respondToInvite: (
        {
            huddleId,
            response,
        }: {
            huddleId: string;
            response: string;
        },
        callback?: any
    ) => Promise<InviteType | null> = useCallback(
        async ({ huddleId, response }, callback) => {
            if (currentUser) {
                await fetch("/api/invite", {
                    method: "PATCH",
                    body: JSON.stringify({
                        userId: currentUser?._id,
                        huddleId: huddleId,
                        status: response,
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (callback) callback(data);
                    })
                    .catch((error) => {
                        if (callback) callback(error);
                    });
            }

            return null;
        },
        [currentUser]
    );

    /***
     * Function used to create a new huddle
     * for the currentUser with values passed.
     *
     */
    const createNewHuddle: (
        newHuddle: HuddleType,
        callback?: any
    ) => Promise<HuddleTypeForTile | null> = useCallback(
        async (newHuddle, callback) => {
            if (currentUser) {
                await fetch("/api/huddle", {
                    method: "POST",
                    body: JSON.stringify({
                        huddle: newHuddle,
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (callback) callback(data);
                    })
                    .catch((error) => {
                        if (callback) callback(error);
                    });
            }

            return null;
        },
        [currentUser]
    );

    /***
     * Function used to update one of the currentUser's
     * huddles using the passed huddleId and changes.
     *
     */
    const updateHuddleDetails: (
        {
            huddleId,
            changes,
        }: {
            huddleId: string;
            changes: {
                title: string;
                startTime: Date;
                endTime: Date | undefined;
            };
        },
        callback?: any
    ) => Promise<HuddleTypeForTile | null> = useCallback(
        async (
            { huddleId, changes: { title, startTime, endTime } },
            callback
        ) => {
            if (currentUser) {
                await fetch("/api/huddle/edit", {
                    method: "PATCH",
                    body: JSON.stringify({
                        userId: currentUser?._id,
                        huddleId: huddleId,
                        changes: {
                            title: title,
                            start_time: startTime,
                            end_time: endTime,
                        },
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (callback) callback(data);
                    })
                    .catch((error) => {
                        if (callback) callback(error);
                    });
            }
            return null;
        },
        [currentUser]
    );

    /***
     * Function used to delete one of the
     * currentUser's huddles using huddleId.
     *
     */
    const deleteHuddle: (
        {
            huddleId,
        }: {
            huddleId: string;
        },
        callback?: any
    ) => Promise<HuddleTypeForTile | null> = useCallback(
        async ({ huddleId }, callback?: any) => {
            if (currentUser) {
                await fetch(`/api/huddle/delete/${huddleId}`, {
                    method: "DELETE",
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (callback) callback(data);
                    })
                    .catch((error) => {
                        if (callback) callback(error);
                    });
            }
            return null;
        },
        [currentUser]
    );

    useEffect(() => {
        console.log(huddleList);
    }, [huddleList]);

    // Get Huddles
    useEffect(() => {
        refreshHuddles();
    }, [refreshHuddles]);

    useEffect(() => {
        if (selectedHuddle) {
            if (focusedHuddle) setFocusedHuddle(selectedHuddle);
        } else setFocusedHuddle(null);
    }, [selectedHuddle, focusedHuddle]);

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
            createNewHuddle,
            respondToInvite,
            updateHuddleDetails,
            deleteHuddle,
        },
    };

    return <HuddleContext.Provider value={value} {...props} />;
};
