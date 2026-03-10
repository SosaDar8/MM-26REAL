
import React, { useState } from 'react';
import { GameState } from '../types';
import { Button } from './Button';

interface AlumniHubProps {
    gameState: GameState;
    onBack: () => void;
}

export const AlumniHub: React.FC<AlumniHubProps> = ({ gameState, onBack }) => {
    const [view, setView] = useState<'HOME' | 'LEGENDS' | 'DONORS' | 'UNLOCKS'>('HOME');
    const [donationMsg, setDonationMsg] = useState("");

    const handleSolicitDonation = () => {
        // Simple mechanic: Chance based on reputation
        const chance = Math.min(0.8, gameState.fans / 2000);
        if (Math.random() < chance) {
            const amount = Math.floor(Math.random() * 200) + 50;
            // Emit event for global state update
            const event = new CustomEvent('mf-phone-action', { detail: { 
                action: 'ADD_FUNDS', 
                data: amount
            }});
            window.dispatchEvent(event);
            setDonationMsg(`Success! An alumnus donated $${amount}!`);
        } else {
            setDonationMsg("No one is interested right now. Try improving your reputation.");
        }
    };

    const renderHome = () => (
        <div className="grid grid-cols-2 gap-4 h-full content-center">
            <button 
                onClick={() => setView('LEGENDS')}
                className="bg-blue-900 p-8 border-4 border-blue-500 hover:bg-blue-800 transition-all shadow-lg flex flex-col items-center"
            >
                <span className="text-6xl mb-4">🏛️</span>
                <span className="text-2xl font-black uppercase">Hall of Legends</span>
                <span className="text-sm text-blue-300">View Past Careers</span>
            </button>
            <button 
                onClick={() => setView('DONORS')}
                className="bg-green-900 p-8 border-4 border-green-500 hover:bg-green-800 transition-all shadow-lg flex flex-col items-center"
            >
                <span className="text-6xl mb-4">💸</span>
                <span className="text-2xl font-black uppercase">Donation Center</span>
                <span className="text-sm text-green-300">Collect & Manage Funds</span>
            </button>
            <button 
                onClick={() => setView('UNLOCKS')}
                className="bg-purple-900 p-8 border-4 border-purple-500 hover:bg-purple-800 transition-all shadow-lg flex flex-col items-center col-span-2"
            >
                <span className="text-6xl mb-4">🎁</span>
                <span className="text-2xl font-black uppercase">Legacy Rewards</span>
                <span className="text-sm text-purple-300">Unlock rare items</span>
            </button>
        </div>
    );

    const renderSection = () => {
        if (view === 'LEGENDS') {
            return (
                <div className="bg-blue-900/50 p-6 border-2 border-blue-400 h-full overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4 border-b border-blue-600 pb-2">HALL OF LEGENDS</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-black/20 p-4">
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xl">D</div>
                            <div>
                                <div className="font-bold">Drum Major Dave</div>
                                <div className="text-xs text-gray-400">Class of '99 • "The First Step"</div>
                            </div>
                        </div>
                        <div className="text-center text-gray-500 italic p-4">More legends will appear as you complete careers.</div>
                    </div>
                </div>
            );
        }
        if (view === 'DONORS') {
            return (
                <div className="bg-green-900/50 p-6 border-2 border-green-400 h-full overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4 border-b border-green-600 pb-2">DONOR WALL</h2>
                    <div className="space-y-2 text-sm mb-8">
                        <div className="flex justify-between p-2 bg-white/5">
                            <span>The Booster Club</span>
                            <span className="text-green-400 font-bold">$5,000</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white/5">
                            <span>Anonymous</span>
                            <span className="text-green-400 font-bold">$100</span>
                        </div>
                    </div>
                    <div className="bg-black/40 p-6 text-center border-2 border-green-500">
                        <h3 className="text-xl font-bold text-green-400 mb-2">CALL FOR DONATIONS</h3>
                        <p className="text-xs text-gray-300 mb-4">Run a campaign to solicit funds from alumni.</p>
                        {donationMsg && <p className="text-yellow-400 mb-4 text-sm animate-pulse">{donationMsg}</p>}
                        <Button onClick={handleSolicitDonation} className="bg-green-600 hover:bg-green-500">START DRIVE</Button>
                    </div>
                </div>
            );
        }
        if (view === 'UNLOCKS') {
            return (
                <div className="bg-purple-900/50 p-6 border-2 border-purple-400 h-full overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4 border-b border-purple-600 pb-2">LEGACY UNLOCKS</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/40 p-4 border border-purple-500 opacity-50">
                            <div className="text-4xl mb-2">🎺</div>
                            <div className="font-bold">Golden Trumpet</div>
                            <div className="text-xs text-red-400">LOCKED (Req: Win Nationals)</div>
                        </div>
                        <div className="bg-black/40 p-4 border border-purple-500 opacity-50">
                            <div className="text-4xl mb-2">🏟️</div>
                            <div className="font-bold">Pro Stadium</div>
                            <div className="text-xs text-red-400">LOCKED (Req: 1M Fans)</div>
                        </div>
                    </div>
                </div>
            );
        }
        return renderHome();
    };

    return (
        <div className="h-full bg-blue-950 text-white p-8 flex flex-col font-mono">
            <header className="flex justify-between items-center mb-8 border-b-4 border-yellow-500 pb-4">
                <div>
                    <h1 className="text-4xl font-black text-yellow-400 italic">ALUMNI ASSOCIATION</h1>
                    <p className="text-blue-200">Preserving the legacy of {gameState.identity.schoolName}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-400">TOTAL DONATIONS</div>
                    <div className="text-3xl font-bold text-green-400">${gameState.alumniDonations || 0}</div>
                </div>
            </header>

            <div className="flex-grow">
                {view !== 'HOME' && (
                    <button onClick={() => { setView('HOME'); setDonationMsg(""); }} className="mb-4 text-blue-300 hover:text-white underline">
                        &larr; Back to Menu
                    </button>
                )}
                {renderSection()}
            </div>

            <div className="mt-8 text-right">
                <Button onClick={onBack} variant="secondary">EXIT HUB</Button>
            </div>
        </div>
    );
};
