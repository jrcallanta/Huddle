import { forwardRef } from "react";
import { BsCheck, BsPencilFill, BsX } from "react-icons/bs";
import { CgNotes } from "react-icons/cg";
import { twMerge } from "tailwind-merge";

type ActionButtonProps = {
    text?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
    (
        | {
              actionType: "details" | "edit" | "save" | "cancel" | undefined;
          }
        | {
              actionType: "accept" | "decline";
              isActive: boolean;
          }
    );

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
    (props, ref) => {
        const { actionType, text, className } = props;

        switch (actionType) {
            case "details":
                return (
                    <ActionButtonGeneric
                        icon={
                            <div className='w-5 h-5 sm:w-6 sm:h-6 flex justify-center items-center'>
                                <CgNotes
                                    size={18}
                                    strokeWidth={".5px"}
                                    className='stroke-[var(--500)] [&_path]:fill-[var(--500)] group-hover/button:[&_path]:fill-white group-hover/button:stroke-white'
                                />
                            </div>
                        }
                        text={text || "Details"}
                        ref={ref}
                        className={className}
                        {...props}
                    />
                );

            case "edit":
                return (
                    <ActionButtonGeneric
                        icon={
                            <div className='w-5 h-5 sm:w-6 sm:h-6 flex justify-center items-center'>
                                <BsPencilFill
                                    size={16}
                                    className='fill-[var(--500)] group-hover/button:fill-white'
                                />
                            </div>
                        }
                        text={text || "Edit"}
                        ref={ref}
                        className={className}
                        {...props}
                    />
                );

            case "save":
                return (
                    <ActionButtonGeneric
                        text={text || "Save"}
                        ref={ref}
                        className={className}
                        {...props}
                    />
                );

            case "cancel":
                return (
                    <ActionButtonGeneric
                        text={text || "Cancel"}
                        ref={ref}
                        className={twMerge(
                            "bg-red-300 hover:bg-red-400",
                            className
                        )}
                        {...props}
                    />
                );

            case "accept":
                return (
                    <ActionButtonGeneric
                        icon={
                            <div
                                className={twMerge(
                                    "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex justify-center items-center border-[var(--500)] group-hover/button:border-white ",
                                    props.isActive && "bg-white border-white"
                                )}
                            >
                                <BsCheck
                                    size={26}
                                    strokeWidth={"0px"}
                                    className={twMerge(
                                        "fill-[var(--500)]",
                                        props.isActive
                                            ? "fill-[var(--300)]"
                                            : "group-hover/button:fill-white"
                                    )}
                                />
                            </div>
                        }
                        text={text || "Accept"}
                        ref={ref}
                        className={twMerge(
                            props.isActive && "[&_>_*]:text-white",
                            className
                        )}
                        {...props}
                    />
                );

            case "decline":
                return (
                    <ActionButtonGeneric
                        icon={
                            <div
                                className={twMerge(
                                    "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex justify-center items-center border-[var(--500)] group-hover/button:border-white ",
                                    props.isActive && "bg-white border-white"
                                )}
                            >
                                <BsX
                                    size={26}
                                    strokeWidth={".2px"}
                                    className={twMerge(
                                        "fill-[var(--500)] stroke-[var(--500)]",
                                        props.isActive
                                            ? "fill-[var(--300)]"
                                            : "group-hover/button:fill-white group-hover/button:stroke-white "
                                    )}
                                />
                            </div>
                        }
                        text={text || "Decline"}
                        ref={ref}
                        className={twMerge(
                            props.isActive && "[&_>_*]:text-white",
                            className
                        )}
                        {...props}
                    />
                );

            default:
                return <ActionButtonGeneric text={text} ref={ref} {...props} />;
        }
    }
);

ActionButton.displayName = "ActionButton";

export default ActionButton;

/***************************
 *  GENERIC ACTION BUTTON TEMPLATE:
 *
 *  Component used as a base component
 *  with defaulted styling and
 *  standard button interactions
 *
 */

type ActionButtonGenericProps = {
    icon?: React.ReactNode;
    text?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ActionButtonGeneric = forwardRef<
    HTMLButtonElement,
    ActionButtonGenericProps
>(({ type = "button", className, text, icon, ...props }, ref) => {
    return (
        <button
            className={twMerge(
                "flex-1 flex-center gap-2 h-12",
                "border-solid border-[var(--500)] border-y-2 border-r-2 last:border-r-0 group/button hover:bg-white/10",
                className
            )}
            type={type}
            ref={ref}
            {...props}
        >
            {icon}
            {text && (
                <p
                    className={twMerge(
                        "text-xs font-semibold cursor-pointer pr-1 text-[var(--500)] group-hover/button:text-white"
                    )}
                >
                    {text}
                </p>
            )}
        </button>
    );
});

ActionButtonGeneric.displayName = "ActionButtonGeneric";
