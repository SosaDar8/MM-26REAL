
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
                <div className="absolute top-4 right-10 w-24 h-24 bg-yellow-300 rounded-full blur-xl opacity-80"></div>
                
                {/* Distant Hills */}
                <div 
                    className="absolute bottom-0 w-[200%] h-32 bg-green-800 rounded-[50%] flex items-end" 
                    style={{ transform: `translateX(-${scrollPos * 0.2}px)` }}
                ></div>

                {/* Trees (Fast) */}
                <div 
                    className="absolute bottom-0 w-[200%] h-full flex items-end pointer-events-none" 
                    style={{ transform: `translateX(-${scrollPos * 2}px)` }}
                >
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-32 h-64 bg-green-900 mx-20 rounded-t-full border-l-4 border-black/20 relative">
                            <div className="absolute bottom-0 w-8 h-32 bg-brown-800 left-1/2 -translate-x-1/2 bg-[#5d4037]"></div>
                        </div>
                    ))}
                </div>

                {/* Road */}
                <div className="absolute bottom-0 w-full h-16 bg-gray-600 border-t-4 border-gray-500">
                    <div className="w-full h-2 mt-6 bg-dashed border-t-4 border-white/50 border-dashed"></div>
                </div>

                {/* Interior Bus Frame */}
                <div className="absolute inset-0 border-[40px] border-gray-800 rounded-lg pointer-events-none z-10 shadow-inner"></div>
                <div className="absolute top-1/2 left-0 w-full h-4 bg-gray-400 z-10 opacity-50"></div> {/* Window bar */}
            </div>

            {/* Bus Interior UI */}
            <div className="h-1/3 bg-[#333] p-6 flex gap-8 items-center z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
                {/* Seats Visual */}
                <div className="w-1/3 flex justify-center items-end h-full bg-blue-900 rounded-t-lg border-4 border-blue-950 p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="flex gap-4 transform scale-125 translate-y-4">
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
