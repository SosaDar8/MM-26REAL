
import React, { useState, useEffect, useRef } from 'react';
import { GameState, SequencerTrack, MusicTrack, SongCategory } from '../types';
import { Button } from './Button';
import { soundManager } from '../services/soundManager';
import { INITIAL_TRACKS, VIDEO_TITLES, GAME_VERSION } from '../constants';

interface LaptopOSProps {
    gameState: GameState;
    onClose: () => void;
    onSaveTrack: (track: MusicTrack) => void;
}

export const LaptopOS: React.FC<LaptopOSProps> = ({ gameState, onClose, onSaveTrack }) => {
    const [activeApp, setActiveApp] = useState<'DESKTOP' | 'FUSECORE' | 'BROWSER' | 'FILES' | 'ROSTER' | 'FINANCE' | 'RECRUIT' | 'MUSIC_LIB'>('DESKTOP');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000);
        return () => clearInterval(timer);
    }, []);

    // --- FUSECORE APP (Advanced DAW Sequencer) ---
    const FuseCore = () => {
        const [measures, setMeasures] = useState(1);
        const [resolution, setResolution] = useState<1 | 2 | 4 | 8 | 16>(16);
        const totalSteps = measures * 16;

        const [seqGrid, setSeqGrid] = useState<SequencerTrack[]>([
            { instrument: 'kick', notes: Array(64).fill(0) },
            { instrument: 'snare', notes: Array(64).fill(0) },
            { instrument: 'hat', notes: Array(64).fill(0) },
            { instrument: 'bass', notes: Array(64).fill(0) },
            { instrument: 'melody', notes: Array(64).fill(0) }
        ]);

        const [bpm, setBpm] = useState(128);
        const [isPlaying, setIsPlaying] = useState(false);
        const [currentStep, setCurrentStep] = useState(0);
        const [trackName, setTrackName] = useState("New Sequence");
        const [selectedCategory, setSelectedCategory] = useState<SongCategory>('HYPE');
        const [chantLyrics, setChantLyrics] = useState("");
        const [showImport, setShowImport] = useState(false);
        const seqInterval = useRef<any>(null);

        // Sequence Playback Logic
        useEffect(() => {
            if (isPlaying && selectedCategory !== 'CHANT') {
                const stepTime = (60000 / bpm) / 4;
                seqInterval.current = setInterval(() => {
                    setCurrentStep(prev => (prev + 1) % totalSteps);
                }, stepTime);
                soundManager.startSequence(seqGrid.map(t => ({...t, notes: t.notes.slice(0, totalSteps)})), bpm);
            } else {
                clearInterval(seqInterval.current);
                soundManager.stopSequence();
                setCurrentStep(0);
                if (selectedCategory !== 'CHANT') setIsPlaying(false);
            }
            return () => {
                clearInterval(seqInterval.current);
                soundManager.stopSequence();
            };
        }, [isPlaying, bpm, seqGrid, totalSteps]); // Removing selectedCategory from deps to prevent reset

        const toggleNote = (trackIndex: number, noteIndex: number) => {
            const newGrid = [...seqGrid];
            const currentVal = newGrid[trackIndex].notes[noteIndex];
            
            let noteValue = 1;
            if (newGrid[trackIndex].instrument === 'bass') noteValue = 36 + Math.floor(Math.random() * 12); 
            if (newGrid[trackIndex].instrument === 'melody') noteValue = 60 + Math.floor(Math.random() * 12);
            
            newGrid[trackIndex].notes[noteIndex] = currentVal > 0 ? 0 : noteValue;
            setSeqGrid(newGrid);
        };

        const handleSave = () => {
            if (!trackName.trim()) { alert("Enter a Project Name."); return; }
            if (selectedCategory === 'CHANT' && !chantLyrics.trim()) { alert("Enter lyrics."); return; }
            
            const newTrack: MusicTrack = {
                id: `fuse-${Date.now()}`,
                title: trackName,
                artist: gameState.director.name,
                bpm: bpm,
                duration: selectedCategory === 'CHANT' ? '0:10' : `${Math.floor((totalSteps/16)*8)}s`,
                isCustom: true,
                category: selectedCategory,
                sequence: selectedCategory === 'CHANT' ? undefined : seqGrid.map(t => ({...t, notes: t.notes.slice(0, totalSteps)})),
                lyrics: selectedCategory === 'CHANT' ? chantLyrics : undefined
            };
            onSaveTrack(newTrack);
            alert(`"${trackName}" ready for field use!`);
        };

        const handleImport = (track: MusicTrack) => {
            setTrackName(track.title);
            setBpm(track.bpm);
            // This set ensures imported category sticks
            setSelectedCategory(track.category);
            
            if (track.category === 'CHANT') {
                setChantLyrics(track.lyrics || "");
            } else if (track.sequence) {
                const importedSteps = track.sequence[0].notes.length;
                setMeasures(Math.max(1, Math.floor(importedSteps / 16)));
                const newGrid = seqGrid.map((t, i) => {
                    const match = track.sequence?.find(st => st.instrument === t.instrument);
                    const paddedNotes = Array(64).fill(0);
                    if (match) match.notes.forEach((n, idx) => { if(idx < 64) paddedNotes[idx] = n; });
                    return { ...t, notes: paddedNotes };
                });
                setSeqGrid(newGrid);
            }
            setShowImport(false);
        };

        const applyDAWPreset = (type: string) => {
            const newGrid = seqGrid.map(t => ({ ...t, notes: Array(64).fill(0) }));
            for(let m=0; m < measures; m++) {
                const offset = m * 16;
                if (type === 'HYPE_BASIC') {
                    for(let i=0; i<16; i+=4) newGrid[0].notes[offset + i] = 1; // Kick
                    newGrid[1].notes[offset + 4] = 1; newGrid[1].notes[offset + 12] = 1; // Snare
                    for(let i=0; i<16; i+=2) newGrid[2].notes[offset + i] = 1; // Hat
                } else if (type === 'CADENCE_HEAVY') {
                    for(let i=0; i<16; i++) newGrid[1].notes[offset + i] = Math.random() > 0.4 ? 1 : 0; // Random snare roll
                    for(let i=0; i<16; i+=8) newGrid[0].notes[offset + i] = 1;
                } else if (type === 'MELODIC_GLIDE') {
                    [0, 2, 4, 7, 9].forEach((n, idx) => {
                        newGrid[4].notes[offset + (idx * 2)] = 60 + n;
                        newGrid[3].notes[offset + (idx * 2)] = 36 + n;
                    });
                }
            }
            setSeqGrid(newGrid);
        };

        const renderDAWGrid = () => {
            if (selectedCategory === 'CHANT') {
                return (
                    <div className="flex-grow p-12 flex flex-col items-center justify-center bg-[#090909]">
                        <div className="w-full max-w-3xl bg-[#151515] border-t-8 border-orange-600 p-10 rounded shadow-2xl">
                            <h3 className="text-orange-500 font-black mb-6 uppercase tracking-widest text-lg flex items-center gap-3">
                                <span className="w-3 h-3 bg-orange-500 animate-ping"></span> CHANT VOCALIZER
                            </h3>
                            <textarea 
                                value={chantLyrics}
                                onChange={(e) => setChantLyrics(e.target.value.toUpperCase())}
                                className="w-full h-64 bg-black border-2 border-[#333] rounded p-6 text-3xl font-black text-white placeholder-gray-800 outline-none focus:border-orange-500 transition-all shadow-inner"
                                placeholder="TYPE YOUR CHANT... (GO TEAM GO!)"
                            />
                        </div>
                    </div>
                );
            }

            return (
                <div className="flex-grow flex flex-col bg-[#050505] overflow-hidden">
                    {/* Resolution & Measure Strip */}
                    <div className="bg-[#111] h-10 border-b border-black flex items-center px-4 gap-6 text-[10px] font-black uppercase">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">GRID RES:</span>
                            {[1, 2, 4, 8, 16].map(r => (
                                <button 
                                    key={r} 
                                    onClick={() => setResolution(r as any)}
                                    className={`w-6 h-6 border ${resolution === r ? 'bg-orange-600 border-white text-white' : 'bg-black border-gray-800 text-gray-600 hover:text-gray-400'}`}
                                >{r}</button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">LENGTH:</span>
                            {[1, 2, 4].map(m => (
                                <button 
                                    key={m} 
                                    onClick={() => setMeasures(m)}
                                    className={`px-3 h-6 border ${measures === m ? 'bg-blue-600 border-white text-white' : 'bg-black border-gray-800 text-gray-600 hover:text-gray-400'}`}
                                >{m} MEASURE{m > 1 ? 'S' : ''}</button>
                            ))}
                        </div>
                    </div>

                    {/* The Grid Scroller */}
                    <div className="flex-grow overflow-x-auto overflow-y-auto custom-scrollbar p-6">
                        <div className="inline-block min-w-full">
                            {/* Steps Ruler */}
                            <div className="flex mb-2 ml-32">
                                {[...Array(totalSteps)].map((_, i) => (
                                    <div key={i} className={`w-10 text-center text-[9px] font-black ${i % 16 === 0 ? 'text-blue-400 underline' : i % 4 === 0 ? 'text-white' : 'text-gray-700'}`}>
                                        {i + 1}
                                    </div>
                                ))}
                            </div>

                            {seqGrid.map((track, tIdx) => (
                                <div key={tIdx} className="flex gap-2 mb-2">
                                    {/* Track Header */}
                                    <div className="w-28 h-10 flex-shrink-0 bg-[#151515] border border-gray-800 rounded flex items-center justify-between px-3 group">
                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{track.instrument}</span>
                                        <div className="w-2 h-2 rounded-full bg-gray-800 group-hover:bg-orange-500"></div>
                                    </div>

                                    {/* Steps Grid */}
                                    <div className="flex gap-1">
                                        {[...Array(totalSteps)].map((_, nIdx) => {
                                            const isVisible = nIdx % (16 / resolution) === 0;
                                            const note = track.notes[nIdx];
                                            const isDownbeat = nIdx % 4 === 0;
                                            const isMeasureStart = nIdx % 16 === 0;

                                            return (
                                                <div 
                                                    key={nIdx}
                                                    onClick={() => isVisible && toggleNote(tIdx, nIdx)}
                                                    className={`
                                                        w-9 h-10 rounded-sm transition-all relative border
                                                        ${!isVisible ? 'bg-[#080808] border-transparent cursor-default' : 
                                                          note > 0 
                                                            ? 'bg-orange-500 border-orange-300 shadow-[0_0_10px_rgba(255,165,0,0.4)] cursor-pointer' 
                                                            : isMeasureStart ? 'bg-[#222] border-blue-900 cursor-pointer hover:bg-[#333]' 
                                                            : isDownbeat ? 'bg-[#181818] border-gray-800 cursor-pointer hover:bg-[#252525]' 
                                                            : 'bg-[#111] border-gray-900 cursor-pointer hover:bg-[#222]'}
                                                        ${isPlaying && currentStep === nIdx ? 'ring-2 ring-white z-10' : ''}
                                                    `}
                                                >
                                                    {note > 0 && isVisible && (track.instrument === 'melody' || track.instrument === 'bass') && (
                                                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-orange-950">
                                                            {note}
                                                        </div>
                                                    )}
                                                    {isPlaying && currentStep === nIdx && isVisible && (
                                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]"></div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div className="w-full h-full bg-[#111] flex flex-col text-gray-300 font-sans relative">
                {showImport && (
                    <div className="absolute inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-12">
                        <h3 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter italic">LOAD PROJECT DATA</h3>
                        <div className="w-full max-w-2xl bg-gray-900 border-2 border-blue-900 max-h-96 overflow-y-auto mb-8 shadow-2xl rounded">
                            {gameState.musicLibrary.filter(t => t.sequence || t.category === 'CHANT').map(t => (
                                <div key={t.id} onClick={() => handleImport(t)} className="p-5 hover:bg-blue-900/20 cursor-pointer border-b border-gray-800 flex justify-between items-center group transition-all">
                                    <div className="flex flex-col">
                                        <span className="font-black text-white text-lg group-hover:text-blue-400">{t.title}</span>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">{t.category} // {t.bpm} BPM</span>
                                    </div>
                                    <span className="text-[10px] font-black bg-blue-900/50 px-3 py-1 rounded text-blue-200">{t.isCustom ? 'USER_X' : 'SYS_OS'}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4 w-full max-w-2xl">
                            <label className="flex-1 bg-green-900 hover:bg-green-800 border-2 border-green-500 text-green-400 font-black p-4 text-center cursor-pointer transition-all uppercase tracking-widest">
                                IMPORT AUDIO FROM COMPUTER
                                <input 
                                    type="file" 
                                    accept="audio/*" 
                                    className="hidden" 
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                const audioUrl = event.target?.result as string;
                                                const newTrack: MusicTrack = {
                                                    id: `custom-audio-${Date.now()}`,
                                                    title: file.name.replace(/\.[^/.]+$/, ""),
                                                    artist: gameState.director.name,
                                                    bpm: 120,
                                                    duration: "Audio File",
                                                    isCustom: true,
                                                    category: 'SHOW',
                                                    audioUrl: audioUrl
                                                };
                                                onSaveTrack(newTrack);
                                                alert(`Successfully imported ${file.name}! It is now in your Music Library.`);
                                                setShowImport(false);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }} 
                                />
                            </label>
                            <Button onClick={() => setShowImport(false)} variant="secondary" className="flex-1">ABORT</Button>
                        </div>
                    </div>
                )}

                <div className="h-14 bg-gradient-to-b from-[#222] to-[#0a0a0a] flex items-center justify-between px-6 border-b border-black">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-orange-600 rounded-sm shadow-[0_0_15px_rgba(234,88,12,0.6)] animate-pulse"></div>
                        <span className="font-black text-orange-600 tracking-tight text-xl italic uppercase">FuseCore <span className="text-gray-500 not-italic ml-2 text-xs">V2.4 WORKSTATION</span></span>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setActiveApp('DESKTOP')} className="hover:text-white transition-all hover:scale-110">_</button>
                        <button onClick={() => setActiveApp('DESKTOP')} className="hover:text-red-500 font-black transition-all hover:scale-110">X</button>
                    </div>
                </div>

                <div className="bg-[#151515] p-4 flex flex-wrap gap-8 border-b border-black items-end shadow-lg z-10">
                    <div className="flex flex-col">
                        <label className="text-[9px] uppercase font-black text-gray-600 tracking-[0.2em] mb-1">PROJECT NAME</label>
                        <input 
                            value={trackName} 
                            onChange={(e) => setTrackName(e.target.value)} 
                            className="bg-black border border-[#333] text-white px-4 py-2 text-xs w-64 font-bold outline-none focus:border-blue-600 rounded-sm"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[9px] uppercase font-black text-gray-600 tracking-[0.2em] mb-1">SONG ARCHETYPE</label>
                        <select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value as SongCategory)}
                            className="bg-black border border-[#333] text-orange-500 px-4 py-2 text-xs w-48 font-black outline-none cursor-pointer rounded-sm"
                        >
                            <option value="HYPE">FIELD HYPE</option>
                            <option value="CADENCE">PERCUSSION CADENCE</option>
                            <option value="CALLOUT">FAN CALLOUT</option>
                            <option value="CHANT">CHANT (LYRIC)</option>
                            <option value="SHOW">SHOW STOPPER</option>
                        </select>
                    </div>
                    {selectedCategory !== 'CHANT' && (
                        <div className="flex flex-col">
                            <label className="text-[9px] uppercase font-black text-gray-600 tracking-[0.2em] mb-1">TEMPO (BPM)</label>
                            <input 
                                type="number" 
                                value={bpm} 
                                onChange={(e) => setBpm(parseInt(e.target.value))} 
                                className="bg-black border border-[#333] text-green-500 px-4 py-2 text-xs w-24 font-mono font-bold outline-none rounded-sm"
                            />
                        </div>
                    )}
                    
                    <div className="flex-grow"></div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowImport(true)}
                            className="px-6 h-10 rounded-sm bg-[#222] border border-[#333] hover:bg-[#333] hover:border-gray-500 text-white font-black text-[10px] transition-all uppercase"
                        >
                            Open Project
                        </button>
                        {selectedCategory !== 'CHANT' && (
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`px-10 h-10 rounded-sm font-black text-[10px] transition-all shadow-xl uppercase ${isPlaying ? 'bg-red-600 text-white animate-pulse' : 'bg-green-600 text-black border-b-4 border-green-800'}`}
                            >
                                {isPlaying ? 'Stop' : 'Play'}
                            </button>
                        )}
                        <Button onClick={handleSave} className="text-[10px] bg-blue-700 hover:bg-blue-600 border-none h-10 px-8 font-black italic rounded-sm uppercase">Export</Button>
                    </div>
                </div>

                {/* Preset Strip */}
                {selectedCategory !== 'CHANT' && (
                    <div className="bg-[#0c0c0c] p-2 px-6 border-b border-[#222] flex gap-3 overflow-x-auto items-center">
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mr-4">SMART PRESETS:</span>
                        {['HYPE_BASIC', 'CADENCE_HEAVY', 'MELODIC_GLIDE'].map(p => (
                            <button 
                                key={p} 
                                onClick={() => applyDAWPreset(p)}
                                className="bg-[#1a1a1a] hover:bg-blue-900/30 hover:border-blue-500 text-[9px] px-5 py-1.5 rounded-full font-black text-gray-400 border border-[#222] transition-all uppercase"
                            >
                                {p.replace('_', ' ')}
                            </button>
                        ))}
                        <button 
                            onClick={() => {
                                setSeqGrid(seqGrid.map(t => ({...t, notes: Array(64).fill(0)})));
                                setIsPlaying(false);
                            }}
                            className="text-[8px] font-black px-4 py-1.5 rounded-full text-red-900 border border-red-900/20 ml-auto hover:bg-red-900 hover:text-white transition-all"
                        >
                            CLEAR ALL STEPS
                        </button>
                    </div>
                )}

                {renderDAWGrid()}

                <div className="h-8 bg-black border-t border-[#1a1a1a] px-6 flex items-center justify-between text-[9px] text-gray-700 font-mono">
                    <div className="flex gap-8">
                        <span>LATENCY: 12ms</span>
                        <span>DSP LOAD: 8%</span>
                        <span>SAMPLE RATE: 44.1kHz</span>
                    </div>
                    <div className="text-gray-800 font-black italic tracking-widest uppercase">MARKTIME DAW 2026 EDITION</div>
                </div>
            </div>
        );
    };

    // --- MUSIC LIBRARY APP ---
    const MusicLibApp = () => {
        const [playingId, setPlayingId] = useState<string | null>(null);
        const fileInputRef = useRef<HTMLInputElement>(null);

        const togglePlay = (track: MusicTrack) => {
            if (playingId === track.id) {
                soundManager.stopSequence();
                if(track.audioUrl) {
                    // Logic to pause HTML audio if implemented, for now just toggle state
                }
                setPlayingId(null);
            } else {
                soundManager.stopSequence();
                setPlayingId(track.id);
                if (track.category === 'CHANT') {
                    alert(`CHANT: ${track.lyrics}`);
                    setPlayingId(null);
                } else if (track.sequence) {
                    soundManager.startSequence(track.sequence, track.bpm);
                } else if (track.audioUrl) {
                    const audio = new Audio(track.audioUrl);
                    audio.play();
                    audio.onended = () => setPlayingId(null);
                }
            }
        };

        const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const url = URL.createObjectURL(file);
                const newTrack: MusicTrack = {
                    id: `local-${Date.now()}`,
                    title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
                    artist: 'Imported',
                    bpm: 120, // Default for imported audio
                    isCustom: true,
                    duration: 'Unknown',
                    category: 'HYPE',
                    audioUrl: url
                };
                onSaveTrack(newTrack);
            }
        };

        return (
            <div className="w-full h-full bg-[#121212] flex flex-col font-sans text-white">
                <div className="bg-[#27272a] p-3 flex justify-between items-center border-b border-black">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📻</span>
                        <span className="font-black text-green-400 tracking-tighter uppercase">GrooveBox Library</span>
                    </div>
                    <button onClick={() => setActiveApp('DESKTOP')} className="bg-red-600 px-3 py-1 rounded text-xs font-black">X</button>
                </div>
                
                <div className="bg-black p-3 border-b border-gray-800 flex justify-end">
                    <input 
                        type="file" 
                        accept="audio/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-4 py-2 rounded uppercase tracking-wide"
                    >
                        + Import MP3/WAV
                    </button>
                </div>

                <div className="flex-grow p-6 overflow-y-auto">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-3xl font-black italic tracking-tighter">ALL TRACKS</h2>
                        <div className="text-[10px] text-gray-500 font-mono">{gameState.musicLibrary.length} PROJECTS FOUND</div>
                    </div>
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="text-gray-500 border-b border-gray-800 text-[10px] font-black uppercase tracking-widest">
                                <th className="p-3">Title</th>
                                <th className="p-3">Genre/Logic</th>
                                <th className="p-3">BPM</th>
                                <th className="p-3 text-right">Playback</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-900">
                            {gameState.musicLibrary.map(track => (
                                <tr key={track.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-3">
                                        <div className="font-black text-white group-hover:text-green-400 transition-colors">{track.title}</div>
                                        <div className="text-[9px] text-gray-600 uppercase font-bold">{track.artist}</div>
                                    </td>
                                    <td className="p-3 text-xs">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${track.category === 'CHANT' ? 'bg-orange-900 text-orange-400' : 'bg-gray-800 text-gray-400'}`}>
                                            {track.category}
                                        </span>
                                    </td>
                                    <td className="p-3 font-mono text-gray-500">{track.category === 'CHANT' ? '---' : track.bpm}</td>
                                    <td className="p-3 text-right">
                                        <button 
                                            onClick={() => togglePlay(track)}
                                            className={`px-6 py-2 rounded text-[10px] font-black transition-all ${playingId === track.id ? 'bg-red-600 text-white' : 'bg-green-600 text-black hover:scale-105'}`}
                                        >
                                            {playingId === track.id ? 'STOP' : track.category === 'CHANT' ? 'PREVIEW' : 'PLAY'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // --- BROWSER APP ---
    const Browser = () => {
        const [url, setUrl] = useState("https://www.band-daily.net");
        return (
            <div className="w-full h-full bg-white flex flex-col font-sans text-black">
                <div className="bg-gray-200 p-2 flex gap-2 border-b border-gray-400 items-center">
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <input className="flex-grow bg-white border border-gray-300 rounded px-2 py-1 text-xs outline-none" value={url} readOnly />
                    <button onClick={() => setActiveApp('DESKTOP')} className="text-xs font-bold px-2 hover:bg-gray-300 rounded transition-colors">X</button>
                </div>
                <div className="flex-grow overflow-y-auto p-8">
                    <h1 className="text-5xl font-black mb-6 text-blue-900 italic tracking-tighter border-b-4 border-blue-900 inline-block">Band Daily News</h1>
                    <div className="grid grid-cols-3 gap-8">
                        <div className="col-span-2">
                            <div className="h-80 bg-gray-300 mb-6 flex items-center justify-center text-gray-500 font-bold border-4 border-black shadow-[8px_8px_0_black]">TOP STORY: FINALS BROADCAST</div>
                            <h2 className="text-3xl font-black mb-3 uppercase tracking-tighter">"Is The 8-to-5 Step Dead?"</h2>
                            <p className="text-lg text-gray-700 leading-relaxed font-serif">Controversy erupts as more bands switch to corps-style gliding. Traditionalists argue it lacks the 'snap' that defines the craft. One director called it "marching on ice."</p>
                        </div>
                        <div className="col-span-1 bg-yellow-50 p-6 border-4 border-black shadow-[8px_8px_0_black]">
                            <h3 className="font-black text-xs mb-4 text-yellow-900 border-b border-yellow-200 pb-1 uppercase tracking-widest">Sponsored Content</h3>
                            <div className="text-sm mb-6 italic">"Buy 'DrillMaster 3000' - The only shoe that guarantees a 99.8 score or your money back."</div>
                            <h3 className="font-black text-xs mb-4 text-blue-900 border-b border-blue-200 pb-1 uppercase tracking-widest">Trending Vids</h3>
                            <ul className="text-sm space-y-3 text-blue-700 font-bold">
                                {VIDEO_TITLES.slice(0, 4).map((t, i) => (
                                    <li key={i} className="hover:underline cursor-pointer flex gap-2">
                                        <span className="text-gray-400">0{i+1}</span>
                                        {t.replace('{bandName}', 'YOUR BAND').replace('{rivalName}', 'RIVALS')}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- RECRUIT APP ---
    const RecruitApp = () => {
        const handleHire = (recruit: any) => {
            if (gameState.funds < recruit.salary) {
                alert("Insufficient funds!");
                return;
            }
            // Trigger hiring event via global listener
            const event = new CustomEvent('mf-phone-action', { detail: { action: 'HIRE_MEMBER', data: recruit } });
            window.dispatchEvent(event);
            alert(`Hired ${recruit.name}!`);
        };

        return (
            <div className="w-full h-full bg-[#f0f4f8] flex flex-col font-sans text-black border-2 border-white shadow-lg">
                <div className="bg-[#3b82f6] text-white px-4 py-3 flex justify-between items-center text-sm font-black italic tracking-tighter">
                    <span>RECRUITNET talent v2.1</span>
                    <button onClick={() => setActiveApp('DESKTOP')} className="bg-red-600 px-3 rounded border border-white font-bold">X</button>
                </div>
                <div className="flex-grow p-6 overflow-y-auto">
                    {gameState.recruitPool.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                            <span className="text-6xl mb-4">📡</span>
                            <div className="text-lg font-black uppercase">No Active Prospects</div>
                            <p className="text-sm">Run recruiting campaigns to find new talent.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {gameState.recruitPool.map(r => (
                                <div key={r.id} className="bg-white p-4 border-2 border-black shadow-[4px_4px_0_black] flex justify-between items-center group hover:bg-blue-50 transition-all">
                                    <div>
                                        <div className="font-black text-xl text-blue-950 uppercase tracking-tighter">{r.name}</div>
                                        <div className="flex gap-2 mt-1">
                                            <span className="bg-gray-200 text-[10px] font-black px-2 py-0.5 rounded uppercase">{r.instrument}</span>
                                            <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">Skill: {r.playSkill}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 italic mt-2">"{r.bio}"</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="text-2xl font-black text-green-700">${r.salary.toLocaleString()}</div>
                                        <button 
                                            onClick={() => handleHire(r)}
                                            className="bg-green-600 hover:bg-green-500 text-white font-black text-xs px-6 py-2 border-2 border-black shadow-[2px_2px_0_black] active:translate-y-1 active:shadow-none transition-all uppercase"
                                        >
                                            Sign Contract
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // --- ROSTER APP ---
    const RosterApp = () => (
        <div className="w-full h-full bg-[#e0e0e0] flex flex-col font-sans text-black border-2 border-white shadow-lg">
            <div className="bg-blue-950 text-white px-4 py-2 flex justify-between items-center text-xs font-black uppercase tracking-widest">
                <span>Roster Dynamics Core</span>
                <button onClick={() => setActiveApp('DESKTOP')} className="bg-red-600 px-3 border border-white font-bold">X</button>
            </div>
            <div className="flex-grow p-6 overflow-y-auto">
                <table className="w-full text-sm border-collapse border-4 border-black bg-white shadow-[10px_10px_0_rgba(0,0,0,0.1)]">
                    <thead className="bg-gray-100 font-black uppercase text-xs">
                        <tr>
                            <th className="border-2 border-black p-3 text-left">Member Name</th>
                            <th className="border-2 border-black p-3 text-left">Section</th>
                            <th className="border-2 border-black p-3">Skill Index</th>
                            <th className="border-2 border-black p-3 text-right">Retention</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gameState.members.map(m => (
                            <tr key={m.id} className="hover:bg-blue-50 transition-colors">
                                <td className="border-2 border-black p-3 font-bold">{m.name}</td>
                                <td className="border-2 border-black p-3 text-xs uppercase text-gray-600 font-bold">{m.instrument}</td>
                                <td className="border-2 border-black p-3 text-center">
                                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                        <div className="bg-blue-600 h-full" style={{ width: `${m.playSkill}%` }}></div>
                                    </div>
                                </td>
                                <td className="border-2 border-black p-3 text-right font-mono font-bold text-green-700">${m.salary}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-gray-300 p-2 text-[10px] border-t-2 border-black font-black flex justify-between px-6">
                <span>TOTAL PERSONNEL: {gameState.members.length}</span>
                <span>AVERAGE CHEMISTRY: {Math.round(gameState.members.reduce((a,b)=>a+(b.chemistry||50),0)/gameState.members.length)}%</span>
            </div>
        </div>
    );

    // --- FINANCE APP ---
    const FinanceApp = () => (
        <div className="w-full h-full bg-[#004d40] flex flex-col font-mono text-green-100 border-4 border-black">
            <div className="bg-[#00251a] p-3 flex justify-between items-center border-b-2 border-black">
                <div className="flex items-center gap-2">
                    <span className="text-xl">💰</span>
                    <span className="font-black text-green-400 tracking-tighter uppercase">MoneyWise Dashboard</span>
                </div>
                <button onClick={() => setActiveApp('DESKTOP')} className="text-red-400 hover:text-red-200 font-bold text-lg">X</button>
            </div>
            <div className="flex-grow p-8 flex flex-col items-center justify-center">
                <div className="text-xs uppercase tracking-[0.3em] opacity-60 mb-2">Liquid Capital Available</div>
                <div className="text-7xl font-black my-6 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]">${gameState.funds.toLocaleString()}</div>
                <div className="w-full max-w-md h-2 bg-[#00251a] rounded-full overflow-hidden mb-8 border border-green-900/50">
                    <div className="h-full bg-green-500 animate-pulse" style={{ width: `${Math.min(100, (gameState.funds/10000)*100)}%` }}></div>
                </div>
                <div className="w-full max-w-lg grid grid-cols-2 gap-4">
                    <div className="bg-black/30 p-4 border border-green-800 rounded">
                        <div className="text-[10px] text-green-600 uppercase font-black mb-1">Projected Inflow</div>
                        <div className="text-2xl font-black text-green-300">+$2,500</div>
                    </div>
                    <div className="bg-black/30 p-4 border border-red-900 rounded">
                        <div className="text-[10px] text-red-600 uppercase font-black mb-1">Burn Rate</div>
                        <div className="text-2xl font-black text-red-400">-$800</div>
                    </div>
                </div>
            </div>
        </div>
    );

    // --- FILES APP ---
    const Files = () => {
        const [selectedFile, setSelectedFile] = useState<any>(null);
        const loreFiles = [
            { id: 'lore1', name: 'Director_Notes.txt', content: "Remember to focus on the woodwinds this season. They are the weakest link. Also, the Alumni President keeps complaining about the choice of playlist. We might need a 'Booster' track soon.", type: 'TXT' },
            { id: 'lore2', name: 'Budget_2026.xls', content: "[ENCRYPTED DATA] - Needs Accountant Passkey (Coming in v2.1 Update)", type: 'XLS' },
            { id: 'devlog', name: 'PATCH_NOTES_V2.1.txt', content: `MARCHING FRENZY ${GAME_VERSION}\n\n- ADDED: Cymbals to Instrument Designer\n- FIXED: Audio looping issues on GameDay\n- UPDATED: Chants now skip rhythm minigame\n- FIXED: FuseCore input reset bug\n- ADDED: Instrument skins in rhythm mode\n\nThanks for being part of the test build!`, type: 'TXT' }
        ];

        return (
            <div className="w-full h-full bg-[#f0f0f0] flex flex-col font-sans text-black border-2 border-white shadow-lg">
                <div className="bg-blue-800 text-white px-3 py-1 flex justify-between items-center text-xs font-black uppercase tracking-tighter">
                    <span>File Explorer v1.0</span>
                    <button onClick={() => setActiveApp('DESKTOP')} className="bg-red-600 px-3 border border-white font-bold">X</button>
                </div>
                
                <div className="flex-grow flex overflow-hidden">
                    <div className="flex-grow p-6 grid grid-cols-4 gap-6 content-start overflow-y-auto">
                        {loreFiles.map(file => (
                            <div key={file.id} onClick={() => setSelectedFile(file)} className="flex flex-col items-center cursor-pointer hover:bg-blue-200 p-3 rounded-lg group transition-all">
                                <span className="text-5xl mb-2 filter drop-shadow-sm group-hover:scale-110 transition-transform">{file.type === 'TXT' ? '📄' : '📊'}</span>
                                <span className="text-[10px] font-black text-center break-all uppercase tracking-tighter">{file.name}</span>
                            </div>
                        ))}
                        {gameState.drills.map(drill => (
                            <div key={drill.id} onClick={() => setSelectedFile({...drill, type: 'DRILL'})} className="flex flex-col items-center cursor-pointer hover:bg-blue-200 p-3 rounded-lg group transition-all">
                                <span className="text-5xl mb-2 filter drop-shadow-sm group-hover:scale-110 transition-transform">📐</span>
                                <span className="text-[10px] font-black text-center break-all uppercase tracking-tighter">{drill.name}.drl</span>
                            </div>
                        ))}
                        {gameState.musicLibrary.filter(t => t.isCustom).map(track => (
                            <div key={track.id} onClick={() => setSelectedFile({...track, type: 'AUDIO'})} className="flex flex-col items-center cursor-pointer hover:bg-blue-200 p-3 rounded-lg group transition-all">
                                <span className="text-5xl mb-2 filter drop-shadow-sm group-hover:scale-110 transition-transform">{track.category === 'CHANT' ? '🗣️' : '🎵'}</span>
                                <span className="text-[10px] font-black text-center break-all uppercase tracking-tighter">{track.title}.prj</span>
                            </div>
                        ))}
                    </div>

                    <div className="w-64 bg-white border-l-2 border-gray-300 p-6 flex flex-col shadow-inner">
                        {selectedFile ? (
                            <>
                                <div className="text-6xl text-center mb-4">{selectedFile.type === 'TXT' ? '📄' : selectedFile.type === 'DRILL' ? '📐' : selectedFile.category === 'CHANT' ? '🗣️' : '🎵'}</div>
                                <div className="font-black text-sm mb-6 text-center uppercase tracking-tighter border-b-2 border-gray-100 pb-2">{selectedFile.name || selectedFile.title}</div>
                                
                                <div className="flex-grow bg-gray-50 p-4 text-[11px] font-mono border border-gray-200 overflow-y-auto mb-6 whitespace-pre-wrap leading-relaxed shadow-inner rounded">
                                    {selectedFile.type === 'TXT' ? selectedFile.content : 
                                     selectedFile.type === 'DRILL' ? `ENTITY TYPE: FORMATION\nFRAMES: ${selectedFile.frames?.length || 0}\nMODIFIED: TODAY` :
                                     selectedFile.category === 'CHANT' ? `CHANT LOGIC\nLYRICS:\n"${selectedFile.lyrics || 'EMPTY'}"` :
                                     `AUDIO PROJECT\nBPM: ${selectedFile.bpm}\nGENRE: ${selectedFile.category}`}
                                </div>

                                <div className="mt-auto space-y-2">
                                    <button onClick={() => alert("File handling integration v2.5")} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs py-2 border-2 border-black shadow-[2px_2px_0_black] uppercase">OPEN</button>
                                    <button 
                                        className="w-full bg-red-100 hover:bg-red-200 text-red-600 font-black text-xs py-2 border-2 border-red-200 uppercase"
                                        onClick={() => {
                                            if(selectedFile.type === 'TXT') return;
                                            alert("Administrative lock: Project in use.");
                                        }}
                                    >
                                        DELETE
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 text-gray-400">
                                <span className="text-4xl mb-2">📁</span>
                                <div className="text-[10px] font-black uppercase">Preview Area</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-8 bg-gray-200 border-t-2 border-gray-400 text-[9px] font-black px-4 flex items-center gap-4 text-gray-500">
                    <span>DIRECTOR STORAGE [C:\]</span>
                    <span>TOTAL ITEMS: {gameState.drills.length + gameState.musicLibrary.filter(t => t.isCustom).length + loreFiles.length}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
            {/* Monitor Bezel - AAA Professional Look */}
            <div className="w-[94%] h-[92%] bg-[#222] rounded-2xl p-6 border-b-[12px] border-r-[12px] border-[#0a0a0a] shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative">
                
                {/* Screen Layer */}
                <div className="w-full h-full bg-[#008080] relative overflow-hidden shadow-inner border-[6px] border-[#111] rounded-sm">
                    
                    {/* Retro Scanlines Filter on Screen */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[99] bg-[repeating-linear-gradient(rgba(0,0,0,0.5)_0px,rgba(0,0,0,0.5)_2px,transparent_2px,transparent_4px)]"></div>

                    {/* Desktop Icons */}
                    {activeApp === 'DESKTOP' && (
                        <div className="p-8 grid grid-cols-1 grid-rows-7 gap-8 w-28">
                            <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setActiveApp('FUSECORE')}>
                                <div className="w-14 h-14 bg-orange-600 border-4 border-white flex items-center justify-center text-3xl shadow-[4px_4px_0_rgba(0,0,0,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all">🎹</div>
                                <span className="text-white text-[10px] font-black uppercase tracking-tighter drop-shadow-md bg-black/40 px-2 py-0.5 rounded-full">FuseCore</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setActiveApp('MUSIC_LIB')}>
                                <div className="w-14 h-14 bg-purple-600 border-4 border-white flex items-center justify-center text-3xl shadow-[4px_4px_0_rgba(0,0,0,0.4)] group-hover:scale-110 group-hover:-rotate-3 transition-all">🎧</div>
                                <span className="text-white text-[10px] font-black uppercase tracking-tighter drop-shadow-md bg-black/40 px-2 py-0.5 rounded-full">GrooveBox</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setActiveApp('BROWSER')}>
                                <div className="w-14 h-14 bg-blue-600 border-4 border-white flex items-center justify-center text-3xl shadow-[4px_4px_0_rgba(0,0,0,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all">🌍</div>
                                <span className="text-white text-[10px] font-black uppercase tracking-tighter drop-shadow-md bg-black/40 px-2 py-0.5 rounded-full">NetSurfer</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setActiveApp('FILES')}>
                                <div className="w-14 h-14 bg-yellow-500 border-4 border-white flex items-center justify-center text-3xl shadow-[4px_4px_0_rgba(0,0,0,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all">📂</div>
                                <span className="text-white text-[10px] font-black uppercase tracking-tighter drop-shadow-md bg-black/40 px-2 py-0.5 rounded-full">MyFiles</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setActiveApp('ROSTER')}>
                                <div className="w-14 h-14 bg-green-700 border-4 border-white flex items-center justify-center text-3xl shadow-[4px_4px_0_rgba(0,0,0,0.4)] group-hover:scale-110 group-hover:rotate-3 transition-all">📇</div>
                                <span className="text-white text-[10px] font-black uppercase tracking-tighter drop-shadow-md bg-black/40 px-2 py-0.5 rounded-full">RosterMgr</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setActiveApp('FINANCE')}>
                                <div className="w-14 h-14 bg-emerald-900 border-4 border-white flex items-center justify-center text-3xl shadow-[4px_4px_0_rgba(0,0,0,0.4)] group-hover:scale-110 transition-all">💸</div>
                                <span className="text-white text-[10px] font-black uppercase tracking-tighter drop-shadow-md bg-black/40 px-2 py-0.5 rounded-full">Finance</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setActiveApp('RECRUIT')}>
                                <div className="w-14 h-14 bg-indigo-600 border-4 border-white flex items-center justify-center text-3xl shadow-[4px_4px_0_rgba(0,0,0,0.4)] group-hover:scale-110 transition-all">🔭</div>
                                <span className="text-white text-[10px] font-black uppercase tracking-tighter drop-shadow-md bg-black/40 px-2 py-0.5 rounded-full">ScoutHub</span>
                            </div>
                        </div>
                    )}

                    {/* Active App Window Container */}
                    {activeApp !== 'DESKTOP' && (
                        <div className="absolute inset-4 bottom-14 border-4 border-white shadow-[15px_15px_30px_rgba(0,0,0,0.6)] bg-white animate-fade-in overflow-hidden rounded-sm">
                            {activeApp === 'FUSECORE' && <FuseCore />}
                            {activeApp === 'MUSIC_LIB' && <MusicLibApp />}
                            {activeApp === 'BROWSER' && <Browser />}
                            {activeApp === 'FILES' && <Files />}
                            {activeApp === 'ROSTER' && <RosterApp />}
                            {activeApp === 'FINANCE' && <FinanceApp />}
                            {activeApp === 'RECRUIT' && <RecruitApp />}
                        </div>
                    )}

                    {/* Taskbar - High Fidelity Style */}
                    <div className="absolute bottom-0 w-full h-12 bg-gradient-to-b from-[#e0e0e0] to-[#c0c0c0] border-t-2 border-white flex items-center px-3 z-50">
                        <button 
                            onClick={onClose}
                            className="flex items-center gap-2 px-5 h-8 bg-gradient-to-b from-[#e0e0e0] to-[#b0b0b0] border-2 border-t-white border-l-white border-b-[#666] border-r-[#666] active:border-t-[#666] active:border-l-[#666] active:border-b-white active:border-r-white font-black text-xs uppercase tracking-tighter mr-6 transition-all"
                        >
                            <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                            Logoff
                        </button>
                        
                        <div className="flex gap-2">
                            {activeApp !== 'DESKTOP' && (
                                <div className="px-6 py-1 bg-white/50 border-2 border-t-[#666] border-l-[#666] border-b-white border-r-white text-[10px] font-black uppercase italic tracking-widest text-blue-900 animate-fade-in">
                                    PROCESS: {activeApp}
                                </div>
                            )}
                        </div>

                        <div className="flex-grow"></div>
                        
                        <div className="px-4 py-1.5 bg-[#d0d0d0] border-2 border-t-[#888] border-l-[#888] border-b-white border-r-white text-[11px] font-black font-mono shadow-inner rounded-sm text-gray-700">
                            {currentTime}
                        </div>
                    </div>
                </div>
                
                {/* Monitor Details: Hardware Look */}
                <div className="absolute bottom-2 right-12 flex items-center gap-6">
                    <div className="text-[10px] font-black text-[#444] tracking-widest italic uppercase">PX-CORE 9000</div>
                    <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_green]"></div>
                        <div className="w-2 h-2 bg-yellow-500/50 rounded-full"></div>
                    </div>
                    {/* Power Toggle */}
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 bg-red-950 border-4 border-[#333] rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg active:scale-95"
                    >
                        <div className="w-1.5 h-4 bg-white/30 rounded-full"></div>
                    </button>
                </div>
            </div>
        </div>
    );
};
