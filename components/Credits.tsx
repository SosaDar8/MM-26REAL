
import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { BandMemberVisual } from './BandMemberVisual';
import { InstrumentType, Uniform } from '../types';
import { getRandomAppearance, DEFAULT_UNIFORMS } from '../constants';

interface CreditsProps {
    onBack: () => void;
}

export const Credits: React.FC<CreditsProps> = ({ onBack }) => {
    const [scrollPos, setScrollPos] = useState(100);
    // Random seeds for bloopers so they don't jitter
    const [blooper1] = useState(getRandomAppearance());
    const [blooper2] = useState(getRandomAppearance());
    const [blooper3] = useState(getRandomAppearance());
    
    // Funny uniforms for bloopers
    const clownFit: Uniform = { ...DEFAULT_UNIFORMS[0], id:'clown', name:'Oops', jacketColor: '#ff00ff', pantsColor: '#00ff00', hatColor: '#ffff00', hatStyle: 'shako', plumeColor: '#00ffff' };
    const noPantsFit: Uniform = { ...DEFAULT_UNIFORMS[0], id:'nopants', name:'Uh oh', pantsColor: '#dca586', pantsStyle: 'shorts' }; // Skin colored shorts look like no pants in pixel art

    useEffect(() => {
        const interval = setInterval(() => {
            setScrollPos(prev => {
                if (prev < -450) return 110; // Loop point extended
                return prev - 0.15; // Speed
            });
        }, 16);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full bg-black text-white font-pixel flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1),_transparent)]"></div>
            <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-[spin_60s_linear_infinite]"></div>
            
            <div className="absolute left-1/2 -translate-x-1/2 text-center w-full max-w-2xl" style={{ top: `${scrollPos}%` }}>
                <h1 className="text-6xl text-yellow-400 mb-20 drop-shadow-[4px_4px_0_rgba(100,0,0,1)] uppercase italic tracking-widest">MARCH MADNESS '26</h1>
                
                {/* DIRECTOR */}
                <div className="mb-24">
                    <div className="text-gray-500 text-sm mb-2 font-mono uppercase tracking-[0.5em]">Game Director</div>
                    <div className="text-4xl font-black text-white drop-shadow-md">ANDREW BUTTS</div>
                </div>

                {/* BLOOPER 1 */}
                <div className="mb-24 flex flex-col items-center">
                    <div className="text-xs text-red-500 font-mono mb-4 border border-red-900 px-2 bg-black/50">-- BLOOPER REEL: WARDROBE MALFUNCTION --</div>
                    <div className="transform rotate-12 bg-white/10 p-4 rounded-lg border-2 border-white/20">
                        <BandMemberVisual 
                            instrument={InstrumentType.TUBA} 
                            uniform={clownFit} 
                            appearance={blooper1} 
                            isPlaying={true} 
                            scale={1.5} 
                        />
                    </div>
                </div>

                {/* DESIGN */}
                <div className="mb-24">
                    <div className="text-gray-500 text-sm mb-4 font-mono uppercase tracking-[0.5em]">Game Design & Creative</div>
                    <div className="text-2xl font-bold text-white mb-2">ANDREW BUTTS</div>
                    <div className="text-xl font-bold text-gray-400">AI ASSISTANT</div>
                </div>

                {/* CREATIVE */}
                <div className="mb-24">
                    <div className="text-gray-500 text-sm mb-2 font-mono uppercase tracking-[0.5em]">Creative Consultant</div>
                    <div className="text-2xl font-bold text-white">ANDREW BUTTS</div>
                </div>

                {/* BLOOPER 2 */}
                <div className="mb-24 flex flex-col items-center">
                    <div className="text-xs text-red-500 font-mono mb-4 border border-red-900 px-2 bg-black/50">-- BLOOPER REEL: MISSED THE BUS --</div>
                    <div className="transform -rotate-6 bg-white/10 p-4 rounded-lg border-2 border-white/20 flex gap-4 items-end">
                        <BandMemberVisual 
                            instrument={InstrumentType.SNARE} 
                            uniform={noPantsFit} 
                            appearance={blooper2} 
                            isPlaying={false} 
                            scale={1.5} 
                        />
                         <div className="text-xs font-mono text-yellow-400 w-24 text-left bg-black/80 p-1 border border-yellow-600 rounded">
                            "Wait! I forgot my bibbers!"
                        </div>
                    </div>
                </div>

                {/* ENGINEERING */}
                <div className="mb-24">
                    <div className="text-gray-500 text-sm mb-2 font-mono uppercase tracking-[0.5em]">Lead Engineering</div>
                    <div className="text-2xl font-bold text-white">AI ASSISTANT</div>
                    <div className="text-sm text-gray-600 mt-1 font-mono">CODE GEN & LOGIC</div>
                </div>

                {/* ART */}
                <div className="mb-24">
                    <div className="text-gray-500 text-sm mb-2 font-mono uppercase tracking-[0.5em]">Art Direction</div>
                    <div className="text-2xl font-bold text-white">CSS & TAILWIND</div>
                    <div className="text-xl font-bold text-gray-400">ANDREW BUTTS (Concept)</div>
                </div>

                {/* BLOOPER 3 */}
                <div className="mb-24 flex flex-col items-center">
                    <div className="text-xs text-red-500 font-mono mb-4 border border-red-900 px-2 bg-black/50">-- BLOOPER REEL: COLLISION COURSE --</div>
                    <div className="relative">
                        <div className="absolute left-[-40px] transform rotate-45">
                             <BandMemberVisual 
                                instrument={InstrumentType.CYMBAL} 
                                uniform={DEFAULT_UNIFORMS[0]} 
                                appearance={blooper3} 
                                isPlaying={true} 
                                scale={1.2} 
                            />
                        </div>
                        <div className="transform -rotate-45 opacity-80 translate-x-4">
                             <BandMemberVisual 
                                instrument={InstrumentType.BASS} 
                                uniform={DEFAULT_UNIFORMS[0]} 
                                appearance={blooper1} 
                                isPlaying={false} 
                                scale={1.2} 
                            />
                        </div>
                        <div className="absolute top-0 left-0 text-4xl font-black text-red-600 animate-pulse">BANG!</div>
                    </div>
                </div>

                {/* SPECIAL THANKS */}
                <div className="mb-24">
                    <div className="text-gray-500 text-sm mb-4 font-mono uppercase tracking-[0.5em]">Special Thanks</div>
                    <div className="text-lg font-bold text-gray-300 mb-1">RETRO BOWL</div>
                    <div className="text-lg font-bold text-gray-300 mb-1">DRUM MAJOR DAVE</div>
                    <div className="text-lg font-bold text-gray-300 mb-1">REACT COMMUNITY</div>
                    <div className="text-lg font-bold text-gray-300 mb-1">HBCU BANDS EVERYWHERE</div>
                    <div className="text-lg font-bold text-gray-300">DCI & BOB</div>
                </div>

                <div className="mb-48 text-xs text-gray-600 font-mono border-t border-gray-800 pt-8 w-2/3 mx-auto leading-loose">
                    © 2025 Marktime Productions.<br/>
                    Made with 💖 and ☕.<br/>
                    No pixels were harmed in the making of this simulation.<br/>
                    <br/>
                    "One Band, One Sound."
                </div>
            </div>

            <div className="absolute bottom-8 right-8 z-20">
                <Button onClick={onBack} variant="secondary" className="opacity-50 hover:opacity-100 transition-opacity text-xs py-2 px-4">SKIP CREDITS</Button>
            </div>
        </div>
    );
};
