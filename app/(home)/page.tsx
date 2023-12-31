"use client";

import FeedTabs from "@/components/FeedTabs";
import HuddleFeed from "@/components/HuddleFeed";
import { useState, useEffect } from "react";
import { HuddleSection } from "@/components/HuddleFeed";
import { huddleSorter } from "@/tools/huddleSorter";
import { useHuddles } from "@/hooks/useHuddles";
import { twMerge } from "tailwind-merge";
import Map from "@/components/Map";
import Marker from "@/components/Marker";
import { useLocations } from "@/hooks/useLocations";
import MarkerCurrent from "@/components/MarkerCurrent";
import { useSession } from "next-auth/react";
import AuthenticationModal from "@/components/AuthenticationModal";

export default function Home() {
    const {
        states: { huddleList, selectedHuddle, focusedHuddle },
        funcs: { setSelectedHuddle },
    } = useHuddles();
    const { status: sessionStatus, data: session } = useSession();
    const {
        states: { currentPosition },
    } = useLocations();

    const [activeTab, setActiveTab] = useState<number>(0);
    const [huddleSections, setHuddleSections] = useState<
        HuddleSection[] | null
    >(null);

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
                "h-full overflow-hidden w-full justify-center align-stretch",
                "flex-col overflow-hidden md:flex md:flex-row-reverse md:h-full relative",
                sessionStatus === "authenticated" && "max-w-screen-2xl"
            )}
        >
            <div
                className={twMerge(
                    "absolute w-full h-full md:h-auto top-0 md:static",
                    "p-0 md:p-4 md:pr-4",
                    sessionStatus === "unauthenticated" &&
                        "pointer-events-none opacity-50"
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
                                    onClick={() => {
                                        setSelectedHuddle((prev) =>
                                            prev && prev._id === huddle._id
                                                ? null
                                                : huddle
                                        );
                                    }}
                                    selected={
                                        selectedHuddle?._id === huddle._id
                                    }
                                    authorImgUrl={huddle.author.imgUrl}
                                    authorInitials={huddle.author.username.slice(
                                        0,
                                        2
                                    )}
                                />
                            ))}

                    {currentPosition && (
                        <MarkerCurrent
                            lat={currentPosition.coordinates.lat}
                            lng={currentPosition.coordinates.lng}
                        />
                    )}
                </Map>
            </div>

            <div
                className={twMerge(
                    "relative w-full h-full overflow-hidden overflow-y-auto z-[10]",
                    sessionStatus === "authenticated" && "md:max-w-[28rem]"
                    // "pointer-events-none"
                )}
            >
                {sessionStatus !== "loading" && !session && (
                    <div
                        className={twMerge(
                            "h-full w-full flex-center flex-col"
                        )}
                    >
                        <AuthenticationModal
                            className={"absolute bottom-12 md:static "}
                        />
                    </div>
                )}

                {sessionStatus !== "loading" && session && (
                    <>
                        <div
                            id='spacer'
                            className='md:hidden w-full h-[calc(100%_-_3.5rem)] pointer-events-none bg-transparent'
                        ></div>

                        <div
                            className={twMerge(
                                "pointer-events-auto",
                                "h-full w-full sticky top-0 p-4 pb-0 mx-auto z-[2] overflow-hidden",
                                "bg-[var(--background-color)] rounded-t-3xl",
                                "md:pr-0 md:relative"
                            )}
                        >
                            <div
                                className={twMerge(
                                    "h-full flex flex-col transition-[opacity]",
                                    focusedHuddle &&
                                        "opacity-60 pointer-events-none"
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
                                    "translate-y-0 transition-all duration-300 ease-in-out empty:pointer-events-none empty:translate-y-[100%]",
                                    "absolute top-0 bottom-0 left-0 right-0 m-0 rounded-t-3xl flex flex-col",
                                    "md:m-4 md:mr-0"
                                )}
                            ></div>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
