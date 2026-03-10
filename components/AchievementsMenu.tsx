
import React from 'react';
import { GameState, Achievement } from '../types';
import { Button } from './Button';
import { MINI_ACHIEVEMENTS } from '../constants';

interface AchievementsMenuProps {
    gameState: GameState;
    onBack: () => void;
}

export const AchievementsMenu: React.FC<AchievementsMenuProps> = ({ gameState, onBack }) => {
    // Filter by mode
    const modeFilter = (a: Achievement) => !a.mode || a.mode === 'BOTH' || a.mode === gameState.mode;
    const visibleAchievements = gameState.achievements.filter(modeFilter);

    return (
        <div className="h-full bg-slate-900 text-white p-8 overflow-y-auto">
            <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
                <h1 className="text-4xl text-yellow-500 font-mono">HALL OF FAME</h1>
                <div className="flex gap-4 items-center">
                    <div className="text-right">
                        <div className="text-xs text-gray-400">UNLOCKED</div>
                        <div className="text-2xl font-bold">{visibleAchievements.filter(a => a.unlocked).length} / {visibleAchievements.length}</div>
                    </div>
                    <Button onClick={onBack} variant="secondary">BACK</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {visibleAchievements.map(ach => (
                    <div key={ach.id} className={`aspect-square p-6 flex flex-col items-center justify-center text-center border-4 transition-all ${ach.unlocked ? 'bg-yellow-900/20 border-yellow-500' : 'bg-gray-800 border-gray-700 grayscale opacity-50'}`}>
                        <div className="text-6xl mb-4">{ach.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{ach.name}</h3>
                        <p className="text-sm text-gray-400">{ach.description}</p>
                        {ach.unlocked && <div className="mt-4 text-xs text-yellow-600 font-mono">{ach.dateUnlocked}</div>}
                    </div>
                ))}
            </div>

            {/* Milestones / Pop-up Achievements Section */}
            <div className="pt-8 border-t border-gray-700">
                <h2 className="text-2xl text-blue-400 font-mono mb-6">MILESTONES</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {MINI_ACHIEVEMENTS.map(ach => {
                        const isUnlocked = gameState.shownNotifications?.includes(ach.id);
                        return (
                            <div key={ach.id} className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center text-center transition-all ${isUnlocked ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-gray-800 border-gray-700 grayscale opacity-30'}`}>
                                <div className="text-4xl mb-2 filter drop-shadow-md">{ach.icon}</div>
                                <div className="text-xs font-bold text-gray-300 uppercase tracking-wide">{ach.title}</div>
                                {isUnlocked && <div className="text-[10px] text-blue-400 mt-1">UNLOCKED</div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
