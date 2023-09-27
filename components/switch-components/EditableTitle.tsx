import React from "react";

interface EditableTitleProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    text: string;
    inputId: string;
    isEditing: boolean;
}

const EditableTitle: React.FC<EditableTitleProps> = ({
    text,
    inputId,
    isEditing,
    className,
}) => {
    return !isEditing ? (
        <p className={className}>{text}</p>
    ) : (
        <input
            id={inputId}
            className={className}
            type='text'
            placeholder={text}
            defaultValue={text}
        />
    );
};

export default EditableTitle;
