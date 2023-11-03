import React from "react";
import { twMerge } from "tailwind-merge";

interface EditableTitleProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    text: string;
    inputId: string;
    name: string;
    isEditing: boolean;
}

const EditableTitle: React.FC<EditableTitleProps> = ({
    text,
    inputId,
    name,
    isEditing,
    className,
}) => {
    const handleKeyDown = (e: any) => {
        if (e.key.toLowerCase() === "enter") e.target.blur();
    };

    return (
        <div className={twMerge("w-full flex", isEditing && "before-bg")}>
            {!isEditing ? (
                <p className={className}>{text}</p>
            ) : (
                <input
                    id={inputId}
                    name={name}
                    className={className}
                    type='text'
                    placeholder={text}
                    defaultValue={text}
                    onKeyDown={handleKeyDown}
                />
            )}
        </div>
    );
};

export default EditableTitle;
