import { twMerge } from "tailwind-merge";

interface HuddleTileLoaderProps {
    index?: number;
}

const HuddleTileLoader: React.FC<HuddleTileLoaderProps> = ({ index = 0 }) => {
    return (
        <div
            data-variant={"LOADER"}
            className={twMerge(
                `
                huddleTile
                relative
                w-full
                rounded-xl
                transition-all
                duration-250
                `
            )}
            style={{ opacity: 0.75 }}
        >
            <div
                className='
                absolute
                h-full 
                w-full
                flex
                flex-col
                gap-4
                border-4
                p-4
                rounded-xl
                -top-2
                left-2
                transition-all
                duration-250
                active:top-0
                active:left-0
                '
            >
                <div
                    className='w-full h-full animate-pulse'
                    style={{ animationDelay: `${index * 0.25}s` }}
                >
                    <div className='w-full flex '>
                        <div className='w-full'>
                            <div className='w-3/5 h-[1em] rounded bg-white/20'></div>
                        </div>
                        <div className=''>
                            <div className='w-32 h-[1.6em] rounded bg-white/20'></div>
                        </div>
                    </div>
                    <div className='flex gap-2 [&_>_.user-avatar]:bg-blend-color-dodge [&_>_.user-avatar]:bg-black-400'>
                        <div
                            className={"user-avatar w-7 h-7 rounded-full"}
                        ></div>
                        {Array(3)
                            .fill(0)
                            .map((invite, i) => (
                                <div
                                    key={i}
                                    className={
                                        "user-avatar w-7 h-7 rounded-full"
                                    }
                                ></div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HuddleTileLoader;
