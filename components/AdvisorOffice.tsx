
import React, { useState } from 'react';
import { Advisor, Job, CareerState } from '../types';
import { ADVISOR_DATA, JOBS } from '../constants';
import { Button } from './Button';

interface AdvisorOfficeProps {
    careerState: CareerState;
    onTakeJob: (job: Job) => void;
    onLeave: () => void;
}

export const AdvisorOffice: React.FC<AdvisorOfficeProps> = ({ careerState, onTakeJob, onLeave }) => {
    const [view, setView] = useState<'DIALOGUE' | 'JOBS'>('DIALOGUE');
    const [dialogueIndex, setDialogueIndex] = useState(0);

    const handleNextDialogue = () => {
        const next = dialogueIndex + 1;
        if (next < ADVISOR_DATA.dialogue.length) {
            setDialogueIndex(next);
        } else {
            setView('JOBS');
        }
    };

    return (
        <div className="w-full h-full bg-[#fdf6e3] flex items-center justify-center p-8 font-mono text-black relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-50"></div>
            
            <div className="z-10 w-full max-w-4xl bg-white border-4 border-[#8b4513] shadow-[10px_10px_0_rgba(0,0,0,0.2)] p-8 flex flex-col h-[600px]">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b-4 border-[#8b4513] pb-4 mb-4">
                    <div>
                        <h2 className="text-3xl font-bold uppercase">Academic Advising</h2>
                        <p className="text-gray-500">Dr. Roberts</p>
                    </div>
                    <Button onClick={onLeave} variant="secondary">LEAVE OFFICE</Button>
                </div>

                <div className="flex-grow flex gap-8">
                    {/* Advisor Visual */}
                    <div className="w-1/3 flex flex-col items-center justify-end bg-gray-200 border-2 border-gray-400 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                        <div className="text-9xl mb-10">👩‍🏫</div>
                    </div>

                    {/* Interaction Area */}
                    <div className="w-2/3 flex flex-col">
                        {view === 'DIALOGUE' ? (
                            <div className="flex-grow flex flex-col justify-between">
                                <div className="bg-[#fffdf0] p-6 border-2 border-black h-full shadow-inner relative">
                                    <div className="absolute -top-3 left-4 bg-[#8b4513] text-white px-2 py-1 text-xs font-bold">DR. ROBERTS SAYS:</div>
                                    <p className="text-xl leading-relaxed mt-4">"{ADVISOR_DATA.dialogue[dialogueIndex]}"</p>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <Button onClick={handleNextDialogue} className="animate-pulse">NEXT &gt;</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col">
                                <h3 className="text-xl font-bold mb-4 bg-yellow-200 inline-block px-2">AVAILABLE CAMPUS JOBS</h3>
                                <div className="space-y-4 overflow-y-auto pr-2">
                                    {JOBS.map(job => (
                                        <div key={job.id} className="border-2 border-gray-300 p-4 hover:border-black transition-colors bg-white">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-lg">{job.title}</h4>
                                                <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-bold border border-green-300">${job.wage}/shift</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>Cost: -{job.energyCost} Energy</span>
                                                <Button 
                                                    onClick={() => onTakeJob(job)} 
                                                    className="text-xs py-2 px-4"
                                                    disabled={careerState.currentJob?.id === job.id}
                                                >
                                                    {careerState.currentJob?.id === job.id ? 'CURRENT JOB' : 'APPLY'}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
