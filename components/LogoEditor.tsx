
import React, { useState } from 'react';
import { Button } from './Button';
import { COLORS, LOGO_PRESETS, TINY_FONT } from '../constants';

interface LogoEditorProps {
    currentLogo?: string[];
    primaryColor: string;
    secondaryColor: string;
    isSchoolLogo: boolean;
    onSave: (logo: string[], isSchoolLogo: boolean) => void;
    onBack: () => void;
}

export const LogoEditor: React.FC<LogoEditorProps> = ({ currentLogo, primaryColor, secondaryColor, isSchoolLogo: initialIsSchoolLogo, onSave, onBack }) => {
    const [isSchoolLogo, setIsSchoolLogo] = useState(initialIsSchoolLogo ?? false);
    // Detect initial grid size
    const initialSize = currentLogo ? Math.sqrt(currentLogo.length) : 10;
    const [gridSize, setGridSize] = useState(initialSize);
    
    // Initialize grid logic
    const initializeGrid = (size: number) => {
        if (currentLogo && currentLogo.length === size * size) return currentLogo;
        return Array(size * size).fill('transparent');
    };

    const [grid, setGrid] = useState<string[]>(initializeGrid(gridSize));
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
        // Presets are currently 10x10. If we are in a different mode, we need to adapt or just switch.
        // For simplicity, force 10x10 mode when loading presets if they are 100 length.
        if (presetGrid.length === 100) {
            setGridSize(10);
            setGrid([...presetGrid]);
        }
    };

    const stampText = () => {
        // Render 3x5 text onto the current grid
        const newGrid = [...grid];
        const chars = textInput.toUpperCase().split('');
        // Simple auto layout: center horizontally
        // 3px wide + 1px spacing
        const totalWidth = chars.length * 3 + (chars.length - 1);
        let startX = Math.floor((gridSize - totalWidth) / 2);
        let startY = Math.floor((gridSize - 5) / 2); // Center vertically (5px high)

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
            startX += 4; // 3 width + 1 space
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
        <div className="h-full bg-slate-900 text-white flex gap-4 p-8 font-mono select-none">
            
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
                        {/* Mini Preview */}
                        <div className="grid grid-cols-10 gap-[1px] w-20 h-20 bg-gray-900 mx-auto">
                            {preset.grid.map((c, i) => (
                                <div key={i} style={{ backgroundColor: c }}></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Editor Area */}
            <div className="flex-grow flex flex-col items-center justify-center">
                <h2 className="text-3xl text-yellow-400 mb-6 font-pixel tracking-widest">LOGO STUDIO</h2>
                
                <div className="flex gap-8 items-start">
                    {/* Grid */}
                    <div className="flex flex-col items-center gap-4">
                        <div 
                            className="grid border-4 border-gray-600 bg-[url('https://www.transparenttextures.com/patterns/checkerboard-cross-light.png')] bg-gray-800"
                            style={{ 
                                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                                width: '320px',
                                height: '320px'
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
                        <div className="flex gap-2">
                            <Button onClick={clearGrid} variant="secondary" className="text-xs py-1">CLEAR</Button>
                            <Button onClick={fillGrid} variant="secondary" className="text-xs py-1">FILL</Button>
                        </div>
                    </div>

                    {/* Right Controls: Palette & Actions */}
                    <div className="w-48 bg-black p-4 border-2 border-gray-700">
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
                            <h3 className="text-sm font-bold mb-2 text-gray-400">TEXT STAMP</h3>
                            <div className="flex gap-1">
                                <input 
                                    value={textInput} 
                                    onChange={(e) => setTextInput(e.target.value.substring(0, 3))} // Max 3 chars usually
                                    className="w-12 bg-gray-800 border text-white p-1 text-xs uppercase"
                                    placeholder="AB"
                                />
                                <button onClick={stampText} className="bg-blue-600 text-xs px-2 text-white hover:bg-blue-500">STAMP</button>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="flex items-center gap-2 text-xs text-gray-400">
                                <input type="checkbox" checked={isSchoolLogo} onChange={(e) => setIsSchoolLogo(e.target.checked)} />
                                Apply to School Assets
                            </label>
                        </div>

                        <div className="mt-8 flex flex-col gap-4">
                            <Button onClick={() => onSave(grid, isSchoolLogo)} variant="success" className="w-full">SAVE LOGO</Button>
                            <Button onClick={onBack} variant="secondary" className="w-full">CANCEL</Button>
                        </div>
                    </div>
                </div>
                
                <p className="mt-8 text-gray-500 text-xs">Tip: Click and drag to paint. Use STAMP for quick text.</p>
            </div>
        </div>
    );
};
