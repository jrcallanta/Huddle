import { HuddleTypeForTile } from "@/types";
import { useHuddles } from "./useHuddles";
import { useCallback, useState } from "react";

interface Args {
    deps: { originalHuddle: HuddleTypeForTile };
    states: { huddleState: HuddleTypeForTile };
    funcs: {
        setHuddleState: React.Dispatch<React.SetStateAction<HuddleTypeForTile>>;
        setFeedback: React.Dispatch<React.SetStateAction<string | null>>;
    };
}

export const useHuddleInviteResponder = ({
    deps: { originalHuddle },
    states: { huddleState },
    funcs: { setHuddleState, setFeedback },
}: Args) => {
    const {
        funcs: { respondToInvite, refreshHuddles },
    } = useHuddles();

    const [isUpdatingInviteStatus, setIsUpdatingInviteStatus] = useState(false);
    const { invite_status } = huddleState;

    const _handleRespondInvite = useCallback(
        async (event: any, respond: string) => {
            event.stopPropagation();
            setFeedback(null);
            setIsUpdatingInviteStatus(true);
            setHuddleState((prev) => ({
                ...prev,
                invite_status: respond,
            }));

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
                                setFeedback(
                                    "Could not send response. Try again."
                                );
                                setHuddleState((prev) => ({
                                    ...prev,
                                    invite_status: originalHuddle.invite_status,
                                }));
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
                invite_status !== "GOING" ? "GOING" : "PENDING"
            ),
        [_handleRespondInvite, invite_status]
    );

    const handleToggleDeclineInvite = useCallback(
        (event: any) => {
            _handleRespondInvite(
                event,
                invite_status !== "NOT_GOING" ? "NOT_GOING" : "PENDING"
            );
        },
        [_handleRespondInvite, invite_status]
    );

    return {
        states: { isUpdatingInviteStatus },
        handlers: {
            handleToggleAcceptInvite,
            handleToggleDeclineInvite,
        },
    };
};
