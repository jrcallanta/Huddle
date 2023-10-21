import { HuddleType, HuddleTypeForTile } from "@/types";
import HuddleTileLoader from "./HuddleTileLoader";
import { twMerge } from "tailwind-merge";
import HuddleSection from "./HuddleSection";
import { BsPlus } from "react-icons/bs";
import { useHuddles } from "@/hooks/useHuddles";
import { useState } from "react";
import DetailsModal from "./DetailsModal";

export interface HuddleSection {
    title: string;
    huddles: HuddleTypeForTile[];
    emptyNote?: string;
}

interface HuddleFeedProps {
    huddleSections: HuddleSection[] | null;
}

const HuddleFeed: React.FC<HuddleFeedProps> = ({ huddleSections }) => {
    const {
        funcs: { getHuddleTemplate, refreshHuddles, setFocusedHuddle },
    } = useHuddles();

    const [isCreatingNewHuddle, setIsCreatingNewHuddle] = useState(false);

    const handleSaveNewHuddle = async (newHuddle: HuddleType) => {
        console.log(newHuddle);

        let data = await fetch("/api/huddle", {
            method: "POST",
            body: JSON.stringify({
                huddle: newHuddle,
            }),
        })
            .then((res) => res.json())
            .then(async (data) => {
                if (data.newHuddle) {
                    await refreshHuddles();
                    setFocusedHuddle(data.newHuddle as HuddleTypeForTile);
                    setTimeout(() => setIsCreatingNewHuddle(false), 0);
                }

                return data;
            });

        return new Promise(() => data);
    };

    return (
        <div
            className={twMerge(
                "h-full w-full overflow-hidden overflow-y-auto no-scrollbar justify-start gap-4 py-8 pr-1 md:pr-2",
                "rounded-t-3xl"
                // !huddleSections && "overflow-y-hidden"
            )}
        >
            <div className="w-full h-fit flex flex-col justify-start items-stretch gap-4 cursor-auto [&:has(.huddleTile[data-variant='LOADER'])]:pr-2">
                {huddleSections && (
                    <>
                        <div className='flex justify-center items-center mb-8'>
                            <button
                                className={twMerge(
                                    "flex gap-2 text text-sm uppercase font-extrabold whitespace-nowrap py-1 px-4 pr-2 border-[3px] border-black rounded-full",
                                    "border-[3px] border-black rounded-full flex justify-center items-center"
                                )}
                                onClick={() => setIsCreatingNewHuddle(true)}
                            >
                                <span>create new huddle</span>
                                <BsPlus
                                    size={20}
                                    color='black'
                                    strokeWidth={1}
                                />
                            </button>

                            {isCreatingNewHuddle && (
                                <DetailsModal
                                    huddle={getHuddleTemplate()}
                                    isUpdatingInviteStatus={false}
                                    isInEditingMode={true}
                                    actionsBarActions={{
                                        huddleEditActions: {
                                            onSaveChanges: handleSaveNewHuddle,
                                            preventDiscard: true,
                                        },
                                        huddleInviteResponseActions: undefined,
                                    }}
                                    onClose={() =>
                                        setIsCreatingNewHuddle(false)
                                    }
                                    onRefresh={refreshHuddles}
                                />
                            )}
                        </div>

                        {huddleSections
                            .filter(
                                (section) =>
                                    section.huddles.length || section.emptyNote
                            )
                            .map((section, i) => (
                                <HuddleSection
                                    key={section.title}
                                    title={section.title}
                                    huddles={section.huddles}
                                    emptyNote={section.emptyNote}
                                />
                            ))}
                    </>
                )}

                {!huddleSections && (
                    <>
                        {Array(8)
                            .fill(0)
                            .map((e, i) => (
                                <HuddleTileLoader key={i} index={i} />
                            ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default HuddleFeed;
