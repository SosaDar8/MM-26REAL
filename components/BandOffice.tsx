
import React, { useState } from 'react';
import { GameState, GamePhase, ShopItem, MusicTrack, Uniform, InstrumentType, Appearance, CutsceneData } from '../types';
import { Button } from './Button';
import { SHOP_ITEMS, BOOSTER_REQUESTS } from '../constants';
import { LaptopOS } from './LaptopOS';
import { BandMemberVisual } from './BandMemberVisual';
import { BandRoomEditor } from './BandRoomEditor';
import { FeedbackModal } from './FeedbackModal';
import { CutsceneOverlay } from './CutsceneOverlay';

interface BandOfficeProps {
    gameState: GameState;
    setPhase: (phase: GamePhase) => void;
    onBack: () => void;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const OFFICE_LAYOUTS = [
    {
        id: 0,
        name: 'Classic Wood',
        wall: 'bg-slate-800 bg-[url("https://www.transparenttextures.com/patterns/brick-wall.png")]',
        desk: 'bg-[#6d4c41] border-t-8 border-[#3e2723]',
        deskTexture: 'bg-[url("https://www.transparenttextures.com/patterns/wood-pattern.png")] opacity-20',
        nameplate: 'bg-[#2c1a0e] border-[#8d6e63] text-yellow-500',
        positions: {
            clock: 'top-10 right-10',
            plant: 'bottom-10 left-10',
            whiteboard: 'top-16 left-10',
            trophyShelf: 'top-20 right-20',
            banner: 'top-8 left-1/2 -translate-x-1/2',
            poster: 'top-48 right-10',
            phone: 'top-[-20px] left-10',
            deskItems: 'justify-around items-end',
        }
    },
    {
        id: 1,
        name: 'Modern Glass',
        wall: 'bg-gray-200 bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]',
        desk: 'bg-blue-100/50 border-t-8 border-blue-200 backdrop-blur-md',
        deskTexture: 'bg-gradient-to-b from-white/40 to-transparent opacity-50',
        nameplate: 'bg-white border-gray-300 text-gray-800',
        positions: {
            clock: 'top-10 left-10',
            plant: 'bottom-10 right-10',
            whiteboard: 'top-16 right-10',
            trophyShelf: 'top-20 left-20',
            banner: 'top-8 left-1/2 -translate-x-1/2',
            poster: 'top-48 left-10',
            phone: 'top-[-20px] right-10',
            deskItems: 'justify-between items-end px-20',
        }
    },
    {
        id: 2,
        name: 'Industrial Metal',
        wall: 'bg-zinc-900 bg-[url("https://www.transparenttextures.com/patterns/concrete-wall.png")]',
        desk: 'bg-gray-500 border-t-8 border-gray-700',
        deskTexture: 'bg-[url("https://www.transparenttextures.com/patterns/brushed-alum.png")] opacity-40',
        nameplate: 'bg-gray-800 border-gray-600 text-white',
        positions: {
            clock: 'top-1/4 right-10',
            plant: 'bottom-10 left-1/4',
            whiteboard: 'top-10 left-1/2 -translate-x-1/2',
            trophyShelf: 'top-40 right-10',
            banner: 'top-8 left-10',
            poster: 'bottom-48 right-10',
            phone: 'top-[-20px] left-1/4',
            deskItems: 'justify-center gap-20 items-end',
        }
    },
    {
        id: 3,
        name: 'Cozy Mahogany',
        wall: 'bg-[#4a3b32] bg-[url("https://www.transparenttextures.com/patterns/wallpaper.png")]',
        desk: 'bg-[#3e2723] border-t-8 border-[#1b0000]',
        deskTexture: 'bg-[url("https://www.transparenttextures.com/patterns/wood-pattern.png")] opacity-30',
        nameplate: 'bg-[#1b0000] border-[#3e2723] text-yellow-600',
        positions: {
            clock: 'top-10 right-10',
            plant: 'bottom-10 right-10',
            whiteboard: 'top-16 left-10',
            trophyShelf: 'top-10 left-1/2 -translate-x-1/2',
            banner: 'top-32 left-1/2 -translate-x-1/2',
            poster: 'top-48 left-10',
            phone: 'top-[-20px] right-1/4',
            deskItems: 'justify-evenly items-end',
        }
    },
    {
        id: 4,
        name: 'Creative Studio',
        wall: 'bg-indigo-900 bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]',
        desk: 'bg-indigo-800 border-t-8 border-indigo-950',
        deskTexture: 'bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")] opacity-20',
        nameplate: 'bg-indigo-950 border-indigo-700 text-indigo-300',
        positions: {
            clock: 'bottom-32 right-10',
            plant: 'top-10 left-10',
            whiteboard: 'top-16 right-10',
            trophyShelf: 'bottom-48 left-10',
            banner: 'top-8 left-1/2 -translate-x-1/2',
            poster: 'top-10 right-1/4',
            phone: 'top-[-20px] left-1/3',
            deskItems: 'justify-around items-end',
        }
    },
    {
        id: 5,
        name: 'Eclectic Mix',
        wall: 'bg-emerald-900 bg-[url("https://www.transparenttextures.com/patterns/stardust.png")]',
        desk: 'bg-amber-800 border-t-8 border-amber-950',
        deskTexture: 'bg-[url("https://www.transparenttextures.com/patterns/wood-pattern.png")] opacity-40',
        nameplate: 'bg-amber-950 border-amber-700 text-amber-300',
        positions: {
            clock: 'top-16 left-1/4',
            plant: 'bottom-10 right-1/4',
            whiteboard: 'top-10 right-10',
            trophyShelf: 'top-10 left-10',
            banner: 'bottom-48 left-1/2 -translate-x-1/2',
            poster: 'top-48 left-1/4',
            phone: 'top-[-20px] right-10',
            deskItems: 'justify-between items-end px-10',
        }
    }
];

export const BandOffice: React.FC<BandOfficeProps> = ({ gameState, setPhase, onBack, setGameState }) => {
    const { identity } = gameState;
    const primary = identity.primaryColor;
    const secondary = identity.secondaryColor;
    
    const hasTrophy = gameState.achievements.some(a => a.id === 'a5' && a.unlocked);

    const [isDecorating, setIsDecorating] = useState(false);
    const [showBandRoomEditor, setShowBandRoomEditor] = useState(false);
    const [showBooster, setShowBooster] = useState(false);
    const [isUsingLaptop, setIsUsingLaptop] = useState(false);
    const [showStaffDuties, setShowStaffDuties] = useState(false);
    const [activeRequest, setActiveRequest] = useState<typeof BOOSTER_REQUESTS[0] | null>(null);
    const [portraitPosition, setPortraitPosition] = useState(0); // 0: Left, 1: Center, 2: Shelf
    const [showFeedback, setShowFeedback] = useState(false);
    const [hideUI, setHideUI] = useState(false);
    const [activeCutscene, setActiveCutscene] = useState<CutsceneData | null>(null);

    const currentLayout = OFFICE_LAYOUTS[gameState.officeLayout || 0];

    const cycleLayout = () => {
        setGameState(prev => ({
            ...prev,
            officeLayout: ((prev.officeLayout || 0) + 1) % OFFICE_LAYOUTS.length
        }));
    };

    // Generate a static "photo" look for the portrait on mount
    const [portraitAppearance] = useState<Appearance>(() => {
        const app = { ...gameState.director.appearance };
        // Give the portrait a random expression (Smile, Smirk, Determined)
        app.mouthId = [1, 4, 5][Math.floor(Math.random() * 3)]; 
        app.eyeId = [1, 4, 5][Math.floor(Math.random() * 3)];
        return app;
    });

    const ownedDecor = SHOP_ITEMS.filter(item => 
        item.category === 'DECOR' && gameState.unlockedItems.includes(item.id)
    );

    const toggleDecoration = (itemId: string) => {
        const event = new CustomEvent('mf-place-decoration', { detail: { itemId } });
        window.dispatchEvent(event);
    };

    const isPlaced = (itemId: string) => gameState.placedDecorations?.includes(itemId);

    const handleBoosterCall = () => {
        const req = BOOSTER_REQUESTS[Math.floor(Math.random() * BOOSTER_REQUESTS.length)];
        setActiveRequest(req);
        setShowBooster(true);
    };

    const handleBoosterDecision = (accept: boolean) => {
        if (!activeRequest) return;
        
        let msg = "";
        if (accept) {
            const event = new CustomEvent('mf-phone-action', { detail: { action: 'ADD_FUNDS', data: activeRequest.effect.funds } });
            window.dispatchEvent(event);
            msg = "Request Accepted. Funding Secured.";
        } else {
            msg = "Request Denied. The Alumni are annoyed, but the students respect your backbone.";
        }
        
        alert(msg);
        setShowBooster(false);
        setActiveRequest(null);
    };

    const handleSaveTrack = (track: MusicTrack) => {
        const event = new CustomEvent('mf-phone-action', { detail: { action: 'SAVE_TRACK', data: track } });
        window.dispatchEvent(event);
    };

    const handleStaffDuty = (duty: 'MEETING' | 'PAPERWORK' | 'RECORD_CLIP') => {
        setShowStaffDuties(false);
        let cutsceneType: CutsceneData['type'] = 'STAFF_MEETING';
        let text = '';
        if (duty === 'MEETING') { cutsceneType = 'STAFF_MEETING'; text = 'Staff Meeting'; }
        if (duty === 'PAPERWORK') { cutsceneType = 'PAPERWORK'; text = 'Filing Paperwork'; }
        if (duty === 'RECORD_CLIP') { cutsceneType = 'RECORD_CLIP'; text = 'Recording Clip'; }

        setActiveCutscene({
            id: `duty-${Date.now()}`,
            type: cutsceneType,
            text,
            duration: 3000
        });
    };

    const completeStaffDuty = () => {
        if (!activeCutscene) return;
        const duty = activeCutscene.type;
        setActiveCutscene(null);

        setGameState(prev => {
            let updates = { ...prev };
            if (duty === 'STAFF_MEETING') {
                updates.reputation += 10;
                updates.funds -= 50;
                alert("Attended Staff Meeting. Bought donuts (-$50). Reputation increased!");
            } else if (duty === 'PAPERWORK') {
                updates.funds += 100;
                updates.reputation -= 5;
                alert("Filed Paperwork. Secured funding (+$100), but everyone is bored (-5 Rep).");
            } else if (duty === 'RECORD_CLIP') {
                updates.clips = (updates.clips || 0) + 1;
                updates.funds -= 10;
                alert("Recorded a new band clip! (-$10 for equipment). You now have " + updates.clips + " clips.");
            }
            return updates;
        });
    };

    const cyclePortrait = () => {
        setPortraitPosition((prev) => (prev + 1) % 3);
    };

    const getPortraitStyle = () => {
        switch(portraitPosition) {
            case 0: return { top: '-35px', left: '160px', transform: 'rotate(-3deg)' }; // Left Desk
            case 1: return { top: '-35px', left: '50%', transform: 'translateX(-50%) rotate(0deg)' }; // Center Desk
            case 2: return { top: '-180px', left: '80%', transform: 'rotate(5deg) scale(0.8)' }; // Shelf/Wall
            default: return { top: '-35px', left: '160px', transform: 'rotate(-3deg)' };
        }
    };

    // Helper to generate a display uniform for the portrait based on director's outfit
    const getDirectorUniform = (): Uniform => {
        const outfit = gameState.director.outfits.find(o => o.id === gameState.director.currentOutfitId) || gameState.director.outfits[0];
        return {
            id: 'dir_portrait',
            name: 'Director',
            jacketColor: outfit?.topColor || '#fff',
            pantsColor: outfit?.bottomColor || '#000',
            hatColor: 'transparent',
            plumeColor: 'transparent',
            hatStyle: 'none',
            jacketStyle: (outfit?.style === 'tracksuit' ? 'tracksuit' : 
                          outfit?.style === 'suit' ? 'suit' : 
                          outfit?.style === 'hbcu_heritage' ? 'hbcu_heritage' : 
                          outfit?.style === 'casual' ? 'tshirt' : 'classic') as any,
            pantsStyle: 'regular',
            isDrumMajor: false,
            // Fallback outfit properties
            topId: outfit?.topId,
            accentColor: outfit?.accentColor
        } as Uniform;
    };

    return (
        <div className={`h-full relative overflow-hidden flex flex-col items-center justify-center font-mono text-white shadow-inner ${currentLayout.wall}`}>
            {/* LAPTOP OVERLAY */}
            {isUsingLaptop && (
                <LaptopOS 
                    gameState={gameState} 
                    onClose={() => setIsUsingLaptop(false)} 
                    onSaveTrack={handleSaveTrack}
                />
            )}

            {/* Wall Texture */}
            <div className="absolute inset-0 opacity-30 pointer-events-none"></div>
            
            {/* Clock on the wall */}
            <div className={`absolute ${currentLayout.positions.clock} w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center transition-all duration-1000`}>
                <div className="w-1 h-10 bg-white absolute top-2 transform origin-bottom rotate-45"></div>
                <div className="w-1 h-6 bg-white absolute top-6 transform origin-bottom -rotate-12"></div>
            </div>

            {/* Floor */}
            <div className="absolute bottom-0 w-full h-1/3 bg-[#5d4037] border-t-8 border-[#2c1a0e] shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)]"></div>

            {/* Plant in the corner */}
            <div className={`absolute ${currentLayout.positions.plant} w-16 h-24 bg-green-900 rounded-t-full border-4 border-green-800 transition-all duration-1000`}></div>

            {/* Whiteboard with Drill Charts */}
            <div 
                className={`absolute ${currentLayout.positions.whiteboard} w-64 h-48 bg-white border-8 border-gray-300 shadow-xl transform -rotate-2 p-2 cursor-pointer hover:scale-105 transition-all duration-1000`}
                onClick={() => alert("The whiteboard says: 'Remember: 8-to-5 is not a suggestion, it's a lifestyle.'")}
            >
                <div className="text-black text-xs font-bold underline mb-1">FIELD SHOW CONCEPTS</div>
                <div className="grid grid-cols-8 gap-1 opacity-50 mt-2">
                    {[...Array(40)].map((_, i) => (
                        <div key={i} className={`w-1 h-1 rounded-full ${Math.random()>0.7?'bg-red-500':'bg-blue-500'}`}></div>
                    ))}
                </div>
                <div className="absolute bottom-2 right-2 text-[10px] text-red-600 font-handwriting transform -rotate-12">"More spacing!"</div>
            </div>

            {/* Trophy Shelf */}
            <div className={`absolute ${currentLayout.positions.trophyShelf} w-64 h-8 bg-[#2c1a0e] shadow-lg border-b-4 border-[#1a0f08] flex justify-end px-2 gap-2 transition-all duration-1000`}>
                {gameState.trophies.map(tId => (
                    <div key={tId} className="text-2xl drop-shadow-md hover:scale-125 transition-transform cursor-help" title={tId}>🏆</div>
                ))}
                {hasTrophy && !gameState.trophies.includes('a5') && (
                    <div className="text-4xl drop-shadow-md">🏆</div>
                )}
                {isPlaced('item_megaphon') && (
                    <div className="text-3xl drop-shadow-md transform rotate-12">📣</div>
                )}
                {isPlaced('item_metronome') && (
                    <div className="text-2xl drop-shadow-md">⏲️</div>
                )}
            </div>
            
            {/* Official School Banner */}
            <div className={`absolute ${currentLayout.positions.banner} bg-white/90 p-4 border-4 shadow-lg transform -rotate-1 z-0 flex items-center gap-4 transition-all duration-1000`} style={{ borderColor: primary }}>
                {identity.schoolLogo && (
                    <div className="relative w-12 h-12">
                        <div className="grid gap-0 w-12 h-12" style={{ gridTemplateColumns: `repeat(${Math.sqrt(identity.schoolLogo.length)}, 1fr)` }}>
                            {identity.schoolLogo.map((c, i) => <div key={i} style={{ backgroundColor: c }}></div>)}
                        </div>
                        {identity.schoolLogoText && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ fontSize: '10px', WebkitTextStroke: '1px black' }}>
                                    {identity.schoolLogoText}
                                </span>
                            </div>
                        )}
                    </div>
                )}
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter" style={{ color: primary, textShadow: `2px 2px 0 ${secondary}` }}>
                        {identity.schoolName}
                    </h1>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">EST. {identity.foundingYear || 1881}</div>
                    <div className="w-full h-2 mt-1" style={{ backgroundColor: secondary }}></div>
                </div>
            </div>

            {isPlaced('item_poster') && (
                <div className={`absolute ${currentLayout.positions.poster} w-40 h-56 bg-black/20 transform rotate-3 z-0 flex items-center justify-center shadow-xl backdrop-blur-sm border-2 border-white/50 transition-all duration-1000`}>
                    <div className="bg-white w-full h-full p-2 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold uppercase leading-none mb-2" style={{ color: primary }}>GO</span>
                        <span className="text-2xl font-black uppercase border-y-4 py-1" style={{ borderColor: secondary, color: 'black' }}>
                            {identity.mascot}
                        </span>
                    </div>
                </div>
            )}

            {isPlaced('item_led') && (
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 blur-xl opacity-50 animate-pulse"></div>
            )}

            {/* Desk Scene */}
            <div className="relative z-10 w-full max-w-5xl h-full flex flex-col justify-end pb-10 px-20">
                <div className={`w-full h-64 shadow-2xl relative flex ${currentLayout.positions.deskItems} p-8 rounded-t-sm transition-all duration-1000 ${currentLayout.desk}`}>
                    {/* Wood Texture on Desk */}
                    <div className={`absolute inset-0 pointer-events-none ${currentLayout.deskTexture}`}></div>

                    {/* RED PHONE */}
                    <div 
                        className={`absolute ${currentLayout.positions.phone} z-30 cursor-pointer hover:scale-110 transition-all duration-1000`}
                        onClick={handleBoosterCall}
                        title="Booster Club Hotline"
                    >
                        <div className="text-6xl drop-shadow-lg animate-pulse">☎️</div>
                    </div>

                    {/* GOLD FRAME PORTRAIT (HEAD CANNON) */}
                    <div 
                        className="absolute z-20 group cursor-pointer transition-all duration-500 ease-in-out" 
                        style={getPortraitStyle()}
                        onClick={cyclePortrait}
                        title={`Director ${gameState.director.name} (Click to Move)`}
                    >
                        {/* Stand Leg (Only show if on desk) */}
                        {portraitPosition !== 2 && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-12 bg-black opacity-80 transform skew-x-12 origin-bottom"></div>
                        )}
                        {/* Frame */}
                        <div className="w-24 h-32 bg-[#222] border-[6px] border-yellow-500 shadow-2xl relative overflow-hidden rounded-sm ring-1 ring-yellow-600 hover:ring-yellow-300">
                            {/* Inner Gold Rim */}
                            <div className="absolute inset-0 border-2 border-yellow-200 opacity-50 pointer-events-none z-20"></div>
                            
                            {/* Portrait Background */}
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-900 z-0"></div>
                            
                            {/* Director Visual - Cropped Bust with 'Photo' Expression */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 transform scale-[2] z-10">
                                 <BandMemberVisual 
                                    instrument={InstrumentType.MACE}
                                    showInstrument={false}
                                    uniform={getDirectorUniform()}
                                    appearance={portraitAppearance}
                                    isPlaying={false} 
                                    showHat={false}
                                    bandIdentity={identity}
                                />
                            </div>
                            
                            {/* Glass Glare */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none z-30"></div>
                        </div>
                    </div>

                    {/* COMPUTER (Opens LaptopOS now) */}
                    <div 
                        className="group cursor-pointer flex flex-col items-center transform hover:scale-105 transition-transform"
                        onClick={() => setIsUsingLaptop(true)}
                    >
                        <div className="w-40 h-28 bg-[#1a1a1a] border-4 border-gray-600 rounded-t-lg relative overflow-hidden shadow-lg">
                            <div className="absolute inset-0 bg-blue-900 opacity-20 animate-pulse"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-2xl mb-1">💻</div>
                                <div className="text-[8px] text-green-400 font-mono">SYSTEM READY</div>
                            </div>
                        </div>
                        <div className="w-48 h-4 bg-gray-400 rounded-b-sm border-t border-black"></div>
                        <div className="w-16 h-6 bg-gray-500 mx-auto"></div>
                        <div className="w-32 h-2 bg-black/50 rounded-full mt-1 blur-sm"></div>
                        <span className="mt-2 bg-black/50 px-2 rounded text-sm group-hover:text-yellow-300 font-bold border border-white/20">ACCESS TERMINAL</span>
                    </div>

            {!hideUI && (
                <>
                    {/* Stack of Papers (Recruitment/Stats) */}
                    <div 
                        className="group cursor-pointer transform hover:scale-105 transition-transform relative"
                        onClick={() => setPhase(GamePhase.MANAGEMENT)}
                    >
                        <div className="w-24 h-32 bg-white border border-gray-300 shadow absolute rotate-3 top-0 left-0"></div>
                        <div className="w-24 h-32 bg-white border border-gray-300 shadow absolute -rotate-2 top-1 left-1"></div>
                        <div className="w-24 h-32 bg-white border border-gray-300 shadow relative flex items-center justify-center">
                            <div className="text-black text-xs font-bold p-2 text-center uppercase tracking-tighter">CONFIDENTIAL<br/>FILES</div>
                        </div>
                    </div>

                    {/* Nameplate */}
                    <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 border-4 shadow-lg transform translate-y-4 ${currentLayout.nameplate}`}>
                        <div className="font-serif font-bold uppercase tracking-widest text-lg">{gameState.director.name}</div>
                        <div className="opacity-70 text-[10px] text-center uppercase tracking-[0.2em]">Director of Bands</div>
                    </div>
                    
                    {/* Feedback Button */}
                    <button 
                        onClick={() => setShowFeedback(true)}
                        className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-500"
                        title="Feedback & Suggestions"
                    >
                        💡
                    </button>
                </>
            )}
                </div>
            </div>

            {/* ... (Modals kept same) ... */}
            
            {showBooster && activeRequest && (
                <div className="absolute inset-0 z-50 bg-red-900/90 flex items-center justify-center p-8">
                    <div className="bg-[#fffdf0] border-8 border-red-800 p-8 max-w-lg w-full shadow-2xl relative text-black transform rotate-1">
                        <h2 className="text-3xl font-black uppercase mb-4 text-red-800">BOOSTER HOTLINE</h2>
                        <div className="mb-6 font-serif text-lg italic">"{activeRequest.text}"</div>
                        <div className="flex gap-4">
                            <Button onClick={() => handleBoosterDecision(true)} className="flex-1 bg-green-600">ACCEPT</Button>
                            <Button onClick={() => handleBoosterDecision(false)} className="flex-1 bg-red-600">REJECT</Button>
                        </div>
                    </div>
                </div>
            )}

            {isDecorating && (
                <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-8">
                    <div className="bg-slate-800 border-4 border-white p-6 max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-yellow-400">OFFICE DECOR</h2>
                            <button onClick={() => setIsDecorating(false)} className="text-red-400 font-bold">X</button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
                            {ownedDecor.map(item => (
                                <button 
                                    key={item.id}
                                    onClick={() => toggleDecoration(item.id)}
                                    className={`p-4 border-2 flex flex-col items-center gap-2 ${isPlaced(item.id) ? 'bg-green-900 border-green-400' : 'bg-black border-gray-600'}`}
                                >
                                    <div className="text-4xl">{item.icon}</div>
                                    <div className="text-xs font-bold">{item.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {showBandRoomEditor && (
                <BandRoomEditor 
                    gameState={gameState} 
                    setGameState={setGameState} 
                    onClose={() => setShowBandRoomEditor(false)} 
                />
            )}

            {showStaffDuties && (
                <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-8">
                    <div className="bg-slate-800 border-4 border-white p-6 max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-green-400">STAFF DUTIES</h2>
                            <button onClick={() => setShowStaffDuties(false)} className="text-red-400 font-bold">X</button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Button onClick={() => handleStaffDuty('MEETING')} className="bg-blue-600">
                                Attend Staff Meeting (-$50, +10 Rep)
                            </Button>
                            <Button onClick={() => handleStaffDuty('PAPERWORK')} className="bg-yellow-600">
                                File Paperwork (+$100, -5 Rep)
                            </Button>
                            <Button onClick={() => handleStaffDuty('RECORD_CLIP')} className="bg-purple-600">
                                Record Band Clip (-$10, +1 Clip)
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Feedback Modal */}
            {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}

            {activeCutscene && (
                <CutsceneOverlay data={activeCutscene} onComplete={completeStaffDuty} />
            )}

            <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
                {!hideUI && (
                    <>
                        <Button onClick={onBack} variant="danger" className="text-xl font-bold border-4 border-white shadow-lg">EXIT OFFICE</Button>
                        <div className="flex flex-col gap-2 bg-black/50 p-2 rounded-lg border border-white/20">
                            <Button onClick={cycleLayout} className="bg-blue-600 border-blue-400 hover:bg-blue-500">LAYOUT: {currentLayout.name}</Button>
                            <Button onClick={() => setShowBandRoomEditor(true)} className="bg-yellow-600 border-yellow-400 hover:bg-yellow-500">BAND ROOM</Button>
                            <Button onClick={() => setIsDecorating(true)} className="bg-purple-600 border-purple-400 hover:bg-purple-500">OFFICE DECOR</Button>
                            <Button onClick={() => setShowStaffDuties(true)} className="bg-green-600 border-green-400 hover:bg-green-500">STAFF DUTIES</Button>
                            <Button onClick={() => setHideUI(true)} className="bg-gray-600 border-gray-400 hover:bg-gray-500">HIDE UI</Button>
                        </div>
                    </>
                )}
                {hideUI && (
                    <Button onClick={() => setHideUI(false)} className="bg-gray-600 border-gray-400 hover:bg-gray-500">SHOW UI</Button>
                )}
            </div>
        </div>
    );
};
