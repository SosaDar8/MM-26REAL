
import React, { useState, useMemo } from 'react';
import { GameState, Director, BandIdentity, DirectorTrait, BandMember, InstrumentType, Uniform, Drill, DrillFrame } from '../types';
import { Button } from './Button';
import { TRAIT_DESCRIPTIONS, MASCOTS, COLORS, SCHOOL_PREFIXES, SCHOOL_NOUNS, BAND_ADJECTIVES, BAND_NOUNS, SCHOOL_PRESETS, getRandomAppearance, OG_MEMBERS, containsProfanity, FORMER_DIRECTORS, TINY_FONT, GRID_SIZE, RECRUIT_NAMES, RECRUIT_SURNAMES, INITIAL_DRILL } from '../constants';
import { BandMemberVisual } from './BandMemberVisual';

interface CustomizationProps {
  onComplete: (director: Director, identity: BandIdentity, bandName: string, initialLineup: BandMember[], initialUniform: Uniform, initialDrill?: Drill) => void;
  preSetDirectorName?: string;
  loyaltyMod?: number; // 0.0 to 1.0 multiplier for starting roster size
}

export const Customization: React.FC<CustomizationProps> = ({ onComplete, preSetDirectorName = "Director Smith", loyaltyMod = 1.0 }) => {
  const [step, setStep] = useState<number>(2); // Start at School selection now
  
  const [trait, setTrait] = useState<DirectorTrait>(DirectorTrait.SHOWMAN);
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');

  const [schoolName, setSchoolName] = useState("Pixel State Univ.");
  const [location, setLocation] = useState("Atlanta, GA");
  const [foundingYear, setFoundingYear] = useState<number>(1881);
  const [schoolType, setSchoolType] = useState<'High School' | 'College'>('College');
  const [bandName, setBandName] = useState("The Marching Pixels");
  const [mascot, setMascot] = useState(MASCOTS[0]);
  const [customMascot, setCustomMascot] = useState("");
  const [isCustomMascot, setIsCustomMascot] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(COLORS[0].hex);
  const [secondaryColor, setSecondaryColor] = useState(COLORS[7].hex);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewInstrument, setPreviewInstrument] = useState<InstrumentType>(InstrumentType.MACE);

  // Memoize random former director to ensure consistency in text
  const previousDirectorName = useMemo(() => FORMER_DIRECTORS[Math.floor(Math.random() * FORMER_DIRECTORS.length)], []);

  // Tenor configuration
  const [tenorConfig, setTenorConfig] = useState({
      [InstrumentType.TENOR_QUADS]: true,
      [InstrumentType.TENOR_CHEST]: false,
      [InstrumentType.TENOR_WAIST]: false
  });
  const [showTenorOptions, setShowTenorOptions] = useState(false);

  // New: Instrument Selection Toggle (User chooses TYPES, game randomizes COUNTS)
  // Simplified map for high-level toggles. Actual types handled in roster gen.
  const [activeInstruments, setActiveInstruments] = useState<Record<string, boolean>>({
      [InstrumentType.PICCOLO]: false,
      [InstrumentType.FLUTE]: true, // New Default
      [InstrumentType.CLARINET]: false,
      [InstrumentType.SAX]: false,
      [InstrumentType.TRUMPET]: true,
      [InstrumentType.MELLOPHONE]: false,
      [InstrumentType.TROMBONE]: true,
      [InstrumentType.BARITONE]: false,
      [InstrumentType.TUBA]: true,
      [InstrumentType.SNARE]: true,
      'TENORS': false, // Logic handled specially
      [InstrumentType.BASS]: true,
      [InstrumentType.CYMBAL]: false,
      [InstrumentType.GUARD]: false,
      [InstrumentType.MAJORETTE]: true, // Add Majorettes default
      [InstrumentType.MACE]: true // Always need a drum major
  });

  const toggleInstrument = (type: string) => {
      if (type === InstrumentType.MACE) return; // Cant disable DM
      setActiveInstruments(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const generateInitialsLogo = (name: string, pColor: string, sColor: string) => {
      // Logic: Extract initials. "Pixel State University" -> "PSU"
      // "Metro A&M University" -> "MAMU" -> maybe truncate to 2 or 3 chars.
      // Grid is 10x10.
      
      const words = name.split(' ').filter(w => w.length > 0 && w.toLowerCase() !== 'the' && w.toLowerCase() !== 'of');
      let initials = "";
      words.forEach(w => {
          if (w.includes('&')) {
              initials += w; // Keep A&M together? No, fonts are single char. Split A & M
          } else {
              initials += w.charAt(0).toUpperCase();
          }
      });
      // Filter non-alphanumeric just in case, allow &
      initials = initials.replace(/[^A-Z&]/g, '');
      
      // Limit to 2 chars for better fit on 10x10 grid using 3x5 font
      // 3 chars: 3*3 + 2 = 11 width -> Too wide for 10x10.
      // We will try to fit 2 chars.
      
      let textToRender = initials.substring(0, 2);
      // If single char, center it.
      // If 2 chars, put them side by side with 1px space.
      
      const grid = Array(100).fill(sColor); // Background is secondary
      const setP = (x: number, y: number) => {
          if (x >= 0 && x < 10 && y >= 0 && y < 10) grid[y * 10 + x] = pColor;
      };

      if (textToRender.length === 1) {
          // Center 1 char (3x5) on 10x10. 
          // Start x = (10-3)/2 = 3.5 -> 3
          // Start y = (10-5)/2 = 2.5 -> 2
          const char = textToRender[0];
          const bitmap = TINY_FONT[char] || TINY_FONT[' '];
          
          // Double scale for single letter? 3x5 -> 6x10?
          // Let's just do normal centered for now, maybe add a border
          
          // Draw border
          for(let i=0; i<10; i++) { setP(i,0); setP(i,9); setP(0,i); setP(9,i); }

          const startX = 3;
          const startY = 2;
          for (let i = 0; i < 15; i++) {
              if (bitmap[i] === 1) {
                  const col = i % 3;
                  const row = Math.floor(i / 3);
                  // Scale 2x? 
                  // 3 cols * 2 = 6 width. 5 rows * 2 = 10 height. 
                  // Fits in 10x10 exactly if y=0.
                  // Let's do simple 1x
                  setP(startX + col, startY + row + 1); // +1 y to center better
              }
          }
      } else if (textToRender.length === 2) {
          // 2 chars. 
          // Char 1: x=1. Char 2: x=5 (1px gap). Total width 3+1+3 = 7.
          // Start Y = 2.
          const c1 = textToRender[0];
          const c2 = textToRender[1];
          const b1 = TINY_FONT[c1] || TINY_FONT[' '];
          const b2 = TINY_FONT[c2] || TINY_FONT[' '];

          for (let i = 0; i < 15; i++) {
              // Char 1
              if (b1[i] === 1) {
                  setP(1 + (i%3), 2 + Math.floor(i/3));
              }
              // Char 2
              if (b2[i] === 1) {
                  setP(5 + (i%3), 2 + Math.floor(i/3));
              }
          }
      } else {
          // Fallback simple pattern
          for(let i=0; i<10; i++) setP(i,i);
          for(let i=0; i<10; i++) setP(9-i,i);
      }
      
      return grid;
  };

  const previewUniform: Uniform = {
        id: 'prev_u',
        name: 'Preview',
        jacketColor: primaryColor,
        pantsColor: secondaryColor,
        hatColor: primaryColor,
        plumeColor: secondaryColor,
        accentColor: secondaryColor,
        shoeColor: '#000000',
        gloveColor: '#ffffff',
        hatStyle: 'shako',
        jacketStyle: 'classic',
        pantsStyle: 'regular'
  };

  const handleNext = () => {
    if (step === 2) {
        // Validation for School/Band Name
        if (containsProfanity(schoolName) || containsProfanity(bandName) || (isCustomMascot && containsProfanity(customMascot))) {
            setErrorMsg("Profanity detected in school or band name. Please keep it clean!");
            return;
        }
        setErrorMsg("");
        setStep(step + 1);
    } else {
      const finalMascot = isCustomMascot ? customMascot || "Mascot" : mascot;
      
      // Calculate roster size based on loyalty
      const baseRosterSize = 15; 
      const loyalMembersCount = Math.floor(baseRosterSize * loyaltyMod);
      const startingCount = Math.max(5, loyalMembersCount);

      // Filter active types. For Tenors, mix enabled subtypes.
      const enabledTypes: InstrumentType[] = [];
      Object.keys(activeInstruments).forEach(key => {
          if (key === 'TENORS') {
              if (activeInstruments[key]) {
                  if (tenorConfig[InstrumentType.TENOR_QUADS]) enabledTypes.push(InstrumentType.TENOR_QUADS);
                  if (tenorConfig[InstrumentType.TENOR_CHEST]) enabledTypes.push(InstrumentType.TENOR_CHEST);
                  if (tenorConfig[InstrumentType.TENOR_WAIST]) enabledTypes.push(InstrumentType.TENOR_WAIST);
                  // Fallback if none checked but category active
                  if (!tenorConfig[InstrumentType.TENOR_QUADS] && !tenorConfig[InstrumentType.TENOR_CHEST] && !tenorConfig[InstrumentType.TENOR_WAIST]) {
                      enabledTypes.push(InstrumentType.TENOR_QUADS);
                  }
              }
          } else if (activeInstruments[key] && key !== InstrumentType.MACE) {
              enabledTypes.push(key as InstrumentType);
          }
      });

      const generatedRoster: BandMember[] = [...OG_MEMBERS.filter(m => {
          // Keep OGs if their broad type is active
          if (m.instrument === InstrumentType.TENOR_QUADS || m.instrument === InstrumentType.TENOR_CHEST) return activeInstruments['TENORS'];
          return activeInstruments[m.instrument];
      })];
      
      if (enabledTypes.length > 0) {
          const needed = startingCount - generatedRoster.length;
          for(let i=0; i<needed; i++) {
              const instr = enabledTypes[Math.floor(Math.random() * enabledTypes.length)];
              const name = RECRUIT_NAMES[Math.floor(Math.random() * RECRUIT_NAMES.length)];
              const surname = RECRUIT_SURNAMES[Math.floor(Math.random() * RECRUIT_SURNAMES.length)];
              generatedRoster.push({
                  id: `init-${instr}-${i}-${Date.now()}`,
                  name: `${name} ${surname}`,
                  instrument: instr,
                  marchSkill: 30 + Math.floor(Math.random() * 20),
                  playSkill: 30 + Math.floor(Math.random() * 20),
                  showmanship: 30,
                  salary: 100,
                  appearance: getRandomAppearance(),
                  archetype: 'Grinder',
                  status: 'P3'
              });
          }
      }

      if (!generatedRoster.some(m => m.instrument === InstrumentType.MACE)) {
           generatedRoster.unshift({
               id: 'dm-fallback',
               name: 'Drum Major',
               instrument: InstrumentType.MACE,
               marchSkill: 50, playSkill: 50, showmanship: 50, salary: 0,
               appearance: getRandomAppearance(),
               status: 'P1'
           });
      }

      // Auto-Generate Logo using new Initials Logic
      const generatedLogo = presetLogo || generateInitialsLogo(schoolName, primaryColor, secondaryColor);

      // Randomize Uniform based on colors
      const styles = ['classic', 'sash', 'vest', 'military', 'tracksuit'];
      const hats = ['shako', 'stetson', 'beret', 'cap'];
      
      const randomStyle = styles[Math.floor(Math.random() * styles.length)] as any;
      const randomHat = hats[Math.floor(Math.random() * hats.length)] as any;
      
      const initialUniform: Uniform = {
          id: `u-${Date.now()}`,
          name: 'Season 1 Uniform',
          jacketColor: primaryColor,
          pantsColor: Math.random() > 0.5 ? secondaryColor : '#111111', 
          hatColor: primaryColor,
          plumeColor: secondaryColor,
          accentColor: secondaryColor,
          shoeColor: '#000000',
          gloveColor: '#ffffff',
          hatStyle: randomHat,
          jacketStyle: randomStyle,
          pantsStyle: 'regular',
          isDrumMajor: false,
          hasGauntlets: Math.random() > 0.5,
          hasCape: Math.random() > 0.8,
          hasSpats: Math.random() > 0.5
      };

      const defaultHair = gender === 'FEMALE' ? 20 : 1; // 20=Long Straight, 1=Buzz

      // 35% Chance to pre-generate a Field Show Drill
      let starterDrill = undefined;
      if (Math.random() < 0.35) {
          const centerX = Math.floor(GRID_SIZE / 2);
          const centerY = Math.floor(GRID_SIZE / 2);
          // Create a simple block
          const blockPoints = generatedRoster.map((m, i) => {
              const cols = 4;
              const x = centerX - 2 + (i % cols);
              const y = centerY - 2 + Math.floor(i / cols);
              return { 
                  id: `${x}-${y}`, 
                  x: Math.max(0, Math.min(GRID_SIZE-1, x)), 
                  y: Math.max(0, Math.min(GRID_SIZE-1, y)), 
                  memberId: m.id 
              };
          });
          
          starterDrill = {
              id: `drill-${Date.now()}`,
              name: 'Opener: Block',
              frames: [{ id: 'f1', order: 0, points: blockPoints, name: 'Set 1' }]
          };
      }

      onComplete(
        { 
            name: preSetDirectorName, 
            gender: gender,
            trait, 
            appearance: { skinColor: '#dca586', hairColor: '#000', hairStyle: defaultHair, bodyType: 'average', accessoryId: 0 }, 
            currentOutfitId: 'do_default', 
            outfits: [] 
        },
        { schoolName, schoolType, location, foundingYear, mascot: finalMascot, primaryColor, secondaryColor, logo: generatedLogo },
        bandName,
        generatedRoster,
        initialUniform,
        starterDrill
      );
    }
  };

  const [presetLogo, setPresetLogo] = useState<string[] | undefined>(undefined);

  const handleRandomize = () => {
      const prefix = SCHOOL_PREFIXES[Math.floor(Math.random() * SCHOOL_PREFIXES.length)];
      const noun = SCHOOL_NOUNS[Math.floor(Math.random() * SCHOOL_NOUNS.length)];
      const randMascot = MASCOTS[Math.floor(Math.random() * MASCOTS.length)];
      const randPrim = COLORS[Math.floor(Math.random() * COLORS.length)].hex;
      let randSec = COLORS[Math.floor(Math.random() * COLORS.length)].hex;
      while(randSec === randPrim) { randSec = COLORS[Math.floor(Math.random() * COLORS.length)].hex; }
      const bandAdj = BAND_ADJECTIVES[Math.floor(Math.random() * BAND_ADJECTIVES.length)];
      const bandNoun = BAND_NOUNS[Math.floor(Math.random() * BAND_NOUNS.length)];

      setSchoolName(`${prefix} ${noun}`);
      setMascot(randMascot);
      setIsCustomMascot(false);
      setPrimaryColor(randPrim);
      setSecondaryColor(randSec);
      setBandName(`The ${bandAdj} ${bandNoun}`);
      setSchoolType(Math.random() > 0.5 ? 'College' : 'High School');
      setPresetLogo(undefined);
  };

  const applyPreset = (preset: typeof SCHOOL_PRESETS[number]) => {
      setSchoolName(preset.name);
      setMascot(preset.mascot);
      setPrimaryColor(preset.primary);
      setSecondaryColor(preset.secondary);
      setBandName(preset.band);
      setSchoolType(preset.type);
      setIsCustomMascot(false);
      setPresetLogo(preset.logo);
  };

  return (
    <div className="h-full bg-slate-900 text-white p-8 flex flex-col items-center justify-center font-mono">
      <h1 className="text-4xl text-yellow-400 mb-8 border-b-4 border-yellow-400 pb-2 uppercase tracking-tighter">
        {step === 2 ? "Program Identity" : "Ensemble Configuration"}
      </h1>

      <div className="bg-slate-800 p-8 border-4 border-white w-full max-w-4xl shadow-[12px_12px_0_rgba(0,0,0,0.5)] relative overflow-hidden h-[70vh] flex flex-col">
        {step === 2 ? (
          <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
             {errorMsg && <div className="bg-red-600 text-white p-2 font-bold text-center border-2 border-white animate-pulse">{errorMsg}</div>}
             
             <div className="bg-black/30 p-4 border border-gray-700">
                 <div className="flex justify-between items-center mb-3">
                    <span className="text-yellow-400 text-sm font-black italic">QUICK OPTIONS</span>
                    <Button onClick={handleRandomize} className="bg-purple-600 hover:bg-purple-500 border-purple-400 text-[10px] py-1">
                        🎲 ROLL RANDOM
                    </Button>
                 </div>
                 <div className="grid grid-cols-3 gap-2">
                     {SCHOOL_PRESETS.map((p, i) => (
                         <button key={i} onClick={() => applyPreset(p)} className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-[10px] py-2 uppercase font-bold">
                             {p.name.split(' ')[0]}
                         </button>
                     ))}
                 </div>
             </div>

             <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-gray-400 mb-2 font-bold uppercase text-xs">DIRECTOR GENDER</label>
                    <div className="flex gap-2">
                        <button onClick={() => setGender('MALE')} className={`flex-1 py-2 border-2 text-sm font-bold ${gender === 'MALE' ? 'bg-blue-600 border-white text-white' : 'bg-black border-gray-600 text-gray-400'}`}>MALE</button>
                        <button onClick={() => setGender('FEMALE')} className={`flex-1 py-2 border-2 text-sm font-bold ${gender === 'FEMALE' ? 'bg-pink-600 border-white text-white' : 'bg-black border-gray-600 text-gray-400'}`}>FEMALE</button>
                    </div>
                </div>
                <div className="flex-1">
                    <label className="block text-gray-400 mb-2 font-bold uppercase text-xs">DIRECTOR TRAIT</label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.values(DirectorTrait).map((t) => (
                        <div 
                            key={t}
                            onClick={() => setTrait(t)}
                            className={`p-2 border-2 cursor-pointer transition-all ${trait === t ? 'bg-blue-600 border-white scale-105' : 'bg-black border-gray-600 hover:border-gray-400'}`}
                        >
                            <div className="font-bold text-[10px] mb-1">{t}</div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

             <div className="flex gap-4">
                 <div className="flex-grow">
                    <label className="block text-gray-400 mb-2 font-bold uppercase text-xs">SCHOOL NAME</label>
                    <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full bg-black border-2 border-gray-500 p-2 text-xl outline-none" />
                 </div>
                 <div className="flex-grow">
                    <label className="block text-gray-400 mb-2 font-bold uppercase text-xs">LOCATION (e.g. Atl, GA)</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-black border-2 border-gray-500 p-2 text-xl outline-none" placeholder="City, ST" />
                 </div>
                 <div className="w-1/4">
                    <label className="block text-gray-400 mb-2 font-bold uppercase text-xs">EST. YEAR</label>
                    <input type="number" value={foundingYear} onChange={(e) => setFoundingYear(parseInt(e.target.value) || 1881)} className="w-full bg-black border-2 border-gray-500 p-2 text-xl outline-none text-center" />
                 </div>
                 <div className="w-1/4">
                    <label className="block text-gray-400 mb-2 font-bold uppercase text-xs">LEVEL</label>
                    <div className="flex flex-col gap-1">
                        <button onClick={() => setSchoolType('High School')} className={`p-1 text-[10px] border ${schoolType === 'High School' ? 'bg-blue-600 border-white' : 'bg-black border-gray-600'}`}>H.S.</button>
                        <button onClick={() => setSchoolType('College')} className={`p-1 text-[10px] border ${schoolType === 'College' ? 'bg-blue-600 border-white' : 'bg-black border-gray-600'}`}>COLLEGE</button>
                    </div>
                 </div>
             </div>

             <div>
              <label className="block text-yellow-400 mb-2 font-bold uppercase text-xs">CUSTOM BAND NAME</label>
              <input type="text" value={bandName} onChange={(e) => setBandName(e.target.value)} className="w-full bg-black border-2 border-yellow-500 p-2 text-xl outline-none" placeholder="The Sonic Boom" />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 font-bold uppercase text-xs">MASCOT PICKER</label>
              <div className="grid grid-cols-4 gap-1 mb-2">
                  {MASCOTS.slice(0, 11).map(m => (
                      <button 
                        key={m} 
                        onClick={() => { setMascot(m); setIsCustomMascot(false); }}
                        className={`text-[9px] py-1 border transition-colors ${!isCustomMascot && mascot === m ? 'bg-green-600 border-white' : 'bg-black border-gray-700 text-gray-400'}`}
                      >
                          {m.toUpperCase()}
                      </button>
                  ))}
                  <button 
                    onClick={() => setIsCustomMascot(true)}
                    className={`text-[9px] py-1 border transition-colors ${isCustomMascot ? 'bg-green-600 border-white' : 'bg-black border-gray-700 text-gray-400'}`}
                  >
                      OTHER...
                  </button>
              </div>
              {isCustomMascot && (
                  <input 
                    type="text" 
                    value={customMascot} 
                    onChange={(e) => setCustomMascot(e.target.value)}
                    placeholder="Enter Custom Mascot"
                    className="w-full bg-black border-2 border-green-500 p-2 text-sm outline-none"
                  />
              )}
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div>
                 <label className="block text-gray-400 mb-2 font-bold uppercase text-xs">PRIMARY COLOR</label>
                 <div className="flex flex-wrap gap-2">
                    {COLORS.map(c => (
                      <div key={c.name} onClick={() => { setPrimaryColor(c.hex); setPresetLogo(undefined); }} className={`w-8 h-8 cursor-pointer border-2 ${primaryColor === c.hex ? 'border-white scale-125 shadow-lg' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} />
                    ))}
                 </div>
               </div>
               <div>
                 <label className="block text-gray-400 mb-2 font-bold uppercase text-xs">SECONDARY COLOR</label>
                 <div className="flex flex-wrap gap-2">
                    {COLORS.map(c => (
                      <div key={c.name} onClick={() => { setSecondaryColor(c.hex); setPresetLogo(undefined); }} className={`w-8 h-8 cursor-pointer border-2 ${secondaryColor === c.hex ? 'border-white scale-125 shadow-lg' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} />
                    ))}
                 </div>
               </div>
            </div>
          </div>
        ) : (
            <div className="flex gap-4 h-full">
                {/* Left: Toggles */}
                <div className="w-1/2 space-y-4 overflow-y-auto h-full pr-2 custom-scrollbar">
                    <div className="bg-black/40 p-4 border border-gray-600">
                        <h3 className="text-yellow-400 font-bold uppercase mb-2">Director's Note</h3>
                        <p className="text-xs text-gray-300 italic mb-2">
                            "Since the firing of {previousDirectorName}, enrollment is unpredictable. Choose the sections we will field, but expect a randomized turnout."
                        </p>
                        <div className="text-xs text-green-400 font-bold">Projected Loyalty: {Math.floor(loyaltyMod * 100)}%</div>
                    </div>

                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest border-b border-gray-600 pb-2">Active Sections</p>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.keys(activeInstruments).map(key => (
                            <div key={key} className="relative">
                                <button 
                                    onClick={() => key === 'TENORS' ? setShowTenorOptions(!showTenorOptions) : toggleInstrument(key)}
                                    onMouseEnter={() => {
                                        if (key !== 'TENORS') setPreviewInstrument(key as InstrumentType);
                                        else if (tenorConfig[InstrumentType.TENOR_QUADS]) setPreviewInstrument(InstrumentType.TENOR_QUADS);
                                    }}
                                    disabled={key === InstrumentType.MACE}
                                    className={`w-full flex justify-between items-center p-3 border-2 transition-all ${activeInstruments[key] ? 'bg-blue-900 border-blue-400 text-white' : 'bg-black border-gray-700 text-gray-500 hover:bg-gray-800'}`}
                                >
                                    <span className="font-bold text-xs">{key} {key === 'TENORS' ? '▼' : ''}</span>
                                    <div className={`w-4 h-4 border flex items-center justify-center text-[10px] ${activeInstruments[key] ? 'bg-green-500 border-white text-black' : 'border-gray-500'}`}>
                                        {activeInstruments[key] && '✓'}
                                    </div>
                                </button>
                                
                                {/* Tenor Submenu */}
                                {key === 'TENORS' && showTenorOptions && (
                                    <div className="absolute top-full left-0 w-full bg-slate-800 border-2 border-blue-400 z-10 p-2 shadow-xl animate-fade-in mt-1">
                                        <div className="text-[9px] font-bold text-gray-400 mb-2 uppercase">Tenor Types</div>
                                        <div className="space-y-1">
                                            <label className="flex items-center gap-2 cursor-pointer p-1 hover:bg-white/10" onMouseEnter={() => setPreviewInstrument(InstrumentType.TENOR_QUADS)}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={tenorConfig[InstrumentType.TENOR_QUADS]}
                                                    onChange={(e) => {
                                                        setTenorConfig(prev => ({...prev, [InstrumentType.TENOR_QUADS]: e.target.checked}));
                                                        if (e.target.checked) setActiveInstruments(prev => ({...prev, 'TENORS': true}));
                                                    }}
                                                />
                                                <span className="text-xs">Quads/Quints</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer p-1 hover:bg-white/10" onMouseEnter={() => setPreviewInstrument(InstrumentType.TENOR_CHEST)}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={tenorConfig[InstrumentType.TENOR_CHEST]}
                                                    onChange={(e) => {
                                                        setTenorConfig(prev => ({...prev, [InstrumentType.TENOR_CHEST]: e.target.checked}));
                                                        if (e.target.checked) setActiveInstruments(prev => ({...prev, 'TENORS': true}));
                                                    }}
                                                />
                                                <span className="text-xs">Single (Chest)</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer p-1 hover:bg-white/10" onMouseEnter={() => setPreviewInstrument(InstrumentType.TENOR_WAIST)}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={tenorConfig[InstrumentType.TENOR_WAIST]}
                                                    onChange={(e) => {
                                                        setTenorConfig(prev => ({...prev, [InstrumentType.TENOR_WAIST]: e.target.checked}));
                                                        if (e.target.checked) setActiveInstruments(prev => ({...prev, 'TENORS': true}));
                                                    }}
                                                />
                                                <span className="text-xs">Waist Tenor</span>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Live Preview */}
                <div className="w-1/2 bg-gray-900 border-2 border-gray-700 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-black to-black opacity-80"></div>
                    <div className="relative z-10 text-center mb-4">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">PREVIEW</div>
                        <div className="text-xl font-black text-yellow-400">{previewInstrument.toUpperCase()}</div>
                    </div>
                    <div className="relative z-10 transform scale-[1.8]">
                        <BandMemberVisual 
                            instrument={previewInstrument}
                            uniform={previewUniform}
                            appearance={{ skinColor: '#dca586', hairColor: '#000', hairStyle: gender === 'FEMALE' ? 20 : 1, bodyType: 'average', accessoryId: 0 }}
                            isPlaying={true}
                        />
                    </div>
                </div>
            </div>
        )}
        
        <div className="mt-auto flex justify-end pt-4">
          <Button onClick={handleNext} className="text-xl px-12 py-4">{step < 3 ? "NEXT >>" : "FINALIZE ROSTER"}</Button>
        </div>
      </div>
    </div>
  );
};
