
import React, { useState, useEffect } from 'react';
import { Director, InstrumentType, Uniform } from '../types';
import { BandMemberVisual } from './BandMemberVisual';
import { Button } from './Button';

interface DirectorWalkInProps {
    director: Director;
    onComplete: (bonus: 'FUNDS' | 'FANS' | 'SKILL') => void;
}

export const DirectorWalkIn: React.FC<DirectorWalkInProps> = ({ director, onComplete }) => {
    const [scene, setScene] = useState<'WALKING' | 'ARRIVED' | 'CHOICE'>('WALKING');
    const [walkPos, setWalkPos] = useState(-20); // Start off screen left

    // Director's Outfit to Uniform converter for visual
    const getDirectorUniform = (): Uniform => {
        const outfit = director.outfits.find(o => o.id === director.currentOutfitId) || director.outfits[0] || { topColor: '#fff', bottomColor: '#000', style: 'casual' };
        return {
            id: 'cinematic_fit',
            name: 'Director',
            jacketColor: outfit.topColor || '#fff',
            pantsColor: outfit.bottomColor || '#000',
            hatColor: 'transparent', 
            plumeColor: 'transparent',
            hatStyle: 'none' as any,
            jacketStyle: outfit.style === 'tracksuit' ? 'tracksuit' : 'classic',
            pantsStyle: 'regular',
            isDrumMajor: false
        } as Uniform;
    };

    useEffect(() => {
        if (scene === 'WALKING') {
            const interval = setInterval(() => {
                setWalkPos(prev => {
                    if (prev >= 120) { // Walked across screen
                        setScene('ARRIVED');
                        return 120;
                    }
                    return prev + 0.5;
                });
            }, 16);
            return () => clearInterval(interval);
        } else if (scene === 'ARRIVED') {
            // Short delay before choice
            const timer = setTimeout(() => {
                setScene('CHOICE');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [scene]);

    return (
        <div className="w-full h-full bg-black relative overflow-hidden font-mono text-white">
            
            {/* CINEMATIC BARS */}
            <div className="absolute top-0 left-0 w-full h-16 bg-black z-50"></div>
            <div className="absolute bottom-0 left-0 w-full h-16 bg-black z-50"></div>

            {/* SCENE 1: WALKING ON CAMPUS */}
            {scene === 'WALKING' && (
                <div className="absolute inset-0 flex items-center bg-blue-300 overflow-hidden">
                    {/* Parallax Background */}
                    <div className="absolute bottom-16 w-[200%] h-64 bg-[#7f8c8d] flex items-end animate-[slide_10s_linear_infinite]" style={{ transform: `translateX(-${walkPos * 2}px)` }}>
                        {/* Buildings */}
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-40 h-full mx-10 bg-gray-700 border-4 border-gray-800 relative">
                                <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-100 opacity-50"></div>
                                <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-100 opacity-50"></div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-16 bg-black"></div>
                            </div>
                        ))}
                    </div>
                    {/* Ground */}
                    <div className="absolute bottom-0 w-full h-24 bg-green-800 border-t-8 border-green-600"></div>

                    {/* Walking Director */}
                    <div className="absolute bottom-20 z-10" style={{ left: `${walkPos}%`, transition: 'left 0.1s linear' }}>
                        <div className="transform scale-[2]">
                            <BandMemberVisual 
                                instrument={InstrumentType.MACE} // Mace implies conductor/director
                                showInstrument={false}
                                uniform={getDirectorUniform()}
                                appearance={director.appearance}
                                isPlaying={true} // Triggers march animation
                            />
                        </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 z-50 text-white italic text-xs">
                        Director {director.name} arriving on campus...
                    </div>
                </div>
            )}

            {/* SCENE 2 & 3: BAND HALL */}
            {(scene === 'ARRIVED' || scene === 'CHOICE') && (
                <div className="absolute inset-0 bg-[#2c3e50] flex flex-col items-center justify-center animate-fade-in">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brick-wall.png')] opacity-30"></div>
                    
                    {/* Band Hall Door */}
                    <div className="w-64 h-80 bg-[#34495e] border-8 border-[#2c3e50] relative shadow-2xl flex flex-col items-center">
                        <div className="w-full h-12 bg-black flex items-center justify-center border-b-4 border-gray-600">
                            <span className="text-yellow-500 font-bold tracking-widest text-xs uppercase">BAND HALL</span>
                        </div>
                        <div className="flex-grow w-full flex">
                            <div className="w-1/2 h-full border-r-2 border-black bg-[#2c3e50]"></div>
                            <div className="w-1/2 h-full border-l-2 border-black bg-[#2c3e50]"></div>
                        </div>
                    </div>

                    {/* Director Standing */}
                    <div className="absolute bottom-16 z-10">
                        <div className="transform scale-[3]">
                            <BandMemberVisual 
                                instrument={InstrumentType.MACE}
                                showInstrument={false}
                                uniform={getDirectorUniform()}
                                appearance={director.appearance}
                                isPlaying={false}
                            />
                        </div>
                    </div>

                    {/* Choice Overlay */}
                    {scene === 'CHOICE' && (
                        <div className="absolute bottom-20 w-full max-w-2xl px-8 z-50 animate-bounce-in">
                            <div className="bg-black/90 border-4 border-white p-6">
                                <p className="text-gray-400 text-sm mb-4 uppercase">What is your opening philosophy?</p>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => onComplete('FANS')}
                                        className="w-full text-left p-3 border border-gray-600 hover:bg-gray-800 hover:border-yellow-400 group transition-all"
                                    >
                                        <span className="text-yellow-400 font-bold mr-2">A.</span>
                                        <span className="text-white group-hover:italic">"This is my house now. We build a legacy."</span>
                                        <span className="float-right text-xs text-green-500 opacity-0 group-hover:opacity-100">+100 FANS</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => onComplete('FUNDS')}
                                        className="w-full text-left p-3 border border-gray-600 hover:bg-gray-800 hover:border-green-400 group transition-all"
                                    >
                                        <span className="text-green-400 font-bold mr-2">B.</span>
                                        <span className="text-white group-hover:italic">"We need resources to win. Focus on funding."</span>
                                        <span className="float-right text-xs text-green-500 opacity-0 group-hover:opacity-100">+$500 BUDGET</span>
                                    </button>

                                    <button 
                                        onClick={() => onComplete('SKILL')}
                                        className="w-full text-left p-3 border border-gray-600 hover:bg-gray-800 hover:border-blue-400 group transition-all"
                                    >
                                        <span className="text-blue-400 font-bold mr-2">C.</span>
                                        <span className="text-white group-hover:italic">"Discipline starts today. No mistakes."</span>
                                        <span className="float-right text-xs text-green-500 opacity-0 group-hover:opacity-100">+10 SKILL (ALL)</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
