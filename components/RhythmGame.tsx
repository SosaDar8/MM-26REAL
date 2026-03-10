
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { RhythmNote, Uniform, BandMember, InstrumentType, Moment, InstrumentDesign, GameState, SongCategory, MusicTrack, Drill } from '../types';
import { DEFAULT_UNIFORMS, DEFAULT_INSTRUMENT_DESIGNS, INITIAL_TRACKS, GRID_SIZE } from '../constants';
import { soundManager } from '../services/soundManager';
import { BandMemberVisual } from './BandMemberVisual';
import { Button } from './Button';

interface RhythmGameProps {
  onComplete: (score: number, crowdEnergy: number, accuracy?: number) => void;
  onCaptureMoment?: (moment: Moment) => void;
  difficulty: 'easy' | 'medium' | 'hard';
  uniform?: Uniform;
  dmUniform?: Uniform;
  majoretteUniform?: Uniform;
  guardUniform?: Uniform;
  members?: BandMember[];
  isHalftime?: boolean;
  activeDrill?: Drill;
  drillFrameIndex?: number;
  environment?: 'STADIUM' | 'PARADE' | 'CONCERT' | 'ARENA';
  tuneType?: string;
  inputMode?: 'PC' | 'MOBILE';
  instrumentDesigns?: GameState['instrumentDesigns'];
  logoGrid?: string[];
  allowedCategories?: SongCategory[];
  musicLibrary?: MusicTrack[];
  autoPlay?: boolean;
}

interface HitFeedback {
    id: number;
    text: string;
    color: string;
    lane: number;
}

export const RhythmGame: React.FC<RhythmGameProps> = ({ 
    onComplete, 
    onCaptureMoment,
    difficulty, 
    uniform, 
    dmUniform,
    majoretteUniform,
    guardUniform,
    members = [], 
    isHalftime,
    environment = 'STADIUM',
    tuneType,
    inputMode = 'PC',
    instrumentDesigns = DEFAULT_INSTRUMENT_DESIGNS,
    logoGrid,
    allowedCategories,
    musicLibrary,
    autoPlay = false,
    activeDrill,
    drillFrameIndex
}) => {
    // Game State
    const [gameState, setGameState] = useState<'SELECT' | 'PLAYING'>('SELECT');
    const [selectedCategory, setSelectedCategory] = useState<SongCategory>(allowedCategories ? allowedCategories[0] : 'HYPE');
    const [notes, setNotes] = useState<RhythmNote[]>([]);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [health, setHealth] = useState(50);
    const [crowdEnergy, setCrowdEnergy] = useState(50);
    const [timeLeft, setTimeLeft] = useState(environment === 'PARADE' ? 120 : 60); 
    const [hitFeedbacks, setHitFeedbacks] = useState<HitFeedback[]>([]);
    const [activeLanes, setActiveLanes] = useState<boolean[]>([false, false, false, false]);
    
    // Juice State
    const [shake, setShake] = useState(0);
    const [impact, setImpact] = useState(0); // Impact frames filter
    const [perfectBurst, setPerfectBurst] = useState<{x: number, y: number, id: number}[]>([]);
    const [isCranking, setIsCranking] = useState(false);
    const [crankMeter, setCrankMeter] = useState(0);

    const crankMeterRef = useRef(0);
    const isCrankingRef = useRef(false);

    useEffect(() => {
        crankMeterRef.current = crankMeter;
    }, [crankMeter]);

    useEffect(() => {
        isCrankingRef.current = isCranking;
    }, [isCranking]);

    // Stats Tracking
    const [totalNotes, setTotalNotes] = useState(0);
    const [hitNotes, setHitNotes] = useState(0);
    
    // Pause & Autopilot
    const [isPaused, setIsPaused] = useState(false);
    const [isAutopilotState, setIsAutopilotState] = useState(autoPlay);
    const isAutopilotRef = useRef(autoPlay);

    useEffect(() => {
        setIsAutopilotState(autoPlay);
        isAutopilotRef.current = autoPlay;
    }, [autoPlay]);

    const isAutopilot = isAutopilotState;
    const setIsAutopilot = (value: boolean) => {
        setIsAutopilotState(value);
        isAutopilotRef.current = value;
    };

    // Audio Ref
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Refs
    const requestRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const pauseTimeRef = useRef<number>(0); 
    const totalPauseDurationRef = useRef<number>(0); 
    const lastNoteTime = useRef<number>(0);
    
    const statsRef = useRef({ score, crowdEnergy, hitNotes, totalNotes });
    useEffect(() => {
        statsRef.current = { score, crowdEnergy, hitNotes, totalNotes };
    }, [score, crowdEnergy, hitNotes, totalNotes]);

    const laneKeys = ['D', 'F', 'J', 'K'];
    const laneColors = ['bg-[#00ff00]', 'bg-[#ff0000]', 'bg-[#ffff00]', 'bg-[#0000ff]'];
    const laneBorderColors = ['border-[#00ff00]', 'border-[#ff0000]', 'border-[#ffff00]', 'border-[#0000ff]'];

    // Use passed library or fallback to initial tracks
    const availableTracks = musicLibrary || INITIAL_TRACKS;

    const visibleMembers = useMemo(() => {
        if (!members || members.length === 0) {
             return [1,2,3,4].map(i => ({
                id: `mock-${i}`,
                instrument: InstrumentType.SNARE,
                appearance: { skinColor: '#dca586', hairColor: '#000', hairStyle: 1, bodyType: 'average', accessoryId: 0 }
            } as BandMember));
        }
        return members; 
    }, [members]);

    const getInstrumentConfig = (instr: InstrumentType): InstrumentDesign | undefined => {
        if (instr === InstrumentType.SNARE || instr === InstrumentType.TENOR_QUADS || instr === InstrumentType.TENOR_CHEST || instr === InstrumentType.TENOR_WAIST || instr === InstrumentType.BASS || instr === InstrumentType.CYMBAL) {
            return instrumentDesigns.percussion;
        } else if (instr === InstrumentType.TRUMPET || instr === InstrumentType.TUBA || instr === InstrumentType.BARITONE || instr === InstrumentType.MELLOPHONE || instr === InstrumentType.TROMBONE) {
            return instrumentDesigns.brass;
        } else if (instr === InstrumentType.SAX || instr === InstrumentType.CLARINET || instr === InstrumentType.FLUTE || instr === InstrumentType.PICCOLO) {
            return instrumentDesigns.woodwind;
        }
        return undefined;
    };

    const startGame = (track?: MusicTrack) => {
        // Ensure any previous audio is killed
        soundManager.stopSequence();
        soundManager.stopMusicCycle(); // Stop background music explicitly
        
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        setGameState('PLAYING');
        startTimeRef.current = Date.now();
        
        if (track) {
            if (track.audioUrl) {
                audioRef.current = new Audio(track.audioUrl);
                audioRef.current.play().catch(e => console.log("Audio play error", e));
            } else if (track.sequence) {
                // Play procedural sequence
                soundManager.playEventTrack(track.sequence, track.bpm);
            }
        } else {
            // Freestyle / Default fallback
            soundManager.startMusicCycle(); 
        }

        // Shorter duration for stand tunes
        if (tuneType === 'STAND') {
            setTimeLeft(30);
        }
    };

    // Initialize Game Loop
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        requestRef.current = requestAnimationFrame(gameLoop);
        
        const spawnRate = difficulty === 'hard' ? 250 : difficulty === 'medium' ? 500 : 800;
        const noteTravelTime = 1500; 

        // Note Spawner
        const spawnInterval = setInterval(() => {
            if (isPaused) return;

            const time = Date.now() - startTimeRef.current - totalPauseDurationRef.current;
            
            if (time - lastNoteTime.current > spawnRate) {
                const lane = Math.floor(Math.random() * 4);
                spawnNote(time + noteTravelTime, lane);
                setTotalNotes(prev => prev + 1); 
                
                if (difficulty !== 'easy' && Math.random() > 0.8) {
                    const lane2 = (lane + Math.floor(Math.random() * 3) + 1) % 4;
                    spawnNote(time + noteTravelTime, lane2);
                    setTotalNotes(prev => prev + 1);
                }
                lastNoteTime.current = time;
            }
        }, 50);

        // Game Timer
        const timerInterval = setInterval(() => {
            if (isPaused) return;

            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);

        return () => {
            clearInterval(spawnInterval);
            clearInterval(timerInterval);
            cancelAnimationFrame(requestRef.current);
            if (audioRef.current) audioRef.current.pause();
            soundManager.stopSequence();
        };
    }, [isPaused, gameState]); 

    const hasCompletedRef = useRef(false);

    // Handle Game Completion
    useEffect(() => {
        if (gameState === 'PLAYING' && timeLeft === 0 && !hasCompletedRef.current) {
            hasCompletedRef.current = true;
            if (audioRef.current) audioRef.current.pause();
            soundManager.stopSequence();
            cancelAnimationFrame(requestRef.current);

            const { score, crowdEnergy, hitNotes, totalNotes } = statsRef.current;
            const accuracy = totalNotes > 0 ? (hitNotes / totalNotes) : 0;
            
            // Defer onComplete to ensure we are out of any render/state transition cycle
            const timeout = setTimeout(() => {
                onComplete(score, crowdEnergy, accuracy);
            }, 0);
            return () => clearTimeout(timeout);
        }
    }, [timeLeft, gameState, onComplete]);

    // Juice: Shake & Impact Decay
    useEffect(() => {
        if (shake > 0) {
            const timeout = setTimeout(() => setShake(0), 100);
            return () => clearTimeout(timeout);
        }
    }, [shake]);

    useEffect(() => {
        if (impact > 0) {
            requestAnimationFrame(() => setImpact(i => Math.max(0, i - 0.5)));
        }
    }, [impact]);

    // Handle Crank Volume
    useEffect(() => {
        // Simple visual/audio feedback for crank
        if(isCranking) {
            soundManager.setVolume(70, 70); // Louder
        } else {
            soundManager.setVolume(50, 30); // Normal
        }
    }, [isCranking]);

    const spawnNote = (targetTime: number, lane: number) => {
        const newNote: RhythmNote = {
            id: `n-${Date.now()}-${Math.random()}`,
            lane,
            timestamp: targetTime,
            hit: false,
            type: 'TAP'
        };
        setNotes(prev => [...prev, newNote]);
    };

    const gameLoop = () => {
        if (isPaused) {
            requestRef.current = requestAnimationFrame(gameLoop);
            return;
        }

        const currentTime = Date.now() - startTimeRef.current - totalPauseDurationRef.current;
        
        if (isCrankingRef.current) {
            setCrankMeter(c => {
                const next = c - 0.2;
                if (next <= 0) {
                    // Avoid setting state directly in render loop if possible, but here it's in requestAnimationFrame
                    // so it should be fine, but we can use a ref to track and set state outside if needed.
                    // Actually, gameLoop is called from requestAnimationFrame, so setState is safe here.
                    // The warning might be from somewhere else. Let's check where handleHit is called.
                    setIsCranking(false);
                    return 0;
                }
                return next;
            });
        }

        setNotes(prevNotes => {
            let missedCount = 0;
            const newNotes = prevNotes.map(n => {
                if (isAutopilotRef.current && !n.hit && currentTime >= n.timestamp - 20) {
                    // Autopilot hits it before it can be missed
                    setTimeout(() => handleHit(n.lane, true), 0);
                    return { ...n, hit: true }; // Mark as hit so we don't process it again
                }
                return n;
            }).filter(n => {
                if (!n.hit && n.timestamp < currentTime - 150) {
                    missedCount++;
                    return false;
                }
                return true;
            });

            if (missedCount > 0) {
                // Defer handleMiss to avoid setting state during render/setNotes
                setTimeout(() => handleMiss(missedCount), 0);
            }

            return newNotes;
        });
        
        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const togglePause = () => {
        if (isPaused) {
            const now = Date.now();
            totalPauseDurationRef.current += (now - pauseTimeRef.current);
            if (audioRef.current) audioRef.current.play();
            // soundManager handles resume automatically via context, usually fine
            setIsPaused(false);
        } else {
            pauseTimeRef.current = Date.now();
            if (audioRef.current) audioRef.current.pause();
            soundManager.stopSequence(); // Actually, pausing logic for seq is tricky without offset tracking. For now, pause just pauses game loop.
            setIsPaused(true);
        }
    };

    const addHitFeedback = (text: string, color: string, lane: number) => {
        const id = Date.now() + Math.random();
        setHitFeedbacks(prev => [...prev, { id, text, color, lane }]);
        setTimeout(() => {
            setHitFeedbacks(prev => prev.filter(f => f.id !== id));
        }, 800);
    };

    const handleMiss = (count: number) => {
        if (isAutopilotRef.current) return;
        setCombo(0);
        const penalty = isCrankingRef.current ? 10 : 5; // Higher penalty for cranking
        setHealth(h => Math.max(0, h - (penalty * count)));
        setCrowdEnergy(e => Math.max(0, e - (isCrankingRef.current ? 5 : 2)));
        
        // Play record scratch and mess up audio temporarily
        soundManager.playRecordScratch();
        if (audioRef.current) {
            audioRef.current.playbackRate = 0.5; // Slow down
            setTimeout(() => {
                if (audioRef.current) audioRef.current.playbackRate = 1.0; // Restore
            }, 500);
        } else {
            // For procedural audio, we can temporarily detune or lower volume
            soundManager.setVolume(20, 20); // Drop volume
            soundManager.setMessedUp(true);
            setTimeout(() => {
                soundManager.setMessedUp(false);
                if (isCrankingRef.current) {
                    soundManager.setVolume(70, 70);
                } else {
                    soundManager.setVolume(50, 30); // Restore normal
                }
            }, 500);
        }

        addHitFeedback("MISS", "text-red-500", 1);
        setShake(5); 
    };

    const triggerLaneFlash = (lane: number) => {
        setActiveLanes(prev => {
            const newLanes = [...prev];
            newLanes[lane] = true;
            return newLanes;
        });
        setTimeout(() => {
            setActiveLanes(prev => {
                const reset = [...prev];
                reset[lane] = false;
                return reset;
            });
        }, 100);
    };

    const handleHit = (lane: number, isAutomated = false) => {
        if (isPaused) return;

        const currentTime = Date.now() - startTimeRef.current - totalPauseDurationRef.current;
        triggerLaneFlash(lane);
        
        setNotes(prev => {
            const noteIndex = prev.findIndex(n => 
                !n.hit && 
                n.lane === lane && 
                Math.abs(n.timestamp - currentTime) < 150
            );

            if (noteIndex !== -1) {
                const note = prev[noteIndex];
                const diff = isAutomated ? 0 : Math.abs(note.timestamp - currentTime);
                
                // Crank Logic: Tighter windows, Higher Points
                const windowMultiplier = isCrankingRef.current ? 0.6 : 1.0; 
                const scoreMultiplier = isCrankingRef.current ? 2.5 : 1.0;

                let points = 50;
                let text = "GOOD";
                let color = "text-blue-400";
                
                if (diff < 50 * windowMultiplier) {
                    points = 200;
                    text = isCrankingRef.current ? "CRANKED!" : "PERFECT";
                    color = isCrankingRef.current ? "text-red-500 font-black" : "text-yellow-400";
                    // JUICE: Impact Frames & Particles
                    setImpact(5); 
                    soundManager.playOrchestraHit();
                    setPerfectBurst(prev => [...prev, { x: lane * 25 + 12.5, y: 80, id: Date.now() + Math.random() }]);
                    setTimeout(() => setPerfectBurst(prev => prev.slice(1)), 500);
                } else if (diff < 100 * windowMultiplier) {
                    points = 100;
                    text = "GREAT";
                    color = "text-green-400";
                }

                if (!isCrankingRef.current) {
                    setCrankMeter(c => Math.min(100, c + (points > 100 ? 5 : 2)));
                }

                setScore(s => s + Math.floor(points * scoreMultiplier));
                setCombo(c => c + 1);
                setHitNotes(h => h + 1);
                setCrowdEnergy(e => Math.min(100, e + (points > 100 ? 2 : 1)));
                setHealth(h => Math.min(100, h + 1));
                addHitFeedback(text, color, lane);
                
                if (note.lane === 0 || note.lane === 1) soundManager.playDrumHit();
                else soundManager.playClick();

                const newNotes = [...prev];
                newNotes.splice(noteIndex, 1); 
                return newNotes;
            }
            return prev;
        });
    };

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return;
            const key = e.key.toLowerCase();
            
            // Support Arrow Keys OR DFJK
            if (key === 'd' || key === 'arrowleft') handleHit(0);
            else if (key === 'f' || key === 'arrowdown') handleHit(1);
            else if (key === 'j' || key === 'arrowup') handleHit(2);
            else if (key === 'k' || key === 'arrowright') handleHit(3);
            else if (key === 'shift') {
                if (crankMeterRef.current > 0) setIsCranking(true);
            }
            else if (key === ' ') handleCapture(); 
            else if (key === 'escape' || key === 'p') togglePause();
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'shift') setIsCranking(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isPaused, score, isCranking]); 

    const handleCapture = () => {
        if (onCaptureMoment) {
            soundManager.playClick(); 
            const moment: Moment = {
                id: `m-${Date.now()}`,
                title: `${tuneType || 'Performance'} Highlight`,
                date: new Date().toLocaleDateString(),
                description: `Captured during a high energy performance! Score: ${score}`,
                thumbnailColor: '#ff00ff'
            };
            onCaptureMoment(moment);
            addHitFeedback("CAPTURED!", "text-white", 2);
        }
    };

    const getEnvironmentStyle = () => {
        switch(environment) {
            case 'PARADE': return "bg-gray-800";
            case 'CONCERT': return "bg-[#1a0505]";
            case 'ARENA': return "bg-yellow-900";
            case 'STADIUM': default: return "bg-green-900";
        }
    };

    const availableCategories = allowedCategories || ['HYPE', 'CADENCE', 'CALLOUT', 'CHANT'];

    if (gameState === 'SELECT') {
        return (
            <div className="w-full h-full bg-black/90 p-8 text-white font-mono flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                    <h2 className="text-3xl text-yellow-400 font-black">SELECT TUNE</h2>
                    <Button onClick={() => onComplete(0, 0, 0)} variant="danger" className="text-xs px-4 py-2">CANCEL</Button>
                </div>
                
                <p className="text-sm text-gray-400 mb-4 uppercase font-bold">{tuneType === 'FIELD_SHOW' ? 'PERFORM FULL SHOW' : 'PLAY STAND TUNE'}</p>
                
                <div className="flex gap-2 mb-8 flex-wrap justify-center">
                    {availableCategories.map(cat => (
                        <Button 
                            key={cat} 
                            onClick={() => setSelectedCategory(cat as any)} 
                            className={`text-xs px-3 py-2 ${selectedCategory === cat ? 'bg-blue-600 border-white' : 'bg-gray-800 border-gray-600'}`}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
                <div className="w-full max-w-2xl bg-gray-900 border-2 border-gray-700 h-64 overflow-y-auto">
                    {availableTracks.filter(t => t.category === selectedCategory).map(track => (
                        <div key={track.id} onClick={() => startGame(track)} className="p-4 border-b border-gray-800 hover:bg-gray-800 cursor-pointer flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="font-bold text-white">{track.title}</span>
                                <span className="text-[10px] text-gray-500 uppercase">{track.artist}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                {track.isCustom && <span className="text-[9px] bg-purple-900 px-2 rounded text-purple-300">CUSTOM</span>}
                                <span className="text-gray-400 text-xs font-mono">{track.bpm} BPM</span>
                            </div>
                        </div>
                    ))}
                    <div onClick={() => startGame()} className="p-4 border-b border-gray-800 hover:bg-gray-800 cursor-pointer flex justify-between">
                        <span className="font-bold text-gray-500 italic">FREESTYLE (No Track)</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className={`flex w-full h-full bg-black border-4 border-gray-800 select-none relative font-mono transition-colors duration-100 ${isCranking ? 'crank-active' : ''}`} 
            style={{ 
                transform: `translate(${Math.random() * (shake + impact) - (shake + impact)/2}px, ${Math.random() * (shake + impact) - (shake + impact)/2}px)`,
                filter: `blur(${impact/3}px) contrast(${100 + impact*20}%)`
            }}
        >
            
            {/* PAUSE MENU */}
            {isPaused && (
                <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
                    <h2 className="text-6xl font-pixel text-yellow-400 mb-8 tracking-widest italic transform -skew-x-12">PAUSED</h2>
                    <div className="flex flex-col gap-4 w-64">
                        <Button onClick={togglePause} className="py-4 text-xl">RESUME</Button>
                        <Button 
                            onClick={() => setIsAutopilot(!isAutopilot)} 
                            className={`py-4 text-xl border-2 ${isAutopilot ? 'bg-green-600 border-green-400' : 'bg-gray-800 border-gray-600'}`}
                        >
                            AUTOPILOT: {isAutopilot ? 'ON' : 'OFF'}
                        </Button>
                        <Button onClick={() => onComplete(0, 0, 0)} variant="danger" className="py-4 text-xl">QUIT</Button>
                    </div>
                </div>
            )}

            {/* LEFT: ARCADE HIGHWAY */}
            <div className="w-1/2 relative bg-black border-r-4 border-gray-700 overflow-hidden highway-container">
                {/* Background Grid for highway */}
                <div className="absolute inset-0 opacity-40" 
                     style={{
                         backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
                                           linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)`,
                         backgroundSize: '20px 20px',
                         transform: 'perspective(500px) rotateX(60deg)',
                         transformOrigin: 'bottom'
                     }}>
                </div>

                <div className="absolute inset-x-10 top-0 bottom-0 highway-board">
                    {/* The Fretboard */}
                    <div className="absolute inset-0 flex bg-black/80 border-x-4 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                        {[0, 1, 2, 3].map(i => (
                            <div 
                                key={i} 
                                className={`flex-1 relative border-r border-white/10 ${activeLanes[i] ? 'lane-flash-anim' : ''} ${inputMode === 'MOBILE' ? 'cursor-pointer active:bg-white/20' : ''}`}
                                onTouchStart={(e) => { e.preventDefault(); handleHit(i); }}
                                onMouseDown={() => inputMode === 'MOBILE' && handleHit(i)} 
                            >
                                {/* Hit Target Zone */}
                                <div className={`absolute bottom-0 w-full h-8 border-y-4 ${laneBorderColors[i]} bg-white/10 opacity-50`}></div>
                                
                                {/* Key Label */}
                                <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-2xl font-black ${laneColors[i].replace('bg', 'text')} opacity-80`}>
                                    {inputMode === 'MOBILE' ? '' : laneKeys[i]}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* NOTES */}
                    {notes.map(note => {
                        const currentTime = Date.now() - startTimeRef.current - totalPauseDurationRef.current;
                        const timeUntilHit = note.timestamp - currentTime;
                        const progress = 1 - (timeUntilHit / 1500); 

                        if (progress < 0 || progress > 1.1) return null;

                        return (
                            <div 
                                key={note.id}
                                className="absolute w-1/4 flex justify-center items-center pointer-events-none"
                                style={{
                                    left: `${note.lane * 25}%`,
                                    top: `${progress * 90}%`,
                                    height: '60px',
                                    opacity: progress < 0.1 ? progress * 10 : 1
                                }}
                            >
                                {/* Note Graphic: Glowing Pixel Shape */}
                                <div 
                                    className={`
                                        w-full aspect-video ${laneColors[note.lane]}
                                        shadow-[0_0_15px_currentColor] border-2 border-white
                                        transform rotate-45 scale-75
                                        ${progress > 0.85 && progress < 1.05 ? 'brightness-150' : ''}
                                    `}
                                    style={{
                                        width: `${30 + (progress * 40)}px`,
                                        height: `${30 + (progress * 40)}px`,
                                    }}
                                >
                                    <div className="absolute inset-2 border border-black/50"></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* HUD Elements */}
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                    <div className="text-4xl font-pixel text-white italic drop-shadow-md">
                        SCORE <span className="text-yellow-400">{score}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-300 mt-2">
                        COMBO <span className={`${combo > 10 ? 'text-cyan-400 animate-pulse scale-110 inline-block' : 'text-white'}`}>{combo}x</span>
                    </div>
                    
                    {/* CRANK METER */}
                    <div className="mt-4 w-48">
                        <div className="text-xs font-bold text-white mb-1 uppercase tracking-widest">CRANK METER</div>
                        <div className="h-4 w-full bg-black border-2 border-white overflow-hidden relative">
                            <div 
                                className={`h-full transition-all duration-100 ${crankMeter >= 100 ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} 
                                style={{ width: `${crankMeter}%` }}
                            ></div>
                        </div>
                        {crankMeter >= 100 && !isCranking && <div className="text-[10px] text-red-400 mt-1 animate-bounce">HOLD SHIFT TO CRANK!</div>}
                    </div>

                    {isAutopilot && <div className="text-green-400 font-bold bg-black/50 px-2 mt-2 border border-green-500 inline-block">AUTOPILOT</div>}
                    {isCranking && (
                        <div className="mt-4 text-4xl font-black text-red-500 italic animate-bounce tracking-widest drop-shadow-[2px_2px_0_white]">
                            CRANK MODE! (2x)
                        </div>
                    )}
                </div>

                {/* Feedback Popups */}
                {hitFeedbacks.map(fb => (
                    <div 
                        key={fb.id}
                        className={`absolute top-1/2 left-0 w-full text-center text-5xl font-black ${fb.color} score-popup z-50 drop-shadow-[0_4px_0_rgba(0,0,0,1)] pointer-events-none`}
                        style={{ left: `${(fb.lane - 1.5) * 15}%` }} 
                    >
                        {fb.text}
                    </div>
                ))}

                {/* Perfect Particles */}
                {perfectBurst.map(burst => (
                    <div 
                        key={burst.id}
                        className="absolute w-20 h-20 pointer-events-none z-40 animate-[ping_0.5s_ease-out] border-4 border-yellow-400 rounded-full opacity-50"
                        style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
                    ></div>
                ))}
            </div>


            {/* RIGHT: BAND VISUALS */}
            <div className={`w-1/2 relative overflow-hidden flex flex-col ${getEnvironmentStyle()}`}>
                 <div className="absolute top-4 right-4 z-50 flex gap-2">
                     {/* Mobile Crank Toggle */}
                     {inputMode === 'MOBILE' && (
                         <button 
                            onTouchStart={() => setIsCranking(true)} 
                            onTouchEnd={() => setIsCranking(false)}
                            className={`w-24 h-12 border-2 text-white font-bold text-sm ${isCranking ? 'bg-red-600 border-white' : 'bg-gray-900 border-gray-500'}`}
                         >
                             HOLD CRANK
                         </button>
                     )}
                     <button onClick={togglePause} className="w-12 h-12 bg-gray-900 border-2 border-white text-white flex items-center justify-center font-bold text-xl hover:bg-gray-700 shadow-[2px_2px_0_0_#000]">
                         II
                     </button>
                 </div>

                 {/* Retro Visual Overlay */}
                 <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>

                 <div className="absolute top-4 right-20 z-20 text-right">
                     <div className="text-6xl font-pixel text-white drop-shadow-[4px_4px_0_#000]">{timeLeft}</div>
                     <div className="text-xs uppercase font-bold tracking-widest text-yellow-500 bg-black px-1">TIME REMAINING</div>
                     {inputMode === 'PC' && <div className="text-[10px] text-gray-400 mt-1">HOLD SHIFT TO CRANK!</div>}
                 </div>

                 <div className="flex-grow flex items-center justify-center p-8 relative z-10 perspective-container">
                    {activeDrill && drillFrameIndex !== undefined ? (
                        <div className="relative w-full h-full bg-green-800 border-4 border-white">
                            {activeDrill.frames[drillFrameIndex]?.points.map(point => {
                                const member = members.find(m => m.id === point.memberId);
                                if (!member) return null;
                                
                                const memberUniform = (member.instrument === InstrumentType.MACE && dmUniform) ? dmUniform 
                                    : (member.instrument === InstrumentType.MAJORETTE && majoretteUniform) ? majoretteUniform
                                    : (member.instrument === InstrumentType.GUARD && guardUniform) ? guardUniform
                                    : (uniform || DEFAULT_UNIFORMS[0]);

                                return (
                                    <div key={member.id} className="absolute transition-all duration-500" style={{ left: `${(point.x / GRID_SIZE) * 100}%`, top: `${(point.y / GRID_SIZE) * 100}%` }}>
                                        <BandMemberVisual 
                                            instrument={member.instrument}
                                            uniform={memberUniform}
                                            appearance={member.appearance}
                                            isPlaying={!isPaused}
                                            scale={0.5} 
                                            instrumentConfig={getInstrumentConfig(member.instrument)}
                                            maceConfig={instrumentDesigns?.mace}
                                            logoGrid={logoGrid}
                                            isCranking={isCranking}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-6 items-center transform scale-90">
                            {visibleMembers.map((member, i) => {
                                // Check if member is Mace and we have a specific DM uniform
                                const memberUniform = (member.instrument === InstrumentType.MACE && dmUniform) ? dmUniform 
                                    : (member.instrument === InstrumentType.MAJORETTE && majoretteUniform) ? majoretteUniform
                                    : (member.instrument === InstrumentType.GUARD && guardUniform) ? guardUniform
                                    : (uniform || DEFAULT_UNIFORMS[0]);

                                return (
                                    <div key={member.id} className="transform transition-transform duration-100" style={{ transform: `scale(${combo > 20 ? 1.1 : 1})` }}>
                                        <BandMemberVisual 
                                            instrument={member.instrument}
                                            uniform={memberUniform}
                                            appearance={member.appearance}
                                            isPlaying={!isPaused}
                                            scale={0.9} 
                                            instrumentConfig={getInstrumentConfig(member.instrument)}
                                            maceConfig={instrumentDesigns?.mace}
                                            logoGrid={logoGrid}
                                            isCranking={isCranking}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                 </div>

                 {/* CROWD METER */}
                 <div className="absolute bottom-8 left-8 right-8 z-20">
                     <div className="flex justify-between text-xs font-bold text-white mb-1 uppercase tracking-widest bg-black px-2 inline-block">
                         <span>Bored</span>
                         <span>Hyped</span>
                     </div>
                     <div className="h-8 w-full bg-black border-4 border-white overflow-hidden relative shadow-[4px_4px_0_0_#000]">
                         <div className="absolute inset-0 bg-red-900 w-full"></div>
                         
                         <div 
                            className={`h-full transition-all duration-300 ${crowdEnergy > 80 ? 'bg-yellow-400 animate-pulse' : 'bg-cyan-500'}`} 
                            style={{ width: `${crowdEnergy}%` }}
                         >
                             <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)]"></div>
                         </div>
                         
                         <div className="absolute top-0 bottom-0 left-[20%] w-1 bg-red-500 z-10"></div>
                     </div>
                     <div className="text-center text-xs mt-1 text-gray-400 font-pixel">CROWD ENERGY</div>
                 </div>
            </div>
        </div>
    );
};
