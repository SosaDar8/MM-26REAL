import React, { useState } from 'react';
import { MediaPost, InstrumentType } from '../types';
import { Button } from './Button';
import { BandMemberVisual } from './BandMemberVisual';
import { DEFAULT_UNIFORMS, getRandomAppearance } from '../constants';

interface BandMediaProps {
    media: MediaPost[];
    onBack: () => void;
}

export const BandMedia: React.FC<BandMediaProps> = ({ media: initialMedia, onBack }) => {
    const [media, setMedia] = useState<MediaPost[]>(initialMedia);
    const [filter, setFilter] = useState<'ALL' | 'NEWS' | 'SOCIAL' | 'RIVAL'>('ALL');
    const [tweetText, setTweetText] = useState("");

    // Filter logic
    const filteredFeed = media.filter(p => filter === 'ALL' || p.type === filter || (filter === 'SOCIAL' && p.type === 'FAN_REACTION'));

    const handlePostTweet = () => {
        if (!tweetText.trim()) return;
        
        const newPost: MediaPost = {
            id: `my-tweet-${Date.now()}`,
            author: "Director",
            handle: "@TheDirector",
            content: tweetText,
            likes: 0,
            shares: 0,
            timestamp: "Just now",
            type: 'SOCIAL',
            sentiment: 'NEUTRAL',
            avatarColor: '#eab308'
        };

        setMedia([newPost, ...media]);
        setTweetText("");
    };

    // Helper to generate visual mock content for feed posts (clips/photos)
    const renderVisualMock = (post: MediaPost) => {
        const isVideo = post.mediaType === 'VIDEO';

        return (
            <div className={`w-full h-48 bg-gray-800 relative overflow-hidden flex items-center justify-center border-2 border-white rounded-lg mt-2`}>
                {/* Background Pattern */}
                <div className={`absolute inset-0 opacity-50 ${post.visualStyle || 'bg-blue-900'}`}></div>
                
                {/* Simulated Content */}
                <div className="relative z-10 transform scale-75 flex gap-2">
                    <BandMemberVisual 
                        instrument={InstrumentType.SNARE} 
                        uniform={DEFAULT_UNIFORMS[0]} 
                        appearance={getRandomAppearance()} 
                        scale={0.8}
                        isPlaying={isVideo} 
                    />
                     <BandMemberVisual 
                        instrument={InstrumentType.TRUMPET} 
                        uniform={DEFAULT_UNIFORMS[0]} 
                        appearance={getRandomAppearance()} 
                        scale={0.8}
                        isPlaying={isVideo}
                    />
                </div>

                {/* Video Overlay */}
                {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20 cursor-pointer hover:bg-black/10">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center pl-1 shadow-lg">
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-black border-b-[8px] border-b-transparent"></div>
                        </div>
                    </div>
                )}
                {post.mediaType === 'PHOTO' && (
                    <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 text-[10px] rounded text-white font-bold">
                        IMG
                    </div>
                )}
            </div>
        );
    };

    const renderPost = (post: MediaPost) => {
        let borderColor = 'border-gray-700';
        let badge = null;

        if (post.type === 'NEWS') {
            borderColor = 'border-blue-500';
            badge = <span className="bg-blue-600 text-xs px-2 py-0.5 rounded text-white font-bold ml-2">NEWS</span>;
        } else if (post.type === 'RIVAL') {
            borderColor = 'border-red-500';
            badge = <span className="bg-red-600 text-xs px-2 py-0.5 rounded text-white font-bold ml-2">RIVAL</span>;
        } else if (post.sentiment === 'POSITIVE') {
            borderColor = 'border-green-500';
        }

        return (
            <div key={post.id} className={`bg-gray-800 p-4 border-l-4 ${borderColor} shadow-lg rounded-r-lg mb-4 animate-fade-in`}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm border border-white/20"
                            style={{ backgroundColor: post.avatarColor || '#666' }}
                        >
                            {post.author[0]}
                        </div>
                        <div>
                            <div className="font-bold text-sm flex items-center">
                                {post.author}
                                {badge}
                            </div>
                            <div className="text-xs text-gray-400">{post.handle}</div>
                        </div>
                    </div>
                    <span className="text-xs text-gray-500">{post.timestamp}</span>
                </div>
                
                <p className="text-md text-gray-200 mb-3 leading-relaxed">
                    {post.content}
                </p>
                
                {/* Embed Visual in Feed if exists */}
                {(post.mediaType === 'PHOTO' || post.mediaType === 'VIDEO') && renderVisualMock(post)}

                <div className="flex items-center gap-6 text-xs text-gray-400 font-mono border-t border-gray-700 pt-3 mt-2">
                    <span className="flex items-center gap-1 cursor-pointer hover:text-red-400 transition-colors">
                        ♥ {post.likes}
                    </span>
                    <span className="flex items-center gap-1 cursor-pointer hover:text-blue-400 transition-colors">
                        ↻ {post.shares || 0}
                    </span>
                    <span className="cursor-pointer hover:text-white transition-colors">Reply</span>
                    <span className="cursor-pointer hover:text-white transition-colors">Share</span>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full bg-slate-900 text-white flex flex-col relative">
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-slate-950 shadow-md z-10">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🐦</span>
                    <h1 className="text-2xl text-blue-400 font-black tracking-tight italic">InstaTweet</h1>
                </div>
                <Button onClick={onBack} variant="secondary" className="text-xs py-2 px-4">CLOSE</Button>
            </header>

            <div className="flex flex-grow overflow-hidden relative">
                
                {/* Sidebar Filters */}
                <div className="w-48 bg-black p-4 border-r border-gray-800 hidden md:block">
                    <h3 className="text-gray-500 text-xs font-bold mb-4 uppercase tracking-widest">Trending</h3>
                    <div className="space-y-2">
                        {['ALL', 'NEWS', 'SOCIAL', 'RIVAL'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`w-full text-left p-2 text-sm rounded transition-colors ${filter === f ? 'bg-blue-900 text-white font-bold' : 'text-gray-400 hover:bg-gray-800'}`}
                            >
                                #{f.toLowerCase()}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 p-3 bg-gray-900 rounded border border-gray-700">
                        <h4 className="text-yellow-400 font-bold text-xs mb-2 uppercase">Who to Follow</h4>
                        <ul className="text-xs text-gray-400 space-y-2">
                            <li className="hover:text-white cursor-pointer flex items-center gap-2"><div className="w-4 h-4 bg-purple-500 rounded-full"></div> @band_memes</li>
                            <li className="hover:text-white cursor-pointer flex items-center gap-2"><div className="w-4 h-4 bg-orange-500 rounded-full"></div> @drumline_daily</li>
                        </ul>
                    </div>
                </div>

                {/* Main Feed Content */}
                <div className="flex-grow p-4 overflow-y-auto bg-slate-900 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    <div className="max-w-xl mx-auto">
                        {/* Tweet Input */}
                        <div className="bg-gray-800 p-4 rounded mb-6 border border-gray-700 shadow-sm">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-yellow-500 border-2 border-white/20 flex items-center justify-center font-bold text-black">D</div>
                                <input 
                                    type="text" 
                                    placeholder="What's happening in the band room?" 
                                    className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-sm"
                                    value={tweetText}
                                    onChange={(e) => setTweetText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handlePostTweet()}
                                />
                            </div>
                            <div className="flex justify-end mt-2">
                                <button 
                                    onClick={handlePostTweet}
                                    disabled={!tweetText.trim()}
                                    className={`text-white text-xs font-bold px-4 py-1 rounded-full ${tweetText.trim() ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-900 opacity-50 cursor-not-allowed'}`}
                                >
                                    Tweet
                                </button>
                            </div>
                        </div>
                        
                        {filteredFeed.length === 0 ? (
                            <div className="text-center text-gray-500 py-20">
                                <div className="text-4xl mb-2">📭</div>
                                <p>No tweets available yet.</p>
                            </div>
                        ) : (
                            filteredFeed.map(renderPost)
                        )}
                        
                        <div className="text-center py-8 text-gray-600 text-xs uppercase tracking-widest">
                            - End of Feed -
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};