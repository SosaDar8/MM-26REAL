
import React, { useState, useEffect } from 'react';
import { Uniform, LogoPlacement, InstrumentType, CustomAsset } from '../types';
import { Button } from './Button';
import { COLORS } from '../constants';
import { BandMemberVisual } from './BandMemberVisual';

interface UniformEditorProps {
    uniforms: Uniform[];
    activeIds: { band: string, dm?: string, majorette?: string, guard?: string };
    onSave: (uniforms: Uniform[], activeIds: { band: string, dm?: string, majorette?: string, guard?: string }, cost: number) => void;
    onBack: () => void;
    identity?: any; // To access school colors/logos
    budget?: number; // Current school budget
    isCostEnabled?: boolean;
    customAssets?: CustomAsset[];
    hasEquipManager?: boolean;
}

export const UniformEditor: React.FC<UniformEditorProps> = ({ uniforms: initialUniforms, activeIds: initialActiveIds, onSave, onBack, identity, budget = 0, isCostEnabled = true, customAssets = [], hasEquipManager = false }) => {
    const [uniforms, setUniforms] = useState<Uniform[]>(initialUniforms);
    const [activeIds, setActiveIds] = useState(initialActiveIds);
    const [editorMode, setEditorMode] = useState<'BAND' | 'DM' | 'MAJORETTE' | 'GUARD'>('BAND');
    
    // Determine which ID is currently active based on the editor mode
    const activeId = editorMode === 'BAND' ? activeIds.band : 
                     editorMode === 'DM' ? (activeIds.dm || activeIds.band) : 
                     editorMode === 'MAJORETTE' ? (activeIds.majorette || activeIds.band) : 
                     (activeIds.guard || activeIds.band);

    const handleModeChange = (mode: 'BAND' | 'DM' | 'MAJORETTE' | 'GUARD') => {
        setEditorMode(mode);
        
        // If switching to a special role, ensure it has a unique uniform ID (fork from band if needed)
        if (mode !== 'BAND') {
            const roleKey = mode === 'DM' ? 'dm' : mode === 'MAJORETTE' ? 'majorette' : 'guard';
            const currentRoleId = activeIds[roleKey];
            
            // If ID is missing OR it's sharing the band ID OR it is shared with any other role, fork it immediately
            const isShared = Object.entries(activeIds).some(([key, id]) => id === currentRoleId && key !== roleKey);
            
            if (!currentRoleId || currentRoleId === activeIds.band || isShared) {
                const sourceUniformId = currentRoleId || activeIds.band;
                const sourceUniform = uniforms.find(u => u.id === sourceUniformId);
                
                if (sourceUniform) {
                    const newId = `uniform-${Date.now()}-${mode}`;
                    const newUniform: Uniform = {
                        ...sourceUniform,
                        id: newId,
                        name: `${sourceUniform.name} (${mode})`,
                        isDrumMajor: mode === 'DM',
                        // Apply default styles only if we are creating a fresh role uniform for the first time
                        jacketStyle: !currentRoleId && mode === 'MAJORETTE' ? 'bodysuit' : !currentRoleId && mode === 'GUARD' ? 'tunic' : sourceUniform.jacketStyle,
                        pantsStyle: !currentRoleId && mode === 'MAJORETTE' ? 'leggings' : !currentRoleId && mode === 'GUARD' ? 'leggings' : sourceUniform.pantsStyle,
                        hatStyle: !currentRoleId && mode === 'MAJORETTE' ? 'none' : !currentRoleId && mode === 'GUARD' ? 'none' : sourceUniform.hatStyle,
                    };
                    setUniforms(prev => [...prev, newUniform]);
                    setActiveIds(prev => ({ ...prev, [roleKey]: newId }));
                }
            }
        }
    };

    const [view, setView] = useState<'FRONT' | 'BACK'>('FRONT');
    const [showError, setShowError] = useState(false);
    
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

    // Decal/Logo State
    const activeIndex = uniforms.findIndex(u => u.id === activeId);
    const activeUniform = uniforms[activeIndex] || uniforms[0];

    // Initialize placement if not exists
    const [logoPlacement, setLogoPlacement] = useState<LogoPlacement>(activeUniform.logoPlacement || {
        logoType: 'BAND',
        enabled: false,
        position: 'CHEST_LEFT',
        size: 'SMALL',
        applyTo: 'UNIFORM',
        customText: '',
        font: '',
        xOffset: 0,
        yOffset: 0,
        logoXOffset: 0,
        logoYOffset: 0,
        textXOffset: 0,
        textYOffset: 0,
        textScale: 1
    });

    useEffect(() => {
        setLogoPlacement(activeUniform.logoPlacement || {
            logoType: 'BAND',
            enabled: false,
            position: 'CHEST_LEFT',
            size: 'SMALL',
            applyTo: 'UNIFORM',
            customText: '',
            font: '',
            xOffset: 0,
            yOffset: 0,
            logoXOffset: 0,
            logoYOffset: 0,
            textXOffset: 0,
            textYOffset: 0,
            textScale: 1
        });
    }, [activeId, activeUniform]);

    const updateUniform = (updates: Partial<Uniform>) => {
        // COPY-ON-WRITE: If editing a shared uniform in a specific role mode, fork it first
        const roleKey = editorMode === 'DM' ? 'dm' : editorMode === 'MAJORETTE' ? 'majorette' : editorMode === 'GUARD' ? 'guard' : 'band';
        const isShared = Object.entries(activeIds).some(([key, id]) => id === activeId && key !== roleKey);

        if (editorMode !== 'BAND' && (activeId === activeIds.band || isShared)) {
             const baseUniform = uniforms.find(u => u.id === activeId);
             if (baseUniform) {
                 const newId = `uniform-${Date.now()}-${editorMode}`;
                 const newUniform: Uniform = {
                     ...baseUniform,
                     ...updates,
                     id: newId,
                     name: `${baseUniform.name} (${editorMode})`,
                     isDrumMajor: editorMode === 'DM'
                 };
                 
                 setUniforms(prev => [...prev, newUniform]);
                 setActiveIds(prev => {
                     const newIds = { ...prev };
                     if (editorMode === 'DM') newIds.dm = newId;
                     else if (editorMode === 'MAJORETTE') newIds.majorette = newId;
                     else newIds.guard = newId;
                     return newIds;
                 });
                 return;
             }
        }

        const index = activeIndex === -1 ? 0 : activeIndex;
        const newUniforms = [...uniforms];
        newUniforms[index] = { ...newUniforms[index], ...updates };
        setUniforms(newUniforms);
    };

    const updateLogo = (updates: Partial<LogoPlacement>) => {
        const newPlacement = { ...logoPlacement, ...updates };
        setLogoPlacement(newPlacement);
        updateUniform({ logoPlacement: newPlacement });
    };

    const addNewUniform = () => {
        const newId = `u${Date.now()}`;
        const newUniform: Uniform = {
            id: newId,
            name: 'New Concept',
            jacketColor: identity?.primaryColor || '#ffffff',
            pantsColor: identity?.secondaryColor || '#ffffff',
            hatColor: identity?.primaryColor || '#000000',
            plumeColor: '#ef4444',
            accentColor: '#fbbf24',
            shoeColor: '#000000',
            gloveColor: '#ffffff',
            hatStyle: 'shako',
            jacketStyle: 'classic',
            pantsStyle: 'regular',
            isDrumMajor: editorMode === 'DM',
            capeStyle: 'none',
            hasGauntlets: false,
            hasSpats: false
        };
        setUniforms([...uniforms, newUniform]);
        setActiveIds(prev => {
            if (editorMode === 'BAND') return { ...prev, band: newId };
            if (editorMode === 'DM') return { ...prev, dm: newId };
            if (editorMode === 'MAJORETTE') return { ...prev, majorette: newId };
            return { ...prev, guard: newId };
        });
    };

    const [isAdvanced, setIsAdvanced] = useState(false);
    const [selectedLayer, setSelectedLayer] = useState<'HAT' | 'JACKET' | 'PANTS' | 'CHEST_PLATE'>('HAT');

    const updateTransform = (layer: 'HAT' | 'JACKET' | 'PANTS' | 'CHEST_PLATE', key: 'scaleX' | 'scaleY' | 'x' | 'y' | 'zIndex', value: number) => {
        const transformKey = layer === 'HAT' ? 'hatTransform' : 
                             layer === 'JACKET' ? 'jacketTransform' : 
                             layer === 'PANTS' ? 'pantsTransform' : 'chestPlateTransform';
        
        const currentTransform = activeUniform[transformKey] || { scaleX: 1, scaleY: 1, x: 0, y: 0, zIndex: layer === 'HAT' ? 50 : layer === 'JACKET' ? 30 : layer === 'PANTS' ? 20 : 35 };
        updateUniform({ [transformKey]: { ...currentTransform, [key]: value } });
    };

    // Calculate Cost
    const calculateCost = () => {
        let cost = 500; // Base cost for a set of uniforms
        
        if (activeUniform.jacketStyle === 'hbcu_heritage' || activeUniform.jacketStyle === 'suit') cost += 200;
        if (activeUniform.jacketStyle === 'windbreaker' || activeUniform.jacketStyle === 'tshirt') cost -= 100;
        
        if (activeUniform.hatStyle === 'shako' || activeUniform.hatStyle === 'tall_shako') cost += 150;
        if (activeUniform.hatStyle === 'bearskin') cost += 300;
        
        if (activeUniform.hasGauntlets) cost += 50;
        if (activeUniform.hasSpats) cost += 50;
        if (activeUniform.chestPlate) cost += 100;
        if (activeUniform.hasCape) cost += 150;
        
        if (logoPlacement.enabled) cost += 100;

        return hasEquipManager ? Math.floor(cost * 0.8) : cost;
    };

    const currentCost = isCostEnabled ? calculateCost() : 0;
    const canAfford = !isCostEnabled || budget >= currentCost;

    const handleSave = () => {
        if (isCostEnabled && !canAfford) {
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }
        onSave(uniforms, activeIds, currentCost);
        onBack(); // Ensure we exit
    };

    const [isLanding, setIsLanding] = useState(true);

    // ... existing hooks ...

    const handleModeSelect = (mode: 'BAND' | 'DM' | 'MAJORETTE' | 'GUARD') => {
        handleModeChange(mode);
        setIsLanding(false);
    };

    if (isLanding) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white font-mono relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                
                <h1 className="text-5xl font-black text-yellow-400 mb-2 tracking-tighter drop-shadow-[4px_4px_0_rgba(0,0,0,1)] z-10">UNIFORM DEPARTMENT</h1>
                <p className="text-gray-400 mb-12 z-10 uppercase tracking-widest">Select a section to outfit</p>

                <div className="grid grid-cols-2 gap-6 z-10 max-w-4xl w-full px-8">
                    <button 
                        onClick={() => handleModeSelect('BAND')}
                        className="group relative bg-gray-800 border-4 border-gray-600 hover:border-yellow-400 p-8 transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(250,204,21,0.2)] flex flex-col items-center"
                    >
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎺</div>
                        <h2 className="text-2xl font-black text-white mb-2">BAND MUSICIANS</h2>
                        <p className="text-xs text-gray-400 text-center">Standard uniform for brass, woodwinds, and percussion.</p>
                    </button>

                    <button 
                        onClick={() => handleModeSelect('DM')}
                        className="group relative bg-gray-800 border-4 border-gray-600 hover:border-white p-8 transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.2)] flex flex-col items-center"
                    >
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">💂</div>
                        <h2 className="text-2xl font-black text-white mb-2">DRUM MAJORS</h2>
                        <p className="text-xs text-gray-400 text-center">Leadership attire. Tall shakos, capes, and maces.</p>
                    </button>

                    <button 
                        onClick={() => handleModeSelect('MAJORETTE')}
                        className="group relative bg-gray-800 border-4 border-gray-600 hover:border-pink-500 p-8 transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(236,72,153,0.2)] flex flex-col items-center"
                    >
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">💃</div>
                        <h2 className="text-2xl font-black text-white mb-2">MAJORETTES</h2>
                        <p className="text-xs text-gray-400 text-center">Dance team performance wear. Sequins, boots, and mobility.</p>
                    </button>

                    <button 
                        onClick={() => handleModeSelect('GUARD')}
                        className="group relative bg-gray-800 border-4 border-gray-600 hover:border-purple-500 p-8 transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(168,85,247,0.2)] flex flex-col items-center"
                    >
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🚩</div>
                        <h2 className="text-2xl font-black text-white mb-2">COLOR GUARD</h2>
                        <p className="text-xs text-gray-400 text-center">Visual ensemble. Tunics, flags, and rifles.</p>
                    </button>
                </div>

                <div className="absolute bottom-8 left-8 z-10">
                    <Button onClick={onBack} variant="secondary" className="px-8 py-4 text-xl">← BACK TO OFFICE</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full bg-slate-900 text-white font-mono">
            {/* Controls */}
            <div className="w-1/3 p-6 border-r border-gray-700 bg-black flex flex-col overflow-y-auto pb-32">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-4">
                    <button onClick={() => setIsLanding(true)} className="text-gray-500 hover:text-white text-xs uppercase font-bold">
                        ← Change Section
                    </button>
                </div>

                <h2 className="text-2xl text-yellow-400 mb-2 border-b border-yellow-400 pb-2">
                    {editorMode === 'BAND' ? 'BAND UNIFORM' : 
                     editorMode === 'DM' ? 'DRUM MAJOR' : 
                     editorMode === 'MAJORETTE' ? 'MAJORETTE' : 'COLOR GUARD'} EDITOR
                </h2>
                
                {/* REMOVED TAB SWITCHER */}

                <div className="flex justify-end mb-4">
                    <button 
                        onClick={() => setIsAdvanced(!isAdvanced)}
                        className={`text-xs px-2 py-1 border ${isAdvanced ? 'bg-yellow-500 text-black border-yellow-500' : 'text-yellow-500 border-yellow-500'}`}
                    >
                        {isAdvanced ? 'HIDE ADVANCED' : 'SHOW ADVANCED'}
                    </button>
                </div>

                {isAdvanced && (
                    <div className="space-y-6 mb-6">
                        <div className="bg-gray-900 p-4 border border-gray-700">
                            <label className="text-yellow-400 text-sm font-bold block mb-2">LAYER SELECT</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['HAT', 'JACKET', 'PANTS', 'CHEST_PLATE'].map(layer => (
                                    <button
                                        key={layer}
                                        onClick={() => setSelectedLayer(layer as any)}
                                        className={`py-2 text-xs font-bold border ${selectedLayer === layer ? 'bg-blue-600 border-white text-white' : 'bg-black border-gray-600 text-gray-400'}`}
                                    >
                                        {layer.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-900 p-4 border border-gray-700 space-y-4">
                            <label className="text-white text-sm font-bold block border-b border-gray-700 pb-1">TRANSFORM: {selectedLayer.replace('_', ' ')}</label>
                            
                            {/* Position */}
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">POSITION (X / Y)</label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] w-4">X</span>
                                        <input 
                                            type="range" 
                                            min="-50" 
                                            max="50" 
                                            value={(activeUniform as any)[selectedLayer === 'HAT' ? 'hatTransform' : selectedLayer === 'JACKET' ? 'jacketTransform' : selectedLayer === 'PANTS' ? 'pantsTransform' : 'chestPlateTransform']?.x || 0}
                                            onChange={(e) => updateTransform(selectedLayer, 'x', parseFloat(e.target.value))}
                                            className="w-full h-1 bg-gray-600 appearance-none rounded-lg cursor-pointer"
                                        />
                                        <span className="text-[10px] w-6 text-right">{(activeUniform as any)[selectedLayer === 'HAT' ? 'hatTransform' : selectedLayer === 'JACKET' ? 'jacketTransform' : selectedLayer === 'PANTS' ? 'pantsTransform' : 'chestPlateTransform']?.x || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] w-4">Y</span>
                                        <input 
                                            type="range" 
                                            min="-50" 
                                            max="50" 
                                            value={(activeUniform as any)[selectedLayer === 'HAT' ? 'hatTransform' : selectedLayer === 'JACKET' ? 'jacketTransform' : selectedLayer === 'PANTS' ? 'pantsTransform' : 'chestPlateTransform']?.y || 0}
                                            onChange={(e) => updateTransform(selectedLayer, 'y', parseFloat(e.target.value))}
                                            className="w-full h-1 bg-gray-600 appearance-none rounded-lg cursor-pointer"
                                        />
                                        <span className="text-[10px] w-6 text-right">{(activeUniform as any)[selectedLayer === 'HAT' ? 'hatTransform' : selectedLayer === 'JACKET' ? 'jacketTransform' : selectedLayer === 'PANTS' ? 'pantsTransform' : 'chestPlateTransform']?.y || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Scale */}
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">SCALE (X / Y)</label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] w-4">X</span>
                                        <input 
                                            type="range" 
                                            min="0.5" 
                                            max="2.0" 
                                            step="0.1"
                                            value={(activeUniform as any)[selectedLayer === 'HAT' ? 'hatTransform' : selectedLayer === 'JACKET' ? 'jacketTransform' : selectedLayer === 'PANTS' ? 'pantsTransform' : 'chestPlateTransform']?.scaleX || 1}
                                            onChange={(e) => updateTransform(selectedLayer, 'scaleX', parseFloat(e.target.value))}
                                            className="w-full h-1 bg-gray-600 appearance-none rounded-lg cursor-pointer"
                                        />
                                        <span className="text-[10px] w-6 text-right">{(activeUniform as any)[selectedLayer === 'HAT' ? 'hatTransform' : selectedLayer === 'JACKET' ? 'jacketTransform' : selectedLayer === 'PANTS' ? 'pantsTransform' : 'chestPlateTransform']?.scaleX || 1}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] w-4">Y</span>
                                        <input 
                                            type="range" 
                                            min="0.5" 
                                            max="2.0" 
                                            step="0.1"
                                            value={(activeUniform as any)[selectedLayer === 'HAT' ? 'hatTransform' : selectedLayer === 'JACKET' ? 'jacketTransform' : selectedLayer === 'PANTS' ? 'pantsTransform' : 'chestPlateTransform']?.scaleY || 1}
                                            onChange={(e) => updateTransform(selectedLayer, 'scaleY', parseFloat(e.target.value))}
                                            className="w-full h-1 bg-gray-600 appearance-none rounded-lg cursor-pointer"
                                        />
                                        <span className="text-[10px] w-6 text-right">{(activeUniform as any)[selectedLayer === 'HAT' ? 'hatTransform' : selectedLayer === 'JACKET' ? 'jacketTransform' : selectedLayer === 'PANTS' ? 'pantsTransform' : 'chestPlateTransform']?.scaleY || 1}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Z-Index */}
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">LAYER ORDER (Z-INDEX)</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        step="1"
                                        value={(activeUniform as any)[selectedLayer === 'HAT' ? 'hatTransform' : selectedLayer === 'JACKET' ? 'jacketTransform' : selectedLayer === 'PANTS' ? 'pantsTransform' : 'chestPlateTransform']?.zIndex || 0}
                                        onChange={(e) => updateTransform(selectedLayer, 'zIndex', parseInt(e.target.value))}
                                        className="w-full h-1 bg-gray-600 appearance-none rounded-lg cursor-pointer"
                                    />
                                    <span className="text-[10px] w-6 text-right">{(activeUniform as any)[selectedLayer === 'HAT' ? 'hatTransform' : selectedLayer === 'JACKET' ? 'jacketTransform' : selectedLayer === 'PANTS' ? 'pantsTransform' : 'chestPlateTransform']?.zIndex || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-6">
                    <label className="text-gray-400 text-xs">SELECT PRESET</label>
                    <select 
                        className="w-full bg-gray-800 border border-gray-600 p-2 mt-1 text-lg"
                        value={activeId}
                        onChange={(e) => {
                            setActiveIds(prev => {
                                if (editorMode === 'BAND') return { ...prev, band: e.target.value };
                                if (editorMode === 'DM') return { ...prev, dm: e.target.value };
                                if (editorMode === 'MAJORETTE') return { ...prev, majorette: e.target.value };
                                return { ...prev, guard: e.target.value };
                            });
                        }}
                    >
                        {uniforms.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                    <div className="flex gap-2 mt-2">
                        <Button onClick={addNewUniform} className="flex-1" variant="secondary">+ CREATE NEW</Button>
                        <Button 
                            onClick={() => {
                                const styles = ['classic', 'sash', 'vest', 'military', 'tracksuit'];
                                const hats = ['shako', 'stetson', 'beret', 'cap'];
                                const mainColor = COLORS[Math.floor(Math.random() * COLORS.length)].hex;
                                const secondaryColor = COLORS[Math.floor(Math.random() * COLORS.length)].hex;
                                const neutrals = ['#ffffff', '#000000', '#333333', '#e5e7eb'];
                                const neutral = neutrals[Math.floor(Math.random() * neutrals.length)];
                                
                                updateUniform({
                                    jacketColor: mainColor,
                                    pantsColor: Math.random() > 0.5 ? mainColor : neutral,
                                    hatColor: mainColor,
                                    plumeColor: secondaryColor,
                                    accentColor: secondaryColor,
                                    jacketStyle: styles[Math.floor(Math.random() * styles.length)] as any,
                                    hatStyle: hats[Math.floor(Math.random() * hats.length)] as any,
                                    hasGauntlets: Math.random() > 0.5,
                                    hasCape: Math.random() > 0.8,
                                    hasSpats: Math.random() > 0.5
                                });
                            }} 
                            className="flex-1 bg-purple-600 hover:bg-purple-500 border-purple-400"
                        >
                            🎲 RANDOMIZE
                        </Button>
                    </div>
                </div>

                <div className="space-y-6 flex-grow">
                    
                    {/* Accessories Toggle */}
                    <div className="bg-gray-900 p-3 border border-gray-700 space-y-2">
                        <label className="text-gray-400 text-xs uppercase font-bold">Accessories</label>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Gauntlets</span>
                            <input type="checkbox" checked={!!activeUniform.hasGauntlets} onChange={(e) => updateUniform({ hasGauntlets: e.target.checked })} className="accent-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Spats (Shoes)</span>
                            <input type="checkbox" checked={!!activeUniform.hasSpats} onChange={(e) => updateUniform({ hasSpats: e.target.checked })} className="accent-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Shoulder Cords</span>
                            <div className="flex items-center gap-2">
                                {activeUniform.hasShoulderCords && (
                                    <input type="color" value={activeUniform.shoulderCordColor || '#FFD700'} onChange={(e) => updateUniform({ shoulderCordColor: e.target.value })} className="w-6 h-6 p-0 border-0" />
                                )}
                                <input type="checkbox" checked={!!activeUniform.hasShoulderCords} onChange={(e) => updateUniform({ hasShoulderCords: e.target.checked })} className="accent-green-500" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-700 pt-2">
                            <span className="text-sm">Chest Plate</span>
                            <input type="checkbox" checked={!!activeUniform.chestPlate} onChange={(e) => updateUniform({ chestPlate: e.target.checked })} className="accent-yellow-500" />
                        </div>
                    </div>

                    {/* Cape Selector */}
                    <div>
                        <label className="text-gray-400 text-xs uppercase font-bold">CAPE STYLE</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {['none', 'short', 'long', 'side'].map(style => (
                                <button
                                    key={style}
                                    className={`py-2 border text-xs uppercase font-bold ${activeUniform.capeStyle === style || (!activeUniform.capeStyle && style === 'none') ? 'bg-purple-600 border-white text-white' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                                    onClick={() => updateUniform({ capeStyle: style as any, hasCape: style !== 'none' })}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Back Design Selector */}
                    <div>
                        <label className="text-gray-400 text-xs uppercase font-bold">BACK DESIGN</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {['none', 'stripes', 'chevron', 'diamond', 'star'].map(style => (
                                <button
                                    key={style}
                                    className={`py-2 border text-xs uppercase font-bold ${activeUniform.backDesign === style || (!activeUniform.backDesign && style === 'none') ? 'bg-orange-600 border-white text-white' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                                    onClick={() => updateUniform({ backDesign: style })}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Decals & Text */}
                    <div className="bg-gray-900 p-3 border border-gray-700 space-y-2">
                        <label className="text-gray-400 text-xs uppercase font-bold">Decals & Text</label>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Enable Logo</span>
                            <input type="checkbox" checked={!!logoPlacement.enabled} onChange={(e) => updateLogo({ enabled: e.target.checked })} className="accent-purple-500" />
                        </div>
                        {logoPlacement.enabled && (
                            <div className="flex gap-1 mt-1">
                                {['NONE', 'SCHOOL', 'BAND', 'CUSTOM'].map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => updateLogo({ logoType: type as any })}
                                        className={`flex-1 py-1 text-[9px] font-bold border ${logoPlacement.logoType === type ? 'bg-purple-600 text-white border-white' : 'bg-gray-800 text-gray-500 border-gray-600'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                        {(logoPlacement.enabled || logoPlacement.customText) && (
                                <select 
                                    className="w-full bg-black border border-gray-600 text-xs p-1 mt-1"
                                    value={logoPlacement.position}
                                    onChange={(e) => updateLogo({ position: e.target.value as any })}
                                >
                                    <option value="CHEST_LEFT">Chest Left</option>
                                    <option value="CHEST_CENTER">Chest Center</option>
                                    <option value="BACK">Back</option>
                                    <option value="CAPE">Cape</option>
                                    <option value="CHESTPLATE">Chestplate</option>
                                </select>
                        )}
                        {logoPlacement.enabled && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <label className="text-[9px] text-gray-500 block">Logo X</label>
                                    <input type="range" min="-50" max="50" value={logoPlacement.logoXOffset || 0} onChange={(e) => updateLogo({ logoXOffset: parseInt(e.target.value) })} className="w-full h-1 bg-gray-600" />
                                </div>
                                <div>
                                    <label className="text-[9px] text-gray-500 block">Logo Y</label>
                                    <input type="range" min="-50" max="50" value={logoPlacement.logoYOffset || 0} onChange={(e) => updateLogo({ logoYOffset: parseInt(e.target.value) })} className="w-full h-1 bg-gray-600" />
                                </div>
                                <div>
                                    <label className="text-[9px] text-gray-500 block">Logo X Scale</label>
                                    <input type="range" min="0.1" max="2.0" step="0.1" value={logoPlacement.logoXScale || 1} onChange={(e) => updateLogo({ logoXScale: parseFloat(e.target.value) })} className="w-full h-1 bg-gray-600" />
                                </div>
                                <div>
                                    <label className="text-[9px] text-gray-500 block">Logo Y Scale</label>
                                    <input type="range" min="0.1" max="2.0" step="0.1" value={logoPlacement.logoYScale || 1} onChange={(e) => updateLogo({ logoYScale: parseFloat(e.target.value) })} className="w-full h-1 bg-gray-600" />
                                </div>
                            </div>
                        )}
                        {logoPlacement.customText && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <label className="text-[9px] text-gray-500 block">Text X</label>
                                    <input type="range" min="-50" max="50" value={logoPlacement.textXOffset || 0} onChange={(e) => updateLogo({ textXOffset: parseInt(e.target.value) })} className="w-full h-1 bg-gray-600" />
                                </div>
                                <div>
                                    <label className="text-[9px] text-gray-500 block">Text Y</label>
                                    <input type="range" min="-50" max="50" value={logoPlacement.textYOffset || 0} onChange={(e) => updateLogo({ textYOffset: parseInt(e.target.value) })} className="w-full h-1 bg-gray-600" />
                                </div>
                                <div>
                                    <label className="text-[9px] text-gray-500 block">Text Scale</label>
                                    <input type="range" min="0.1" max="2.0" step="0.1" value={logoPlacement.textScale || 1} onChange={(e) => updateLogo({ textScale: parseFloat(e.target.value) })} className="w-full h-1 bg-gray-600" />
                                </div>
                            </div>
                        )}
                        <input 
                            type="text" 
                            placeholder="Add text (e.g. BAND)" 
                            className="w-full bg-black border border-gray-600 text-xs p-1 text-white"
                            value={logoPlacement.customText || ''}
                            onChange={(e) => updateLogo({ customText: e.target.value })}
                        />
                        <select
                            className="w-full bg-black border border-gray-600 text-xs p-1 mt-1"
                            value={logoPlacement.font || ''}
                            onChange={(e) => updateLogo({ font: e.target.value })}
                        >
                            <option value="">Default Font</option>
                            <option value="'Press Start 2P', cursive">Pixel Bold</option>
                            <option value="'VT323', monospace">Retro Mono</option>
                            <option value="impact, sans-serif">Collegiate Block</option>
                            <option value="serif">Classic Serif</option>
                            <option value="cursive">Script</option>
                        </select>
                        <div className="mt-1">
                            <label className="text-[9px] text-gray-500 block">Text Color</label>
                            <input 
                                type="color" 
                                value={logoPlacement.fontColor || '#ffffff'} 
                                onChange={(e) => updateLogo({ fontColor: e.target.value })} 
                                className="w-full h-6 p-0 border border-gray-600 bg-black cursor-pointer" 
                            />
                        </div>
                        <select
                            className="w-full bg-black border border-gray-600 text-xs p-1 mt-1"
                            value={logoPlacement.textOrientation || 'HORIZONTAL'}
                            onChange={(e) => updateLogo({ textOrientation: e.target.value as any })}
                        >
                            <option value="HORIZONTAL">Horizontal</option>
                            <option value="VERTICAL">Vertical</option>
                            <option value="DIAGONAL">Diagonal</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-gray-400 text-xs">JACKET STYLE</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                             {(() => {
                                const baseJackets = [
                                    { id: 'classic', name: 'Show Style' },
                                    { id: 'hbcu_heritage', name: 'Heritage' },
                                    { id: 'varsity', name: 'Varsity' },
                                    { id: 'windbreaker', name: 'Warmup' },
                                    { id: 'sash', name: 'Royal Sash' },
                                    { id: 'vest', name: 'Summer Vest' },
                                    { id: 'military', name: 'Corps Style' },
                                    { id: 'tracksuit', name: 'Track Suit' },
                                    { id: 'tshirt', name: 'Section Tee' },
                                    { id: 'suit', name: 'Formal Suit' },
                                    { id: 'tuxedo', name: 'Tuxedo' },
                                    { id: 'blazer', name: 'Blazer' },
                                    { id: 'sweater', name: 'Sweater' },
                                ];
                                const majoretteJackets = [
                                    { id: 'bodysuit', name: 'Body Suit' },
                                    { id: 'bodysuit_no_sleeves', name: 'Body Suit (No Sleeves)' },
                                    { id: 'tunic', name: 'Tunic' },
                                    { id: 'unitard', name: 'Unitard' },
                                    { id: 'dress', name: 'Dress' },
                                    { id: 'crop_top', name: 'Crop Top' },
                                    { id: 'tank_top', name: 'Tank Top' },
                                ];
                                const guardJackets = [
                                    { id: 'tunic', name: 'Tunic' },
                                    { id: 'unitard', name: 'Unitard' },
                                    { id: 'dress', name: 'Dress' },
                                    { id: 'tank_top', name: 'Tank Top' },
                                    { id: 'crop_top', name: 'Crop Top' },
                                    { id: 'tshirt', name: 'Section Tee' },
                                ];
                                
                                let options = baseJackets;
                                if (editorMode === 'MAJORETTE') options = majoretteJackets;
                                if (editorMode === 'GUARD') options = guardJackets;
                                
                                const customOptions = customAssets?.filter(a => a.type === 'JACKET').map(a => ({ id: a.id, name: a.name })) || [];
                                return [...options, ...customOptions].map(style => (
                                 <button 
                                    key={style.id}
                                    className={`py-2 border text-xs uppercase ${activeUniform.jacketStyle === style.id ? 'bg-green-600 border-white' : 'bg-transparent border-gray-600'}`}
                                    onClick={() => updateUniform({ jacketStyle: style.id as any })}
                                 >
                                     {style.name}
                                 </button>
                             ));
                             })()}
                        </div>
                        <div className="mt-2">
                            <label className="text-[10px] text-gray-500">VARIANT</label>
                            <input 
                                type="range" 
                                min="0" 
                                max="2" 
                                step="1"
                                value={activeUniform.jacketVariant || 0}
                                onChange={(e) => updateUniform({ jacketVariant: parseInt(e.target.value) })}
                                className="w-full h-1 bg-gray-600 appearance-none rounded-lg cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-gray-500">
                                <span>A</span>
                                <span>B</span>
                                <span>C</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-400 text-xs">PANTS STYLE</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                             {(() => {
                                const basePants = ['regular', 'bibbers', 'slacks', 'jeans', 'kilt', 'sweatpants', 'shorts'];
                                const majorettePants = ['leggings', 'leggings_transparent', 'skirt', 'shorts'];
                                const guardPants = ['leggings', 'skirt', 'shorts', 'sweatpants'];
                                
                                let options = basePants;
                                if (editorMode === 'MAJORETTE') options = majorettePants;
                                if (editorMode === 'GUARD') options = guardPants;
                                
                                const customOptions = customAssets?.filter(a => a.type === 'PANTS').map(a => a.id) || [];
                                return [...options, ...customOptions].map(style => (
                                 <button 
                                    key={style}
                                    className={`py-2 border text-xs uppercase ${activeUniform.pantsStyle === style ? 'bg-green-600 border-white' : 'bg-transparent border-gray-600'}`}
                                    onClick={() => updateUniform({ pantsStyle: style as any })}
                                 >
                                     {style.replace('_', ' ')}
                                 </button>
                             ));
                             })()}
                        </div>
                        <div className="mt-2">
                            <label className="text-[10px] text-gray-500">VARIANT</label>
                            <input 
                                type="range" 
                                min="0" 
                                max="2" 
                                step="1"
                                value={activeUniform.pantsVariant || 0}
                                onChange={(e) => updateUniform({ pantsVariant: parseInt(e.target.value) })}
                                className="w-full h-1 bg-gray-600 appearance-none rounded-lg cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-gray-500">
                                <span>A</span>
                                <span>B</span>
                                <span>C</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-400 text-xs">HEADWEAR STYLE</label>
                         <div className="grid grid-cols-2 gap-2 mt-2">
                             {(() => {
                                const baseHats = ['shako', 'stetson', 'beret', 'cap', 'bowler', 'fedora', 'trilby', 'none'];
                                const dmHats = ['shako', 'tall_shako', 'bearskin', 'stetson', 'beret', 'cap', 'bowler', 'fedora', 'trilby', 'none'];
                                const auxHats = ['none', 'beret', 'cap', 'fedora'];
                                
                                let options = baseHats;
                                if (editorMode === 'DM') options = dmHats;
                                if (editorMode === 'MAJORETTE' || editorMode === 'GUARD') options = auxHats;
                                
                                const customOptions = customAssets?.filter(a => a.type === 'HAT').map(a => a.id) || [];
                                return [...options, ...customOptions].map(style => (
                                 <button 
                                    key={style}
                                    className={`py-2 border text-xs uppercase ${activeUniform.hatStyle === style ? 'bg-blue-600 border-white' : 'bg-transparent border-gray-600'}`}
                                    onClick={() => updateUniform({ hatStyle: style as any })}
                                 >
                                     {style.replace('_', ' ')}
                                 </button>
                             ));
                             })()}
                        </div>
                        <div className="mt-2">
                            <label className="text-[10px] text-gray-500">VARIANT</label>
                            <input 
                                type="range" 
                                min="0" 
                                max="2" 
                                step="1"
                                value={activeUniform.hatVariant || 0}
                                onChange={(e) => updateUniform({ hatVariant: parseInt(e.target.value) })}
                                className="w-full h-1 bg-gray-600 appearance-none rounded-lg cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-gray-500">
                                <span>A</span>
                                <span>B</span>
                                <span>C</span>
                            </div>
                        </div>
                    </div>

                    {/* Color Pickers */}
                    {['jacketColor', 'pantsColor', 'hatColor', 'plumeColor', 'accentColor', 'capeColor', 'chestPlateColor', 'tieColor', 'shoeColor', 'gloveColor'].map(key => {
                        if (key === 'capeColor' && (!activeUniform.capeStyle || activeUniform.capeStyle === 'none')) return null;
                        if (key === 'chestPlateColor' && !activeUniform.chestPlate) return null;
                        if (key === 'tieColor' && activeUniform.jacketStyle !== 'suit') return null;
                        return (
                            <div key={key}>
                                <label className="text-gray-400 text-xs uppercase">
                                    {key === 'accentColor' ? 'Secondary Color' : key === 'tieColor' ? 'Tie Color' : key.replace('Color', '')}
                                </label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {COLORS.map(c => (
                                        <button 
                                            key={c.name}
                                            className={`w-8 h-8 border-2 ${activeUniform[key as keyof Uniform] === c.hex ? 'border-white scale-110 shadow' : 'border-transparent'}`}
                                            style={{ backgroundColor: c.hex }}
                                            onClick={() => updateUniform({ [key]: c.hex })}
                                            title={c.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Preview (Locker Room) */}
            <div 
                className="flex-grow flex flex-col items-center justify-end pb-48 bg-[#b0b0b0] relative overflow-hidden border-l-4 border-black cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Locker Room Background */}
                <div className="absolute inset-0 z-0 bg-[#8c8c8c] pointer-events-none">
                    {/* Lockers */}
                    <div className="absolute top-10 left-0 w-full h-[70%] flex justify-center gap-1">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-16 h-full bg-[#555] border-2 border-[#333] relative">
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-2 bg-[#222]"></div> {/* Vents */}
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-2 bg-[#222]"></div>
                                <div className="absolute top-1/2 right-2 w-1 h-4 bg-gray-400"></div> {/* Handle */}
                            </div>
                        ))}
                    </div>
                    {/* Bench */}
                    <div className="absolute bottom-32 w-[80%] left-[10%] h-8 bg-[#8b4513] border-b-4 border-[#5d2e0c] shadow-lg"></div>
                    <div className="absolute bottom-20 left-[20%] w-4 h-12 bg-[#333]"></div>
                    <div className="absolute bottom-20 right-[20%] w-4 h-12 bg-[#333]"></div>
                </div>

                <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none"></div>

                <h3 className="text-3xl font-black text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] uppercase absolute top-10 z-20 bg-black/50 px-4 py-2 border-2 border-white pointer-events-none">{activeUniform.name}</h3>
                
                <div 
                    className="relative z-10 flex gap-8 transform"
                    style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
                >
                    <BandMemberVisual 
                        instrument={
                            editorMode === 'DM' ? InstrumentType.MACE :
                            editorMode === 'MAJORETTE' ? InstrumentType.MAJORETTE :
                            editorMode === 'GUARD' ? InstrumentType.GUARD :
                            InstrumentType.SNARE
                        }
                        uniform={activeUniform}
                        appearance={{ skinColor: '#8d5524', hairColor: '#000000', hairStyle: 1, bodyType: 'average', accessoryId: 0 }}
                        scale={2.0}
                        showInstrument={editorMode !== 'BAND'} // Show instrument for DM/Majorette/Guard to see it better
                        logoGrid={identity?.bandLogo}
                        logoText={identity?.bandLogoText}
                        bandIdentity={identity}
                        view={view}
                        noBounce={true}
                    />
                </div>

                <div className="absolute bottom-32 flex gap-4 z-20">
                    <Button onClick={() => setView('FRONT')} className={view === 'FRONT' ? 'bg-blue-600' : 'bg-gray-600'} >FRONT</Button>
                    <Button onClick={() => setView('BACK')} className={view === 'BACK' ? 'bg-blue-600' : 'bg-gray-600'} >BACK</Button>
                </div>
                
                <div className="absolute top-8 right-8 flex gap-4 z-50 items-center">
                    {isCostEnabled && (
                        <div className="bg-black/80 border-2 border-white p-2 text-right mr-4">
                            <div className="text-xs text-gray-400 font-bold">ESTIMATED COST</div>
                            <div className={`text-2xl font-black ${canAfford ? 'text-green-400' : 'text-red-500'}`}>
                                {hasEquipManager && <span className="text-sm line-through text-gray-500 mr-2">${Math.floor(currentCost / 0.8).toLocaleString()}</span>}
                                ${currentCost.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-gray-500">BUDGET: ${budget.toLocaleString()}</div>
                        </div>
                    )}
                    <Button onClick={onBack} variant="secondary" className="px-6 py-4">CANCEL</Button>
                    <Button 
                        onClick={handleSave} 
                        variant={canAfford ? "success" : "danger"} 
                        className={`px-6 py-4 text-lg ${!canAfford ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {canAfford ? 'SAVE & PURCHASE ALL' : 'INSUFFICIENT FUNDS'}
                    </Button>
                </div>

                {showError && (
                    <div className="absolute top-32 right-8 bg-red-600 text-white font-bold px-6 py-4 border-4 border-black shadow-[4px_4px_0_0_#000] z-50 animate-bounce">
                        NOT ENOUGH BUDGET TO PURCHASE THIS UNIFORM SET!
                    </div>
                )}
            </div>
        </div>
    );
};
