import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
const OptionButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, disabled, type = "button", ...props }, ref) => {
        return (
            <button
                type={type}
                disabled={disabled}
                ref={ref}
                className={twMerge(
                    `
                    w-full
                    rounded-full
                    py-1
                    px-3
                    text-xs
                    font-semibold
                    text-white
                    whitespace-nowrap
                    transition-all
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                `,
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

OptionButton.displayName = "OptionButton";

export default OptionButton;
