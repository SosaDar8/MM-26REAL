
import React, { useState } from 'react';
import { GameState, BandMember, ShopItem, Achievement, ScheduleEvent, EventType } from '../types';
import { SHOP_ITEMS, INITIAL_ACHIEVEMENTS } from '../constants';
import { Button } from './Button';
import { SecretSettings } from './SecretSettings';

interface HackerMenuProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    onClose: () => void;
}

export const HackerMenu: React.FC<HackerMenuProps> = ({ gameState, setGameState, onClose }) => {
    const [customScore, setCustomScore] = useState({ us: 100, them: 0 });
    const [showSecretSettings, setShowSecretSettings] = useState(false);

    const addFunds = () => {
        setGameState(prev => ({ ...prev, funds: prev.funds + 10000 }));
    };

    const addFans = () => {
        setGameState(prev => ({ ...prev, fans: prev.fans + 1000 }));
    };

    const maxSkills = () => {
        setGameState(prev => ({
            ...prev,
            members: prev.members.map(m => ({
                ...m,
                marchSkill: 100,
                playSkill: 100,
                showmanship: 100,
                chemistry: 100
            }))
        }));
    };

    const unlockAllItems = () => {
        setGameState(prev => ({
            ...prev,
            unlockedItems: SHOP_ITEMS.map(i => i.id)
        }));
    };

    const unlockAllAchievements = () => {
        setGameState(prev => ({
            ...prev,
            achievements: prev.achievements.map(a => ({ ...a, unlocked: true, dateUnlocked: new Date().toLocaleDateString() }))
        }));
    };

    const forceWinNextEvent = () => {
        // Find next uncompleted event
        const nextEventIndex = gameState.schedule.findIndex(e => !e.completed);
        if (nextEventIndex === -1) return;

        const eventId = gameState.schedule[nextEventIndex].id;
        
        setGameState(prev => ({
            ...prev,
            schedule: prev.schedule.map(e => e.id === eventId ? {
                ...e,
                completed: true,
                result: { us: customScore.us, them: customScore.them, win: customScore.us > customScore.them }
            } : e),
            funds: prev.funds + 1000,
            fans: prev.fans + 100
        }));
    };

    const triggerRandomEvent = () => {
        alert("Random Event Triggered! (Simulated)");
    };
    
    const toggleGodMode = () => {
        setGameState(prev => ({
            ...prev,
            activeBuff: { type: 'ALL_STATS', value: 50, description: 'GOD MODE ENABLED' }
        }));
    };

    const createCustomEvent = () => {
        const newEvent: ScheduleEvent = {
            id: `evt_custom_${Date.now()}`,
            date: Date.now(),
            name: "CUSTOM BATTLE ROYALE",
            type: EventType.BATTLE,
            opponent: "The Developers",
            completed: false,
            reward: 5000,
            level: 'COLLEGE'
        };
        
        setGameState(prev => ({
            ...prev,
            schedule: [...prev.schedule, newEvent]
        }));
        alert("Custom Event Added to Schedule!");
    };

    const dispatchCheat = (action: string, amount: number) => {
        window.dispatchEvent(new CustomEvent('HACKER_CHEAT', { detail: { action, amount } }));
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-8 font-mono text-green-500 border-4 border-green-500">
            <div className="w-full max-w-4xl h-full overflow-y-auto p-4">
                <div className="flex justify-between items-center mb-8 border-b-2 border-green-500 pb-4">
                    <h1 className="text-4xl font-black glitch-text">HACKER TERMINAL_</h1>
                    <button onClick={onClose} className="text-red-500 hover:text-red-400 text-2xl">[EXIT]</button>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-xl border-b border-green-800 pb-2">RESOURCES</h2>
                        <Button onClick={addFunds} className="w-full border-green-500 text-green-500 hover:bg-green-900">ADD $10,000</Button>
                        <Button onClick={addFans} className="w-full border-green-500 text-green-500 hover:bg-green-900">ADD 1,000 FANS</Button>
                        
                        <h2 className="text-xl border-b border-green-800 pb-2 mt-8">TEAM</h2>
                        <Button onClick={maxSkills} className="w-full border-green-500 text-green-500 hover:bg-green-900">MAX ALL SKILLS (100)</Button>
                        <Button onClick={toggleGodMode} className="w-full border-green-500 text-green-500 hover:bg-green-900">ENABLE GOD MODE BUFF</Button>

                        <h2 className="text-xl border-b border-green-800 pb-2 mt-8">CURRENT EVENT</h2>
                        <Button onClick={() => dispatchCheat('ADD_SCORE_US', 50)} className="w-full border-green-500 text-green-500 hover:bg-green-900">ADD 50 SCORE (US)</Button>
                        <Button onClick={() => dispatchCheat('ADD_SCORE_THEM', -50)} className="w-full border-green-500 text-green-500 hover:bg-green-900">SUBTRACT 50 SCORE (THEM)</Button>
                        <Button onClick={() => dispatchCheat('END_QUARTER', 0)} className="w-full border-green-500 text-green-500 hover:bg-green-900">SKIP QUARTER / ROUND</Button>
                        <Button onClick={() => dispatchCheat('MAX_MOMENTUM', 100)} className="w-full border-green-500 text-green-500 hover:bg-green-900">MAX MOMENTUM</Button>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl border-b border-green-800 pb-2">UNLOCKS</h2>
                        <Button onClick={unlockAllItems} className="w-full border-green-500 text-green-500 hover:bg-green-900">UNLOCK ALL SHOP ITEMS</Button>
                        <Button onClick={unlockAllAchievements} className="w-full border-green-500 text-green-500 hover:bg-green-900">UNLOCK ALL ACHIEVEMENTS</Button>

                        <h2 className="text-xl border-b border-green-800 pb-2 mt-8">GAME MANIPULATION</h2>
                        <Button onClick={() => setShowSecretSettings(true)} className="w-full border-purple-500 text-purple-400 hover:bg-purple-900">SUPER SECRET SETTINGS</Button>
                        <div className="flex gap-2 items-center bg-green-900/20 p-2 border border-green-500">
                            <span>US:</span>
                            <input 
                                type="number" 
                                value={customScore.us} 
                                onChange={(e) => setCustomScore({...customScore, us: parseInt(e.target.value)})}
                                className="bg-black border border-green-500 w-16 text-center text-green-500"
                            />
                            <span>THEM:</span>
                            <input 
                                type="number" 
                                value={customScore.them} 
                                onChange={(e) => setCustomScore({...customScore, them: parseInt(e.target.value)})}
                                className="bg-black border border-green-500 w-16 text-center text-green-500"
                            />
                        </div>
                        <Button onClick={forceWinNextEvent} className="w-full border-green-500 text-green-500 hover:bg-green-900">FORCE RESULT (NEXT EVENT)</Button>
                        <Button onClick={createCustomEvent} className="w-full border-green-500 text-green-500 hover:bg-green-900">CREATE CUSTOM EVENT</Button>
                    </div>
                </div>

                <div className="mt-8 border-t-2 border-green-500 pt-4">
                    <p className="text-xs opacity-50">WARNING: USING HACKER TOOLS MAY RUIN THE FUN. BUT YOU DO YOU.</p>
                </div>
            </div>
            {showSecretSettings && <SecretSettings gameState={gameState} setGameState={setGameState} onClose={() => setShowSecretSettings(false)} />}
        </div>
    );
};
