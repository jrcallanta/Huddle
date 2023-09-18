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
                `h-full overflow-hidden w-full max-w-screen-2xl flex justify-center align-stretch`,
                // `flex-col-reverse`,
                `flex-row`
            )}
        >
            <div
                className={twMerge(
                    `h-full w-full mx-auto overflow-hidden flex flex-col justify-center align-stretch relative`,
                    // `shadow-xl shadow-black rounded-t-[3rem] p-4 pb-0 gap-4 bg-white`,
                    `p-8 pb-0 pr-4 md:pr-8 max-w-[36rem] shadow-none`,
                    ``
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
                        "absolute z-20 top-0 min-h-[calc(100%-4rem)] left-0 right-0 m-8 mr-2 md:mr-4 rounded-3xl flex flex-col",
                        !focusedHuddle && "translate-y-[calc(100%_+_2rem)]"
                    )}
                ></div>

                {/* <DetailsModal
                    huddle={focusedHuddle}
                    onClose={() => setFocusedHuddle(null)}
                    onRefresh={refreshHuddles}
                /> */}
            </div>

            <div className={twMerge(`w-full h-full`, `p-8 pl-4`)}>
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
                                    }}
                                />
                            ))}
                </Map>
            </div>
        </main>
    );
}
