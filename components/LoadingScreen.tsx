
import React, { useEffect, useState } from 'react';
import { GAME_TIPS } from '../constants';

interface LoadingScreenProps {
    onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [tip, setTip] = useState("");

    useEffect(() => {
        // Pick a random tip on mount
        setTip(GAME_TIPS[Math.floor(Math.random() * GAME_TIPS.length)]);

        // Simulate loading
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500); // Small delay after 100%
                    return 100;
                }
                // Random increments
                return prev + Math.floor(Math.random() * 5) + 1;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full bg-black text-white flex flex-col items-center justify-center font-mono relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/50"></div>
            
            <div className="z-10 w-2/3 max-w-lg">
                <div className="flex justify-between items-end mb-2">
                    <h2 className="text-4xl font-black text-yellow-400 italic tracking-widest animate-pulse">LOADING</h2>
                    <span className="text-xl font-bold">{progress}%</span>
                </div>

                <div className="w-full h-6 bg-gray-800 border-2 border-white rounded-sm overflow-hidden p-1">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-100 ease-out" 
                        style={{ width: `${progress}%` }}
                    >
                         <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.2)_10px,rgba(255,255,255,0.2)_20px)]"></div>
                    </div>
                </div>
                
                <div className="mt-8 bg-gray-900 border-l-4 border-yellow-500 p-4 shadow-lg min-h-[100px] flex items-center">
                    <p className="text-lg text-gray-300">
                        {tip}
                    </p>
                </div>
            </div>

            {/* Decor */}
            <div className="absolute bottom-10 flex gap-4 opacity-30">
                 {[...Array(5)].map((_, i) => (
                     <div key={i} className="w-8 h-12 bg-gray-700 animate-bounce" style={{ animationDelay: `${i*0.1}s` }}></div>
                 ))}
            </div>
        </div>
    );
};
