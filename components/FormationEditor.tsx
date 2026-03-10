
import React, { useState, useEffect, useRef } from 'react';
import { GameState, FormationPoint, BandMember, Drill, DrillFrame } from '../types';
import { GRID_SIZE } from '../constants';
import { Button } from './Button';

interface FormationEditorProps {
  gameState: GameState;
  onSave: (drill: Drill) => void;
  onBack: () => void;
  isTutorial?: boolean;
}

export const FormationEditor: React.FC<FormationEditorProps> = ({ gameState, onSave, onBack, isTutorial = false }) => {
  const initialDrill = gameState.drills.find(d => d.id === gameState.activeDrillId) || gameState.drills[0];
  const [editingDrillId, setEditingDrillId] = useState<string>(initialDrill.id);
  const [drillName, setDrillName] = useState<string>(initialDrill.name);
  
  const [frames, setFrames] = useState<DrillFrame[]>(initialDrill.frames);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<string[]>(initialDrill.songs || []);

  const toggleSong = (songId: string) => {
      setSelectedSongs(prev => prev.includes(songId) ? prev.filter(s => s !== songId) : [...prev, songId]);
  };
  const [isPlaying, setIsPlaying] = useState(false);
  const [drillWarnings, setDrillWarnings] = useState<string[]>([]);
  const [godMode, setGodMode] = useState(false);
  const [secretCodeInput, setSecretCodeInput] = useState("");

  // Animation Refs
  const playInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentFrame = frames[currentFrameIndex];

  // Physics Check Logic
  const checkPhysics = () => {
      if (godMode) {
          setDrillWarnings([]);
          return;
      }
      const warnings: string[] = [];
      const MAX_STEP_SIZE = 8; // Max grid units per frame (more lenient, was 4)

      for (let i = 1; i < frames.length; i++) {
          const prevPoints = frames[i-1].points;
          const currPoints = frames[i].points;

          currPoints.forEach(p => {
              const prev = prevPoints.find(prevP => prevP.memberId === p.memberId);
              if (prev) {
                  const dist = Math.sqrt(Math.pow(p.x - prev.x, 2) + Math.pow(p.y - prev.y, 2));
                  if (dist > MAX_STEP_SIZE) {
                      warnings.push(`Frame ${i+1}: Member ${p.memberId} moves too fast (${dist.toFixed(1)} steps)`);
                  }
              }
          });
      }
      setDrillWarnings(warnings);
  };

  useEffect(() => {
      checkPhysics();
  }, [frames, godMode]);

  const handleGridClick = (x: number, y: number) => {
    if (!selectedMemberId) return;

    // Deep copy current frame's points
    const currentPoints = [...currentFrame.points];
    
    // Remove member from old position if exists in THIS frame
    const filteredPoints = currentPoints.filter(p => p.memberId !== selectedMemberId);
    
    // Add to new position
    const newPoint: FormationPoint = {
      id: `${x}-${y}`,
      x,
      y,
      memberId: selectedMemberId
    };

    const newPoints = [...filteredPoints, newPoint];
    
    updateFramePoints(currentFrameIndex, newPoints);
    setSelectedMemberId(null);
  };

  const updateFramePoints = (index: number, points: FormationPoint[]) => {
      const newFrames = [...frames];
      newFrames[index] = { ...newFrames[index], points };
      setFrames(newFrames);
  };

  const addFrame = () => {
      // Clone the last frame points as starting point for new frame
      const lastFrame = frames[frames.length - 1];
      const newFrame: DrillFrame = {
          id: `f${Date.now()}`,
          order: frames.length,
          points: [...lastFrame.points],
          name: `Set ${frames.length + 1}`
      };
      setFrames([...frames, newFrame]);
      setCurrentFrameIndex(frames.length);
  };

  const deleteFrame = () => {
      if (frames.length <= 1) return;
      const newFrames = frames.filter((_, i) => i !== currentFrameIndex);
      setFrames(newFrames);
      setCurrentFrameIndex(Math.max(0, currentFrameIndex - 1));
  };

  const handlePlay = () => {
      if (isPlaying) {
          if (playInterval.current) clearInterval(playInterval.current);
          setIsPlaying(false);
      } else {
          setIsPlaying(true);
          // Simple frame stepping animation
          playInterval.current = setInterval(() => {
              setCurrentFrameIndex(prev => {
                  if (prev >= frames.length - 1) {
                      // End of playback
                      if (playInterval.current) clearInterval(playInterval.current);
                      setIsPlaying(false);
                      return 0; // Loop or stop? Let's loop back to start or stop
                  }
                  return prev + 1;
              });
          }, 1000); // 1 second per frame (simulation speed)
      }
  };

  // Shape Helpers
  const formShape = (type: 'LINE' | 'BLOCK' | 'CIRCLE') => {
      // Automatically place all unplaced members (or all members) into a shape
      const members = gameState.members;
      const points: FormationPoint[] = [];
      const centerX = Math.floor(GRID_SIZE / 2);
      const centerY = Math.floor(GRID_SIZE / 2);

      members.forEach((m, i) => {
          let x = 0, y = 0;
          if (type === 'LINE') {
              x = Math.min(GRID_SIZE - 1, 2 + i);
              y = centerY;
          } else if (type === 'BLOCK') {
              const cols = 4;
              x = centerX - 2 + (i % cols);
              y = centerY - 2 + Math.floor(i / cols);
          } else if (type === 'CIRCLE') {
              const angle = (i / members.length) * Math.PI * 2;
              const radius = 4;
              x = Math.round(centerX + Math.cos(angle) * radius);
              y = Math.round(centerY + Math.sin(angle) * radius);
          }
          
          // Clamp to grid
          x = Math.max(0, Math.min(GRID_SIZE - 1, x));
          y = Math.max(0, Math.min(GRID_SIZE - 1, y));

          points.push({ id: `${x}-${y}`, x, y, memberId: m.id });
      });

      updateFramePoints(currentFrameIndex, points);
  };

  const saveAll = () => {
      if (drillWarnings.length > 0 && !godMode) {
          if (!window.confirm("There are physics warnings (impossible moves). Save anyway?")) return;
      }
      const updatedDrill: Drill = { id: editingDrillId, name: drillName, frames, songs: selectedSongs };
      onSave(updatedDrill);
      alert("Drill Design Saved Successfully!");
      // Don't auto-exit so they can keep editing or switch shows
  };

  const createNewShow = () => {
      const newId = `drill-${Date.now()}`;
      setEditingDrillId(newId);
      setDrillName(`New Show ${gameState.drills.length + 1}`);
      setFrames([{ id: `f${Date.now()}`, order: 0, points: [], name: 'Set 1' }]);
      setCurrentFrameIndex(0);
  };

  const loadShow = (id: string) => {
      const drill = gameState.drills.find(d => d.id === id);
      if (drill) {
          setEditingDrillId(drill.id);
          setDrillName(drill.name);
          setFrames(drill.frames);
          setCurrentFrameIndex(0);
      }
  };

  const getMemberAt = (x: number, y: number) => {
    return currentFrame.points.find(p => p.x === x && p.y === y);
  };

  // Ghosting (Previous Frame)
  const getPrevMemberAt = (x: number, y: number) => {
      if (currentFrameIndex === 0) return undefined;
      return frames[currentFrameIndex - 1].points.find(p => p.x === x && p.y === y);
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 text-white p-4 overflow-hidden">
      <header className="mb-4 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-4">
            <h2 className="text-2xl font-mono text-yellow-400">DRILL EDITOR</h2>
            <input 
                type="text" 
                value={drillName} 
                onChange={(e) => setDrillName(e.target.value)}
                className="bg-slate-700 text-white px-2 py-1 rounded border border-slate-500 font-mono"
            />
            <select 
                value={editingDrillId} 
                onChange={(e) => loadShow(e.target.value)}
                className="bg-slate-700 text-white px-2 py-1 rounded border border-slate-500 font-mono"
            >
                {gameState.drills.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                ))}
                {gameState.drills.every(d => d.id !== editingDrillId) && (
                    <option value={editingDrillId}>{drillName} (Unsaved)</option>
                )}
            </select>
            <Button variant="secondary" onClick={createNewShow}>New Show</Button>
            
            <label className="flex items-center gap-2 ml-4">
                {godMode ? (
                    <span className="font-mono text-sm text-yellow-300 font-bold animate-pulse">GOD MODE ACTIVE</span>
                ) : (
                    <input 
                        type="password" 
                        value={secretCodeInput}
                        onChange={(e) => {
                            setSecretCodeInput(e.target.value);
                            if (e.target.value === "GODLY") {
                                setGodMode(true);
                                setSecretCodeInput("");
                            }
                        }}
                        placeholder="Secret Code"
                        className="bg-black border border-gray-600 text-white px-2 py-1 text-xs w-24"
                    />
                )}
            </label>

            {isTutorial && <p className="text-green-400 text-sm animate-pulse ml-4">TUTORIAL: Place members to create a shape!</p>}
        </div>
        <div className="space-x-2">
          {!isTutorial && <Button variant="secondary" onClick={onBack}>Exit</Button>}
          <span className="text-sm text-gray-400 font-mono mr-4">Duration: {frames.length} seconds</span>
          <Button variant="success" onClick={saveAll}>Save Show</Button>
        </div>
      </header>

      {/* Main Workspace - constrained to not overflow parent */}
      <div className="flex flex-grow gap-4 overflow-hidden">
        
        {/* Sidebar: Roster & Tools */}
        <div className="w-1/4 bg-slate-900 p-4 border-2 border-slate-600 flex flex-col gap-4 overflow-y-auto">
          
          {/* Shape Tools */}
          <div className="border-b border-gray-600 pb-4 flex-shrink-0">
              <h3 className="font-mono mb-2 text-gray-400">QUICK SHAPES</h3>
              <div className="flex gap-2">
                  <button onClick={() => formShape('LINE')} className="flex-1 bg-gray-800 border p-1 text-xs hover:bg-gray-700">LINE</button>
                  <button onClick={() => formShape('BLOCK')} className="flex-1 bg-gray-800 border p-1 text-xs hover:bg-gray-700">BLOCK</button>
                  <button onClick={() => formShape('CIRCLE')} className="flex-1 bg-gray-800 border p-1 text-xs hover:bg-gray-700">CIRCLE</button>
              </div>
          </div>

          <h3 className="font-mono text-center border-b border-slate-600 pb-2 flex-shrink-0">ROSTER</h3>
          
          <div className="space-y-2 flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {gameState.members.map(member => {
              const isPlaced = currentFrame.points.some(p => p.memberId === member.id);
              const isSelected = selectedMemberId === member.id;
              
              return (
                <div 
                  key={member.id}
                  onClick={() => setSelectedMemberId(member.id)}
                  className={`p-2 cursor-pointer border-2 transition-colors font-mono text-xs
                    ${isSelected ? 'bg-yellow-500 text-black border-white' : 'bg-slate-800 border-slate-600'}
                    ${isPlaced && !isSelected ? 'opacity-50' : 'opacity-100'}
                  `}
                >
                  <div className="font-bold">{member.name}</div>
                  <div className="text-gray-400">{member.instrument}</div>
                  {isPlaced && <div className="text-green-400 text-[10px]">[PLACED]</div>}
                </div>
              );
            })}
          </div>

          <h3 className="font-mono text-center border-b border-slate-600 pb-2 flex-shrink-0">SONGS</h3>
          <div className="space-y-2 flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {gameState.musicLibrary.filter(t => t.category === 'SHOW').map(song => (
                <div 
                  key={song.id}
                  onClick={() => toggleSong(song.id)}
                  className={`p-2 cursor-pointer border-2 transition-colors font-mono text-xs
                    ${selectedSongs.includes(song.id) ? 'bg-green-500 text-black border-white' : 'bg-slate-800 border-slate-600'}
                  `}
                >
                  <div className="font-bold">{song.title}</div>
                </div>
            ))}
          </div>
        </div>

        {/* Main: Grid & Timeline */}
        <div className="flex-grow flex flex-col items-center overflow-hidden">
            {drillWarnings.length > 0 && (
                <div className="absolute top-20 right-10 bg-red-900/90 text-white p-2 text-xs border border-red-500 z-50 max-w-xs">
                    <strong>PHYSICS WARNINGS:</strong>
                    <ul className="list-disc pl-4 mt-1">
                        {drillWarnings.slice(0, 3).map((w, i) => <li key={i}>{w}</li>)}
                        {drillWarnings.length > 3 && <li>...and {drillWarnings.length - 3} more</li>}
                    </ul>
                </div>
            )}

            {/* Grid Area - Grows to fill space */}
            <div className="flex-grow flex items-center justify-center bg-green-800 border-4 border-white relative overflow-hidden shadow-2xl w-full mb-4">
                {/* Field Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-full h-1 bg-white"></div>
                    ))}
                </div>
                
                {/* Vertical Hash Marks (visual) */}
                <div className="absolute inset-0 flex justify-center pointer-events-none opacity-20">
                    <div className="w-1/2 border-x-2 border-white h-full"></div>
                </div>

                <div 
                className="grid gap-px relative z-10"
                style={{ 
                    gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                    width: 'min(500px, 90%)',
                    aspectRatio: '1/1'
                }}
                >
                {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
                    const x = i % GRID_SIZE;
                    const y = Math.floor(i / GRID_SIZE);
                    const point = getMemberAt(x, y);
                    const prevPoint = getPrevMemberAt(x, y);
                    
                    return (
                    <div
                        key={i}
                        onClick={() => handleGridClick(x, y)}
                        className={`
                        border border-white/10 hover:bg-white/20 cursor-pointer transition-colors relative
                        ${point ? 'bg-blue-500/0' : ''}
                        `}
                    >
                        {/* Ghost Point (Previous Frame) */}
                        {prevPoint && !point && !isPlaying && (
                             <div className="absolute inset-0 m-2 rounded-full border border-white/30 flex items-center justify-center opacity-30"></div>
                        )}
                        
                        {/* Connection Line (Visualizing movement) */}
                        {prevPoint && point && !isPlaying && (
                            <svg className="absolute top-1/2 left-1/2 overflow-visible pointer-events-none" style={{zIndex: -1}}>
                                <line 
                                    x1="0" y1="0" 
                                    x2={(prevPoint.x - x) * 34} // Approximate grid cell size
                                    y2={(prevPoint.y - y) * 34} 
                                    stroke="yellow" strokeWidth="2" strokeOpacity="0.5" 
                                    strokeDasharray="4"
                                />
                            </svg>
                        )}

                        {point && (
                        <div className={`absolute inset-0 m-1 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md transition-all duration-500`}>
                            {gameState.members.find(m => m.id === point.memberId)?.instrument.substring(0, 2)}
                        </div>
                        )}
                    </div>
                    );
                })}
                </div>
            </div>

            {/* Timeline Controls - Fixed height at bottom */}
            <div className="w-full h-24 bg-slate-900 p-2 flex items-center gap-4 border-t border-slate-600 flex-shrink-0">
                 <Button onClick={handlePlay} className={isPlaying ? 'bg-red-500' : 'bg-green-500'}>
                     {isPlaying ? 'STOP' : 'PLAY SHOW'}
                 </Button>

                 <div className="flex-grow flex gap-1 overflow-x-auto pb-2 custom-scrollbar">
                     {frames.map((f, i) => (
                         <div 
                            key={f.id}
                            onClick={() => { setCurrentFrameIndex(i); setIsPlaying(false); }}
                            className={`min-w-[60px] h-16 border-2 flex flex-col items-center justify-center cursor-pointer text-xs flex-shrink-0
                                ${currentFrameIndex === i ? 'bg-yellow-500 text-black border-white' : 'bg-slate-800 border-gray-600 hover:bg-slate-700'}
                            `}
                         >
                             <span className="font-bold">SET {i+1}</span>
                         </div>
                     ))}
                     <button onClick={addFrame} className="min-w-[40px] h-16 bg-gray-700 hover:bg-gray-600 text-white font-bold text-xl flex-shrink-0">+</button>
                 </div>
                 
                 <Button onClick={deleteFrame} variant="danger" disabled={frames.length <= 1}>DEL FRAME</Button>
            </div>
        </div>
      </div>
    </div>
  );
};
