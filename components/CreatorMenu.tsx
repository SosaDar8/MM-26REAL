import React, { useState } from 'react';
import { GameState, BandMember, ScheduleEvent, EventType, InstrumentType, Uniform, ShopItem, CustomAsset, RoomDecoration } from '../types';
import { Button } from './Button';
import { generateBalancedRoster, RECRUIT_NAMES, RECRUIT_SURNAMES } from '../constants';
import { FactoryMode } from './FactoryMode';

interface CreatorMenuProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    onClose: () => void;
}

export const CreatorMenu: React.FC<CreatorMenuProps> = ({ gameState, setGameState, onClose }) => {
    const [activeTab, setActiveTab] = useState<'MEMBERS' | 'EVENTS' | 'UNIFORMS' | 'SHOP' | 'FACTORY' | 'BAND ROOM'>('MEMBERS');
    const [showFactory, setShowFactory] = useState(false);

    // Add Member State
    const [newMemberName, setNewMemberName] = useState('');
    const [useRandomName, setUseRandomName] = useState(false);
    const [newMemberInstrument, setNewMemberInstrument] = useState<InstrumentType | 'RANDOM'>(InstrumentType.TRUMPET);
    const [newMemberSkill, setNewMemberSkill] = useState(100);
    const [newMemberQuantity, setNewMemberQuantity] = useState(1);

    // Add Event State
    const [newEventName, setNewEventName] = useState('');
    const [newEventType, setNewEventType] = useState<EventType>(EventType.FOOTBALL_GAME);
    const [newEventOpponent, setNewEventOpponent] = useState('');

    // Add Uniform State
    const [newUniformName, setNewUniformName] = useState('');

    // Add Shop Item State
    const [newShopItemName, setNewShopItemName] = useState('');
    const [newShopItemCategory, setNewShopItemCategory] = useState<'CLOTHING' | 'ACCESSORY' | 'DECOR' | 'GEAR'>('CLOTHING');
    const [newShopItemPrice, setNewShopItemPrice] = useState(1000);

    // Band Room State
    const [selectedDecorType, setSelectedDecorType] = useState<RoomDecoration['type']>('POSTER');

    const handleAddMember = () => {
        if (!newMemberName && !useRandomName) {
            alert("Please enter a name or select 'Random Name'");
            return;
        }
        
        const newMembers: BandMember[] = [];
        const instruments = Object.values(InstrumentType);

        for (let i = 0; i < newMemberQuantity; i++) {
            // Fallback base member creation
            const baseMember: BandMember = {
                id: '',
                name: '',
                instrument: InstrumentType.TRUMPET,
                marchSkill: 50,
                playSkill: 50,
                showmanship: 50,
                salary: 100,
                status: 'P1',
                appearance: {
                    skinColor: '#8d5524',
                    hairColor: '#000000',
                    hairStyle: 1,
                    bodyType: 'average',
                    accessoryId: 0
                }
            };

            const instrument = newMemberInstrument === 'RANDOM' 
                ? instruments[Math.floor(Math.random() * instruments.length)]
                : newMemberInstrument;
            
            let name = newMemberName;
            if (useRandomName) {
                const rName = RECRUIT_NAMES[Math.floor(Math.random() * RECRUIT_NAMES.length)];
                const rSurname = RECRUIT_SURNAMES[Math.floor(Math.random() * RECRUIT_SURNAMES.length)];
                name = `${rName} ${rSurname}`;
            } else if (newMemberQuantity > 1) {
                name = `${newMemberName} ${i + 1}`;
            }

            const newMember: BandMember = {
                ...baseMember,
                id: `creator_member_${Date.now()}_${i}`,
                name: name,
                instrument: instrument,
                marchSkill: newMemberSkill,
                playSkill: newMemberSkill,
                showmanship: newMemberSkill,
                status: 'P1'
            };
            newMembers.push(newMember);
        }

        setGameState(prev => ({
            ...prev,
            members: [...prev.members, ...newMembers]
        }));
        if (!useRandomName) setNewMemberName('');
        setNewMemberQuantity(1);
        alert(`Added ${newMemberQuantity} member(s) to the band!`);
    };

    const handleAddEvent = () => {
        if (!newEventName) return;
        const newEvent: ScheduleEvent = {
            id: `creator_event_${Date.now()}`,
            name: newEventName,
            type: newEventType,
            opponent: newEventOpponent || undefined,
            level: gameState.identity.schoolType === 'High School' ? 'HS' : 'COLLEGE',
            date: gameState.schedule.length + 1,
            reward: 5000,
            completed: false
        };
        setGameState(prev => ({
            ...prev,
            schedule: [...prev.schedule, newEvent]
        }));
        setNewEventName('');
        setNewEventOpponent('');
        alert(`Added event: ${newEventName}`);
    };

    const handleAddUniform = () => {
        if (!newUniformName) return;
        const newUniform: Uniform = {
            id: `creator_uniform_${Date.now()}`,
            name: newUniformName,
            jacketColor: '#ff0000',
            pantsColor: '#000000',
            hatColor: '#ffffff',
            plumeColor: '#ff0000',
            hatStyle: 'shako',
            jacketStyle: 'classic',
            pantsStyle: 'regular'
        };
        setGameState(prev => ({
            ...prev,
            uniforms: [...prev.uniforms, newUniform]
        }));
        setNewUniformName('');
        alert(`Added uniform: ${newUniformName}. You can edit it in the Uniform Editor.`);
    };

    const handleAddShopItem = () => {
        if (!newShopItemName) return;
        const newItem: ShopItem = {
            id: `creator_shop_${Date.now()}`,
            name: newShopItemName,
            category: newShopItemCategory,
            price: newShopItemPrice,
            description: 'Custom item created in Creator Mode.',
            icon: '✨'
        };
        setGameState(prev => ({
            ...prev,
            customShopItems: [...(prev.customShopItems || []), newItem],
            unlockedItems: [...prev.unlockedItems, newItem.id] // Auto-unlock for creator
        }));
        setNewShopItemName('');
        alert(`Added ${newShopItemName} to the shop and unlocked it!`);
    };

    const handleSaveAsset = (newAsset: CustomAsset) => {
        setGameState(prev => ({
            ...prev,
            customAssets: [...(prev.customAssets || []), newAsset]
        }));
        setShowFactory(false);
        alert(`Fabricated new asset: ${newAsset.name}`);
    };

    const handleAddDecoration = () => {
        const newDecor: RoomDecoration = {
            id: `decor_${Date.now()}`,
            type: selectedDecorType,
            x: 50,
            y: 50,
            scale: 1,
            rotation: 0
        };
        setGameState(prev => ({
            ...prev,
            bandRoom: {
                wallColor: prev.bandRoom?.wallColor || '#333',
                floorColor: prev.bandRoom?.floorColor || '#444',
                decorations: [...(prev.bandRoom?.decorations || []), newDecor]
            }
        }));
    };

    const updateDecoration = (id: string, updates: Partial<RoomDecoration>) => {
        setGameState(prev => ({
            ...prev,
            bandRoom: {
                ...prev.bandRoom!,
                decorations: prev.bandRoom!.decorations.map(d => d.id === id ? { ...d, ...updates } : d)
            }
        }));
    };

    const removeDecoration = (id: string) => {
        setGameState(prev => ({
            ...prev,
            bandRoom: {
                ...prev.bandRoom!,
                decorations: prev.bandRoom!.decorations.filter(d => d.id !== id)
            }
        }));
    };

    if (showFactory) {
        return <FactoryMode onSave={handleSaveAsset} onClose={() => setShowFactory(false)} />;
    }

    return (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-fade-in">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500 text-white p-6 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                <div className="flex justify-between items-center mb-8 border-b border-purple-500/30 pb-4">
                    <div className="flex items-center gap-4">
                        <span className="text-4xl">🛠️</span>
                        <div>
                            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase tracking-widest">Creator Studio</h2>
                            <p className="text-xs text-purple-300/70 font-mono">GOD MODE ENABLED</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold transition-colors">&times;</button>
                </div>

                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {(['MEMBERS', 'EVENTS', 'UNIFORMS', 'SHOP', 'FACTORY', 'BAND ROOM'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-bold rounded-lg uppercase whitespace-nowrap transition-all duration-200 transform hover:scale-105 ${activeTab === tab ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="bg-black/20 p-6 rounded-xl border border-white/5 min-h-[400px]">
                    {activeTab === 'MEMBERS' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-purple-300 border-b border-purple-500/30 pb-2">Add Custom Member</h3>
                                    <div className="flex gap-2 items-center">
                                        <input 
                                            type="text" 
                                            placeholder="Member Name" 
                                            value={newMemberName} 
                                            disabled={useRandomName}
                                            onChange={e => setNewMemberName(e.target.value)}
                                            className={`flex-grow bg-gray-800 border border-gray-700 p-3 rounded-lg text-white focus:border-purple-500 outline-none transition-colors ${useRandomName ? 'opacity-50' : ''}`}
                                        />
                                        <label className="flex items-center gap-2 cursor-pointer bg-gray-800 p-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                                            <input 
                                                type="checkbox" 
                                                checked={useRandomName} 
                                                onChange={e => setUseRandomName(e.target.checked)}
                                                className="w-4 h-4 accent-purple-500"
                                            />
                                            <span className="text-sm text-gray-300 font-bold">Random</span>
                                        </label>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-400 font-bold mb-1 block">INSTRUMENT</label>
                                            <select 
                                                value={newMemberInstrument} 
                                                onChange={e => setNewMemberInstrument(e.target.value as InstrumentType | 'RANDOM')}
                                                className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-white focus:border-purple-500 outline-none"
                                            >
                                                <option value="RANDOM">RANDOM</option>
                                                {Object.values(InstrumentType).map(inst => (
                                                    <option key={inst} value={inst}>{inst}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-24">
                                            <label className="text-xs text-gray-400 font-bold mb-1 block">QTY</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                max="50"
                                                value={newMemberQuantity} 
                                                onChange={e => setNewMemberQuantity(Number(e.target.value))}
                                                className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-white focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold mb-1 block">SKILL LEVEL: {newMemberSkill}</label>
                                        <input 
                                            type="range" 
                                            min="1" max="100" 
                                            value={newMemberSkill} 
                                            onChange={e => setNewMemberSkill(Number(e.target.value))}
                                            className="w-full accent-purple-500"
                                        />
                                    </div>
                                    <Button onClick={handleAddMember} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-4 text-lg shadow-lg transform hover:-translate-y-1 transition-all">ADD MEMBER</Button>
                                </div>

                                <div className="space-y-4 border-l border-white/10 pl-8">
                                    <h3 className="text-xl font-bold text-purple-300 border-b border-purple-500/30 pb-2">Roster Management</h3>
                                    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                        {gameState.members.map(member => (
                                            <div key={member.id} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex flex-col gap-2 hover:bg-gray-800 transition-colors">
                                                <div className="flex justify-between items-center gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={member.name}
                                                        onChange={e => setGameState(prev => ({...prev, members: prev.members.map(m => m.id === member.id ? {...m, name: e.target.value} : m)}))}
                                                        className="bg-transparent border-b border-gray-600 p-1 text-white text-sm font-bold w-full focus:border-purple-500 outline-none"
                                                    />
                                                    <button 
                                                        onClick={() => setGameState(prev => ({...prev, members: prev.members.filter(m => m.id !== member.id)}))}
                                                        className="text-red-400 hover:text-red-300 text-xs font-bold px-2 py-1 bg-red-900/20 rounded border border-red-900/50"
                                                    >
                                                        DEL
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <select 
                                                        value={member.instrument}
                                                        onChange={e => setGameState(prev => ({...prev, members: prev.members.map(m => m.id === member.id ? {...m, instrument: e.target.value as InstrumentType} : m)}))}
                                                        className="bg-black/30 border border-gray-700 rounded text-xs text-gray-300 p-1"
                                                    >
                                                        {Object.values(InstrumentType).map(inst => (
                                                            <option key={inst} value={inst}>{inst}</option>
                                                        ))}
                                                    </select>
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <span className="text-[10px] text-gray-500 font-mono">SKILL</span>
                                                        <input 
                                                            type="range" 
                                                            min="1" max="100" 
                                                            value={member.marchSkill} 
                                                            onChange={e => setGameState(prev => ({...prev, members: prev.members.map(m => m.id === member.id ? {...m, marchSkill: Number(e.target.value), playSkill: Number(e.target.value), showmanship: Number(e.target.value)} : m)}))}
                                                            className="flex-1 accent-purple-500 h-1"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'EVENTS' && (
                        <div className="space-y-6 max-w-xl mx-auto">
                            <h3 className="text-xl font-bold text-purple-300 text-center">Create Custom Event</h3>
                            <div className="space-y-4 bg-gray-800 p-6 rounded-xl border border-gray-700">
                                <input 
                                    type="text" 
                                    placeholder="Event Name (e.g., Super Bowl)" 
                                    value={newEventName} 
                                    onChange={e => setNewEventName(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-purple-500 outline-none"
                                />
                                <select 
                                    value={newEventType} 
                                    onChange={e => setNewEventType(e.target.value as EventType)}
                                    className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-purple-500 outline-none"
                                >
                                    {Object.values(EventType).map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="Opponent Name (Optional)" 
                                    value={newEventOpponent} 
                                    onChange={e => setNewEventOpponent(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-purple-500 outline-none"
                                />
                                <Button onClick={handleAddEvent} className="w-full bg-purple-600 hover:bg-purple-500 py-3 text-lg font-bold">ADD EVENT TO SCHEDULE</Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'UNIFORMS' && (
                        <div className="space-y-6 max-w-xl mx-auto text-center">
                            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                                <h3 className="text-2xl font-bold text-purple-300 mb-2">Create Blank Uniform</h3>
                                <p className="text-gray-400 mb-6">Creates a new uniform slot that you can fully customize in the Uniform Editor.</p>
                                <input 
                                    type="text" 
                                    placeholder="Uniform Name" 
                                    value={newUniformName} 
                                    onChange={e => setNewUniformName(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-purple-500 outline-none mb-4"
                                />
                                <Button onClick={handleAddUniform} className="w-full bg-purple-600 hover:bg-purple-500 py-3 font-bold">CREATE UNIFORM</Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'SHOP' && (
                        <div className="space-y-6 max-w-xl mx-auto">
                            <h3 className="text-xl font-bold text-purple-300 text-center">Add Custom Shop Item</h3>
                            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                                <input 
                                    type="text" 
                                    placeholder="Item Name" 
                                    value={newShopItemName} 
                                    onChange={e => setNewShopItemName(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-purple-500 outline-none"
                                />
                                <select 
                                    value={newShopItemCategory} 
                                    onChange={e => setNewShopItemCategory(e.target.value as any)}
                                    className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-purple-500 outline-none"
                                >
                                    <option value="CLOTHING">Clothing</option>
                                    <option value="ACCESSORY">Accessory</option>
                                    <option value="DECOR">Decor</option>
                                    <option value="GEAR">Gear</option>
                                </select>
                                <div>
                                    <label className="text-sm text-gray-400 font-bold mb-1 block">Price: ${newShopItemPrice}</label>
                                    <input 
                                        type="number" 
                                        value={newShopItemPrice} 
                                        onChange={e => setNewShopItemPrice(Number(e.target.value))}
                                        className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-purple-500 outline-none"
                                    />
                                </div>
                                <Button onClick={handleAddShopItem} className="w-full bg-purple-600 hover:bg-purple-500 py-3 font-bold">ADD ITEM</Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'FACTORY' && (
                        <div className="space-y-6 text-center py-12">
                            <div className="text-8xl mb-6 animate-bounce">🏭</div>
                            <h3 className="text-4xl font-black text-yellow-500 uppercase tracking-widest drop-shadow-lg">The Asset Factory</h3>
                            <p className="text-gray-400 max-w-md mx-auto mb-8 text-lg">
                                Enter the industrial fabrication unit to design custom hats, jackets, pants, and accessories using advanced blueprinting tools.
                            </p>
                            <Button 
                                onClick={() => setShowFactory(true)} 
                                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-black font-black text-2xl px-12 py-6 shadow-[0_0_30px_rgba(234,179,8,0.4)] animate-pulse transform hover:scale-105 transition-all"
                            >
                                ENTER FACTORY
                            </Button>
                        </div>
                    )}

                    {activeTab === 'BAND ROOM' && (
                        <div className="flex h-[500px] gap-4">
                            <div className="w-64 bg-gray-800 p-4 rounded-lg flex flex-col gap-4">
                                <h3 className="text-xl font-bold text-purple-300">Room Editor</h3>
                                <div>
                                    <label className="text-xs text-gray-400 font-bold block mb-1">WALL COLOR</label>
                                    <input 
                                        type="color" 
                                        value={gameState.bandRoom?.wallColor || '#333333'} 
                                        onChange={e => setGameState(prev => ({...prev, bandRoom: {...(prev.bandRoom || { decorations: [], floorColor: '#444' }), wallColor: e.target.value, decorations: prev.bandRoom?.decorations || [] }}))}
                                        className="w-full h-8 rounded cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-bold block mb-1">FLOOR COLOR</label>
                                    <input 
                                        type="color" 
                                        value={gameState.bandRoom?.floorColor || '#444444'} 
                                        onChange={e => setGameState(prev => ({...prev, bandRoom: {...(prev.bandRoom || { decorations: [], wallColor: '#333' }), floorColor: e.target.value, decorations: prev.bandRoom?.decorations || [] }}))}
                                        className="w-full h-8 rounded cursor-pointer"
                                    />
                                </div>
                                <div className="border-t border-gray-700 pt-4">
                                    <label className="text-xs text-gray-400 font-bold block mb-2">ADD DECORATION</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['POSTER', 'TROPHY', 'FURNITURE', 'INSTRUMENT_RACK', 'PLANT'] as const).map(type => (
                                            <button 
                                                key={type}
                                                onClick={() => setSelectedDecorType(type)}
                                                className={`p-2 text-[10px] font-bold border rounded ${selectedDecorType === type ? 'bg-purple-600 border-purple-400 text-white' : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                    <Button onClick={handleAddDecoration} className="w-full mt-2 bg-purple-600 text-sm py-2">PLACE ITEM</Button>
                                </div>
                            </div>

                            <div className="flex-grow bg-gray-900 border-2 border-gray-700 rounded-lg relative overflow-hidden">
                                {/* Room Preview */}
                                <div 
                                    className="absolute inset-0"
                                    style={{ 
                                        backgroundColor: gameState.bandRoom?.floorColor || '#444',
                                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                                        backgroundSize: '20px 20px'
                                    }}
                                >
                                    {/* Walls */}
                                    <div className="absolute top-0 left-0 w-full h-1/3 border-b-4 border-black/20" style={{ backgroundColor: gameState.bandRoom?.wallColor || '#333' }}></div>
                                    
                                    {/* Decorations */}
                                    {gameState.bandRoom?.decorations.map(decor => (
                                        <div 
                                            key={decor.id}
                                            className="absolute cursor-move group"
                                            style={{ 
                                                left: `${decor.x}%`, 
                                                top: `${decor.y}%`, 
                                                transform: `translate(-50%, -50%) scale(${decor.scale}) rotate(${decor.rotation}deg)` 
                                            }}
                                        >
                                            <div className="relative">
                                                {/* Visuals for decorations */}
                                                {decor.type === 'POSTER' && <div className="w-12 h-16 bg-blue-900 border-2 border-white shadow-lg flex items-center justify-center text-[8px] text-white text-center p-1">BAND POSTER</div>}
                                                {decor.type === 'TROPHY' && <div className="text-2xl">🏆</div>}
                                                {decor.type === 'FURNITURE' && <div className="w-16 h-8 bg-amber-800 rounded shadow-lg border border-amber-900"></div>}
                                                {decor.type === 'INSTRUMENT_RACK' && <div className="w-20 h-12 bg-gray-800 border border-gray-600 flex items-end justify-around pb-1"><div className="w-1 h-8 bg-yellow-600"></div><div className="w-1 h-8 bg-yellow-600"></div><div className="w-1 h-8 bg-yellow-600"></div></div>}
                                                {decor.type === 'PLANT' && <div className="text-2xl">🪴</div>}

                                                {/* Controls */}
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:flex gap-1 bg-black/80 p-1 rounded z-50">
                                                    <button onClick={() => updateDecoration(decor.id, { x: decor.x - 5 })} className="text-white text-[10px] px-1">←</button>
                                                    <button onClick={() => updateDecoration(decor.id, { x: decor.x + 5 })} className="text-white text-[10px] px-1">→</button>
                                                    <button onClick={() => updateDecoration(decor.id, { y: decor.y - 5 })} className="text-white text-[10px] px-1">↑</button>
                                                    <button onClick={() => updateDecoration(decor.id, { y: decor.y + 5 })} className="text-white text-[10px] px-1">↓</button>
                                                    <button onClick={() => removeDecoration(decor.id)} className="text-red-500 text-[10px] px-1 font-bold">×</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-black/50 px-2 rounded">
                                    Hover over items to move/delete
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
