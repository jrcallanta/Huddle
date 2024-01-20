import { signIn } from "next-auth/react";
import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const AUTH_OPTIONS = {
    GOOGLE: true,
    FACEBOOK: false,
};

interface AuthenticationModalProps {
    className?: string;
}

const AuthenticationModal: React.FC<AuthenticationModalProps> = ({
    className,
}) => {
    return (
        <div
            className={twMerge(
                "themed flex flex-col gap-6 w-full pl-4 pr-6 h-fit items-center",
                "min-w-max max-w-lg",
                String(className)
            )}
        >
            <p className='font-semibold text-[var(--800)] text-center whitespace-nowrap'>
                <span>{"Please sign in to use "}</span>
                <span className='text-[var(--500)] text-lg font-bold'>
                    {"Huddle"}
                </span>
            </p>

            {AUTH_OPTIONS.GOOGLE && (
                <UIButton onClick={() => signIn("google")}>
                    <FaGoogle size={22} className='flex-shrink-0' />
                    <span className='flex-grow pr-4'>Sign in with Google</span>
                </UIButton>
            )}

            {AUTH_OPTIONS.FACEBOOK && (
                <UIButton onClick={() => signIn("facebook")}>
                    <FaFacebook size={26} className='flex-shrink-0' />
                    <span className='flex-grow pr-4'>
                        Sign in with Facebook
                    </span>
                </UIButton>
            )}
        </div>
    );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const UIButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, className, ...props }, ref) => (
        <div className='relative w-full h-20 themed bg-[var(--600)] rounded-full'>
            <button
                type='button'
                className={twMerge(
                    "absolute py-4 px-6 h-full w-full -top-2 left-2 hover:left-1 hover:-top-1 active:top-0 active:left-0",
                    "flex items-center gap-4",
                    "bg-[var(--300)] border-4 border-[var(--600)] rounded-full transition-all",
                    "text-white/75 hover:text-white text-sm font-semibold whitespace-nowrap",
                    String(className)
                )}
                ref={ref}
                {...props}
            >
                {children}
            </button>
        </div>
    )
);

export default AuthenticationModal;
