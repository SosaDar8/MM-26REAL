
import React from 'react';
import { GameState } from '../types';

interface StatsAppProps {
    gameState: GameState;
    onBack: () => void;
}

export const StatsApp: React.FC<StatsAppProps> = ({ gameState, onBack }) => {
    
    // --- DIRECTOR MODE UI ---
    if (gameState.mode === 'DIRECTOR') {
        const { members, funds, fans, schedule, identity, recruitPool } = gameState;
        
        // Calculations
        const avgSkill = members.length > 0 
            ? Math.round(members.reduce((acc, m) => acc + m.playSkill + m.marchSkill, 0) / (members.length * 2)) 
            : 0;
        
        const completedEvents = schedule.filter(e => e.completed).length;
        const totalEvents = schedule.length;
        const seasonProgress = Math.round((completedEvents / totalEvents) * 100);
        
        // Recruitment Strength (Arbitrary calc based on pool quality)
        const highTierRecruits = recruitPool.filter(r => r.playSkill > 70).length;
        const recruitStrength = Math.min(100, (recruitPool.length * 10) + (highTierRecruits * 10));

        return (
            <div className="h-full bg-slate-800 flex flex-col text-white font-mono">
                <div className="bg-gray-700 p-3 flex justify-between items-center shadow-md border-b-4 border-black">
                    <span className="font-bold text-yellow-400">DIRECTOR DASHBOARD</span>
                    <button onClick={onBack} className="text-xs bg-red-600 border border-white px-2 py-1">CLOSE</button>
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-6">
                    
                    {/* Header Card */}
                    <div className="bg-white text-black p-4 border-l-8" style={{ borderLeftColor: identity.primaryColor }}>
                        <h2 className="text-xl font-black uppercase">{identity.schoolName}</h2>
                        <div className="flex justify-between items-end">
                            <span className="text-gray-600 font-bold text-sm uppercase">{identity.mascot} Band</span>
                            <span className="text-2xl font-bold" style={{ color: identity.primaryColor }}>LVL {Math.floor(fans / 100) + 1}</span>
                        </div>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/40 p-3 border border-gray-600">
                            <div className="text-xs text-gray-400 uppercase">Reputation</div>
                            <div className="text-2xl text-pink-400 font-bold">{fans} <span className="text-xs text-white">FANS</span></div>
                        </div>
                        <div className="bg-black/40 p-3 border border-gray-600">
                            <div className="text-xs text-gray-400 uppercase">Budget</div>
                            <div className={`text-2xl font-bold ${funds < 500 ? 'text-red-500' : 'text-green-400'}`}>${funds}</div>
                        </div>
                    </div>

                    {/* Band Performance */}
                    <div className="space-y-4">
                        <h3 className="text-gray-400 font-bold text-xs uppercase border-b border-gray-600 pb-1">PROGRAM HEALTH</h3>
                        
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Performance Rating</span>
                                <span className="text-yellow-400">{avgSkill}/100</span>
                            </div>
                            <div className="w-full bg-gray-700 h-4 border border-gray-500">
                                <div className="h-full bg-yellow-500" style={{ width: `${avgSkill}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Recruitment Pipeline</span>
                                <span className="text-blue-400">{recruitStrength}/100</span>
                            </div>
                            <div className="w-full bg-gray-700 h-4 border border-gray-500">
                                <div className="h-full bg-blue-500" style={{ width: `${recruitStrength}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Season Progress */}
                    <div className="bg-gray-900 p-4 border-2 border-gray-600">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-sm">SEASON PROGRESS</span>
                            <span className="text-xs text-gray-400">{completedEvents} / {totalEvents} EVENTS</span>
                        </div>
                        <div className="w-full h-6 bg-black border border-white relative">
                            <div className="h-full bg-green-600 transition-all" style={{ width: `${seasonProgress}%` }}></div>
                            {/* Ticks */}
                            <div className="absolute inset-0 flex justify-evenly pointer-events-none">
                                {[...Array(totalEvents - 1)].map((_, i) => (
                                    <div key={i} className="w-0.5 h-full bg-white/20"></div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    // --- CAREER MODE UI (Legacy/Original) ---
    if (!gameState.career) return <div className="p-4 text-center">No Data Found</div>;

    const career = gameState.career;
    
    return (
        <div className="h-full bg-slate-900 flex flex-col text-white font-mono">
            <div className="bg-indigo-600 p-3 flex justify-between items-center shadow-md">
                <span className="font-bold">STUDENT PORTAL</span>
                <button onClick={onBack} className="text-xs bg-indigo-800 px-2 py-1 rounded">CLOSE</button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-6">
                
                {/* ID CARD */}
                <div className="bg-white text-black p-4 rounded shadow-lg border-l-8 border-yellow-400">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 className="text-xl font-bold uppercase">{career.playerName}</h2>
                            <div className="text-xs text-gray-500">{career.level} • {career.gender}</div>
                        </div>
                        <div className="text-right">
                             <div className="font-bold text-indigo-600">{career.rank.replace('_', ' ')}</div>
                             <div className="text-xs">{career.instrument}</div>
                        </div>
                    </div>
                    {career.socialGroup && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                            <span className="text-xs text-gray-400 font-bold uppercase">SOCIAL GROUP</span>
                            <div className="font-serif font-bold text-lg text-red-800">{career.socialGroup}</div>
                        </div>
                    )}
                </div>

                {/* METRICS */}
                <div className="space-y-4">
                    <h3 className="text-gray-400 font-bold text-xs uppercase border-b border-gray-700 pb-1">PERFORMANCE METRICS</h3>
                    
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>GPA (Academics)</span>
                            <span className={career.academics < 60 ? "text-red-500" : "text-green-400"}>{career.academics}%</span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${career.academics}%` }}></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>MUSIC SKILL</span>
                            <span className="text-yellow-400">{career.skill}/100</span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${career.skill}%` }}></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>ENERGY</span>
                            <span className={career.energy < 30 ? "text-red-500 animate-pulse" : "text-green-400"}>{career.energy}%</span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${career.energy}%` }}></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>DIRECTOR TRUST</span>
                            <span className="text-purple-400">{career.directorTrust}%</span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${career.directorTrust}%` }}></div>
                        </div>
                    </div>
                     <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>SECTION HYPE</span>
                            <span className="text-pink-400">{career.sectionHype}%</span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full">
                            <div className="h-full bg-pink-500 rounded-full" style={{ width: `${career.sectionHype}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* STATUS */}
                <div className="bg-gray-800 p-3 rounded text-xs space-y-2">
                    <h3 className="text-gray-400 font-bold uppercase">ACADEMIC STATUS</h3>
                    <div className="flex justify-between">
                         <span>Eligibility</span>
                         <span className={career.academics >= 50 ? "text-green-400 font-bold" : "text-red-500 font-bold"}>
                             {career.academics >= 50 ? "ACTIVE" : "PROBATION"}
                         </span>
                    </div>
                    <div className="flex justify-between">
                         <span>Current Week</span>
                         <span>{career.week}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
