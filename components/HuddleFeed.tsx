import { HuddleTypeForTile } from "@/types";
import HuddleTileLoader from "./HuddleTileLoader";
import { twMerge } from "tailwind-merge";
import HuddleSection from "./HuddleSection";

export interface HuddleSection {
    title: string;
    huddles: HuddleTypeForTile[];
    emptyNote?: string;
}

interface HuddleFeedProps {
    huddleSections: HuddleSection[] | null;
}

const HuddleFeed: React.FC<HuddleFeedProps> = ({ huddleSections }) => {
    return (
        <div
            className={twMerge(
                "h-full w-full overflow-hidden overflow-y-auto no-scrollbar justify-start gap-4 py-8 pr-1 md:pr-2",
                "rounded-t-3xl"
                // !huddleSections && "overflow-y-hidden"
            )}
        >
            <div className="w-full h-fit flex flex-col justify-start items-stretch gap-4 cursor-auto [&:has(.huddleTile[data-variant='LOADER'])]:pr-2">
                {huddleSections &&
                    huddleSections
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
