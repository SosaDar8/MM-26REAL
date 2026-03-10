
import React, { useState, useEffect } from 'react';
import { GameState, GamePhase, CareerState, CutsceneData, Perk, Notification } from '../types';
import { Button } from './Button';
import { SCHOOLS_DATA, SHOP_ITEMS, RECRUIT_NAMES, RECRUIT_SURNAMES, getRandomAppearance, DEFAULT_UNIFORMS, MINI_ACHIEVEMENTS } from '../constants';
import { CutsceneOverlay } from './CutsceneOverlay';
import { soundManager } from '../services/soundManager';
import { BandMemberVisual } from './BandMemberVisual';
import { StandBattle } from './StandBattle';

interface CareerHubProps {
    gameState: GameState;
    setPhase: (phase: GamePhase) => void;
    onStartEvent: (eventId: string) => void;
    updateCareerState: (updates: Partial<CareerState>) => void;
    setGameState?: React.Dispatch<React.SetStateAction<GameState>>;
}

const RANK_TITLES = ["P4 (ALTERNATE)", "P3 (RESERVE)", "P2 (CORE)", "P1 (STARTER)", "SECTION LEADER"];
const RANK_REQS = [0, 30, 50, 70, 90]; // Skill requirements

const PERK_TREE: Perk[] = [
    { id: 'iron_lung', name: 'Iron Lungs', description: '+20 Max Energy', cost: 1, icon: '🫁', unlocked: false, effect: 'ENERGY', value: 20 },
    { id: 'honor_roll', name: 'Grade Curve', description: 'Academics drain 50% slower', cost: 1, icon: '🎓', unlocked: false, effect: 'ACADEMIC', value: 0.5 },
    { id: 'soloist', name: 'Soloist', description: '+10% Skill Gain from Practice', cost: 2, icon: '🎺', unlocked: false, effect: 'SKILL', value: 1.1 },
    { id: 'hype_man', name: 'Hype Man', description: 'Start battles with 20 Momentum', cost: 2, icon: '🔥', unlocked: false, effect: 'SOCIAL', value: 20 },
    { id: 'legacy', name: 'Legacy', description: 'Alumni donations count for you', cost: 3, icon: '🏆', unlocked: false, effect: 'SOCIAL', value: 1 }
];

const CampusFeed: React.FC<{ schoolName: string }> = ({ schoolName }) => {
    const [posts, setPosts] = useState<string[]>([]);

    useEffect(() => {
        const templates = [
            `Someone lost their mouthpiece on the field again...`,
            `${schoolName} drumline is sounding CLEAN today! 🔥`,
            `Midterms are killing me. Send help.`,
            `Who's ready for the big game?`,
            `Sectionals at 6am? Why??`,
            `I heard the director is planning a new closer.`,
            `Band party at the quad tonight!`,
            `Just saw a freshman marching out of step. RIP.`
        ];
        // Pick 3 random posts
        const shuffled = [...templates].sort(() => 0.5 - Math.random());
        setPosts(shuffled.slice(0, 3));
    }, [schoolName]);

    return (
        <div className="bg-slate-800 p-4 border-t-4 border-blue-500">
            <h3 className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">CAMPUS FEED</h3>
            <div className="space-y-2">
                {posts.map((post, i) => (
                    <div key={i} className="text-xs text-gray-300 border-b border-gray-700 pb-1 last:border-0">
                        <span className="text-gray-500 font-bold">@bandkid{Math.floor(Math.random()*99)}:</span> {post}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const CareerHub: React.FC<CareerHubProps> = ({ gameState, setPhase, onStartEvent, updateCareerState, setGameState }) => {
    if (!gameState.career) return null;

    const [currentCutscene, setCurrentCutscene] = useState<CutsceneData | null>(null);
    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ACADEMICS' | 'SECTION' | 'PERKS'>('DASHBOARD');
    const [challengeActive, setChallengeActive] = useState(false);
    
    // Study Session State
    const [studyActive, setStudyActive] = useState(false);
    const [studyProgress, setStudyProgress] = useState(0);
    
    const career = gameState.career;
    const upcomingEvents = gameState.schedule.sort((a, b) => a.date - b.date);
    const nextEvent = upcomingEvents.find(e => !e.completed);

    // Initialize Perks if missing (migration)
    useEffect(() => {
        if (!career.perks) {
            updateCareerState({ perks: PERK_TREE, skillPoints: 0, rankIndex: 0, history: [] });
        }
    }, []);

    const triggerAchievement = (id: string) => {
        if (!setGameState) return;
        
        // Check if already unlocked
        if (gameState.shownNotifications?.includes(id)) return;

        const ach = MINI_ACHIEVEMENTS.find(a => a.id === id);
        if (ach) {
            // Show notification logic would go here if we had access to the notification system directly
            // Instead we update the state which the main App listens to or renders
            setGameState(prev => ({
                ...prev,
                shownNotifications: [...(prev.shownNotifications || []), id],
                // We can also add a temporary notification to the feed or similar if needed
            }));
            alert(`🏆 ACHIEVEMENT UNLOCKED: ${ach.title}\n${ach.description}`);
            soundManager.playSuccess();
        }
    };

    const performAction = (type: 'CLASS' | 'PRACTICE' | 'REST' | 'WORK', cost: number) => {
        if (career.timeSlots <= 0) { alert("No Time Slots left today!"); return; }
        if (career.energy < cost && type !== 'REST') { alert("Too tired!"); return; }

        let updates: Partial<CareerState> = { 
            timeSlots: career.timeSlots - 1,
            energy: Math.max(0, career.energy - cost)
        };

        if (type === 'CLASS') {
            updates.academics = Math.min(100, career.academics + (Math.random() > 0.5 ? 10 : 5));
            soundManager.playClick();
            if (updates.academics >= 100) triggerAchievement('nerd_alert');
        } else if (type === 'PRACTICE') {
            const multi = career.perks?.find(p => p.id === 'soloist' && p.unlocked) ? 1.2 : 1.0;
            const skillGain = Math.floor((Math.random() * 5 + 5) * multi);
            updates.skill = Math.min(100, career.skill + skillGain);
            updates.xp = (career.xp || 0) + 50;
            soundManager.playDrumHit();
            triggerAchievement('first_practice');
            if (updates.skill >= 100) triggerAchievement('virtuoso');
        } else if (type === 'REST') {
            updates.energy = Math.min(100 + (career.perks?.find(p => p.id === 'iron_lung' && p.unlocked) ? 20 : 0), career.energy + 50);
        } else if (type === 'WORK' && career.currentJob) {
            updates.wallet = (career.wallet || 0) + career.currentJob.wage;
            soundManager.playSuccess();
            triggerAchievement('payday');
        }

        updateCareerState(updates);
        setCurrentCutscene({ id: Date.now().toString(), type: type === 'REST' ? 'NAP' : type as any, text: '', duration: 1500 });
    };

    const handleStudySession = () => {
        if (career.timeSlots <= 0) { alert("No Time Slots left today!"); return; }
        if (career.energy < 15) { alert("Too tired!"); return; }
        setStudyActive(true);
        setStudyProgress(0);
    };

    const clickStudy = () => {
        const newProgress = studyProgress + 10;
        setStudyProgress(newProgress);
        soundManager.playClick();
        if (newProgress >= 100) {
            setStudyActive(false);
            performAction('CLASS', 15); // Deduct energy/time and grant stats
            alert("Study Session Complete! Academics Increased.");
        }
    };

    const handleChallengeWin = (reward: number) => {
        setChallengeActive(false);
        const nextRankIdx = (career.rankIndex || 0) + 1;
        const newRankTitle = RANK_TITLES[Math.min(nextRankIdx, RANK_TITLES.length - 1)];
        
        updateCareerState({
            rankIndex: nextRankIdx,
            rank: newRankTitle as any,
            xp: (career.xp || 0) + 500,
            skillPoints: (career.skillPoints || 0) + 1,
            history: [...(career.history || []), `Defeated rival to become ${newRankTitle}`]
        });
        triggerAchievement('rank_up');
        alert(`VICTORY! YOU ARE NOW ${newRankTitle}!`);
    };

    const handleChallengeLoss = () => {
        setChallengeActive(false);
        updateCareerState({ energy: Math.max(0, career.energy - 20) });
        alert("DEFEAT. Practice more and try again tomorrow.");
    };

    const unlockPerk = (perkId: string) => {
        const perk = career.perks?.find(p => p.id === perkId);
        if (perk && !perk.unlocked && (career.skillPoints || 0) >= perk.cost) {
            const newPerks = career.perks!.map(p => p.id === perkId ? { ...p, unlocked: true } : p);
            updateCareerState({
                perks: newPerks,
                skillPoints: (career.skillPoints || 0) - perk.cost
            });
            soundManager.playSuccess();
        }
    };

    const renderDashboard = () => (
        <div className="flex gap-6 h-full">
            <div className="w-1/3 flex flex-col gap-4">
                {/* ID CARD */}
                <div className="bg-white text-black p-4 border-l-8 border-yellow-500 shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-black uppercase italic">{career.playerName}</h2>
                            <div className="text-xs text-gray-500 font-bold">{career.level} • {career.instrument}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-400 font-bold">RANK</div>
                            <div className="text-xl font-black text-blue-600">{RANK_TITLES[career.rankIndex || 0]}</div>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold">
                        <div className="bg-gray-100 p-2 rounded">
                            <div className="text-gray-400">GPA</div>
                            <div className={career.academics < 2.0 ? 'text-red-500' : 'text-green-600'}>{(career.academics / 25).toFixed(1)}</div>
                        </div>
                        <div className="bg-gray-100 p-2 rounded">
                            <div className="text-gray-400">SKILL</div>
                            <div className="text-blue-600">{career.skill}</div>
                        </div>
                        <div className="bg-gray-100 p-2 rounded">
                            <div className="text-gray-400">ENERGY</div>
                            <div className="text-purple-600">{career.energy}</div>
                        </div>
                    </div>
                </div>

                {/* AGENDA */}
                <div className="bg-slate-800 border-2 border-slate-600 p-4 flex-grow flex flex-col">
                    <div className="flex justify-between mb-4 border-b border-gray-600 pb-2">
                        <span className="font-bold text-yellow-400">DAILY ACTIONS</span>
                        <span className="text-xs bg-black px-2 py-1 rounded">{career.timeSlots} SLOTS LEFT</span>
                    </div>
                    <div className="space-y-2">
                        <button onClick={() => setActiveTab('ACADEMICS')} className="w-full bg-blue-900 border border-blue-500 p-3 flex justify-between items-center hover:bg-blue-800">
                            <span>📚 Attend Class</span>
                            <span className="text-xs text-blue-300">-15 Energy</span>
                        </button>
                        <button onClick={() => performAction('PRACTICE', 25)} className="w-full bg-green-900 border border-green-500 p-3 flex justify-between items-center hover:bg-green-800">
                            <span>🎺 Practice Drill</span>
                            <span className="text-xs text-green-300">-25 Energy</span>
                        </button>
                        {career.currentJob && (
                            <button onClick={() => performAction('WORK', 20)} className="w-full bg-yellow-900 border border-yellow-500 p-3 flex justify-between items-center hover:bg-yellow-800">
                                <span>💵 Work Shift</span>
                                <span className="text-xs text-yellow-300">+${career.currentJob.wage}</span>
                            </button>
                        )}
                        <button onClick={() => performAction('REST', 0)} className="w-full bg-purple-900 border border-purple-500 p-3 flex justify-between items-center hover:bg-purple-800">
                            <span>💤 Power Nap</span>
                            <span className="text-xs text-purple-300">+Energy</span>
                        </button>
                    </div>
                </div>
                
                <CampusFeed schoolName={gameState.identity.schoolName} />
            </div>

            <div className="w-2/3 flex flex-col relative">
                {/* VISUALIZER */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
                <div className="flex-grow flex items-end justify-center pb-12 relative">
                    <div className="transform scale-[2.5]">
                        <BandMemberVisual 
                            instrument={career.instrument}
                            uniform={career.casualOutfit ? { ...DEFAULT_UNIFORMS[0], jacketColor: career.casualOutfit.topColor, pantsColor: career.casualOutfit.bottomColor, hatStyle: 'none' as any } : { ...DEFAULT_UNIFORMS[0], hatStyle: 'none' as any }}
                            appearance={career.playerAppearance}
                            isPlaying={false}
                        />
                    </div>
                    <div className="absolute bottom-4 bg-black/80 px-6 py-2 rounded-full border border-white/20">
                        <span className="text-xs text-gray-400">CURRENT STATUS: </span>
                        <span className="text-green-400 font-bold animate-pulse">READY</span>
                    </div>
                </div>

                {/* NEXT EVENT */}
                {nextEvent && (
                    <div className="bg-red-900 border-t-4 border-red-600 p-6 flex justify-between items-center shadow-lg relative z-10">
                        <div>
                            <div className="text-xs text-red-200 font-bold uppercase mb-1">UPCOMING EVENT</div>
                            <div className="text-2xl font-black italic">{nextEvent.name}</div>
                            <div className="text-sm opacity-75">vs {nextEvent.opponent || 'TBA'}</div>
                        </div>
                        <Button 
                            onClick={() => onStartEvent(nextEvent.id)} 
                            disabled={career.timeSlots > 0} 
                            className={`px-8 py-4 text-xl ${career.timeSlots > 0 ? 'opacity-50 cursor-not-allowed' : 'animate-bounce'}`}
                        >
                            {career.timeSlots > 0 ? "FINISH AGENDA" : "START EVENT"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSectionLadder = () => {
        const currentRankIdx = career.rankIndex || 0;
        const nextRankReq = RANK_REQS[currentRankIdx + 1];
        const canChallenge = nextRankReq && career.skill >= nextRankReq && career.energy >= 50;

        // Mock Ladder NPCs
        const ladder = [
            { rank: 4, title: "SECTION LEADER", name: "Travis", color: "bg-yellow-500", boss: true },
            { rank: 3, title: "P1 (STARTER)", name: "Jessica", color: "bg-green-500" },
            { rank: 2, title: "P2 (CORE)", name: "Marcus", color: "bg-blue-500" },
            { rank: 1, title: "P3 (RESERVE)", name: "Alex", color: "bg-gray-500" },
            { rank: 0, title: "P4 (ALTERNATE)", name: "You", color: "bg-gray-700" }
        ];

        return (
            <div className="h-full flex gap-8 p-4">
                <div className="w-1/2 flex flex-col gap-2 overflow-y-auto">
                    <h2 className="text-2xl font-black text-yellow-400 mb-4 border-b-2 border-yellow-600 pb-2">SECTION HIERARCHY</h2>
                    {ladder.map((spot, i) => {
                        const isPlayer = spot.rank === currentRankIdx;
                        const isNextTarget = spot.rank === currentRankIdx + 1;
                        
                        return (
                            <div key={i} className={`p-4 border-l-8 ${isPlayer ? 'border-yellow-400 bg-white/10' : 'border-gray-700 bg-black/40'} flex justify-between items-center transition-all`}>
                                <div>
                                    <div className={`text-xs font-bold ${isPlayer ? 'text-yellow-400' : 'text-gray-500'}`}>{spot.title}</div>
                                    <div className="text-xl font-bold">{isPlayer ? career.playerName : spot.name}</div>
                                </div>
                                {isNextTarget && (
                                    <Button 
                                        disabled={!canChallenge} 
                                        onClick={() => setChallengeActive(true)}
                                        className={`text-xs px-4 ${canChallenge ? 'bg-red-600 animate-pulse' : 'bg-gray-700'}`}
                                    >
                                        {canChallenge ? "CHALLENGE" : `REQ: SKILL ${nextRankReq}`}
                                    </Button>
                                )}
                                {isPlayer && <div className="text-xs bg-yellow-500 text-black px-2 py-1 font-bold rounded">YOU</div>}
                            </div>
                        );
                    })}
                </div>
                
                <div className="w-1/2 bg-black border-4 border-red-600 p-6 flex flex-col items-center justify-center relative shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
                    <h3 className="text-3xl font-black text-red-500 mb-2 italic">CHALLENGE COURT</h3>
                    <div className="text-center text-gray-400 text-sm mb-8">
                        Prove your worth. Defeat the member above you in a rhythmic duel to take their spot.
                    </div>
                    <div className="flex items-end justify-center gap-12 mb-8">
                        <div className="text-center">
                            <div className="w-24 h-32 bg-gray-800 border-2 border-white mb-2">
                                <BandMemberVisual instrument={career.instrument} uniform={DEFAULT_UNIFORMS[0]} appearance={career.playerAppearance} scale={1.2} />
                            </div>
                            <div className="font-bold text-yellow-400">YOU</div>
                        </div>
                        <div className="text-4xl font-black text-red-600 italic">VS</div>
                        <div className="text-center opacity-50">
                            <div className="w-24 h-32 bg-gray-800 border-2 border-gray-600 mb-2 grayscale">
                                <BandMemberVisual instrument={career.instrument} uniform={DEFAULT_UNIFORMS[0]} appearance={getRandomAppearance()} scale={1.2} />
                            </div>
                            <div className="font-bold">RIVAL</div>
                        </div>
                    </div>
                    {canChallenge ? (
                        <p className="text-green-400 font-bold animate-pulse">YOU ARE READY.</p>
                    ) : (
                        <p className="text-red-500 font-bold">TRAIN HARDER. SKILL {career.skill}/{nextRankReq}</p>
                    )}
                </div>
            </div>
        );
    };

    const renderPerks = () => (
        <div className="h-full p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-purple-400">SKILL TREE</h2>
                <div className="bg-purple-900 px-4 py-2 rounded border border-purple-500 font-bold">
                    AVAILABLE POINTS: {career.skillPoints || 0}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {PERK_TREE.map(perk => {
                    const isUnlocked = career.perks?.some(p => p.id === perk.id && p.unlocked);
                    const canUnlock = !isUnlocked && (career.skillPoints || 0) >= perk.cost;

                    return (
                        <div key={perk.id} className={`p-4 border-2 flex gap-4 transition-all ${isUnlocked ? 'bg-purple-900/40 border-purple-400' : 'bg-gray-800 border-gray-600 opacity-80'}`}>
                            <div className="text-4xl bg-black w-16 h-16 flex items-center justify-center rounded-lg border border-gray-500">
                                {perk.icon}
                            </div>
                            <div className="flex-grow">
                                <h3 className={`font-bold text-lg ${isUnlocked ? 'text-purple-300' : 'text-gray-300'}`}>{perk.name}</h3>
                                <p className="text-xs text-gray-400 mb-2">{perk.description}</p>
                                {isUnlocked ? (
                                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded font-bold">ACQUIRED</span>
                                ) : (
                                    <Button 
                                        onClick={() => unlockPerk(perk.id)} 
                                        disabled={!canUnlock}
                                        className={`text-xs py-1 px-3 ${canUnlock ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-gray-400'}`}
                                    >
                                        UNLOCK ({perk.cost} PTS)
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="h-full bg-[#121212] text-white font-mono flex flex-col relative overflow-hidden">
            {/* CHALLENGE OVERLAY */}
            {challengeActive && (
                <div className="absolute inset-0 z-50 bg-black">
                    <StandBattle 
                        onWin={() => handleChallengeWin(500)}
                        onLose={handleChallengeLoss}
                        directorTrait={null} // N/A for player
                        opponentName={`Rank ${RANK_TITLES[(career.rankIndex || 0) + 1]}`}
                        playerUniform={gameState.uniforms.find(u => u.id === gameState.currentUniformId) || gameState.uniforms[0]}
                        dmUniform={gameState.uniforms.find(u => u.id === gameState.dmUniformId) || gameState.uniforms.find(u => u.isDrumMajor)}
                        majoretteUniform={gameState.uniforms.find(u => u.id === gameState.majoretteUniformId)}
                        guardUniform={gameState.uniforms.find(u => u.id === gameState.guardUniformId)}
                        identity={gameState.identity}
                        gameState={gameState}
                        setGameState={setGameState}
                    />
                    <button onClick={() => setChallengeActive(false)} className="absolute top-4 right-4 text-xs text-gray-500 border border-gray-500 px-2">DEBUG EXIT</button>
                </div>
            )}

            {/* STUDY SESSION OVERLAY */}
            {studyActive && (
                <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-4xl font-black text-blue-400 mb-8 animate-pulse">STUDYING...</h2>
                        <div className="w-96 h-8 bg-gray-800 border-2 border-white mb-8 relative">
                            <div className="h-full bg-blue-500 transition-all duration-200" style={{ width: `${studyProgress}%` }}></div>
                        </div>
                        <Button onClick={clickStudy} className="text-2xl px-12 py-6 bg-blue-600 hover:bg-blue-500">FOCUS!</Button>
                        <p className="mt-4 text-gray-400">Click repeatedly to fill the bar!</p>
                    </div>
                </div>
            )}

            {currentCutscene && <CutsceneOverlay data={currentCutscene} onComplete={() => setCurrentCutscene(null)} />}

            {/* TAB NAV */}
            <div className="flex border-b-4 border-gray-700 bg-black">
                {[
                    { id: 'DASHBOARD', label: 'MY DORM', icon: '🏠' },
                    { id: 'SECTION', label: 'SECTION LADDER', icon: '📈' },
                    { id: 'PERKS', label: 'SKILLS & PERKS', icon: '⚡' },
                    { id: 'ACADEMICS', label: 'STUDY HALL', icon: '📝' }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-4 text-sm font-bold uppercase transition-colors flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-slate-800 text-yellow-400 border-b-4 border-yellow-400 mb-[-4px]' : 'text-gray-500 hover:text-white hover:bg-gray-900'}`}
                    >
                        <span>{tab.icon}</span> {tab.label}
                    </button>
                ))}
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-grow bg-slate-900 p-6 overflow-hidden">
                {activeTab === 'DASHBOARD' && renderDashboard()}
                {activeTab === 'SECTION' && renderSectionLadder()}
                {activeTab === 'PERKS' && renderPerks()}
                {activeTab === 'ACADEMICS' && (
                    <div className="h-full flex items-center justify-center text-center">
                        <div className="bg-black p-8 border-4 border-blue-500 shadow-xl max-w-md">
                            <h2 className="text-3xl font-black text-blue-400 mb-4">LIBRARY MODE</h2>
                            <p className="mb-6 text-gray-300">"Studying is just rhythm game for your brain."</p>
                            <Button onClick={handleStudySession} className="w-full text-xl py-4 bg-blue-700 border-blue-400">HIT THE BOOKS</Button>
                            <p className="mt-4 text-xs text-gray-500">Maintains eligibility. Costs 15 Energy.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <div className="bg-black p-2 flex justify-between items-center text-xs text-gray-500 px-4">
                <div>WEEK {career.week} | {gameState.identity.schoolName}</div>
                <div>WALLET: ${career.wallet || 0}</div>
                <button onClick={() => setPhase(GamePhase.TITLE)} className="text-red-500 hover:text-red-400">LOGOUT</button>
            </div>
        </div>
    );
};
