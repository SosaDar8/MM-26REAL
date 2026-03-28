
import React, { useState, useEffect, useMemo } from 'react';
import { RhythmGame } from './RhythmGame';
import { Button } from './Button';
import { generateAnnouncerCommentary } from '../services/geminiService';
import { DirectorTrait, Uniform, BandIdentity, BattleMove, BattleMoveType, BandMember, InstrumentType, GameState } from '../types';
import { BandMemberVisual } from './BandMemberVisual';
import { getRandomAppearance, generateOpponentIdentity, BATTLE_MOVES, DEFAULT_UNIFORMS } from '../constants';
import { soundManager } from '../services/soundManager';
import { HackerMenu } from './HackerMenu';

interface StandBattleProps {
  onWin: (reward: number) => void;
  onLose: () => void;
  directorTrait?: DirectorTrait; 
  playerUniform?: Uniform;
  dmUniform?: Uniform;
  majoretteUniform?: Uniform;
  guardUniform?: Uniform;
  identity?: BandIdentity;
  opponentName?: string;
  members?: BandMember[]; // Pass in actual members for visualization
  gameState?: GameState;
  setGameState?: React.Dispatch<React.SetStateAction<GameState>>;
}

export const StandBattle: React.FC<StandBattleProps> = ({ 
    onWin, 
    onLose, 
    directorTrait, 
    playerUniform = DEFAULT_UNIFORMS[0],
    dmUniform,
    majoretteUniform,
    guardUniform,
    identity,
    opponentName = "RIVALS",
    members = [],
    gameState,
    setGameState
}) => {
  const [phase, setPhase] = useState<'SELECT_MOVE' | 'BATTLE_RESOLUTION' | 'RHYTHM_GAME' | 'OPPONENT_TURN' | 'ROUND_RESULT'>('SELECT_MOVE');
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [round, setRound] = useState(1);
  const [announcerText, setAnnouncerText] = useState("CHOOSE YOUR ATTACK!");
  const [showHackerMenu, setShowHackerMenu] = useState(false);
  
  // RPG State
  const [selectedMove, setSelectedMove] = useState<BattleMove | null>(null);
  const [opponentMove, setOpponentMove] = useState<BattleMove | null>(null);
  const [advantage, setAdvantage] = useState<'PLAYER' | 'OPPONENT' | 'NEUTRAL'>('NEUTRAL');
  const [multiplier, setMultiplier] = useState(1.0);
  
  // Round results
  const [lastPlayerScore, setLastPlayerScore] = useState(0);
  const [lastOpponentScore, setLastOpponentScore] = useState(0);

  const opponentData = useMemo(() => {
      if (gameState?.rivalIdentity && gameState?.activeEventId?.startsWith('COMMUNITY_BATTLE')) {
          return {
              identity: gameState.rivalIdentity,
              uniform: { 
                  id: `opp_community`, 
                  name: gameState.rivalIdentity.schoolName, 
                  jacketColor: gameState.rivalIdentity.primaryColor, 
                  pantsColor: gameState.rivalIdentity.secondaryColor, 
                  hatColor: gameState.rivalIdentity.primaryColor, 
                  plumeColor: gameState.rivalIdentity.secondaryColor, 
                  accentColor: gameState.rivalIdentity.secondaryColor, 
                  hatStyle: 'shako', 
                  jacketStyle: 'classic', 
                  pantsStyle: 'regular', 
                  isDrumMajor: false 
              }
          };
      }
      return generateOpponentIdentity(opponentName);
  }, [opponentName, gameState?.rivalIdentity, gameState?.activeEventId]);

  useEffect(() => {
    generateAnnouncerCommentary("Stand battle starting", 0, 50).then(setAnnouncerText);
  }, []);

  useEffect(() => {
      const handleCheat = (e: any) => {
          const { action, amount } = e.detail;
          if (action === 'ADD_SCORE_US') {
              setPlayerScore(s => s + (amount * 100)); // Scale up for battle
          } else if (action === 'ADD_SCORE_THEM') {
              setOpponentScore(s => Math.max(0, s + (amount * 100)));
          } else if (action === 'END_QUARTER') {
              setPhase('ROUND_RESULT');
          }
      };
      window.addEventListener('HACKER_CHEAT', handleCheat);
      return () => window.removeEventListener('HACKER_CHEAT', handleCheat);
  }, []);

  const handleMoveSelect = (move: BattleMove) => {
      setSelectedMove(move);
      // Opponent picks move that isn't just random, maybe counter-intuitive
      const oppMove = BATTLE_MOVES[Math.floor(Math.random() * BATTLE_MOVES.length)];
      setOpponentMove(oppMove);
      
      // Determine winner
      let adv: 'PLAYER' | 'OPPONENT' | 'NEUTRAL' = 'NEUTRAL';
      let mult = 1.0;

      if (move.beats === oppMove.type) {
          adv = 'PLAYER';
          mult = 1.5; // Bonus multiplier for rhythm game
          setAnnouncerText("COUNTER! SUPER EFFECTIVE!");
          soundManager.playOrchestraHit();
      } else if (move.losesTo === oppMove.type) {
          adv = 'OPPONENT';
          mult = 0.8; // Penalty
          setAnnouncerText("COUNTERED! THEY READ YOU!");
          soundManager.playError();
      } else {
          setAnnouncerText("CLASH! EVEN MATCH!");
      }

      setAdvantage(adv);
      setMultiplier(mult);
      setPhase('BATTLE_RESOLUTION');

      setTimeout(() => {
          setPhase('RHYTHM_GAME');
      }, 3000);
  };

  const handleRhythmComplete = (score: number, energy: number) => {
      // Calculate final score based on RPG outcome
      const finalPlayerScore = Math.floor(score * multiplier * (directorTrait === DirectorTrait.SHOWMAN ? 1.1 : 1.0));
      
      // Opponent Base Score varies by round difficulty
      const baseOpp = 1000 + (round * 500);
      // Opponent advantage logic
      const oppMult = advantage === 'OPPONENT' ? 1.5 : advantage === 'PLAYER' ? 0.8 : 1.0;
      const finalOppScore = Math.floor((baseOpp + Math.random() * 500) * oppMult);

      setLastPlayerScore(finalPlayerScore);
      setLastOpponentScore(finalOppScore);

      setPhase('OPPONENT_TURN');
      setAnnouncerText("OPPONENT'S TURN!");
      
      const quality = advantage === 'PLAYER' ? 'bad' : 'good';
      const intensity = advantage === 'OPPONENT' ? 'loud' : 'low';
      const types: ('cadence' | 'song' | 'chant')[] = ['cadence', 'song', 'chant'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      soundManager.startOpponentBand(intensity, quality, type);

      setTimeout(() => {
          soundManager.stopOpponentBand();
          setPlayerScore(p => p + finalPlayerScore);
          setOpponentScore(o => o + finalOppScore);

          setPhase('ROUND_RESULT');
          
          const roundWin = finalPlayerScore > finalOppScore;
          setAnnouncerText(roundWin ? "ROUND WON!" : "ROUND LOST!");
          if(roundWin) soundManager.playSuccess(); else soundManager.playError();

          setTimeout(() => {
              if (round >= 3) {
                  const isWin = playerScore + finalPlayerScore > opponentScore + finalOppScore;
                  
                  // Award clips for the battle
                  window.dispatchEvent(new CustomEvent('mf-phone-action', {
                      detail: { action: 'ADD_CLIPS', data: 2 } // Battles are intense, 2 clips
                  }));

                  // Add battle video to MeTube
                  const battleVideo = {
                      id: `battle-${Date.now()}`,
                      title: `${isWin ? 'VICTORY' : 'BATTLE'} vs ${opponentData.identity.schoolName}`,
                      thumbnail: `https://picsum.photos/seed/battle-${Date.now()}/400/225`,
                      views: Math.floor(Math.random() * 5000) + 1000,
                      likes: Math.floor(Math.random() * 500) + 50,
                      duration: "3:45",
                      timestamp: "Just now",
                      category: 'BATTLE'
                  };
                  window.dispatchEvent(new CustomEvent('mf-phone-action', {
                      detail: { action: 'ADD_BATTLE_VIDEO', data: battleVideo }
                  }));

                  if (isWin) {
                      onWin(1000);
                  } else {
                      onLose();
                  }
              } else {
                  setRound(r => r + 1);
                  setPhase('SELECT_MOVE');
                  setAnnouncerText("NEXT ROUND! CHOOSE WISELY.");
              }
          }, 3000);
      }, 5000); // 5 seconds of opponent playing
  };

  // Helper to render a group of band members
  const renderBandGroup = (isPlayer: boolean, count: number) => {
      const displayUniform = isPlayer ? playerUniform : opponentData.uniform;
      // Fixed diverse lineup for visualization
      const instruments = [InstrumentType.TUBA, InstrumentType.TROMBONE, InstrumentType.SNARE, InstrumentType.TRUMPET, InstrumentType.SAX];
      
      return (
          <div className="flex gap-4 items-end justify-center transform scale-75">
              {Array.from({length: count}).map((_, i) => {
                  let appearance = getRandomAppearance();
                  if (isPlayer && members[i]) {
                      appearance = members[i].appearance;
                  } else if (!isPlayer && gameState?.rivalMembers && gameState.rivalMembers[i]) {
                      appearance = gameState.rivalMembers[i].appearance;
                  }

                  return (
                      <div key={i} className={`transform ${isPlayer ? '' : 'scale-x-[-1]'}`}>
                          <BandMemberVisual 
                              instrument={instruments[i % instruments.length]}
                              uniform={displayUniform}
                              appearance={appearance}
                              scale={1.2}
                              isPlaying={true}
                          />
                      </div>
                  );
              })}
          </div>
      );
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 relative font-mono text-white">
       {/* Top Bar */}
       <div className="h-16 bg-black border-b-4 border-blue-600 flex justify-between items-center px-4 z-10 shadow-lg">
           <div className="text-blue-400 font-black text-2xl flex flex-col">
               <span className="text-[10px] text-gray-400">YOU</span>
               {playerScore}
           </div>
           <div className="text-yellow-400 font-black text-3xl animate-pulse tracking-widest bg-gray-900 px-4 py-1 border-2 border-yellow-600">
               ROUND {round}/3
           </div>
           <div className="text-red-500 font-black text-2xl flex flex-col text-right">
               <span className="text-[10px] text-gray-400">RIVAL</span>
               {opponentScore}
           </div>
       </div>

       {/* Announcer Overlay */}
       <div className="absolute top-24 w-full text-center z-50 pointer-events-none">
           <span className="bg-yellow-400 text-black font-black text-xl px-8 py-3 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] uppercase italic transform -rotate-1 inline-block">
               {announcerText}
           </span>
       </div>

       {/* Main Content */}
       <div className="flex-grow relative flex items-center justify-center">
           
           {/* RPG SELECTION PHASE */}
           {phase === 'SELECT_MOVE' && (
               <div className="w-full max-w-5xl grid grid-cols-3 gap-8 p-8 animate-fade-in">
                   {BATTLE_MOVES.map(move => (
                       <button 
                            key={move.id} 
                            onClick={() => handleMoveSelect(move)}
                            className="h-96 bg-gray-800 border-4 border-gray-600 hover:border-yellow-400 hover:scale-105 transition-all flex flex-col items-center justify-center p-6 group shadow-2xl relative overflow-hidden"
                       >
                           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                           <div className="text-8xl mb-4 transform group-hover:scale-125 transition-transform duration-500 z-10">{move.icon}</div>
                           <h3 className="text-3xl font-black uppercase mb-2 z-10 text-yellow-400">{move.name}</h3>
                           <div className="text-sm font-bold bg-white text-black px-2 py-1 mb-4 z-10">{move.type}</div>
                           <p className="text-center text-gray-300 z-10">{move.description}</p>
                           <div className="mt-6 text-xs text-gray-500 uppercase z-10">
                               Beats <span className="text-green-400 font-bold">{move.beats}</span><br/>
                               Loses to <span className="text-red-400 font-bold">{move.losesTo}</span>
                           </div>
                       </button>
                   ))}
               </div>
           )}

           {/* RPG RESOLUTION CINEMATIC */}
           {phase === 'BATTLE_RESOLUTION' && selectedMove && opponentMove && (
               <div className="flex flex-col items-center justify-center gap-12 w-full animate-bounce-in">
                   
                   {/* Cinematic Band Faceoff */}
                   <div className="flex justify-between w-full px-20 absolute top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                       <div className="flex flex-col items-center">
                           <div className="text-blue-400 font-black text-xl mb-4 uppercase">{identity?.schoolName || "YOUR BAND"}</div>
                           {renderBandGroup(true, 5)}
                       </div>
                       <div className="flex flex-col items-center">
                           <div className="text-red-400 font-black text-xl mb-4 uppercase">{opponentName}</div>
                           {renderBandGroup(false, 5)}
                       </div>
                   </div>

                   <div className="flex justify-center items-center gap-20 z-10">
                       {/* Player Card */}
                       <div className={`p-10 border-8 ${advantage === 'PLAYER' ? 'border-green-500 bg-green-900/90 scale-125 z-20' : 'border-gray-500 bg-gray-900/90'} text-center transition-all duration-500 shadow-2xl`}>
                           <div className="text-6xl mb-2">{selectedMove.icon}</div>
                           <div className="text-2xl font-black uppercase">{selectedMove.name}</div>
                           <div className="text-sm font-bold">{selectedMove.type}</div>
                       </div>

                       <div className="text-6xl font-black italic text-yellow-500 drop-shadow-[0_0_10px_black]">VS</div>

                       {/* Opponent Card */}
                       <div className={`p-10 border-8 ${advantage === 'OPPONENT' ? 'border-red-500 bg-red-900/90 scale-125 z-20' : 'border-gray-500 bg-gray-900/90'} text-center transition-all duration-500 shadow-2xl`}>
                           <div className="text-6xl mb-2">{opponentMove.icon}</div>
                           <div className="text-2xl font-black uppercase">{opponentMove.name}</div>
                           <div className="text-sm font-bold">{opponentMove.type}</div>
                       </div>
                   </div>
                   
                   {/* Modifier Text */}
                   {advantage !== 'NEUTRAL' && (
                       <div className={`text-3xl font-black uppercase tracking-widest px-8 py-2 border-4 z-20 ${advantage === 'PLAYER' ? 'bg-green-500 text-black border-white' : 'bg-red-600 text-white border-black'}`}>
                           {advantage === 'PLAYER' ? "TYPE ADVANTAGE! (1.5x SCORE)" : "DISADVANTAGE! (0.8x SCORE)"}
                       </div>
                   )}
               </div>
           )}

           {/* RHYTHM GAME PHASE */}
           {phase === 'RHYTHM_GAME' && (
               <div className="absolute inset-0">
                   <RhythmGame 
                     difficulty={advantage === 'OPPONENT' ? 'hard' : 'medium'} // Harder if you lost RPS
                     onComplete={handleRhythmComplete} 
                     uniform={playerUniform}
                     dmUniform={dmUniform}
                     majoretteUniform={majoretteUniform}
                     guardUniform={guardUniform}
                     tuneType="BATTLE"
                     environment="ARENA"
                     members={members} // Pass actual members so visualizer shows them
                     logoGrid={identity?.bandLogo || gameState?.identity.bandLogo}
                     logoText={identity?.bandLogoText || gameState?.identity.bandLogoText}
                   />
               </div>
           )}

           {/* OPPONENT TURN PHASE */}
           {phase === 'OPPONENT_TURN' && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40">
                   <h2 className="text-4xl font-black text-red-500 mb-8 animate-pulse">{opponentName} IS PLAYING!</h2>
                   <div className="scale-150 mb-12">
                       {renderBandGroup(false, 7)}
                   </div>
                   <div className="text-xl text-gray-300 italic">Listen closely...</div>
               </div>
           )}

           {/* ROUND RESULT */}
           {phase === 'ROUND_RESULT' && (
               <div className="text-center animate-pulse">
                   <h2 className="text-6xl font-black text-white mb-4 drop-shadow-[0_0_20px_white]">ROUND COMPLETE</h2>
                   <p className="text-xl text-gray-400">Preparing next bout...</p>
               </div>
           )}
       </div>

       {/* Hacker Menu */}
       {gameState?.settings.difficulty === 'HACKER' && (
           <button 
               onClick={() => setShowHackerMenu(true)}
               className="absolute bottom-4 right-4 bg-green-900 border-2 border-green-500 p-2 text-green-400 shadow-lg hover:bg-green-800 font-mono animate-pulse z-50 text-xs"
           >
               👾 HACKER
           </button>
       )}
       {showHackerMenu && gameState && setGameState && (
           <HackerMenu gameState={gameState} setGameState={setGameState} onClose={() => setShowHackerMenu(false)} />
       )}
    </div>
  );
};
