"use client";

import { useCallback } from "react";

import { twMerge } from "tailwind-merge";

interface FeedTabsProps {
    tabs: String[];
    activeTabIndex: number;
    onTabChange: (index: number) => void;
    className?: String;
}

const FeedTabs: React.FC<FeedTabsProps> = ({
    tabs,
    activeTabIndex: activeTab,
    onTabChange,
    className,
}) => {
    const activeIndicatorStyles = useCallback(() => {
        if (tabs.length > 0) {
            let left = activeTab / tabs.length;
            let right = 1 - left - 1 / tabs.length;

            return {
                left: `${left * 100}%`,
                right: `${right * 100}%`,
            };
        } else {
            return {
                left: 0,
                right: 0,
            };
        }
    }, [activeTab, tabs]);

    return (
        <div
            className={twMerge(
                `
                    relative
                    w-full
                    flex
                    justify-center
                    pb-2
                    mb-4
                    `,
                String(className)
            )}
        >
            <div
                id='active-indicator'
                style={activeIndicatorStyles()}
                className={twMerge(
                    `
                absolute
                bottom-0
                transition-all
                flex
                justify-center
                `
                )}
            >
                <div
                    id='active-indicator__bar'
                    style={{ width: `${tabs[activeTab].length - 1}ch` }}
                    className={twMerge(
                        `
                    h-1
                    bg-black/75            
                    rounded-t-lg
                    transition-all
                    `
                    )}
                ></div>
            </div>
            {tabs.map((tab, i) => (
                <div
                    key={i}
                    className='
                    flex-1
                    flex
                    justify-center
                    align-center
                    p-1
                    cursor-pointer
                '
                    onClick={() => onTabChange(i)}
                >
                    <h1
                        className={twMerge(
                            `text-lg font-semibold transition duration-150 whitespace-nowrap`,
                            i === activeTab ? "text-black" : "text-black/50"
                        )}
                    >
                        {tab}
                    </h1>
                </div>
            ))}
        </div>
    );
};

export default FeedTabs;
