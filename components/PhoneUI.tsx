
import React, { useState, useRef, useEffect } from 'react';
import { GamePhase, GameState, Transaction, Message, PhoneSettings } from '../types';
import { BankApp } from './BankApp';
import { MessageApp } from './MessageApp';
import { StatsApp } from './StatsApp';
import { WALLPAPERS, GAME_VERSION } from '../constants';

interface PhoneUIProps {
    gameState: GameState;
    setPhase: (phase: GamePhase) => void;
    onTransaction: (t: Transaction) => void;
    onMessageAction?: (action: string, message: Message) => void;
    onUpdateSettings?: (settings: PhoneSettings) => void;
    onStartEvent?: (eventId: string) => void; 
}

export const PhoneUI: React.FC<PhoneUIProps> = ({ gameState, setPhase, onTransaction, onMessageAction, onUpdateSettings, onStartEvent }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeApp, setActiveApp] = useState<string | null>(null);
    const [saveSlots, setSaveSlots] = useState<{id: number, empty: boolean, date?: string, name?: string, mode?: string}[]>([]);

    const togglePhone = () => setIsOpen(!isOpen);

    // Refresh slots whenever the phone or save app opens
    useEffect(() => {
        if (isOpen && activeApp === 'SAVE') {
            const slots = [];
            for(let i=1; i<=3; i++) {
                try {
                    const data = localStorage.getItem(`MF_SAVE_${i}`);
                    if(data) {
                        const parsed = JSON.parse(data);
                        slots.push({ id: i, empty: false, date: parsed.lastSaveDate || 'Unknown', name: parsed.bandName, mode: parsed.mode });
                    } else slots.push({ id: i, empty: true });
                } catch (e) { slots.push({ id: i, empty: true }); }
            }
            setSaveSlots(slots);
        }
    }, [isOpen, activeApp]);

    const handleSaveGame = (slotId: number) => {
        const saveData = {
            ...gameState,
            lastSaveDate: new Date().toLocaleString()
        };
        localStorage.setItem(`MF_SAVE_${slotId}`, JSON.stringify(saveData));
        alert(`Game Saved to Slot ${slotId}!`);
        setActiveApp(null);
    };

    const unreadCount = gameState.messages.filter(m => !m.read).length;
    const wallpaperColor = WALLPAPERS.find(w => w.id === gameState.phoneSettings.wallpaper)?.color || '#0f172a';

    const [showWipeConfirm, setShowWipeConfirm] = useState(false);

    // Renders the specific app content
    const renderAppContent = () => {
        switch(activeApp) {
            case 'BANK': return <BankApp gameState={gameState} onTransaction={onTransaction} onBack={() => setActiveApp(null)} />;
            case 'MESSAGES': return <MessageApp gameState={gameState} onSendMessage={() => {}} onAction={(a, m) => { if(onMessageAction) onMessageAction(a, m); }} onBack={() => setActiveApp(null)} />;
            case 'STATS': return <StatsApp gameState={gameState} onBack={() => setActiveApp(null)} />;
            case 'SETTINGS':
                return (
                    <div className="h-full bg-slate-100 p-4 relative">
                        <h2 className="font-bold text-lg mb-4">Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">WALLPAPER</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {WALLPAPERS.map(wp => (
                                        <button 
                                            key={wp.id}
                                            onClick={() => onUpdateSettings && onUpdateSettings({...gameState.phoneSettings, wallpaper: wp.id})}
                                            className={`h-16 rounded border-2 ${gameState.phoneSettings.wallpaper === wp.id ? 'border-blue-500' : 'border-gray-300'}`}
                                            style={{ backgroundColor: wp.color }}
                                        ></button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">THEME</label>
                                <div className="flex gap-2">
                                    <button onClick={() => onUpdateSettings && onUpdateSettings({...gameState.phoneSettings, theme: 'light'})} className="flex-1 bg-white border p-2 text-xs">Light</button>
                                    <button onClick={() => onUpdateSettings && onUpdateSettings({...gameState.phoneSettings, theme: 'dark'})} className="flex-1 bg-black text-white border p-2 text-xs">Dark</button>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-300">
                                <button onClick={() => setShowWipeConfirm(true)} className="w-full bg-red-600 text-white font-bold py-2 rounded text-xs">WIPE ALL DATA</button>
                            </div>
                        </div>
                        <button onClick={() => setActiveApp(null)} className="mt-8 w-full bg-gray-300 py-2 rounded font-bold">Back</button>

                        {showWipeConfirm && (
                            <div className="absolute inset-0 bg-red-900/95 z-50 flex flex-col items-center justify-center p-4 text-center">
                                <h3 className="text-white font-black text-xl mb-2">ARE YOU SURE?!</h3>
                                <p className="text-red-200 text-xs mb-6">
                                    This will delete your entire career, all uniforms, and every perfect score. You'll be back to square one.
                                </p>
                                <div className="flex gap-2 w-full">
                                    <button onClick={() => setShowWipeConfirm(false)} className="flex-1 bg-gray-600 text-white font-bold py-2 rounded text-xs">NEVERMIND</button>
                                    <button onClick={() => {
                                        localStorage.removeItem('MF_GAME_STATE');
                                        window.location.reload();
                                    }} className="flex-1 bg-red-600 text-white font-bold py-2 rounded text-xs border border-red-400">DO IT</button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'SAVE':
                return (
                    <div className="h-full bg-slate-800 text-white p-4">
                        <h2 className="font-bold text-lg mb-4 text-yellow-400">Save Game</h2>
                        <div className="space-y-2">
                            {saveSlots.map(slot => (
                                <button 
                                    key={slot.id}
                                    onClick={() => handleSaveGame(slot.id)}
                                    className="w-full bg-slate-700 p-3 rounded border border-slate-600 hover:bg-slate-600 text-left"
                                >
                                    <div className="font-bold text-sm">Slot {slot.id}</div>
                                    <div className="text-xs text-gray-400">{slot.empty ? "Empty" : `${slot.name} - ${slot.date}`}</div>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setActiveApp(null)} className="mt-8 w-full bg-red-600 py-2 rounded font-bold">Cancel</button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <>
            {/* Minimized Icon (only if closed) */}
            {!isOpen && (
                <div 
                    onClick={togglePhone}
                    className="fixed bottom-4 right-4 z-50 w-16 h-16 bg-black rounded-2xl border-4 border-gray-600 shadow-xl cursor-pointer hover:scale-105 transition-transform flex items-center justify-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-80"></div>
                    <span className="text-3xl relative z-10">📱</span>
                    {unreadCount > 0 && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold border border-white">
                            {unreadCount}
                        </div>
                    )}
                </div>
            )}

            {/* Phone Container */}
            <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0 pointer-events-none'}`}>
                <div className="relative w-[300px] h-[580px] bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl p-3">
                    
                    {/* PHYSICAL BUTTONS (Power/Volume) */}
                    <div 
                        className="absolute right-[-12px] top-24 w-1.5 h-16 bg-gray-700 rounded-r-md cursor-pointer hover:bg-gray-600 active:bg-gray-800 shadow-md transition-colors"
                        onClick={togglePhone}
                        title="Power Button"
                    ></div>
                    <div className="absolute left-[-12px] top-20 w-1.5 h-8 bg-gray-700 rounded-l-md"></div>
                    <div className="absolute left-[-12px] top-32 w-1.5 h-8 bg-gray-700 rounded-l-md"></div>

                    {/* Notch & Camera */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>

                    {/* Screen */}
                    <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                        
                        {/* Status Bar */}
                        <div className="absolute top-0 w-full h-8 bg-black/20 backdrop-blur-md z-10 flex justify-between items-center px-6 text-white text-[10px] font-bold">
                            <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <div className="flex gap-1">
                                <span>📶</span>
                                <span>🔋</span>
                            </div>
                        </div>

                        {/* Wallpaper */}
                        <div className="absolute inset-0 z-0" style={{ backgroundColor: wallpaperColor }}>
                            {/* Pattern Overlay */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        </div>

                        {/* Main UI */}
                        {activeApp ? (
                            <div className="relative z-10 h-full pt-8 pb-4 animate-fade-in bg-white">
                                {renderAppContent()}
                            </div>
                        ) : (
                            <div className="relative z-10 h-full pt-12 pb-4 flex flex-col justify-between px-4">
                                {/* Widgets */}
                                <div className="space-y-4">
                                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-white shadow-sm cursor-pointer hover:bg-white/30 transition-colors" onClick={() => setActiveApp('STATS')}>
                                        <div className="text-xs font-bold opacity-80 uppercase">Band Status</div>
                                        <div className="text-2xl font-black">{gameState.fans.toLocaleString()} Fans</div>
                                        <div className="text-xs mt-1">Next Event: {gameState.schedule.find(e=>!e.completed)?.name || "None"}</div>
                                    </div>
                                    
                                    <div className="flex gap-4">
                                        <div className="bg-blue-500/80 backdrop-blur-md rounded-2xl p-3 text-white shadow-sm flex-1 cursor-pointer hover:bg-blue-500 transition-colors" onClick={() => setActiveApp('BANK')}>
                                            <div className="text-xl">🏦</div>
                                            <div className="text-xs font-bold mt-1">Bank</div>
                                            <div className="text-[10px]">${gameState.funds}</div>
                                        </div>
                                        <div className="bg-green-500/80 backdrop-blur-md rounded-2xl p-3 text-white shadow-sm flex-1 cursor-pointer hover:bg-green-500 transition-colors" onClick={() => setActiveApp('SAVE')}>
                                            <div className="text-xl">💾</div>
                                            <div className="text-xs font-bold mt-1">Save</div>
                                        </div>
                                    </div>
                                </div>

                                {/* App Grid */}
                                <div className="bg-white/20 backdrop-blur-xl rounded-[2rem] p-4 grid grid-cols-4 gap-4 mt-auto mb-2">
                                    {/* Row 1 */}
                                    <button onClick={() => setActiveApp('MESSAGES')} className="flex flex-col items-center gap-1 group relative">
                                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">💬</div>
                                        {unreadCount > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center font-bold border-2 border-white">{unreadCount}</div>}
                                    </button>
                                    <button onClick={() => setPhase(GamePhase.VIDEO_APP)} className="flex flex-col items-center gap-1 group">
                                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">▶</div>
                                    </button>
                                    <button onClick={() => setPhase(GamePhase.MEDIA)} className="flex flex-col items-center gap-1 group">
                                        <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">🐦</div>
                                    </button>
                                    <button onClick={() => setActiveApp('SETTINGS')} className="flex flex-col items-center gap-1 group">
                                        <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">⚙️</div>
                                    </button>

                                    {/* Row 2 (Added "Old Apps") */}
                                    <button onClick={() => setPhase(GamePhase.RECRUITMENT)} className="flex flex-col items-center gap-1 group">
                                        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">🤝</div>
                                    </button>
                                    <button onClick={() => setPhase(GamePhase.EDITOR)} className="flex flex-col items-center gap-1 group">
                                        <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">📐</div>
                                    </button>
                                    <button onClick={() => setPhase(GamePhase.BAND_OFFICE)} className="flex flex-col items-center gap-1 group">
                                        <div className="w-12 h-12 bg-amber-700 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">🏢</div>
                                    </button>
                                    <button onClick={() => setPhase(GamePhase.UNIFORM_EDITOR)} className="flex flex-col items-center gap-1 group">
                                        <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">👕</div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Home Indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/50 rounded-full z-20 cursor-pointer" onClick={() => setActiveApp(null)}></div>
                    </div>
                </div>
            </div>
        </>
    );
};
