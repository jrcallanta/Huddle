import { HuddleTypeForTile, LocationType } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { INPUT_NAMES } from "@/components/DetailsModal_v2";
import { useHuddles } from "./useHuddles";

interface Args {
    deps: {
        originalHuddle: HuddleTypeForTile;
        isInEditingModeInitial: boolean;
    };
    states: { huddleState: HuddleTypeForTile };
    funcs: {
        setHuddleState: React.Dispatch<React.SetStateAction<HuddleTypeForTile>>;
        setFeedback: React.Dispatch<React.SetStateAction<string | null>>;
        onCloseEditor: any;
    };
}

export const useHuddleOwnerEditor = ({
    deps: { originalHuddle, isInEditingModeInitial },
    states: { huddleState },
    funcs: { setHuddleState, setFeedback, onCloseEditor },
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

    // Watch for changes
    useEffect(() => setHuddleState(originalHuddle), [originalHuddle]);

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
            startTime: string;
            endTime: string;
        }) => {
            console.log(startTime, endTime);

            if (!title || title === "") {
                setFeedback("Title cannot be blank");
                return false;
            }

            if (!startTime) {
                setFeedback("Huddle needs a start time");
                return false;
            }

            if (startTime && endTime && startTime >= endTime) {
                setFeedback("End time must be after start time");
                return false;
            }

            return true;
        },
        []
    );

    const handleOpenEditMode = useCallback(async () => {
        setFeedback(null);
        setIsInEditingMode(true);
    }, []);

    const handleCloseEditMode = useCallback(async () => {
        if (originalHuddle._id) {
            setFeedback(null);
            setIsInEditingMode(false);
        } else {
            onCloseEditor();
        }
    }, [originalHuddle, onCloseEditor]);

    const handleSaveDetails = useCallback(
        async (event: any) => {
            event.preventDefault();
            const formData = new FormData(event.target.form);

            const newTitle = formData.get(INPUT_NAMES.TITLE);
            const newStartTime = formData.get(
                `${INPUT_NAMES.START_TIME}-hidden`
            );
            const newEndTime = formData.get(`${INPUT_NAMES.END_TIME}-hidden`);
            const display = formData.get(INPUT_NAMES.LOCATION);
            const description = formData.get(
                `${INPUT_NAMES.LOCATION}-desc-hidden`
            );
            const lat = Number(
                formData.get(`${INPUT_NAMES.LOCATION}-lat-hidden`)
            );
            const lng = Number(
                formData.get(`${INPUT_NAMES.LOCATION}-lng-hidden`)
            );
            const newLocation =
                display !== "" && description !== "" && lat && lng
                    ? {
                          display: { primary: display, description },
                          coordinates: { lat, lng },
                      }
                    : null;

            const valid = _validateInputs({
                title: newTitle as string,
                startTime: newStartTime as string,
                endTime: newEndTime as string,
            });

            if (!valid) return;

            console.log({
                newTitle,
                newStartTime,
                newEndTime,
                display,
                description,
                newLocation,
            });

            // Update Optimistic UI
            setHuddleState((prev) => {
                return {
                    ...prev,
                    title: newTitle as string,
                    start_time: new Date(Number(newStartTime)),
                    end_time:
                        newEndTime !== "?"
                            ? new Date(Number(newEndTime))
                            : null,
                    location: newLocation as LocationType,
                } as HuddleTypeForTile;
            });
            setFeedback("Saving...");

            if (originalHuddle._id)
                updateHuddleDetails(
                    {
                        huddleId: originalHuddle?._id,
                        changes: {
                            ...huddleState,
                            title: newTitle as string,
                            startTime: new Date(Number(newStartTime)),
                            endTime:
                                newEndTime !== "?"
                                    ? new Date(Number(newEndTime))
                                    : null,
                            location: newLocation as LocationType,
                        },
                    },
                    (data: any) => {
                        if (!data.error) {
                            setIsInEditingMode(false);
                            refreshHuddles();
                            setFeedback(null);
                        } else {
                            setTimeout(() => {
                                setFeedback(
                                    "Could not save changes. Try again."
                                );
                            }, 500);
                        }
                    }
                );
            else
                createNewHuddle(
                    {
                        ...huddleState,
                        title: newTitle as string,
                        start_time: new Date(Number(newStartTime)),
                        end_time:
                            newEndTime !== "?"
                                ? new Date(Number(newEndTime))
                                : undefined,
                        location: newLocation as LocationType,
                    },
                    async (data: any) => {
                        if (data.newHuddle) {
                            console.log(data.newHuddle);
                            setIsInEditingMode(false);
                            await refreshHuddles();
                            setSelectedHuddle(data.newHuddle);
                            setFocusedHuddle(data.newHuddle);
                            setFeedback(null);
                        } else {
                            setTimeout(() => {
                                setFeedback(
                                    "Could not save changes. Try again."
                                );
                            }, 500);
                        }
                    }
                );
        },
        [_validateInputs, updateHuddleDetails, createNewHuddle, refreshHuddles]
    );

    const handleDelete = useCallback(() => {
        if (originalHuddle._id) {
            setFeedback("Deleting...");
            deleteHuddle({ huddleId: originalHuddle._id }, (data: any) => {
                if (!data.error) {
                    setFocusedHuddle(null);
                    refreshHuddles();
                } else setFeedback("Could not delete. Try again.");
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
