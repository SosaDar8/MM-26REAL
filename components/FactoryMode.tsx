import React, { useState, useRef, useEffect } from 'react';
import { CustomAsset, Uniform, InstrumentType } from '../types';
import { Button } from './Button';
import { BandMemberVisual } from './BandMemberVisual';
import { COLORS } from '../constants';

// --- Factory Parts Library ---
const FACTORY_PARTS = {
    HAT: [
        { id: 'shako_base', name: 'Shako Base', path: 'M20,60 L80,60 L85,20 L15,20 Z' },
        { id: 'shako_brim', name: 'Brim (Curved)', path: 'M15,60 Q50,75 85,60 L85,65 Q50,80 15,65 Z' },
        { id: 'plume_tall', name: 'Plume (Tall)', path: 'M50,20 Q60,10 50,-20 Q40,10 50,20' },
        { id: 'fedora_base', name: 'Fedora Crown', path: 'M30,50 L70,50 L70,20 Q50,10 30,20 Z' },
        { id: 'fedora_brim', name: 'Fedora Brim', path: 'M10,50 L90,50 L90,55 L10,55 Z' },
        { id: 'beanie_base', name: 'Beanie', path: 'M20,60 Q20,10 50,10 Q80,10 80,60 Z' },
        { id: 'cap_bill', name: 'Cap Bill', path: 'M20,55 L80,55 L80,65 Q50,75 20,65 Z' },
        { id: 'helmet_base', name: 'Helmet', path: 'M20,60 Q20,10 50,10 Q80,10 80,60 L80,70 L20,70 Z' },
        { id: 'square_hat', name: 'Square Hat', path: 'M20,60 L20,20 L80,20 L80,60 Z' },
    ],
    JACKET: [
        { id: 'torso_base', name: 'Torso (Fitted)', path: 'M30,20 L70,20 L75,80 L25,80 Z' },
        { id: 'torso_box', name: 'Torso (Boxy)', path: 'M25,20 L75,20 L75,80 L25,80 Z' },
        { id: 'sleeve_l', name: 'Sleeve (L)', path: 'M25,20 L5,30 L10,70 L30,25 Z' },
        { id: 'sleeve_r', name: 'Sleeve (R)', path: 'M75,20 L95,30 L90,70 L70,25 Z' },
        { id: 'collar_v', name: 'Collar (V)', path: 'M30,20 L50,40 L70,20' },
        { id: 'buttons', name: 'Buttons', path: 'M50,30 L50,70', stroke: true },
        { id: 'sash', name: 'Sash', path: 'M30,20 L75,80 L65,80 L25,25 Z' },
        { id: 'epaulet_l', name: 'Epaulet (L)', path: 'M25,20 L5,20 L5,25 L25,25 Z' },
        { id: 'epaulet_r', name: 'Epaulet (R)', path: 'M75,20 L95,20 L95,25 L75,25 Z' },
    ],
    PANTS: [
        { id: 'leg_l', name: 'Leg (L)', path: 'M30,20 L48,20 L45,90 L35,90 Z' },
        { id: 'leg_r', name: 'Leg (R)', path: 'M52,20 L70,20 L65,90 L55,90 Z' },
        { id: 'shorts_l', name: 'Shorts (L)', path: 'M30,20 L48,20 L48,50 L30,50 Z' },
        { id: 'shorts_r', name: 'Shorts (R)', path: 'M52,20 L70,20 L70,50 L52,50 Z' },
        { id: 'stripe_side', name: 'Side Stripe', path: 'M30,20 L35,20 L35,90 L30,90 Z' },
        { id: 'belt', name: 'Belt', path: 'M30,20 L70,20 L70,25 L30,25 Z' },
    ],
    ACCESSORY: [
        { id: 'glasses_round', name: 'Glasses (Round)', path: 'M30,40 A10,10 0 1,0 50,40 M50,40 L70,40 M70,40 A10,10 0 1,0 90,40', stroke: true },
        { id: 'shades', name: 'Shades', path: 'M30,40 L50,40 L50,50 L35,50 Z M70,40 L90,40 L85,50 L70,50 Z M50,42 L70,42' },
        { id: 'scarf', name: 'Scarf', path: 'M30,60 Q50,70 70,60 L70,70 Q50,80 30,70 Z' },
        { id: 'medal', name: 'Medal', path: 'M50,60 L45,50 L55,50 Z M50,60 A5,5 0 1,0 50,70 A5,5 0 1,0 50,60' },
        { id: 'chain', name: 'Chain', path: 'M30,60 Q50,90 70,60', stroke: true },
    ],
    SHAPES: [
        { id: 'circle', name: 'Circle', path: 'M50,50 m-25,0 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0' },
        { id: 'square', name: 'Square', path: 'M25,25 L75,25 L75,75 L25,75 Z' },
        { id: 'triangle', name: 'Triangle', path: 'M50,20 L80,80 L20,80 Z' },
        { id: 'star', name: 'Star', path: 'M50,15 L60,40 L85,40 L65,55 L75,80 L50,65 L25,80 L35,55 L15,40 L40,40 Z' },
        { id: 'line', name: 'Line', path: 'M20,50 L80,50', stroke: true },
        { id: 'curve', name: 'Curve', path: 'M20,50 Q50,20 80,50', stroke: true },
    ]
};

interface FactoryPart {
    id: string;
    partId: string;
    x: number;
    y: number;
    scale: number;
    rotation: number;
    color: string;
    zIndex: number;
}

interface FactoryModeProps {
    onSave: (asset: CustomAsset) => void;
    onClose: () => void;
}

export const FactoryMode: React.FC<FactoryModeProps> = ({ onSave, onClose }) => {
    const [activeType, setActiveType] = useState<CustomAsset['type']>('HAT');
    const [parts, setParts] = useState<FactoryPart[]>([]);
    const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
    const [assetName, setAssetName] = useState('My Custom Item');
    const [previewRotation, setPreviewRotation] = useState(0);

    // Factory Animation State
    const [conveyorOffset, setConveyorOffset] = useState(0);

    // Mannequin Drag State
    const [isDraggingMannequin, setIsDraggingMannequin] = useState(false);
    const [mannequinRotation, setMannequinRotation] = useState(0);
    const [mannequinPosition, setMannequinPosition] = useState({ x: 0, y: 0 });
    const lastMousePos = useRef({ x: 0, y: 0 });

    // Part Drag State
    const [isDraggingPart, setIsDraggingPart] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const partStartPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingMannequin) {
                const deltaX = e.clientX - lastMousePos.current.x;
                const deltaY = e.clientY - lastMousePos.current.y;
                
                if (e.shiftKey) {
                    // Pan
                    setMannequinPosition(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
                } else {
                    // Rotate
                    setMannequinRotation(prev => (prev + deltaX) % 360);
                }
                lastMousePos.current = { x: e.clientX, y: e.clientY };
            }

            if (isDraggingPart && selectedPartId) {
                const deltaX = e.clientX - dragStartPos.current.x;
                const deltaY = e.clientY - dragStartPos.current.y;
                
                // Convert screen pixels to SVG coordinates (approximate based on 400px container = 100 units)
                const svgDeltaX = deltaX / 4; 
                const svgDeltaY = deltaY / 4;

                updatePart(selectedPartId, {
                    x: partStartPos.current.x + svgDeltaX,
                    y: partStartPos.current.y + svgDeltaY
                });
            }
        };

        const handleMouseUp = () => {
            setIsDraggingMannequin(false);
            setIsDraggingPart(false);
        };

        if (isDraggingMannequin || isDraggingPart) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingMannequin, isDraggingPart, selectedPartId]);

    useEffect(() => {
        const interval = setInterval(() => {
            setConveyorOffset(prev => (prev + 1) % 20);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const handleAddPart = (partDefId: string) => {
        const partDef = FACTORY_PARTS[activeType].find(p => p.id === partDefId);
        if (!partDef) return;

        const newPart: FactoryPart = {
            id: `part_${Date.now()}`,
            partId: partDefId,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            color: '#ffffff',
            zIndex: parts.length
        };
        setParts([...parts, newPart]);
        setSelectedPartId(newPart.id);
    };

    const updatePart = (id: string, updates: Partial<FactoryPart>) => {
        setParts(parts.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const removePart = (id: string) => {
        setParts(parts.filter(p => p.id !== id));
        if (selectedPartId === id) setSelectedPartId(null);
    };

    const generateSVG = () => {
        // Generate the final SVG string from parts
        let svgContent = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">`;
        
        // Sort by zIndex
        const sortedParts = [...parts].sort((a, b) => a.zIndex - b.zIndex);

        sortedParts.forEach(part => {
            const def = FACTORY_PARTS[activeType].find(p => p.id === part.partId);
            if (!def) return;

            const transform = `translate(${part.x} ${part.y}) scale(${part.scale}) rotate(${part.rotation} 50 50)`;
            const style = def.stroke 
                ? `fill="none" stroke="${part.color}" stroke-width="2"` 
                : `fill="${part.color}"`;

            svgContent += `<g transform="${transform}"><path d="${def.path}" ${style} /></g>`;
        });

        svgContent += `</svg>`;
        return svgContent;
    };

    const handleSave = () => {
        if (!assetName) return;
        const svg = generateSVG();
        const newAsset: CustomAsset = {
            id: `custom_${activeType.toLowerCase()}_${Date.now()}`,
            type: activeType,
            name: assetName,
            svgContent: svg
        };
        onSave(newAsset);
    };

    // Preview Uniform
    const previewAssetId = 'preview_asset';
    
    const previewUniform: Uniform = {
        id: 'preview',
        name: 'Preview',
        jacketColor: '#333',
        pantsColor: '#333',
        hatColor: '#333',
        plumeColor: '#fff',
        hatStyle: (activeType === 'HAT' ? previewAssetId : 'none') as any,
        jacketStyle: (activeType === 'JACKET' ? previewAssetId : 'tshirt') as any,
        pantsStyle: (activeType === 'PANTS' ? previewAssetId : 'regular') as any,
        // For accessories, we need to handle them via appearance or uniform if supported
    };

    const previewAsset: CustomAsset = {
        id: previewAssetId,
        type: activeType,
        name: 'Preview Asset',
        svgContent: generateSVG()
    };

    const selectedPart = parts.find(p => p.id === selectedPartId);

    return (
        <div className="fixed inset-0 z-[10000] bg-zinc-900 text-white font-mono flex flex-col">
            {/* Header */}
            <div className="h-16 bg-zinc-950 border-b border-yellow-600 flex justify-between items-center px-6 shadow-lg z-20">
                <div className="flex items-center gap-4">
                    <span className="text-3xl">🏭</span>
                    <div>
                        <h1 className="text-xl font-black text-yellow-500 uppercase tracking-widest">The Factory</h1>
                        <p className="text-[10px] text-gray-500">CUSTOM ASSET FABRICATION UNIT</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <input 
                        type="text" 
                        value={assetName}
                        onChange={(e) => setAssetName(e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 p-2 text-sm text-white focus:border-yellow-500 outline-none w-64"
                        placeholder="ITEM NAME"
                    />
                    <Button onClick={onClose} variant="secondary">CANCEL</Button>
                    <Button onClick={handleSave} className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold">FABRICATE & SAVE</Button>
                </div>
            </div>

            <div className="flex-grow flex overflow-hidden">
                {/* Left: Parts Bin */}
                <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col z-10">
                    <div className="p-4 border-b border-zinc-800">
                        <label className="text-xs font-bold text-gray-500 mb-2 block">ITEM TYPE</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['HAT', 'JACKET', 'PANTS', 'ACCESSORY', 'SHAPES'] as const).map(type => (
                                <button
                                    key={type}
                                    onClick={() => { setActiveType(type); setParts([]); }}
                                    className={`p-2 text-[10px] font-bold border ${activeType === type ? 'bg-yellow-600 text-black border-yellow-600' : 'bg-zinc-950 border-zinc-700 text-gray-400'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4">
                        <label className="text-xs font-bold text-gray-500 mb-2 block">AVAILABLE PARTS</label>
                        <div className="grid grid-cols-2 gap-2">
                            {FACTORY_PARTS[activeType].map(part => (
                                <button
                                    key={part.id}
                                    onClick={() => handleAddPart(part.id)}
                                    className="aspect-square bg-zinc-950 border border-zinc-700 hover:border-yellow-500 p-2 flex flex-col items-center justify-center gap-2 group"
                                >
                                    <svg viewBox="0 0 100 100" className="w-12 h-12 text-gray-400 group-hover:text-yellow-500">
                                        <path d={part.path} fill={part.stroke ? 'none' : 'currentColor'} stroke={part.stroke ? 'currentColor' : 'none'} strokeWidth={part.stroke ? 2 : 0} />
                                    </svg>
                                    <span className="text-[8px] text-gray-500 text-center leading-tight">{part.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center: Assembly Area */}
                <div className="flex-grow bg-[#1a1a1a] relative flex flex-col">
                    {/* Blueprint Grid Background */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" 
                        style={{ 
                            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    ></div>

                    {/* Canvas */}
                    <div className="flex-grow flex items-center justify-center relative">
                        <div className="w-[400px] h-[400px] border-2 border-dashed border-zinc-700 relative bg-zinc-900/50">
                            <span className="absolute top-2 left-2 text-[10px] text-zinc-600">CANVAS (100x100)</span>
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                {parts.sort((a, b) => a.zIndex - b.zIndex).map(part => {
                                    const def = FACTORY_PARTS[activeType].find(p => p.id === part.partId);
                                    if (!def) return null;
                                    const isSelected = selectedPartId === part.id;
                                    return (
                                        <g 
                                            key={part.id} 
                                            transform={`translate(${part.x} ${part.y}) scale(${part.scale}) rotate(${part.rotation} 50 50)`}
                                            onMouseDown={(e) => { 
                                                e.stopPropagation(); 
                                                setSelectedPartId(part.id); 
                                                setIsDraggingPart(true);
                                                dragStartPos.current = { x: e.clientX, y: e.clientY };
                                                partStartPos.current = { x: part.x, y: part.y };
                                            }}
                                            className="cursor-pointer hover:opacity-80"
                                        >
                                            <path 
                                                d={def.path} 
                                                fill={def.stroke ? 'none' : part.color} 
                                                stroke={isSelected ? '#eab308' : (def.stroke ? part.color : 'none')} 
                                                strokeWidth={isSelected ? 1 : (def.stroke ? 2 : 0)}
                                                vectorEffect="non-scaling-stroke"
                                            />
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>

                    {/* Bottom: Part Controls */}
                    <div className="h-48 bg-zinc-900 border-t border-zinc-800 p-4 flex gap-8">
                        {selectedPart ? (
                            <>
                                <div className="w-48">
                                    <label className="text-xs font-bold text-yellow-500 mb-2 block">SELECTED PART</label>
                                    <div className="text-sm text-white mb-2">{FACTORY_PARTS[activeType].find(p => p.id === selectedPart.partId)?.name}</div>
                                    <button onClick={() => removePart(selectedPart.id)} className="text-xs text-red-500 hover:text-red-400 font-bold border border-red-900 bg-red-900/20 px-2 py-1">DELETE PART</button>
                                </div>
                                <div className="flex-grow grid grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-[10px] text-gray-500 block mb-1">POSITION X</label>
                                        <input type="range" min="-50" max="50" value={selectedPart.x} onChange={e => updatePart(selectedPart.id, { x: Number(e.target.value) })} className="w-full h-1 bg-zinc-700" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-500 block mb-1">POSITION Y</label>
                                        <input type="range" min="-50" max="50" value={selectedPart.y} onChange={e => updatePart(selectedPart.id, { y: Number(e.target.value) })} className="w-full h-1 bg-zinc-700" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-500 block mb-1">SCALE</label>
                                        <input type="range" min="0.1" max="3" step="0.1" value={selectedPart.scale} onChange={e => updatePart(selectedPart.id, { scale: Number(e.target.value) })} className="w-full h-1 bg-zinc-700" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-500 block mb-1">ROTATION</label>
                                        <input type="range" min="0" max="360" value={selectedPart.rotation} onChange={e => updatePart(selectedPart.id, { rotation: Number(e.target.value) })} className="w-full h-1 bg-zinc-700" />
                                    </div>
                                    <div className="col-span-4">
                                        <label className="text-[10px] text-gray-500 block mb-1">COLOR</label>
                                        <div className="flex flex-wrap gap-1">
                                            {COLORS.map(c => (
                                                <button 
                                                    key={c.name} 
                                                    onClick={() => updatePart(selectedPart.id, { color: c.hex })}
                                                    className={`w-6 h-6 border ${selectedPart.color === c.hex ? 'border-white scale-110' : 'border-transparent'}`}
                                                    style={{ backgroundColor: c.hex }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-24 flex flex-col justify-center gap-2">
                                    <button onClick={() => updatePart(selectedPart.id, { zIndex: selectedPart.zIndex + 1 })} className="bg-zinc-800 text-xs py-1 hover:bg-zinc-700">Bring Fwd</button>
                                    <button onClick={() => updatePart(selectedPart.id, { zIndex: selectedPart.zIndex - 1 })} className="bg-zinc-800 text-xs py-1 hover:bg-zinc-700">Send Back</button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center w-full text-zinc-600 text-sm italic">
                                Select a part on the canvas to edit its properties
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="w-80 bg-zinc-950 border-l border-zinc-800 flex flex-col relative">
                    <div className="p-4 border-b border-zinc-800">
                        <h3 className="text-xs font-bold text-gray-500">LIVE PREVIEW</h3>
                    </div>
                    
                    {/* Factory Background for Preview */}
                    <div 
                        className="flex-grow relative overflow-hidden flex items-center justify-center bg-[#222] cursor-grab active:cursor-grabbing"
                        onMouseDown={(e) => {
                            setIsDraggingMannequin(true);
                            lastMousePos.current = { x: e.clientX, y: e.clientY };
                        }}
                    >
                        {/* Animated Conveyor Belt Background */}
                        <div className="absolute inset-0 opacity-30 pointer-events-none">
                            <div className="absolute bottom-0 w-full h-12 bg-zinc-800" 
                                style={{ 
                                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, #000 10px, #000 12px)',
                                    backgroundPosition: `${conveyorOffset}px 0`
                                }}
                            ></div>
                            <div className="absolute top-0 w-full h-full" 
                                style={{ 
                                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.8), transparent)',
                                }}
                            ></div>
                        </div>

                        {/* Mannequin / Visual */}
                        <div className="relative z-10 transform transition-transform duration-75" style={{ transform: `translate(${mannequinPosition.x}px, ${mannequinPosition.y}px) scale(1.5) rotateY(${mannequinRotation}deg)` }}>
                            <div className="relative pointer-events-none">
                                <BandMemberVisual 
                                    instrument={InstrumentType.TRUMPET}
                                    uniform={previewUniform}
                                    appearance={{ 
                                        skinColor: '#888', 
                                        hairColor: '#000', 
                                        hairStyle: 0, 
                                        bodyType: 'average', 
                                        accessoryId: activeType === 'ACCESSORY' ? previewAssetId as any : 0 
                                    }}
                                    showInstrument={false}
                                    scale={1.5}
                                    noBounce={true}
                                    customAssets={[previewAsset]}
                                    view={Math.abs(mannequinRotation % 360) > 90 && Math.abs(mannequinRotation % 360) < 270 ? 'BACK' : 'FRONT'}
                                />
                            </div>
                        </div>
                        
                        <div className="absolute bottom-4 text-[10px] text-zinc-500 font-mono">
                            DRAG TO ROTATE • SHIFT+DRAG TO PAN
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
