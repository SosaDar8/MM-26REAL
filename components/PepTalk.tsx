
import React, { useState, useEffect } from 'react';
import { GameBuff, Director, BandIdentity, DirectorTrait, Uniform, InstrumentType } from '../types';
import { Button } from './Button';
import { BandMemberVisual } from './BandMemberVisual';
import { getRandomAppearance, PREWRITTEN_SPEECHES, DEFAULT_UNIFORMS } from '../constants';

interface PepTalkProps {
    director: Director;
    opponentName: string;
    onComplete: (buff: GameBuff) => void;
    identity: BandIdentity;
    mode: 'DIRECTOR' | 'CAREER';
    activeUniform?: Uniform;
}

export const PepTalk: React.FC<PepTalkProps> = ({ director, opponentName, onComplete, identity, mode, activeUniform }) => {
    const [speech, setSpeech] = useState<string>("");
    const [selectedTone, setSelectedTone] = useState<'AGGRESSIVE' | 'INSPIRING' | 'TECHNICAL' | null>(null);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);

    // Fallback uniform if none provided
    const displayUniform = activeUniform || DEFAULT_UNIFORMS[0];

    const tones = [
        { 
            id: 'AGGRESSIVE', 
            label: 'INTIMIDATION', 
            buff: 'HYPE', 
            desc: '+20% Momentum Gain, -10% Precision',
            color: 'bg-red-600'
        },
        { 
            id: 'INSPIRING', 
            label: 'INSPIRATION', 
            buff: 'FOCUS', 
            desc: 'Bad notes do not break Combo for 10s',
            color: 'bg-blue-600'
        },
        { 
            id: 'TECHNICAL', 
            label: 'DISCIPLINE', 
            buff: 'PRECISION', 
            desc: '+25% Perfect Hit Window',
            color: 'bg-green-600'
        }
    ];

    // Career Mode Auto-Selection
    useEffect(() => {
        if (mode === 'CAREER' && !selectedTone && !speech && !isAutoPlaying) {
            setIsAutoPlaying(true);
            setTimeout(() => {
                // Determine tone based on director trait if possible, otherwise random
                let toneId: any = 'INSPIRING';
                if (director.trait === DirectorTrait.TACTICAL || director.trait === DirectorTrait.DISCIPLINED) toneId = 'TECHNICAL';
                if (director.trait === DirectorTrait.SHOWMAN) toneId = 'AGGRESSIVE';
                
                const tone = tones.find(t => t.id === toneId) || tones[1];
                handleSelectTone(tone, true);
            }, 1500);
        }
    }, [mode]);

    const handleSelectTone = (tone: any, auto = false) => {
        setSelectedTone(tone.id);
        const options = PREWRITTEN_SPEECHES[tone.id as keyof typeof PREWRITTEN_SPEECHES];
        const text = options[Math.floor(Math.random() * options.length)];
        
        if (auto) {
            // Simulate reading delay
            setTimeout(() => {
                 setSpeech(text);
            }, 1000);
        } else {
             setSpeech(text);
        }
    };

    const confirmBuff = () => {
        if (!selectedTone) return;
        const toneData = tones.find(t => t.id === selectedTone);
        onComplete({
            type: toneData?.buff as any,
            value: 1, 
            description: toneData?.desc || ''
        });
    };

    return (
        <div className="h-full bg-neutral-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
            {/* Stadium Tunnel Background */}
            <div className="absolute inset-0 bg-neutral-800">
                {/* Ceiling Lights */}
                <div className="absolute top-0 w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_100px,rgba(0,0,0,0.5)_100px,rgba(0,0,0,0.5)_120px)] opacity-50"></div>
                
                {/* Tunnel Floor */}
                <div className="absolute bottom-0 w-full h-1/3 bg-neutral-700 border-t-8 border-neutral-600 transform origin-bottom scale-x-125"></div>
                
                {/* The "Light at the end of the tunnel" */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-white/30 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-1/4 h-full bg-white/20 blur-xl"></div>
                
                {/* Tunnel Sign */}
                <div className="absolute top-10 left-10 border-4 border-yellow-500 p-2 bg-black/80 transform -rotate-2">
                    <span className="text-4xl font-black text-white tracking-widest uppercase">TUNNEL 1</span>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-4xl p-8 flex gap-8">
                {/* Visuals */}
                <div className="w-1/3 flex flex-col items-center justify-end">
                    <div className="relative transform scale-150 origin-bottom">
                         <div className="absolute bottom-0 left-10 z-10">
                            {/* Director Visual */}
                            <BandMemberVisual 
                                instrument={InstrumentType.MACE} 
                                uniform={{...displayUniform, hatStyle: 'cap', jacketColor: '#111'}} // Director outfit simulation
                                appearance={director.appearance}
                                showInstrument={false}
                            />
                         </div>
                         <div className="flex gap-2 opacity-80 transform scale-75 origin-bottom-left">
                             {/* Actual Band Members in Actual Uniforms */}
                             <BandMemberVisual instrument={InstrumentType.SNARE} uniform={displayUniform} appearance={getRandomAppearance()} />
                             <BandMemberVisual instrument={InstrumentType.TUBA} uniform={displayUniform} appearance={getRandomAppearance()} />
                         </div>
                    </div>
                </div>

                {/* Content */}
                <div className="w-2/3">
                    <h1 className="text-4xl font-black text-yellow-400 mb-2 font-mono uppercase italic">PRE-GAME HYPE</h1>
                    <p className="text-gray-300 mb-8 font-mono uppercase bg-black/50 inline-block px-2">Match vs {opponentName}</p>

                    {!speech && !isAutoPlaying ? (
                        <div className="space-y-4 animate-fade-in">
                            <p className="text-xl mb-4 text-white font-bold drop-shadow-md">Choose your approach:</p>
                            <div className="grid grid-cols-1 gap-4">
                                {tones.map(tone => (
                                    <button
                                        key={tone.id}
                                        onClick={() => handleSelectTone(tone)}
                                        className={`p-4 border-l-8 text-left transition-all hover:pl-6 ${tone.color} border-white/20 hover:border-white bg-black/60 backdrop-blur-sm`}
                                    >
                                        <div className="font-bold text-lg">{tone.label}</div>
                                        <div className="text-sm text-gray-300">{tone.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            {!speech ? (
                                <div className="text-2xl text-yellow-400 animate-pulse font-mono">
                                    DIRECTOR IS SPEAKING...
                                </div>
                            ) : (
                                <>
                                    <div className="bg-black/70 p-6 border-2 border-white/30 rounded-lg mb-6 relative backdrop-blur-md">
                                        <div className="absolute -top-3 left-4 bg-yellow-500 text-black px-2 text-xs font-bold">DIRECTOR {director.name.toUpperCase()}</div>
                                        <p className="text-2xl font-serif italic leading-relaxed text-white">"{speech}"</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm text-green-400 font-mono bg-black/50 px-2 py-1">
                                            BUFF: {tones.find(t => t.id === selectedTone)?.buff}
                                        </div>
                                        <Button onClick={confirmBuff} className="px-8 py-4 text-xl flex-grow bg-yellow-500 text-black border-yellow-700 animate-pulse shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                                            {mode === 'CAREER' ? "LET'S MARCH!" : "ENTER STADIUM ->"}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
