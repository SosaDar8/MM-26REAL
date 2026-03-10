
import React from 'react';
import { GameState, BandMember } from '../types';
import { MOCK_RECRUITS } from '../constants';
import { Button } from './Button';

interface ManagementProps {
  gameState: GameState;
  onRecruit: (member: BandMember) => void;
  onBack: () => void;
}

export const Management: React.FC<ManagementProps> = ({ gameState, onRecruit, onBack }) => {
  return (
    <div className="h-full bg-slate-800 p-8 text-white font-mono overflow-y-auto">
      <header className="flex justify-between items-center mb-8 border-b-4 border-white pb-4">
        <div>
           <h1 className="text-4xl text-yellow-400">BAND OFFICE</h1>
           <p className="text-gray-400">Manage finances and personnel</p>
        </div>
        <div className="text-right">
            <div className="text-2xl text-green-400">${gameState.funds}</div>
            <div className="text-sm">Current Funds</div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Roster */}
        <div className="bg-slate-900 p-4 border-2 border-slate-600">
            <h2 className="text-xl mb-4 text-blue-300">ACTIVE ROSTER</h2>
            <ul className="space-y-2">
                {gameState.members.map(m => (
                    <li key={m.id} className="flex justify-between items-center bg-slate-800 p-2 border-b border-gray-700">
                        <div>
                            <div className="font-bold">{m.name}</div>
                            <div className="text-xs text-gray-500">{m.instrument} • {m.archetype || 'Standard'}</div>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                           <div className="flex gap-2 text-xs">
                               <span className="text-blue-400 font-bold" title="Marching Skill">M:{m.marchSkill}</span>
                               <span className="text-green-400 font-bold" title="Playing Skill">P:{m.playSkill}</span>
                           </div>
                           <div className="text-[10px]">
                               Chem: <span className={(m.chemistry || 50) > 70 ? 'text-pink-400' : 'text-gray-400'}>{m.chemistry || 50}%</span>
                           </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

        {/* Recruiting */}
        <div className="bg-slate-900 p-4 border-2 border-slate-600">
            <h2 className="text-xl mb-4 text-yellow-300">RECRUITING</h2>
            <ul className="space-y-4">
                {MOCK_RECRUITS.map(recruit => {
                    const canAfford = gameState.funds >= recruit.salary;
                    const isHired = gameState.members.some(m => m.id === recruit.id);

                    if (isHired) return null;

                    return (
                        <li key={recruit.id} className="bg-slate-800 p-3 border border-slate-600 flex flex-col gap-2">
                            <div className="flex justify-between">
                                <span className="font-bold">{recruit.name}</span>
                                <span className="text-yellow-400">${recruit.salary}</span>
                            </div>
                            <div className="text-sm text-gray-400">{recruit.instrument}</div>
                            <div className="flex gap-2 text-xs mb-2">
                                <div className="bg-blue-900 px-1">March: {recruit.marchSkill}</div>
                                <div className="bg-green-900 px-1">Play: {recruit.playSkill}</div>
                                <div className="bg-purple-900 px-1">Show: {recruit.showmanship}</div>
                            </div>
                            <Button 
                                disabled={!canAfford} 
                                onClick={() => onRecruit(recruit)}
                                variant={canAfford ? 'success' : 'secondary'}
                                className="w-full text-xs"
                            >
                                {canAfford ? 'HIRE TALENT' : 'INSUFFICIENT FUNDS'}
                            </Button>
                        </li>
                    );
                })}
            </ul>
        </div>
      </div>

      <div className="mt-8 text-center">
         <Button onClick={onBack} className="w-64">RETURN TO DASHBOARD</Button>
      </div>
    </div>
  );
};
