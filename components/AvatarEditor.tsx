
import React, { useState, useEffect } from 'react';
import { Director, DirectorOutfit, Appearance, Uniform, InstrumentType, TransformConfig, ShopItem, CustomAsset } from '../types';
import { Button } from './Button';
import { COLORS, HAIR_STYLES_MALE, HAIR_STYLES_FEMALE, CLOTHING_OPTIONS, SHOP_ITEMS, FACE_OPTIONS } from '../constants';
import { BandMemberVisual } from './BandMemberVisual';

interface AvatarEditorProps {
    director: Director;
    onSave: (director: Director) => void;
    onBack: () => void;
    unlockedItems?: string[]; 
    customShopItems?: ShopItem[];
    customAssets?: CustomAsset[];
}

export const AvatarEditor: React.FC<AvatarEditorProps> = ({ director, onSave, onBack, unlockedItems = [], customShopItems = [], customAssets = [] }) => {
    // Local state for gender to allow toggling
    const [gender, setGender] = useState<'MALE' | 'FEMALE'>(director.gender || 'MALE');

    const [appearance, setAppearance] = useState<Appearance>({ 
        ...director.appearance,
        bodyType: director.appearance.bodyType || 'average',
        height: director.appearance.height || 1.0,
        hairTransform: director.appearance.hairTransform || { scaleX: 1, scaleY: 1, x: 0, y: 0 },
        hatTransform: director.appearance.hatTransform || { scaleX: 1, scaleY: 1, x: 0, y: 0 },
        accessoryTransform: director.appearance.accessoryTransform || { scaleX: 1, scaleY: 1, x: 0, y: 0 },
        // Ensure defaults for new fields
        eyeId: director.appearance.eyeId ?? 1,
        eyebrowId: director.appearance.eyebrowId ?? 1,
        mouthId: director.appearance.mouthId ?? 0,
        facialHairId: director.appearance.facialHairId ?? 0,
        glassesId: director.appearance.glassesId ?? 0,
        eyesTransform: director.appearance.eyesTransform || { scaleX: 1, scaleY: 1, x: 0, y: 0 },
        browsTransform: director.appearance.browsTransform || { scaleX: 1, scaleY: 1, x: 0, y: 0 },
        facialHairTransform: director.appearance.facialHairTransform || { scaleX: 1, scaleY: 1, x: 0, y: 0 },
        glassesTransform: director.appearance.glassesTransform || { scaleX: 1, scaleY: 1, x: 0, y: 0 }
    });
    const [view, setView] = useState<'FRONT' | 'BACK'>('FRONT');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [transformTarget, setTransformTarget] = useState<'HAIR' | 'HAT' | 'ACCESSORY' | 'EYES' | 'BROWS' | 'FACIAL_HAIR' | 'GLASSES'>('HAIR');
    
    // Drag Logic
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Ensure we have a valid list of outfits
    const initialOutfits = director.outfits && director.outfits.length > 0 
        ? director.outfits.map(o => ({ ...o }))
        : [{ id: 'default', name: 'Default Fit', topColor: '#ffffff', bottomColor: '#000000', style: 'casual' as const, topId: 'top_basic_tee', bottomId: 'bot_jeans', accentColor: '#fbbf24' }];

    const [outfits, setOutfits] = useState<DirectorOutfit[]>(initialOutfits);
    
    // VALIDATION FIX: Ensure currentOutfitId actually exists in the list
    const validatedCurrentId = initialOutfits.find(o => o.id === director.currentOutfitId) 
        ? director.currentOutfitId 
        : initialOutfits[0].id;

    const [currentOutfitId, setCurrentOutfitId] = useState(validatedCurrentId);
    
    const activeOutfitIndex = outfits.findIndex(o => o.id === currentOutfitId);
    const activeOutfit = activeOutfitIndex !== -1 ? outfits[activeOutfitIndex] : outfits[0];

    // Select hair list based on CURRENT local gender state
    const baseHairStyles = gender === 'FEMALE' ? HAIR_STYLES_FEMALE : HAIR_STYLES_MALE;
    const customHairStyles = customAssets.filter(a => a.type === 'HAIR').map(a => ({ id: a.id, name: a.name, svg: a.svgContent }));
    const AVAILABLE_HAIR_STYLES = [...baseHairStyles, ...customHairStyles];

    // Force update current ID if it gets out of sync with outfits list (e.g. after adding/deleting)
    useEffect(() => {
        if (!outfits.find(o => o.id === currentOutfitId)) {
            setCurrentOutfitId(outfits[0].id);
        }
    }, [outfits]);

    const handleGenderChange = (newGender: 'MALE' | 'FEMALE') => {
        setGender(newGender);
        // Reset hair to a valid default for the new gender to prevent visual bugs
        if (newGender === 'FEMALE') {
            setAppearance(prev => ({ ...prev, hairStyle: 20 })); // Long Straight
        } else {
            setAppearance(prev => ({ ...prev, hairStyle: 1 })); // Buzz
        }
    };

    const handleSave = () => {
        onSave({
            ...director,
            gender, // Save the updated gender
            appearance,
            outfits,
            currentOutfitId
        });
    };

    const updateOutfit = (updates: Partial<DirectorOutfit>) => {
        // Crucial Fix: Ensure we are updating the outfit that matches currentOutfitId
        const newOutfits = outfits.map(o => o.id === currentOutfitId ? { ...o, ...updates } : o);
        setOutfits(newOutfits);
    };

    const updateTransform = (target: typeof transformTarget, field: keyof TransformConfig, value: number) => {
        let key: keyof Appearance = 'hairTransform';
        switch(target) {
            case 'HAIR': key = 'hairTransform'; break;
            case 'HAT': key = 'hatTransform'; break;
            case 'ACCESSORY': key = 'accessoryTransform'; break;
            case 'EYES': key = 'eyesTransform'; break;
            case 'BROWS': key = 'browsTransform'; break;
            case 'FACIAL_HAIR': key = 'facialHairTransform'; break;
            case 'GLASSES': key = 'glassesTransform'; break;
        }

        setAppearance(prev => ({
            ...prev,
            [key]: {
                ...prev[key] as TransformConfig || { scaleX: 1, scaleY: 1, x: 0, y: 0 },
                [field]: value
            }
        }));
    };

    const addNewOutfit = () => {
        const newId = `o${Date.now()}`;
        const newOutfit: DirectorOutfit = {
            id: newId,
            name: 'New Outfit',
            topColor: '#ffffff',
            bottomColor: '#000000',
            style: 'casual',
            topId: 'top_basic_tee',
            bottomId: 'bot_jeans',
            accentColor: '#fbbf24'
        };
        setOutfits([...outfits, newOutfit]);
        setCurrentOutfitId(newId);
    };

    const isUnlocked = (clothingId: string) => {
        // Core items now include the new HBCU styles
        const CORE_ITEMS = [
            'top_basic_tee', 'top_suit', 'top_varsity', 'top_hbcu', 'top_polo', 'top_windbreaker', 'top_unitard', 'top_dress', 'top_bodysuit', 'top_tunic',
            'bot_jeans', 'bot_slacks', 'bot_shorts', 'bot_skirt', 'bot_leggings',
            'hat_cap', 'hat_beanie', 'hat_shako', 'hat_bucket', 'hat_stetson', 'hat_bearskin', 'hat_tall_shako', 'hat_fedora', 'hat_trilby', 'hat_bowler'
        ];
        if (CORE_ITEMS.includes(clothingId)) return true;
        
        const allItems = [...SHOP_ITEMS, ...customShopItems];
        const shopItem = allItems.find(item => item.clothingId === clothingId);
        if (!shopItem) return true; 
        
        return unlockedItems.includes(shopItem.id); 
    };

    const getDirectorUniform = (): Uniform => {
        if (!activeOutfit) return {
            id: 'error', name: 'Error', jacketColor: '#000', pantsColor: '#000', hatColor: '#000', plumeColor: '#000', hatStyle: 'none'
        } as Uniform;

        let hatStyle: any = 'none';
        if (activeOutfit.hatId === 'hat_shako') hatStyle = 'shako';
        else if (activeOutfit.hatId === 'hat_beanie') hatStyle = 'beret'; // Beanie reuses beret shape approx
        else if (activeOutfit.hatId === 'hat_cap') hatStyle = 'cap';
        else if (activeOutfit.hatId === 'hat_bucket') hatStyle = 'bucket';
        else if (activeOutfit.hatId === 'hat_stetson') hatStyle = 'stetson';
        else if (activeOutfit.hatId === 'hat_bearskin') hatStyle = 'bearskin';
        else if (activeOutfit.hatId === 'hat_tall_shako') hatStyle = 'tall_shako';
        else if (activeOutfit.hatId === 'hat_fedora') hatStyle = 'fedora';
        else if (activeOutfit.hatId === 'hat_trilby') hatStyle = 'trilby';
        else if (activeOutfit.hatId === 'hat_bowler') hatStyle = 'bowler';
        else if (activeOutfit.hatId === 'hat_pride') hatStyle = 'pride_hat';

        let jacketStyle: any = 'tshirt';
        // Precise mapping for HBCU gear
        if (activeOutfit.topId === 'top_varsity') jacketStyle = 'varsity';
        else if (activeOutfit.topId === 'top_hoodie') jacketStyle = 'hoodie';
        else if (activeOutfit.topId === 'top_suit') jacketStyle = 'suit';
        else if (activeOutfit.topId === 'top_hbcu') jacketStyle = 'hbcu_heritage'; 
        else if (activeOutfit.topId === 'top_windbreaker') jacketStyle = 'windbreaker';
        else if (activeOutfit.topId === 'top_polo') jacketStyle = 'polo';
        else if (activeOutfit.topId === 'top_unitard') jacketStyle = 'unitard';
        else if (activeOutfit.topId === 'top_dress') jacketStyle = 'dress';
        else if (activeOutfit.topId === 'top_bodysuit') jacketStyle = 'bodysuit';
        else if (activeOutfit.topId === 'top_tunic') jacketStyle = 'tunic';
        else if (activeOutfit.topId === 'top_pride_shirt') jacketStyle = 'pride_shirt';

        let pantsStyle: any = 'regular';
        if (activeOutfit.bottomId === 'bot_shorts') pantsStyle = 'shorts';
        else if (activeOutfit.bottomId === 'bot_slacks') pantsStyle = 'slacks';
        else if (activeOutfit.bottomId === 'bot_skirt') pantsStyle = 'skirt';
        else if (activeOutfit.bottomId === 'bot_leggings') pantsStyle = 'leggings';
        else if (activeOutfit.bottomId === 'bottom_pride_pants') pantsStyle = 'pride_pants';

        return {
            id: 'dir_preview',
            name: 'Director Preview',
            jacketColor: activeOutfit.topColor || '#fff',
            pantsColor: activeOutfit.bottomColor || '#000',
            hatColor: activeOutfit.topColor || '#fff', 
            plumeColor: activeOutfit.secondaryColor || activeOutfit.accentColor || 'transparent',
            accentColor: activeOutfit.accentColor || '#f00', 
            hatStyle,
            jacketStyle,
            pantsStyle,
            topId: activeOutfit.topId,
            bottomId: activeOutfit.bottomId,
            hatId: activeOutfit.hatId
        };
    };

    const EXTENDED_CLOTHING = {
        TOPS: [
            ...CLOTHING_OPTIONS.TOPS.filter(t => ['top_suit', 'top_polo', 'top_vest'].includes(t.id)),
            { id: 'top_pride_shirt', name: 'Pride Shirt' },
            ...customAssets.filter(a => a.type === 'JACKET').map(a => ({ id: a.id, name: a.name }))
        ],
        BOTTOMS: [
            ...CLOTHING_OPTIONS.BOTTOMS.filter(b => ['bot_slacks'].includes(b.id)),
            { id: 'bottom_pride_pants', name: 'Pride Pants' },
            ...customAssets.filter(a => a.type === 'PANTS').map(a => ({ id: a.id, name: a.name }))
        ],
        HATS: [
            ...CLOTHING_OPTIONS.HATS,
            { id: 'hat_pride', name: 'Pride Hat' },
            ...customAssets.filter(a => a.type === 'HAT').map(a => ({ id: a.id, name: a.name }))
        ]
    };

    const renderClothingGrid = (items: {id: string, name: string}[], currentId: string | undefined, onSelect: (id: string) => void) => (
        <div className="grid grid-cols-2 gap-2">
            {items.map(item => {
                const unlocked = isUnlocked(item.id);
                // Ensure default items are visually selected if currentId is undefined but it's a default
                const isSelected = currentId === item.id;
                return (
                    <button 
                        key={item.id}
                        disabled={!unlocked}
                        onClick={() => onSelect(item.id)}
                        className={`
                            relative p-3 text-xs font-bold uppercase tracking-wider border-2 transition-all
                            ${isSelected ? 'bg-yellow-500 border-white text-black shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'}
                            ${!unlocked ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                        `}
                    >
                        {item.name}
                        {!unlocked && <span className="absolute top-0 right-1 text-red-500">🔒</span>}
                    </button>
                );
            })}
        </div>
    );

    const getTransformValue = (field: keyof TransformConfig) => {
        // Fallback safety for old save data structure
        const defaultVal = field === 'scaleX' || field === 'scaleY' ? 1 : 0;
        let obj: TransformConfig | undefined;
        
        switch(transformTarget) {
            case 'HAIR': obj = appearance.hairTransform; break;
            case 'HAT': obj = appearance.hatTransform; break;
            case 'ACCESSORY': obj = appearance.accessoryTransform; break;
            case 'EYES': obj = appearance.eyesTransform; break;
            case 'BROWS': obj = appearance.browsTransform; break;
            case 'FACIAL_HAIR': obj = appearance.facialHairTransform; break;
            case 'GLASSES': obj = appearance.glassesTransform; break;
        }
        
        return obj?.[field] ?? defaultVal;
    }

    return (
        <div className="flex h-full bg-slate-900 text-white font-mono">
            {/* EDITOR SIDEBAR */}
            <div className="w-1/3 p-6 border-r border-gray-700 overflow-y-auto bg-black pb-32 flex flex-col gap-8 shadow-2xl z-10 custom-scrollbar">
                <div className="flex justify-between items-center border-b-4 border-yellow-600 pb-2">
                    <h2 className="text-3xl font-mono text-yellow-400 uppercase tracking-widest">AVATAR</h2>
                    <div className="flex gap-1">
                        <button 
                            onClick={() => handleGenderChange('MALE')} 
                            className={`px-3 py-1 text-[10px] font-bold border ${gender === 'MALE' ? 'bg-blue-600 text-white border-white' : 'bg-gray-800 text-gray-500 border-gray-600'}`}
                        >
                            M
                        </button>
                        <button 
                            onClick={() => handleGenderChange('FEMALE')} 
                            className={`px-3 py-1 text-[10px] font-bold border ${gender === 'FEMALE' ? 'bg-pink-600 text-white border-white' : 'bg-gray-800 text-gray-500 border-gray-600'}`}
                        >
                            F
                        </button>
                    </div>
                </div>
                
                {/* WARDROBE SELECTOR */}
                <div>
                    <label className="text-gray-500 text-xs font-bold uppercase mb-2 block">CURRENT OUTFIT</label>
                    <div className="flex gap-2 mb-2">
                        <select 
                            className="flex-grow bg-gray-800 border-2 border-gray-600 p-2 text-sm font-bold uppercase text-white outline-none focus:border-yellow-500"
                            value={currentOutfitId}
                            onChange={(e) => setCurrentOutfitId(e.target.value)}
                        >
                            {outfits.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                        <Button onClick={addNewOutfit} className="px-3 py-1 text-xl font-bold bg-green-600 border-green-400">+</Button>
                    </div>
                    <input 
                        className="w-full bg-transparent border-b border-gray-700 p-1 text-xs text-gray-400 focus:text-white focus:border-yellow-500 outline-none" 
                        value={activeOutfit.name}
                        onChange={(e) => updateOutfit({ name: e.target.value })}
                        placeholder="Outfit Name"
                    />
                </div>

                {/* PHYSIQUE CONTROLS */}
                <div className="bg-gray-900/50 p-4 border border-gray-700 rounded">
                    <h3 className="text-red-400 font-bold text-sm uppercase mb-4 tracking-wider border-b border-red-900 pb-1">PHYSIQUE</h3>
                    
                    <div className="mb-4">
                        <label className="text-[10px] text-gray-500 mb-2 block font-bold">BODY TYPE</label>
                        <div className="flex gap-2">
                            {['slim', 'average', 'heavy'].map(type => (
                                <button 
                                    key={type}
                                    onClick={() => setAppearance({...appearance, bodyType: type as any})}
                                    className={`flex-1 py-2 text-xs font-bold uppercase border-2 ${appearance.bodyType === type ? 'bg-red-600 border-white text-white' : 'bg-black border-gray-600 text-gray-400'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between">
                            <label className="text-[10px] text-gray-500 mb-1 block font-bold">HEIGHT</label>
                            <span className="text-[10px] text-yellow-400 font-bold">{(appearance.height || 1.0).toFixed(2)}x</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.9" 
                            max="1.1" 
                            step="0.01"
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            value={appearance.height || 1.0} 
                            onChange={(e) => setAppearance({...appearance, height: parseFloat(e.target.value)})}
                        />
                    </div>
                </div>

                {/* FACIAL FEATURES - NEW SECTION */}
                <div className="bg-gray-900/50 p-4 border border-gray-700 rounded">
                    <h3 className="text-orange-400 font-bold text-sm uppercase mb-4 tracking-wider border-b border-orange-900 pb-1">FACE</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-gray-500 mb-1 block font-bold">EYES</label>
                            <div className="grid grid-cols-4 gap-1">
                                {FACE_OPTIONS.EYES.map(opt => (
                                    <button 
                                        key={opt.id} 
                                        onClick={() => setAppearance({...appearance, eyeId: opt.id})}
                                        className={`p-1 text-[9px] border ${appearance.eyeId === opt.id ? 'bg-orange-600 border-white text-white' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                                    >
                                        {opt.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 mb-1 block font-bold">EYEBROWS</label>
                            <div className="grid grid-cols-4 gap-1">
                                {FACE_OPTIONS.BROWS.map(opt => (
                                    <button 
                                        key={opt.id} 
                                        onClick={() => setAppearance({...appearance, eyebrowId: opt.id})}
                                        className={`p-1 text-[9px] border ${appearance.eyebrowId === opt.id ? 'bg-orange-600 border-white text-white' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                                    >
                                        {opt.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 mb-1 block font-bold">MOUTH</label>
                            <div className="grid grid-cols-4 gap-1">
                                {FACE_OPTIONS.MOUTHS.map(opt => (
                                    <button 
                                        key={opt.id} 
                                        onClick={() => setAppearance({...appearance, mouthId: opt.id})}
                                        className={`p-1 text-[9px] border ${appearance.mouthId === opt.id ? 'bg-orange-600 border-white text-white' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                                    >
                                        {opt.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 mb-1 block font-bold">FACIAL HAIR</label>
                            <div className="grid grid-cols-4 gap-1">
                                {FACE_OPTIONS.FACIAL_HAIR.map(opt => (
                                    <button 
                                        key={opt.id} 
                                        onClick={() => setAppearance({...appearance, facialHairId: opt.id})}
                                        className={`p-1 text-[9px] border ${appearance.facialHairId === opt.id ? 'bg-orange-600 border-white text-white' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                                    >
                                        {opt.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 mb-1 block font-bold">GLASSES</label>
                            <div className="grid grid-cols-4 gap-1">
                                {FACE_OPTIONS.GLASSES.map(opt => (
                                    <button 
                                        key={opt.id} 
                                        onClick={() => setAppearance({...appearance, glassesId: opt.id})}
                                        className={`p-1 text-[9px] border ${appearance.glassesId === opt.id ? 'bg-orange-600 border-white text-white' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                                    >
                                        {opt.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* PHYSICAL TRAITS */}
                <div className="bg-gray-900/50 p-4 border border-gray-700 rounded">
                    <h3 className="text-blue-400 font-bold text-sm uppercase mb-4 tracking-wider border-b border-blue-900 pb-1">FEATURES</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-gray-500 mb-2 block font-bold">SKIN TONE</label>
                            <div className="flex gap-2 flex-wrap">
                                {['#fecaca', '#dca586', '#a16207', '#5D4037', '#3E2723', '#fcd34d'].map(c => (
                                    <button 
                                        key={c} 
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${appearance.skinColor === c ? 'border-white scale-110 ring-2 ring-blue-500' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }}
                                        onClick={() => setAppearance({...appearance, skinColor: c})}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-[10px] text-gray-500 block font-bold">HAIR STYLE</label>
                                <span className="text-[9px] text-blue-400 font-bold">{gender} SET</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {AVAILABLE_HAIR_STYLES.map(style => (
                                    <button
                                        key={style.id}
                                        onClick={() => setAppearance({...appearance, hairStyle: style.id})}
                                        className={`px-1 py-2 text-[10px] font-bold border transition-all ${appearance.hairStyle === style.id ? 'bg-blue-600 border-white text-white' : 'bg-gray-800 border-gray-700 text-gray-500 hover:bg-gray-700'}`}
                                    >
                                        {style.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] text-gray-500 mb-2 block font-bold">HAIR COLOR</label>
                            <div className="flex gap-2 flex-wrap">
                                {COLORS.map(c => (
                                    <button 
                                        key={c.name} 
                                        className={`w-6 h-6 rounded-full border-2 transition-all ${appearance.hairColor === c.hex ? 'border-white scale-125' : 'border-transparent'}`}
                                        style={{ backgroundColor: c.hex }}
                                        onClick={() => setAppearance({...appearance, hairColor: c.hex})}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] text-gray-500 mb-2 block font-bold">ACCESSORY</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setAppearance({...appearance, accessoryId: 0})}
                                    className={`px-1 py-2 text-[10px] font-bold border transition-all ${appearance.accessoryId === 0 ? 'bg-blue-600 border-white text-white' : 'bg-gray-800 border-gray-700 text-gray-500 hover:bg-gray-700'}`}
                                >
                                    NONE
                                </button>
                                {customAssets.filter(a => a.type === 'ACCESSORY').map(acc => (
                                    <button
                                        key={acc.id}
                                        onClick={() => setAppearance({...appearance, accessoryId: acc.id})}
                                        className={`px-1 py-2 text-[10px] font-bold border transition-all ${appearance.accessoryId === acc.id ? 'bg-blue-600 border-white text-white' : 'bg-gray-800 border-gray-700 text-gray-500 hover:bg-gray-700'}`}
                                    >
                                        {acc.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CLOTHING SECTION */}
                <div className="bg-gray-900/50 p-4 border border-gray-700 rounded">
                    <h3 className="text-green-400 font-bold text-sm uppercase mb-4 tracking-wider border-b border-green-900 pb-1">APPAREL</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block">HEADWEAR</label>
                            <div className="grid grid-cols-2 gap-2">
                                {EXTENDED_CLOTHING.HATS.map(hat => (
                                    <button
                                        key={hat.id}
                                        className={`p-2 text-xs border font-bold uppercase ${activeOutfit.hatId === hat.id ? 'bg-green-600 border-white text-white' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                                        onClick={() => updateOutfit({ hatId: hat.id })}
                                    >
                                        {hat.name}
                                    </button>
                                ))}
                                <button onClick={() => updateOutfit({ hatId: undefined })} className="p-2 text-xs border font-bold uppercase bg-gray-800 border-gray-600 text-gray-500">NONE</button>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block">TOPS</label>
                            {renderClothingGrid(EXTENDED_CLOTHING.TOPS, activeOutfit.topId, (id) => updateOutfit({ topId: id }))}
                        </div>

                        <div>
                            <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block">BOTTOMS</label>
                            {renderClothingGrid(EXTENDED_CLOTHING.BOTTOMS, activeOutfit.bottomId, (id) => updateOutfit({ bottomId: id }))}
                        </div>

                        <div className="pt-2 border-t border-gray-700">
                            <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block">FABRIC COLORS</label>
                            <div className="flex justify-between gap-4 mb-2">
                                <div className="flex-1">
                                    <span className="text-[9px] uppercase text-gray-500 block mb-1">Top</span>
                                    <div className="flex flex-wrap gap-1">
                                        {COLORS.map(c => (
                                            <button key={c.name} onClick={() => updateOutfit({ topColor: c.hex })} className={`w-4 h-4 border ${activeOutfit.topColor === c.hex ? 'border-white scale-125' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <span className="text-[9px] uppercase text-gray-500 block mb-1">Bottom</span>
                                    <div className="flex flex-wrap gap-1">
                                        {COLORS.map(c => (
                                            <button key={c.name} onClick={() => updateOutfit({ bottomColor: c.hex })} className={`w-4 h-4 border ${activeOutfit.bottomColor === c.hex ? 'border-white scale-125' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <span className="text-[9px] uppercase text-gray-500 block mb-1">Secondary / Trim</span>
                                <div className="flex flex-wrap gap-1">
                                    {COLORS.map(c => (
                                        <button key={c.name} onClick={() => updateOutfit({ secondaryColor: c.hex })} className={`w-4 h-4 border ${activeOutfit.secondaryColor === c.hex ? 'border-white scale-125' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ADVANCED TRANSFORMS */}
                <div className="bg-gray-900/50 p-4 border border-gray-700 rounded">
                    <div className="flex justify-between items-center border-b border-purple-900 pb-1 mb-4">
                        <h3 className="text-purple-400 font-bold text-sm uppercase tracking-wider">ADVANCED EDIT</h3>
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-[10px] text-gray-400 underline">{showAdvanced ? 'HIDE' : 'SHOW'}</button>
                    </div>
                    
                    {showAdvanced && (
                        <div>
                            <div className="flex gap-1 mb-4 flex-wrap">
                                {['HAIR', 'HAT', 'ACCESSORY', 'EYES', 'BROWS', 'FACIAL_HAIR', 'GLASSES'].map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => setTransformTarget(t as any)}
                                        className={`flex-1 py-1 px-2 text-[9px] border ${transformTarget === t ? 'bg-purple-600 border-white text-white' : 'bg-black border-gray-700 text-gray-500'}`}
                                    >
                                        {t.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="space-y-2">
                                <div>
                                    <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                                        <span>SCALE X (Width)</span>
                                        <span>{getTransformValue('scaleX').toFixed(2)}x</span>
                                    </div>
                                    <input 
                                        type="range" min="0.5" max="2.0" step="0.05"
                                        value={getTransformValue('scaleX')}
                                        onChange={(e) => updateTransform(transformTarget, 'scaleX', parseFloat(e.target.value))}
                                        className="w-full h-1 bg-gray-700 appearance-none cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                                        <span>SCALE Y (Height)</span>
                                        <span>{getTransformValue('scaleY').toFixed(2)}x</span>
                                    </div>
                                    <input 
                                        type="range" min="0.5" max="2.0" step="0.05"
                                        value={getTransformValue('scaleY')}
                                        onChange={(e) => updateTransform(transformTarget, 'scaleY', parseFloat(e.target.value))}
                                        className="w-full h-1 bg-gray-700 appearance-none cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                                        <span>X OFFSET</span>
                                        <span>{getTransformValue('x')}px</span>
                                    </div>
                                    <input 
                                        type="range" min="-50" max="50" step="1"
                                        value={getTransformValue('x')}
                                        onChange={(e) => updateTransform(transformTarget, 'x', parseInt(e.target.value))}
                                        className="w-full h-1 bg-gray-700 appearance-none cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                                        <span>Y OFFSET</span>
                                        <span>{getTransformValue('y')}px</span>
                                    </div>
                                    <input 
                                        type="range" min="-50" max="50" step="1"
                                        value={getTransformValue('y')}
                                        onChange={(e) => updateTransform(transformTarget, 'y', parseInt(e.target.value))}
                                        className="w-full h-1 bg-gray-700 appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* PREVIEW AREA */}
            <div 
                className="flex-grow flex flex-col bg-gray-800 relative overflow-hidden cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                
                {/* Director Info (Top Overlay) */}
                <div className="relative z-10 text-center mt-12 mb-4 pointer-events-none">
                     <h2 className="text-5xl font-black text-white italic drop-shadow-[6px_6px_0_rgba(0,0,0,1)] uppercase tracking-tighter">{director.name}</h2>
                     <div className="bg-yellow-500 text-black px-4 py-1 text-xs font-bold inline-block mt-2 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,0.5)]">{director.trait.toUpperCase()}</div>
                </div>
                
                {/* 3D Visual */}
                <div className="flex-grow flex items-center justify-center relative z-10">
                    <div 
                        className="transform transition-transform duration-75"
                        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(1.5)` }}
                    >
                        <BandMemberVisual 
                            instrument={InstrumentType.TRUMPET}
                            showInstrument={false}
                            uniform={getDirectorUniform()}
                            appearance={appearance}
                            scale={1.2}
                            showHat={true}
                            view={view}
                            noBounce={true}
                        />
                    </div>
                </div>

                {/* Fixed Footer Bar - ALWAYS VISIBLE */}
                <div className="h-20 bg-black/80 backdrop-blur-md border-t border-white/20 flex items-center justify-between px-8 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] relative">
                     <div className="flex gap-4">
                        <Button onClick={() => setView('FRONT')} className={`text-xs px-4 py-2 ${view === 'FRONT' ? 'bg-blue-600 border-white' : 'bg-gray-700 border-gray-500'}`} >FRONT</Button>
                        <Button onClick={() => setView('BACK')} className={`text-xs px-4 py-2 ${view === 'BACK' ? 'bg-blue-600 border-white' : 'bg-gray-700 border-gray-500'}`} >BACK</Button>
                     </div>
                     <div className="flex gap-4">
                        <Button onClick={onBack} variant="secondary" className="px-6 py-3 text-xs font-bold border-2 border-gray-400">DISCARD</Button>
                        <Button onClick={handleSave} variant="success" className="px-8 py-3 text-lg font-black italic shadow-xl border-4 border-white animate-pulse">CONFIRM LOOK</Button>
                     </div>
                </div>
            </div>
        </div>
    );
};
