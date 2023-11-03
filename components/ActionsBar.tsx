import React, { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import ActionButton from "./ActionButton";

type DefaultInteractions = {
    onView?: ([...args]?: any) => any | Promise<any>;
};

type InvitedInteractions = {
    interactions: "invite";
    onAccept: ([...args]?: any) => any | Promise<any>;
    isAccepted: boolean;
    onDecline: ([...args]?: any) => any | Promise<any>;
    isDeclined: boolean;
} & DefaultInteractions;

type OwnerInteractions = {
    interactions: "owner";
    onEdit: ([...args]?: any) => any | Promise<any>;
} & DefaultInteractions;

type OwnerEditInteractions = {
    interactions: "editor";
    onSave: ([...args]?: any) => any | Promise<any>;
    onCancel: ([...args]?: any) => any | Promise<any>;
};

type ActionsBarProps =
    | (Omit<HTMLAttributes<HTMLDivElement>, "children"> &
          (OwnerInteractions | OwnerEditInteractions | InvitedInteractions))
    | ({ interactions: "children" } & HTMLAttributes<HTMLDivElement>);

const ActionsBar: React.FC<ActionsBarProps> = ({ className, ...props }) => {
    const cn = twMerge(
        "empty:hidden last:mt-auto rounded-[inherit] w-full flex",
        className
    );

    const { interactions } = props;
    switch (interactions) {
        case "owner":
            return (
                <div className={cn}>
                    {props.onView && (
                        <ActionButton
                            actionType='details'
                            onClick={props.onView}
                        />
                    )}
                    <ActionButton actionType='edit' onClick={props.onEdit} />
                </div>
            );
        case "editor":
            return (
                <div className={cn}>
                    <ActionButton actionType='save' onClick={props.onSave} />
                    <ActionButton
                        actionType='cancel'
                        onClick={props.onCancel}
                    />
                </div>
            );
        case "invite":
            return (
                <div className={cn}>
                    {props.onView && (
                        <ActionButton
                            actionType='details'
                            onClick={props.onView}
                        />
                    )}
                    <ActionButton
                        actionType='accept'
                        isActive={props.isAccepted}
                        onClick={props.onAccept}
                    />
                    <ActionButton
                        actionType='decline'
                        isActive={props.isDeclined}
                        onClick={props.onDecline}
                    />
                </div>
            );
        default: {
            const { children, ...otherProps } = props;
            return (
                <div className={cn} {...otherProps}>
                    {children}
                </div>
            );
        }
    }
};

export default ActionsBar;
