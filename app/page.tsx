"use client";

import FeedTabs from "@/components/FeedTabs";
import HuddleFeed from "@/components/HuddleFeed";
import { useState, useEffect } from "react";
import { HuddleSection } from "@/components/HuddleFeed";
import { huddleSorter } from "@/tools/huddleSorter";
import { useHuddles } from "@/hooks/useHuddles";
import { useUser } from "@/hooks/useUser";
import { twMerge } from "tailwind-merge";
import Map from "@/components/Map";
import Marker from "@/components/Marker";
import DetailsModal from "@/components/DetailsModal";

export default function Home() {
    const { currentUser } = useUser();
    const {
        states: { huddleList, selectedHuddle, focusedHuddle },
        funcs: { setSelectedHuddle, setFocusedHuddle, refreshHuddles },
    } = useHuddles();

    const [activeTab, setActiveTab] = useState<number>(0);
    const [huddleSections, setHuddleSections] = useState<
        HuddleSection[] | null
    >(null);

    useEffect(() => {
        console.log(focusedHuddle);
    }, [focusedHuddle]);

    useEffect(() => {
        if (huddleList) {
            setHuddleSections(
                huddleSorter(huddleList, activeTab ? "timeline" : "plan")
            );
        }
    }, [huddleList, activeTab]);

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        setSelectedHuddle(null);
    };

    return (
        <main
            className={twMerge(
                "h-full overflow-hidden w-full max-w-screen-2xl justify-center align-stretch",
                "flex-col overflow-hidden md:flex md:flex-row-reverse md:h-full relative"
            )}
        >
            <div
                className={twMerge(
                    "absolute w-full h-full md:h-full top-0 md:static",
                    "p-0 md:p-8 md:pr-4"
                )}
            >
                <Map>
                    {huddleSections &&
                        huddleSections
                            .map((section: HuddleSection) => section.huddles)
                            .reduce((acc, curr) => [...acc, ...curr], [])
                            .filter((huddle) => huddle.location)
                            .map((huddle, i) => (
                                <Marker
                                    key={huddle._id}
                                    lat={huddle.location?.coordinates.lat}
                                    lng={huddle.location?.coordinates.lng}
                                    selected={
                                        selectedHuddle?._id === huddle._id
                                    }
                                    authorImgUrl={huddle.author.imgUrl}
                                    authorInitials={huddle.author.username.slice(
                                        0,
                                        2
                                    )}
                                    onClick={() => {
                                        setSelectedHuddle((prev) =>
                                            prev && prev._id === huddle._id
                                                ? null
                                                : huddle
                                        );
                                        if (focusedHuddle)
                                            setFocusedHuddle(huddle);
                                    }}
                                />
                            ))}
                </Map>
            </div>

            <div
                className={twMerge(
                    "w-full h-full relative overflow-y-auto pointer-events-none z-20",
                    "pb-0 md:pt-4 md:pb-0"
                )}
            >
                <div className='md:hidden w-full h-[calc(100%_-_3.5rem)] pointer-events-none bg-transparent'></div>
                <div
                    className={twMerge(
                        "p-4 pb-0 md:pr-0 w-full md:max-w-[36rem] mx-auto overflow-hidden top-0 flex flex-col justify-center align-stretch gap-4",
                        "z-20 rounded-t-3xl bg-[var(--background-color)] shadow md:shadow-none",
                        "md:rounded-none md:bg-transparent",
                        "h-full sticky top-48 md:relative pointer-events-auto md:top-0"
                    )}
                >
                    <div
                        className={twMerge(
                            "h-full flex flex-col transition-all",
                            focusedHuddle && "opacity-60"
                        )}
                    >
                        <FeedTabs
                            tabs={["By Plan", "By Timeline"]}
                            activeTabIndex={activeTab}
                            onTabChange={handleTabChange}
                        />
                        <HuddleFeed huddleSections={huddleSections} />
                    </div>

                    <div
                        id='details-modal-root'
                        className={twMerge(
                            "translate-y-0 transition-all duration-300 ease-in-out empty:translate-y-[calc(100%_+_2rem)]",
                            "absolute z-20 top-0 md:bottom-4 bottom-0 min-h-[calc(100%-4rem)] left-0 right-0 m-0 md:m-4 md:mr-0 rounded-t-[3rem] flex flex-col",
                            !focusedHuddle && "translate-y-[calc(100%_+_2rem)]"
                        )}
                    ></div>
                </div>
            </div>
        </main>
    );
}
