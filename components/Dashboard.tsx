
import React, { useState, useEffect } from 'react';
import { GameState, GamePhase, BandStyle } from '../types';
import { Button } from './Button';
import { generateBandName } from '../services/geminiService';
import { HackerMenu } from './HackerMenu';

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
  const logoGrid = gameState.identity?.logo;

  // Sort schedule: Completed first, then by date
  const upcomingEvents = gameState.schedule.sort((a, b) => a.date - b.date);
  
  // Strict Progression: Find the first uncompleted event
  const firstUncompletedIndex = upcomingEvents.findIndex(e => !e.completed);
  const nextEventId = firstUncompletedIndex !== -1 ? upcomingEvents[firstUncompletedIndex].id : null;

  const renderLogo = (size: number = 64) => {
      if (!logoGrid) return null;
      const pixelSize = size / 10;
      return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', width: size, height: size }}>
              {logoGrid.map((c, i) => (
                  <div key={i} style={{ backgroundColor: c, width: pixelSize, height: pixelSize }}></div>
              ))}
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
          <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-500 to-sky-800 h-[70%]"></div>
          
          {/* Sun/Moon */}
          <div className="absolute top-10 right-20 w-24 h-24 bg-yellow-300 rounded-full blur-xl opacity-80 animate-pulse"></div>

          {/* Clouds */}
          <div className="absolute top-20 left-0 w-full h-full pointer-events-none opacity-60">
              <div className="absolute top-10 left-10 w-32 h-12 bg-white rounded-full blur-xl animate-[float_20s_linear_infinite]"></div>
              <div className="absolute top-32 left-1/2 w-48 h-16 bg-white rounded-full blur-xl animate-[float_25s_linear_infinite_reverse]"></div>
              <div className="absolute top-5 right-20 w-40 h-14 bg-white rounded-full blur-xl animate-[float_30s_linear_infinite]"></div>
          </div>

          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-b from-green-800 to-green-950"></div>
          
          {/* Campus Buildings */}
          <div className="absolute bottom-[30%] left-0 right-0 flex justify-center items-end px-10 gap-4 opacity-90">
              {/* Band Hall */}
              <div className="w-64 h-40 bg-stone-700 relative shadow-2xl flex flex-col items-center justify-end">
                  <div className="w-full h-4 bg-stone-800 absolute top-0"></div>
                  <div className="w-full h-full grid grid-cols-4 gap-2 p-4">
                      {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="bg-sky-900/50 border border-stone-600"></div>)}
                  </div>
                  <div className="bg-red-900 text-white text-[8px] px-2 py-0.5 mb-2 font-bold uppercase tracking-widest border border-red-700">Band Hall</div>
              </div>

              {/* Main School */}
              <div className="w-96 h-64 bg-red-900 relative shadow-2xl flex flex-col items-center">
                  <div className="w-full h-8 bg-stone-800 absolute top-0 flex justify-center items-center">
                      <div className="w-24 h-12 bg-stone-800 -mt-12 rounded-t-full flex items-center justify-center border-t-4 border-stone-600">
                          <div className="w-16 h-16 bg-white/10 rounded-full text-2xl flex items-center justify-center">🏫</div>
                      </div>
                  </div>
                  <div className="w-full h-full grid grid-cols-6 gap-3 p-6 mt-4">
                      {[...Array(18)].map((_, i) => <div key={i} className="bg-sky-200/20 border border-red-950"></div>)}
                  </div>
                  <div className="absolute bottom-0 w-16 h-24 bg-stone-800 border-x-4 border-stone-600"></div>
              </div>

              {/* Stadium Distance */}
              <div className="w-80 h-32 bg-gray-600 relative shadow-2xl opacity-80">
                  <div className="absolute -top-10 left-0 w-full h-10 bg-gray-500 perspective-origin-bottom transform skew-x-12"></div>
                  <div className="absolute top-2 w-full text-center text-gray-400 font-black text-4xl opacity-20">STADIUM</div>
              </div>
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
        className={`absolute top-0 left-0 bottom-0 w-64 bg-gray-900 border-r-4 border-white z-50 transform transition-transform duration-300 ${showSideMenu ? 'translate-x-0' : '-translate-x-full'}`}
      >
          <div className="p-4 bg-black border-b border-gray-700 flex justify-between items-center">
              <span className="font-bold text-yellow-400 uppercase">Director Ops</span>
              <button onClick={() => setShowSideMenu(false)} className="text-white text-xs">❌</button>
          </div>
          <div className="p-4 space-y-4">
              <button onClick={() => setPhase(GamePhase.BAND_OFFICE)} className="w-full text-left p-2 hover:bg-gray-800 text-sm border-l-2 border-transparent hover:border-blue-500">🏢 Band Office</button>
              <button onClick={() => setPhase(GamePhase.RECRUITMENT)} className="w-full text-left p-2 hover:bg-gray-800 text-sm border-l-2 border-transparent hover:border-green-500">📋 Recruitment</button>
              <div className="border-t border-gray-700 my-2"></div>
              <div className="text-xs text-gray-500 uppercase font-bold mb-2">Customization</div>
              <button onClick={() => setPhase(GamePhase.INSTRUMENT_DESIGNER)} className="w-full text-left p-2 hover:bg-gray-800 text-sm border-l-2 border-transparent hover:border-yellow-500">🎺 Instrument Shop</button>
              <button onClick={() => setPhase(GamePhase.UNIFORM_EDITOR)} className="w-full text-left p-2 hover:bg-gray-800 text-sm border-l-2 border-transparent hover:border-purple-500">👕 Uniforms</button>
              <button onClick={() => setPhase(GamePhase.LOGO_EDITOR)} className="w-full text-left p-2 hover:bg-gray-800 text-sm border-l-2 border-transparent hover:border-indigo-500">🎨 Logo Maker</button>
              <button onClick={() => setPhase(GamePhase.AVATAR_EDITOR)} className="w-full text-left p-2 hover:bg-gray-800 text-sm border-l-2 border-transparent hover:border-cyan-500">🧑 Director Avatar</button>
              <div className="border-t border-gray-700 my-2"></div>
              <button onClick={() => setPhase(GamePhase.TITLE)} className="w-full text-left p-2 text-red-400 hover:bg-gray-800 text-sm">🚪 Quit to Title</button>
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
                            {logoGrid ? (
                                <div className="transform scale-[3] image-pixelated">{renderLogo(32)}</div>
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
    </div>
  );
};
