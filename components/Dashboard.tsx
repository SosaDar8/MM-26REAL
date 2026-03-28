
import React, { useState, useEffect } from 'react';
import { GameState, GamePhase, BandStyle } from '../types';
import { Button } from './Button';
import { generateBandName } from '../services/geminiService';
import { HackerMenu } from './HackerMenu';
import { FeedbackModal } from './FeedbackModal';

interface DashboardProps {
  gameState: GameState;
  setPhase: (phase: GamePhase) => void;
  onUpdateName: (name: string) => void;
  onStartEvent: (eventId: string) => void;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const Dashboard: React.FC<DashboardProps> = ({ gameState, setPhase, onUpdateName, onStartEvent, setGameState }) => {
  const [showHUD, setShowHUD] = useState(true);
  const [hideUI, setHideUI] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [randomEvent, setRandomEvent] = useState<string | null>(null);
  const [showHackerMenu, setShowHackerMenu] = useState(false);
  const [showBandStats, setShowBandStats] = useState(false);
  const [showWeeklyOverview, setShowWeeklyOverview] = useState(false);
  const [showNewsFeed, setShowNewsFeed] = useState(true);
  const [showBugReport, setShowBugReport] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [bugDescription, setBugDescription] = useState("");
  const [bugReported, setBugReported] = useState(false);
  const [location, setLocation] = useState<'CAMPUS' | 'CITY' | 'BANDHALL' | 'RESTAURANT'>('CAMPUS');
  const [timeOfDay, setTimeOfDay] = useState<'DAY' | 'SUNSET' | 'NIGHT' | 'DAWN'>('DAY');
  const [weather, setWeather] = useState<'CLEAR' | 'RAIN' | 'STORM'>('CLEAR');
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);

  useEffect(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();
      
      if (!gameState.lastDailyReward || gameState.lastDailyReward < todayTimestamp) {
          setShowDailyReward(true);
      }
  }, []);

  useEffect(() => {
      const interval = setInterval(() => {
          setTimeOfDay(prev => prev === 'DAY' ? 'SUNSET' : prev === 'SUNSET' ? 'NIGHT' : prev === 'NIGHT' ? 'DAWN' : 'DAY');
          if (Math.random() < 0.2) {
              setWeather(prev => prev === 'CLEAR' ? 'RAIN' : prev === 'RAIN' ? 'STORM' : 'CLEAR');
          }
      }, 10000);
      return () => clearInterval(interval);
  }, []);


  const newsItems = [
      "BREAKING: Jackson State's 'Sonic Boom' announces surprise tour!",
      `WEATHER: ${gameState.settings.difficulty === 'HARD' ? 'Storm warning in effect' : 'Clear skies expected for Friday night game'}`,
      "RUMOR: A legendary drum major has been spotted scouting local high schools...",
      `LOCAL: ${gameState.bandName} ticket sales up 15% this week!`,
      "ALUMNI: 'The band needs new uniforms!' says former booster president.",
      "COMPETITION: Regional qualifiers starting next month."
  ];

  // Random Event Logic
  useEffect(() => {
      // 10% chance on dashboard load to trigger event
      if (Math.random() < 0.1) {
          const events = [
              "A trumpet player lost their mouthpiece! -Precision",
              "Bus broke down! Paid $50 for repairs.",
              "Alumni dropped off snacks! +Energy",
              "Sudden rainstorm ruined practice! -Skill",
              "Local news interviewed you! +Fans"
          ];
          setRandomEvent(events[Math.floor(Math.random() * events.length)]);
      }
  }, []);
    
  const handleGenerateName = async () => {
      const newName = await generateBandName(gameState.style);
      onUpdateName(newName);
  };

  const primaryColor = gameState.identity?.primaryColor || '#ef4444';
  const secondaryColor = gameState.identity?.secondaryColor || '#ffffff';
  const schoolLogoGrid = gameState.identity?.schoolLogo;
  const bandLogoGrid = gameState.identity?.bandLogo;

  // Sort schedule: Completed first, then by date
  const upcomingEvents = gameState.schedule.sort((a, b) => a.date - b.date);
  
  // Strict Progression: Find the first uncompleted event
  const firstUncompletedIndex = upcomingEvents.findIndex(e => !e.completed);
  const nextEventId = firstUncompletedIndex !== -1 ? upcomingEvents[firstUncompletedIndex].id : null;

  const renderLogo = (size: number = 64, isBandLogo: boolean = false) => {
      const grid = isBandLogo ? bandLogoGrid : schoolLogoGrid;
      const text = isBandLogo ? gameState.identity?.bandLogoText : gameState.identity?.schoolLogoText;
      if (!grid) return null;
      const cols = Math.sqrt(grid.length);
      const pixelSize = size / cols;
      return (
          <div className="relative" style={{ width: size, height: size }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, width: size, height: size }}>
                  {grid.map((c, i) => (
                      <div key={i} style={{ backgroundColor: c, width: pixelSize, height: pixelSize }}></div>
                  ))}
              </div>
              {text && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ fontSize: size * 0.4, WebkitTextStroke: '1px black' }}>
                          {text}
                      </span>
                  </div>
              )}
          </div>
      );
  };

  const getBandStatus = () => {
      if (gameState.reputation < 20) return "FRESHMEN WALK-ONS";
      if (gameState.reputation < 40) return "CAMPUS FAVORITES";
      if (gameState.reputation < 60) return "SECTION LEADERS";
      if (gameState.reputation < 80) return "HBCU LEGENDS";
      return "NATIONAL CHAMPIONS";
  };

  return (
    <div className="h-full bg-sky-900 flex flex-col items-center justify-center p-4 text-white relative font-mono overflow-hidden">
      
      {/* DAILY REWARD MODAL */}
      {showDailyReward && (
        <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="bg-gray-900 border-4 border-yellow-500 p-8 max-w-md w-full shadow-[0_0_30px_rgba(234,179,8,0.3)] animate-bounce-in relative text-center">
                <h2 className="text-4xl font-pixel text-yellow-400 mb-4">DAILY REWARD</h2>
                <p className="text-gray-300 mb-6">Welcome back, Director! Here's your daily bonus.</p>
                
                {!dailyRewardClaimed ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-black border border-gray-700 p-6 rounded-xl w-full flex flex-col items-center justify-center gap-2">
                            <span className="text-5xl">💰</span>
                            <span className="text-2xl text-green-400 font-bold">+1000 Funds</span>
                        </div>
                        <Button 
                            onClick={() => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                setGameState(prev => ({
                                    ...prev,
                                    funds: prev.funds + 1000,
                                    lastDailyReward: today.getTime()
                                }));
                                setDailyRewardClaimed(true);
                                setTimeout(() => setShowDailyReward(false), 2000);
                            }}
                            className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 text-xl"
                        >
                            CLAIM REWARD
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                        <div className="bg-green-900/50 border border-green-500 p-6 rounded-xl w-full flex flex-col items-center justify-center gap-2">
                            <span className="text-5xl">✅</span>
                            <span className="text-xl text-green-400 font-bold">Claimed!</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* BAND STATS MODAL */}
      {showBandStats && (
        <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="bg-gray-900 border-4 border-yellow-500 p-8 max-w-2xl w-full shadow-[0_0_30px_rgba(234,179,8,0.3)] animate-fade-in relative">
                <button onClick={() => setShowBandStats(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">×</button>
                <h2 className="text-4xl font-pixel text-yellow-400 mb-6 text-center">BAND STATS</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-black p-4 border border-gray-700">
                        <div className="text-gray-500 text-xs mb-1">AVG MARCH SKILL</div>
                        <div className="text-3xl text-white font-mono">{(gameState.members.reduce((acc, m) => acc + m.marchSkill, 0) / gameState.members.length).toFixed(1)}</div>
                    </div>
                    <div className="bg-black p-4 border border-gray-700">
                        <div className="text-gray-500 text-xs mb-1">AVG PLAY SKILL</div>
                        <div className="text-3xl text-white font-mono">{(gameState.members.reduce((acc, m) => acc + m.playSkill, 0) / gameState.members.length).toFixed(1)}</div>
                    </div>
                    <div className="bg-black p-4 border border-gray-700">
                        <div className="text-gray-500 text-xs mb-1">TOTAL FANS</div>
                        <div className="text-3xl text-pink-400 font-mono">{gameState.fans}</div>
                    </div>
                    <div className="bg-black p-4 border border-gray-700">
                        <div className="text-gray-500 text-xs mb-1">REPUTATION</div>
                        <div className="text-3xl text-yellow-400 font-mono">{gameState.reputation}/100</div>
                    </div>
                </div>
            </div>
        </div>
      )}
      
      {/* CAMPUS BACKGROUND SCENE */}
      <div className="absolute inset-0 z-0 overflow-hidden" onClick={() => setShowSideMenu(false)}>
          {/* Sky */}
          <div className={`absolute inset-0 h-[70%] transition-colors duration-1000 ${
              timeOfDay === 'DAY' ? 'bg-gradient-to-b from-sky-300 via-sky-500 to-sky-800' :
              timeOfDay === 'SUNSET' ? 'bg-gradient-to-b from-orange-400 via-red-500 to-purple-900' :
              timeOfDay === 'NIGHT' ? 'bg-gradient-to-b from-slate-900 via-indigo-950 to-black' :
              'bg-gradient-to-b from-pink-200 via-orange-200 to-sky-400'
          }`}></div>
          
          {/* Weather Overlay */}
          {weather !== 'CLEAR' && (
              <div className={`absolute inset-0 z-10 pointer-events-none ${weather === 'RAIN' ? 'bg-blue-900/20' : 'bg-black/40'}`}>
                  {weather === 'RAIN' && <div className="absolute inset-0 opacity-30 animate-pulse">🌧️🌧️🌧️🌧️</div>}
              </div>
          )}

          
          {/* Sun/Moon */}
          <div className="absolute top-10 right-20 w-24 h-24 bg-yellow-300 rounded-full blur-xl opacity-80 animate-pulse"></div>

          {/* Clouds */}
          <div className="absolute top-20 left-0 w-full h-full pointer-events-none opacity-60">
              <div className="absolute top-10 left-10 w-32 h-12 bg-white rounded-full blur-xl animate-[float_20s_linear_infinite]"></div>
              <div className="absolute top-32 left-1/2 w-48 h-16 bg-white rounded-full blur-xl animate-[float_25s_linear_infinite_reverse]"></div>
              <div className="absolute top-5 right-20 w-40 h-14 bg-white rounded-full blur-xl animate-[float_30s_linear_infinite]"></div>
          </div>

          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-b from-green-800 to-green-950">
              {/* Add some texture to the ground */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grass.png')]"></div>
          </div>
          
          {/* Campus Buildings & Backgrounds */}
          <div className="absolute bottom-[30%] left-0 right-0 flex justify-center items-end px-10 gap-4 opacity-90">
              {location === 'CAMPUS' && (
                  <>
                    {/* Background Trees */}
                    <div className="absolute bottom-0 left-10 w-16 h-32 bg-green-900 rounded-t-full opacity-80"></div>
                    <div className="absolute bottom-0 right-20 w-20 h-40 bg-green-900 rounded-t-full opacity-80"></div>
                    <div className="absolute bottom-0 left-1/4 w-12 h-24 bg-green-800 rounded-t-full opacity-70"></div>
                    
                    {/* Stadium in distance */}
                    <div className="absolute bottom-0 right-1/4 w-64 h-32 bg-gray-400 rounded-t-3xl opacity-60 flex flex-col items-center justify-end overflow-hidden">
                        <div className="w-full h-4 bg-gray-500 mb-2"></div>
                        <div className="w-full h-4 bg-gray-500 mb-2"></div>
                        <div className="w-full h-4 bg-gray-500"></div>
                        <div className="absolute top-4 w-full flex justify-around px-4">
                            <div className="w-2 h-16 bg-gray-300"></div>
                            <div className="w-2 h-16 bg-gray-300"></div>
                        </div>
                    </div>

                    {/* Band Hall */}
                    <div className="w-64 h-40 bg-stone-700 relative shadow-2xl flex flex-col items-center justify-end z-10 border-t-4 border-stone-600">
                        <div className="w-full h-4 bg-stone-800 absolute top-0 flex justify-between px-2 items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="w-full h-full grid grid-cols-4 gap-2 p-4">
                            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="bg-sky-900/50 border border-stone-600 shadow-inner"></div>)}
                        </div>
                        <div className="bg-red-900 text-white text-[8px] px-2 py-0.5 mb-2 font-bold uppercase tracking-widest border border-red-700 shadow-md">Band Hall</div>
                        {/* Door */}
                        <div className="absolute bottom-0 w-12 h-16 bg-stone-900 border-t-2 border-x-2 border-stone-600 flex justify-center">
                            <div className="w-1 h-full bg-stone-950"></div>
                        </div>
                    </div>
                    {/* Main School */}
                    <div className="w-96 h-64 bg-red-900 relative shadow-2xl flex flex-col items-center z-10 border-t-4 border-red-950">
                        <div className="w-full h-8 bg-stone-800 absolute top-0 flex justify-center items-center shadow-md">
                            <div className="w-24 h-12 bg-stone-800 -mt-12 rounded-t-full flex items-center justify-center border-t-4 border-stone-600">
                                <div className="w-16 h-16 bg-white/10 rounded-full text-2xl flex items-center justify-center shadow-inner">🏫</div>
                            </div>
                        </div>
                        <div className="w-full h-full grid grid-cols-6 gap-3 p-6 mt-4">
                            {[...Array(18)].map((_, i) => <div key={i} className="bg-sky-200/20 border border-red-950 shadow-inner relative">
                                {Math.random() > 0.7 && <div className="absolute inset-0 bg-yellow-200/20"></div>}
                            </div>)}
                        </div>
                        {/* Main Entrance */}
                        <div className="absolute bottom-0 w-24 h-24 bg-stone-800 border-x-4 border-t-4 border-stone-600 flex justify-center items-end pb-2">
                            <div className="w-20 h-20 bg-stone-900 flex justify-center">
                                <div className="w-1 h-full bg-black/50"></div>
                            </div>
                        </div>
                    </div>
                  </>
              )}
              {location === 'CITY' && (
                  <div className="w-full h-64 bg-slate-800 flex items-end justify-around p-4 relative overflow-hidden border-t-4 border-slate-900">
                      {/* Distant skyline */}
                      <div className="absolute bottom-0 w-full h-40 flex items-end justify-around opacity-30">
                          <div className="w-16 h-32 bg-slate-900"></div>
                          <div className="w-20 h-48 bg-slate-900"></div>
                          <div className="w-12 h-24 bg-slate-900"></div>
                          <div className="w-24 h-56 bg-slate-900"></div>
                      </div>
                      
                      {/* Foreground buildings */}
                      <div className="w-24 h-48 bg-slate-600 relative border-t-2 border-slate-500 shadow-xl z-10">
                          <div className="grid grid-cols-2 gap-2 p-2 h-full">
                              {[...Array(10)].map((_, i) => <div key={i} className={`w-full h-6 ${Math.random() > 0.5 ? 'bg-yellow-200/40' : 'bg-slate-800'}`}></div>)}
                          </div>
                      </div>
                      <div className="w-32 h-60 bg-slate-700 relative border-t-2 border-slate-600 shadow-xl z-10">
                          <div className="grid grid-cols-3 gap-2 p-2 h-full">
                              {[...Array(15)].map((_, i) => <div key={i} className={`w-full h-6 ${Math.random() > 0.3 ? 'bg-yellow-200/50' : 'bg-slate-900'}`}></div>)}
                          </div>
                          <div className="absolute top-0 w-full h-4 bg-red-500/20 flex justify-between px-2">
                              <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse mt-1"></div>
                              <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse mt-1"></div>
                          </div>
                      </div>
                      <div className="w-28 h-52 bg-slate-600 relative border-t-2 border-slate-500 shadow-xl z-10">
                          <div className="grid grid-cols-2 gap-3 p-3 h-full">
                              {[...Array(8)].map((_, i) => <div key={i} className={`w-full h-8 ${Math.random() > 0.6 ? 'bg-yellow-200/30' : 'bg-slate-800'}`}></div>)}
                          </div>
                      </div>
                      
                      {/* Streetlights */}
                      <div className="absolute bottom-0 left-1/4 w-1 h-20 bg-gray-500 z-20">
                          <div className="absolute -top-2 -left-2 w-4 h-2 bg-yellow-200 rounded-full blur-sm"></div>
                      </div>
                      <div className="absolute bottom-0 right-1/4 w-1 h-20 bg-gray-500 z-20">
                          <div className="absolute -top-2 -left-2 w-4 h-2 bg-yellow-200 rounded-full blur-sm"></div>
                      </div>
                  </div>
              )}
              {location === 'BANDHALL' && (
                  <div className="w-full h-64 bg-stone-900 border-t-8 border-stone-700 p-8 relative overflow-hidden shadow-inner">
                      {/* Acoustic panels */}
                      <div className="absolute inset-0 grid grid-cols-6 gap-4 p-4 opacity-20">
                          {[...Array(12)].map((_, i) => <div key={i} className="bg-stone-600 rounded-sm"></div>)}
                      </div>
                      
                      {/* Whiteboard */}
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 h-32 bg-white/90 border-4 border-gray-400 rounded shadow-md z-10 flex flex-col p-2">
                          <div className="w-full h-1 bg-blue-500/30 mb-2"></div>
                          <div className="w-3/4 h-1 bg-black/30 mb-2"></div>
                          <div className="w-1/2 h-1 bg-red-500/30"></div>
                          <div className="absolute bottom-2 right-2 flex gap-1">
                              <div className="w-4 h-1 bg-black rounded"></div>
                              <div className="w-4 h-1 bg-red-500 rounded"></div>
                          </div>
                      </div>
                      
                      {/* Instrument cases */}
                      <div className="absolute bottom-0 left-10 w-20 h-16 bg-black rounded-t-lg border-2 border-gray-700 z-10"></div>
                      <div className="absolute bottom-0 left-32 w-12 h-24 bg-gray-800 rounded-t-full border-2 border-gray-600 z-10"></div>
                      <div className="absolute bottom-0 right-20 w-32 h-12 bg-stone-800 rounded-t-md border-2 border-stone-600 z-10"></div>
                      
                      <div className="absolute inset-0 flex items-center justify-center z-0 opacity-10">
                          <div className="text-stone-700 text-9xl font-black">🎵</div>
                      </div>
                  </div>
              )}
              {location === 'RESTAURANT' && (
                  <div className="w-full h-64 bg-orange-950 flex items-center justify-center relative overflow-hidden border-t-4 border-orange-900 shadow-inner">
                      {/* Checkered floor */}
                      <div className="absolute bottom-0 w-full h-20 bg-[repeating-linear-gradient(45deg,#000_0,#000_20px,#fff_20px,#fff_40px)] opacity-20 transform perspective(500px) rotateX(60deg) origin-bottom"></div>
                      
                      {/* Neon Sign */}
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 border-4 border-pink-500 p-4 rounded-lg shadow-[0_0_20px_rgba(236,72,153,0.8)] z-10 bg-black/50">
                          <div className="text-pink-400 font-black text-2xl tracking-widest drop-shadow-[0_0_10px_rgba(236,72,153,1)]">DINER</div>
                      </div>
                      
                      {/* Booths */}
                      <div className="absolute bottom-10 left-10 w-32 h-24 bg-red-800 rounded-t-xl border-4 border-red-900 z-10 flex items-end justify-center">
                          <div className="w-24 h-4 bg-gray-300 mb-8 rounded-full"></div>
                      </div>
                      <div className="absolute bottom-10 right-10 w-32 h-24 bg-red-800 rounded-t-xl border-4 border-red-900 z-10 flex items-end justify-center">
                          <div className="w-24 h-4 bg-gray-300 mb-8 rounded-full"></div>
                      </div>
                      
                      <div className="absolute inset-0 flex items-center justify-center z-0 opacity-20">
                          <div className="text-orange-300 text-9xl font-black">🍔</div>
                      </div>
                  </div>
              )}
          </div>

          {/* Foreground Elements */}
          <div className="absolute bottom-[10%] left-20 w-8 h-8 bg-yellow-500 rounded-full animate-bounce"></div>
          <div className="absolute bottom-[15%] right-40 w-4 h-4 bg-white rounded-full animate-ping"></div>

          {/* School Sign */}
          <div className="absolute bottom-[35%] left-10 transform -rotate-2">
               <div className="bg-yellow-700 border-4 border-yellow-900 p-2 shadow-xl rounded-sm">
                  <div className="text-yellow-100 font-bold uppercase text-xs tracking-widest text-center border-b border-yellow-800 pb-1">{gameState.identity?.schoolName}</div>
                  <div className="text-[8px] text-yellow-200 italic text-center pt-1">HOME OF THE {gameState.identity?.mascot?.toUpperCase()}</div>
              </div>
              <div className="w-2 h-20 bg-gray-500 mx-auto -mt-1"></div>
          </div>
      </div>

      {/* RANDOM EVENT POPUP */}
      {randomEvent && (
          <div className="absolute top-20 z-50 bg-black/90 text-white p-4 border-4 border-yellow-500 animate-bounce-in max-w-sm text-center shadow-2xl">
              <div className="text-2xl mb-2">⚠️</div>
              <h3 className="font-bold text-yellow-400 mb-2">DAILY REPORT</h3>
              <p className="text-sm">{randomEvent}</p>
              <button onClick={() => setRandomEvent(null)} className="mt-4 text-xs bg-gray-700 px-4 py-2 border border-gray-500">DISMISS</button>
          </div>
      )}

      {/* SIDE MENU */}
      <div 
        className={`absolute top-0 left-0 bottom-0 w-64 bg-gray-900 border-r-4 border-white z-50 transform transition-transform duration-300 overflow-y-auto pb-10 ${showSideMenu ? 'translate-x-0' : '-translate-x-full'}`}
      >
          <div className="p-4 bg-black border-b border-gray-700 flex justify-between items-center sticky top-0 z-10">
              <span className="font-bold text-yellow-400 uppercase">Director Ops</span>
              <button onClick={() => setShowSideMenu(false)} className="text-white text-xs bg-gray-800 p-1 rounded">❌</button>
          </div>
          <div className="p-4 space-y-2">
              <button onClick={() => setPhase(GamePhase.BAND_OFFICE)} className="w-full text-left p-3 hover:bg-gray-800 text-sm border-l-4 border-transparent hover:border-blue-500 bg-gray-800/50 rounded">🏢 Band Office</button>
              <button onClick={() => setPhase(GamePhase.RECRUITMENT)} className="w-full text-left p-3 hover:bg-gray-800 text-sm border-l-4 border-transparent hover:border-green-500 bg-gray-800/50 rounded">📋 Recruitment</button>
              <div className="border-t border-gray-700 my-4"></div>
              <div className="text-xs text-gray-500 uppercase font-bold mb-2 px-2">Customization</div>
              <button onClick={() => setPhase(GamePhase.INSTRUMENT_DESIGNER)} className="w-full text-left p-3 hover:bg-gray-800 text-sm border-l-4 border-transparent hover:border-yellow-500 bg-gray-800/50 rounded">🎺 Instrument Shop</button>
              <button onClick={() => setPhase(GamePhase.UNIFORM_EDITOR)} className="w-full text-left p-3 hover:bg-gray-800 text-sm border-l-4 border-transparent hover:border-purple-500 bg-gray-800/50 rounded">👕 Uniforms</button>
              <button onClick={() => setPhase(GamePhase.LOGO_EDITOR)} className="w-full text-left p-3 hover:bg-gray-800 text-sm border-l-4 border-transparent hover:border-indigo-500 bg-gray-800/50 rounded">🎨 Logo Maker</button>
              <button onClick={() => setPhase(GamePhase.AVATAR_EDITOR)} className="w-full text-left p-3 hover:bg-gray-800 text-sm border-l-4 border-transparent hover:border-cyan-500 bg-gray-800/50 rounded">🧑 Director Avatar</button>
              <div className="p-2 text-xs font-bold text-gray-400 uppercase">Location</div>
              <div className="flex flex-col gap-1 p-2">
                  {(['CAMPUS', 'CITY', 'BANDHALL', 'RESTAURANT'] as const).map(l => (
                      <button key={l} onClick={() => setLocation(l)} className={`py-2 text-[10px] font-bold border rounded ${location === l ? 'bg-yellow-600 border-yellow-400' : 'bg-gray-700 border-gray-600'}`}>{l}</button>
                  ))}
              </div>
              <div className="border-t border-gray-700 my-4"></div>
              <button onClick={() => setShowBugReport(true)} className="w-full text-left p-3 text-yellow-400 hover:bg-gray-800 text-sm bg-gray-800/50 rounded border border-yellow-900/50">🐛 Report Bug</button>
              <button onClick={() => setShowFeedback(true)} className="w-full text-left p-3 text-blue-400 hover:bg-gray-800 text-sm bg-gray-800/50 rounded border border-blue-900/50">💡 Feedback & Suggestions</button>
              <button onClick={() => setPhase(GamePhase.TITLE)} className="w-full text-left p-3 text-red-400 hover:bg-gray-800 text-sm bg-red-900/20 rounded border border-red-900/50 font-bold">🚪 Quit to Title</button>
          </div>
      </div>

      <div className="absolute top-4 left-4 z-40 flex gap-2">
          {gameState.settings.partyMode && (
              <div className="bg-purple-600 border-2 border-purple-300 p-2 text-white font-bold animate-pulse shadow-lg">
                  🎉 PARTY MODE
              </div>
          )}
          <button 
            onClick={() => setShowSideMenu(!showSideMenu)}
            className="bg-black border-2 border-white p-2 text-white shadow-lg hover:bg-gray-800"
          >
              ☰ MENU
          </button>
          <button 
              onClick={() => setHideUI(!hideUI)}
              className="bg-black/50 border-2 border-white/50 p-2 text-white/80 hover:bg-black hover:text-white text-xs"
          >
              {hideUI ? 'SHOW UI' : 'HIDE UI'}
          </button>
          <button 
              onClick={() => setShowNewsFeed(!showNewsFeed)}
              className={`bg-black/50 border-2 border-white/50 p-2 text-white/80 hover:bg-black hover:text-white text-xs ${!showNewsFeed ? 'opacity-50' : ''}`}
          >
              {showNewsFeed ? 'HIDE NEWS' : 'SHOW NEWS'}
          </button>
          {gameState.settings.difficulty === 'HACKER' && (
              <button 
                  onClick={() => setShowHackerMenu(true)}
                  className="bg-green-900 border-2 border-green-500 p-2 text-green-400 shadow-lg hover:bg-green-800 font-mono animate-pulse"
              >
                  👾 HACKER
              </button>
          )}
      </div>

      {showHackerMenu && (
          <HackerMenu gameState={gameState} setGameState={setGameState} onClose={() => setShowHackerMenu(false)} />
      )}

      {showHUD && !hideUI && (
        <div className="z-10 w-full max-w-7xl flex flex-col h-[90vh] animate-fade-in">
            <div className="flex-grow flex gap-6">
            <div className="w-1/3 flex flex-col gap-4">
                <div className="bg-[#111] border-4 border-white shadow-[8px_8px_0_0_#000] p-6 flex-grow flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-4 border-b-4 border-white" style={{ backgroundColor: primaryColor }}></div>
                    <div className="w-32 h-32 bg-gray-800 border-4 border-white mb-4 overflow-hidden relative shadow-lg mt-4 flex items-center justify-center">
                        <div className="w-full h-full flex items-center justify-center text-4xl overflow-hidden" style={{ backgroundColor: secondaryColor }}>
                            {bandLogoGrid ? (
                                <div className="transform scale-[3] image-pixelated">{renderLogo(32, true)}</div>
                            ) : schoolLogoGrid ? (
                                <div className="transform scale-[3] image-pixelated">{renderLogo(32, false)}</div>
                            ) : (
                                <div className="w-20 h-20 rounded-full border-2 border-black" style={{ backgroundColor: gameState.director.appearance.skinColor }}></div>
                            )}
                        </div>
                    </div>
                    <h2 className="text-3xl font-black mb-1 tracking-tight text-white uppercase drop-shadow-md font-pixel">{gameState.bandName || gameState.identity?.schoolName || "UNNAMED"}</h2>
                    <div className="text-[10px] bg-yellow-600 text-black px-2 py-0.5 font-bold rounded mb-1 animate-pulse">{getBandStatus()}</div>
                    <div className="text-xl font-bold mb-6 uppercase tracking-widest opacity-80" style={{ color: primaryColor }}>{gameState.identity?.mascot || "TEAM"}</div>
                    <div className="w-full bg-[#000] p-4 border-2 border-gray-600 mb-auto font-mono text-xs">
                        <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-2"><span className="text-gray-500">DIRECTOR</span><span className="text-yellow-400 font-bold uppercase">{gameState.director?.name}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-500">STYLE</span><span className="text-cyan-400 font-bold uppercase">{gameState.style === BandStyle.SHOW ? 'SHOW' : 'CORPS'}</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full mt-6">
                        <div className="bg-green-900/30 p-3 border-2 border-green-600 text-center"><div className="text-[10px] text-green-400 mb-1">FUNDS</div><div className="text-2xl text-white font-pixel">${gameState.funds}</div></div>
                        <div className="bg-pink-900/30 p-3 border-2 border-pink-600 text-center"><div className="text-[10px] text-pink-400 mb-1">FANS</div><div className="text-2xl text-white font-pixel">{gameState.fans}</div></div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setPhase(GamePhase.BAND_OFFICE)} className="h-16 flex-1" variant="secondary">BAND OFFICE</Button>
                    <Button onClick={() => setShowBandStats(true)} className="h-16 flex-1" variant="secondary">BAND STATS</Button>
                </div>
            </div>

            <div className="w-2/3 flex flex-col gap-4">
                <div className="flex justify-between items-end bg-[#111] p-4 border-4 border-white shadow-[4px_4px_0_0_#000]">
                    <h1 className="text-3xl font-pixel text-yellow-400">SEASON SCHEDULE</h1>
                    <div className="flex gap-2">
                        <button onClick={() => setShowWeeklyOverview(true)} className="px-3 py-1 bg-green-900 border-2 border-green-500 hover:bg-green-800 text-xs text-white shadow-lg">WEEKLY OVERVIEW</button>
                        <button onClick={() => setPhase(GamePhase.QUESTS)} className="px-3 py-1 bg-purple-900 border-2 border-purple-500 hover:bg-purple-800 text-xs">QUESTS</button>
                        <button onClick={() => setPhase(GamePhase.ACHIEVEMENTS)} className="px-3 py-1 bg-blue-900 border-2 border-blue-500 hover:bg-blue-800 text-xs">AWARDS</button>
                    </div>
                </div>

                {showWeeklyOverview && (
                    <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                        <div className="bg-gray-900 border-4 border-green-500 p-8 max-w-2xl w-full shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-fade-in relative">
                            <button onClick={() => setShowWeeklyOverview(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">×</button>
                            <h2 className="text-4xl font-pixel text-green-400 mb-6 text-center">WEEKLY OVERVIEW</h2>
                            
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="bg-black p-4 border border-gray-700">
                                    <div className="text-gray-500 text-xs mb-1">CURRENT FUNDS</div>
                                    <div className="text-3xl text-green-400 font-mono">${gameState.funds}</div>
                                </div>
                                <div className="bg-black p-4 border border-gray-700">
                                    <div className="text-gray-500 text-xs mb-1">TOTAL FANS</div>
                                    <div className="text-3xl text-pink-400 font-mono">{gameState.fans}</div>
                                </div>
                                <div className="bg-black p-4 border border-gray-700">
                                    <div className="text-gray-500 text-xs mb-1">REPUTATION</div>
                                    <div className="text-3xl text-yellow-400 font-mono">{gameState.reputation}/100</div>
                                </div>
                                <div className="bg-black p-4 border border-gray-700">
                                    <div className="text-gray-500 text-xs mb-1">EVENTS COMPLETED</div>
                                    <div className="text-3xl text-blue-400 font-mono">{upcomingEvents.filter(e => e.completed).length} / {upcomingEvents.length}</div>
                                </div>
                            </div>

                            <div className="bg-black p-4 border border-gray-700">
                                <div className="text-gray-500 text-xs mb-2">NEXT EVENT</div>
                                {nextEventId ? (
                                    <div className="text-xl text-white font-bold uppercase">{upcomingEvents.find(e => e.id === nextEventId)?.name}</div>
                                ) : (
                                    <div className="text-xl text-gray-500 italic">Season Complete!</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex-grow bg-[#000] border-4 border-gray-700 p-2 overflow-y-auto font-mono">
                    <table className="w-full text-left border-collapse">
                        <thead className="text-gray-500 bg-[#111] sticky top-0">
                            <tr><th className="p-2 border-b-2 border-gray-700">STATUS</th><th className="p-2 border-b-2 border-gray-700">EVENT</th><th className="p-2 border-b-2 border-gray-700">TYPE</th><th className="p-2 border-b-2 border-gray-700">OPPONENT</th><th className="p-2 border-b-2 border-gray-700">RESULT</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {upcomingEvents.map(event => {
                                const isLocked = !event.completed && event.id !== nextEventId;
                                const isNext = event.id === nextEventId;
                                return (
                                    <tr key={event.id} className={`transition-colors ${event.completed ? 'opacity-70' : isNext ? 'bg-white/10' : 'opacity-30'}`}>
                                        <td className="p-3">{event.completed ? <span className="text-green-500 font-bold">[DONE]</span> : isLocked ? <span className="text-gray-500">🔒</span> : <span className="text-yellow-500 animate-pulse">{">>>"}</span>}</td>
                                        <td className="font-bold text-white">
                                            {event.name.toUpperCase()}
                                            {event.name.includes("Championship") && <span className="ml-2 text-[10px] bg-red-600 text-white px-1 rounded animate-pulse">LIMITED TIME</span>}
                                        </td>
                                        <td className="text-sm text-cyan-400">{event.type}</td>
                                        <td className="text-sm text-gray-300">{event.opponent || "---"}</td>
                                        <td>
                                            {!event.completed ? (
                                                <button onClick={() => onStartEvent(event.id)} disabled={isLocked} className={`px-3 py-1 font-bold text-xs border ${isLocked ? 'bg-gray-800 text-gray-600 border-gray-600 cursor-not-allowed' : 'bg-green-600 text-black hover:bg-green-400 border-green-300'}`}>{isLocked ? 'LOCKED' : 'START'}</button>
                                            ) : (
                                                event.result ? (
                                                    <span className={`font-bold text-xs ${event.result.win ? 'text-green-400' : 'text-red-400'}`}>
                                                        {event.result.win ? 'W' : 'L'} {event.result.us}-{event.result.them}
                                                    </span>
                                                ) : <span className="text-gray-500 text-xs">COMPLETED</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="h-1/3 grid grid-cols-4 gap-4">
                    {/* ALUMNI RELATIONS Button */}
                    <div 
                        className="col-span-1 bg-blue-900 border-4 border-blue-400 hover:bg-blue-800 hover:border-white p-4 flex flex-col justify-center items-center cursor-pointer transition-all shadow-[4px_4px_0_0_#000] group"
                        onClick={() => setPhase(GamePhase.ALUMNI_HUB)}
                    >
                        <span className="text-4xl mb-2 group-hover:scale-125 transition-transform">🎓</span>
                        <div className="text-sm font-bold text-white text-center leading-tight uppercase">Alumni Hub</div>
                    </div>
                    
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                        <div className="bg-[#222] border-2 border-gray-500 hover:border-yellow-400 p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-[#333]" onClick={() => setPhase(GamePhase.EDITOR)}><span className="text-2xl mb-1">✎</span><span className="font-bold text-xs uppercase">Drill Editor</span></div>
                        <div className="bg-[#222] border-2 border-gray-500 hover:border-green-400 p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-[#333]" onClick={() => setPhase(GamePhase.PRACTICE)}><span className="text-2xl mb-1">♪</span><span className="font-bold text-xs uppercase">Practice</span></div>
                        <div className="bg-[#222] border-2 border-gray-500 hover:border-pink-400 p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-[#333]" onClick={() => setPhase(GamePhase.STORE)}><span className="text-2xl mb-1">🛍️</span><span className="font-bold text-xs uppercase">Booker Store</span></div>
                        <div className="bg-[#222] border-2 border-gray-500 hover:border-blue-400 p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-[#333]" onClick={() => setPhase(GamePhase.MEDIA)}><span className="text-2xl mb-1">🐦</span><span className="font-bold text-xs uppercase">InstaTweet</span></div>
                    </div>

                    <div className="col-span-1 flex flex-col gap-2">
                        <Button onClick={() => setPhase(GamePhase.VIDEO_APP)} className="flex-1 text-[10px] py-1 bg-red-700 border-red-500 text-white">▶ MeTube</Button>
                        <Button onClick={() => setPhase(GamePhase.UNIFORM_EDITOR)} className="flex-1 text-[10px] py-1" variant="secondary">UNIFORMS</Button>
                        <Button onClick={() => setPhase(GamePhase.LOGO_EDITOR)} className="flex-1 text-[10px] py-1 bg-indigo-600 text-white border-indigo-400">LOGOS</Button>
                    </div>
                </div>
            </div>
            
        </div>
      </div>
      )}

      {/* SCROLLING NEWS BANNER */}
      {!hideUI && showNewsFeed && (
        <>
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
            <div className="absolute bottom-0 left-0 w-full bg-black/90 border-t-4 border-yellow-500 z-[100] overflow-hidden py-2 flex items-center shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
                <div className="bg-red-600 text-white text-xs font-black px-4 py-1 ml-2 mr-4 z-10 shadow-lg uppercase italic border border-red-400 animate-pulse">LIVE FEED</div>
                <div className="whitespace-nowrap overflow-hidden flex-1 relative h-6">
                    <div className="absolute top-0 animate-marquee whitespace-nowrap">
                        {newsItems.map((item, i) => (
                            <span key={i} className="text-yellow-400 font-mono text-sm font-bold mx-8 uppercase tracking-wider drop-shadow-md">
                                {item} <span className="text-gray-600 mx-2">///</span>
                            </span>
                        ))}
                    </div>
                </div>
                <button onClick={() => setShowNewsFeed(false)} className="bg-red-600 text-white px-2 py-1 mx-2 text-xs font-bold border border-red-400 hover:bg-red-500 z-10">CLOSE</button>
            </div>
        </>
      )}

      {/* BUG REPORT MODAL */}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      {showBugReport && (
          <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm animate-fade-in">
              <div className="bg-slate-800 border-4 border-yellow-500 p-8 max-w-md w-full shadow-2xl relative">
                  <h2 className="text-2xl font-black text-yellow-500 mb-6 uppercase border-b-2 border-gray-600 pb-2">Report a Bug</h2>
                  
                  {bugReported ? (
                      <div className="text-center py-8">
                          <div className="text-4xl mb-4">✅</div>
                          <h3 className="text-xl font-bold text-white mb-2">Bug Reported Successfully!</h3>
                          <p className="text-gray-400 text-sm mb-6">Thank you for your feedback. We will look into it.</p>
                          <Button onClick={() => { setShowBugReport(false); setBugReported(false); setBugDescription(""); }} className="w-full">CLOSE</Button>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          <div>
                              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Describe the issue</label>
                              <textarea 
                                  value={bugDescription}
                                  onChange={(e) => setBugDescription(e.target.value)}
                                  className="w-full h-32 bg-slate-900 border border-slate-600 text-white p-3 text-sm focus:border-yellow-500 outline-none resize-none"
                                  placeholder="What happened? What did you expect to happen?"
                              />
                          </div>
                          <div className="flex gap-4 pt-4">
                              <Button onClick={() => setShowBugReport(false)} variant="secondary" className="flex-1">CANCEL</Button>
                              <Button 
                                  onClick={() => {
                                      if (bugDescription.trim()) {
                                          setBugReported(true);
                                      }
                                  }} 
                                  className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-black border-yellow-400"
                                  disabled={!bugDescription.trim()}
                              >
                                  SUBMIT
                              </Button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};
