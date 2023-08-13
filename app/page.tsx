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

export default function Home() {
    const { currentUser } = useUser();
    const { setSelectedHuddle, huddleList, selectedHuddle } = useHuddles();

    const [activeTab, setActiveTab] = useState<number>(0);
    const [huddleSections, setHuddleSections] = useState<
        HuddleSection[] | null
    >(null);

    useEffect(() => {
        console.log(huddleSections);
    }, [huddleList]);

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
                    `h-full w-full mx-auto overflow-hidden flex flex-col justify-center align-stretch`,
                    // `shadow-xl shadow-black rounded-t-[3rem] p-4 pb-0 gap-4 bg-white`,
                    `p-8 pb-0 max-w-[36rem] shadow-none`
                )}
            >
                <FeedTabs
                    tabs={["By Plan", "By Timeline"]}
                    activeTabIndex={activeTab}
                    onTabChange={handleTabChange}
                />
                <HuddleFeed huddleSections={huddleSections} />
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
