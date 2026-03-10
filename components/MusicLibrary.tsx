
import React from 'react';
import { MusicTrack } from '../types';
import { Button } from './Button';
import { soundManager } from '../services/soundManager';

interface MusicLibraryProps {
    tracks: MusicTrack[];
    onImport: (track: MusicTrack) => void;
    onBack: () => void;
}

export const MusicLibrary: React.FC<MusicLibraryProps> = ({ tracks, onImport, onBack }) => {
    // Note: The Sequencer has been moved to the Director's Laptop (FuseCore app).
    // This component now serves as a playback library viewer.

    return (
        <div className="h-full bg-slate-900 text-white p-8 overflow-hidden flex flex-col">
            <header className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
                <h1 className="text-4xl text-orange-500 font-mono">MUSIC LIBRARY</h1>
                <div className="flex gap-2">
                    <Button onClick={onBack} variant="secondary">BACK</Button>
                </div>
            </header>

            <div className="flex-grow bg-slate-950 border-2 border-gray-800 overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-900 text-gray-400 text-sm sticky top-0">
                        <tr>
                            <th className="p-4">TITLE</th>
                            <th className="p-4">ARTIST</th>
                            <th className="p-4">BPM</th>
                            <th className="p-4">TYPE</th>
                            <th className="p-4">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {tracks.map(track => (
                            <tr key={track.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 font-bold text-white flex items-center gap-2">
                                    <button onClick={() => { 
                                        soundManager.stopSequence(); 
                                        if(track.audioUrl) {
                                            soundManager.playAudioUrl(track.audioUrl);
                                        } else if(track.sequence) {
                                            soundManager.startSequence(track.sequence, track.bpm); 
                                        }
                                    }} className="text-xs bg-green-600 px-2 py-1 rounded hover:bg-green-500">▶ PLAY</button>
                                    {track.title}
                                </td>
                                <td className="p-4 text-gray-300">{track.artist}</td>
                                <td className="p-4 font-mono text-yellow-500">{track.bpm}</td>
                                <td className="p-4">
                                    {track.isCustom 
                                        ? <span className="px-2 py-1 text-xs rounded bg-purple-900 text-purple-300">CUSTOM</span>
                                        : <span className="bg-gray-800 text-gray-400 px-2 py-1 text-xs rounded">DEFAULT</span>
                                    }
                                </td>
                                <td className="p-4">
                                    {track.isCustom && (
                                        <span className="text-xs text-gray-500">Edit in Office Laptop</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
                Go to the Director's Office {'>'} Workstation {'>'} FuseCore to create new tracks.
            </div>
        </div>
    );
};
