export interface DeviceDefinition {
    id: string;
    name: string;
    width: number;
    height: number;
    frameImage: string;
    screenStyle: {
        top: string;
        left: string;
        width: string;
        height: string;
        borderRadius?: string;
        transform?: string;
        zIndex?: number;
    };
}

interface DeviceFrameProps {
    definition: DeviceDefinition;
    userImage: string | null;
}

export default function DeviceFrame({ definition, userImage }: DeviceFrameProps) {
    return (
        <div style={{ aspectRatio: `${definition.width}/${definition.height}` }} className="relative h-full max-h-[80vh] w-auto max-w-full mx-auto shadow-2xl rounded-3xl overflow-hidden">
            {/* Main Frame Image */}
            <img
                src={definition.frameImage}
                alt={`${definition.name} Frame`}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
            />

            {/* User Content */}
            <div
                className="absolute overflow-hidden bg-black"
                style={{
                    top: definition.screenStyle.top,
                    left: definition.screenStyle.left,
                    width: definition.screenStyle.width,
                    height: definition.screenStyle.height,
                    borderRadius: definition.screenStyle.borderRadius || '0px',
                    transform: definition.screenStyle.transform || 'none',
                    zIndex: definition.screenStyle.zIndex || 1
                }}
            >
                {userImage ? (
                    <img
                        src={userImage}
                        alt="User Design"
                        className="w-full h-full object-cover"
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'translateZ(0)',
                            willChange: 'transform',
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500 p-4 text-center">
                        <span className="text-sm font-medium">Upload Design</span>
                    </div>
                )}
            </div>

            {/* Fallback Background */}
            <div className="absolute inset-0 bg-transparent z-0" />
        </div>
    );
}
