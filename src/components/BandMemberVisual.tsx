
import React, { useMemo } from 'react';
import { InstrumentType, Uniform, Appearance, InstrumentDesign, MaceDesign } from '../types';

interface BandMemberVisualProps {
    instrument: InstrumentType;
    uniform: Uniform;
    appearance: Appearance;
    isPlaying?: boolean;
    scale?: number;
    showInstrument?: boolean;
    showHat?: boolean;
    instrumentConfig?: InstrumentDesign;
    maceConfig?: MaceDesign;
    logoGrid?: string[];
    view?: 'FRONT' | 'BACK'; 
}

export const BandMemberVisual: React.FC<BandMemberVisualProps> = ({ 
    instrument, 
    uniform, 
    appearance, 
    isPlaying = false, 
    scale = 1,
    showInstrument = true,
    showHat = true,
    instrumentConfig,
    maceConfig,
    logoGrid,
    view = 'FRONT'
}) => {
    const animDelay = useMemo(() => Math.random() * -2 + 's', []);

    // Majorettes have a more fluid bounce or dance
    const bounceClass = instrument === InstrumentType.MAJORETTE && isPlaying
        ? 'animate-[bounce_0.6s_infinite_ease-in-out]'
        : isPlaying 
            ? 'animate-[bounce_0.4s_infinite]' 
            : 'animate-[bounce_3s_infinite_ease-in-out]';
    
    const marchClass = isPlaying ? 'animate-[march_0.5s_steps(2)_infinite]' : '';

    const hatStyle = uniform.hatStyle || 'shako';
    const jacketStyle = uniform.jacketStyle || 'classic';
    const pantsStyle = uniform.pantsStyle || 'regular';
    
    const accent = uniform.accentColor || '#ffffff';
    const jacketColor = uniform.jacketColor || '#333333';
    const pantsColor = uniform.pantsColor || '#111111';
    const shoeColor = uniform.shoeColor || '#000000';
    const gloveColor = uniform.gloveColor || '#ffffff';
    const capeColor = uniform.capeColor || jacketColor; 
    
    // Normalize Cape Type
    const capeType = uniform.capeStyle || (uniform.hasCape ? 'long' : 'none');

    // Use plume color for secondary outfit color if not provided directly
    const secondaryColor = uniform.plumeColor && uniform.plumeColor !== 'transparent' ? uniform.plumeColor : accent;

    // Handle T-Shirt logic (No long sleeves)
    const isShortSleeve = jacketStyle === 'tshirt' || jacketStyle === 'polo';
    
    // Body Type Sizing Logic
    const bodyType = appearance.bodyType || 'average';
    const baseHeight = appearance.height || 1.0;
    
    const torsoWidth = bodyType === 'slim' ? 36 : bodyType === 'heavy' ? 60 : 48;
    const armSpacing = bodyType === 'slim' ? 24 : bodyType === 'heavy' ? 44 : 32; // Distance between arms
    const legSpacing = bodyType === 'slim' ? 2 : bodyType === 'heavy' ? 8 : 4; // Gap between legs
    const legWidth = bodyType === 'slim' ? 14 : bodyType === 'heavy' ? 22 : 18;

    const getFinishStyle = (finish?: string, color: string = '#ccc') => {
        if (finish === 'CHROME' || finish === 'SHINY' || finish === 'GOLD') {
            return {
                backgroundImage: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)`,
                backgroundSize: '200% 200%',
                animation: 'shine 3s linear infinite',
                backgroundColor: color,
                boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3), inset 2px 2px 0 rgba(255,255,255,0.3)'
            };
        }
        if (finish === 'MATTE') {
            return { backgroundColor: color, boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.2)' };
        }
        return { backgroundColor: color };
    };

    const renderFace = () => {
        if (view === 'BACK') return null;
        
        const eyeId = appearance.eyeId ?? 1;
        const browId = appearance.eyebrowId ?? 1;
        const mouthId = appearance.mouthId ?? 0;
        const beardId = appearance.facialHairId ?? 0;
        const glassesId = appearance.glassesId ?? 0;
        const hairColor = appearance.hairColor; // For brows/beard

        return (
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 45 }}>
                {/* Eyes */}
                <div className="absolute top-[14px] w-full flex justify-between px-[10px]">
                    {[0, 1].map(i => {
                        let eyeStyle: React.CSSProperties = {};
                        if (eyeId === 0) eyeStyle = { width: '4px', height: '4px', borderRadius: '50%' }; // Dot
                        else if (eyeId === 1) eyeStyle = { width: '4px', height: '6px', borderRadius: '1px' }; // Normal
                        else if (eyeId === 2) eyeStyle = { width: '6px', height: '6px', borderRadius: '50%' }; // Wide
                        else if (eyeId === 3) eyeStyle = { width: '6px', height: '2px', marginTop: '3px' }; // Tired/Closed
                        else if (eyeId === 4) eyeStyle = { width: '5px', height: '5px', borderRadius: '50% 50% 0 0', border: '1px solid black', borderBottom: 'none' }; // Happy ^
                        else if (eyeId === 5) eyeStyle = { width: '5px', height: '2px', marginTop: '2px', backgroundColor: 'black' }; // Focused
                        else if (eyeId === 6) eyeStyle = { width: '5px', height: '4px', borderRadius: '50%', borderTop: '2px solid black' }; // Lashes
                        else if (eyeId === 7) eyeStyle = { width: '6px', height: '4px', borderRadius: '0 50% 0 50%', transform: i===0?'rotate(-10deg)':'rotate(10deg)' }; // Almond

                        return <div key={i} style={{ backgroundColor: eyeId !== 4 ? 'black' : 'transparent', ...eyeStyle }}></div>;
                    })}
                </div>

                {/* Eyebrows */}
                <div className="absolute top-[10px] w-full flex justify-between px-[9px]">
                    {[0, 1].map(i => {
                        if (browId === 0) return null;
                        let browStyle: React.CSSProperties = { backgroundColor: hairColor };
                        if (browId === 1) browStyle = { ...browStyle, width: '6px', height: '1px' }; // Thin
                        else if (browId === 2) browStyle = { ...browStyle, width: '7px', height: '3px' }; // Thick
                        else if (browId === 3) browStyle = { ...browStyle, width: '6px', height: '2px', borderRadius: '50%', marginTop: '-1px' }; // Arched
                        else if (browId === 4) browStyle = { ...browStyle, width: '7px', height: '2px', transform: i===0?'rotate(15deg)':'rotate(-15deg)' }; // Angry
                        else if (browId === 5) browStyle = { ...browStyle, width: '6px', height: '2px', transform: i===0?'rotate(-10deg)':'rotate(10deg)' }; // Sad
                        else if (browId === 6) return i === 0 ? <div className="absolute left-[13px] w-[14px] h-[3px]" style={{ backgroundColor: hairColor }}></div> : null; // Unibrow

                        return <div key={i} style={browStyle}></div>;
                    })}
                </div>

                {/* Mouth */}
                <div className="absolute bottom-[8px] w-full flex justify-center">
                    {mouthId === 0 && <div className="w-[8px] h-[2px] bg-black/80"></div>} {/* Neutral */}
                    {mouthId === 1 && <div className="w-[8px] h-[4px] border-b-2 border-black/80 rounded-b-full"></div>} {/* Smile */}
                    {mouthId === 2 && <div className="w-[8px] h-[4px] border-t-2 border-black/80 rounded-t-full mt-[2px]"></div>} {/* Frown */}
                    {mouthId === 3 && <div className="w-[6px] h-[4px] bg-black/80 rounded-[1px]"></div>} {/* Open */}
                    {mouthId === 4 && <div className="w-[8px] h-[2px] bg-black/80 transform -rotate-6"></div>} {/* Smirk */}
                    {mouthId === 5 && <div className="w-[10px] h-[5px] bg-white border border-black/80 rounded-b-full"></div>} {/* Grin */}
                </div>

                {/* Facial Hair */}
                {beardId > 0 && (
                    <div className="absolute bottom-0 w-full flex justify-center pointer-events-none">
                        {beardId === 1 && <div className="w-full h-[12px] bg-black/10 absolute bottom-0"></div>} {/* Stubble */}
                        {beardId === 2 && <div className="w-[16px] h-[4px] absolute bottom-[12px] rounded-full" style={{backgroundColor: hairColor}}></div>} {/* Mustache */}
                        {beardId === 3 && <div className="w-[10px] h-[6px] absolute bottom-[2px] rounded-b-lg" style={{backgroundColor: hairColor}}></div>} {/* Goatee */}
                        {beardId === 4 && <div className="w-[36px] h-[16px] absolute bottom-[-2px] rounded-b-xl border-t border-black/10" style={{backgroundColor: hairColor}}></div>} {/* Full Beard */}
                        {beardId === 5 && <div className="w-[38px] h-[20px] absolute bottom-[-2px] border-x-[4px] border-b-[4px] rounded-b-xl border-transparent" style={{borderColor: hairColor}}></div>} {/* Chinstrap */}
                    </div>
                )}

                {/* Glasses */}
                {glassesId > 0 && (
                    <div className="absolute top-[14px] w-full flex justify-center gap-1 pointer-events-none">
                        {glassesId === 1 && <div className="flex gap-1"><div className="w-[10px] h-[10px] border-2 border-black rounded-full bg-blue-200/30"></div><div className="w-[10px] h-[10px] border-2 border-black rounded-full bg-blue-200/30"></div></div>} {/* Round */}
                        {glassesId === 2 && <div className="flex gap-1"><div className="w-[12px] h-[8px] border-2 border-black bg-blue-200/30"></div><div className="w-[12px] h-[8px] border-2 border-black bg-blue-200/30"></div></div>} {/* Square */}
                        {glassesId === 3 && <div className="flex gap-0"><div className="w-[14px] h-[10px] border-2 border-amber-600 rounded-b-full bg-black/50"></div><div className="w-[14px] h-[10px] border-2 border-amber-600 rounded-b-full bg-black/50"></div></div>} {/* Aviator */}
                        {glassesId === 4 && <div className="w-[32px] h-[8px] bg-black rounded-sm relative"><div className="absolute top-0 left-[15px] w-[2px] h-1 bg-white/20"></div></div>} {/* Shades */}
                        {glassesId === 5 && <div className="flex gap-2"><div className="w-[12px] h-[6px] bg-black rounded-t-lg transform rotate-12"></div><div className="w-[12px] h-[6px] bg-black rounded-t-lg transform -rotate-12"></div></div>} {/* Cat Eye */}
                        {/* Bridge for glasses */}
                        {(glassesId === 1 || glassesId === 2) && <div className="absolute top-[4px] w-[4px] h-[2px] bg-black"></div>}
                    </div>
                )}
            </div>
        );
    }

    const renderHair = () => {
        if (showHat && hatStyle !== 'none' && hatStyle !== 'cap' && hatStyle !== 'beret') return null; 
        const color = appearance.hairColor;
        const style = appearance.hairStyle;
        const transforms = appearance.hairTransform || { scaleX: 1, scaleY: 1, x: 0, y: 0 };
        const scaleX = transforms.scaleX || (transforms as any).scale || 1;
        const scaleY = transforms.scaleY || (transforms as any).scale || 1;
        const scaleVal = appearance.hairScale || 1;
        const xVal = transforms.x;
        const yVal = transforms.y;

        let content = null;
        let isBehindHead = false;

        switch (style) {
            case 0: content = null; break;
            case 1: content = <div className="absolute -top-1 left-0 w-full h-4 bg-transparent overflow-hidden"><div className="w-full h-full rounded-t-lg" style={{ backgroundColor: color }}></div></div>; break;
            case 2: content = <div className="absolute -top-1 left-0 w-full h-4"><div className="w-full h-2 rounded-t-lg" style={{ backgroundColor: color }}></div><div className="w-full h-2 opacity-50" style={{ backgroundColor: color }}></div></div>; break;
            case 3: content = <div className="absolute -top-3 -left-2 w-[140%] h-10 rounded-full" style={{ backgroundColor: color, boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3)', backgroundImage: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.1) 20%)', backgroundSize: '4px 4px', zIndex: 10 }}></div>; break;
            case 4: isBehindHead = true; content = <><div className="absolute -top-1 left-0 w-full h-4 rounded-t-lg z-20" style={{ backgroundColor: color }}></div><div className="absolute top-2 -left-1 w-[120%] h-12 -z-10 rounded-b-lg" style={{ backgroundColor: color }}></div></>; break;
            case 5: content = <div className="absolute -top-4 left-0 w-full h-8"><div className="w-full h-full rounded-t-sm" style={{ backgroundColor: color }}></div><div className="absolute bottom-0 w-full h-2 opacity-60" style={{ backgroundColor: color }}></div></div>; break;
            case 6: isBehindHead = true; content = <div className="absolute -top-2 left-[-10%] w-[120%] h-8 z-20"><div className="w-full h-full rounded-t-xl" style={{ backgroundColor: color }}></div><div className="absolute top-2 left-0 w-3 h-10 rounded-full border-r border-black/20" style={{ backgroundColor: color }}></div><div className="absolute top-2 right-0 w-3 h-10 rounded-full border-r border-black/20" style={{ backgroundColor: color }}></div><div className="absolute top-2 left-2 w-6 h-12 -z-10 bg-black/20" style={{ backgroundColor: color }}></div></div>; break;
            case 7: content = <><div className="absolute -top-1 left-0 w-full h-4 rounded-t-lg" style={{ backgroundColor: color }}></div><div className="absolute -top-5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: color }}><div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/10"></div></div></>; break;
            case 8: content = <div className="absolute -top-1 left-0 w-full h-4 rounded-t-lg overflow-hidden" style={{ backgroundColor: appearance.skinColor }}><div className="absolute inset-0 opacity-80" style={{ backgroundImage: `repeating-radial-gradient(circle at 50% 100%, ${color} 0, ${color} 1px, transparent 1px, transparent 3px)` }}></div></div>; break;
            case 9: content = <><div className="absolute -top-1 left-0 w-full h-4 rounded-t-lg" style={{ backgroundColor: color }}></div><div className="absolute -top-2 left-0 w-full h-6 flex flex-wrap justify-center gap-0.5">{[...Array(12)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>)}</div></>; break;
            case 10: content = <><div className="absolute -top-3 -left-2 w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: color }}></div><div className="absolute -top-3 -right-2 w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: color }}></div><div className="absolute -top-1 left-0 w-full h-4 rounded-t-lg" style={{ backgroundColor: color }}></div></>; break;
            case 11: content = <div className="absolute -top-1 left-0 w-full h-5 rounded-t-lg overflow-hidden" style={{ backgroundColor: appearance.skinColor }}><div className="flex justify-between px-1 h-full pt-1"><div className="w-1.5 h-full rounded-t-full" style={{ backgroundColor: color }}></div><div className="w-1.5 h-full rounded-t-full" style={{ backgroundColor: color }}></div><div className="w-1.5 h-full rounded-t-full" style={{ backgroundColor: color }}></div><div className="w-1.5 h-full rounded-t-full" style={{ backgroundColor: color }}></div></div></div>; break;
            case 12: isBehindHead = true; content = <><div className="absolute -top-1 left-0 w-full h-4 rounded-t-lg z-20" style={{ backgroundColor: color }}></div><div className="absolute top-2 -left-2 w-[130%] h-14 -z-10 flex justify-around"><div className="w-2 h-full rounded-full border-r border-black/20" style={{ backgroundColor: color }}></div><div className="w-2 h-full rounded-full border-r border-black/20" style={{ backgroundColor: color }}></div><div className="w-2 h-full rounded-full border-r border-black/20" style={{ backgroundColor: color }}></div><div className="w-2 h-full rounded-full border-r border-black/20" style={{ backgroundColor: color }}></div></div></>; break;
            case 13: content = <><div className="absolute -top-1 left-0 w-full h-4 rounded-t-lg opacity-30" style={{ backgroundColor: color }}></div><div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-t from-transparent to-black/20 rounded-t-lg" style={{ backgroundColor: color }}></div></>; break;
            
            // FEMALE STYLES (20+)
            case 20: // Long Straight
                isBehindHead = true;
                content = <><div className="absolute -top-1 left-0 w-full h-4 rounded-t-lg z-20" style={{ backgroundColor: color }}></div><div className="absolute top-0 -left-1 w-[120%] h-16 -z-10 bg-black/10 rounded-b-lg" style={{ backgroundColor: color }}></div></>;
                break;
            case 21: // Ponytail
                isBehindHead = true;
                content = <><div className="absolute -top-1 left-0 w-full h-4 rounded-t-lg z-20" style={{ backgroundColor: color }}></div><div className="absolute top-0 right-[-5px] w-4 h-12 -z-10 rounded-full" style={{ backgroundColor: color, transform: 'rotate(15deg)' }}></div></>;
                break;
            case 22: // Bob Cut
                isBehindHead = true;
                content = <><div className="absolute -top-1 left-0 w-full h-4 rounded-t-lg z-20" style={{ backgroundColor: color }}></div><div className="absolute top-0 -left-1 w-[120%] h-8 -z-10 rounded-b-xl" style={{ backgroundColor: color }}></div></>;
                break;
            case 23: // Bun (Top)
                content = <><div className="absolute -top-1 left-0 w-full h-4 rounded-t-lg" style={{ backgroundColor: color }}></div><div className="absolute -top-5 left-1/2 -translate-x-1/2 w-8 h-6 rounded-full border border-black/10" style={{ backgroundColor: color }}></div></>;
                break;
            case 24: // Braids
                isBehindHead = true;
                content = <><div className="absolute -top-1 left-0 w-full h-4 rounded-t-lg z-20" style={{ backgroundColor: color }}></div><div className="absolute top-0 left-[-4px] w-3 h-16 -z-10 flex flex-col items-center"><div className="w-full h-full border-r border-black/20" style={{backgroundColor: color}}></div></div><div className="absolute top-0 right-[-4px] w-3 h-16 -z-10 flex flex-col items-center"><div className="w-full h-full border-l border-black/20" style={{backgroundColor: color}}></div></div></>;
                break;
            case 25: // Pixie
                content = <div className="absolute -top-2 left-0 w-full h-6 rounded-t-xl" style={{ backgroundColor: color }}></div>;
                break;
            case 26: // Curly
                isBehindHead = true;
                content = <><div className="absolute -top-2 left-[-10%] w-[120%] h-8 z-20 rounded-t-xl" style={{ backgroundColor: color }}></div><div className="absolute top-0 -left-2 w-[140%] h-12 -z-10 rounded-full" style={{ backgroundColor: color, backgroundImage: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.1) 20%)', backgroundSize: '6px 6px' }}></div></>;
                break;
            case 27: // Afro Puff
                content = <><div className="absolute -top-1 left-0 w-full h-4 rounded-t-lg z-20" style={{ backgroundColor: color }}></div><div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-8 rounded-full border border-black/10" style={{ backgroundColor: color }}></div></>;
                break;
            case 28: // Pigtails
                isBehindHead = true;
                content = <><div className="absolute -top-1 left-0 w-full h-4 rounded-t-lg z-20" style={{ backgroundColor: color }}></div><div className="absolute top-2 left-[-10px] w-4 h-12 -z-10 rounded-full border border-black/10" style={{ backgroundColor: color }}></div><div className="absolute top-2 right-[-10px] w-4 h-12 -z-10 rounded-full border border-black/10" style={{ backgroundColor: color }}></div></>;
                break;

            default: content = <div className="absolute -top-1 left-0 w-full h-4 rounded-t-lg" style={{ backgroundColor: color }}></div>; break;
        }

        return (
            <div style={{ transform: `translate(${xVal}px, ${yVal}px) scale(${scaleX * scaleVal}, ${scaleY * scaleVal})`, transformOrigin: 'bottom center', zIndex: isBehindHead ? -1 : 10 }} className="w-full h-full absolute inset-0 pointer-events-none">
                {content}
            </div>
        );
    };

    const renderHat = () => {
        // ... (existing hat logic)
        if (!showHat || hatStyle === 'none') return null;
        let hatContent = null;
        let hatOffset = "-top-5";
        const isDM = uniform.isDrumMajor;
        const transforms = appearance.hatTransform || { scaleX: 1, scaleY: 1, x: 0, y: 0 };
        const scaleX = transforms.scaleX || (transforms as any).scale || 1;
        const scaleY = transforms.scaleY || (transforms as any).scale || 1;
        const baseScale = isDM ? 1.2 : 1.0;
        const xVal = transforms.x;
        const yVal = transforms.y;

        switch (hatStyle) {
            case 'shako':
                hatContent = (
                    <div className="w-12 h-10 relative border-2 border-black/40 shadow-lg" style={{ backgroundColor: uniform.hatColor }}>
                        {uniform.plumeColor !== 'transparent' && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3 h-8 border border-black/20" style={{ backgroundColor: uniform.plumeColor, borderRadius: '4px 4px 0 0' }}></div>
                        )}
                        <div className="absolute top-2 w-full h-2 border-y border-black/10" style={{ backgroundColor: accent }}></div>
                        {view === 'FRONT' && <div className="absolute bottom-1 left-1 right-1 h-1 bg-black/40 rounded-full"></div>}
                        {view === 'FRONT' && <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: accent }}></div>}
                    </div>
                );
                break;
            case 'tall_shako':
                hatOffset = "-top-8";
                hatContent = (
                    <div className="w-12 h-14 relative border-2 border-black/40 shadow-lg" style={{ backgroundColor: uniform.hatColor }}>
                        {uniform.plumeColor !== 'transparent' && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-10 border border-black/20" style={{ backgroundColor: uniform.plumeColor, borderRadius: '100% 100% 0 0' }}></div>
                        )}
                        {view === 'FRONT' && <div className="absolute top-4 left-0 w-full h-8 border-b-4 border-l-4 border-r-4 border-transparent" style={{ borderColor: `transparent ${accent} ${accent} ${accent}` }}></div>}
                    </div>
                );
                break;
            case 'stetson':
                hatOffset = "-top-4";
                hatContent = (
                    <div className="relative flex justify-center items-end">
                        <div className="w-20 h-4 absolute bottom-0 border-2 border-black/40" style={{ backgroundColor: uniform.hatColor, borderRadius: '50%' }}></div>
                        <div className="w-10 h-8 mb-2 border-2 border-black/40 relative z-10" style={{ backgroundColor: uniform.hatColor, borderRadius: '4px 4px 0 0' }}></div>
                    </div>
                );
                break;
            case 'beret':
                hatOffset = "-top-2";
                hatContent = (
                    <div className="w-14 h-6 relative border-2 border-black/40 rounded-tl-full rounded-tr-full transform -skew-x-12" style={{ backgroundColor: uniform.hatColor }}>
                        <div className="absolute left-2 bottom-1 w-2 h-2 rounded-full border border-black/20" style={{backgroundColor: accent}}></div>
                    </div>
                );
                break;
            case 'cap':
                hatOffset = "-top-3";
                hatContent = (
                    <div className="relative">
                        <div className="w-12 h-6 rounded-t-lg border-2 border-black/40" style={{ backgroundColor: uniform.hatColor }}></div>
                        {view === 'FRONT' && <div className="w-10 h-2 bg-black/30 absolute bottom-0 -right-2 transform rotate-12"></div>}
                        {view === 'BACK' && <div className="absolute bottom-1 w-full h-1 bg-black/20"></div>}
                    </div>
                );
                break;
            case 'bearskin':
                hatOffset = "-top-10";
                hatContent = (
                    <div className="w-14 h-16 relative border-2 border-black/40 shadow-lg rounded-t-full" style={{ backgroundColor: uniform.hatColor }}></div>
                );
                break;
        }

        return (
            <div className={`absolute ${hatOffset} z-50 w-full flex justify-center`} style={{ transform: `translate(${xVal}px, ${yVal}px) scale(${baseScale * scaleX}, ${baseScale * scaleY})` }}>
                {hatContent}
            </div>
        );
    };

    const renderCape = () => {
        // ... (existing cape logic)
        if (!capeType || capeType === 'none' || instrument === InstrumentType.MAJORETTE) return null;
        
        const zIndex = view === 'BACK' ? 40 : 10;
        
        const styleProps: React.CSSProperties = {
            backgroundColor: capeColor,
            transformOrigin: 'top center',
            animation: isPlaying ? 'sway 2s infinite ease-in-out' : 'none'
        };

        return (
            <div className={`absolute top-14 left-1/2 -translate-x-1/2 pointer-events-none`} style={{ zIndex, width: torsoWidth + 12 }}>
                {capeType === 'short' && (
                    <div 
                        className="w-full h-24 border-x-2 border-black/20 shadow-lg"
                        style={{ 
                            ...styleProps,
                            clipPath: 'polygon(15% 0, 85% 0, 100% 80%, 50% 100%, 0 80%)'
                        }}
                    >
                        <div className="w-full h-full bg-gradient-to-b from-black/10 to-transparent"></div>
                    </div>
                )}
                {capeType === 'long' && (
                    <div 
                        className="w-full h-48 border-x-2 border-black/20 shadow-xl"
                        style={{ 
                            ...styleProps,
                            clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0 100%)'
                        }}
                    >
                        <div className="w-full h-full bg-gradient-to-b from-black/10 to-transparent"></div>
                        {view === 'BACK' && uniform.logoPlacement?.enabled && logoGrid && (
                            <div className="absolute top-12 left-1/2 -translate-x-1/2 scale-75 opacity-80">
                                 <div className="grid grid-cols-10 gap-0" style={{ width: '40px', height: '40px' }}>
                                    {logoGrid.map((c, i) => <div key={i} style={{ backgroundColor: c }}></div>)}
                                 </div>
                            </div>
                        )}
                    </div>
                )}
                {capeType === 'side' && (
                    <div 
                        className="w-full h-40 border-r-2 border-black/20 shadow-lg"
                        style={{ 
                            ...styleProps,
                            clipPath: view === 'BACK' ? 'polygon(0 0, 50% 0, 80% 100%, 20% 90%)' : 'polygon(50% 0, 100% 0, 80% 90%, 20% 100%)', // Flip for view
                            transformOrigin: view === 'BACK' ? 'top left' : 'top right'
                        }}
                    >
                        <div className="w-full h-full bg-gradient-to-b from-black/10 to-transparent"></div>
                    </div>
                )}
            </div>
        );
    };

    const renderJacket = () => {
        // ... (existing jacket logic)
        return (
            <div className="h-full relative overflow-hidden border-2 border-black/40 shadow-[4px_4px_0_rgba(0,0,0,0.3)]"
                 style={{ backgroundColor: jacketColor, width: torsoWidth }}>
                
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none"></div>
                
                {view === 'BACK' ? (
                    <>
                        {jacketStyle === 'hoodie' && (
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-b-xl bg-black/20 border-b border-black/10"></div>
                        )}
                        {(!capeType || capeType === 'none' || capeType === 'side') && uniform.logoPlacement?.position === 'BACK' && uniform.logoPlacement.enabled && logoGrid && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 scale-[0.4]"
                                style={{ transform: `translate(${uniform.logoPlacement.xOffset || 0}px, ${uniform.logoPlacement.yOffset || 0}px) scale(0.4)` }}
                            >
                                 <div className="grid grid-cols-10 gap-0" style={{ width: '40px', height: '40px' }}>
                                    {logoGrid.map((c, i) => <div key={i} style={{ backgroundColor: c }}></div>)}
                                 </div>
                            </div>
                        )}
                        {uniform.logoPlacement?.customText && (!capeType || capeType === 'none') && (
                             <div className="absolute bottom-4 w-full text-center text-[5px] font-black uppercase text-white/80 bg-black/20 truncate px-1">
                                 {uniform.logoPlacement.customText}
                             </div>
                        )}
                    </>
                ) : (
                    <>
                        {jacketStyle === 'varsity' && (
                            <div className="absolute inset-0 flex flex-col items-center">
                                <div className="h-full border-r border-l w-4 border-gray-400/30 flex flex-col items-center gap-2 pt-2">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                </div>
                                <div className="absolute top-2 left-1 text-[8px] font-black text-white bg-black/20 px-1 border border-white/50">
                                    {uniform.name.charAt(0)}
                                </div>
                            </div>
                        )}
                        {jacketStyle === 'hbcu_heritage' && (
                            <div className="absolute inset-0">
                                <div 
                                    className="absolute top-0 right-0 w-full h-full opacity-80"
                                    style={{ background: `repeating-linear-gradient(45deg, ${accent} 0px, ${accent} 5px, ${secondaryColor} 5px, ${secondaryColor} 10px)` }}
                                ></div>
                                <div className="absolute top-0 bottom-0 left-2 right-2 bg-opacity-90" style={{ backgroundColor: jacketColor }}></div>
                            </div>
                        )}
                        {jacketStyle === 'windbreaker' && (
                            <div className="absolute inset-0 flex flex-col">
                                <div className="h-1/3 w-full" style={{ backgroundColor: jacketColor }}></div>
                                <div className="h-1/3 w-full border-y-2 border-white/50" style={{ backgroundColor: accent }}></div>
                                <div className="h-1/3 w-full" style={{ backgroundColor: secondaryColor }}></div>
                            </div>
                        )}
                        {jacketStyle === 'classic' && (
                            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-black/10"></div>
                        )}
                        {jacketStyle === 'suit' && (
                            <div className="absolute top-0 w-full h-full flex flex-col items-