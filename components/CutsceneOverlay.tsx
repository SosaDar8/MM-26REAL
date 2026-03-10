import React, { useEffect, useState } from 'react';
import { CutsceneData } from '../types';

interface CutsceneOverlayProps {
    data: CutsceneData;
    onComplete: () => void;
}

export const CutsceneOverlay: React.FC<CutsceneOverlayProps> = ({ data, onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [stepPhase, setStepPhase] = useState(0); // 0 or 1 for visual step

    useEffect(() => {
        // Only auto-complete if NOT practice
        if (data.type !== 'PRACTICE') {
            const timer = setTimeout(onComplete, data.duration);
            return () => clearTimeout(timer);
        }
    }, [data, onComplete]);

    const handleInteraction = () => {
        if (data.type !== 'PRACTICE') return;
        
        const newProgress = Math.min(100, progress + 8); // 12-13 taps to finish
        setProgress(newProgress);
        setStepPhase(prev => prev === 0 ? 1 : 0);

        if (newProgress >= 100) {
            setTimeout(onComplete, 500);
        }
    };

    // Keyboard listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                handleInteraction();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [progress, data.type]);

    const renderContent = () => {
        switch (data.type) {
            case 'CLASS':
                return (
                    <div className="w-full h-full bg-[#f0e6d2] flex flex-col items-center justify-center relative overflow-hidden border-8 border-[#8b4513]">
                        <div className="w-2/3 h-1/2 bg-[#2d3436] border-8 border-[#b2bec3] mb-8 relative p-4 shadow-xl">
                            <div className="text-white font-mono opacity-50 text-xl">
                                E = mc²<br/>
                                History of 1812<br/>
                                <span className="text-yellow-200">HOMEWORK DUE FRIDAY</span>
                            </div>
                        </div>
                        <div className="flex gap-8 items-end">
                             <div className="w-16 h-24 bg-blue-500 rounded-t-lg border-2 border-black"></div>
                             <div className="w-16 h-24 bg-red-500 rounded-t-lg border-2 border-black"></div>
                             <div className="w-16 h-24 bg-green-500 rounded-t-lg border-2 border-black"></div>
                        </div>
                        <h2 className="text-4xl font-black text-black z-10 mt-8 bg-white/80 px-4 border-2 border-black uppercase italic">Attending Lecture...</h2>
                    </div>
                );
            case 'DINNER':
                return (
                    <div className="w-full h-full bg-orange-100 flex flex-col items-center justify-center relative border-8 border-orange-300">
                        <div className="w-full max-w-3xl h-64 bg-white border-b-8 border-gray-300 flex items-end justify-center px-10 gap-8 relative shadow-lg">
                             <div className="w-20 h-32 bg-blue-500 rounded-t-lg animate-bounce"></div>
                             <div className="w-32 h-16 bg-red-200 mb-4 rounded flex flex-col items-center justify-center border-2 border-red-400 shadow-sm">
                                 <div className="w-16 h-2 bg-yellow-500 rounded"></div>
                                 <div className="text-[10px] font-bold text-red-800">SPAGHETTI DAY</div>
                             </div>
                             <div className="w-20 h-32 bg-green-500 rounded-t-lg animate-bounce delay-75"></div>
                        </div>
                        <h2 className="text-5xl font-black text-orange-600 z-10 mt-8 drop-shadow-md uppercase italic">Section Bonding</h2>
                        <p className="text-orange-400 font-bold mt-2">Section Hype Increased!</p>
                    </div>
                );
            case 'WORK_BURGER':
                return (
                    <div className="w-full h-full bg-red-100 flex flex-col items-center justify-center relative border-8 border-red-400">
                        <div className="absolute top-0 w-full h-32 bg-red-600 border-b-4 border-white flex items-center justify-center">
                            <span className="text-4xl font-black text-yellow-400 italic">BIG BURGER SHACK</span>
                        </div>
                        <div className="flex items-end mt-20 gap-4">
                            <div className="w-32 h-40 bg-gray-300 border-4 border-gray-500 flex flex-col items-center justify-end relative shadow-lg">
                                <div className="w-full h-4 bg-black/20 absolute top-0"></div>
                                <div className="text-xs text-gray-600 font-bold mb-2">GRILL</div>
                            </div>
                            <div className="w-16 h-32 bg-blue-600 rounded-t-lg border-2 border-black relative animate-pulse">
                                <div className="absolute top-4 left-2 w-12 h-16 bg-red-600 rounded border border-white"></div>
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-red-800 z-10 mt-8 uppercase italic">Flipping Burgers... (+$$$)</h2>
                    </div>
                );
            case 'PRACTICE':
                return (
                    <div 
                        className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden cursor-pointer select-none bg-black/40 backdrop-blur-sm"
                        onClick={handleInteraction}
                    >
                        <div className="z-10 mt-12 text-center animate-fade-in">
                            <h2 className="text-5xl font-black text-white drop-shadow-[4px_4px_0_rgba(0,0,0,0.8)] uppercase italic tracking-tighter mb-8">{data.text || "DRILL THE SETS"}</h2>
                            
                            <div className="mt-6 w-96 h-8 bg-black/50 border-4 border-white rounded-full overflow-hidden relative mx-auto shadow-xl">
                                <div 
                                    className="h-full bg-gradient-to-r from-green-400 to-emerald-600 transition-all duration-200 ease-out" 
                                    style={{ width: `${progress}%` }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-md">
                                    {Math.floor(progress)}%
                                </div>
                            </div>
                            
                            <p className="text-green-300 font-bold mt-4 animate-pulse text-xl drop-shadow-md">TAP SPACE TO PROGRESS!</p>
                        </div>
                    </div>
                );
            case 'NAP':
                return (
                    <div className="w-full h-full bg-blue-900 flex flex-col items-center justify-center relative border-8 border-blue-700">
                        <div className="w-64 h-32 bg-blue-300 rounded-lg relative border-4 border-blue-200 mt-20 shadow-2xl">
                            <div className="absolute -top-4 left-4 w-16 h-12 bg-white rounded-full"></div> 
                            <div className="absolute -top-8 left-10 text-white font-bold text-4xl animate-bounce">Z</div>
                            <div className="absolute -top-16 left-20 text-white font-bold text-2xl animate-bounce delay-100">z</div>
                        </div>
                        <h2 className="text-4xl font-black text-blue-200 z-10 mt-12 uppercase italic">Recharging...</h2>
                        <p className="text-blue-400 font-bold mt-2">Energy +40</p>
                    </div>
                );
            case 'CLUB':
            case 'PARTY':
                return (
                    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden border-8 border-purple-600">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/50 via-transparent to-blue-900/50 animate-pulse"></div>
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-gray-300 shadow-[0_0_50px_white] animate-pulse"></div>
                        <div className="flex gap-8 items-end relative z-10 h-64">
                             {[1,2,3,4,5].map(i => (
                                 <div key={i} className="w-12 bg-white rounded-t-lg animate-bounce" style={{ height: `${50 + Math.random() * 50}%`, animationDelay: `${i * 0.1}s`, backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)` }}></div>
                             ))}
                        </div>
                        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 z-10 mt-8 drop-shadow-[2px_2px_0_white] animate-pulse italic uppercase">Party Night</h2>
                        <p className="text-purple-400 font-bold mt-2">Hype +20 | Energy -30</p>
                    </div>
                );
            default:
                return (
                    <div className="w-full h-full bg-black flex items-center justify-center text-white">
                        <h2 className="text-4xl font-black uppercase italic">Processing Day...</h2>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black">
            {renderContent()}
        </div>
    );
};