import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { GameState, GamePhase, InstrumentType } from '../types';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore';
import { BandMemberVisual } from './BandMemberVisual';
import { getRandomAppearance } from '../constants';

interface CommunityHubProps {
    gameState: GameState;
    setGameState: (state: GameState) => void;
    setPhase: (phase: GamePhase) => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ gameState, setGameState, setPhase }) => {
    const [bands, setBands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBand, setSelectedBand] = useState<any | null>(null);
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
    }>({ isOpen: false, title: '', message: '' });

    useEffect(() => {
        fetchBands();
    }, []);

    const fetchBands = async () => {
        setLoading(true);
        setError(null);
        try {
            const q = query(collection(db, 'community_bands'), orderBy('reputation', 'desc'), limit(50));
            const querySnapshot = await getDocs(q);
            const loadedBands: any[] = [];
            querySnapshot.forEach((doc) => {
                loadedBands.push({ id: doc.id, ...doc.data() });
            });
            setBands(loadedBands);
        } catch (err: any) {
            console.error("Error fetching bands:", err);
            setError("Failed to load community bands. " + err.message);
        }
        setLoading(false);
    };

    const handleBack = () => {
        setPhase(GamePhase.TITLE);
    };

    const handleViewBand = (band: any) => {
        setSelectedBand(band);
    };

    const handlePlayAgainst = () => {
        if (!selectedBand) return;
        
        try {
            const parsedBandData = JSON.parse(selectedBand.bandData);
            
            const eventId = `COMMUNITY_BATTLE_${Date.now()}`;
            const newEvent = {
                id: eventId,
                type: 'Battle of Bands' as any, // EventType.BATTLE
                name: `Community Battle vs ${selectedBand.bandName}`,
                opponent: selectedBand.bandName,
                isHome: false,
                date: gameState.schedule.length > 0 ? gameState.schedule[gameState.schedule.length - 1].date + 7 : 1,
                reward: 2000,
                completed: false,
                level: gameState.identity.schoolType === 'High School' ? 'HS' : 'COLLEGE'
            };

            // Set up a stand battle against this band
            setGameState({
                ...gameState,
                schedule: [...gameState.schedule, newEvent as any],
                rivalIdentity: parsedBandData.identity,
                rivalDirector: selectedBand.directorName,
                rivalMembers: parsedBandData.members,
                activeEventId: eventId,
                mode: 'CAREER', // Ensure we are in a mode that supports this
            });
            
            setPhase(GamePhase.BUS_RIDE);
        } catch (e) {
            setModalConfig({
                isOpen: true,
                title: "Error",
                message: "Error loading band data."
            });
        }
    };

    if (selectedBand) {
        const parsedData = JSON.parse(selectedBand.bandData);
        return (
            <div className="w-full h-full bg-slate-900 p-8 flex flex-col items-center text-white overflow-y-auto">
                <div className="max-w-4xl w-full">
                    <button onClick={() => setSelectedBand(null)} className="text-gray-400 hover:text-white mb-4">
                        &larr; Back to Hub
                    </button>
                    
                    <div className="bg-slate-800 p-8 rounded-xl border-2 border-slate-600 mb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-yellow-400 mb-2">{selectedBand.bandName}</h1>
                                <p className="text-xl text-gray-300">Directed by {selectedBand.directorName}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-400">{selectedBand.reputation} Rep</div>
                                <div className="text-gray-400">{selectedBand.fans.toLocaleString()} Fans</div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold mb-4 border-b border-slate-600 pb-2">Band Info</h3>
                                <p><span className="text-gray-400">Style:</span> {selectedBand.style}</p>
                                <p><span className="text-gray-400">Members:</span> {parsedData.members?.length || 0}</p>
                                <p><span className="text-gray-400">Primary Color:</span> <span className="inline-block w-4 h-4 rounded-full ml-2 align-middle" style={{backgroundColor: parsedData.identity?.primaryColor}}></span></p>
                                <p><span className="text-gray-400">Secondary Color:</span> <span className="inline-block w-4 h-4 rounded-full ml-2 align-middle" style={{backgroundColor: parsedData.identity?.secondaryColor}}></span></p>
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold mb-4 border-b border-slate-600 pb-2">Actions</h3>
                                <Button onClick={handlePlayAgainst} variant="primary" className="w-full mb-3">Challenge to Stand Battle</Button>
                                <Button onClick={() => setModalConfig({ isOpen: true, title: "Liked", message: "Liked!" })} variant="secondary" className="w-full">Like Band</Button>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-xl font-bold mb-4 border-b border-slate-600 pb-2">Band Preview</h3>
                            <div className="flex justify-center items-end h-48 bg-slate-900 rounded-xl overflow-hidden relative">
                                {Array.from({length: Math.min(5, parsedData.members?.length || 5)}).map((_, i) => {
                                    const instruments = [InstrumentType.TUBA, InstrumentType.TROMBONE, InstrumentType.SNARE, InstrumentType.TRUMPET, InstrumentType.SAX];
                                    const uniform = { 
                                        id: `opp_community`, 
                                        name: parsedData.identity?.schoolName || 'Rivals', 
                                        jacketColor: parsedData.identity?.primaryColor || '#000', 
                                        pantsColor: parsedData.identity?.secondaryColor || '#fff', 
                                        hatColor: parsedData.identity?.primaryColor || '#000', 
                                        plumeColor: parsedData.identity?.secondaryColor || '#fff', 
                                        accentColor: parsedData.identity?.secondaryColor || '#fff', 
                                        hatStyle: 'shako', 
                                        jacketStyle: 'classic', 
                                        pantsStyle: 'regular', 
                                        isDrumMajor: false 
                                    };
                                    return (
                                        <div key={i} className="mx-2 transform scale-125">
                                            <BandMemberVisual 
                                                instrument={instruments[i % instruments.length]}
                                                uniform={uniform as any}
                                                appearance={parsedData.members?.[i]?.appearance || getRandomAppearance()}
                                                scale={1}
                                                isPlaying={false}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                {modalConfig.isOpen && (
                    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
                        <div className="bg-slate-900 border-2 border-slate-600 p-6 max-w-sm w-full relative">
                            <h3 className="text-xl font-bold text-white mb-4 font-pixel">{modalConfig.title}</h3>
                            <p className="text-gray-300 mb-6 text-sm">{modalConfig.message}</p>
                            <div className="flex justify-end gap-3">
                                <Button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} variant="primary">OK</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-slate-900 p-8 flex flex-col items-center text-white overflow-y-auto">
            <div className="max-w-4xl w-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-yellow-400 font-pixel">Community Hub</h1>
                    <Button onClick={handleBack} variant="secondary">Back to Menu</Button>
                </div>
                
                <p className="text-gray-300 mb-8 text-center">Browse bands created by other directors around the world!</p>
                
                {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded mb-6">{error}</div>}
                
                {loading ? (
                    <div className="text-center py-12 text-gray-400">Loading community bands...</div>
                ) : bands.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 bg-slate-800 rounded-xl border border-slate-700">
                        No bands uploaded yet. Be the first to upload yours from the Profile menu!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bands.map((band) => (
                            <div key={band.id} className="bg-slate-800 border-2 border-slate-700 p-4 rounded-xl hover:border-blue-500 transition-colors cursor-pointer flex flex-col" onClick={() => handleViewBand(band)}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-white truncate pr-2">{band.bandName}</h3>
                                    <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded font-bold">{band.reputation} Rep</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">Dir. {band.directorName}</p>
                                <div className="mt-auto flex justify-between items-center text-xs text-gray-500">
                                    <span>{band.style}</span>
                                    <span>{band.fans.toLocaleString()} Fans</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {modalConfig.isOpen && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
                    <div className="bg-slate-900 border-2 border-slate-600 p-6 max-w-sm w-full relative">
                        <h3 className="text-xl font-bold text-white mb-4 font-pixel">{modalConfig.title}</h3>
                        <p className="text-gray-300 mb-6 text-sm">{modalConfig.message}</p>
                        <div className="flex justify-end gap-3">
                            <Button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} variant="primary">OK</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
