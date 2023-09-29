import React from "react";

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
    return !isEditing ? (
        <p className={className}>{text}</p>
    ) : (
        <input
            id={inputId}
            name={name}
            className={className}
            type='text'
            placeholder={text}
            defaultValue={text}
        />
    );
};

export default EditableTitle;
