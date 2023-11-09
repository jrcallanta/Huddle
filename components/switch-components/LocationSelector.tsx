import { useLocations } from "@/hooks/useLocations";
import React, { useState } from "react";
import { GrLocation } from "react-icons/gr";
import { twMerge } from "tailwind-merge";

interface LocationSelectorProps {
    text: string;
    inputId: string;
    name: string;
    isEditing: boolean;
    className?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
    text,
    inputId,
    name,
    isEditing,
    className,
}) => {
    const {
        states: { queryResults, yqueryHistory },
        funcs: { searchLocation },
    } = useLocations();
    let debounce: NodeJS.Timeout;

    const handleChange = (e: any) => {
        clearTimeout(debounce);
        debounce = setTimeout(
            () =>
                searchLocation(e.target.value, (data: any) => {
                    if (data.error) console.log(data.error);
                    else console.log(data);
                }),
            750
        );
    };

    const handleKeyDown = (e: any) => {
        if (e.key.toLowerCase() === "enter") e.target.blur();
    };

    const handleLocationSelect = (event: any, location: string) => {
        console.log(event.target);
        const input = document.getElementById(inputId) as HTMLInputElement;
        input.value = event.target.value;
        event.target.blur();

        const inputHidden = document.getElementById(
            `${inputId}-hidden`
        ) as HTMLInputElement;
        inputHidden.value = location;
    };

    return (
        <div
            className={twMerge(
                "relative w-full flex gap-1 items-center group/lpicker",
                isEditing && "before-bg"
            )}
        >
            <GrLocation
                size={26}
                className={twMerge(
                    "z-[1] [&:has(+_input:focus)_path]:stroke-white",
                    isEditing
                        ? "[&_path]:stroke-white/50"
                        : "[&_path]:stroke-white"
                )}
            />

            {!isEditing ? (
                <p className={className}>{text}</p>
            ) : (
                <>
                    <input
                        id={inputId}
                        name={name}
                        className={className}
                        type='text'
                        placeholder={text}
                        defaultValue={text}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}
                    />
                    <input
                        id={`${inputId}-hidden`}
                        name={`${name}-hidden`}
                        type='hidden'
                        defaultValue={text}
                    />
                </>
            )}

            <div
                className={twMerge(
                    // "absolute top-[calc(100%_+_2rem)] left-0 right-0 h-32 bg-[var(--400)]",
                    "z-[1] flex-col absolute -right-2 top-[calc(100%_+_.5rem)] overflow-clip h-fit w-[calc(100%_+_1rem)] bg-[var(--400)]",
                    "hidden bg-[var(--400)] rounded-b-md ",
                    isEditing &&
                        "dropdown group-[:has(:focus,:active)]/lpicker:flex"
                )}
            >
                <div className='z-[1] flex flex-col'>
                    <button
                        type='button'
                        value={"Current Location"}
                        onClick={(e) => handleLocationSelect(e, "here")}
                        className=' w-full py-2 px-3 bg-inherit hover:bg-white/10 text text-sm text-right text-white/50 hover:text-white font-medium'
                    >
                        Current Location
                    </button>

                    {queryResults &&
                        queryResults
                            .map(
                                (query, i) =>
                                    query.display ||
                                    `${query.coordinates.lat} ${query.coordinates.lng}`
                            )
                            .map((location, i) => (
                                <button
                                    key={i}
                                    type='button'
                                    value={location}
                                    onClick={(e) =>
                                        handleLocationSelect(e, location)
                                    }
                                    className=' w-full py-2 px-3 bg-inherit hover:bg-white/10 text text-sm text-right text-white/50 hover:text-white font-medium'
                                >
                                    {location}
                                </button>
                            ))}
                </div>

                {/* BG-COLOR */}
                <div className='absolute top-0 w-full h-full bg-[var(--500)] opacity-50 pointer-events-none'></div>
            </div>
        </div>
    );
};

export default LocationSelector;
