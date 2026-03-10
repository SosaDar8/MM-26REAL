import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Save, Trash2, UserPlus, Calendar, ShoppingBag, Palette, Factory, Music } from 'lucide-react';
import { GameState, InstrumentType, EventType, ShopItem, CustomAsset, BandMember, Uniform, DirectorOutfit } from '../types';
import { generateBalancedRoster, DEFAULT_UNIFORMS } from '../constants';

interface CreatorMenuProps {
    gameState: GameState;
    onUpdateState: (newState: GameState) => void;
    onClose: () => void;
}

type Tab = 'ASSETS' | 'SHOP' | 'EVENTS' | 'MEMBERS';

export const CreatorMenu: React.FC<CreatorMenuProps> = ({ gameState, onUpdateState, onClose }) => {
    const [activeTab, setActiveTab] = useState<Tab>('ASSETS');

    // ASSET FACTORY STATE
    const [assetType, setAssetType] = useState<CustomAsset['type']>('ACCESSORY');
    const [assetName, setAssetName] = useState('');
    const [assetImage, setAssetImage] = useState('');
    const [assetColor, setAssetColor] = useState('#ffffff');
    const [assetTemplate, setAssetTemplate] = useState('template_1');

    // SHOP STATE
    const [shopItemName, setShopItemName] = useState('');
    const [shopItemPrice, setShopItemPrice] = useState(0);
    const [shopItemCategory, setShopItemCategory] = useState<ShopItem['category']>('ACCESSORY');

    // EVENT STATE
    const [eventType, setEventType] = useState<EventType>(EventType.PARADE);
    const [eventName, setEventName] = useState('');
    const [eventOpponent, setEventOpponent] = useState('');

    // MEMBER STATE
    const [memberInstrument, setMemberInstrument] = useState<InstrumentType | 'RANDOM'>('RANDOM');
    const [memberCount, setMemberCount] = useState(1);

    const handleCreateAsset = () => {
        const newAsset: CustomAsset = {
            id: `custom-${Date.now()}`,
            name: assetName || 'New Asset',
            type: assetType,
            imageUrl: assetImage,
            color: assetColor,
            templateId: assetTemplate,
            properties: { createdBy: 'sosadagr8' }
        };

        // Add to game state (and potentially unlock immediately)
        const newShopItem: ShopItem = {
            id: `shop-${newAsset.id}`,
            name: newAsset.name,
            category: assetType === 'DECORATION' ? 'DECOR' : 'ACCESSORY', // Simplified mapping
            price: 0, // Free for creator
            description: 'Custom Creator Item',
            icon: '✨',
            clothingType: assetType === 'HAT' ? 'HAT' : undefined
        };

        onUpdateState({
            ...gameState,
            customAssets: [...(gameState.customAssets || []), newAsset],
            unlockedItems: [...gameState.unlockedItems, newShopItem.id],
            // Also add to shop for others? Or just unlock? User said "add stuff to the shop"
            // Let's add it to a custom shop items list if we had one, or just assume it's available.
            // For now, let's unlock it directly.
        });
        alert(`Created ${assetName}!`);
        setAssetName('');
    };

    const handleAddToShop = () => {
        const newItem: ShopItem = {
            id: `shop-custom-${Date.now()}`,
            name: shopItemName || 'Custom Item',
            category: shopItemCategory,
            price: shopItemPrice,
            description: 'Added by Creator',
            icon: '🛍️'
        };

        // We need a place to store custom shop items in GameState if we want them to persist in the store
        // For now, let's assume we add them to unlocked items or a special "customShopItems" array if it existed.
        // The user prompt implies adding to the "shop", so let's add to a new field in GameState or just unlock it.
        // Let's add to `customShopItems` which I added to types.
        
        onUpdateState({
            ...gameState,
            customShopItems: [...(gameState.customShopItems || []), newItem]
        });
        alert(`Added ${shopItemName} to Shop!`);
        setShopItemName('');
    };

    const handleCreateEvent = () => {
        const newEvent = {
            id: `evt-custom-${Date.now()}`,
            type: eventType,
            name: eventName || 'Custom Event',
            opponent: eventOpponent || 'Challenger',
            isHome: true,
            isRivalry: false,
            date: Date.now(), // Immediate or scheduled? Let's say it's added to schedule
            reward: 5000,
            completed: false,
            level: 'COLLEGE' as const
        };

        onUpdateState({
            ...gameState,
            schedule: [...gameState.schedule, newEvent]
        });
        alert(`Scheduled ${eventName}!`);
        setEventName('');
    };

    const handleSpawnMembers = () => {
        let newMembers: BandMember[] = [];
        
        for (let i = 0; i < memberCount; i++) {
            const roster = generateBalancedRoster(1);
            let member = roster[0];
            
            if (memberInstrument !== 'RANDOM') {
                member.instrument = memberInstrument;
            }
            
            // Max stats for creator spawned members? User said "add members as i please", didn't specify stats.
            // But "Godly Stuff" implies they might want them good. Let's keep them standard but maybe add a toggle later.
            // For now, standard generation.
            
            newMembers.push(member);
        }

        onUpdateState({
            ...gameState,
            members: [...gameState.members, ...newMembers],
            recruitPool: gameState.recruitPool // Don't remove from pool, just generate new
        });
        alert(`Spawned ${memberCount} members!`);
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-8 overflow-y-auto">
            <div className="w-full max-w-6xl bg-gray-900 border-2 border-purple-500 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.5)] flex flex-col h-[80vh]">
                {/* HEADER */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-purple-900/50 to-blue-900/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-600 rounded-lg">
                            <Factory className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tighter">CREATOR MODE</h2>
                            <p className="text-purple-300 font-mono text-sm">Welcome, sosadagr8</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-8 h-8 text-gray-400 hover:text-white" />
                    </button>
                </div>

                {/* TABS */}
                <div className="flex border-b border-gray-800">
                    {[
                        { id: 'ASSETS', icon: Palette, label: 'Asset Factory' },
                        { id: 'SHOP', icon: ShoppingBag, label: 'Shop Manager' },
                        { id: 'EVENTS', icon: Calendar, label: 'Event Creator' },
                        { id: 'MEMBERS', icon: UserPlus, label: 'Member Spawner' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-colors ${
                                activeTab === tab.id 
                                    ? 'bg-purple-600/20 text-purple-400 border-b-2 border-purple-500' 
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {activeTab === 'ASSETS' && (
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-4">Create New Asset</h3>
                                
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">Asset Name</label>
                                    <input 
                                        type="text" 
                                        value={assetName}
                                        onChange={(e) => setAssetName(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none"
                                        placeholder="e.g. Golden Cape"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">Type</label>
                                    <select 
                                        value={assetType}
                                        onChange={(e) => setAssetType(e.target.value as any)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none"
                                    >
                                        <option value="ACCESSORY">Accessory</option>
                                        <option value="HAIR">Hair Style</option>
                                        <option value="CLOTHING">Clothing</option>
                                        <option value="HAT">Hat</option>
                                        <option value="UNIFORM">Uniform Part</option>
                                        <option value="DECORATION">Decoration</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">Template / Style</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['template_1', 'template_2', 'template_3'].map(t => (
                                            <button 
                                                key={t}
                                                onClick={() => setAssetTemplate(t)}
                                                className={`p-4 rounded border ${assetTemplate === t ? 'border-purple-500 bg-purple-500/20' : 'border-gray-700 bg-gray-800'} hover:bg-gray-700`}
                                            >
                                                <div className="w-full aspect-square bg-gray-600 rounded mb-2"></div>
                                                <span className="text-xs text-gray-400">{t}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">Color</label>
                                    <input 
                                        type="color" 
                                        value={assetColor}
                                        onChange={(e) => setAssetColor(e.target.value)}
                                        className="w-full h-12 rounded cursor-pointer"
                                    />
                                </div>

                                <button 
                                    onClick={handleCreateAsset}
                                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Create Asset
                                </button>
                            </div>

                            <div className="bg-gray-800/50 rounded-xl p-6 flex flex-col items-center justify-center border border-gray-700 border-dashed">
                                <h4 className="text-gray-500 font-bold mb-4">Preview</h4>
                                <div className="w-64 h-64 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                                    <div 
                                        className="w-32 h-32 rounded transition-all duration-300"
                                        style={{ 
                                            backgroundColor: assetColor,
                                            borderRadius: assetType === 'HAT' ? '50% 50% 0 0' : '8px'
                                        }}
                                    ></div>
                                    <div className="absolute bottom-4 text-gray-500 text-xs font-mono">{assetType}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'SHOP' && (
                        <div className="space-y-6 max-w-xl mx-auto">
                            <h3 className="text-xl font-bold text-white mb-4">Add Item to Shop</h3>
                            
                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm">Item Name</label>
                                <input 
                                    type="text" 
                                    value={shopItemName}
                                    onChange={(e) => setShopItemName(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">Price</label>
                                    <input 
                                        type="number" 
                                        value={shopItemPrice}
                                        onChange={(e) => setShopItemPrice(parseInt(e.target.value))}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">Category</label>
                                    <select 
                                        value={shopItemCategory}
                                        onChange={(e) => setShopItemCategory(e.target.value as any)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none"
                                    >
                                        <option value="ACCESSORY">Accessory</option>
                                        <option value="CLOTHING">Clothing</option>
                                        <option value="DECOR">Decor</option>
                                        <option value="GEAR">Gear</option>
                                    </select>
                                </div>
                            </div>

                            <button 
                                onClick={handleAddToShop}
                                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Add to Shop
                            </button>
                        </div>
                    )}

                    {activeTab === 'EVENTS' && (
                        <div className="space-y-6 max-w-xl mx-auto">
                            <h3 className="text-xl font-bold text-white mb-4">Schedule Custom Event</h3>
                            
                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm">Event Name</label>
                                <input 
                                    type="text" 
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm">Event Type</label>
                                <select 
                                    value={eventType}
                                    onChange={(e) => setEventType(e.target.value as EventType)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none"
                                >
                                    {Object.values(EventType).map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm">Opponent Name (Optional)</label>
                                <input 
                                    type="text" 
                                    value={eventOpponent}
                                    onChange={(e) => setEventOpponent(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none"
                                />
                            </div>

                            <button 
                                onClick={handleCreateEvent}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                            >
                                <Calendar className="w-5 h-5" />
                                Schedule Event
                            </button>
                        </div>
                    )}

                    {activeTab === 'MEMBERS' && (
                        <div className="space-y-6 max-w-xl mx-auto">
                            <h3 className="text-xl font-bold text-white mb-4">Spawn Band Members</h3>
                            
                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm">Instrument</label>
                                <select 
                                    value={memberInstrument}
                                    onChange={(e) => setMemberInstrument(e.target.value as any)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-purple-500 outline-none"
                                >
                                    <option value="RANDOM">🎲 Random</option>
                                    {Object.values(InstrumentType).map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm">Quantity</label>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="50" 
                                        value={memberCount}
                                        onChange={(e) => setMemberCount(parseInt(e.target.value))}
                                        className="flex-1 accent-purple-500"
                                    />
                                    <span className="text-2xl font-bold text-purple-400 w-12 text-center">{memberCount}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleSpawnMembers}
                                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                            >
                                <UserPlus className="w-5 h-5" />
                                Spawn Members
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
