import React, { useState } from 'react';
import { GameState, RoomDecoration } from '../types';
import { Button } from './Button';

interface BandRoomEditorProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    onClose: () => void;
}

export const BandRoomEditor: React.FC<BandRoomEditorProps> = ({ gameState, setGameState, onClose }) => {
    const [selectedDecorType, setSelectedDecorType] = useState<RoomDecoration['type']>('POSTER');

    const handleAddDecoration = () => {
        const newDecor: RoomDecoration = {
            id: `decor_${Date.now()}`,
            type: selectedDecorType,
            x: 50,
            y: 50,
            scale: 1,
            rotation: 0
        };
        setGameState(prev => ({
            ...prev,
            bandRoom: {
                wallColor: prev.bandRoom?.wallColor || '#333',
                floorColor: prev.bandRoom?.floorColor || '#444',
                decorations: [...(prev.bandRoom?.decorations || []), newDecor]
            }
        }));
    };

    const updateDecoration = (id: string, updates: Partial<RoomDecoration>) => {
        setGameState(prev => ({
            ...prev,
            bandRoom: {
                ...prev.bandRoom!,
                decorations: prev.bandRoom!.decorations.map(d => d.id === id ? { ...d, ...updates } : d)
            }
        }));
    };

    const removeDecoration = (id: string) => {
        setGameState(prev => ({
            ...prev,
            bandRoom: {
                ...prev.bandRoom!,
                decorations: prev.bandRoom!.decorations.filter(d => d.id !== id)
            }
        }));
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-fade-in">
            <div className="bg-gray-900 border-4 border-yellow-500 text-white p-6 rounded-xl w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl relative">
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                    <h2 className="text-3xl font-black text-yellow-400 uppercase tracking-widest">Band Room Editor</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
                </div>

                <div className="flex flex-grow gap-4 overflow-hidden">
                    {/* Controls Sidebar */}
                    <div className="w-64 bg-gray-800 p-4 rounded-lg flex flex-col gap-4 overflow-y-auto border border-gray-700">
                        <div>
                            <label className="text-xs text-gray-400 font-bold block mb-1">WALL COLOR</label>
                            <input 
                                type="color" 
                                value={gameState.bandRoom?.wallColor || '#333333'} 
                                onChange={e => setGameState(prev => ({...prev, bandRoom: {...(prev.bandRoom || { decorations: [], floorColor: '#444' }), wallColor: e.target.value, decorations: prev.bandRoom?.decorations || [] }}))}
                                className="w-full h-10 rounded cursor-pointer border-2 border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 font-bold block mb-1">FLOOR COLOR</label>
                            <input 
                                type="color" 
                                value={gameState.bandRoom?.floorColor || '#444444'} 
                                onChange={e => setGameState(prev => ({...prev, bandRoom: {...(prev.bandRoom || { decorations: [], wallColor: '#333' }), floorColor: e.target.value, decorations: prev.bandRoom?.decorations || [] }}))}
                                className="w-full h-10 rounded cursor-pointer border-2 border-gray-600"
                            />
                        </div>
                        <div className="border-t border-gray-700 pt-4">
                            <label className="text-xs text-gray-400 font-bold block mb-2">ADD DECORATION</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['POSTER', 'TROPHY', 'FURNITURE', 'INSTRUMENT_RACK', 'PLANT', 'CHAIRS', 'PODIUM', 'SHELVES', 'FRAT_LETTERS', 'OLD_PICTURES', 'BANNER'] as const).map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => setSelectedDecorType(type)}
                                        className={`p-2 text-[10px] font-bold border rounded transition-all ${selectedDecorType === type ? 'bg-yellow-600 border-yellow-400 text-black shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                            <Button onClick={handleAddDecoration} className="w-full mt-4 bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 shadow-lg">PLACE ITEM</Button>
                        </div>
                        
                        <div className="mt-auto text-[10px] text-gray-500 italic">
                            Tip: Drag items in the preview to move them.
                        </div>
                    </div>

                    {/* Room Preview */}
                    <div className="flex-grow bg-gray-950 border-4 border-gray-700 rounded-lg relative overflow-hidden shadow-inner group/preview">
                        <div 
                            className="absolute inset-0"
                            style={{ 
                                backgroundColor: gameState.bandRoom?.floorColor || '#444',
                                backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                                backgroundSize: '40px 40px'
                            }}
                        >
                            {/* Walls (Perspective) */}
                            <div className="absolute top-0 left-0 w-full h-1/3 border-b-8 border-black/30 shadow-xl" style={{ backgroundColor: gameState.bandRoom?.wallColor || '#333' }}></div>
                            
                            {/* Decorations */}
                            {gameState.bandRoom?.decorations.map(decor => (
                                <div 
                                    key={decor.id}
                                    className="absolute cursor-move group transition-transform active:scale-105"
                                    style={{ 
                                        left: `${decor.x}%`, 
                                        top: `${decor.y}%`, 
                                        transform: `translate(-50%, -50%) scale(${decor.scale}) rotate(${decor.rotation}deg)`,
                                        zIndex: Math.floor(decor.y) // Simple depth sorting
                                    }}
                                >
                                    <div className="relative">
                                        {/* Visuals for decorations */}
                                        {decor.type === 'POSTER' && (
                                            <div className="w-16 h-24 bg-blue-900 border-2 border-white shadow-lg flex items-center justify-center text-[8px] text-white text-center p-1 transform hover:scale-110 transition-transform">
                                                <div className="w-full h-full border border-white/20 flex items-center justify-center bg-gradient-to-br from-blue-800 to-blue-950">
                                                    BAND<br/>PRIDE
                                                </div>
                                            </div>
                                        )}
                                        {decor.type === 'TROPHY' && <div className="text-4xl drop-shadow-md filter hover:brightness-125 transition-all">🏆</div>}
                                        {decor.type === 'FURNITURE' && (
                                            <div className="w-24 h-12 bg-[#5d4037] rounded shadow-xl border border-[#3e2723] flex items-center justify-center">
                                                <div className="w-20 h-8 bg-[#4e342e] rounded-sm"></div>
                                            </div>
                                        )}
                                        {decor.type === 'INSTRUMENT_RACK' && (
                                            <div className="w-32 h-20 bg-gray-800 border-4 border-gray-600 flex items-end justify-around pb-2 shadow-xl">
                                                <div className="w-2 h-14 bg-yellow-600 rounded-t"></div>
                                                <div className="w-2 h-14 bg-yellow-600 rounded-t"></div>
                                                <div className="w-2 h-14 bg-yellow-600 rounded-t"></div>
                                                <div className="w-2 h-14 bg-yellow-600 rounded-t"></div>
                                            </div>
                                        )}
                                        {decor.type === 'PLANT' && <div className="text-4xl drop-shadow-lg">🪴</div>}
                                        {decor.type === 'CHAIRS' && (
                                            <div className="grid grid-cols-4 gap-2 opacity-80">
                                                {Array.from({length: 12}).map((_, i) => (
                                                    <div key={i} className="w-6 h-6 bg-gray-700 border-t-2 border-gray-500 rounded-t-full shadow-md"></div>
                                                ))}
                                            </div>
                                        )}
                                        {decor.type === 'PODIUM' && (
                                            <div className="w-24 h-16 bg-[#3e2723] border-t-4 border-[#5d4037] shadow-2xl flex items-center justify-center">
                                                <div className="w-16 h-12 border-2 border-[#5d4037] opacity-50"></div>
                                            </div>
                                        )}
                                        {decor.type === 'SHELVES' && (
                                            <div className="w-32 h-40 bg-[#4e342e] border-4 border-[#3e2723] flex flex-col justify-evenly shadow-xl">
                                                <div className="w-full h-2 bg-[#3e2723]"></div>
                                                <div className="w-full h-2 bg-[#3e2723]"></div>
                                                <div className="w-full h-2 bg-[#3e2723]"></div>
                                            </div>
                                        )}
                                        {decor.type === 'FRAT_LETTERS' && (
                                            <div className="text-5xl font-serif text-blue-500 font-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.5)] tracking-widest">
                                                ΚΚΨ
                                            </div>
                                        )}
                                        {decor.type === 'OLD_PICTURES' && (
                                            <div className="flex gap-2">
                                                <div className="w-16 h-12 bg-gray-300 border-4 border-white shadow-md transform -rotate-6 grayscale"></div>
                                                <div className="w-12 h-16 bg-gray-400 border-4 border-white shadow-md transform rotate-3 sepia"></div>
                                                <div className="w-16 h-12 bg-gray-300 border-4 border-white shadow-md transform -rotate-2 grayscale"></div>
                                            </div>
                                        )}
                                        {decor.type === 'BANNER' && (
                                            <div className="w-64 h-20 bg-blue-800 border-4 border-yellow-500 shadow-xl flex flex-col items-center justify-center text-white">
                                                <div className="text-xl font-black uppercase tracking-widest">{gameState.bandName}</div>
                                                <div className="text-xs font-bold text-yellow-400 uppercase">{gameState.identity.location || gameState.identity.schoolName}</div>
                                            </div>
                                        )}

                                        {/* Controls Overlay */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex gap-1 bg-black/90 p-1 rounded-full shadow-xl z-[100] border border-white/20">
                                            <button onClick={() => updateDecoration(decor.id, { x: Math.max(0, Math.min(100, decor.x - 5)) })} className="text-white text-xs w-6 h-6 hover:bg-gray-700 rounded-full">←</button>
                                            <button onClick={() => updateDecoration(decor.id, { x: Math.max(0, Math.min(100, decor.x + 5)) })} className="text-white text-xs w-6 h-6 hover:bg-gray-700 rounded-full">→</button>
                                            <button onClick={() => updateDecoration(decor.id, { y: Math.max(0, Math.min(100, decor.y - 5)) })} className="text-white text-xs w-6 h-6 hover:bg-gray-700 rounded-full">↑</button>
                                            <button onClick={() => updateDecoration(decor.id, { y: Math.max(0, Math.min(100, decor.y + 5)) })} className="text-white text-xs w-6 h-6 hover:bg-gray-700 rounded-full">↓</button>
                                            <div className="w-px bg-gray-600 mx-1"></div>
                                            <button onClick={() => removeDecoration(decor.id)} className="text-red-500 text-xs w-6 h-6 hover:bg-red-900/50 rounded-full font-bold">×</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
