import dateFormat from "dateformat";
import React from "react";
import { twMerge } from "tailwind-merge";

interface TimePickerProps {
    optional?: any;
    initialTime?: Date;
    label?: string;
    isEditing: boolean;
    inputId: string;
    name: string;
    className?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
    optional,
    initialTime,
    label,
    isEditing,
    inputId,
    name,
    className,
}) => {
    const handleTimeSelect = (event: any, time: string) => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        input.value = event.target.value;
        event.target.blur();

        const inputHidden = document.getElementById(
            `${inputId}-hidden`
        ) as HTMLInputElement;
        inputHidden.value = time;
    };

    return (
        <div
            className={twMerge(
                "relative w-full flex items-baseline gap-4 group/tpicker",
                isEditing && "before-bg [&:has(:focus)]:before:rounded-b-none"
            )}
        >
            {label && (
                <p className='text z-[1] w-12 md:w-fit text-sm font-bold text-white/50'>
                    {label}
                </p>
            )}

            {!isEditing ? (
                <p className={className}>
                    {initialTime ? dateFormat(initialTime, "h:MMtt") : "?"}
                </p>
            ) : (
                <>
                    <input
                        className={className}
                        name={name}
                        id={inputId}
                        type='text'
                        defaultValue={
                            initialTime
                                ? dateFormat(initialTime, "h:MMtt")
                                : "?"
                        }
                    />
                    <input
                        id={`${inputId}-hidden`}
                        name={`${name}-hidden`}
                        type='hidden'
                        defaultValue={
                            initialTime ? new Date(initialTime).getTime() : "?"
                        }
                    />
                </>
            )}

            <div
                className={twMerge(
                    "hidden z-[2] flex-col absolute -right-2 top-[calc(100%_+_.5rem)] overflow-clip h-64 w-[calc(100%_+_1rem)]",
                    "bg-[var(--400)] rounded-b-md ",
                    isEditing &&
                        "dropdown group-[:has(:focus,:active)]/tpicker:flex"
                )}
            >
                <div
                    className={twMerge(
                        "hidden z-10 flex-col h-full overflow-hidden overflow-y-scroll",
                        isEditing && "group-[:has(:focus,:active)]/tpicker:flex"
                    )}
                >
                    {optional && (
                        <button
                            type='button'
                            value={"?"}
                            onClick={(e) => handleTimeSelect(e, "?")}
                            className='w-full py-1 px-3 bg-inherit hover:bg-white/10 text text-sm text-right text-white/50 hover:text-white font-medium'
                        >
                            {"?"}
                        </button>
                    )}

                    {Array(24 * 4)
                        .fill(Date.now())
                        .reduce(
                            (accum, curr, i) => {
                                let date = new Date().setMinutes(
                                    Math.floor(
                                        new Date(curr).getMinutes() / 15
                                    ) *
                                        15 +
                                        15 * (i + 1)
                                );

                                return [...accum, date];
                            },
                            [Date.now()]
                        )
                        .map((time: string) => (
                            <button
                                type='button'
                                value={dateFormat(time, "h:MMtt")}
                                onClick={(e) => handleTimeSelect(e, time)}
                                className='w-full py-1 px-3 bg-inherit hover:bg-white/10 text text-sm text-right text-white/50 hover:text-white font-medium'
                            >
                                {dateFormat(time, "h:MMtt")}
                            </button>
                        ))}
                </div>
                <div className='absolute top-0 w-full h-full bg-[var(--500)] opacity-50 pointer-events-none'></div>
            </div>
        </div>
    );
};

export default TimePicker;
