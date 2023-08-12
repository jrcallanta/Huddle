const Loading: React.FC = () => {
    return (
        <div className='w-full h-full flex justify-center items-center '>
            <div
                className='border-8 border-black/20 rounded-full w-16 h-16 animate-spin-ease'
                style={{ rotate: "45deg" }}
            >
                <div className='w-2 h-2 rounded-full bg-black'></div>
            </div>
        </div>
    );
};

export default Loading;
