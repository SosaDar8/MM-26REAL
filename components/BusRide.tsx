
import React, { useState, useEffect } from 'react';
import { GameState, GamePhase, InstrumentType } from '../types';
import { Button } from './Button';
import { BandMemberVisual } from './BandMemberVisual';
import { getRandomAppearance } from '../constants';

interface BusRideProps {
    gameState: GameState;
    onComplete: (actionResult?: string) => void;
}

export const BusRide: React.FC<BusRideProps> = ({ gameState, onComplete }) => {
    const [scrollPos, setScrollPos] = useState(0);
    const [message, setMessage] = useState("En route to the stadium...");
    const [actionsLeft, setActionsLeft] = useState(2);
    // Persist random buddy appearance so it doesn't change on re-renders
    const [buddyAppearance] = useState(() => getRandomAppearance());

    useEffect(() => {
        const interval = setInterval(() => {
            setScrollPos(prev => (prev + 2) % 1000);
        }, 16);
        return () => clearInterval(interval);
    }, []);

    const handleAction = (type: 'STUDY' | 'NAP' | 'HYPE') => {
        if (actionsLeft <= 0) return;
        setActionsLeft(prev => prev - 1);
        
        if (type === 'STUDY') {
            setMessage("Reviewing drill sheets... (+XP)");
        } else if (type === 'NAP') {
            setMessage("Catching some Z's... (+Energy)");
        } else if (type === 'HYPE') {
            setMessage("Leading a bus chant! (+Morale)");
        }
    };

    return (
        <div className="w-full h-full bg-black relative overflow-hidden font-mono text-white flex flex-col">
            
            {/* Window View (Parallax) */}
            <div className="h-2/3 w-full relative overflow-hidden bg-sky-300 border-b-8 border-gray-800">
                {/* Sun/Sky */}
                <div className="absolute top-4 right-10 w-24 h-24 bg-yellow-300 rounded-full blur-xl opacity-80 shadow-[0_0_50px_rgba(253,224,71,0.8)]"></div>
                
                {/* Clouds */}
                <div className="absolute top-10 w-[200%] flex opacity-80" style={{ transform: `translateX(-${scrollPos * 0.5}px)` }}>
                    <div className="w-48 h-16 bg-white rounded-full blur-sm mx-20 shadow-lg"></div>
                    <div className="w-64 h-20 bg-white rounded-full blur-sm mx-40 mt-8 shadow-lg"></div>
                    <div className="w-32 h-12 bg-white rounded-full blur-sm mx-10 -mt-4 shadow-lg"></div>
                    <div className="w-56 h-16 bg-white rounded-full blur-sm mx-32 mt-2 shadow-lg"></div>
                </div>

                {/* Distant Hills */}
                <div 
                    className="absolute bottom-16 w-[200%] h-40 bg-green-800 rounded-[100%] flex items-end opacity-90" 
                    style={{ transform: `translateX(-${scrollPos * 0.2}px)` }}
                ></div>
                <div 
                    className="absolute bottom-16 w-[200%] h-32 bg-green-700 rounded-[80%] flex items-end opacity-80 left-1/4" 
                    style={{ transform: `translateX(-${scrollPos * 0.3}px)` }}
                ></div>

                {/* Trees (Fast) */}
                <div 
                    className="absolute bottom-16 w-[200%] h-full flex items-end pointer-events-none" 
                    style={{ transform: `translateX(-${scrollPos * 2}px)` }}
                >
                    {[...Array(30)].map((_, i) => (
                        <div key={i} className="w-20 h-56 bg-green-900 mx-12 rounded-t-full border-l-8 border-black/20 relative flex flex-col items-center justify-end shadow-xl">
                            <div className="w-6 h-16 bg-[#5d4037] border-l-2 border-black/30"></div>
                        </div>
                    ))}
                </div>

                {/* Road */}
                <div className="absolute bottom-0 w-full h-16 bg-gray-700 border-t-4 border-gray-500 flex items-center overflow-hidden shadow-[inset_0_10px_20px_rgba(0,0,0,0.3)]">
                    <div className="w-[200%] h-2 flex gap-12" style={{ transform: `translateX(-${scrollPos * 4}px)` }}>
                        {[...Array(40)].map((_, i) => (
                            <div key={i} className="w-24 h-full bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.5)]"></div>
                        ))}
                    </div>
                </div>

                {/* Interior Bus Frame */}
                <div className="absolute inset-0 border-[40px] border-gray-800 rounded-lg pointer-events-none z-10 shadow-[inset_0_0_50px_rgba(0,0,0,0.9)]"></div>
                <div className="absolute top-1/2 left-0 w-full h-8 bg-gray-900 z-10 opacity-90 border-y-2 border-gray-700 shadow-2xl flex items-center justify-center">
                    <div className="w-full h-1 bg-black/50"></div>
                </div> {/* Window bar */}
            </div>

            {/* Bus Interior UI */}
            <div className="h-1/3 bg-[#222] p-6 flex gap-8 items-center z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] border-t-4 border-black">
                {/* Seats Visual */}
                <div className="w-1/3 flex justify-center items-end h-full bg-blue-900 rounded-t-xl border-4 border-blue-950 p-4 relative overflow-hidden shadow-[inset_0_20px_30px_rgba(0,0,0,0.6)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
                    {/* Headrests */}
                    <div className="absolute top-0 w-full h-16 bg-blue-800 rounded-t-xl border-b-4 border-blue-950 shadow-md"></div>
                    <div className="flex gap-8 transform scale-[1.35] translate-y-16 z-10 origin-bottom">
                        <BandMemberVisual 
                            instrument={InstrumentType.TRUMPET} 
                            uniform={gameState.uniforms[0]} 
                            appearance={gameState.director.appearance} // Player
                            showInstrument={false}
                            scale={1.5}
                        />
                        <BandMemberVisual 
                            instrument={InstrumentType.SNARE} 
                            uniform={gameState.uniforms[0]} 
                            appearance={buddyAppearance} // Fixed random appearance
                            showInstrument={false}
                            scale={1.5}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex-grow flex flex-col">
                    <h2 className="text-2xl font-black text-yellow-400 italic uppercase mb-2">ON THE ROAD</h2>
                    <div className="bg-black/50 p-2 mb-4 border border-gray-600 text-green-400 font-bold">
                        {message}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                        <Button 
                            onClick={() => handleAction('STUDY')} 
                            disabled={actionsLeft <= 0}
                            className="text-xs bg-blue-700 border-blue-500"
                        >
                            STUDY DRILL
                        </Button>
                        <Button 
                            onClick={() => handleAction('NAP')} 
                            disabled={actionsLeft <= 0}
                            className="text-xs bg-purple-700 border-purple-500"
                        >
                            POWER NAP
                        </Button>
                        <Button 
                            onClick={() => handleAction('HYPE')} 
                            disabled={actionsLeft <= 0}
                            className="text-xs bg-red-700 border-red-500"
                        >
                            SECTION HYPE
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center w-40">
                    <div className="text-4xl mb-2 animate-bounce">🚌</div>
                    <Button onClick={() => onComplete()} variant="success" className="w-full text-sm">ARRIVE AT STADIUM</Button>
                </div>
            </div>
        </div>
    );
};
