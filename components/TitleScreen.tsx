
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { ProfileMenu } from './ProfileMenu';
import { Settings, GameState } from '../types';
import { soundManager } from '../services/soundManager';
import { GAME_NAME, COLORS, GAME_VERSION, SPLASH_TEXTS } from '../constants';
import { auth, onAuthStateChanged } from '../firebase';

const CREATOR_EMAIL = 'andrewdann79@gmail.com';

interface TitleScreenProps {
    onStart: (mode: 'DIRECTOR' | 'CAREER' | 'COMMUNITY_HUB') => void;
    onLoad: (state: GameState) => void;
    hasSave: boolean;
    currentSettings: Settings;
    onSettingsChange: (settings: Settings) => void;
    onCredits: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onLoad, hasSave, currentSettings, onSettingsChange, onCredits }) => {
    const [showLoadMenu, setShowLoadMenu] = useState(false);
    const [hasAutoSave, setHasAutoSave] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showBugReport, setShowBugReport] = useState(false);
    const [bugDescription, setBugDescription] = useState("");
    const [bugReported, setBugReported] = useState(false);
    const [showWipeConfirm, setShowWipeConfirm] = useState(false);
    const [saveSlots, setSaveSlots] = useState<{id: number, empty: boolean, date?: string, name?: string, mode?: string}[]>([]);
    const [splashText, setSplashText] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        setHasAutoSave(!!localStorage.getItem('MF_GAME_STATE'));
        
        // Check for unread messages
        try {
            const savedData = localStorage.getItem('MF_GAME_STATE');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                const inbox = parsed.inbox || [];
                const unread = inbox.filter((m: any) => !m.read).length;
                setUnreadCount(unread);
            }
        } catch (e) {
            console.error("Error checking unread messages:", e);
        }
    }, [showLoadMenu, showProfile]);
    
    // Easter Egg & Secret States
    const [careerUnlocked, setCareerUnlocked] = useState(false);
    const [eggClicks, setEggClicks] = useState(0);
    const [isRetroBowlMode, setIsRetroBowlMode] = useState(false);
    
    // Background Cycle
    const [bgIndex, setBgIndex] = useState(0);
    const [fieldPalette, setFieldPalette] = useState([COLORS[0].hex, COLORS[7].hex]); // Default Red/White

    // Auth State
    const [user, setUser] = useState<any>(null);

    // Konami Code Buffer
    const inputBuffer = useRef<string[]>([]);
    const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        setSplashText(SPLASH_TEXTS[Math.floor(Math.random() * SPLASH_TEXTS.length)]);
        // Init Sound (User interaction required usually, but we prepare)
        // Check local storage for unlock
        const unlocked = localStorage.getItem('MF_CAREER_UNLOCKED') === 'true';
        setCareerUnlocked(unlocked);

        // Start Background Cycle
        const bgInterval = setInterval(() => {
            setBgIndex(prev => (prev + 1) % 4);
            // Randomize field colors occasionally
            if (Math.random() > 0.5) {
                const c1 = COLORS[Math.floor(Math.random() * COLORS.length)].hex;
                const c2 = COLORS[Math.floor(Math.random() * COLORS.length)].hex;
                setFieldPalette([c1, c2]);
            }
        }, 8000); // 8 Seconds per slide

        // Input Listener
        const handleKeyDown = (e: KeyboardEvent) => {
            inputBuffer.current = [...inputBuffer.current, e.key].slice(-10);
            if (JSON.stringify(inputBuffer.current) === JSON.stringify(KONAMI_CODE)) {
                if (localStorage.getItem('MF_CAREER_UNLOCKED') !== 'true') {
                    localStorage.setItem('MF_CAREER_UNLOCKED', 'true');
                    setCareerUnlocked(true);
                    soundManager.playSuccess();
                    alert("CHEAT CODE ACTIVATED: CAREER MODE UNLOCKED");
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            clearInterval(bgInterval);
            window.removeEventListener('keydown', handleKeyDown);
            unsubscribe();
        };
    }, []);

    // Load Save Slots when menu opens
    useEffect(() => {
        if (showLoadMenu) {
            const slots = [];
            
            // Auto Save Slot
            try {
                const autoData = localStorage.getItem('MF_GAME_STATE');
                if (autoData) {
                    const parsed = JSON.parse(autoData);
                    slots.push({ id: 0, name: 'Auto Save', date: parsed.lastSaveDate || 'Unknown', mode: parsed.mode, empty: false });
                } else {
                    slots.push({ id: 0, name: 'Auto Save', empty: true });
                }
            } catch (e) { slots.push({ id: 0, name: 'Auto Save', empty: true }); }

            // Manual Slots 1-5
            for(let i=1; i<=5; i++) {
                try {
                    const data = localStorage.getItem(`MF_SAVE_${i}`);
                    if(data) {
                        const parsed = JSON.parse(data);
                        slots.push({ id: i, empty: false, date: parsed.lastSaveDate || 'Unknown', name: parsed.bandName || parsed.career?.playerName || `Slot ${i}`, mode: parsed.mode });
                    } else slots.push({ id: i, empty: true, name: `Slot ${i}` });
                } catch (e) { slots.push({ id: i, empty: true, name: `Slot ${i}` }); }
            }
            setSaveSlots(slots);
        }
    }, [showLoadMenu]);

    const handleLoad = (slotId: number) => {
        try {
            const key = slotId === 0 ? 'MF_GAME_STATE' : `MF_SAVE_${slotId}`;
            const data = localStorage.getItem(key);
            if (data) {
                onLoad(JSON.parse(data));
            }
        } catch (e) {
            console.error("Failed to load save", e);
        }
    };


    



    const handleVersionClick = () => {
        const nextClicks = eggClicks + 1;
        setEggClicks(nextClicks);
        if (nextClicks === 5) {
            soundManager.playOrchestraHit();
            setIsRetroBowlMode(true);
        }
    };

    const renderBackground = () => {
        if (isRetroBowlMode) {
            return (
                <div className="absolute inset-0 bg-[#388e3c] flex flex-col items-center justify-center overflow-hidden">
                    {/* Retro Bowl Style Scanlines */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
                    
                    {/* Football Field */}
                    <div className="w-full h-full relative" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent 0%, transparent 9%, rgba(255,255,255,0.5) 9.5%, rgba(255,255,255,0.5) 10%)`, backgroundSize: '100px 100%' }}>
                        <div className="absolute top-1/2 left-0 w-full h-2 bg-white/30 transform -translate-y-1/2"></div>
                        {/* 8-bit ball */}
                        <div className="absolute top-1/2 left-1/2 w-8 h-5 bg-[#8B4513] rounded-full border-2 border-white animate-[spin_1s_linear_infinite]"></div>
                    </div>
                </div>
            );
        }

        switch (bgIndex) {
            case 0: // THE STADIUM (Marching Pattern)
                return (
                    <div className="absolute inset-0 bg-green-900 overflow-hidden flex items-center justify-center animate-fade-in">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grass.png')] opacity-50"></div>
                        <div className="absolute inset-0 flex flex-col justify-center gap-8 opacity-40 transform -skew-x-12 scale-110">
                            {[...Array(5)].map((_, r) => (
                                <div key={r} className="flex justify-center gap-4 animate-[march_2s_infinite]">
                                    {[...Array(20)].map((_, c) => (
                                        <div key={c} className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: (r+c)%2===0 ? fieldPalette[0] : fieldPalette[1] }}></div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80"></div>
                    </div>
                );
            case 1: // THE SHEET MUSIC
                return (
                    <div className="absolute inset-0 bg-[#e3dac9] flex items-center justify-center animate-fade-in">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-30"></div>
                        <div className="w-full h-full flex flex-col justify-center space-y-12 opacity-20">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-full border-y border-black h-8 relative">
                                    <div className="absolute top-2 w-full h-[1px] bg-black"></div>
                                    <div className="absolute top-4 w-full h-[1px] bg-black"></div>
                                    <div className="absolute top-6 w-full h-[1px] bg-black"></div>
                                    <div className="absolute left-0 text-6xl text-black font-serif transform -translate-y-8 animate-[slide_20s_linear_infinite]" style={{ animationDelay: `${i}s` }}>
                                        ♩ ♫ ♬ ♭ ♮ ♯
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
                    </div>
                );
            case 2: // THE INSTRUMENTS
                return (
                    <div className="absolute inset-0 bg-[#1a237e] overflow-hidden animate-fade-in">
                        <div className="absolute inset-0 opacity-10">
                            {[...Array(50)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className="absolute text-6xl text-white transform animate-pulse"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 2}s`,
                                        transform: `rotate(${Math.random() * 360}deg)`
                                    }}
                                >
                                    {['🎺', '🎷', '🥁', '🚩', '🎼'][Math.floor(Math.random() * 5)]}
                                </div>
                            ))}
                        </div>
                        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black"></div>
                    </div>
                );
            default: // NIGHT HYPE
                return (
                    <div className="absolute inset-0 bg-black animate-fade-in">
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900 to-transparent opacity-50"></div>
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-[spin_60s_linear_infinite]"></div>
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 blur-[100px] rounded-full animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-600/30 blur-[100px] rounded-full animate-pulse delay-75"></div>
                    </div>
                );
        }
    };

    return (
        <div className="w-full h-full bg-black flex flex-col relative overflow-hidden font-sans select-none" onClick={() => soundManager.init()}>
            {renderBackground()}

            {/* Cinematic Vignette & Grain */}
            <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-[0.05] z-10"></div>
            <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-black/20 to-black/90 z-20"></div>

            {/* Main Content Layer */}
            <div className="absolute inset-0 z-30 flex flex-col">
                
                {/* Floating Profile Button */}
                <div className="absolute top-6 left-6 z-50 animate-fade-in-down">
                    {hasAutoSave && (
                        <button 
                            onClick={() => handleLoad(0)} 
                            className="bg-yellow-600/90 border-2 border-yellow-400 text-white font-bold py-3 px-5 rounded-full flex items-center gap-2 backdrop-blur-sm hover:bg-yellow-500 hover:scale-105 transition-all shadow-lg shadow-yellow-900/50 animate-pulse"
                            title="Continue Session"
                        >
                            <span>▶</span>
                            <span>CONTINUE</span>
                        </button>
                    )}
                </div>
                <div className="absolute top-6 right-6 z-50 animate-fade-in-down flex items-center gap-3">
                    {user && (
                        <div className="bg-slate-900/80 border border-slate-700 px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur-sm">
                            <span className="text-white font-bold text-sm tracking-wider">{user.displayName || 'Marcher'}</span>
                            {user.email?.toLowerCase() === CREATOR_EMAIL.toLowerCase() && (
                                <span className="text-yellow-400 text-sm" title="Creator">👑</span>
                            )}
                        </div>
                    )}
                    <button 
                        onClick={() => setShowProfile(true)} 
                        className={`relative w-14 h-14 bg-slate-900 border-2 ${user?.email?.toLowerCase() === CREATOR_EMAIL.toLowerCase() ? 'border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'border-slate-700'} rounded-full flex items-center justify-center text-2xl hover:bg-slate-800 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-all shadow-lg group overflow-hidden`}
                        title="Profile & Cloud"
                    >
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                        ) : (
                            <span className="group-hover:scale-110 transition-transform">👤</span>
                        )}
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900 z-10 animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Floating Load Game Button */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-40 animate-fade-in-right">
                    <button 
                        onClick={() => setShowLoadMenu(true)} 
                        className="bg-slate-900 border-y-2 border-r-2 border-slate-700 hover:border-green-400 hover:bg-slate-800 text-white p-4 rounded-r-2xl shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_20px_rgba(74,222,128,0.4)] transition-all flex flex-col items-center gap-3 group"
                        title="Load Game"
                    >
                        <span className="text-3xl group-hover:scale-110 transition-transform text-green-400 drop-shadow-md">💾</span>
                        <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-gray-300 group-hover:text-white transition-colors" style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>LOAD</span>
                    </button>
                </div>

                {/* Load Menu Overlay */}
                {showLoadMenu && (
                    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8">
                        <div className="bg-slate-900 border-2 border-slate-600 p-8 max-w-2xl w-full max-h-full overflow-y-auto">
                            <h2 className="text-3xl font-bold text-white mb-6 font-pixel uppercase tracking-widest text-center">Load Game</h2>
                            <div className="flex flex-col gap-4">
                                {saveSlots.map(slot => (
                                    <button 
                                        key={slot.id}
                                        disabled={slot.empty}
                                        onClick={() => handleLoad(slot.id)}
                                        className={`p-4 border-2 text-left transition-all group relative ${slot.empty ? 'border-gray-700 bg-gray-800/50 text-gray-600 cursor-not-allowed' : 'border-blue-600 bg-slate-800 hover:bg-slate-700 hover:border-blue-400 text-white'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-lg">{slot.name}</span>
                                            {!slot.empty && <span className="text-xs font-mono text-gray-400">{new Date(slot.date!).toLocaleString()}</span>}
                                        </div>
                                        {!slot.empty && (
                                            <div className="text-sm text-gray-400 mt-1">
                                                {slot.mode} Mode
                                            </div>
                                        )}
                                        {slot.id === 0 && <span className="absolute top-2 right-2 text-[10px] bg-yellow-600 text-white px-1 rounded">AUTO</span>}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-8 flex justify-center">
                                <Button onClick={() => setShowLoadMenu(false)} variant="secondary">CANCEL</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex-grow flex flex-col items-center justify-center pt-20 pb-10">
                    <div className="animate-fade-in-down mb-8 text-center">
                        <p 
                            className="text-xs font-bold tracking-[0.5em] text-yellow-500 uppercase mb-2 drop-shadow-md font-mono cursor-pointer hover:text-white transition-colors"
                            onClick={onCredits}
                            title="View Credits"
                        >
                            Marktime Productions Presents
                        </p>
                        <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transform -rotate-2"
                            style={{ 
                                textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
                                fontFamily: "'Press Start 2P', cursive" // Keeping the pixel font for main title authenticity
                            }}
                        >
                            {isRetroBowlMode ? "THANK YOU" : GAME_NAME.split("'")[0]}
                        </h1>
                        <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-widest -mt-4 transform -rotate-2"
                            style={{ textShadow: '4px 4px 0 #ef4444' }}
                        >
                            {isRetroBowlMode ? "RETRO BOWL" : `'26 EDITION`}
                        </h2>
                        <p className="mt-8 text-yellow-400 font-mono text-sm animate-pulse max-w-md mx-auto transform -rotate-2">
                            {splashText}
                        </p>
                    </div>

                    {/* Main Menu Buttons */}
                    <div className="flex flex-col gap-4 w-80 items-stretch animate-fade-in-up delay-300">
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <button 
                                onClick={() => onStart('DIRECTOR')} 
                                className="relative w-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold py-4 px-6 uppercase tracking-widest text-sm transition-all transform hover:scale-[1.02] flex justify-between items-center"
                            >
                                <span>New Director Mode</span>
                                <span className="text-blue-400">▶</span>
                            </button>
                        </div>

                        <div className="group relative">
                            {careerUnlocked ? (
                                <>
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                    <button 
                                        onClick={() => onStart('CAREER')} 
                                        className="relative w-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold py-4 px-6 uppercase tracking-widest text-sm transition-all transform hover:scale-[1.02] flex justify-between items-center"
                                    >
                                        <span>Career Mode</span>
                                        <span className="text-purple-400">★</span>
                                    </button>
                                </>
                            ) : (
                                <button 
                                    className="w-full bg-gray-800 border border-gray-700 text-gray-500 font-bold py-4 px-6 uppercase tracking-widest text-sm flex justify-between items-center cursor-not-allowed opacity-50"
                                    title="Unlock via achievement or Konami Code"
                                >
                                    <span>Career Mode</span>
                                    <span>🔒</span>
                                </button>
                            )}
                        </div>

                        <div className="group relative mt-4">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-500 rounded blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <button 
                                onClick={() => onStart('COMMUNITY_HUB')} 
                                className="relative w-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold py-4 px-6 uppercase tracking-widest text-sm transition-all transform hover:scale-[1.02] flex justify-between items-center"
                            >
                                <span>Community Hub</span>
                                <span className="text-green-400">🌍</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer / Version */}
                <div className="absolute bottom-0 w-full p-6 flex justify-between items-end text-xs font-mono text-gray-500 z-40">
                    <div className="flex gap-4">
                        <button className="hover:text-white transition-colors" onClick={() => setShowSettings(!showSettings)}>SETTINGS</button>
                        <button className="hover:text-yellow-400 transition-colors" onClick={() => setShowBugReport(true)}>REPORT BUG</button>
                    </div>
                    <div className="text-right">
                        <span onClick={handleVersionClick} className="cursor-pointer hover:text-white transition-colors select-none">{GAME_VERSION}</span>
                    </div>
                </div>
            </div>

            {/* PROFILE MODAL */}
            {showProfile && <ProfileMenu onClose={() => setShowProfile(false)} />}

            {/* BUG REPORT MODAL */}
            {showBugReport && (
                <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-800 border-4 border-yellow-500 p-8 max-w-md w-full shadow-2xl relative">
                        <h2 className="text-2xl font-black text-yellow-500 mb-6 uppercase border-b-2 border-gray-600 pb-2">Report a Bug</h2>
                        
                        {bugReported ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-4">✅</div>
                                <h3 className="text-xl font-bold text-white mb-2">Bug Reported Successfully!</h3>
                                <p className="text-gray-400 text-sm mb-6">Thank you for your feedback. We will look into it.</p>
                                <Button onClick={() => { setShowBugReport(false); setBugReported(false); setBugDescription(""); }} className="w-full">CLOSE</Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Describe the issue</label>
                                    <textarea 
                                        value={bugDescription}
                                        onChange={(e) => setBugDescription(e.target.value)}
                                        className="w-full h-32 bg-slate-900 border border-slate-600 text-white p-3 text-sm focus:border-yellow-500 outline-none resize-none"
                                        placeholder="What happened? What did you expect to happen?"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <Button onClick={() => setShowBugReport(false)} variant="secondary" className="flex-1">CANCEL</Button>
                                    <Button 
                                        onClick={() => {
                                            if (bugDescription.trim()) {
                                                setBugReported(true);
                                            }
                                        }} 
                                        className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-black border-yellow-400"
                                        disabled={!bugDescription.trim()}
                                    >
                                        SUBMIT
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* SETTINGS MODAL */}
            {showSettings && (
                <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-800 border-4 border-white p-8 max-w-md w-full shadow-2xl relative">
                        <h2 className="text-2xl font-black text-white mb-6 uppercase border-b-2 border-gray-600 pb-2">System Settings</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Audio Volume</label>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-white text-xs"><span>Master</span><span>{currentSettings.masterVolume}%</span></div>
                                    <input type="range" min="0" max="100" value={currentSettings.masterVolume} onChange={(e) => onSettingsChange({...currentSettings, masterVolume: parseInt(e.target.value)})} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Graphics</label>
                                <div className="flex gap-2">
                                    {['LOW', 'MEDIUM', 'HIGH'].map(q => (
                                        <button 
                                            key={q}
                                            onClick={() => onSettingsChange({...currentSettings, graphicsQuality: q as any})}
                                            className={`flex-1 py-2 text-xs font-bold border ${currentSettings.graphicsQuality === q ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-gray-600'}`}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-600 pt-4">
                                <span className="text-white text-sm font-bold">Retro CRT Effect</span>
                                <button 
                                    onClick={() => onSettingsChange({...currentSettings, retroMode: !currentSettings.retroMode})}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${currentSettings.retroMode ? 'bg-green-500' : 'bg-gray-600'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${currentSettings.retroMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-600 pt-4">
                                <span className="text-white text-sm font-bold">Uniform Costs</span>
                                <button 
                                    onClick={() => onSettingsChange({...currentSettings, enableUniformCost: !(currentSettings.enableUniformCost ?? true)})}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${currentSettings.enableUniformCost !== false ? 'bg-green-500' : 'bg-gray-600'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${currentSettings.enableUniformCost !== false ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-600 pt-4">
                                <span className="text-red-500 text-sm font-bold">Danger Zone</span>
                                <button 
                                    onClick={() => setShowWipeConfirm(true)}
                                    className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded"
                                >
                                    WIPE DATA
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button onClick={() => setShowSettings(false)} variant="secondary">CLOSE</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* WIPE CONFIRM MODAL */}
            {showWipeConfirm && (
                <div className="absolute inset-0 z-[60] bg-black/90 flex items-center justify-center p-8 backdrop-blur-md animate-fade-in">
                    <div className="bg-red-900 border-4 border-red-500 p-8 max-w-md w-full shadow-2xl relative text-center">
                        <h2 className="text-3xl font-black text-white mb-4 uppercase">ARE YOU SURE?!</h2>
                        <p className="text-red-200 mb-6 font-mono text-sm leading-relaxed">
                            Whoa there, maestro! You're about to send your entire band legacy into the void. 
                            All those perfect formations? Gone. That sick drum major uniform? Dust. 
                            This is a one-way ticket to Loserville. Are you absolutely, 100% positive you want to wipe EVERYTHING?
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => setShowWipeConfirm(false)} variant="secondary" className="flex-1">NEVERMIND</Button>
                            <Button onClick={() => {
                                localStorage.removeItem('MF_GAME_STATE');
                                window.location.reload();
                            }} variant="primary" className="flex-1 bg-red-600 hover:bg-red-500 border-red-400 text-white">DO IT</Button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};
