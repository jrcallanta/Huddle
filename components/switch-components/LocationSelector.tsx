import { useLocations } from "@/hooks/useLocations";
import { LocationType } from "@/types";
import React, { useEffect, useState } from "react";
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
    onValueChange?: (newValue: LocationType) => any;
    className?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
    location,
    inputId,
    name,
    isEditing,
    onValueChange,
    className,
}) => {
    const {
        states: { currentPosition },
    } = useLocations();

    const [currentLocationOption, setCurrentLocationOption] =
        useState<LocationType | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [address, setAddress] = useState(location?.display.description);

    useEffect(() => {
        if (location?.display.description)
            setAddress(location.display.description);
    }, [location]);

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

    useEffect(() => {
        if (currentPosition) {
            const { lat, lng } = currentPosition.coordinates;
            const geocoder = new google.maps.Geocoder();
            geocoder
                .geocode({ location: currentPosition.coordinates })
                .then((res) => {
                    if (res.results[0]) {
                        const placeStrings = res.results[0].address_components;
                        setCurrentLocationOption({
                            display: {
                                primary: `${placeStrings[0].short_name} ${placeStrings[1].long_name}, ${placeStrings[2].long_name}`,
                                description: `${placeStrings[0].short_name} ${placeStrings[1].long_name}, ${placeStrings[2].long_name}`,
                            },
                            coordinates: { lat, lng },
                        });
                    }
                });
        }
    }, [currentPosition]);

    const handleChange = (e: any) => {
        if (e.target.value === "") {
            searchLocation("", false);
            const inputDescHidden = document.getElementById(
                `${inputId}-desc-hidden`
            ) as HTMLInputElement;
            const inputLatHidden = document.getElementById(
                `${inputId}-lat-hidden`
            ) as HTMLInputElement;
            const inputLngHidden = document.getElementById(
                `${inputId}-lng-hidden`
            ) as HTMLInputElement;
            inputDescHidden.value = "";
            inputLatHidden.value = "";
            inputLngHidden.value = "";
        } else searchLocation(e.target.value);
    };

    const handleKeyDown = (e: any) => {
        if (e.key.toLowerCase() === "enter") e.target.blur();
    };

    const handleSelectSuggestion = (
        e: any,
        suggestion: google.maps.places.AutocompletePrediction
    ) => {
        // const inputDisplay = document.getElementById(
        //     `${inputId}`
        // ) as HTMLInputElement;
        // const inputDescHidden = document.getElementById(
        //     `${inputId}-desc-hidden`
        // ) as HTMLInputElement;
        // const inputLatHidden = document.getElementById(
        //     `${inputId}-lat-hidden`
        // ) as HTMLInputElement;
        // const inputLngHidden = document.getElementById(
        //     `${inputId}-lng-hidden`
        // ) as HTMLInputElement;

        getGeocode({ address: suggestion.description }).then((results) => {
            const { lat, lng } = getLatLng(results[0]);
            const {
                structured_formatting: { main_text },
            } = suggestion;
            e.target.blur();
            searchLocation(main_text, false);
            setIsSuggesting(false);

            // const display = formData.get(INPUT_NAMES.LOCATION);
            // const description = formData.get(
            //     `${INPUT_NAMES.LOCATION}-desc-hidden`
            // );
            // const lat = Number(
            //     formData.get(`${INPUT_NAMES.LOCATION}-lat-hidden`)
            // );
            // const lng = Number(
            //     formData.get(`${INPUT_NAMES.LOCATION}-lng-hidden`)
            // );
            // const newLocation =
            //     display !== "" && description !== "" && lat && lng
            //         ? {
            //               display: { primary: display, description },
            //               coordinates: { lat, lng },
            //           }
            //         : null;

            // inputDisplay.value = main_text;
            // inputDescHidden.value = suggestion.description;
            // inputLatHidden.value = String(lat);
            // inputLngHidden.value = String(lng);
            setAddress(suggestion.description);

            if (onValueChange)
                onValueChange({
                    display: {
                        primary: main_text,
                        description: suggestion.description,
                    },
                    coordinates: {
                        lat,
                        lng,
                    },
                });
        });
    };

    const handleSelectCurrentPosition = (e: any) => {
        if (currentLocationOption) {
            const inputDisplay = document.getElementById(
                `${inputId}`
            ) as HTMLInputElement;
            const inputDescHidden = document.getElementById(
                `${inputId}-desc-hidden`
            ) as HTMLInputElement;
            const inputLatHidden = document.getElementById(
                `${inputId}-lat-hidden`
            ) as HTMLInputElement;
            const inputLngHidden = document.getElementById(
                `${inputId}-lng-hidden`
            ) as HTMLInputElement;

            const {
                display: { primary, description },
                coordinates: { lat, lng },
            } = currentLocationOption;

            e.target.blur();
            searchLocation(primary, false);
            setIsSuggesting(false);
            inputDisplay.value = primary;
            inputDescHidden.value = description || "";
            setAddress(description || undefined);
            inputLatHidden.value = String(lat);
            inputLngHidden.value = String(lng);
        }
    };

    return (
        <div className='flex flex-col gap-6 w-full p-4'>
            <div
                className={twMerge(
                    "relative w-full flex flex-col gap-6 group/lpicker",
                    isEditing && "before-bg"
                )}
            >
                <div className='flex items-center gap-1'>
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
                        <>
                            <p className={className}>
                                {location?.display.primary}
                            </p>
                        </>
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
                                onFocus={() => setIsSuggesting(true)}
                            />
                            <input
                                id={`${inputId}-desc-hidden`}
                                name={`${name}-desc-hidden`}
                                type='hidden'
                                defaultValue={
                                    location
                                        ? location.display.description
                                        : undefined
                                }
                            />
                            <input
                                id={`${inputId}-lat-hidden`}
                                name={`${name}-lat-hidden`}
                                type='hidden'
                                defaultValue={
                                    location
                                        ? location.coordinates.lat
                                        : undefined
                                }
                            />
                            <input
                                id={`${inputId}-lng-hidden`}
                                name={`${name}-lng-hidden`}
                                type='hidden'
                                defaultValue={
                                    location
                                        ? location.coordinates.lng
                                        : undefined
                                }
                            />
                        </>
                    )}
                </div>

                <div
                    className={twMerge(
                        "z-[1] flex-col absolute -right-2 top-[calc(100%_+_.5rem)] overflow-clip h-fit w-[calc(100%_+_1rem)] bg-[var(--400)]",
                        "hidden bg-[var(--400)] rounded-b-md",
                        // isEditing &&
                        // "dropdown group-[:has(:focus,:active)]/lpicker:flex"
                        isEditing &&
                            isSuggesting &&
                            "group-[&:has(:focus,:active)]/lpicker:flex"
                    )}
                >
                    <div className='z-[1] flex flex-col'>
                        <button
                            type='button'
                            value={"Current Location"}
                            onClick={handleSelectCurrentPosition}
                            className='flex flex-col items-end w-full py-2 px-3 bg-inherit hover:bg-white/10 text text-sm text-right text-white/50 hover:text-white font-medium'
                        >
                            {currentLocationOption ? (
                                <>
                                    <span className='font-semibold'>
                                        (Current Location)
                                    </span>
                                    <span className='text-xs'>
                                        {currentLocationOption?.display.primary}
                                    </span>
                                </>
                            ) : (
                                "Current Location"
                            )}
                        </button>

                        {status === "OK" &&
                            queryResults.map((suggestion) => (
                                <button
                                    key={suggestion.place_id}
                                    type='button'
                                    value={
                                        suggestion.structured_formatting
                                            .main_text
                                    }
                                    onClick={(e) =>
                                        handleSelectSuggestion(e, suggestion)
                                    }
                                    className='flex flex-col items-stretch w-full py-2 px-3 bg-inherit hover:bg-white/10 text text-sm text-right text-white/50 hover:text-white font-medium'
                                >
                                    <p className='font-semibold'>
                                        {
                                            suggestion.structured_formatting
                                                .main_text
                                        }
                                    </p>
                                    <p className='text-xs'>
                                        {
                                            suggestion.structured_formatting
                                                .secondary_text
                                        }
                                    </p>
                                    <p className='text-xs'>
                                        {suggestion.description}
                                    </p>
                                </button>
                            ))}
                    </div>

                    {/* BG-COLOR */}
                    <div className='absolute top-0 w-full h-full bg-[var(--500)] opacity-50 pointer-events-none'></div>
                </div>
            </div>

            {address && (
                <a
                    target='_blank'
                    className='flex flex-col justify-start items-start group/address'
                    href={`http://maps.google.com/?q=${address}`}
                >
                    {address
                        .split(",")
                        .filter((line) => line.trim().toUpperCase() !== "USA")
                        .map((line, i) => (
                            <p
                                key={i}
                                className='w-fit text-sm text-white/50 group-hover/address:text-white whitespace-nowrap'
                            >
                                {line}
                            </p>
                        ))}
                </a>
            )}
        </div>
    );
};

export default LocationSelector;
