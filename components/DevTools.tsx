import React, { useState } from 'react';
import { GameState, GamePhase, EventType, ScheduleEvent, BandMember, InstrumentType, Uniform } from '../types';
import { Button } from './Button';
import { generateRandomSchedule, generateBalancedRoster, DEFAULT_UNIFORMS } from '../constants';

interface DevToolsProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    setCurrentPhase: (phase: GamePhase) => void;
}

export const DevTools: React.FC<DevToolsProps> = ({ gameState, setGameState, setCurrentPhase }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [customEventName, setCustomEventName] = useState("Dev Event");

    if (gameState.settings.difficulty !== 'HACKER') return null;

    const addFunds = (amount: number) => {
        setGameState(prev => ({
            ...prev,
            funds: prev.funds + amount
        }));
    };

    const addFans = (amount: number) => {
        setGameState(prev => ({
            ...prev,
            fans: prev.fans + amount
        }));
    };

    const triggerEvent = (type: EventType) => {
        const newEvent: ScheduleEvent = {
            id: `dev-${Date.now()}`,
            type: type,
            name: customEventName,
            opponent: "Dev Team",
            date: 1, // Immediate
            reward: 1000,
            completed: false,
            isHome: true,
            level: 'COLLEGE'
        };
        
        setGameState(prev => ({
            ...prev,
            schedule: [newEvent, ...prev.schedule],
            activeEventId: newEvent.id
        }));
        
        // Navigate to appropriate phase
        if (type === EventType.FOOTBALL_GAME || type === EventType.BASKETBALL_GAME) setCurrentPhase(GamePhase.GAME_DAY);
        else if (type === EventType.BATTLE) setCurrentPhase(GamePhase.STAND_BATTLE);
        else if (type === EventType.PARADE) setCurrentPhase(GamePhase.PERFORMANCE);
    };

    const maxStats = () => {
        setGameState(prev => ({
            ...prev,
            members: prev.members.map(m => ({
                ...m,
                marchSkill: 100,
                playSkill: 100,
                showmanship: 100,
                chemistry: 100
            })),
            reputation: 1000,
            fans: 1000000
        }));
    };

    const unlockAll = () => {
        // Unlock all achievements and shop items logic would go here
        // For now, let's just give a ton of resources
        addFunds(1000000);
        addFans(1000000);
    };
    
    const winGame = () => {
        // Force win logic if in a game? 
        // This is harder to hook into without being inside the GameDay component.
        // Instead, we can just modify the result of the active event if it exists?
        // Or maybe just give a "Win" button that sets the last event to won.
        if (gameState.schedule.length > 0) {
             setGameState(prev => {
                 const newSchedule = [...prev.schedule];
                 if (newSchedule[0]) {
                     newSchedule[0].completed = true;
                     newSchedule[0].result = { us: 100, them: 0, win: true };
                 }
                 return { ...prev, schedule: newSchedule };
             });
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-[9999]">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-green-600 text-white font-mono font-bold p-2 border-2 border-white shadow-lg hover:bg-green-500 transition-all"
            >
                {isOpen ? 'CLOSE HACKER TOOLS' : '💻 HACKER MODE'}
            </button>

            {isOpen && (
                <div className="absolute bottom-12 right-0 bg-black/90 border-2 border-green-500 p-4 w-80 shadow-2xl rounded-lg backdrop-blur-md">
                    <h3 className="text-green-400 font-mono font-bold mb-4 border-b border-green-800 pb-2">DEV CONSOLE</h3>
                    
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        <div>
                            <label className="text-xs text-gray-400 font-bold block mb-1">RESOURCES</label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button onClick={() => addFunds(10000)} className="text-xs py-1">+10k Funds</Button>
                                <Button onClick={() => addFans(5000)} className="text-xs py-1">+5k Fans</Button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 font-bold block mb-1">TEAM</label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button onClick={maxStats} className="text-xs py-1">Max All Stats</Button>
                                <Button onClick={unlockAll} className="text-xs py-1">Unlock Everything</Button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 font-bold block mb-1">EVENTS</label>
                            <input 
                                type="text" 
                                value={customEventName} 
                                onChange={(e) => setCustomEventName(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white text-xs p-1 mb-2"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <Button onClick={() => triggerEvent(EventType.FOOTBALL_GAME)} className="text-xs py-1">Force Game</Button>
                                <Button onClick={() => triggerEvent(EventType.BATTLE)} className="text-xs py-1">Force Battle</Button>
                                <Button onClick={() => triggerEvent(EventType.PARADE)} className="text-xs py-1">Force Parade</Button>
                                <Button onClick={winGame} className="text-xs py-1">Auto-Win Last</Button>
                            </div>
                        </div>
                        
                        <div className="text-[10px] text-green-800 font-mono mt-4 text-center">
                            "Look at the flick of the wrist"
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
