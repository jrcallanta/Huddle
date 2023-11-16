import { useLocations } from "@/hooks/useLocations";
import { LocationType } from "@/types";
import React from "react";
import { GrLocation } from "react-icons/gr";
import { twMerge } from "tailwind-merge";

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";

interface LocationSelectorProps {
    location: LocationType | null;
    inputId: string;
    name: string;
    isEditing: boolean;
    className?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
    location,
    inputId,
    name,
    isEditing,
    className,
}) => {
    const {
        states: { currentPosition },
    } = useLocations();

    const {
        ready: isReady,
        suggestions: { status, data: queryResults },
        value,
        setValue: searchLocation,
        clearSuggestions,
    } = usePlacesAutocomplete({
        callbackName: "__googleMapsCallback__",
        defaultValue: !location
            ? ""
            : location.display.primary ||
              `${location.coordinates.lat} ${location.coordinates.lng}`,
        debounce: 750,
    });

    const handleChange = (e: any) => {
        if (e.target.value === "") {
            searchLocation("", false);
            const inputLatHidden = document.getElementById(
                `${inputId}-lat-hidden`
            ) as HTMLInputElement;
            const inputLngHidden = document.getElementById(
                `${inputId}-lng-hidden`
            ) as HTMLInputElement;
            inputLatHidden.value = "";
            inputLngHidden.value = "";
        } else searchLocation(e.target.value);
    };

    const handleKeyDown = (e: any) => {
        if (e.key.toLowerCase() === "enter") e.target.blur();
    };

    const handleSuggestionSelect = (
        e: any,
        suggestion: google.maps.places.AutocompletePrediction
    ) => {
        const inputDisplay = document.getElementById(
            `${inputId}`
        ) as HTMLInputElement;
        const inputLatHidden = document.getElementById(
            `${inputId}-lat-hidden`
        ) as HTMLInputElement;
        const inputLngHidden = document.getElementById(
            `${inputId}-lng-hidden`
        ) as HTMLInputElement;

        getGeocode({ address: suggestion.description }).then((results) => {
            const { lat, lng } = getLatLng(results[0]);

            searchLocation(suggestion.structured_formatting.main_text, false);
            clearSuggestions();
            inputDisplay.value = suggestion.structured_formatting.main_text;
            inputLatHidden.value = String(lat);
            inputLngHidden.value = String(lng);
        });
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
                <p className={className}>{location?.display.primary}</p>
            ) : (
                <>
                    <input
                        id={inputId}
                        name={name}
                        className={className}
                        type='text'
                        value={value}
                        placeholder={location ? value : "Add location"}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}
                    />
                    <input
                        id={`${inputId}-lat-hidden`}
                        name={`${name}-lat-hidden`}
                        type='hidden'
                        defaultValue={
                            location ? location.coordinates.lat : undefined
                        }
                    />
                    <input
                        id={`${inputId}-lng-hidden`}
                        name={`${name}-lng-hidden`}
                        type='hidden'
                        defaultValue={
                            location ? location.coordinates.lng : undefined
                        }
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
                        onClick={(e) => {}}
                        className=' w-full py-2 px-3 bg-inherit hover:bg-white/10 text text-sm text-right text-white/50 hover:text-white font-medium'
                    >
                        Current Location
                    </button>

                    {status === "OK" &&
                        queryResults.map((suggestion) => (
                            <button
                                key={suggestion.place_id}
                                type='button'
                                value={
                                    suggestion.structured_formatting.main_text
                                }
                                onClick={(e) =>
                                    handleSuggestionSelect(e, suggestion)
                                }
                                className='flex flex-col items-stretch w-full py-2 px-3 bg-inherit hover:bg-white/10 text text-sm text-right text-white/50 hover:text-white font-medium'
                            >
                                <p className='font-semibold'>
                                    {suggestion.structured_formatting.main_text}
                                </p>
                                <p className='text-xs'>
                                    {
                                        suggestion.structured_formatting
                                            .secondary_text
                                    }
                                </p>
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
