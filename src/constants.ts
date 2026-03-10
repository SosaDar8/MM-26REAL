
import { BandMember, InstrumentType, BandStyle, DirectorTrait, Uniform, DirectorOutfit, Appearance, Settings, ScheduleEvent, EventType, Drill, Quest, Achievement, MusicTrack, MediaPost, Moment, School, PhoneSettings, ShopItem, InstrumentDesign, SequencerTrack, MaceDesign, Job, Advisor, CampusLocation, BandIdentity, BattleMove } from './types';

// Names
export const RECRUIT_NAMES = ["Marcus", "Andre", "Tasha", "Xavier", "Isabella", "Dante", "Jasmine", "Malik", "Elena", "Julian", "Fatima", "Quincy", "Nia", "Soren", "Yuki", "Leo", "Maya", "Silas", "Tara", "DeAndre", "Keisha", "Tyrone", "Aaliyah", "Jamal", "Shanice", "Terrell", "Ebony", "Kobe", "Jalen", "Imani"];
export const RECRUIT_SURNAMES = ["Williams", "Chen", "Garcia", "Brown", "Kim", "O'Connor", "Miller", "Rossi", "Patel", "Nkosi", "Jackson", "Lee", "Santiago", "Wong", "Baker", "Murphy", "Zheng", "Silva", "Washington", "Jefferson", "Banks", "Rivers", "Jones", "Davis", "Robinson"];
export const RIVAL_DIRECTOR_NAMES = ["Director Vile", "Dr. Nemesis", "Prof. Chaos", "The Maestro", "Director Cruel", "Bandmaster Bane", "Chief Rival"];

// Game Info
export const GAME_NAME = "March Madness '26";
export const GAME_VERSION = "v2.1-Alpha";
export const INITIAL_FUNDS = 5000;
export const INITIAL_FANS = 100;
export const GRID_SIZE = 16;

// Achievements
export const MINI_ACHIEVEMENTS = [
    { id: 'first_recruit', title: 'First Hire', icon: '🤝' },
    { id: 'first_drill', title: 'Drill Designer', icon: '📐' },
    { id: 'uniform_edit', title: 'Fashionista', icon: '👕' },
    { id: 'video_upload', title: 'Going Viral', icon: '📹' },
    { id: 'lost_game', title: 'Humble Pie', icon: '📉' },
    { id: 'big_spender', title: 'Big Spender', icon: '💸' },
    { id: 'crank_it', title: 'Crank That!', icon: '🔊' },
    { id: 'practice_makes_perfect', title: 'Woodshedding', icon: '🏠' }
];

// Profanity Filter
export const BAD_WORDS = ["damn", "hell", "suck", "stupid", "idiot", "hate", "trash", "ass", "shit", "fuck", "bitch", "cunt", "dick", "pussy", "fag", "nigg", "chink", "spic", "wetback", "kike", "retard", "whore", "slut", "bastard", "cock", "tits", "penis", "vagina", "sex", "nazi", "hitler", "kill", "die", "suicide", "rapist", "molest", "pedophile"];
export const containsProfanity = (text: string): boolean => {
    if (!text) return false;
    const normalized = text.toLowerCase().replace(/[^a-z]/g, '');
    const spaced = text.toLowerCase();
    return BAD_WORDS.some(word => spaced.includes(word) || normalized.includes(word));
};

// Battle Moves
export const BATTLE_MOVES: BattleMove[] = [
    { id: 'move_wall', name: 'Wall of Sound', type: 'LOUD', power: 1.5, risk: 0.2, description: 'Overpower them with pure volume.', icon: '🔊', beats: 'TECHNICAL', losesTo: 'HYPE' },
    { id: 'move_tech', name: 'Clean Cut', type: 'TECHNICAL', power: 1.2, risk: 0.1, description: 'Show off superior articulation.', icon: '🎼', beats: 'HYPE', losesTo: 'LOUD' },
    { id: 'move_dance', name: 'Flashy Dance', type: 'HYPE', power: 2.0, risk: 0.4, description: 'Get the crowd involved. High risk.', icon: '💃', beats: 'LOUD', losesTo: 'TECHNICAL' }
];

// Fonts
export const TINY_FONT: Record<string, number[]> = {
    'A': [0,1,0, 1,0,1, 1,1,1, 1,0,1, 1,0,1],
    'B': [1,1,0, 1,0,1, 1,1,0, 1,0,1, 1,1,0],
    'C': [0,1,1, 1,0,0, 1,0,0, 1,0,0, 0,1,1],
    'D': [1,1,0, 1,0,1, 1,0,1, 1,0,1, 1,1,0],
    'E': [1,1,1, 1,0,0, 1,1,0, 1,0,0, 1,1,1],
    'F': [1,1,1, 1,0,0, 1,1,0, 1,0,0, 1,0,0],
    'G': [0,1,1, 1,0,0, 1,0,1, 1,0,1, 0,1,1],
    'H': [1,0,1, 1,0,1, 1,1,1, 1,0,1, 1,0,1],
    'I': [1,1,1, 0,1,0, 0,1,0, 0,1,0, 1,1,1],
    'J': [0,0,1, 0,0,1, 0,0,1, 1,0,1, 0,1,0],
    'K': [1,0,1, 1,0,1, 1,1,0, 1,0,1, 1,0,1],
    'L': [1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,1,1],
    'M': [1,0,1, 1,1,1, 1,0,1, 1,0,1, 1,0,1],
    'N': [1,1,0, 1,0,1, 1,0,1, 1,0,1, 1,0,1],
    'O': [0,1,0, 1,0,1, 1,0,1, 1,0,1, 0,1,0],
    'P': [1,1,0, 1,0,1, 1,1,0, 1,0,0, 1,0,0],
    'Q': [0,1,0, 1,0,1, 1,0,1, 1,1,0, 0,0,1],
    'R': [1,1,0, 1,0,1, 1,1,0, 1,0,1, 1,0,1],
    'S': [0,1,1, 1,0,0, 0,1,0, 0,0,1, 1,1,0],
    'T': [1,1,1, 0,1,0, 0,1,0, 0,1,0, 0,1,0],
    'U': [1,0,1, 1,0,1, 1,0,1, 1,0,1, 0,1,0],
    'V': [1,0,1, 1,0,1, 1,0,1, 1,0,1, 0,1,0],
    'W': [1,0,1, 1,0,1, 1,0,1, 1,1,1, 1,0,1],
    'X': [1,0,1, 1,0,1, 0,1,0, 1,0,1, 1,0,1],
    'Y': [1,0,1, 1,0,1, 0,1,0, 0,1,0, 0,1,0],
    'Z': [1,1,1, 0,0,1, 0,1,0, 1,0,0, 1,1,1],
    '&': [0,1,0, 1,0,1, 0,1,0, 1,0,1, 1,0,1],
    ' ': [0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0]
};

// Descriptions & Text
export const TRAIT_DESCRIPTIONS = {
  [DirectorTrait.TACTICAL]: "Master of the 8-to-5. Precision wins championships.",
  [DirectorTrait.SHOWMAN]: "It's all about the flash. Hype the crowd, win the game.",
  [DirectorTrait.CREATIVE]: "Innovator of the craft. Custom arrangements and style.",
  [DirectorTrait.DISCIPLINED]: "Strict adherence to tradition. Cleanest sound on the yard."
};

export const SCHOOL_PREFIXES = ["Southern", "North Carolina", "Florida", "Virginia", "Texas", "Alabama", "Tennessee", "Georgia", "Mississippi", "Louisiana", "Prairie", "Hampton"];
export const SCHOOL_NOUNS = ["A&M", "State", "University", "Tech", "College", "Institute"];
export const BAND_ADJECTIVES = ["Marching", "Fighting", "Golden", "Sonic", "Thunder", "Iron", "Royal", "Scarlet", "Blue", "Mighty", "Elite", "Legendary", "Funk", "Soul"];
export const BAND_NOUNS = ["Storm", "Legion", "Force", "Sound", "Brigade", "Machine", "Wave", "Vanguard", "Regiment", "Brass", "Corps", "Empire", "Explosion", "Thunder"];

export const MASCOTS = ["Tigers", "Bulldogs", "Eagles", "Hornets", "Rattlers", "Storm", "Titans", "Knights", "Spartans", "Wolves", "Bears", "Lions", "Gators", "Dragons", "Vikings", "Wildcats", "Cougars", "Mustangs", "Hawks", "Panthers", "Bobcats", "Jaguars", "Aggies"];

export const FORMER_DIRECTORS = ["Dr. Highstep", "Prof. Cadence", "Maestro Beats", "Director Forte", "Dr. Rimshot", "Ms. Glissando", "Doc Brass", "Chief Rhythm"];
export const FIRING_REASONS = ["spending the entire budget on gold capes", "refusing to play anything but 90s R&B for 3 hours", "challenging the rival band to a dance-off and losing", "scheduling practice at 3 AM for 'acoustic optimization'", "trying to replace the woodwinds with more tubas", "using the scholarship fund to buy a solid gold mace"];
export const DIRECTOR_WARNINGS = ["Watch out for this one. Great player, but frequently skips sectionals.", "Academic probation risk. They need to focus on their GPA.", "A bit of a showoff. Might break formation to play a solo.", "Excellent discipline. Future section leader candidate.", "Behavioral concerns in their previous band. Proceed with caution.", "High talent, but prone to fatigue during long parades.", "Previously suspended for 'excessive dancing' during a ballad.", "Transfer student. Claims to have marched Drum Corps, but no proof."];

export const FEEDER_SCHOOLS = ["Oak Grove Middle School", "Lakeside Junior High", "North Valley Prep", "Eastside Academy", "Central Magnet School", "Grand River High", "Metro Tech Academy", "West End Conservatory"];

// Colors
export const COLORS = [
  { name: 'Red', hex: '#ef4444' }, { name: 'Blue', hex: '#3b82f6' }, { name: 'Green', hex: '#22c55e' },
  { name: 'Yellow', hex: '#eab308' }, { name: 'Purple', hex: '#a855f7' }, { name: 'Black', hex: '#09090b' },
  { name: 'White', hex: '#ffffff' }, { name: 'Gold', hex: '#fbbf24' }, { name: 'Orange', hex: '#f97316' },
  { name: 'Maroon', hex: '#800000' }, { name: 'Navy', hex: '#000080' }, { name: 'Teal', hex: '#008080' }
];

// Face Options
export const FACE_OPTIONS = {
    EYES: [
        { id: 0, name: 'Dot' }, { id: 1, name: 'Normal' }, { id: 2, name: 'Wide' },
        { id: 3, name: 'Tired' }, { id: 4, name: 'Happy' }, { id: 5, name: 'Focused' },
        { id: 6, name: 'Lashes' }, { id: 7, name: 'Almond' }
    ],
    BROWS: [
        { id: 0, name: 'None' }, { id: 1, name: 'Thin' }, { id: 2, name: 'Thick' },
        { id: 3, name: 'Arched' }, { id: 4, name: 'Angry' }, { id: 5, name: 'Sad' },
        { id: 6, name: 'Unibrow' }
    ],
    MOUTHS: [
        { id: 0, name: 'Neutral' }, { id: 1, name: 'Smile' }, { id: 2, name: 'Frown' },
        { id: 3, name: 'Open' }, { id: 4, name: 'Smirk' }, { id: 5, name: 'Grin' }
    ],
    FACIAL_HAIR: [
        { id: 0, name: 'None' }, { id: 1, name: 'Stubble' }, { id: 2, name: 'Mustache' },
        { id: 3, name: 'Goatee' }, { id: 4, name: 'Full Beard' }, { id: 5, name: 'Chinstrap' }
    ],
    GLASSES: [
        { id: 0, name: 'None' }, { id: 1, name: 'Round' }, { id: 2, name: 'Square' },
        { id: 3, name: 'Aviator' }, { id: 4, name: 'Shades' }, { id: 5, name: 'Cat Eye' }
    ]
};

// Appearance
export const DEFAULT_APPEARANCE: Appearance = { 
    skinColor: '#dca586', hairColor: '#000000', hairStyle: 1, bodyType: 'average', accessoryId: 0, 
    eyeId: 1, eyebrowId: 1, mouthId: 0, facialHairId: 0, glassesId: 0,
    hairScale: 1, height: 1.0, 
    hairTransform: { scaleX: 1, scaleY: 1, x: 0, y: 0 }, 
    hatTransform: { scaleX: 1, scaleY: 1, x: 0, y: 0 }, 
    accessoryTransform: { scaleX: 1, scaleY: 1, x: 0, y: 0 },
    eyesTransform: { scaleX: 1, scaleY: 1, x: 0, y: 0 },
    browsTransform: { scaleX: 1, scaleY: 1, x: 0, y: 0 },
    facialHairTransform: { scaleX: 1, scaleY: 1, x: 0, y: 0 },
    glassesTransform: { scaleX: 1, scaleY: 1, x: 0, y: 0 }
};

export const getRandomAppearance = (): Appearance => {
    const skins = ['#fecaca', '#dca586', '#a16207', '#5D4037', '#3E2723', '#fcd34d'];
    const hairs = ['#000000', '#4a3b32', '#eab308', '#ffffff', '#ef4444'];
    const bodyTypes: Appearance['bodyType'][] = ['slim', 'average', 'heavy'];
    return { 
        skinColor: skins[Math.floor(Math.random() * skins.length)], 
        hairColor: hairs[Math.floor(Math.random() * hairs.length)], 
        hairStyle: Math.floor(Math.random() * 14), 
        bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)], 
        accessoryId: 0,
        eyeId: Math.floor(Math.random() * 6),
        eyebrowId: Math.floor(Math.random() * 5),
        mouthId: Math.floor(Math.random() * 4),
        facialHairId: 0, 
        glassesId: 0,
        hairScale: 1,
        height: 0.95 + Math.random() * 0.1,
        hairTransform: { scaleX: 1, scaleY: 1, x: 0, y: 0 },
        hatTransform: { scaleX: 1, scaleY: 1, x: 0, y: 0 },
        accessoryTransform: { scaleX: 1, scaleY: 1, x: 0, y: 0 },
        eyesTransform: { scaleX: 1, scaleY: 1, x: 0, y: 0 },
        browsTransform: { scaleX: 1, scaleY: 1, x: 0, y: 0 },
        facialHairTransform: { scaleX: 1, scaleY: 1, x: 0, y: 0 },
        glassesTransform: { scaleX: 1, scaleY: 1, x: 0, y: 0 }
    };
};

// Schedules
export const BASE_HS_SCHEDULE: ScheduleEvent[] = [
    { id: 'hs_1', type: EventType.FOOTBALL_GAME, name: 'Season Opener', opponent: 'East Side High', date: 1, reward: 300, completed: false, isHome: true, level: 'HS' },
    { id: 'hs_2', type: EventType.PARADE, name: 'Heritage Parade', date: 3, reward: 200, completed: false, level: 'HS' },
    { id: 'hs_3', type: EventType.FOOTBALL_GAME, name: 'Rivalry Game', opponent: 'West Tech', date: 7, reward: 500, completed: false, isHome: true, isRivalry: true, level: 'HS' },
    { id: 'hs_4', type: EventType.FUNDRAISER, name: 'Car Wash', date: 10, reward: 400, completed: false, level: 'HS' },
    { id: 'hs_5', type: EventType.FOOTBALL_GAME, name: 'District Playoffs', opponent: 'Central Catholic', date: 12, reward: 600, completed: false, isHome: false, level: 'HS' },
    { id: 'hs_6', type: EventType.HOMECOMING, name: 'HOMECOMING', opponent: 'South Shore', date: 15, reward: 800, completed: false, isHome: true, level: 'HS' },
    { id: 'hs_7', type: EventType.BASKETBALL_GAME, name: 'Winter Classic', opponent: 'North Academy', date: 17, reward: 400, completed: false, isHome: true, level: 'HS' },
    { id: 'hs_8', type: EventType.BATTLE, name: 'Battle of the Bands', opponent: 'North Academy', date: 18, reward: 1000, completed: false, level: 'HS' }
];

export const BASE_COLLEGE_SCHEDULE: ScheduleEvent[] = [
    { id: 'col_1', type: EventType.FOOTBALL_GAME, name: 'Labor Day Classic', opponent: 'State U', date: 1, reward: 1000, completed: false, isHome: true, level: 'COLLEGE' },
    { id: 'col_2', type: EventType.BATTLE, name: 'Battle of the Bands', opponent: 'Southern A&M', date: 4, reward: 2000, completed: false, level: 'COLLEGE' },
    { id: 'col_3', type: EventType.HOMECOMING, name: 'HOMECOMING', opponent: 'Tech State', date: 8, reward: 3000, completed: false, isHome: true, level: 'COLLEGE' },
    { id: 'col_4', type: EventType.CONCERT, name: 'Halftime Showcase', date: 12, reward: 1500, completed: false, level: 'COLLEGE' },
    { id: 'col_5', type: EventType.FOOTBALL_GAME, name: 'Bayou Classic', opponent: 'Grambling State', date: 14, reward: 2500, completed: false, isHome: false, level: 'COLLEGE' },
    { id: 'col_6', type: EventType.BASKETBALL_GAME, name: 'March Madness Prep', opponent: 'Eastern U', date: 15, reward: 1200, completed: false, isHome: true, level: 'COLLEGE' },
    { id: 'col_7', type: EventType.BATTLE, name: 'NATIONAL CHAMPIONSHIP', opponent: 'Grand Valley', date: 16, reward: 10000, completed: false, level: 'COLLEGE' }
];

export const generateRandomSchedule = (level: 'HS' | 'COLLEGE'): ScheduleEvent[] => {
    const baseSchedule = level === 'HS' ? BASE_HS_SCHEDULE : BASE_COLLEGE_SCHEDULE;
    return baseSchedule.map(event => {
        if (event.type === EventType.PARADE || event.type === EventType.FUNDRAISER || event.type === EventType.CONCERT) {
            return { ...event, id: `${event.id}_${Date.now()}` };
        }
        const prefix = SCHOOL_PREFIXES[Math.floor(Math.random() * SCHOOL_PREFIXES.length)];
        const noun = SCHOOL_NOUNS[Math.floor(Math.random() * SCHOOL_NOUNS.length)];
        const newOpponent = `${prefix} ${noun}`;
        return {
            ...event,
            id: `${event.id}_${Date.now()}_${Math.random()}`,
            opponent: newOpponent
        };
    });
};

// Designs
export const DEFAULT_MACE_DESIGN: MaceDesign = { id: 'dm_mace_default', headShape: 'GLOBE', headColor: '#fbbf24', shaftColor: '#451a03', cordPrimary: '#fbbf24', cordSecondary: '#ef4444', ferruleColor: '#fbbf24', finish: 'SHINY' };
export const DEFAULT_INSTRUMENT_DESIGNS = {
    brass: { id: 'def_brass', type: 'BRASS', primaryColor: '#fbbf24', secondaryColor: '#ffffff', finish: 'SHINY' } as InstrumentDesign,
    woodwind: { id: 'def_ww', type: 'WOODWIND', primaryColor: '#000000', secondaryColor: '#c0c0c0', finish: 'MATTE' } as InstrumentDesign,
    percussion: { id: 'def_perc', type: 'PERCUSSION', primaryColor: '#ffffff', secondaryColor: '#c0c0c0', detailColor: '#ffffff', finish: 'SHINY' } as InstrumentDesign,
    mace: DEFAULT_MACE_DESIGN
};

// Settings & Drill
export const INITIAL_SETTINGS: Settings = { masterVolume: 80, musicVolume: 60, sfxVolume: 100, graphicsQuality: 'HIGH', inputMode: 'PC', retroMode: true, keyBindings: { L0: 'd', L1: 'f', L2: 'j', L3: 'k' } };
export const INITIAL_DRILL: Drill = { id: 'd1', name: 'Standard Opener', frames: [{ id: 'f1', order: 0, points: [], name: 'Set 1' }] };

// Quests
export const INITIAL_QUESTS: Quest[] = [
    { id: 'q1', title: 'Road to Glory', description: 'Complete your first football game simulation.', current: 0, target: 1, reward: '$500', completed: false, type: 'SEASON', mode: 'BOTH' },
    { id: 'q2', title: 'Full House', description: 'Recruit a small section of 2 members.', current: 0, target: 2, reward: 'Prestige +10', completed: false, type: 'CAREER', mode: 'DIRECTOR' },
    { id: 'q3', title: 'Perfect 10', description: 'Achieve 100% accuracy in a rhythm segment.', current: 0, target: 1, reward: 'Golden Plume', completed: false, type: 'DAILY', mode: 'BOTH' },
    { id: 'q4', title: 'Showtime', description: 'Perform 2 Halftime Shows.', current: 0, target: 2, reward: 'New Uniform Option', completed: false, type: 'SEASON', mode: 'DIRECTOR' },
    { id: 'q5', title: 'Trendsetter', description: 'Gain 250 Fans.', current: 0, target: 250, reward: '$500', completed: false, type: 'CAREER', mode: 'BOTH' },
    { id: 'q6', title: 'Practice Makes Perfect', description: 'Complete 3 practice sessions.', current: 0, target: 3, reward: 'Skill Boost', completed: false, type: 'DAILY', mode: 'BOTH' }
];

// Achievements
export const INITIAL_ACHIEVEMENTS: Achievement[] = [
    { id: 'a1', name: 'Band of the Year', description: 'Win the final Battle of the Bands tournament.', icon: '🏆', unlocked: false },
    { id: 'a2', name: 'Legacy Builder', description: 'Reach 500 Fans.', icon: '📈', unlocked: false },
    { id: 'a3', name: 'Style Icon', description: 'Unlock 3 Shop Items.', icon: '🕶️', unlocked: false },
    { id: 'a4', name: 'Master Conductor', description: 'Score 90% on a Medium song.', icon: '🎼', unlocked: false },
    { id: 'a5', name: 'Grand Battle Champion', description: 'Defeat a Rival in a Stand Battle.', icon: '⚔️', unlocked: false },
    { id: 'a6', name: 'Million Dollar Band', description: 'Accumulate $5,000 in funds.', icon: '💰', unlocked: false }
];

// Tracks
export const INITIAL_TRACKS: MusicTrack[] = [
    { id: 't_fight_1', title: 'Victory March', artist: 'Traditional', bpm: 120, isCustom: false, duration: '0:30', category: 'SHOW' },
    { id: 't_fight_2', title: 'Fight for Glory', artist: 'School Spirit', bpm: 128, isCustom: false, duration: '0:25', category: 'SHOW' },
    { id: 't_hype_1', title: 'Neck (Tribute)', artist: 'The Band', bpm: 140, isCustom: false, duration: '0:40', category: 'HYPE' },
    { id: 't_hype_2', title: 'Swag Surf', artist: 'Stadium Crew', bpm: 70, isCustom: false, duration: '0:45', category: 'HYPE' },
    { id: 't_hype_3', title: 'Get Crunk', artist: 'Brass Section', bpm: 145, isCustom: false, duration: '0:30', category: 'HYPE' },
    { id: 't_hype_4', title: 'Sonic Boom', artist: 'Low Brass', bpm: 135, isCustom: false, duration: '0:35', category: 'HYPE' },
    { id: 't_cad_1', title: 'Spider Web', artist: 'Drumline', bpm: 110, isCustom: false, duration: '0:20', category: 'CADENCE' },
    { id: 't_cad_2', title: 'Jig 2', artist: 'Drumline', bpm: 120, isCustom: false, duration: '0:20', category: 'CADENCE' },
    { id: 't_cad_3', title: 'Buck Wild', artist: 'Drumline', bpm: 130, isCustom: false, duration: '0:15', category: 'CADENCE' },
    { id: 't_chant_1', title: 'Let\'s Go Band', artist: 'Cheer Squad', bpm: 0, isCustom: false, duration: '0:10', category: 'CHANT', lyrics: "LET'S GO BAND! LET'S GO!" },
    { id: 't_chant_2', title: 'Defense', artist: 'Crowd', bpm: 0, isCustom: false, duration: '0:10', category: 'CHANT', lyrics: "DE-FENSE! (CLAP CLAP) DE-FENSE!" },
    { id: 't_chant_3', title: 'We Ready', artist: 'Crowd', bpm: 0, isCustom: false, duration: '0:10', category: 'CHANT', lyrics: "WE READY! WE READY! FOR Y'ALL!" }
];

// Data
export const SCHOOLS_DATA: School[] = [
    { id: 'hs1', name: 'Oak Valley High', type: 'High School', prestige: 2, style: BandStyle.MILITARY, colors: ['#22c55e', '#ffffff'], description: "Strict discipline and clean lines." },
    { id: 'hs2', name: 'Metro Arts High', type: 'High School', prestige: 4, style: BandStyle.SHOW, colors: ['#a855f7', '#fbbf24'], description: "The flashy kings of the north." },
    { id: 'col1', name: 'Pixel University', type: 'College', prestige: 4, style: BandStyle.SHOW, colors: ['#ef4444', '#ffffff'], description: "Legendary halftime innovators." },
    { id: 'col2', name: 'Southern A&M', type: 'College', prestige: 5, style: BandStyle.SHOW, colors: ['#eab308', '#000000'], description: "Home of the loudest brass in the south." }
];

export const CAMPUS_LOCATIONS: CampusLocation[] = [
    { id: 'DORM', name: 'Student Dorm', x: 20, y: 70, icon: '🏠', isOpen: true, color: 'bg-blue-600' },
    { id: 'BAND_HALL', name: 'The Practice Pit', x: 50, y: 50, icon: '🎺', isOpen: true, color: 'bg-yellow-600' },
    { id: 'SCOUTING', name: 'Visit High Schools', x: 80, y: 30, icon: '🚐', isOpen: true, color: 'bg-red-600' }
];

export const SHOP_ITEMS: ShopItem[] = [
    { id: 'item_hoodie', name: 'Alumni Hoodie', category: 'CLOTHING', price: 150, description: 'Commemorative tour wear.', icon: '🧥', clothingId: 'top_hoodie', clothingType: 'TOP' },
    { id: 'item_megaphon', name: 'Golden Megaphone', category: 'DECOR', price: 200, description: 'Director classic.', icon: '📣' },
    { id: 'item_sunglasses', name: 'Aviators', category: 'ACCESSORY', price: 100, description: 'Look cool on the field.', icon: '🕶️', clothingId: 'accessory_glasses' },
    { id: 'item_plume', name: 'Golden Plume', category: 'ACCESSORY', price: 300, description: 'Shines under stadium lights.', icon: '🪶', reqReputation: 200 },
    { id: 'item_led', name: 'LED Lights', category: 'DECOR', price: 150, description: 'Makes your office glow.', icon: '💡' },
    { id: 'item_drumkey', name: 'Gold Drum Key', category: 'GEAR', price: 50, description: 'Tuning is everything.', icon: '🔑' },
    { id: 'item_metronome', name: 'Vintage Metronome', category: 'DECOR', price: 120, description: 'Keeps perfect time.', icon: '⏲️' },
    { id: 'item_vest', name: 'Utility Vest', category: 'CLOTHING', price: 180, description: 'Pockets for everything.', icon: '🦺', clothingId: 'top_vest', clothingType: 'TOP' },
    { id: 'item_bucket', name: 'Bucket Hat', category: 'CLOTHING', price: 80, description: 'Rehearsal essential.', icon: '🎩', clothingId: 'hat_bucket', clothingType: 'HAT' }
];

export const WALLPAPERS = [ { id: 'wp_dark', name: 'Tournament Night', color: '#0f172a' }, { id: 'wp_light', name: 'Gameday Sky', color: '#f8fafc' } ];

// Separated Hair Styles for Avatar Editor
export const HAIR_STYLES_MALE = [ { id: 0, name: 'Bald' }, { id: 1, name: 'Buzz' }, { id: 2, name: 'Fade' }, { id: 3, name: 'Afro' }, { id: 4, name: 'Long Flow' }, { id: 5, name: 'High Top' }, { id: 6, name: 'Dreads' }, { id: 7, name: 'Bun' }, { id: 8, name: 'Waves' }, { id: 9, name: 'Twists' }, { id: 10, name: 'Puffs' }, { id: 11, name: 'Cornrows' }, { id: 12, name: 'Locs (Long)' }, { id: 13, name: 'Mohawk' } ];

export const HAIR_STYLES_FEMALE = [
    { id: 20, name: 'Long Straight' },
    { id: 21, name: 'Ponytail' },
    { id: 22, name: 'Bob Cut' },
    { id: 23, name: 'Top Bun' },
    { id: 24, name: 'Braids' },
    { id: 25, name: 'Pixie' },
    { id: 26, name: 'Curly' },
    { id: 27, name: 'Afro Puff' },
    { id: 28, name: 'Pigtails' }
];

export const CLOTHING_OPTIONS = {
    TOPS: [ { id: 'top_basic_tee', name: 'Section Tee' }, { id: 'top_varsity', name: 'Alumni Varsity' }, { id: 'top_suit', name: 'Gameday Suit' }, { id: 'top_hbcu', name: 'Heritage Tunic' }, { id: 'top_windbreaker', name: 'Warmup Breaker' }, { id: 'top_polo', name: 'Director Polo' }, { id: 'top_vest', name: 'Utility Vest' }, { id: 'top_hoodie', name: 'Alumni Hoodie' } ],
    BOTTOMS: [ { id: 'bot_jeans', name: 'Jeans' }, { id: 'bot_shorts', name: 'Shorts' }, { id: 'bot_slacks', name: 'Dress Slacks' } ],
    HATS: [ { id: 'hat_cap', name: 'Cap' }, { id: 'hat_beanie', name: 'Beanie' }, { id: 'hat_shako', name: 'Shako' }, { id: 'hat_bucket', name: 'Bucket' } ]
};

export const OG_MEMBERS: BandMember[] = [ { id: 'og_dave', name: 'Drum Major Dave', instrument: InstrumentType.MACE, marchSkill: 99, playSkill: 99, showmanship: 100, salary: 1200, appearance: { skinColor: '#8d5524', hairColor: '#000000', hairStyle: 2, bodyType: 'average', accessoryId: 1, hairScale: 1, height: 1.05, hairTransform: {scaleX: 1, scaleY: 1, x:0, y:0}, hatTransform: {scaleX: 1, scaleY: 1, x:0, y:0}, accessoryTransform: {scaleX: 1, scaleY: 1, x:0, y:0} }, archetype: 'Prodigy', bio: 'The legendary leader.', isOG: true, status: 'P1', chemistry: 100 } ];

export const MOCK_RECRUITS: BandMember[] = [ { id: 'r1', name: 'Marcus Williams', instrument: InstrumentType.SNARE, marchSkill: 75, playSkill: 80, showmanship: 60, salary: 500, appearance: getRandomAppearance(), archetype: 'Grinder', bio: 'Former competitive sectional leader.', directorNote: "Very reliable.", chemistry: 75 } ];

export const generateBalancedRoster = (count: number): BandMember[] => {
    const roster: BandMember[] = [];
    const instruments = Object.values(InstrumentType).filter(i => i !== InstrumentType.MACE);
    
    // Shuffle the instrument list to ensure variety even with small recruitment numbers
    for (let i = instruments.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [instruments[i], instruments[j]] = [instruments[j], instruments[i]];
    }

    for (let i = 0; i < count; i++) {
        const name = RECRUIT_NAMES[Math.floor(Math.random() * RECRUIT_NAMES.length)];
        const surname = RECRUIT_SURNAMES[Math.floor(Math.random() * RECRUIT_SURNAMES.length)];
        roster.push({
            id: `m-${i}-${Date.now()}`,
            name: `${name} ${surname}`,
            instrument: instruments[i % instruments.length],
            marchSkill: 40 + Math.floor(Math.random() * 50),
            playSkill: 40 + Math.floor(Math.random() * 50),
            showmanship: 30 + Math.floor(Math.random() * 60),
            salary: 100 + Math.floor(Math.random() * 400),
            appearance: getRandomAppearance(),
            archetype: 'Grinder',
            bio: 'Ready to contribute.',
            directorNote: DIRECTOR_WARNINGS[Math.floor(Math.random() * DIRECTOR_WARNINGS.length)],
            chemistry: 50 + Math.floor(Math.random() * 50)
        });
    }
    return roster;
};

export const LOGO_PRESETS = [ { name: 'Shield', grid: Array(100).fill('#3b82f6') }, { name: 'Star', grid: Array(100).fill('transparent').map((_,i) => [13,14,15,16,23,24,25,26,32,33,36,37,42,43,46,47,52,53,56,57,62,63,64,65,66,67,73,74,75,76].includes(i) ? '#fbbf24' : 'transparent') } ];
export const DEFAULT_UNIFORMS: Uniform[] = [{ id: 'u_default', name: 'Show Style Suite', jacketColor: '#ef4444', pantsColor: '#ffffff', hatColor: '#ef4444', plumeColor: '#ffffff', hatStyle: 'shako', jacketStyle: 'classic', pantsStyle: 'regular', styleId: 0 }];

export const getSchoolSongs = (seed: string) => ({
    fight: { title: "Madness Fight", bpm: 132, tracks: [{ instrument: 'melody', notes: [60, 0, 64, 0, 67, 0, 72, 0] }, { instrument: 'kick', notes: [1, 0, 1, 0, 1, 0, 1, 0] }] as SequencerTrack[] },
    cadence: { title: "Heavy Drumming", bpm: 110, tracks: [{ instrument: 'snare', notes: [1, 1, 0, 1, 1, 1, 0, 1] }, { instrument: 'kick', notes: [1, 0, 0, 0, 1, 0, 0, 0] }] as SequencerTrack[] }
});

export const GREEK_ORGS = { FRATERNITIES: ['Kappa Kappa Psi', 'Phi Mu Alpha', 'Alpha Phi Alpha'], SORORITIES: ['Tau Beta Sigma', 'Sigma Alpha Iota', 'Delta Sigma Theta'], COED: ['Mu Beta Psi'] };
export const PREWRITTEN_SPEECHES = { AGGRESSIVE: ["Make them regret stepping on our field!", "No mercy on the downbeat!", "Play loud, play proud!"], INSPIRING: ["Look at the person next to you. Play for them.", "Music is emotion. Make them feel it.", "Be great today."], TECHNICAL: ["Watch your intervals.", "Clean attacks, clean releases.", "Focus on the conductor."] };
export const BOOSTER_REQUESTS = [ { id: 1, text: "The alumni want more TRADITIONAL marches. Play 'Stars & Stripes'?", effect: { funds: 300, hype: -10 } }, { id: 2, text: "A donor demands we cut the trumpet solo. It's too flashy.", effect: { funds: 150, hype: -5 } }, { id: 3, text: "Can we get the mascot to dance more? The kids love it.", effect: { funds: 200, hype: 5 } }, { id: 4, text: "The stadium hot dogs are cold. Fix it or no donation!", effect: { funds: -50, hype: 0 } }, { id: 5, text: "Play louder! We want to hear you from the parking lot!", effect: { funds: 100, hype: 10 } } ];
export const GAME_TIPS = [ "FAMU's Marching 100 was the first HBCU band to win the Sudler Trophy.", "Southern University's Human Jukebox is known for their powerful sound and precision.", "Tennessee State's Aristocrat of Bands was the first HBCU band to play at a presidential inauguration.", "Visit High Schools on the map to find fresh talent.", "Custom uniforms boost band prestige.", "Check your phone for messages from the Dean.", "Norfolk State's Spartan Legion is famous for their military precision and powerful sound." ];
export const ADVISOR_DATA: Advisor = { name: "Dr. Roberts", gender: 'Female', dialogue: ["GPA affects your eligibility.", "Watch your energy levels."] };
export const JOBS: Job[] = [{ id: 'job_burger', title: 'Burger Flipper', wage: 40, energyCost: 30, description: 'Greasy but pays.', sceneType: 'WORK_BURGER' }];
export const DEFAULT_OUTFITS: DirectorOutfit[] = [{ id: 'do_default', name: 'Standard Uniform', topColor: '#ffffff', bottomColor: '#000000', style: 'casual', topId: 'top_basic_tee', bottomId: 'bot_jeans', accentColor: '#fbbf24' }];
export const INITIAL_MEDIA: MediaPost[] = [{ id: 'post_init_1', author: 'Band Official', handle: '@TheBand', content: 'Welcome to the new season! #marching', likes: 10, timestamp: '1d ago', type: 'SOCIAL', sentiment: 'POSITIVE', avatarColor: '#3b82f6' }];
export const INITIAL_MOMENTS: Moment[] = [];
export const INITIAL_PHONE_SETTINGS: PhoneSettings = { wallpaper: 'wp_dark', theme: 'dark' };
export const DEFAULT_DM_UNIFORM: Uniform = { id: 'u_dm_default', name: 'Drum Major Uniform', jacketColor: '#ffffff', pantsColor: '#ffffff', hatColor: '#ffffff', plumeColor: '#fbbf24', hatStyle: 'shako', jacketStyle: 'military', pantsStyle: 'bibbers', styleId: 0, isDrumMajor: true };
export const SCHOOL_PRESETS = [ { name: 'Southern A&M', mascot: 'Jaguars', primary: '#fbbf24', secondary: '#000000', band: 'The Human Jukebox', type: 'College' as const }, { name: 'Florida Tech', mascot: 'Rattlers', primary: '#f97316', secondary: '#22c55e', band: 'The Marching 100', type: 'College' as const }, { name: 'North Carolina State', mascot: 'Spartans', primary: '#22c55e', secondary: '#fbbf24', band: 'The Legion', type: 'College' as const }, { name: 'Prairie Valley', mascot: 'Panthers', primary: '#a855f7', secondary: '#fbbf24', band: 'The Storm', type: 'College' as const }, { name: 'Tennessee A&I', mascot: 'Tigers', primary: '#3b82f6', secondary: '#ffffff', band: 'Aristocrat of Bands', type: 'College' as const } ];
export const generateProceduralLogo = (primary: string, secondary: string): string[] => Array(100).fill(null).map((_, i) => (i % 2 === 0 ? primary : secondary));
export const generateOpponentIdentity = (name: string): { identity: BandIdentity, uniform: Uniform } => { let hash = 0; for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash); const colorIndex1 = Math.abs(hash) % COLORS.length; const colorIndex2 = Math.abs(hash >> 3) % COLORS.length; const primary = COLORS[colorIndex1].hex; const secondary = COLORS[colorIndex2 === colorIndex1 ? (colorIndex1 + 1) % COLORS.length : colorIndex2].hex; const hatStyles = ['shako', 'stetson', 'beret', 'cap']; const hatStyle = hatStyles[Math.abs(hash) % hatStyles.length] as any; const mascot = MASCOTS[Math.abs(hash) % MASCOTS.length]; return { identity: { schoolName: name, schoolType: 'High School', mascot: mascot, primaryColor: primary, secondaryColor: secondary, logo: Array(100).fill(null).map((_, i) => (i % 2 === 0 ? primary : secondary)) }, uniform: { id: `opp_${name}`, name: name, jacketColor: primary, pantsColor: Math.abs(hash) % 2 === 0 ? '#ffffff' : '#000000', hatColor: primary, plumeColor: secondary, accentColor: secondary, hatStyle: hatStyle, jacketStyle: 'classic', pantsStyle: 'regular', isDrumMajor: false } }; };
export const VIDEO_TITLES = [ "INSANE DRUMLINE BATTLE VS {rivalName}", "{bandName} FULL SHOW 2024 (HIGH CAM)", "TRUMPET SCREAMER COMPILATION", "Band Director Reacts to {bandName}", "Day in the Life: Marching Band", "Why {bandName} is UNDEFEATED" ];
export const CREDITS_DATA = [ { role: "Lead Developer", name: "You" }, { role: "Art Direction", name: "CSS & Tailwind" }, { role: "Music Engine", name: "Web Audio API" }, { role: "Special Thanks", name: "React Community" } ];
export const RIVAL_CHANTS = [ "HEY {bandName}! PACK IT UP!", "{mascot} AIN'T LOUD! WE LOUD!", "GET BACK ON THE BUS!", "WE READY! Y'ALL AIN'T READY!", "CAN'T HEAR YOU! TOO QUIET!", "WHO RUN THE YARD? WE RUN THE YARD!", "YOUR HORN LINE IS WEAK! PURE TRASH!", "DON'T START NOTHIN', WON'T BE NOTHIN'!", "WE THE REAL {mascot}! Y'ALL IMPOSTORS!" ];
export const PLAY_TYPES = ['RUN', 'PASS', 'KICK', 'PUNT', 'FG'];
export const PENALTIES = ['HOLDING', 'OFFSIDES', 'FALSE START', 'PASS INTERFERENCE'];
