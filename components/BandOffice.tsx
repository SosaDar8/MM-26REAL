
import React, { useState } from 'react';
import { GameState, GamePhase, ShopItem, MusicTrack, Uniform, InstrumentType, Appearance } from '../types';
import { Button } from './Button';
import { SHOP_ITEMS, BOOSTER_REQUESTS } from '../constants';
import { LaptopOS } from './LaptopOS';
import { BandMemberVisual } from './BandMemberVisual';
import { BandRoomEditor } from './BandRoomEditor';

interface BandOfficeProps {
    gameState: GameState;
    setPhase: (phase: GamePhase) => void;
    onBack: () => void;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const BandOffice: React.FC<BandOfficeProps> = ({ gameState, setPhase, onBack, setGameState }) => {
    const { identity } = gameState;
    const primary = identity.primaryColor;
    const secondary = identity.secondaryColor;
    
    const hasTrophy = gameState.achievements.some(a => a.id === 'a5' && a.unlocked);

    const [isDecorating, setIsDecorating] = useState(false);
    const [showBandRoomEditor, setShowBandRoomEditor] = useState(false);
    const [showBooster, setShowBooster] = useState(false);
    const [isUsingLaptop, setIsUsingLaptop] = useState(false);
    const [activeRequest, setActiveRequest] = useState<typeof BOOSTER_REQUESTS[0] | null>(null);
    const [portraitPosition, setPortraitPosition] = useState(0); // 0: Left, 1: Center, 2: Shelf

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
        <div className="h-full bg-[#3e2723] relative overflow-hidden flex flex-col items-center justify-center font-mono text-white shadow-inner">
            {/* LAPTOP OVERLAY */}
            {isUsingLaptop && (
                <LaptopOS 
                    gameState={gameState} 
                    onClose={() => setIsUsingLaptop(false)} 
                    onSaveTrack={handleSaveTrack}
                />
            )}

            {/* Wall Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brick-wall.png')] opacity-30"></div>
            
            {/* Floor */}
            <div className="absolute bottom-0 w-full h-1/3 bg-[#5d4037] border-t-8 border-[#2c1a0e] shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)]"></div>

            {/* Whiteboard with Drill Charts */}
            <div 
                className="absolute top-16 left-10 w-64 h-48 bg-white border-8 border-gray-300 shadow-xl transform -rotate-2 p-2 cursor-pointer hover:scale-105 transition-transform"
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
            <div className="absolute top-20 right-20 w-64 h-8 bg-[#2c1a0e] shadow-lg border-b-4 border-[#1a0f08] flex justify-end px-2 gap-2">
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
            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/90 p-4 border-4 shadow-lg transform -rotate-1 z-0 flex items-center gap-4" style={{ borderColor: primary }}>
                {(identity.useSchoolLogo ? identity.schoolLogo : identity.bandLogo) && (
                    <div className="grid grid-cols-10 gap-0 w-12 h-12">
                        {(identity.useSchoolLogo ? identity.schoolLogo! : identity.bandLogo!).map((c, i) => <div key={i} style={{ backgroundColor: c }}></div>)}
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
                <div className="absolute top-48 right-10 w-40 h-56 bg-black/20 transform rotate-3 z-0 flex items-center justify-center shadow-xl backdrop-blur-sm border-2 border-white/50">
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
                <div className="w-full h-64 bg-[#6d4c41] border-t-8 border-[#3e2723] shadow-2xl relative flex justify-around items-end p-8 rounded-t-sm">
                    {/* Wood Texture on Desk */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 pointer-events-none"></div>

                    {/* RED PHONE */}
                    <div 
                        className="absolute top-[-20px] left-10 z-30 cursor-pointer hover:scale-110 transition-transform"
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
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[#2c1a0e] px-6 py-2 border-4 border-[#8d6e63] shadow-lg transform translate-y-4">
                        <div className="text-yellow-500 font-serif font-bold uppercase tracking-widest text-lg">{gameState.director.name}</div>
                        <div className="text-gray-400 text-[10px] text-center uppercase tracking-[0.2em]">Director of Bands</div>
                    </div>
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

            <div className="absolute top-4 right-4 flex gap-2 z-50">
                <Button onClick={() => setShowBandRoomEditor(true)} className="bg-yellow-600 border-yellow-400 hover:bg-yellow-500">BAND ROOM</Button>
                <Button onClick={() => setIsDecorating(true)} className="bg-purple-600 border-purple-400 hover:bg-purple-500">OFFICE DECOR</Button>
                <Button onClick={onBack} variant="secondary">EXIT OFFICE</Button>
            </div>
        </div>
    );
};
