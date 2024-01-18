import { HuddleTypeForTile } from "@/types";
import { useEffect, useReducer } from "react";

export type DetailState = {
    isLoading: boolean;
    isSaving: boolean;
    huddleState: HuddleTypeForTile;
    feedback: String | undefined | null;
};

export type Action = { payload: any } & (
    | { type: "REFRESH_HUDDLE" }
    | { type: "EDIT_TITLE" }
    | { type: "EDIT_START_TIME" }
    | { type: "EDIT_END_TIME" }
    | { type: "EDIT_LOCATION" }
    | { type: "EDIT_INVITE_STATUS" }
    | { type: "CHANGE_FEEDBACK" }
);

export const useDetailsModalReducer = (originalHuddle: HuddleTypeForTile) => {
    const reducer = (state: DetailState, action: Action): DetailState => {
        switch (action.type) {
            case "REFRESH_HUDDLE": {
                console.log(action.payload);
                return { ...state, huddleState: action.payload };
            }

            case "EDIT_TITLE": {
                console.log(action.payload);
                return {
                    ...state,
                    huddleState: {
                        ...state.huddleState,
                        title: action.payload,
                    },
                };
            }
            case "EDIT_START_TIME": {
                return {
                    ...state,
                    huddleState: {
                        ...state.huddleState,
                        start_time: action.payload,
                    },
                };
            }
            case "EDIT_END_TIME": {
                console.log(action.payload);
                return {
                    ...state,
                    huddleState: {
                        ...state.huddleState,
                        end_time: action.payload,
                    },
                };
            }
            case "EDIT_LOCATION": {
                console.log(action.payload);
                return {
                    ...state,
                    huddleState: {
                        ...state.huddleState,
                        location: action.payload,
                    },
                };
            }
            case "EDIT_INVITE_STATUS": {
                console.log(action.payload);
                return {
                    ...state,
                    huddleState: {
                        ...state.huddleState,
                        invite_status: action.payload,
                    },
                };
            }
            case "CHANGE_FEEDBACK": {
                return {
                    ...state,
                    feedback: action.payload,
                };
            }
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, {
        isLoading: false,
        isSaving: false,
        huddleState: originalHuddle,
        feedback: undefined,
    });

    useEffect(() => {
        dispatch({ type: "REFRESH_HUDDLE", payload: originalHuddle });
    }, [originalHuddle]);

    return { state, dispatch };
};
