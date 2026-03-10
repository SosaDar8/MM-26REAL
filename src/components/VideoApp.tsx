
import React, { useState, useMemo } from 'react';
import { GameState, VideoContent, Uniform, InstrumentType } from '../types';
import { Button } from './Button';
import { VIDEO_TITLES, DEFAULT_UNIFORMS, getRandomAppearance, SCHOOL_PREFIXES, SCHOOL_NOUNS, BAND_NOUNS, BAND_ADJECTIVES, COLORS } from '../constants';
import { BandMemberVisual } from './BandMemberVisual';

interface VideoAppProps {
    gameState: GameState;
    onBack: () => void;
}

export const VideoApp: React.FC<VideoAppProps> = ({ gameState, onBack }) => {
    const [view, setView] = useState<'FEED' | 'CHANNEL' | 'UPLOAD'>('FEED');
    const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
    const [uploadStep, setUploadStep] = useState(0);
    const [uploadTitle, setUploadTitle] = useState("");
    const [selectedThumbnail, setSelectedThumbnail] = useState<number | null>(null);

    // Mock Upload Logic
    const handleUpload = () => {
        const newVideo: VideoContent = {
            id: `vid-${Date.now()}`,
            title: uploadTitle || "Untitled Performance",
            views: 0,
            comments: 0,
            likes: 0,
            duration: "2:30",
            thumbnailId: selectedThumbnail || 0,
            uploadedAt: Date.now()
        };
        
        const event = new CustomEvent('mf-phone-action', { detail: { action: 'UPLOAD_VIDEO', data: newVideo } });
        window.dispatchEvent(event);
        
        alert("Video Uploaded to Channel!");
        setView('CHANNEL');
        setUploadStep(0);
        setUploadTitle("");
        setSelectedThumbnail(null);
    };

    // Helper to generate a random band name deterministically based on index
    const generateIdentity = (index: number) => {
        const prefix = SCHOOL_PREFIXES[index % SCHOOL_PREFIXES.length];
        const noun = SCHOOL_NOUNS[(index * 3) % SCHOOL_NOUNS.length];
        const bandAdj = BAND_ADJECTIVES[(index * 7) % BAND_ADJECTIVES.length];
        const bandNoun = BAND_NOUNS[(index * 2) % BAND_NOUNS.length];
        
        // Deterministic colors
        const color1 = COLORS[index % COLORS.length].hex;
        const color2 = COLORS[(index + 5) % COLORS.length].hex;

        return {
            school: `${prefix} ${noun}`,
            band: `The ${bandAdj} ${bandNoun}`,
            colors: [color1, color2]
        };
    };

    // Generate dynamic videos for Feed
    const feedVideos = useMemo(() => {
        const seed = gameState.fans + gameState.funds; 
        const count = 12;
        const videos = [];
        
        for(let i = 0; i < count; i++) {
            const identity = generateIdentity(i + seed); // Use seed so they change over time
            const rivalIdentity = generateIdentity(i + seed + 50);
            
            const baseTitle = VIDEO_TITLES[i % VIDEO_TITLES.length];
            const title = baseTitle
                .replace('{bandName}', identity.band)
                .replace('{rivalName}', rivalIdentity.school);

            // Create a fake uniform for the thumbnail
            const videoUniform: Uniform = {
                id: `vid_u_${i}`,
                name: 'Vid',
                jacketColor: identity.colors[0],
                pantsColor: identity.colors[1],
                hatColor: identity.colors[0],
                plumeColor: identity.colors[1],
                accentColor: identity.colors[1],
                shoeColor: '#000000',
                gloveColor: '#ffffff',
                hatStyle: i % 3 === 0 ? 'stetson' : 'shako',
                jacketStyle: i % 2 === 0 ? 'military' : 'classic',
                pantsStyle: 'regular',
                isDrumMajor: false
            };

            videos.push({
                id: `feed-${i}`,
                title: title,
                views: Math.floor((seed * (i + 1) * 392) % 900000 + 1000).toLocaleString(),
                timeAgo: `${(i % 12) + 1} hours ago`,
                duration: `${2 + (i%3)}:${10 + (i*5)%50}`,
                channel: i % 2 === 0 ? identity.school + " Media" : "BandReacts",
                verified: i % 3 === 0,
                thumbnailId: i,
                uniform: videoUniform
            });
        }
        return videos;
    }, [gameState.fans, gameState.funds]);

    const myVideos = gameState.uploadedVideos || [];

    const renderThumbnail = (id: number, isUploadPreview = false, customUniform?: Uniform) => {
        const bgColors = ['bg-red-900', 'bg-blue-900', 'bg-purple-900', 'bg-gray-800'];
        const bgColor = bgColors[id % bgColors.length];
        
        // Use provided uniform or fallback to user's main uniform
        const displayUniform = customUniform || gameState.uniforms[0];

        return (
            <div className={`w-full aspect-video ${bgColor} relative overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300 ${selectedThumbnail === id && isUploadPreview ? 'ring-4 ring-yellow-400' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <div className="flex items-end justify-center transform scale-75 gap-2 z-0">
                    <BandMemberVisual instrument={InstrumentType.SNARE} uniform={displayUniform} appearance={getRandomAppearance()} isPlaying={true} />
                    {id % 2 === 0 && <BandMemberVisual instrument={InstrumentType.TUBA} uniform={displayUniform} appearance={getRandomAppearance()} isPlaying={true} />}
                </div>
                {!isUploadPreview && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1 rounded z-20 font-bold">2:30</div>
                )}
            </div>
        );
    };

    return (
        <div className="h-full bg-[#0f0f0f] text-white flex flex-col font-sans">
            {/* Header */}
            <header className="flex items-center justify-between p-3 bg-[#202020] shadow-sm z-10 border-b border-[#303030]">
                <div className="flex items-center gap-1">
                    <div className="w-8 h-6 bg-red-600 rounded-lg flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-white border-b-[4px] border-b-transparent ml-1"></div>
                    </div>
                    <h1 className="font-bold text-lg tracking-tighter">MeTube</h1>
                </div>
                <div className="flex gap-4 text-sm font-bold">
                    <button onClick={() => setView('FEED')} className={view === 'FEED' ? 'text-white' : 'text-gray-500'}>Home</button>
                    <button onClick={() => setView('CHANNEL')} className={view === 'CHANNEL' ? 'text-white' : 'text-gray-500'}>My Channel</button>
                    <button onClick={() => setView('UPLOAD')} className="text-red-500">+ Upload</button>
                    <Button onClick={onBack} variant="secondary" className="text-[10px] py-1 px-2 h-auto">EXIT</Button>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-600">
                
                {view === 'UPLOAD' && (
                    <div className="max-w-2xl mx-auto bg-[#1a1a1a] p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-6">Upload Video</h2>
                        
                        {uploadStep === 0 && (
                            <div className="space-y-4">
                                <label className="block text-gray-400 text-sm">Select Thumbnail</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[0, 1, 2, 3, 4, 5].map(i => (
                                        <div key={i} onClick={() => setSelectedThumbnail(i)} className="cursor-pointer">
                                            {renderThumbnail(i, true)}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end mt-4">
                                    <Button disabled={selectedThumbnail === null} onClick={() => setUploadStep(1)}>NEXT</Button>
                                </div>
                            </div>
                        )}

                        {uploadStep === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Video Title</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-[#333] border border-gray-600 p-2 text-white rounded"
                                        placeholder="e.g. EPIC Drumline Battle!"
                                        value={uploadTitle}
                                        onChange={(e) => setUploadTitle(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-between mt-8">
                                    <Button onClick={() => setUploadStep(0)} variant="secondary">BACK</Button>
                                    <Button disabled={!uploadTitle} onClick={handleUpload} variant="success">PUBLISH</Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {view === 'CHANNEL' && (
                    <div className="max-w-4xl mx-auto">
                        {/* Channel Banner */}
                        <div className="h-32 bg-gradient-to-r from-blue-900 to-purple-900 rounded-t-lg relative mb-4">
                            <div className="absolute -bottom-8 left-8 flex items-end gap-4">
                                <div className="w-24 h-24 rounded-full bg-black border-4 border-[#0f0f0f] flex items-center justify-center text-3xl">
                                    🎺
                                </div>
                                <div className="mb-2">
                                    <h1 className="text-2xl font-bold">{gameState.bandName || "My Band"} Official</h1>
                                    <p className="text-gray-400 text-sm">{gameState.fans} Subscribers</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-12">
                            <h3 className="font-bold text-lg mb-4 border-b border-gray-700 pb-2">Uploads</h3>
                            {myVideos.length === 0 ? (
                                <div className="text-center text-gray-500 py-10">
                                    <p>No videos uploaded yet.</p>
                                    <button onClick={() => setView('UPLOAD')} className="text-blue-400 text-sm mt-2">Upload your first video!</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {myVideos.map((vid, idx) => (
                                        <div key={idx} className="cursor-pointer group">
                                            <div className="rounded-lg overflow-hidden relative">
                                                {renderThumbnail(vid.thumbnailId)}
                                            </div>
                                            <h3 className="font-bold text-sm mt-2">{vid.title}</h3>
                                            <p className="text-xs text-gray-400">{vid.views} views • {new Date(vid.uploadedAt).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {view === 'FEED' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                        {feedVideos.map(video => (
                            <div key={video.id} className="cursor-pointer group">
                                <div className="rounded-lg overflow-hidden relative">
                                    {renderThumbnail(video.thumbnailId, false, video.uniform)}
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 mt-1 flex items-center justify-center font-bold text-[10px]">
                                        {video.channel[0]}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-sm font-bold leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {video.title}
                                        </h3>
                                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                            {video.channel} {video.verified && <span className="bg-gray-600 rounded-full w-3 h-3 flex items-center justify-center text-[8px]">✔</span>}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {video.views} views • {video.timeAgo}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
    