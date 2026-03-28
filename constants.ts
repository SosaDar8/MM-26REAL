
import { BandMember, InstrumentType, BandStyle, DirectorTrait, Uniform, DirectorOutfit, Appearance, Settings, ScheduleEvent, EventType, Drill, Quest, Achievement, MusicTrack, MediaPost, Moment, School, PhoneSettings, ShopItem, InstrumentDesign, SequencerTrack, MaceDesign, Job, Advisor, CampusLocation, BandIdentity, BattleMove, StaffMember } from './types';

// Names
export const RECRUIT_NAMES = ["Marcus", "Andre", "Tasha", "Xavier", "Isabella", "Dante", "Jasmine", "Malik", "Elena", "Julian", "Fatima", "Quincy", "Nia", "Soren", "Yuki", "Leo", "Maya", "Silas", "Tara", "DeAndre", "Keisha", "Tyrone", "Aaliyah", "Jamal", "Shanice", "Terrell", "Ebony", "Kobe", "Jalen", "Imani"];
export const RECRUIT_SURNAMES = ["Williams", "Chen", "Garcia", "Brown", "Kim", "O'Connor", "Miller", "Rossi", "Patel", "Nkosi", "Jackson", "Lee", "Santiago", "Wong", "Baker", "Murphy", "Zheng", "Silva", "Washington", "Jefferson", "Banks", "Rivers", "Jones", "Davis", "Robinson"];
export const RIVAL_DIRECTOR_NAMES = ["Director Vile", "Dr. Nemesis", "Prof. Chaos", "The Maestro", "Director Cruel", "Bandmaster Bane", "Chief Rival"];

// Game Info
export const GAME_NAME = "March Madness '26";
export const GAME_VERSION = "v2.0.0-HACKER";
export const INITIAL_FUNDS = 5000;
export const INITIAL_FANS = 100;
export const GRID_SIZE = 16;

export const SPLASH_TEXTS = [
    "Tip: Practice makes perfect! (And boosts stats)",
    "Tip: Don't forget to buy new uniforms in the Booker Store.",
    "Did you know? The Konami Code unlocks Career Mode! (Up, Up, Down, Down, Left, Right, Left, Right, B, A)",
    "Woodwinds? I think you mean 'visual ensemble'.",
    "One more time... means at least five more times.",
    "If you're early, you're on time. If you're on time, you're late.",
    "Tip: Hacker mode is for cheaters... but it's fun!",
    "Water breaks are a privilege, not a right.",
    "Tip: Keep your fans happy to unlock better gear.",
    "Roll step! Don't bounce!"
];

// Achievements
export const MINI_ACHIEVEMENTS = [
    { id: 'first_recruit', title: 'First Hire', icon: '🤝' },
    { id: 'first_drill', title: 'Drill Designer', icon: '📐' },
    { id: 'uniform_edit', title: 'Fashionista', icon: '👕' },
    { id: 'video_upload', title: 'Going Viral', icon: '📹' },
    { id: 'lost_game', title: 'Humble Pie', icon: '📉' },
    { id: 'big_spender', title: 'Big Spender', icon: '💸' },
    { id: 'crank_it', title: 'Crank That!', icon: '🔊' },
    { id: 'practice_makes_perfect', title: 'Woodshedding', icon: '🏠' },
    { id: 'a1', title: 'Band of the Year', icon: '🏆' },
    { id: 'a2', title: 'Legacy Builder', icon: '📈' },
    { id: 'a3', title: 'Style Icon', icon: '🕶️' },
    { id: 'a4', title: 'Master Conductor', icon: '🎼' },
    { id: 'a5', title: 'Grand Battle Champion', icon: '⚔️' },
    { id: 'a6', title: 'Million Dollar Band', icon: '💰' },
    { id: 'a7', title: 'Look at the flick of the wrist', icon: '👾' },
    { id: 'a8', title: 'First Blood', icon: '🥇' },
    { id: 'a9', title: 'Recruitment Drive', icon: '🎺' },
    { id: 'a10', title: 'Shopaholic', icon: '🛍️' },
    { id: 'a11', title: 'Custom Tailor', icon: '🧵' },
    { id: 'a12', title: 'Drill Master', icon: '📋' },
    { id: 'nerd_alert', title: 'Nerd Alert', icon: '🤓', description: 'Reach 4.0 GPA' },
    { id: 'first_practice', title: 'First Steps', icon: '👣', description: 'Complete your first practice' },
    { id: 'virtuoso', title: 'Virtuoso', icon: '🎻', description: 'Reach 100 Skill' },
    { id: 'payday', title: 'Get Paid', icon: '💵', description: 'Complete a work shift' },
    { id: 'rank_up', title: 'Moving On Up', icon: '🚀', description: 'Increase your rank' }
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
  { name: 'Maroon', hex: '#800000' }, { name: 'Navy', hex: '#000080' }, { name: 'Teal', hex: '#008080' },
  { name: 'Grey', hex: '#9ca3af' }
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
    skinColor: '#8d5524', hairColor: '#000000', hairStyle: 1, bodyType: 'average', accessoryId: 0, 
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
    const skins = ['#8d5524', '#c68642', '#e0ac69', '#5D4037', '#3E2723', '#2B1A1A', '#f1c27d', '#ffdbac'];
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
    { id: 'hs_7', type: EventType.BATTLE, name: 'Battle of the Bands', opponent: 'North Academy', date: 18, reward: 1000, completed: false, level: 'HS' },
    { id: 'hs_8', type: EventType.BASKETBALL_GAME, name: 'Winter Classic', opponent: 'East Side High', date: 20, reward: 300, completed: false, isHome: true, level: 'HS' }
];

export const BASE_COLLEGE_SCHEDULE: ScheduleEvent[] = [
    { id: 'col_1', type: EventType.FOOTBALL_GAME, name: 'Labor Day Classic', opponent: 'State U', date: 1, reward: 1000, completed: false, isHome: true, level: 'COLLEGE' },
    { id: 'col_2', type: EventType.BATTLE, name: 'Battle of the Bands', opponent: 'Southern A&M', date: 4, reward: 2000, completed: false, level: 'COLLEGE' },
    { id: 'col_3', type: EventType.HOMECOMING, name: 'HOMECOMING', opponent: 'Tech State', date: 8, reward: 3000, completed: false, isHome: true, level: 'COLLEGE' },
    { id: 'col_4', type: EventType.CONCERT, name: 'Halftime Showcase', date: 12, reward: 1500, completed: false, level: 'COLLEGE' },
    { id: 'col_5', type: EventType.FOOTBALL_GAME, name: 'Bayou Classic', opponent: 'Grambling State', date: 14, reward: 2500, completed: false, isHome: false, level: 'COLLEGE' },
    { id: 'col_6', type: EventType.BATTLE, name: 'NATIONAL CHAMPIONSHIP', opponent: 'Grand Valley', date: 16, reward: 10000, completed: false, level: 'COLLEGE' },
    { id: 'col_7', type: EventType.BASKETBALL_GAME, name: 'Conference Tournament', opponent: 'State U', date: 18, reward: 1000, completed: false, isHome: true, level: 'COLLEGE' }
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
export const DEFAULT_MACE_DESIGN: MaceDesign = { id: 'dm_mace_default', headShape: 'GLOBE', headColor: '#ffffff', shaftColor: '#ef4444', cordPrimary: '#ffffff', cordSecondary: '#ef4444', ferruleColor: '#ffffff', finish: 'SHINY' };
export const DEFAULT_INSTRUMENT_DESIGNS = {
    brass: { id: 'def_brass', type: 'BRASS', primaryColor: '#fbbf24', secondaryColor: '#ffffff', finish: 'SHINY' } as InstrumentDesign,
    woodwind: { id: 'def_ww', type: 'WOODWIND', primaryColor: '#000000', secondaryColor: '#c0c0c0', finish: 'MATTE' } as InstrumentDesign,
    percussion: { id: 'def_perc', type: 'PERCUSSION', primaryColor: '#ffffff', secondaryColor: '#ef4444', detailColor: '#ffffff', finish: 'SHINY' } as InstrumentDesign,
    mace: DEFAULT_MACE_DESIGN
};

// Settings & Drill
export const INITIAL_SETTINGS: Settings = { masterVolume: 80, musicVolume: 60, sfxVolume: 100, graphicsQuality: 'HIGH', inputMode: 'PC', retroMode: true, keyBindings: { L0: 'd', L1: 'f', L2: 'j', L3: 'k' }, enableUniformCost: true, difficulty: 'NORMAL', partyMode: false };
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
    { id: 'a6', name: 'Million Dollar Band', description: 'Accumulate $5,000 in funds.', icon: '💰', unlocked: false },
    { id: 'a7', name: 'Look at the flick of the wrist', description: 'You dirty cheater! (Enabled Hacker Mode)', icon: '👾', unlocked: false },
    { id: 'a8', name: 'First Blood', description: 'Win your first game.', icon: '🥇', unlocked: false },
    { id: 'a9', name: 'Recruitment Drive', description: 'Hire 5 new members.', icon: '🎺', unlocked: false },
    { id: 'a10', name: 'Shopaholic', description: 'Buy your first item from the Booker Store.', icon: '🛍️', unlocked: false },
    { id: 'a11', name: 'Custom Tailor', description: 'Create a custom uniform.', icon: '🧵', unlocked: false },
    { id: 'a12', name: 'Drill Master', description: 'Create a custom drill with at least 3 frames.', icon: '📋', unlocked: false }
];

// Tracks
export const INITIAL_TRACKS: MusicTrack[] = [
    { id: 't_fight_1', title: 'Victory March', artist: 'Traditional', bpm: 120, isCustom: false, duration: '0:30', category: 'SHOW' },
    { id: 't_fight_2', title: 'Fight for Glory', artist: 'School Spirit', bpm: 128, isCustom: false, duration: '0:25', category: 'SHOW' },
    { id: 't_fight_song', title: 'School Fight Song', artist: 'School Spirit', bpm: 135, isCustom: false, duration: '0:45', category: 'SHOW' },
    { id: 't_hype_1', title: 'Neck (Tribute)', artist: 'The Band', bpm: 140, isCustom: false, duration: '0:40', category: 'HYPE' },
    { id: 't_hype_2', title: 'Swag Surf', artist: 'Stadium Crew', bpm: 70, isCustom: false, duration: '0:45', category: 'HYPE' },
    { id: 't_hype_3', title: 'Get Crunk', artist: 'Brass Section', bpm: 145, isCustom: false, duration: '0:30', category: 'HYPE' },
    { id: 't_hype_4', title: 'Sonic Boom', artist: 'Low Brass', bpm: 135, isCustom: false, duration: '0:35', category: 'HYPE' },
    { id: 't_cad_1', title: 'Spider Web', artist: 'Drumline', bpm: 110, isCustom: false, duration: '0:20', category: 'CADENCE' },
    { id: 't_cad_2', title: 'Jig 2', artist: 'Drumline', bpm: 120, isCustom: false, duration: '0:20', category: 'CADENCE' },
    { id: 't_cad_3', title: 'Buck Wild', artist: 'Drumline', bpm: 130, isCustom: false, duration: '0:15', category: 'CADENCE' },
    { id: 't_cad_series_1', title: 'Cadence Series: Section A', artist: 'Drumline', bpm: 115, isCustom: false, duration: '0:25', category: 'CADENCE' },
    { id: 't_cad_series_2', title: 'Cadence Series: Section B', artist: 'Drumline', bpm: 125, isCustom: false, duration: '0:25', category: 'CADENCE' },
    { id: 't_cad_series_3', title: 'Cadence Series: Section C', artist: 'Drumline', bpm: 135, isCustom: false, duration: '0:25', category: 'CADENCE' },
    { id: 't_cad_series_full', title: 'Series (Full)', artist: 'Drumline', bpm: 125, isCustom: false, duration: '1:15', category: 'CADENCE' },
    { id: 't_callout_full', title: 'Full Band Callout', artist: 'The Band', bpm: 120, isCustom: false, duration: '0:05', category: 'CALLOUT' },
    { id: 't_callout_brass', title: 'Brass Section Callout', artist: 'Brass', bpm: 120, isCustom: false, duration: '0:05', category: 'CALLOUT' },
    { id: 't_callout_drum', title: 'Drum Solo Callout', artist: 'Drumline', bpm: 120, isCustom: false, duration: '0:05', category: 'CALLOUT' },
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
    { id: 'item_bucket', name: 'Bucket Hat', category: 'CLOTHING', price: 80, description: 'Rehearsal essential.', icon: '🎩', clothingId: 'hat_bucket', clothingType: 'HAT' },
    { id: 'item_pride_shirt', name: 'School Pride Shirt', category: 'CLOTHING', price: 120, description: 'Show your school spirit.', icon: '👕', clothingId: 'top_pride_shirt', clothingType: 'TOP' },
    { id: 'item_pride_hat', name: 'School Pride Hat', category: 'CLOTHING', price: 60, description: 'Rep your letters.', icon: '🧢', clothingId: 'hat_pride', clothingType: 'HAT' },
    { id: 'item_pride_pants', name: 'School Pride Pants', category: 'CLOTHING', price: 100, description: 'Comfortable game day pants.', icon: '👖', clothingId: 'bottom_pride_pants', clothingType: 'BOTTOM' }
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

export const ASSISTANT_NAMES = [ "Mr. Hightower", "Ms. Vance", "Dr. K", "Coach T", "Prof. X", "Mrs. Robinson", "Mr. Clark", "Ms. Davis" ];

export const CLOTHING_OPTIONS = {
    TOPS: [ { id: 'top_basic_tee', name: 'Section Tee' }, { id: 'top_varsity', name: 'Alumni Varsity' }, { id: 'top_suit', name: 'Gameday Suit' }, { id: 'top_hbcu', name: 'Heritage Tunic' }, { id: 'top_windbreaker', name: 'Warmup Breaker' }, { id: 'top_polo', name: 'Director Polo' }, { id: 'top_vest', name: 'Utility Vest' }, { id: 'top_hoodie', name: 'Alumni Hoodie' }, { id: 'top_unitard', name: 'Unitard' }, { id: 'top_dress', name: 'Dress' }, { id: 'top_bodysuit', name: 'Body Suit' }, { id: 'top_bodysuit_no_sleeves', name: 'Body Suit (No Sleeves)' }, { id: 'top_tunic', name: 'Tunic' } ],
    BOTTOMS: [ { id: 'bot_jeans', name: 'Jeans' }, { id: 'bot_shorts', name: 'Shorts' }, { id: 'bot_slacks', name: 'Dress Slacks' }, { id: 'bot_skirt', name: 'Skirt' }, { id: 'bot_leggings', name: 'Leggings' }, { id: 'bot_leggings_transparent', name: 'Leggings (Transparent)' } ],
    HATS: [ { id: 'hat_cap', name: 'Cap' }, { id: 'hat_beanie', name: 'Beanie' }, { id: 'hat_shako', name: 'Shako' }, { id: 'hat_bucket', name: 'Bucket' }, { id: 'hat_stetson', name: 'Stetson' }, { id: 'hat_bearskin', name: 'Bearskin' }, { id: 'hat_tall_shako', name: 'Tall Shako' }, { id: 'hat_fedora', name: 'Fedora' }, { id: 'hat_trilby', name: 'Trilby' }, { id: 'hat_bowler', name: 'Bowler' } ]
};

export const OG_MEMBERS: BandMember[] = [ { id: 'og_dave', name: 'Drum Major Dave', instrument: InstrumentType.MACE, marchSkill: 99, playSkill: 99, showmanship: 100, salary: 1200, appearance: { skinColor: '#8d5524', hairColor: '#000000', hairStyle: 2, bodyType: 'average', accessoryId: 1, hairScale: 1, height: 1.05, hairTransform: {scaleX: 1, scaleY: 1, x:0, y:0}, hatTransform: {scaleX: 1, scaleY: 1, x:0, y:0}, accessoryTransform: {scaleX: 1, scaleY: 1, x:0, y:0} }, archetype: 'Prodigy', bio: 'The legendary leader.', isOG: true, status: 'P1', chemistry: 100 } ];

export const MOCK_RECRUITS: BandMember[] = [ { id: 'r1', name: 'Marcus Williams', instrument: InstrumentType.SNARE, marchSkill: 75, playSkill: 80, showmanship: 60, salary: 500, appearance: getRandomAppearance(), archetype: 'Grinder', bio: 'Former competitive sectional leader.', directorNote: "Very reliable.", chemistry: 75 } ];

export const MOCK_STAFF: StaffMember[] = [
    { id: 'staff-1', name: 'Sarah Jenkins', role: 'Assistant Director', salary: 2000, skill: 85 },
    { id: 'staff-2', name: 'Mike Ross', role: 'Equipment Manager', salary: 1000, skill: 70 },
    { id: 'staff-3', name: 'Emily Chen', role: 'Music Arranger', salary: 2500, skill: 90 },
    { id: 'staff-4', name: 'David Lee', role: 'Recruiter', salary: 1500, skill: 75 },
    { id: 'staff-5', name: 'Marcus Johnson', role: 'Percussion Instructor', salary: 1800, skill: 88 },
    { id: 'staff-6', name: 'Chloe Martinez', role: 'Guard Instructor', salary: 1800, skill: 85 },
    { id: 'staff-7', name: 'James Wilson', role: 'Visual Tech', salary: 1600, skill: 80 },
    { id: 'staff-8', name: 'Robert Taylor', role: 'Brass Caption Head', salary: 2200, skill: 89 }
];


export const generateBalancedRoster = (count: number): BandMember[] => {
    const roster: BandMember[] = [];
    const instruments = Object.values(InstrumentType).filter(i => i !== InstrumentType.MACE);
    for (let i = 0; i < count; i++) {
        const name = RECRUIT_NAMES[Math.floor(Math.random() * RECRUIT_NAMES.length)];
        const surname = RECRUIT_SURNAMES[Math.floor(Math.random() * RECRUIT_SURNAMES.length)];
        
        // Rarity Logic
        const rand = Math.random();
        let rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' = 'COMMON';
        let statBoost = 0;
        let salaryMult = 1;

        if (rand > 0.98) { rarity = 'LEGENDARY'; statBoost = 30; salaryMult = 3; }
        else if (rand > 0.90) { rarity = 'EPIC'; statBoost = 20; salaryMult = 2; }
        else if (rand > 0.70) { rarity = 'RARE'; statBoost = 10; salaryMult = 1.5; }

        roster.push({
            id: `m-${i}-${Date.now()}`,
            name: `${name} ${surname}`,
            instrument: instruments[i % instruments.length],
            marchSkill: Math.min(100, 40 + Math.floor(Math.random() * 50) + statBoost),
            playSkill: Math.min(100, 40 + Math.floor(Math.random() * 50) + statBoost),
            showmanship: Math.min(100, 30 + Math.floor(Math.random() * 60) + statBoost),
            salary: Math.floor((100 + Math.floor(Math.random() * 400)) * salaryMult),
            appearance: getRandomAppearance(),
            archetype: 'Grinder',
            bio: 'Ready to contribute.',
            directorNote: DIRECTOR_WARNINGS[Math.floor(Math.random() * DIRECTOR_WARNINGS.length)],
            chemistry: 50 + Math.floor(Math.random() * 50),
            rarity
        });
    }
    return roster;
};

export const LOGO_PRESETS = [ { name: 'Shield', grid: Array(100).fill('#3b82f6') }, { name: 'Star', grid: Array(100).fill('transparent').map((_,i) => [13,14,15,16,23,24,25,26,32,33,36,37,42,43,46,47,52,53,56,57,62,63,64,65,66,67,73,74,75,76].includes(i) ? '#fbbf24' : 'transparent') } ];
export const DEFAULT_UNIFORMS: Uniform[] = [{ id: 'u_default', name: 'Show Style Suite', jacketColor: '#ef4444', pantsColor: '#ffffff', hatColor: '#ef4444', plumeColor: '#ffffff', hatStyle: 'tall_shako', jacketStyle: 'hbcu_heritage', pantsStyle: 'bibbers', styleId: 0, hasSpats: true, hasGauntlets: true, shoulderCordColor: '#fbbf24', hasShoulderCords: true }];

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
export const DEFAULT_DM_UNIFORM: Uniform = { id: 'u_dm_default', name: 'Drum Major Uniform', jacketColor: '#ffffff', pantsColor: '#ffffff', hatColor: '#ffffff', plumeColor: '#fbbf24', hatStyle: 'tall_shako', jacketStyle: 'military', pantsStyle: 'bibbers', styleId: 0, isDrumMajor: true, capeStyle: 'long', hasGauntlets: true, hasSpats: true, hasShoulderCords: true, shoulderCordColor: '#fbbf24', hatVariant: 1, jacketVariant: 1 };
export const DEFAULT_MAJORETTE_UNIFORM: Uniform = { id: 'u_maj_default', name: 'Majorette Uniform', jacketColor: '#ef4444', pantsColor: '#ef4444', hatColor: '#ef4444', plumeColor: '#ffffff', hatStyle: 'none', jacketStyle: 'bodysuit', pantsStyle: 'leggings', styleId: 0, hasSpats: true };
export const DEFAULT_GUARD_UNIFORM: Uniform = { id: 'u_guard_default', name: 'Color Guard Uniform', jacketColor: '#ef4444', pantsColor: '#000000', hatColor: '#ef4444', plumeColor: '#ffffff', hatStyle: 'beret', jacketStyle: 'tunic', pantsStyle: 'leggings', styleId: 0 };
export const generateProceduralLogo = (primary: string, secondary: string, text: string = "AB"): string[] => {
    const grid = Array(100).fill('transparent');
    const chars = text.substring(0, 2).toUpperCase().split('');
    const totalWidth = chars.length * 3 + (chars.length - 1);
    let startX = Math.floor((10 - totalWidth) / 2);
    let startY = Math.floor((10 - 5) / 2);

    chars.forEach((char) => {
        const bitmap = TINY_FONT[char] || TINY_FONT[' '];
        for (let i = 0; i < 15; i++) {
            if (bitmap[i] === 1) {
                const col = i % 3;
                const row = Math.floor(i / 3);
                const targetX = startX + col;
                const targetY = startY + row;
                
                if (targetX >= 0 && targetX < 10 && targetY >= 0 && targetY < 10) {
                    grid[targetY * 10 + targetX] = primary;
                }
            }
        }
        startX += 4;
    });
    
    for (let i = 0; i < 100; i++) {
        if (grid[i] === 'transparent') {
            grid[i] = secondary;
        }
    }
    return grid;
};

export const SCHOOL_PRESETS = [ 
    { name: 'Southern A&M', mascot: 'Jaguars', primary: '#fbbf24', secondary: '#000000', band: 'The Human Jukebox', type: 'College' as const, logo: generateProceduralLogo('#fbbf24', '#000000', 'SU') }, 
    { name: 'Florida Tech', mascot: 'Rattlers', primary: '#f97316', secondary: '#22c55e', band: 'The Marching 100', type: 'College' as const, logo: generateProceduralLogo('#f97316', '#22c55e', 'FT') }, 
    { name: 'North Carolina State', mascot: 'Spartans', primary: '#22c55e', secondary: '#fbbf24', band: 'The Legion', type: 'College' as const, logo: generateProceduralLogo('#22c55e', '#fbbf24', 'NC') }, 
    { name: 'Prairie Valley', mascot: 'Panthers', primary: '#a855f7', secondary: '#fbbf24', band: 'The Storm', type: 'College' as const, logo: generateProceduralLogo('#a855f7', '#fbbf24', 'PV') }, 
    { name: 'Tennessee A&I', mascot: 'Tigers', primary: '#3b82f6', secondary: '#ffffff', band: 'Aristocrat of Bands', type: 'College' as const, logo: generateProceduralLogo('#3b82f6', '#ffffff', 'TN') } 
];
export const generateOpponentIdentity = (name: string): { identity: BandIdentity, uniform: Uniform } => { let hash = 0; for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash); const colorIndex1 = Math.abs(hash) % COLORS.length; const colorIndex2 = Math.abs(hash >> 3) % COLORS.length; const primary = COLORS[colorIndex1].hex; const secondary = COLORS[colorIndex2 === colorIndex1 ? (colorIndex1 + 1) % COLORS.length : colorIndex2].hex; const hatStyles = ['shako', 'stetson', 'beret', 'cap']; const hatStyle = hatStyles[Math.abs(hash) % hatStyles.length] as any; const mascot = MASCOTS[Math.abs(hash) % MASCOTS.length]; return { identity: { schoolName: name, schoolType: 'High School', mascot: mascot, primaryColor: primary, secondaryColor: secondary, useSchoolLogo: true, schoolLogo: Array(100).fill(null).map((_, i) => (i % 2 === 0 ? primary : secondary)) }, uniform: { id: `opp_${name}`, name: name, jacketColor: primary, pantsColor: Math.abs(hash) % 2 === 0 ? '#ffffff' : '#000000', hatColor: primary, plumeColor: secondary, accentColor: secondary, hatStyle: hatStyle, jacketStyle: 'classic', pantsStyle: 'regular', isDrumMajor: false } }; };
export const VIDEO_TITLES = [ "INSANE DRUMLINE BATTLE VS {rivalName}", "{bandName} FULL SHOW 2024 (HIGH CAM)", "TRUMPET SCREAMER COMPILATION", "Band Director Reacts to {bandName}", "Day in the Life: Marching Band", "Why {bandName} is UNDEFEATED" ];
export const CREDITS_DATA = [ { role: "Lead Developer", name: "You" }, { role: "Art Direction", name: "CSS & Tailwind" }, { role: "Music Engine", name: "Web Audio API" }, { role: "Special Thanks", name: "React Community" } ];
export const RIVAL_CHANTS = [ "HEY {bandName}! PACK IT UP!", "{mascot} AIN'T LOUD! WE LOUD!", "GET BACK ON THE BUS!", "WE READY! Y'ALL AIN'T READY!", "CAN'T HEAR YOU! TOO QUIET!", "WHO RUN THE YARD? WE RUN THE YARD!", "YOUR HORN LINE IS WEAK! PURE TRASH!", "DON'T START NOTHIN', WON'T BE NOTHIN'!", "WE THE REAL {mascot}! Y'ALL IMPOSTORS!" ];
export const PLAY_TYPES = ['RUN', 'PASS', 'KICK', 'PUNT', 'FG'];
export const PENALTIES = ['HOLDING', 'OFFSIDES', 'FALSE START', 'PASS INTERFERENCE'];
