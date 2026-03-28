
import React from 'react';
import { GameState, BandMember, StaffMember } from '../types';
import { MOCK_RECRUITS, MOCK_STAFF } from '../constants';
import { Button } from './Button';

interface ManagementProps {
  gameState: GameState;
  onRecruit: (member: BandMember) => void;
  onHireStaff: (staff: StaffMember) => void;
  onBack: () => void;
}

export const Management: React.FC<ManagementProps> = ({ gameState, onRecruit, onHireStaff, onBack }) => {
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                    const hasRecruiter = gameState.staff.some(s => s.role === 'Recruiter');
                    const finalSalary = hasRecruiter ? Math.floor(recruit.salary * 0.8) : recruit.salary;
                    const canAfford = gameState.funds >= finalSalary;
                    const isHired = gameState.members.some(m => m.id === recruit.id);

                    if (isHired) return null;

                    return (
                        <li key={recruit.id} className="bg-slate-800 p-3 border border-slate-600 flex flex-col gap-2">
                            <div className="flex justify-between">
                                <span className="font-bold">{recruit.name}</span>
                                <span className="text-yellow-400">
                                    {hasRecruiter ? <span className="line-through text-gray-500 mr-2">${recruit.salary}</span> : null}
                                    ${finalSalary}
                                </span>
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

        {/* Current Staff */}
        <div className="bg-slate-900 p-4 border-2 border-slate-600">
            <h2 className="text-xl mb-4 text-purple-300">CURRENT STAFF</h2>
            {gameState.staff.length === 0 ? (
                <div className="text-sm text-gray-500 italic">No staff hired yet.</div>
            ) : (
                <ul className="space-y-2">
                    {gameState.staff.map(s => {
                        let effect = '';
                        if (s.role === 'Recruiter') effect = '-20% Recruiting Cost';
                        if (s.role === 'Equipment Manager') effect = '-20% Uniform Cost';
                        if (s.role === 'Music Arranger') effect = '+2 Skill/Practice';
                        if (s.role === 'Visual Tech') effect = '+2 Skill/Practice';
                        if (s.role === 'Assistant Director') effect = '-3 Energy/Practice';
                        if (s.role === 'Percussion Instructor') effect = '+3 Percussion Skill/Practice';
                        if (s.role === 'Guard Instructor') effect = '+3 Guard Skill/Practice';
                        if (s.role === 'Brass Caption Head') effect = '+3 Brass Skill/Practice';

                        return (
                            <li key={s.id} className="flex flex-col bg-slate-800 p-2 border-b border-gray-700">
                                <div className="font-bold">{s.name}</div>
                                <div className="text-xs text-gray-400">{s.role}</div>
                                <div className="text-xs text-yellow-400 mt-1">{effect}</div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>

        {/* Staff Hiring */}
        <div className="bg-slate-900 p-4 border-2 border-slate-600">
            <h2 className="text-xl mb-4 text-green-300">HIRE STAFF</h2>
            <ul className="space-y-4">
                {MOCK_STAFF.map(staff => {
                    const canAfford = gameState.funds >= staff.salary;
                    const isHired = gameState.staff.some(s => s.id === staff.id);

                    if (isHired) return null;

                    let effect = '';
                    if (staff.role === 'Recruiter') effect = '-20% Recruiting Cost';
                    if (staff.role === 'Equipment Manager') effect = '-20% Uniform Cost';
                    if (staff.role === 'Music Arranger') effect = '+2 Skill/Practice';
                    if (staff.role === 'Visual Tech') effect = '+2 Skill/Practice';
                    if (staff.role === 'Assistant Director') effect = '-3 Energy/Practice';
                    if (staff.role === 'Percussion Instructor') effect = '+3 Percussion Skill/Practice';
                    if (staff.role === 'Guard Instructor') effect = '+3 Guard Skill/Practice';
                    if (staff.role === 'Brass Caption Head') effect = '+3 Brass Skill/Practice';

                    return (
                        <li key={staff.id} className="bg-slate-800 p-3 border border-slate-600 flex flex-col gap-2">
                            <div className="flex justify-between">
                                <span className="font-bold">{staff.name}</span>
                                <span className="text-yellow-400">${staff.salary}</span>
                            </div>
                            <div className="text-sm text-gray-400">{staff.role}</div>
                            <div className="text-xs text-yellow-400">{effect}</div>
                            <Button 
                                disabled={!canAfford} 
                                onClick={() => onHireStaff(staff)}
                                variant={canAfford ? 'success' : 'secondary'}
                                className="w-full text-xs mt-2"
                            >
                                {canAfford ? 'HIRE STAFF' : 'INSUFFICIENT FUNDS'}
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
