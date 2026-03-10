import React from 'react';
import { GameState } from '../types';

interface SecretSettingsProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    onClose: () => void;
}

export const SecretSettings: React.FC<SecretSettingsProps> = ({ gameState, setGameState, onClose }) => {
    
    const toggleCrazyFeature = (feature: 'BIG_HEAD' | 'DISCO' | 'SLOW_MO' | 'GRAVITY_SHIFT') => {
        setGameState(prev => ({ ...prev, activeCrazyFeature: prev.activeCrazyFeature === feature ? undefined : feature }));
    };

    const changeSkin = (skinId: string) => {
        setGameState(prev => ({ ...prev, activeSkinId: skinId === 'default' ? undefined : skinId }));
    };

    const skins: { id: string, name: string }[] = [
        { id: 'default', name: 'Default' },
        { id: 'synthwave', name: 'Neon Synthwave' },
        { id: 'paper', name: 'Classic Paper' },
        { id: 'high-contrast', name: 'High Contrast' },
        { id: 'terminal', name: 'Retro Terminal' }
    ];

    const crazyFeatures: { id: 'BIG_HEAD' | 'DISCO' | 'SLOW_MO' | 'GRAVITY_SHIFT', name: string }[] = [
        { id: 'BIG_HEAD', name: 'Big Head Mode' },
        { id: 'DISCO', name: 'Disco Mode' },
        { id: 'SLOW_MO', name: 'Slow Motion' },
        { id: 'GRAVITY_SHIFT', name: 'Gravity Shift' }
    ];

    return (
        <div className="absolute inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
            <div className="bg-gray-950 border-4 border-purple-600 p-8 max-w-3xl w-full shadow-[0_0_50px_rgba(147,51,234,0.5)] relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-purple-400 hover:text-white text-2xl">×</button>
                <h2 className="text-4xl font-pixel text-purple-400 mb-8 text-center uppercase tracking-widest">Super Secret Settings</h2>
                
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl text-white mb-4 border-b border-purple-800 pb-2">Texture Packs</h3>
                        <div className="space-y-2">
                            {skins.map(skin => (
                                <button 
                                    key={skin.id}
                                    onClick={() => changeSkin(skin.id)}
                                    className={`w-full p-3 text-left border ${gameState.activeSkinId === skin.id ? 'border-purple-400 bg-purple-900' : 'border-gray-700 bg-black'} hover:border-purple-500`}
                                >
                                    {skin.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-xl text-white mb-4 border-b border-purple-800 pb-2">Crazy Features</h3>
                        <div className="space-y-3">
                            {crazyFeatures.map(feature => (
                                <button 
                                    key={feature.id}
                                    onClick={() => toggleCrazyFeature(feature.id)}
                                    className={`w-full p-3 text-left border ${gameState.activeCrazyFeature === feature.id ? 'border-yellow-400 bg-yellow-900' : 'border-gray-700 bg-black'} hover:border-yellow-500`}
                                >
                                    {feature.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
