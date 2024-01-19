import dateFormat from "dateformat";
import React, { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface TimePickerProps {
    optional?: any;
    label?: string;
    initialTime?: Date;
    lowerBound?: Date;
    upperBound?: Date;
    isEditing: boolean;
    onValueChange?: (newValue: any) => any;
    className?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
    optional,
    initialTime,
    lowerBound,
    upperBound,
    label,
    isEditing,
    onValueChange,
    className,
}) => {
    const [displayedTime, setDisplayedTime] = useState(
        initialTime ? dateFormat(initialTime, "h:MMtt") : "?"
    );
    const [isDropDownShown, setIsDropDownShown] = useState(false);

    const handleTimeSelect = (event: any, time: Date | undefined) => {
        setDisplayedTime(time ? dateFormat(time, "h:MMtt") : "?");
        setIsDropDownShown(false);

        if (onValueChange) onValueChange(time);
    };

    const renderTimes = useCallback(() => {
        console.log("lowerBournd: " + lowerBound);
        return Array(23 * 4 + 3)
            .fill(lowerBound ? new Date(lowerBound) : Date.now())
            .reduce(
                (accum: Date[], curr: Date, i: number) => {
                    let date = lowerBound ? new Date(lowerBound) : new Date();

                    date.setMinutes(
                        Math.floor(new Date(curr).getMinutes() / 15) * 15 +
                            15 * (i + 1),
                        0,
                        0
                    );

                    accum.push(date);
                    return accum;
                },
                lowerBound ? [] : [new Date()]
            );
    }, [lowerBound]);

    const getDayLabel = useCallback(() => {
        if (initialTime) {
            switch (getDayDiff(initialTime, new Date())) {
                case 2:
                    return "Next Day";
                case 1:
                    return "Tomorrow";
                case 0:
                    return "Today";
                default:
                    return "";
            }
        }
        return null;
    }, [initialTime]);

    const getDayDiff = (day1: Date, day2: Date): number => {
        let topOfDay1 = new Date(dateFormat(day1, "mm/dd/yyyy"));
        let topOfDay2 = new Date(dateFormat(day2, "mm/dd/yyyy"));

        return day1 > day2
            ? Math.floor(
                  (topOfDay1.getTime() - topOfDay2.getTime()) /
                      (1000 * 60 * 60 * 24)
              )
            : Math.floor(
                  (topOfDay2.getTime() - topOfDay1.getTime()) /
                      (1000 * 60 * 60 * 24)
              );
    };

    return (
        <div
            className={twMerge(
                "relative w-full flex items-baseline gap-4",
                isEditing && "before-bg",
                isDropDownShown && "before-bg before:rounded-b-none"
            )}
        >
            {label && (
                <p className='text z-[1] w-12 md:w-fit text-sm font-bold text-white/50'>
                    {label}
                </p>
            )}

            <div className='w-full flex flex-col gap-1 justify-end items-end'>
                {!isEditing ? (
                    <p className={className}>{displayedTime}</p>
                ) : (
                    <button
                        className={twMerge(className, "peer/timeButton")}
                        onClick={() => setIsDropDownShown((prev) => !prev)}
                        type='button'
                    >
                        {displayedTime}
                    </button>
                )}
                {initialTime && displayedTime !== "?" && (
                    <p
                        className={twMerge(
                            "text-xs text-white peer-first/timeButton:text-white/50 peer-focus/timeButton:text-white font-semibold"
                        )}
                    >
                        {getDayLabel()}
                    </p>
                )}
            </div>

            <div
                className={twMerge(
                    "hidden z-[2] flex-col absolute -right-2 top-[calc(100%_+_.5rem)] overflow-clip h-64 w-[calc(100%_+_1rem)]",
                    "bg-[var(--400)] rounded-b-md ",
                    isEditing && isDropDownShown && "dropdown flex"
                )}
            >
                <div
                    className={twMerge(
                        "hidden z-10 flex-col h-full overflow-hidden overflow-y-scroll",
                        isEditing && isDropDownShown && "flex"
                    )}
                >
                    {optional && (
                        <button
                            type='button'
                            value={"?"}
                            onClickCapture={(e) =>
                                handleTimeSelect(e, undefined)
                            }
                            className='w-full py-1 px-3 bg-inherit hover:bg-white/10 text text-sm text-right text-white/50 hover:text-white font-medium'
                        >
                            {"?"}
                        </button>
                    )}

                    {renderTimes().map((time: Date, index: number) => (
                        <button
                            key={index}
                            type='button'
                            value={dateFormat(time, "h:MMtt")}
                            onClickCapture={(e) => handleTimeSelect(e, time)}
                            className={twMerge(
                                "w-full flex justify-between py-1 px-3 bg-inherit text-right text-sm text-white/50 font-medium",
                                "hover:bg-white/10 hover:text-white group/time",
                                time.getMinutes() == 0 && "bg-black/10"
                            )}
                        >
                            <span className='hidden group-hover/time:flex my-auto text-sm font-medium opacity-50'>
                                {(() => {
                                    switch (getDayDiff(time, new Date())) {
                                        case 2:
                                            return "Next Day";
                                        case 1:
                                            return "Tomorrow";
                                        case 0:
                                            return "Today";
                                        default:
                                            return "";
                                    }
                                })()}
                            </span>

                            <span className='ml-auto'>
                                {dateFormat(time, "h:MMtt")}
                            </span>
                        </button>
                    ))}
                </div>

                {/* BG-COLOR */}
                <div className='z-[-1] absolute top-0 w-full h-full bg-[var(--500)] opacity-50 pointer-events-none'></div>
            </div>
        </div>
    );
};

export default TimePicker;
