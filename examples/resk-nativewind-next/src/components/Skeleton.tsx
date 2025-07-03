"use client";
export function Skeleton() {
    function toggleSkeletons() {
        const skeletons = document.querySelectorAll('.animate-pulse');
        skeletons.forEach(skeleton => {
            skeleton.classList.toggle('animate-pulse');
        });
    }
    return <>
        <div className="max-w-md mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Input Component Skeletons</h2>

            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
            </div>

            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>

            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                <div className="relative">
                    <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="absolute right-3 top-3 w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="relative">
                    <div className="h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="absolute left-3 top-3 w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-36 animate-pulse"></div>
                <div className="h-24 bg-gray-200 rounded-md animate-pulse"></div>
            </div>

            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="relative">
                    <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="absolute right-3 top-4 w-3 h-2 bg-gray-300 rounded animate-pulse"></div>
                </div>
            </div>
            <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="flex space-x-2">
                    <div className="h-10 bg-gray-200 rounded-md flex-1 animate-pulse"></div>
                    <div className="h-10 bg-gray-300 rounded-md w-20 animate-pulse"></div>
                </div>
            </div>
            <div className="pt-8">
                <button
                    onClick={toggleSkeletons}
                    className="w-full py-2 px-4 rounded-md"
                >
                    Toggle Skeleton Animation
                </button>
            </div>
        </div>

        <style type="text/css" dangerouslySetInnerHTML={{
            __html: `
            .animate-pulse {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }

            @keyframes pulse {
                0 %, 100 % {
                    opacity: 1;
                }
                    50% {
                opacity: .5;
                    }
                }
        `}}>

        </style>
    </>
}