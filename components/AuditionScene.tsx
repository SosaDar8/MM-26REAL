
import React, { useState } from 'react';
import { BandMember } from '../types';
import { BandMemberVisual } from './BandMemberVisual';
import { DEFAULT_UNIFORMS } from '../constants';
import { Button } from './Button';

interface AuditionSceneProps {
    candidate: BandMember;
    onDecision: (member: BandMember, status: 'P1' | 'P2' | 'P3' | 'P4' | 'P5') => void;
}

export const AuditionScene: React.FC<AuditionSceneProps> = ({ candidate, onDecision }) => {
    const [rating, setRating] = useState<'P1' | 'P2' | 'P3' | 'P4' | 'P5' | null>(null);

    return (
        <div className="h-full bg-slate-900 flex items-center justify-center p-8 relative overflow-hidden">
            {/* Stage Light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-full bg-white/10 blur-[100px] pointer-events-none"></div>

            <div className="z-10 w-full max-w-4xl bg-black border-4 border-yellow-600 p-8 flex gap-8 shadow-2xl">
                <div className="w-1/3 flex flex-col items-center justify-center border-r-2 border-gray-700 pr-8">
                    <h2 className="text-3xl font-black text-yellow-400 mb-2">AUDITION</h2>
                    <div className="text-gray-400 text-sm mb-8">CANDIDATE ID: {candidate.id.split('-')[1]}</div>
                    
                    <div className="transform scale-[2.5] mb-12">
                        <BandMemberVisual 
                            instrument={candidate.instrument}
                            uniform={{...DEFAULT_UNIFORMS[0], jacketColor: '#333', hatStyle: 'none' as any}} // Audition clothes
                            appearance={candidate.appearance}
                            isPlaying={true} 
                        />
                    </div>
                    
                    <div className="text-center w-full bg-gray-900 p-4 border border-gray-600">
                        <div className="text-xl font-bold text-white">{candidate.name}</div>
                        <div className="text-yellow-500 font-mono text-sm">{candidate.instrument}</div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                            <div className="text-gray-400">Play: <span className="text-white">{candidate.playSkill}</span></div>
                            <div className="text-gray-400">March: <span className="text-white">{candidate.marchSkill}</span></div>
                            <div className="text-gray-400">Show: <span className="text-white">{candidate.showmanship}</span></div>
                        </div>
                    </div>
                </div>

                <div className="w-2/3 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest border-b border-gray-700 pb-2">Director's Evaluation</h3>
                    
                    <div className="space-y-4">
                        {[
                            { id: 'P1', label: 'P1 - PRIMARY', desc: 'Guaranteed starter. Immediate impact.', color: 'bg-green-600' },
                            { id: 'P2', label: 'P2 - SECONDARY', desc: 'Solid player. Will march most shows.', color: 'bg-blue-600' },
                            { id: 'P3', label: 'P3 - RESERVE', desc: 'Needs work. Bench warmer.', color: 'bg-yellow-600' },
                            { id: 'P4', label: 'P4 - ALTERNATE', desc: 'Emergency backup only.', color: 'bg-orange-600' },
                            { id: 'P5', label: 'P5 - CUT', desc: 'Do not allow on the field.', color: 'bg-red-600' }
                        ].map((opt) => (
                            <button 
                                key={opt.id}
                                onClick={() => setRating(opt.id as any)}
                                className={`w-full text-left p-4 border-2 transition-all ${rating === opt.id ? `border-white ${opt.color}` : 'border-gray-700 bg-gray-800 hover:bg-gray-700'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">{opt.label}</span>
                                    {rating === opt.id && <span className="text-xs font-bold bg-black/20 px-2 py-1 rounded">SELECTED</span>}
                                </div>
                                <div className="text-xs text-white/70 mt-1">{opt.desc}</div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button 
                            disabled={!rating} 
                            onClick={() => rating && onDecision(candidate, rating)}
                            className={rating === 'P5' ? 'bg-red-600 border-red-400' : 'bg-green-600 border-green-400'}
                        >
                            {rating === 'P5' ? 'REJECT CANDIDATE' : 'SIGN CONTRACT'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
