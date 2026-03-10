
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { GameState, RoomDecoration } from '../types';
import { soundManager } from '../services/soundManager';
import { CutsceneOverlay } from './CutsceneOverlay';
import { BandMemberVisual } from './BandMemberVisual';

interface PracticeModeProps {
    onBack: () => void;
    gameState: GameState;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({ onBack, gameState }) => {
    const [phase, setPhase] = useState<'ROOM_VIEW' | 'MONTAGE' | 'RESULTS'>('ROOM_VIEW');
    const [montageIndex, setMontageIndex] = useState(0);

    const montageEvents = [
        { id: 'warmup', text: 'Sectionals: Tuning Up...', type: 'PRACTICE' as const, duration: 3000 },
        { id: 'drill', text: 'Learning New Drill Sets...', type: 'PRACTICE' as const, duration: 4000 },
        { id: 'full_run', text: 'Full Ensemble Run-Through!', type: 'PRACTICE' as const, duration: 5000 },
        { id: 'director_notes', text: 'Director Notes & Feedback', type: 'PRACTICE' as const, duration: 3000 },
    ];

    const startPractice = () => {
        setPhase('MONTAGE');
        setMontageIndex(0);
        soundManager.playBGM('practice'); // Assuming this exists or falls back
    };

    const handleCutsceneComplete = () => {
        if (montageIndex < montageEvents.length - 1) {
            setMontageIndex(prev => prev + 1);
        } else {
            setPhase('RESULTS');
        }
    };

    const renderBandRoom = () => {
        const room = gameState.bandRoom || { wallColor: '#333', floorColor: '#444', decorations: [] };
        
        return (
            <div className="absolute inset-0 overflow-hidden">
                {/* Room Background */}
                <div 
                    className="absolute inset-0"
                    style={{ 
                        backgroundColor: room.floorColor,
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                >
                    {/* Walls */}
                    <div className="absolute top-0 left-0 w-full h-1/3 border-b-8 border-black/20 shadow-xl" style={{ backgroundColor: room.wallColor }}></div>
                    
                    {/* Decorations */}
                    {room.decorations.map((decor: RoomDecoration) => (
                        <div 
                            key={decor.id}
                            className="absolute"
                            style={{ 
                                left: `${decor.x}%`, 
                                top: `${decor.y}%`, 
                                transform: `translate(-50%, -50%) scale(${decor.scale}) rotate(${decor.rotation}deg)` 
                            }}
                        >
                            {decor.type === 'POSTER' && <div className="w-24 h-32 bg-blue-900 border-4 border-white shadow-lg flex items-center justify-center text-xs text-white text-center p-2 font-bold">BAND POSTER</div>}
                            {decor.type === 'TROPHY' && <div className="text-6xl drop-shadow-lg">🏆</div>}
                            {decor.type === 'FURNITURE' && <div className="w-32 h-16 bg-amber-800 rounded-lg shadow-xl border-2 border-amber-900"></div>}
                            {decor.type === 'INSTRUMENT_RACK' && <div className="w-40 h-24 bg-gray-800 border-2 border-gray-600 flex items-end justify-around pb-2 shadow-xl"><div className="w-2 h-16 bg-yellow-600"></div><div className="w-2 h-16 bg-yellow-600"></div><div className="w-2 h-16 bg-yellow-600"></div></div>}
                            {decor.type === 'PLANT' && <div className="text-6xl drop-shadow-lg">🪴</div>}
                        </div>
                    ))}

                    {/* Band Members Hanging Out */}
                    {gameState.members.slice(0, 10).map((member, i) => (
                        <div 
                            key={member.id}
                            className="absolute transition-all duration-1000 ease-in-out"
                            style={{ 
                                left: `${20 + (i * 8)}%`, 
                                top: `${60 + (i % 2) * 10}%`,
                                zIndex: 10 + i
                            }}
                        >
                            <BandMemberVisual 
                                instrument={member.instrument}
                                uniform={gameState.uniforms.find(u => u.id === gameState.currentUniformId) || gameState.uniforms[0]}
                                appearance={member.appearance}
                                scale={0.8}
                                showInstrument={false}
                                view="FRONT"
                            />
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[8px] px-1 rounded whitespace-nowrap">
                                {member.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (phase === 'RESULTS') {
        return (
            <div className="h-full bg-slate-900 text-white flex flex-col items-center justify-center font-mono relative overflow-hidden">
                {renderBandRoom()}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
                
                <div className="relative z-10 text-center p-8 border-4 border-green-500 bg-gray-900 shadow-[0_0_50px_rgba(34,197,94,0.3)] animate-bounce-in">
                    <h1 className="text-5xl text-green-400 mb-6 font-pixel">PRACTICE COMPLETE</h1>
                    <div className="text-2xl mb-8 text-gray-300">Band Chemistry Increased!</div>
                    <div className="flex gap-4 justify-center">
                        <div className="bg-black p-4 border border-gray-700">
                            <div className="text-xs text-gray-500">SKILL</div>
                            <div className="text-xl text-green-400">+5</div>
                        </div>
                        <div className="bg-black p-4 border border-gray-700">
                            <div className="text-xs text-gray-500">ENERGY</div>
                            <div className="text-xl text-red-400">-10</div>
                        </div>
                    </div>
                    <Button onClick={onBack} className="mt-8 w-full">RETURN TO HUB</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-slate-900 text-white font-mono relative overflow-hidden">
            {renderBandRoom()}
            
            {phase === 'ROOM_VIEW' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="bg-black/80 p-8 border-4 border-white text-center backdrop-blur-md shadow-2xl">
                        <h1 className="text-4xl text-yellow-400 mb-4 font-pixel">BAND PRACTICE</h1>
                        <p className="text-gray-300 mb-8 max-w-md">
                            Time to hit the shed! Regular practice improves skill and chemistry but costs energy.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={startPractice} className="text-xl px-8 py-4 bg-green-600 hover:bg-green-500">START SESSION</Button>
                            <Button onClick={onBack} variant="secondary">CANCEL</Button>
                        </div>
                    </div>
                </div>
            )}

            {phase === 'MONTAGE' && (
                <CutsceneOverlay 
                    data={{
                        id: montageEvents[montageIndex].id,
                        type: montageEvents[montageIndex].type,
                        text: montageEvents[montageIndex].text,
                        duration: montageEvents[montageIndex].duration
                    }} 
                    onComplete={handleCutsceneComplete} 
                />
            )}
        </div>
    );
};
