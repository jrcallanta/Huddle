import React, { forwardRef } from "react";

interface FormDivProps extends React.HTMLAttributes<HTMLDivElement> {
    formId: string;
    onSubmit: any;
    type?: "form" | "div";
}

const FormDiv: React.FC<FormDivProps> = ({
    formId,
    onSubmit,
    type = "div",
    children,
    className,
    ...props
}) => {
    return type === "div" ? (
        <div
            className={className}
            onClick={(event) => event.stopPropagation()}
            {...props}
        >
            {children}
        </div>
    ) : (
        <form
            className={className}
            onClick={(event) => event.stopPropagation()}
            id={formId}
            onSubmit={onSubmit}
        >
            {children}
        </form>
    );
};

export default FormDiv;
