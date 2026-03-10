import React from 'react';
import { Moment } from '../types';
import { Button } from './Button';

interface MomentsGalleryProps {
    moments: Moment[];
    onBack: () => void;
}

export const MomentsGallery: React.FC<MomentsGalleryProps> = ({ moments, onBack }) => {
    return (
        <div className="h-full bg-slate-900 text-white p-8">
             <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
                <h1 className="text-4xl text-cyan-400 font-mono">MOMENTS GALLERY</h1>
                <Button onClick={onBack} variant="secondary">BACK</Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moments.map(moment => (
                    <div key={moment.id} className="bg-black border-4 border-white p-2 shadow-[8px_8px_0_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform cursor-pointer">
                        <div className="w-full h-48 mb-2 flex items-center justify-center bg-gray-800" style={{ backgroundColor: moment.thumbnailColor }}>
                            <span className="text-6xl opacity-50">📷</span>
                        </div>
                        <div className="bg-white text-black p-3 font-mono">
                            <div className="font-bold text-lg">{moment.title}</div>
                            <div className="text-xs text-gray-500 mb-2">{moment.date}</div>
                            <p className="text-sm">{moment.description}</p>
                        </div>
                    </div>
                ))}
                
                {/* Empty State / Placeholder */}
                {moments.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-20">
                        No moments captured yet. Play games to save highlights!
                    </div>
                )}
            </div>
        </div>
    );
};