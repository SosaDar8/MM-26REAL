
import React, { useState } from 'react';
import { GameState, ShopItem } from '../types';
import { SHOP_ITEMS } from '../constants';
import { Button } from './Button';

interface BookerStoreProps {
    gameState: GameState;
    onPurchase: (item: ShopItem) => void;
    onBack: () => void;
    onEquip?: (item: ShopItem) => void; // Hook to navigate to editor
}

export const BookerStore: React.FC<BookerStoreProps> = ({ gameState, onPurchase, onBack, onEquip }) => {
    const [activeTab, setActiveTab] = useState<'BROWSE' | 'INVENTORY'>('BROWSE');
    const [filter, setFilter] = useState<'ALL' | 'CLOTHING' | 'ACCESSORY' | 'DECOR' | 'GEAR'>('ALL');
    const [confirmItem, setConfirmItem] = useState<ShopItem | null>(null);
    const [justPurchasedItem, setJustPurchasedItem] = useState<ShopItem | null>(null);

    const currentDay = new Date().getDay(); // 0 = Sunday, etc.

    const allItems = [...SHOP_ITEMS, ...(gameState.customShopItems || [])];

    const filteredItems = allItems.filter(item => {
        // Category Filter
        if (filter !== 'ALL' && item.category !== filter) return false;
        
        // Day Availability Filter
        if (item.availableDays && !item.availableDays.includes(currentDay)) return false;
        
        return true;
    });
    
    const ownedItems = allItems.filter(item => gameState.unlockedItems.includes(item.id));

    const handleBuyClick = (item: ShopItem) => {
        if (gameState.unlockedItems.includes(item.id)) return;
        if (gameState.funds < item.price) {
            alert("Insufficient Funds!");
            return;
        }
        if (item.reqReputation && gameState.fans < item.reqReputation) {
            alert(`Locked! Need ${item.reqReputation} Fans.`);
            return;
        }
        setConfirmItem(item);
    };

    const confirmPurchase = () => {
        if (confirmItem) {
            onPurchase(confirmItem);
            setJustPurchasedItem(confirmItem);
            setConfirmItem(null);
        }
    };

    const handleEquip = (item: ShopItem) => {
        if (onEquip) {
            onEquip(item);
        }
    };

    return (
        <div className="h-full bg-[#f8fafc] text-black font-sans flex flex-col relative">
            {/* Purchase Confirmation Modal */}
            {confirmItem && (
                <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center border-4 border-yellow-500 shadow-2xl animate-fade-in">
                        <div className="text-6xl mb-4">{confirmItem.icon}</div>
                        <h3 className="text-2xl font-black uppercase mb-2">{confirmItem.name}</h3>
                        <p className="text-gray-600 mb-4">Are you sure you want to buy this for <span className="font-bold text-green-600">${confirmItem.price}</span>?</p>
                        <div className="flex gap-2">
                            <Button onClick={confirmPurchase} variant="success" className="flex-1">CONFIRM</Button>
                            <Button onClick={() => setConfirmItem(null)} variant="secondary" className="flex-1">CANCEL</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success / Equip Modal */}
            {justPurchasedItem && (
                <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center border-4 border-green-500 shadow-2xl animate-bounce-in">
                        <div className="text-green-500 font-bold text-xl mb-2">PURCHASE SUCCESSFUL!</div>
                        <div className="text-6xl mb-4">{justPurchasedItem.icon}</div>
                        <h3 className="text-2xl font-black uppercase mb-2">{justPurchasedItem.name}</h3>
                        <p className="text-sm text-gray-500 mb-6">Item has been added to your inventory.</p>
                        
                        <div className="flex flex-col gap-2">
                            {(justPurchasedItem.category === 'CLOTHING' || justPurchasedItem.category === 'ACCESSORY') && (
                                <Button onClick={() => handleEquip(justPurchasedItem)} className="w-full bg-blue-600 text-white">EQUIP NOW</Button>
                            )}
                            {(justPurchasedItem.category === 'DECOR') && (
                                <Button onClick={() => handleEquip(justPurchasedItem)} className="w-full bg-purple-600 text-white">GO TO ROOM</Button>
                            )}
                            <Button onClick={() => setJustPurchasedItem(null)} variant="secondary" className="w-full">KEEP SHOPPING</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-[#1e293b] p-6 text-white flex justify-between items-center border-b-8 border-yellow-500 shadow-md">
                <div className="flex items-center gap-4">
                    <div className="text-4xl">📚</div>
                    <div>
                        <h1 className="text-3xl font-black font-serif uppercase tracking-widest text-yellow-400">The Booker Store</h1>
                        <p className="text-sm text-gray-300 font-mono">Official Campus Merchandise</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="bg-green-700 px-4 py-1 rounded text-green-100 text-sm font-bold border border-green-500 inline-block mb-1">
                        FUNDS: ${gameState.funds}
                    </div>
                    <br />
                    <Button onClick={onBack} variant="secondary" className="text-xs py-2">EXIT STORE</Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-200 border-b border-gray-300">
                <button 
                    onClick={() => setActiveTab('BROWSE')}
                    className={`flex-1 py-3 font-bold text-sm uppercase ${activeTab === 'BROWSE' ? 'bg-white border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    Browse Catalog
                </button>
                <button 
                    onClick={() => setActiveTab('INVENTORY')}
                    className={`flex-1 py-3 font-bold text-sm uppercase ${activeTab === 'INVENTORY' ? 'bg-white border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    My Inventory ({gameState.unlockedItems.length})
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex overflow-hidden">
                {/* Sidebar Categories (Only for Browse) */}
                {activeTab === 'BROWSE' && (
                    <div className="w-48 md:w-64 bg-gray-50 border-r border-gray-300 p-4 hidden md:block">
                        <h3 className="font-bold text-gray-600 mb-4 uppercase text-xs tracking-wider">Departments</h3>
                        <div className="space-y-2">
                            {['ALL', 'CLOTHING', 'ACCESSORY', 'DECOR', 'GEAR'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat as any)}
                                    className={`w-full text-left p-3 font-bold border-l-4 transition-all ${
                                        filter === cat 
                                        ? 'bg-white border-yellow-500 text-black shadow-sm' 
                                        : 'border-transparent text-gray-500 hover:bg-gray-200 hover:text-black'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        
                        <div className="mt-8 bg-yellow-100 p-4 border border-yellow-300 rounded text-center">
                            <h4 className="font-bold text-yellow-800 text-sm mb-1">DAILY DEALS</h4>
                            <p className="text-xs text-yellow-700">Check back tomorrow for new exclusive items!</p>
                            <div className="mt-2 text-[10px] font-mono text-gray-500">
                                TODAY IS: {['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][new Date().getDay()]}
                            </div>
                        </div>
                    </div>
                )}

                {/* Items Grid */}
                <div className="flex-grow p-8 overflow-y-auto bg-white">
                    {activeTab === 'INVENTORY' && ownedItems.length === 0 && (
                        <div className="text-center text-gray-400 mt-20">
                            <div className="text-6xl mb-4">📦</div>
                            <p>You haven't bought anything yet!</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {(activeTab === 'BROWSE' ? filteredItems : ownedItems).map(item => {
                            const isOwned = gameState.unlockedItems.includes(item.id);
                            const isLocked = item.reqReputation && gameState.fans < item.reqReputation;
                            const canAfford = gameState.funds >= item.price;

                            return (
                                <div 
                                    key={item.id} 
                                    className={`relative border-2 rounded-lg p-4 flex flex-col items-center text-center transition-all ${
                                        isOwned ? 'bg-gray-50 border-green-200' : 
                                        isLocked ? 'bg-gray-100 border-gray-200 grayscale' : 'bg-white border-blue-100 hover:border-blue-400 hover:shadow-lg'
                                    }`}
                                >
                                    {activeTab === 'BROWSE' && isLocked && (
                                        <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded border border-red-200">
                                            LOCKED (Req. {item.reqReputation} Fans)
                                        </div>
                                    )}
                                    {activeTab === 'BROWSE' && isOwned && (
                                        <div className="absolute top-2 right-2 bg-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded border border-green-200">
                                            OWNED
                                        </div>
                                    )}

                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-5xl mb-4 border border-gray-200 shadow-inner">
                                        {item.icon}
                                    </div>
                                    
                                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                                    <p className="text-xs text-gray-500 mb-4 h-8 px-2">{item.description}</p>
                                    
                                    <div className="mt-auto w-full">
                                        {activeTab === 'BROWSE' ? (
                                            <>
                                                <div className="text-2xl font-black text-gray-800 mb-2">${item.price}</div>
                                                <button 
                                                    onClick={() => handleBuyClick(item)}
                                                    disabled={isOwned || isLocked || !canAfford}
                                                    className={`w-full py-2 font-bold rounded uppercase text-xs transition-colors ${
                                                        isOwned 
                                                        ? 'bg-green-100 text-green-600 border border-green-300 cursor-default'
                                                        : isLocked 
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : canAfford
                                                        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-md active:translate-y-1'
                                                        : 'bg-red-100 text-red-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {isOwned ? 'Purchased' : isLocked ? 'Locked' : canAfford ? 'Buy Now' : 'Too Expensive'}
                                                </button>
                                            </>
                                        ) : (
                                            <div className="w-full">
                                                <div className="bg-gray-100 text-gray-500 text-xs py-2 rounded font-bold mb-2">OWNED ITEM</div>
                                                {(item.category === 'CLOTHING' || item.category === 'ACCESSORY') && (
                                                    <button onClick={() => handleEquip(item)} className="text-blue-500 text-xs underline font-bold hover:text-blue-700">
                                                        Go to Wardrobe
                                                    </button>
                                                )}
                                                {(item.category === 'DECOR') && (
                                                    <button onClick={() => handleEquip(item)} className="text-purple-500 text-xs underline font-bold hover:text-purple-700">
                                                        Go to Room
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
