import React, { useState } from 'react';
import { GameState, GamePhase, BandMember, Drill, DirectorTrait } from '../types';
import { Button } from './Button';
import { FormationEditor } from './FormationEditor';
import { RhythmGame } from './RhythmGame';
import { Management } from './Management';
import { StandBattle } from './StandBattle';
import { MOCK_RECRUITS } from '../constants';

interface TutorialProps {
    gameState: GameState;
    onComplete: (recruit: BandMember) => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ gameState, onComplete }) => {
    const [step, setStep] = useState(1);
    const [tutorialRecruit, setTutorialRecruit] = useState<BandMember | null>(null);

    // Step 1: Editor
    const handleFormationSave = (drill: Drill) => {
        setStep(2);
    };

    // Step 2: Rhythm Demo
    const handleRhythmComplete = () => {
        setStep(3);
    };

    // Step 3: Battle Demo
    const handleBattleComplete = (win: boolean) => {
        setStep(4);
    };

    // Step 4: Recruit
    const handleRecruit = (member: BandMember) => {
        setTutorialRecruit(member);
        if (gameState.director.trait === DirectorTrait.CREATIVE) {
             member.showmanship += 10;
        }
        onComplete(member);
    };

    const skipTutorial = () => {
        // Automatically recruit the first available recruit to keep state consistent
        // or just pass a default tutorial recruit
        const freeRecruit = { ...MOCK_RECRUITS[0], salary: 0 }; // Give them a freebie for skipping
        onComplete(freeRecruit);
    };

    const activeUniform = gameState.uniforms.find(u => u.id === gameState.currentUniformId);

    return (
        <div className="w-full h-full relative">
            <div className="absolute top-0 left-0 right-0 z-50 bg-yellow-500 text-black font-bold flex justify-between items-center px-4 py-2 font-mono border-b-4 border-black">
                <span>PHASE {step}: {
                    step === 1 ? "PLAN THE SHOW" :
                    step === 2 ? "EXECUTE RHYTHM" :
                    step === 3 ? "STAND BATTLE" : "BAND MANAGEMENT"
                }</span>
                <button 
                    onClick={skipTutorial}
                    className="text-xs border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-colors"
                >
                    SKIP TUTORIAL &gt;&gt;
                </button>
            </div>

            <div className="w-full h-full pt-12">
                {step === 1 && (
                    <div className="relative h-full">
                         <div className="absolute bottom-10 left-10 z-50 bg-white text-black p-4 border-4 border-black max-w-sm shadow-[4px_4px_0_rgba(0,0,0,1)]">
                             <p className="font-mono">"First, drag a Snare Drummer onto the field. Then hit SIMULATE to preview!"</p>
                         </div>
                         <FormationEditor 
                            gameState={gameState} 
                            onSave={handleFormationSave} 
                            onBack={() => {}} 
                            isTutorial={true}
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="relative h-full">
                         <div className="absolute top-20 left-10 z-50 bg-white text-black p-4 border-4 border-black max-w-sm shadow-[4px_4px_0_rgba(0,0,0,1)]">
                             <p className="font-mono">"Now, perform the beats! Tap D, F, J, K to the rhythm. Hit green notes for PERFECT timing!"</p>
                         </div>
                         <RhythmGame 
                            difficulty="easy"
                            onComplete={handleRhythmComplete}
                            uniform={activeUniform}
                            dmUniform={gameState.uniforms.find(u => u.id === gameState.dmUniformId) || gameState.uniforms.find(u => u.isDrumMajor)}
                            majoretteUniform={gameState.uniforms.find(u => u.id === gameState.majoretteUniformId)}
                            guardUniform={gameState.uniforms.find(u => u.id === gameState.guardUniformId)}
                         />
                    </div>
                )}

                {step === 3 && (
                    <div className="relative h-full">
                        <div className="absolute top-20 left-10 z-50 bg-white text-black p-4 border-4 border-black max-w-sm shadow-[4px_4px_0_rgba(0,0,0,1)]">
                             <p className="font-mono">"It's a Stand Battle! Pick the 'SOLO FRENZY' routine to see the FPV mode in action."</p>
                         </div>
                        <StandBattle 
                            onWin={() => handleBattleComplete(true)}
                            onLose={() => handleBattleComplete(false)}
                            directorTrait={gameState.director.trait}
                            playerUniform={activeUniform}
                            dmUniform={gameState.uniforms.find(u => u.id === gameState.dmUniformId) || gameState.uniforms.find(u => u.isDrumMajor)}
                            majoretteUniform={gameState.uniforms.find(u => u.id === gameState.majoretteUniformId)}
                            guardUniform={gameState.uniforms.find(u => u.id === gameState.guardUniformId)}
                            identity={gameState.identity}
                        />
                    </div>
                )}

                {step === 4 && (
                    <div className="relative h-full">
                         <div className="absolute bottom-20 right-10 z-50 bg-white text-black p-4 border-4 border-black max-w-sm shadow-[4px_4px_0_rgba(0,0,0,1)]">
                             <p className="font-mono">"Finally, spend your budget. Hire 'Trey' - your Director trait might boost his stats!"</p>
                         </div>
                        <Management 
                            gameState={gameState}
                            onRecruit={handleRecruit}
                            onBack={() => {}} // Disabled in tutorial
                        />
                    </div>
                )}
            </div>
        </div>
    );
};