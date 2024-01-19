import { HuddleTypeForTile } from "@/types";
import { useHuddles } from "./useHuddles";
import { useCallback, useState } from "react";
import { Action } from "./useDetailsModalReducer";

interface Args {
    deps: { originalHuddle: HuddleTypeForTile };
    states: { huddleState: HuddleTypeForTile };
    funcs: {
        dispatch: React.Dispatch<Action>;
    };
}

export const useHuddleInviteResponder = ({
    deps: { originalHuddle },
    states: { huddleState },
    funcs: { dispatch },
}: Args) => {
    const {
        funcs: { respondToInvite, refreshHuddles },
    } = useHuddles();

    const [isUpdatingInviteStatus, setIsUpdatingInviteStatus] = useState(false);

    const _handleRespondInvite = useCallback(
        async (event: any, respond: string) => {
            event.stopPropagation();
            dispatch({ type: "CHANGE_FEEDBACK", payload: null });
            setIsUpdatingInviteStatus(true);
            dispatch({ type: "EDIT_INVITE_STATUS", payload: respond });

            if (originalHuddle._id)
                await respondToInvite(
                    {
                        huddleId: originalHuddle._id,
                        response: respond,
                    },
                    async (data: any) => {
                        if (data.updatedInvite) {
                            setIsUpdatingInviteStatus(false);
                            await refreshHuddles();
                        } else {
                            setTimeout(() => {
                                dispatch({
                                    type: "CHANGE_FEEDBACK",
                                    payload:
                                        "Could not send response. Try again.",
                                });
                                dispatch({
                                    type: "EDIT_INVITE_STATUS",
                                    payload: originalHuddle.invite_status,
                                });
                                setIsUpdatingInviteStatus(false);
                            }, 500);
                        }
                    }
                );
        },
        [respondToInvite, refreshHuddles, originalHuddle]
    );

    const handleToggleAcceptInvite = useCallback(
        (event: any) =>
            _handleRespondInvite(
                event,
                huddleState.invite_status !== "GOING" ? "GOING" : "PENDING"
            ),
        [_handleRespondInvite, huddleState]
    );

    const handleToggleDeclineInvite = useCallback(
        (event: any) => {
            _handleRespondInvite(
                event,
                huddleState.invite_status !== "NOT_GOING"
                    ? "NOT_GOING"
                    : "PENDING"
            );
        },
        [_handleRespondInvite, huddleState]
    );

    return {
        states: { isUpdatingInviteStatus },
        handlers: {
            handleToggleAcceptInvite,
            handleToggleDeclineInvite,
        },
    };
};
