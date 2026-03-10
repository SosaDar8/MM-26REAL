
import React from 'react';
import { GameState, Transaction } from '../types';
import { Button } from './Button';

interface BankAppProps {
    gameState: GameState;
    onTransaction: (t: Transaction) => void;
    onBack: () => void;
}

export const BankApp: React.FC<BankAppProps> = ({ gameState, onTransaction, onBack }) => {
    // Sort transactions by date (newest first) - assuming date is string ISO or comparable
    // For this mock, we assume they are added sequentially.
    const history = [...gameState.transactions].reverse();

    const handlePurchase = (item: string, cost: number) => {
        if (gameState.funds >= cost) {
            onTransaction({
                id: `tx-${Date.now()}`,
                date: new Date().toLocaleDateString(),
                type: 'EXPENSE',
                category: 'UPGRADE',
                amount: cost,
                description: item
            });
        } else {
            alert("Insufficient Funds!");
        }
    };

    return (
        <div className="w-full h-full bg-slate-100 text-slate-900 flex flex-col font-sans">
            {/* Header */}
            <div className="bg-green-700 p-4 text-white shadow-md">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">First Pixel Bank</span>
                    <button onClick={onBack} className="text-sm bg-green-800 px-2 py-1 rounded">Close</button>
                </div>
                <div className="mt-4 text-center">
                    <div className="text-sm opacity-80">Available Balance</div>
                    <div className="text-4xl font-bold">${gameState.funds.toLocaleString()}</div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 p-4 bg-white border-b border-gray-200">
                <button 
                    onClick={() => handlePurchase("New Uniforms Material", 500)}
                    className="flex flex-col items-center justify-center p-2 bg-blue-50 rounded hover:bg-blue-100"
                >
                    <span className="text-2xl">👕</span>
                    <span className="text-xs font-bold mt-1">Buy Uniforms ($500)</span>
                </button>
                <button 
                    onClick={() => handlePurchase("Instrument Repair", 200)}
                    className="flex flex-col items-center justify-center p-2 bg-orange-50 rounded hover:bg-orange-100"
                >
                    <span className="text-2xl">🔧</span>
                    <span className="text-xs font-bold mt-1">Repairs ($200)</span>
                </button>
                <button 
                    onClick={() => handlePurchase("Travel Bus Rental", 1000)}
                    className="flex flex-col items-center justify-center p-2 bg-yellow-50 rounded hover:bg-yellow-100"
                >
                    <span className="text-2xl">🚌</span>
                    <span className="text-xs font-bold mt-1">Travel Fund ($1k)</span>
                </button>
                <button 
                    onClick={() => handlePurchase("Marketing Blast", 300)}
                    className="flex flex-col items-center justify-center p-2 bg-purple-50 rounded hover:bg-purple-100"
                >
                    <span className="text-2xl">📢</span>
                    <span className="text-xs font-bold mt-1">Ads ($300)</span>
                </button>
            </div>

            {/* Transaction History */}
            <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Recent Transactions</h3>
                <div className="space-y-2">
                    {history.length === 0 && <div className="text-center text-gray-400 mt-4">No transactions yet.</div>}
                    
                    {history.map(tx => (
                        <div key={tx.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center border border-gray-100">
                            <div>
                                <div className="font-bold text-sm">{tx.description}</div>
                                <div className="text-xs text-gray-400">{tx.date} • {tx.category}</div>
                            </div>
                            <div className={`font-mono font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                {tx.type === 'INCOME' ? '+' : '-'}${tx.amount}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
