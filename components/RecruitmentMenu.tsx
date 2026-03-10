
import React, { useState } from 'react';
import { GameState, BandMember, InstrumentType } from '../types';
import { Button } from './Button';
import { RECRUIT_NAMES, RECRUIT_SURNAMES, getRandomAppearance, FEEDER_SCHOOLS } from '../constants';
import { BandMemberVisual } from './BandMemberVisual';

interface RecruitmentMenuProps {
    gameState: GameState;
    onRecruit: (member: BandMember, cost: number) => void;
    onRunStrategy: (cost: number, tier: 'LOW' | 'MID' | 'HIGH') => void;
    onBack: () => void;
}

export const RecruitmentMenu: React.FC<RecruitmentMenuProps> = ({ gameState, onRecruit, onRunStrategy, onBack }) => {
    const [selectedRecruit, setSelectedRecruit] = useState<BandMember | null>(null);
    const [viewingSchools, setViewingSchools] = useState(false);

    const handleVisitSchool = (schoolName: string) => {
        // Run strategy but simulate visiting a specific school visually
        onRunStrategy(50, 'LOW'); 
        setViewingSchools(false);
    };

    const confirmRecruit = () => {
        if (selectedRecruit) {
            onRecruit(selectedRecruit, selectedRecruit.salary);
            setSelectedRecruit(null);
        }
    };

    return (
        <div className="h-full bg-[#0a0a0f] p-8 text-white font-mono overflow-y-auto relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
            
            <header className="flex justify-between items-center mb-8 border-b-4 border-red-600 pb-4 relative z-10">
                <div>
                    <h1 className="text-4xl text-white font-pixel tracking-tighter italic">SCOUTING CENTER</h1>
                    <p className="text-red-500 uppercase text-[10px] font-bold mt-1 tracking-widest">Build the championship roster</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-black/80 px-6 py-2 border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                        <span className="text-[10px] text-green-500 block font-black">PROGRAM BUDGET</span>
                        <span className="text-2xl font-bold font-pixel">${gameState.funds}</span>
                    </div>
                    <Button onClick={onBack} variant="secondary">EXIT</Button>
                </div>
            </header>

            {/* School Selection Modal */}
            {viewingSchools && (
                <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-8">
                    <div className="bg-white text-black p-6 max-w-lg w-full border-4 border-blue-500 shadow-2xl relative">
                        <h2 className="text-2xl font-black uppercase mb-4 border-b-2 border-black pb-2">Select School to Visit</h2>
                        <div className="space-y-2">
                            {FEEDER_SCHOOLS.map((school, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleVisitSchool(school)}
                                    className="w-full text-left p-3 border-2 border-gray-300 hover:bg-blue-100 hover:border-blue-500 transition-colors font-bold"
                                >
                                    {school}
                                </button>
                            ))}
                        </div>
                        <Button onClick={() => setViewingSchools(false)} variant="secondary" className="mt-4 w-full">CANCEL</Button>
                    </div>
                </div>
            )}

            {/* Approval Modal */}
            {selectedRecruit && (
                <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-8">
                    <div className="bg-white text-black p-6 max-w-lg w-full border-4 border-yellow-500 shadow-2xl relative">
                        <h2 className="text-2xl font-black uppercase mb-4 border-b-2 border-black pb-2">Director's Report</h2>
                        
                        <div className="flex gap-4 mb-4">
                            <div className="w-24 h-32 bg-gray-200 border-2 border-black">
                                <BandMemberVisual 
                                    instrument={selectedRecruit.instrument} 
                                    uniform={gameState.uniforms[0]} 
                                    appearance={selectedRecruit.appearance} 
                                    scale={0.8}
                                />
                            </div>
                            <div>
                                <div className="text-xl font-bold">{selectedRecruit.name}</div>
                                <div className="text-sm font-mono text-gray-600">{selectedRecruit.instrument}</div>
                                <div className="mt-2 text-sm bg-yellow-50 p-2 border border-yellow-200">
                                    <span className="font-bold text-yellow-800">NOTES: </span>
                                    <span className="italic block mt-1">"{selectedRecruit.directorNote || "No specific concerns. Seems solid."}"</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <Button onClick={confirmRecruit} variant="success" className="flex-1">APPROVE & HIRE (${selectedRecruit.salary})</Button>
                            <Button onClick={() => setSelectedRecruit(null)} variant="secondary" className="flex-1">REJECT</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Recruitment Methods</h2>
                    <div className="bg-gray-900 border-2 border-gray-800 p-4 space-y-4">
                        <div className="bg-black p-4 border-l-4 border-yellow-500 hover:bg-yellow-900/10 cursor-pointer group transition-all" onClick={() => setViewingSchools(true)}>
                            <h3 className="font-bold text-sm text-yellow-400 group-hover:translate-x-1 transition-transform">Visit Feeder School</h3>
                            <p className="text-[9px] text-gray-500 mt-1 uppercase">Scout local talent personally</p>
                            <div className="text-xs mt-3 text-white font-bold">$50 (Travel)</div>
                        </div>
                        <div className="bg-black p-4 border-l-4 border-blue-500 hover:bg-blue-900/10 cursor-pointer group transition-all" onClick={() => onRunStrategy(300, 'MID')}>
                            <h3 className="font-bold text-sm text-blue-400 group-hover:translate-x-1 transition-transform">Regional Ads</h3>
                            <p className="text-[9px] text-gray-500 mt-1 uppercase">Proven Section Leaders</p>
                            <div className="text-xs mt-3 text-white font-bold">$300</div>
                        </div>
                        <div className="bg-black p-4 border-l-4 border-purple-500 hover:bg-purple-900/10 cursor-pointer group transition-all" onClick={() => onRunStrategy(1500, 'HIGH')}>
                            <h3 className="font-bold text-sm text-purple-400 group-hover:translate-x-1 transition-transform">National Search</h3>
                            <p className="text-[9px] text-gray-500 mt-1 uppercase">Elite Prodigy Talent</p>
                            <div className="text-xs mt-3 text-white font-bold">$1,500</div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Active Prospects ({gameState.recruitPool.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gameState.recruitPool.length === 0 && (
                            <div className="col-span-full border-4 border-dashed border-gray-800 h-64 flex flex-col items-center justify-center opacity-30">
                                <span className="text-6xl mb-4">📡</span>
                                <p className="font-bold">SCANNING FOR TALENT...</p>
                            </div>
                        )}
                        {gameState.recruitPool.map(recruit => {
                            const rarityColor = recruit.rarity === 'LEGENDARY' ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]' :
                                              recruit.rarity === 'EPIC' ? 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' :
                                              recruit.rarity === 'RARE' ? 'border-blue-500' : 'border-gray-800';
                            
                            const rarityLabel = recruit.rarity === 'LEGENDARY' ? 'LEGENDARY' :
                                              recruit.rarity === 'EPIC' ? 'EPIC' :
                                              recruit.rarity === 'RARE' ? 'RARE' : '';

                            return (
                            <div key={recruit.id} className={`bg-gray-900 border-2 ${rarityColor} hover:border-red-600 transition-all p-4 flex gap-4 group relative overflow-hidden`}>
                                {rarityLabel && (
                                    <div className={`absolute top-0 right-0 px-2 py-0.5 text-[8px] font-black uppercase ${
                                        recruit.rarity === 'LEGENDARY' ? 'bg-yellow-500 text-black' :
                                        recruit.rarity === 'EPIC' ? 'bg-purple-600 text-white' :
                                        'bg-blue-600 text-white'
                                    }`}>
                                        {rarityLabel}
                                    </div>
                                )}
                                <div className="w-20 h-24 bg-black flex-shrink-0 flex items-center justify-center border border-gray-700 relative overflow-hidden">
                                     <div className="transform scale-[0.7] translate-y-2">
                                        <BandMemberVisual 
                                            instrument={recruit.instrument} 
                                            uniform={gameState.uniforms[0]} 
                                            appearance={recruit.appearance}
                                            showHat={false}
                                            showInstrument={false}
                                        />
                                     </div>
                                </div>
                                <div className="flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div className="font-black text-lg text-white leading-none mb-1">{recruit.name}</div>
                                            <div className="bg-red-600 text-white text-[8px] px-1 font-bold">{recruit.instrument.substring(0, 3)}</div>
                                        </div>
                                        <p className="text-[9px] text-gray-500 italic mb-2">"{recruit.bio}"</p>
                                        <div className="grid grid-cols-3 gap-2 text-center bg-black/40 p-1 border border-gray-800">
                                            <div><div className="text-[7px] text-gray-500 uppercase">Skill</div><div className="text-xs font-bold text-blue-400">{recruit.playSkill}</div></div>
                                            <div><div className="text-[7px] text-gray-500 uppercase">March</div><div className="text-xs font-bold text-green-400">{recruit.marchSkill}</div></div>
                                            <div><div className="text-[7px] text-gray-500 uppercase">Style</div><div className="text-xs font-bold text-yellow-400">{recruit.showmanship}</div></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <div className="text-green-500 font-pixel text-xs font-bold">${recruit.salary}</div>
                                        <button 
                                            onClick={() => {
                                                if (gameState.funds < recruit.salary) alert("Insufficient Funds!");
                                                else setSelectedRecruit(recruit);
                                            }}
                                            className={`px-6 py-1 text-[10px] font-black italic tracking-tighter skew-x-[-10deg] border-2 transition-all ${gameState.funds >= recruit.salary ? 'bg-red-600 border-red-400 hover:bg-red-500' : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'}`}
                                        >
                                            REVIEW
                                        </button>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
