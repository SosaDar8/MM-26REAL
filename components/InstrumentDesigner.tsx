
import React, { useState } from 'react';
import { GameState, InstrumentDesign, LogoPlacement, Uniform, MaceDesign, InstrumentType } from '../types';
import { Button } from './Button';
import { COLORS, DEFAULT_MACE_DESIGN } from '../constants';
import { BandMemberVisual } from './BandMemberVisual';

interface InstrumentDesignerProps {
    gameState: GameState;
    onSave: (designs: GameState['instrumentDesigns'], uniformUpdates: Partial<Uniform>) => void;
    onBack: () => void;
}

export const InstrumentDesigner: React.FC<InstrumentDesignerProps> = ({ gameState, onSave, onBack }) => {
    const [activeTab, setActiveTab] = useState<'BRASS' | 'PERCUSSION' | 'CYMBALS' | 'MACE' | 'DECALS'>('BRASS');
    const [brassDesign, setBrassDesign] = useState<InstrumentDesign>(gameState.instrumentDesigns.brass);
    const [percDesign, setPercDesign] = useState<InstrumentDesign>(gameState.instrumentDesigns.percussion);
    const [maceDesign, setMaceDesign] = useState<MaceDesign>(gameState.instrumentDesigns.mace || DEFAULT_MACE_DESIGN);
    
    const activeUniform = gameState.uniforms.find(u => u.id === gameState.currentUniformId) || gameState.uniforms[0];
    const [logoPlacement, setLogoPlacement] = useState<LogoPlacement>(activeUniform.logoPlacement || {
        enabled: false,
        position: 'CHEST_LEFT',
        size: 'SMALL',
        applyTo: 'UNIFORM'
    });

    const handleSave = () => {
        onSave({
            brass: brassDesign,
            woodwind: gameState.instrumentDesigns.woodwind, 
            percussion: percDesign,
            mace: maceDesign
        }, {
            logoPlacement
        });
    };

    const finishes = ['MATTE', 'SHINY', 'CHROME', 'GOLD', 'WORN'] as const;

    const renderColorPicker = (label: string, current: string, onChange: (c: string) => void) => (
        <div className="mb-4">
            <label className="text-xs text-gray-400 uppercase mb-1 block">{label}</label>
            <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                    <button
                        key={c.name}
                        onClick={() => onChange(c.hex)}
                        className={`w-6 h-6 border-2 transition-transform ${current === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                    />
                ))}
            </div>
        </div>
    );

    const renderFinishSelector = (current: string, onChange: (f: any) => void) => (
        <div>
            <label className="text-xs text-gray-400 uppercase mb-1 block">Finish Style</label>
            <div className="grid grid-cols-3 gap-2">
                {finishes.map(f => (
                    <button key={f} onClick={() => onChange(f)} 
                            className={`p-2 text-[10px] font-bold border transition-all ${current === f ? 'bg-yellow-600 border-white text-white' : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'}`}>
                        {f}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderControls = () => {
        if (activeTab === 'BRASS') {
            return (
                <div className="space-y-6 animate-fade-in">
                    <h3 className="text-yellow-400 font-bold border-b border-gray-600 pb-2 uppercase tracking-widest text-sm">HORN CUSTOMIZATION</h3>
                    {renderColorPicker("Plating Color", brassDesign.primaryColor, (c) => setBrassDesign({ ...brassDesign, primaryColor: c }))}
                    {renderColorPicker("Accents / Valves", brassDesign.secondaryColor, (c) => setBrassDesign({ ...brassDesign, secondaryColor: c }))}
                    {renderFinishSelector(brassDesign.finish || 'SHINY', (f) => setBrassDesign({ ...brassDesign, finish: f }))}
                </div>
            );
        } else if (activeTab === 'PERCUSSION' || activeTab === 'CYMBALS') {
            return (
                <div className="space-y-6 animate-fade-in">
                    <h3 className="text-blue-400 font-bold border-b border-gray-600 pb-2 uppercase tracking-widest text-sm">DRUM & CYMBAL BUILDER</h3>
                    {renderColorPicker("Shell/Plate Color", percDesign.primaryColor, (c) => setPercDesign({ ...percDesign, primaryColor: c }))}
                    {renderColorPicker("Rim / Hardware Color", percDesign.secondaryColor, (c) => setPercDesign({ ...percDesign, secondaryColor: c }))}
                    {activeTab !== 'CYMBALS' && renderColorPicker("Drum Heads", percDesign.detailColor || '#fff', (c) => setPercDesign({ ...percDesign, detailColor: c }))}
                    {renderFinishSelector(percDesign.finish || 'SHINY', (f) => setPercDesign({ ...percDesign, finish: f }))}
                </div>
            );
        } else if (activeTab === 'MACE') {
            return (
                <div className="space-y-6 animate-fade-in">
                    <h3 className="text-green-400 font-bold border-b border-gray-600 pb-2 uppercase tracking-widest text-sm">DRUM MAJOR MACE</h3>
                    <div>
                        <label className="text-xs text-gray-400 uppercase mb-1 block">Head Style</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['GLOBE', 'EAGLE', 'SPEAR'].map(s => (
                                <button key={s} onClick={() => setMaceDesign({ ...maceDesign, headShape: s as any })} 
                                        className={`p-2 text-[10px] font-bold border transition-all ${maceDesign.headShape === s ? 'bg-green-600 border-white text-white' : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    {renderColorPicker("Head Metal Color", maceDesign.headColor, (c) => setMaceDesign({ ...maceDesign, headColor: c }))}
                    {renderColorPicker("Shaft Color", maceDesign.shaftColor, (c) => setMaceDesign({ ...maceDesign, shaftColor: c }))}
                    {renderFinishSelector(maceDesign.finish || 'SHINY', (f) => setMaceDesign({ ...maceDesign, finish: f }))}
                    <div className="border-t border-gray-700 pt-4">
                        <label className="text-xs text-gray-400 uppercase mb-2 block font-bold">Cord Wrap Colors</label>
                        {renderColorPicker("Primary Cord", maceDesign.cordPrimary, (c) => setMaceDesign({ ...maceDesign, cordPrimary: c }))}
                        {renderColorPicker("Secondary Cord", maceDesign.cordSecondary, (c) => setMaceDesign({ ...maceDesign, cordSecondary: c }))}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="space-y-6 animate-fade-in">
                    <h3 className="text-purple-400 font-bold border-b border-gray-600 pb-2 uppercase tracking-widest text-sm">UNIFORM DECALS</h3>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
                        <span className="text-xs font-bold uppercase">Enable School Logo</span>
                        <input type="checkbox" checked={logoPlacement.enabled} 
                               onChange={(e) => setLogoPlacement({...logoPlacement, enabled: e.target.checked})} 
                               className="w-6 h-6 accent-purple-500" />
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="h-full bg-slate-900 text-white font-mono flex overflow-hidden">
            <div className="w-1/3 border-r border-gray-700 flex flex-col bg-black shadow-2xl z-10">
                <div className="p-4 bg-gray-900 border-b border-gray-700">
                    <h1 className="text-xl font-bold mb-4 text-center tracking-[0.2em] uppercase">INSTRUMENT LAB</h1>
                    <div className="flex bg-gray-800 rounded p-1 gap-1 flex-wrap">
                        <button onClick={() => setActiveTab('BRASS')} className={`flex-1 min-w-[60px] py-2 text-[10px] font-bold transition-colors ${activeTab === 'BRASS' ? 'bg-yellow-600 text-white' : 'text-gray-500 hover:text-white'}`}>BRASS</button>
                        <button onClick={() => setActiveTab('PERCUSSION')} className={`flex-1 min-w-[60px] py-2 text-[10px] font-bold transition-colors ${activeTab === 'PERCUSSION' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}>PERC</button>
                        <button onClick={() => setActiveTab('CYMBALS')} className={`flex-1 min-w-[60px] py-2 text-[10px] font-bold transition-colors ${activeTab === 'CYMBALS' ? 'bg-orange-600 text-white' : 'text-gray-500 hover:text-white'}`}>CYM</button>
                        <button onClick={() => setActiveTab('MACE')} className={`flex-1 min-w-[60px] py-2 text-[10px] font-bold transition-colors ${activeTab === 'MACE' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-white'}`}>MACE</button>
                        <button onClick={() => setActiveTab('DECALS')} className={`flex-1 min-w-[60px] py-2 text-[10px] font-bold transition-colors ${activeTab === 'DECALS' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white'}`}>DECAL</button>
                    </div>
                </div>
                <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">{renderControls()}</div>
                <div className="p-4 border-t border-gray-700 flex gap-2">
                    <Button onClick={onBack} variant="secondary" className="flex-1 text-xs">CANCEL</Button>
                    <Button onClick={handleSave} variant="success" className="flex-1 text-xs">APPLY CHANGES</Button>
                </div>
            </div>

            <div className="w-2/3 bg-gray-800 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black opacity-80"></div>
                <div className="relative z-10 transform scale-[2]">
                    <BandMemberVisual 
                        instrument={activeTab === 'BRASS' ? InstrumentType.TRUMPET : activeTab === 'MACE' ? InstrumentType.MACE : activeTab === 'CYMBALS' ? InstrumentType.CYMBAL : InstrumentType.SNARE}
                        uniform={{ ...activeUniform, logoPlacement: activeTab === 'DECALS' ? logoPlacement : activeUniform.logoPlacement }}
                        appearance={{ skinColor: '#8d5524', hairColor: '#000', hairStyle: 1, bodyType: 'average', accessoryId: 0 }}
                        instrumentConfig={activeTab === 'BRASS' ? brassDesign : percDesign}
                        maceConfig={maceDesign}
                        logoGrid={gameState.identity.logo}
                        scale={1.5}
                        isPlaying={true}
                    />
                </div>
            </div>
        </div>
    );
};
