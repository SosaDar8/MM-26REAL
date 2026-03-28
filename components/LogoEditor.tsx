
import React, { useState } from 'react';
import { Button } from './Button';
import { COLORS, LOGO_PRESETS, TINY_FONT } from '../constants';

interface LogoEditorProps {
    schoolLogo?: string[];
    bandLogo?: string[];
    schoolLogoText?: string;
    bandLogoText?: string;
    primaryColor: string;
    secondaryColor: string;
    onSave: (schoolLogo: string[], bandLogo: string[], schoolLogoText: string, bandLogoText: string) => void;
    onBack: () => void;
}

export const LogoEditor: React.FC<LogoEditorProps> = ({ 
    schoolLogo, bandLogo, schoolLogoText, bandLogoText, primaryColor, secondaryColor, onSave, onBack 
}) => {
    const [activeTab, setActiveTab] = useState<'SCHOOL' | 'BAND'>('SCHOOL');

    const [schoolGridSize, setSchoolGridSize] = useState(schoolLogo ? Math.sqrt(schoolLogo.length) : 10);
    const [bandGridSize, setBandGridSize] = useState(bandLogo ? Math.sqrt(bandLogo.length) : 10);

    const [schoolGrid, setSchoolGrid] = useState<string[]>(schoolLogo || Array(100).fill('transparent'));
    const [bandGrid, setBandGrid] = useState<string[]>(bandLogo || Array(100).fill('transparent'));

    const [schoolText, setSchoolText] = useState(schoolLogoText || "");
    const [bandText, setBandText] = useState(bandLogoText || "");

    const gridSize = activeTab === 'SCHOOL' ? schoolGridSize : bandGridSize;
    const setGridSize = activeTab === 'SCHOOL' ? setSchoolGridSize : setBandGridSize;

    const grid = activeTab === 'SCHOOL' ? schoolGrid : bandGrid;
    const setGrid = activeTab === 'SCHOOL' ? setSchoolGrid : setBandGrid;

    const textLayer = activeTab === 'SCHOOL' ? schoolText : bandText;
    const setTextLayer = activeTab === 'SCHOOL' ? setSchoolText : setBandText;

    const [selectedColor, setSelectedColor] = useState<string>(primaryColor);
    const [isDrawing, setIsDrawing] = useState(false);
    const [textInput, setTextInput] = useState("AB");

    const changeGridSize = (newSize: number) => {
        setGridSize(newSize);
        setGrid(Array(newSize * newSize).fill('transparent'));
    };

    const handleCellClick = (index: number) => {
        const newGrid = [...grid];
        newGrid[index] = selectedColor;
        setGrid(newGrid);
    };

    const handleMouseEnter = (index: number) => {
        if (isDrawing) {
            handleCellClick(index);
        }
    };

    const clearGrid = () => {
        setGrid(Array(gridSize * gridSize).fill('transparent'));
    };

    const fillGrid = () => {
        setGrid(Array(gridSize * gridSize).fill(selectedColor));
    };

    const loadPreset = (presetGrid: string[]) => {
        if (presetGrid.length === 100) {
            setGridSize(10);
            setGrid([...presetGrid]);
        }
    };

    const stampText = () => {
        const newGrid = [...grid];
        const chars = textInput.toUpperCase().split('');
        const totalWidth = chars.length * 3 + (chars.length - 1);
        let startX = Math.floor((gridSize - totalWidth) / 2);
        let startY = Math.floor((gridSize - 5) / 2);

        chars.forEach((char) => {
            const bitmap = TINY_FONT[char] || TINY_FONT[' '];
            for (let i = 0; i < 15; i++) {
                if (bitmap[i] === 1) {
                    const col = i % 3;
                    const row = Math.floor(i / 3);
                    const targetX = startX + col;
                    const targetY = startY + row;
                    
                    if (targetX >= 0 && targetX < gridSize && targetY >= 0 && targetY < gridSize) {
                        newGrid[targetY * gridSize + targetX] = selectedColor;
                    }
                }
            }
            startX += 4;
        });
        setGrid(newGrid);
    };

    const availableColors = [
        primaryColor,
        secondaryColor,
        '#000000', '#ffffff', 
        '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7',
        'transparent'
    ];

    return (
        <div className="h-full bg-slate-900 text-white flex flex-col font-mono select-none">
            {/* Tabs */}
            <div className="flex bg-black border-b border-gray-700">
                <button 
                    onClick={() => setActiveTab('SCHOOL')} 
                    className={`flex-1 py-4 font-bold tracking-widest ${activeTab === 'SCHOOL' ? 'bg-slate-800 text-yellow-400 border-b-4 border-yellow-400' : 'text-gray-500 hover:bg-gray-900'}`}
                >
                    SCHOOL LOGO (Campus, Office)
                </button>
                <button 
                    onClick={() => setActiveTab('BAND')} 
                    className={`flex-1 py-4 font-bold tracking-widest ${activeTab === 'BAND' ? 'bg-slate-800 text-yellow-400 border-b-4 border-yellow-400' : 'text-gray-500 hover:bg-gray-900'}`}
                >
                    BAND LOGO (Uniforms, Equipment)
                </button>
            </div>

            <div className="flex-1 flex gap-4 p-8 overflow-hidden">
                {/* Left Sidebar: Presets */}
                <div className="w-48 flex flex-col gap-4 border-r border-gray-700 pr-4 overflow-y-auto">
                    <h3 className="text-yellow-400 font-bold mb-2 font-pixel text-sm uppercase">Quick Logos</h3>
                    <div className="mb-4">
                        <label className="text-xs text-gray-400 block mb-1">CANVAS SIZE</label>
                        <div className="flex gap-1">
                            <button onClick={() => changeGridSize(10)} className={`flex-1 border px-2 py-1 text-xs ${gridSize===10?'bg-blue-600':'bg-black'}`}>10x10</button>
                            <button onClick={() => changeGridSize(16)} className={`flex-1 border px-2 py-1 text-xs ${gridSize===16?'bg-blue-600':'bg-black'}`}>16x16</button>
                        </div>
                    </div>

                    {LOGO_PRESETS.map((preset, idx) => (
                        <div 
                            key={idx}
                            onClick={() => loadPreset(preset.grid)}
                            className="bg-gray-800 p-2 cursor-pointer hover:bg-gray-700 border-2 border-transparent hover:border-yellow-400 transition-all group"
                        >
                            <div className="text-xs font-bold mb-1 text-gray-300 group-hover:text-white">{preset.name}</div>
                            <div className="grid gap-[1px] w-20 h-20 bg-gray-900 mx-auto" style={{ gridTemplateColumns: `repeat(${Math.sqrt(preset.grid.length)}, 1fr)` }}>
                                {preset.grid.map((c, i) => (
                                    <div key={i} style={{ backgroundColor: c }}></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Editor Area */}
                <div className="flex-grow flex flex-col items-center justify-center">
                    <h2 className="text-3xl text-yellow-400 mb-6 font-pixel tracking-widest">
                        {activeTab === 'SCHOOL' ? 'SCHOOL LOGO STUDIO' : 'BAND LOGO STUDIO'}
                    </h2>
                    
                    <div className="flex gap-8 items-start">
                        {/* Grid */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative" style={{ width: '320px', height: '320px' }}>
                                <div 
                                    className="grid border-4 border-gray-600 bg-[url('https://www.transparenttextures.com/patterns/checkerboard-cross-light.png')] bg-gray-800 absolute inset-0"
                                    style={{ 
                                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                                    }}
                                    onMouseDown={() => setIsDrawing(true)}
                                    onMouseUp={() => setIsDrawing(false)}
                                    onMouseLeave={() => setIsDrawing(false)}
                                >
                                    {grid.map((color, i) => (
                                        <div 
                                            key={i}
                                            className="border-[0.5px] border-white/5 hover:border-white/50 cursor-crosshair"
                                            style={{ backgroundColor: color }}
                                            onMouseDown={() => handleCellClick(i)}
                                            onMouseEnter={() => handleMouseEnter(i)}
                                        ></div>
                                    ))}
                                </div>
                                {/* Layered Text Overlay */}
                                {textLayer && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-6xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]" style={{ WebkitTextStroke: '2px black' }}>
                                            {textLayer}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={clearGrid} variant="secondary" className="text-xs py-1">CLEAR</Button>
                                <Button onClick={fillGrid} variant="secondary" className="text-xs py-1">FILL</Button>
                            </div>
                        </div>

                        {/* Right Controls: Palette & Actions */}
                        <div className="w-56 bg-black p-4 border-2 border-gray-700">
                            <h3 className="text-sm font-bold mb-2 text-gray-400">PALETTE</h3>
                            <div className="grid grid-cols-4 gap-2 mb-6">
                                {availableColors.map((c, i) => (
                                    <div 
                                        key={i}
                                        onClick={() => setSelectedColor(c)}
                                        className={`w-8 h-8 cursor-pointer border-2 ${selectedColor === c ? 'border-white scale-110 shadow-lg' : 'border-gray-600'} ${c === 'transparent' ? 'bg-gray-800 relative' : ''}`}
                                        style={{ backgroundColor: c === 'transparent' ? 'transparent' : c }}
                                        title={c === 'transparent' ? 'Eraser' : c}
                                    >
                                        {c === 'transparent' && <span className="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-xs">X</span>}
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-700 pt-4 mb-4">
                                <h3 className="text-sm font-bold mb-2 text-gray-400">LAYERED TEXT</h3>
                                <div className="flex flex-col gap-2">
                                    <input 
                                        value={textLayer} 
                                        onChange={(e) => setTextLayer(e.target.value.substring(0, 4))}
                                        className="w-full bg-gray-800 border text-white p-2 text-sm uppercase text-center font-bold"
                                        placeholder="e.g. JSU"
                                    />
                                    <p className="text-[10px] text-gray-500">Renders on top of the pixel logo.</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-700 pt-4 mb-4">
                                <h3 className="text-sm font-bold mb-2 text-gray-400">PIXEL STAMP</h3>
                                <div className="flex gap-1">
                                    <input 
                                        value={textInput} 
                                        onChange={(e) => setTextInput(e.target.value.substring(0, 3))}
                                        className="w-12 bg-gray-800 border text-white p-1 text-xs uppercase"
                                        placeholder="AB"
                                    />
                                    <button onClick={stampText} className="bg-blue-600 text-xs px-2 text-white hover:bg-blue-500">STAMP</button>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">Stamps text into the grid.</p>
                            </div>

                            <div className="mt-8 flex flex-col gap-4">
                                <Button onClick={() => onSave(schoolGrid, bandGrid, schoolText, bandText)} variant="success" className="w-full">SAVE ALL LOGOS</Button>
                                <Button onClick={onBack} variant="secondary" className="w-full">CANCEL</Button>
                            </div>
                        </div>
                    </div>
                    
                    <p className="mt-8 text-gray-500 text-xs">Tip: Click and drag to paint. Use Layered Text for high-res text over your pixel art.</p>
                </div>
            </div>
        </div>
    );
};
