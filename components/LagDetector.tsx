import React, { useState, useEffect, useRef } from 'react';

export const LagDetector: React.FC = () => {
    const [isLagging, setIsLagging] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());
    const lagFrames = useRef(0);

    useEffect(() => {
        let animationFrameId: number;

        const checkFPS = () => {
            const now = performance.now();
            frameCount.current++;

            if (now - lastTime.current >= 1000) {
                const fps = frameCount.current;
                
                if (fps < 30) {
                    lagFrames.current++;
                    if (lagFrames.current > 3 && !showWarning) {
                        setIsLagging(true);
                        setShowWarning(true);
                    }
                } else {
                    lagFrames.current = 0;
                    setIsLagging(false);
                }

                frameCount.current = 0;
                lastTime.current = now;
            }
            animationFrameId = requestAnimationFrame(checkFPS);
        };

        animationFrameId = requestAnimationFrame(checkFPS);

        return () => cancelAnimationFrame(animationFrameId);
    }, [showWarning]);

    if (!showWarning) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] bg-red-900 border-2 border-red-500 p-4 text-white shadow-lg animate-bounce-in max-w-sm">
            <h3 className="font-bold text-red-300 mb-2 flex items-center gap-2">
                <span>⚠️</span> PERFORMANCE WARNING
            </h3>
            <p className="text-sm mb-4">
                We've detected significant lag. To improve performance, try the following:
            </p>
            <ul className="text-xs list-disc pl-4 mb-4 space-y-1 text-gray-300">
                <li>Close other browser tabs or applications.</li>
                <li>Ensure hardware acceleration is enabled in your browser settings.</li>
                <li>If playing a rhythm game, try a lower difficulty.</li>
                <li>Refresh the page if the issue persists.</li>
            </ul>
            <button 
                onClick={() => setShowWarning(false)}
                className="w-full bg-red-800 hover:bg-red-700 border border-red-500 py-1 text-xs"
            >
                DISMISS
            </button>
        </div>
    );
};
