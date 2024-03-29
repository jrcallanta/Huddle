import { HuddleTypeForTile, LocationType } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { INPUT_NAMES } from "@/components/DetailsModal_v2";
import { useHuddles } from "./useHuddles";
import { Action } from "./useDetailsModalReducer";

interface Args {
    deps: {
        originalHuddle: HuddleTypeForTile;
        isInEditingModeInitial: boolean;
    };
    states: { huddleState: HuddleTypeForTile };
    funcs: {
        dispatch: React.Dispatch<Action>;
        onCloseEditor: any;
    };
}

export const useHuddleOwnerEditor = ({
    deps: { originalHuddle, isInEditingModeInitial },
    states: { huddleState },
    funcs: { dispatch, onCloseEditor },
}: Args) => {
    const {
        funcs: {
            setFocusedHuddle,
            setSelectedHuddle,
            updateHuddleDetails,
            createNewHuddle,
            deleteHuddle,
            refreshHuddles,
        },
    } = useHuddles();

    // Editing mode provided if owner
    const [isInEditingMode, setIsInEditingMode] = useState(
        isInEditingModeInitial
    );

    // Reset editing mode upon close
    useEffect(() => {
        return () => setIsInEditingMode(false);
    }, []);

    const _validateInputs = useCallback(
        ({
            title,
            startTime,
            endTime,
        }: {
            title: string;
            startTime: Date;
            endTime?: Date;
        }) => {
            console.log(startTime, endTime);

            if (!title || title === "") {
                dispatch({
                    type: "CHANGE_FEEDBACK",
                    payload: "Title cannot be blank",
                });
                return false;
            }

            if (!startTime) {
                dispatch({
                    type: "CHANGE_FEEDBACK",
                    payload: "Huddle needs a start time",
                });
                return false;
            }

            if (
                startTime &&
                endTime &&
                new Date(startTime).getTime() >= new Date(endTime).getTime()
            ) {
                dispatch({
                    type: "CHANGE_FEEDBACK",
                    payload: "End time must be after start time",
                });
                return false;
            }

            return true;
        },
        []
    );

    const handleOpenEditMode = useCallback(async () => {
        dispatch({ type: "CHANGE_FEEDBACK", payload: null });
        setIsInEditingMode(true);
    }, []);

    const handleCloseEditMode = useCallback(async () => {
        console.log(originalHuddle);
        if (originalHuddle._id) {
            dispatch({ type: "CHANGE_FEEDBACK", payload: null });
            dispatch({ type: "REFRESH_HUDDLE", payload: originalHuddle });
            setIsInEditingMode(false);
        } else {
            onCloseEditor();
        }
    }, [originalHuddle, onCloseEditor]);

    const handleSaveDetails = useCallback(
        async (event: any) => {
            event.preventDefault();

            const valid = _validateInputs({
                title: huddleState.title,
                startTime: huddleState.start_time,
                endTime: huddleState.end_time,
            });

            if (!valid) return;
            dispatch({ type: "CHANGE_FEEDBACK", payload: "Saving..." });

            if (originalHuddle._id)
                updateHuddleDetails(
                    {
                        huddleId: originalHuddle?._id,
                        changes: {
                            ...huddleState,
                            title: huddleState.title,
                            startTime: huddleState.start_time,
                            endTime: huddleState.end_time,
                            location: huddleState.location,
                        },
                    },
                    (data: any) => {
                        if (!data.error) {
                            setIsInEditingMode(false);
                            refreshHuddles();
                            dispatch({
                                type: "CHANGE_FEEDBACK",
                                payload: null,
                            });
                        } else {
                            setTimeout(() => {
                                dispatch({
                                    type: "CHANGE_FEEDBACK",
                                    payload:
                                        "Could not save changes. Try again.",
                                });
                            }, 500);
                        }
                    }
                );
            else
                createNewHuddle(
                    {
                        ...huddleState,
                        title: huddleState.title,
                        start_time: huddleState.start_time,
                        end_time: huddleState.end_time,
                        location: huddleState.location,
                    },
                    async (data: any) => {
                        if (data.newHuddle) {
                            console.log(data.newHuddle);
                            setIsInEditingMode(false);
                            await refreshHuddles();
                            setSelectedHuddle(data.newHuddle);
                            setFocusedHuddle(data.newHuddle);
                            dispatch({
                                type: "CHANGE_FEEDBACK",
                                payload: null,
                            });
                        } else {
                            setTimeout(() => {
                                dispatch({
                                    type: "CHANGE_FEEDBACK",
                                    payload:
                                        "Could not save changes. Try again.",
                                });
                            }, 500);
                        }
                    }
                );
        },
        [
            huddleState,
            _validateInputs,
            updateHuddleDetails,
            createNewHuddle,
            refreshHuddles,
        ]
    );

    const handleDelete = useCallback(() => {
        if (originalHuddle._id) {
            dispatch({ type: "CHANGE_FEEDBACK", payload: "Deleting..." });
            deleteHuddle({ huddleId: originalHuddle._id }, (data: any) => {
                if (!data.error) {
                    setFocusedHuddle(null);
                    setSelectedHuddle(null);
                    refreshHuddles();
                } else
                    dispatch({
                        type: "CHANGE_FEEDBACK",
                        payload: "Could not delete. Try again.",
                    });
            });
        }
    }, [deleteHuddle, refreshHuddles]);

    return {
        states: {
            isInEditingMode,
        },
        handlers: {
            handleOpenEditMode,
            handleCloseEditMode,
            handleSaveDetails,
            handleDelete,
        },
    };
};
