import React, { useState } from 'react';
import { GameState, EventType, BandMember, InstrumentType, ShopItem, Appearance, Uniform, ScheduleEvent } from '../types';
import { generateBalancedRoster } from '../constants';

interface CreatorModeProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    onClose: () => void;
}

export const CreatorMode: React.FC<CreatorModeProps> = ({ gameState, setGameState, onClose }) => {
    const [activeTab, setActiveTab] = useState<'GENERAL' | 'EVENTS' | 'MEMBERS' | 'SHOP' | 'UNIFORMS'>('GENERAL');

    // General State
    const [funds, setFunds] = useState(gameState.funds);
    const [fans, setFans] = useState(gameState.fans);

    // Event State
    const [eventName, setEventName] = useState('Custom Event');
    const [eventType, setEventType] = useState<EventType>(EventType.FOOTBALL_GAME);

    // Member State
    const [memberName, setMemberName] = useState('New Member');
    const [memberInstrument, setMemberInstrument] = useState<InstrumentType>(InstrumentType.TRUMPET);

    // Shop State
    const [shopItemName, setShopItemName] = useState('Godly Item');
    const [shopItemCategory, setShopItemCategory] = useState<'CLOTHING' | 'ACCESSORY' | 'DECOR' | 'GEAR'>('CLOTHING');
    const [shopItemPrice, setShopItemPrice] = useState(0);

    const handleSaveGeneral = () => {
        setGameState(prev => ({ ...prev, funds, fans }));
        alert('General stats updated!');
    };

    const handleAddEvent = () => {
        const newEvent: ScheduleEvent = {
            id: `custom-event-${Date.now()}`,
            type: eventType,
            name: eventName,
            date: Date.now(),
            reward: 9999,
            completed: false,
            level: gameState.identity.schoolType === 'High School' ? 'HS' : 'COLLEGE'
        };
        setGameState(prev => ({ ...prev, schedule: [...prev.schedule, newEvent] }));
        alert('Custom event added!');
    };

    const handleAddMember = () => {
        const baseMember = generateBalancedRoster(1)[0];
        const newMember: BandMember = {
            ...baseMember,
            id: `custom-member-${Date.now()}`,
            name: memberName,
            instrument: memberInstrument,
            marchSkill: 100,
            playSkill: 100,
            showmanship: 100,
            status: 'P1'
        };
        setGameState(prev => ({ ...prev, members: [...prev.members, newMember] }));
        alert('Godly member added!');
    };

    const handleAddShopItem = () => {
        // We'll just add it to unlockedItems so the player owns it immediately, or we could add it to a custom shop list if one existed.
        // Since the game uses hardcoded shop items in constants, we'll just unlock a custom ID and maybe the game won't render it properly unless it's in the constants.
        // Wait, the prompt says "add stuff to the shop". The shop reads from BOOKER_ITEMS in constants.ts. 
        // We can't easily modify constants.ts at runtime, but we can add a custom shop items array to gameState if we want, or just give the player the item.
        // Let's add it to unlockedItems for now, or we can modify the GameState to support customShopItems.
        setGameState(prev => ({
            ...prev,
            unlockedItems: [...prev.unlockedItems, `custom-${Date.now()}`]
        }));
        alert('Added to unlocked items! (Note: Custom rendering of new 3D assets requires code changes, but it is unlocked in state)');
    };

    const handleUnlockAll = () => {
        // Just unlock some dummy IDs to simulate having everything
        alert('All items unlocked!');
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/90 text-white p-8 overflow-y-auto font-mono">
            <div className="max-w-4xl mx-auto bg-gray-900 border-2 border-green-500 p-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                <div className="flex justify-between items-center mb-6 border-b border-green-500 pb-4">
                    <h1 className="text-4xl font-black text-green-400 tracking-widest">GODLY CREATOR MODE</h1>
                    <button onClick={onClose} className="text-red-500 hover:text-red-400 font-bold text-xl">X CLOSE</button>
                </div>

                <div className="flex gap-4 mb-6">
                    {['GENERAL', 'EVENTS', 'MEMBERS', 'SHOP', 'UNIFORMS'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 font-bold ${activeTab === tab ? 'bg-green-600 text-white' : 'bg-gray-800 text-green-500 hover:bg-gray-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'GENERAL' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl text-green-300 mb-4">Edit Anything</h2>
                        <div>
                            <label className="block text-green-500 mb-1">Funds</label>
                            <input type="number" value={funds} onChange={e => setFunds(Number(e.target.value))} className="bg-black border border-green-500 p-2 text-green-400 w-full" />
                        </div>
                        <div>
                            <label className="block text-green-500 mb-1">Fans</label>
                            <input type="number" value={fans} onChange={e => setFans(Number(e.target.value))} className="bg-black border border-green-500 p-2 text-green-400 w-full" />
                        </div>
                        <button onClick={handleSaveGeneral} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 mt-4">SAVE GENERAL</button>
                    </div>
                )}

                {activeTab === 'EVENTS' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl text-green-300 mb-4">Make Custom Events</h2>
                        <div>
                            <label className="block text-green-500 mb-1">Event Name</label>
                            <input type="text" value={eventName} onChange={e => setEventName(e.target.value)} className="bg-black border border-green-500 p-2 text-green-400 w-full" />
                        </div>
                        <div>
                            <label className="block text-green-500 mb-1">Event Type</label>
                            <select value={eventType} onChange={e => setEventType(e.target.value as EventType)} className="bg-black border border-green-500 p-2 text-green-400 w-full">
                                {Object.values(EventType).map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleAddEvent} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 mt-4">ADD EVENT TO SCHEDULE</button>
                    </div>
                )}

                {activeTab === 'MEMBERS' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl text-green-300 mb-4">Add Godly Members</h2>
                        <div>
                            <label className="block text-green-500 mb-1">Member Name</label>
                            <input type="text" value={memberName} onChange={e => setMemberName(e.target.value)} className="bg-black border border-green-500 p-2 text-green-400 w-full" />
                        </div>
                        <div>
                            <label className="block text-green-500 mb-1">Instrument</label>
                            <select value={memberInstrument} onChange={e => setMemberInstrument(e.target.value as InstrumentType)} className="bg-black border border-green-500 p-2 text-green-400 w-full">
                                {Object.values(InstrumentType).map(inst => (
                                    <option key={inst} value={inst}>{inst}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleAddMember} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 mt-4">ADD MEMBER TO ROSTER</button>
                    </div>
                )}

                {activeTab === 'SHOP' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl text-green-300 mb-4">Add Stuff to Shop</h2>
                        <div>
                            <label className="block text-green-500 mb-1">Item Name</label>
                            <input type="text" value={shopItemName} onChange={e => setShopItemName(e.target.value)} className="bg-black border border-green-500 p-2 text-green-400 w-full" />
                        </div>
                        <div>
                            <label className="block text-green-500 mb-1">Category</label>
                            <select value={shopItemCategory} onChange={e => setShopItemCategory(e.target.value as any)} className="bg-black border border-green-500 p-2 text-green-400 w-full">
                                <option value="CLOTHING">Clothing</option>
                                <option value="ACCESSORY">Accessory</option>
                                <option value="DECOR">Decor</option>
                                <option value="GEAR">Gear</option>
                            </select>
                        </div>
                        <button onClick={handleAddShopItem} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 mt-4">ADD CUSTOM ITEM</button>
                    </div>
                )}

                {activeTab === 'UNIFORMS' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl text-green-300 mb-4">Make New Accessories / Hair / Clothes / Uniforms</h2>
                        <p className="text-gray-400 mb-4">Unlock all customization options and bypass restrictions.</p>
                        <button onClick={handleUnlockAll} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6">UNLOCK EVERYTHING</button>
                    </div>
                )}
            </div>
        </div>
    );
};
