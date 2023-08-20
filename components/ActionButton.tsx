import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import React, { ReactNode } from "react";

interface ActionButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode;
    text?: string;
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
    (
        {
            className,
            children,
            disabled,
            type = "button",
            icon,
            text = "",
            ...props
        },
        ref
    ) => {
        return (
            <button
                className={twMerge(
                    `group/button
                    border-none
                    flex
                    justify-center
                    items-center
                    gap-2
                    py-2
                    px-2
                    rounded-full
                    hover:bg-black
                    hover:bg-opacity-[.1]
                    transition`,
                    className
                )}
                type={type}
                disabled={disabled}
                ref={ref}
                {...props}
            >
                {icon}
                {text && (
                    <p
                        className='text-[var(--500)]
                text-xs
                font-semibold
                group-hover/button:text-white
                cursor-pointer
                transition'
                    >
                        {text}
                    </p>
                )}
            </button>
        );
    }
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
