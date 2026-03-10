
import React from 'react';
import { GameState, Quest } from '../types';
import { Button } from './Button';

interface QuestMenuProps {
    gameState: GameState;
    onBack: () => void;
}

export const QuestMenu: React.FC<QuestMenuProps> = ({ gameState, onBack }) => {
    // Filter logic for mode
    const modeFilter = (q: Quest) => !q.mode || q.mode === 'BOTH' || q.mode === gameState.mode;

    const dailyQuests = gameState.quests.filter(q => q.type === 'DAILY' && modeFilter(q));
    const seasonQuests = gameState.quests.filter(q => q.type === 'SEASON' && modeFilter(q));

    const renderQuestCard = (quest: Quest) => {
        const progress = Math.min(100, (quest.current / quest.target) * 100);
        return (
            <div key={quest.id} className={`p-4 border-2 bg-slate-900 ${quest.completed ? 'border-green-500 opacity-70' : 'border-gray-600'}`}>
                <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold text-lg ${quest.completed ? 'text-green-400 line-through' : 'text-white'}`}>{quest.title}</h3>
                    {quest.completed && <span className="text-green-500 text-xs font-bold uppercase">Completed</span>}
                </div>
                <p className="text-gray-400 text-sm mb-3">{quest.description}</p>
                <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden border border-gray-700 mb-2">
                    <div className="h-full bg-yellow-500" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-500">{quest.current} / {quest.target}</span>
                    <span className="text-yellow-400">Reward: {quest.reward}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full bg-slate-950 text-white p-8 overflow-y-auto">
            <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
                <h1 className="text-4xl text-purple-400 font-mono">
                    {gameState.mode === 'CAREER' ? 'PERSONAL GOALS' : 'BAND OBJECTIVES'}
                </h1>
                <Button onClick={onBack} variant="secondary">BACK TO DASHBOARD</Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl text-blue-300 mb-4 border-l-4 border-blue-500 pl-4">DAILY TASKS</h2>
                    <div className="space-y-4">
                        {dailyQuests.length > 0 ? dailyQuests.map(renderQuestCard) : <div className="text-gray-500">No daily tasks available.</div>}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl text-yellow-300 mb-4 border-l-4 border-yellow-500 pl-4">SEASON GOALS</h2>
                    <div className="space-y-4">
                        {seasonQuests.length > 0 ? seasonQuests.map(renderQuestCard) : <div className="text-gray-500">No season goals available.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};
