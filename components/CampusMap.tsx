
import React from 'react';
import { CampusLocation, CampusLocationId, CareerState } from '../types';
import { CAMPUS_LOCATIONS } from '../constants';
import { Button } from './Button';

interface CampusMapProps {
    careerState: CareerState;
    onTravel: (locationId: CampusLocationId) => void;
    onBack: () => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({ careerState, onTravel, onBack }) => {
    
    return (
        <div className="w-full h-full bg-[#34495e] flex flex-col items-center justify-center relative overflow-hidden font-mono">
            {/* Map Background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20"></div>
            
            <header className="absolute top-4 left-4 z-20 bg-white p-4 border-4 border-black shadow-lg">
                <h1 className="text-2xl font-black uppercase text-black">CAMPUS MAP</h1>
                <div className="text-sm font-bold text-gray-600">CURRENT LOCATION: <span className="text-blue-600">{CAMPUS_LOCATIONS.find(l => l.id === careerState.currentLocation)?.name}</span></div>
                <div className="text-xs mt-2 text-red-500">TRAVEL COST: -10 ENERGY</div>
            </header>

            <div className="absolute top-4 right-4 z-20">
                <Button onClick={onBack} variant="secondary">CLOSE MAP</Button>
            </div>

            {/* Map Container */}
            <div className="relative w-[800px] h-[600px] bg-[#27ae60] border-8 border-[#2c3e50] shadow-2xl rounded-lg overflow-hidden">
                {/* Roads */}
                <div className="absolute top-1/2 left-0 w-full h-12 bg-gray-400 border-y-4 border-gray-500"></div>
                <div className="absolute top-0 left-1/2 h-full w-12 bg-gray-400 border-x-4 border-gray-500"></div>
                
                {/* Locations */}
                {CAMPUS_LOCATIONS.map(loc => {
                    const isCurrent = careerState.currentLocation === loc.id;
                    const canTravel = !isCurrent; // Can add energy check here

                    return (
                        <button
                            key={loc.id}
                            onClick={() => canTravel && onTravel(loc.id)}
                            disabled={isCurrent}
                            className={`absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                                ${isCurrent ? 'scale-125 z-20 cursor-default' : 'hover:scale-110 cursor-pointer z-10'}
                            `}
                            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                        >
                            {/* Building Icon */}
                            <div className={`w-16 h-16 rounded-lg border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.5)] flex items-center justify-center text-4xl ${loc.color} ${isCurrent ? 'animate-bounce' : ''}`}>
                                {loc.icon}
                            </div>
                            
                            {/* Label */}
                            <div className="mt-2 bg-black text-white px-2 py-1 text-xs font-bold uppercase border-2 border-white shadow-md whitespace-nowrap">
                                {loc.name}
                            </div>

                            {isCurrent && (
                                <div className="absolute -top-10 bg-white text-black px-2 py-1 rounded text-[10px] font-bold animate-pulse">
                                    YOU ARE HERE
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
