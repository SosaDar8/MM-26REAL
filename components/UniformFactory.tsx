
import React, { useState } from 'react';
import { Button } from './Button';
import { CustomAsset } from '../types';

interface UniformFactoryProps {
    onSave: (asset: CustomAsset) => void;
    onBack: () => void;
}

export const UniformFactory: React.FC<UniformFactoryProps> = ({ onSave, onBack }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<CustomAsset['type']>('JACKET');
    const [svg, setSvg] = useState('<svg viewBox="0 0 100 100"><path d="M20 20 L80 20 L90 80 L10 80 Z" fill="currentColor" /></svg>');

    return (
        <div className="fixed inset-0 z-[9999] bg-gray-900 text-white p-6 font-sans flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h2 className="text-3xl font-black text-yellow-500 uppercase tracking-widest">🏭 Uniform Factory</h2>
                <Button onClick={onBack} variant="secondary">EXIT FACTORY</Button>
            </div>
            
            <div className="flex-grow flex gap-6">
                <div className="w-1/3 bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-xl font-bold mb-4">Asset Details</h3>
                    <input type="text" placeholder="Asset Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-2 rounded mb-4" />
                    <select value={type} onChange={e => setType(e.target.value as CustomAsset['type'])} className="w-full bg-gray-900 border border-gray-700 p-2 rounded mb-4">
                        <option value="JACKET">Jacket</option>
                        <option value="PANTS">Pants</option>
                        <option value="HAT">Hat</option>
                        <option value="ACCESSORY">Accessory</option>
                    </select>
                    <textarea value={svg} onChange={e => setSvg(e.target.value)} className="w-full h-48 bg-gray-900 border border-gray-700 p-2 rounded font-mono text-xs" />
                    <Button onClick={() => onSave({ id: `factory_${Date.now()}`, name, type, svgContent: svg })} className="w-full mt-4 bg-green-600">SAVE ASSET</Button>
                </div>
                
                <div className="flex-grow bg-gray-950 rounded-xl border border-gray-800 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #333 0, #333 10px, #222 10px, #222 20px)' }}></div>
                    <div className="relative z-10 w-64 h-64 border-4 border-dashed border-gray-600 flex items-center justify-center p-4" dangerouslySetInnerHTML={{ __html: svg }} />
                </div>
            </div>
        </div>
    );
};
