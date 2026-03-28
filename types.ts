
// ... existing imports ...
export enum GamePhase {
  TITLE = 'TITLE',
  BOARD_MEETING = 'BOARD_MEETING',
  WALK_IN = 'WALK_IN',
  HOME = 'HOME',
  CAREER_HUB = 'CAREER_HUB',
  CAMPUS_MAP = 'CAMPUS_MAP',
  ADVISOR = 'ADVISOR',
  CAREER_SETUP = 'CAREER_SETUP',
  EDITOR = 'EDITOR',
  PERFORMANCE = 'PERFORMANCE',
  STAND_BATTLE = 'STAND_BATTLE',
  BAND_OFFICE = 'BAND_OFFICE', 
  MANAGEMENT = 'MANAGEMENT', 
  RECRUITMENT = 'RECRUITMENT', 
  AUDITION = 'AUDITION',
  ALUMNI_HUB = 'ALUMNI_HUB',
  TUTORIAL = 'TUTORIAL',
  CUSTOMIZATION = 'CUSTOMIZATION',
  UNIFORM_EDITOR = 'UNIFORM_EDITOR',
  AVATAR_EDITOR = 'AVATAR_EDITOR',
  LOGO_EDITOR = 'LOGO_EDITOR', 
  INSTRUMENT_DESIGNER = 'INSTRUMENT_DESIGNER', 
  STORE = 'STORE', 
  LOADING = 'LOADING',
  PEP_TALK = 'PEP_TALK',
  GAME_DAY = 'GAME_DAY',
  PRACTICE = 'PRACTICE',
  QUESTS = 'QUESTS',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  MUSIC_LIBRARY = 'MUSIC_LIBRARY',
  MEDIA = 'MEDIA', 
  VIDEO_APP = 'VIDEO_APP',
  MOMENTS = 'MOMENTS',
  CREDITS = 'CREDITS',
  BUS_RIDE = 'BUS_RIDE',
  COMMUNITY_HUB = 'COMMUNITY_HUB'
}

export type GameMode = 'DIRECTOR' | 'CAREER';

export enum BandStyle {
  SHOW = 'Show-Style',
  MILITARY = 'Traditional/Military'
}

export enum DirectorTrait {
  TACTICAL = 'Tactical',
  SHOWMAN = 'Showman',
  CREATIVE = 'Creative',
  DISCIPLINED = 'Disciplined'
}

export enum InstrumentType {
  PICCOLO = 'Piccolo',
  FLUTE = 'Flute',
  CLARINET = 'Clarinet',
  SAX = 'Saxophone',
  TRUMPET = 'Trumpet',
  MELLOPHONE = 'Mellophone',
  TROMBONE = 'Trombone',
  BARITONE = 'Baritone',
  TUBA = 'Tuba',
  SNARE = 'Snare',
  TENOR_QUADS = 'Quads/Quints', 
  TENOR_CHEST = 'Single Tenor (Chest)',
  TENOR_WAIST = 'Waist Tenor',
  BASS = 'Bass Drum',
  CYMBAL = 'Cymbals',
  GUARD = 'Color Guard',
  MAJORETTE = 'Majorette / Dance',
  MACE = 'Drum Major Mace' 
}

export interface TransformConfig {
    scaleX: number;
    scaleY: number;
    x: number;
    y: number;
    zIndex?: number;
}

export interface Appearance {
    skinColor: string;
    hairStyle: number | string;
    hairColor: string;
    bodyType: 'slim' | 'average' | 'heavy';
    accessoryId: number | string;
    // Facial Features
    eyeId?: number | string;
    eyeColor?: string;
    eyebrowId?: number | string;
    mouthId?: number | string;
    facialHairId?: number | string;
    glassesId?: number | string;
    
    hairScale?: number;
    height?: number; // 0.9 to 1.1 scale factor
    // Advanced Transforms
    hairTransform?: TransformConfig;
    hatTransform?: TransformConfig;
    accessoryTransform?: TransformConfig;
    
    // Detailed Facial Transforms
    eyesTransform?: TransformConfig;
    browsTransform?: TransformConfig;
    facialHairTransform?: TransformConfig;
    glassesTransform?: TransformConfig;
}

export interface DirectorOutfit {
    id: string;
    name: string;
    topColor: string;
    bottomColor: string;
    secondaryColor?: string; // New field
    style: 'suit' | 'tracksuit' | 'casual' | 'hbcu_heritage'; 
    topId?: string; 
    bottomId?: string;
    hatId?: string;
    accentColor?: string; 
    logoPlacement?: LogoPlacement;
}

export interface LogoPlacement {
    enabled: boolean;
    logoType?: 'SCHOOL' | 'BAND' | 'CUSTOM' | 'NONE';
    position: 'CHEST_LEFT' | 'CHEST_CENTER' | 'BACK' | 'HAT' | 'CAPE' | 'CHESTPLATE';
    size: 'SMALL' | 'MEDIUM' | 'LARGE';
    applyTo: 'UNIFORM' | 'CASUAL' | 'BOTH';
    customText?: string;
    textOrientation?: 'HORIZONTAL' | 'VERTICAL' | 'DIAGONAL';
    font?: string;
    fontColor?: string;
    xOffset?: number;
    yOffset?: number;
    logoXOffset?: number;
    logoYOffset?: number;
    logoXScale?: number;
    logoYScale?: number;
    textXOffset?: number;
    textYOffset?: number;
    textScale?: number;
}

export interface MaceDesign {
    id: string;
    headShape: 'GLOBE' | 'EAGLE' | 'SPEAR';
    headColor: string; 
    shaftColor: string; 
    cordPrimary: string;
    cordSecondary: string;
    ferruleColor: string; 
    finish: 'MATTE' | 'SHINY' | 'CHROME' | 'GOLD' | 'WORN';
}

export interface InstrumentDesign {
    id: string;
    type: 'BRASS' | 'WOODWIND' | 'PERCUSSION';
    primaryColor: string; 
    secondaryColor: string; 
    detailColor?: string; 
    finish: 'MATTE' | 'SHINY' | 'CHROME' | 'GOLD' | 'WORN';
    decalId?: string;
}

export interface Uniform {
    id: string;
    name: string;
    jacketColor: string;
    pantsColor: string;
    hatColor: string;
    plumeColor: string;
    accentColor?: string; 
    shoeColor?: string;
    gloveColor?: string;
    hatStyle: 'shako' | 'stetson' | 'beret' | 'cap' | 'none' | 'tall_shako' | 'bearskin' | 'bowler' | 'fedora' | 'trilby' | 'pride_hat'; 
    jacketStyle: 'classic' | 'sash' | 'vest' | 'military' | 'tracksuit' | 'tshirt' | 'suit' | 'polo' | 'hoodie' | 'varsity' | 'hbcu_heritage' | 'windbreaker' | 'bodysuit' | 'bodysuit_no_sleeves' | 'dress' | 'tunic' | 'unitard' | 'tuxedo' | 'blazer' | 'sweater' | 'tank_top' | 'crop_top' | 'pride_shirt';
    pantsStyle: 'regular' | 'shorts' | 'slacks' | 'bibbers' | 'leggings' | 'leggings_transparent' | 'sweatpants' | 'jeans' | 'skirt' | 'kilt' | 'pride_pants';
    styleId?: number; 
    logoPlacement?: LogoPlacement; 
    isDrumMajor?: boolean;
    topId?: string;
    bottomId?: string;
    hatId?: string;
    // Updated Cape Logic
    capeStyle?: 'none' | 'short' | 'long' | 'side'; 
    hasCape?: boolean; // Deprecated, kept for backward compatibility load
    hasGauntlets?: boolean;
    hasSpats?: boolean;
    hasShoulderCords?: boolean;
    shoulderCordColor?: string;
    capeColor?: string;
    chestPlate?: boolean;
    chestPlateColor?: string;
    tieColor?: string; // New slot for tie color
    backDesign?: string; // New slot for back design
    // Advanced Transforms
    hatVariant?: number; // 0 = OG, 1 = Variant B, 2 = Variant C
    jacketVariant?: number;
    pantsVariant?: number;
    hatTransform?: TransformConfig;
    jacketTransform?: TransformConfig;
    pantsTransform?: TransformConfig;
    chestPlateTransform?: TransformConfig;
}

export interface Director {
  name: string;
  gender: 'MALE' | 'FEMALE';
  trait: DirectorTrait;
  appearance: Appearance;
  currentOutfitId: string;
  outfits: DirectorOutfit[];
}

export interface BandIdentity {
  schoolName: string;
  schoolType: 'High School' | 'College'; 
  location?: string;
  foundingYear?: number;
  mascot: string;
  primaryColor: string;
  secondaryColor: string;
  schoolLogo?: string[];
  bandLogo?: string[];
  schoolLogoText?: string;
  bandLogoText?: string;
  useSchoolLogo: boolean;
}

export interface BandMember {
  id: string;
  name: string;
  instrument: InstrumentType;
  marchSkill: number; 
  playSkill: number; 
  showmanship: number; 
  salary: number;
  appearance: Appearance;
  archetype?: 'Prodigy' | 'Grinder' | 'Showoff' | 'Stoic';
  bio?: string;
  isOG?: boolean;
  status?: 'P1' | 'P2' | 'P3' | 'P4' | 'P5'; 
  directorNote?: string;
  chemistry?: number; // 0-100 Relationship with section
  rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

export interface FormationPoint {
  id: string;
  x: number; 
  y: number; 
  memberId?: string;
}

export interface DrillFrame {
    id: string;
    order: number;
    points: FormationPoint[];
    name?: string;
    stepWarnings?: string[]; // Physics analysis
}

export interface Drill {
    id: string;
    name: string;
    frames: DrillFrame[];
    songs?: string[]; // IDs of songs
}

export interface Settings {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    graphicsQuality: 'LOW' | 'MEDIUM' | 'HIGH';
    inputMode: 'PC' | 'MOBILE';
    retroMode: boolean;
    keyBindings?: { [key: string]: string };
    enableUniformCost?: boolean;
    difficulty?: 'NORMAL' | 'HARD' | 'HACKER';
    partyMode?: boolean;
}

export enum EventType {
    FOOTBALL_GAME = 'Football Game',
    BASKETBALL_GAME = 'Basketball Game',
    PARADE = 'Parade',
    CONCERT = 'Concert',
    BATTLE = 'Battle of Bands',
    HOMECOMING = 'Homecoming',
    FUNDRAISER = 'Fundraiser',
    COMMUNITY = 'Community Event'
}

export interface ScheduleEvent {
    id: string;
    type: EventType;
    name: string;
    opponent?: string;
    isHome?: boolean; 
    isRivalry?: boolean;
    date: number; 
    reward: number;
    completed: boolean;
    level: 'HS' | 'COLLEGE';
    result?: { us: number, them: number, win: boolean }; 
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    current: number;
    target: number;
    reward: string;
    completed: boolean;
    type: 'DAILY' | 'SEASON' | 'CAREER';
    mode?: GameMode | 'BOTH'; 
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    dateUnlocked?: string;
    mode?: GameMode | 'BOTH'; 
    rewardItem?: string;
}

export interface SequencerTrack {
    notes: number[]; 
    instrument: 'kick' | 'snare' | 'hat' | 'melody' | 'bass';
}

export type SongCategory = 'HYPE' | 'CADENCE' | 'CALLOUT' | 'CHANT' | 'SHOW';

export interface MusicTrack {
    id: string;
    title: string;
    artist: string;
    bpm: number;
    isCustom: boolean;
    duration: string;
    sequence?: SequencerTrack[];
    audioUrl?: string; 
    category: SongCategory;
    lyrics?: string; // New field for Chants
}

export interface MediaPost {
    id: string;
    author: string;
    handle: string;
    content: string;
    likes: number;
    shares?: number;
    timestamp: string;
    type: 'NEWS' | 'SOCIAL' | 'RIVAL' | 'FAN_REACTION';
    mediaType?: 'TEXT' | 'PHOTO' | 'VIDEO'; 
    visualStyle?: string; 
    sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    avatarColor?: string;
    image?: string; 
}

export interface Moment {
    id: string;
    title: string;
    date: string;
    description: string;
    thumbnailColor: string; 
    screenshot?: string; 
}

export interface School {
    id: string;
    name: string;
    type: 'High School' | 'College';
    prestige: number; 
    style: BandStyle;
    colors: [string, string];
    description: string;
}

export type PlayerRank = 'ROOKIE' | 'CORE_MEMBER' | 'SECTION_LEADER' | 'DRUM_MAJOR';

export interface Job {
    id: string;
    title: string;
    wage: number; 
    energyCost: number;
    description: string;
    requirements?: string;
    sceneType: 'WORK_BURGER' | 'WORK_BARISTA' | 'WORK_TUTOR';
}

export interface Advisor {
    name: string;
    gender: 'Male' | 'Female';
    dialogue: string[];
}

export type CampusLocationId = 'DORM' | 'BAND_HALL' | 'FIELD' | 'ADVISOR' | 'WORK' | 'STADIUM' | 'CLUB' | 'SCHOOL' | 'DINING' | 'SCOUTING';

export interface CampusLocation {
    id: CampusLocationId;
    name: string;
    x: number; 
    y: number; 
    icon: string;
    isOpen: boolean;
    color: string;
}

export interface Perk {
    id: string;
    name: string;
    description: string;
    cost: number;
    icon: string;
    unlocked: boolean;
    effect: 'ENERGY' | 'SKILL' | 'ACADEMIC' | 'SOCIAL';
    value: number;
}

export interface CareerState {
    playerName: string;
    gender: 'Male' | 'Female' | 'Non-Binary';
    socialGroup?: string; 
    playerAppearance: Appearance;
    instrument: InstrumentType;
    level: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
    schoolId: string;
    
    energy: number; 
    academics: number; 
    skill: number; 
    directorTrust: number; 
    sectionHype: number; 
    
    xp: number;
    rank: PlayerRank;
    rankIndex: number; // 0 = P4, 1 = P3, 2 = P2, 3 = P1, 4 = Section Leader
    
    week: number;
    timeSlots: number; 

    seenTutorial: boolean;
    
    casualOutfit: DirectorOutfit;
    
    currentJob?: Job;
    currentLocation: CampusLocationId;
    wallet: number; 
    
    perks: Perk[];
    skillPoints: number;
    history: string[]; // Log of major career events
}

export interface GameBuff {
    type: 'PRECISION' | 'HYPE' | 'FOCUS' | 'NONE';
    value: number; 
    description: string;
}

export interface Transaction {
    id: string;
    date: string;
    type: 'INCOME' | 'EXPENSE';
    category: 'PERFORMANCE' | 'RECRUITMENT' | 'UNIFORMS' | 'TRAVEL' | 'SPONSORSHIP' | 'UPGRADE' | 'SHOP' | 'DONATION';
    amount: number;
    description: string;
}

export interface InboxMessage {
    id: string;
    sender: string;
    subject: string;
    body: string;
    timestamp: number;
    read: boolean;
    gift?: {
        type: 'FUNDS' | 'REPUTATION' | 'FANS';
        amount: number;
    };
    claimed?: boolean;
}

export interface Message {
    id: string;
    contactId: string;
    sender: string;
    text: string;
    timestamp: string;
    read: boolean;
    isReply?: boolean; 
    type: 'TEXT' | 'INVITE' | 'DECISION' | 'EMAIL';
    subject?: string; // For emails
    data?: any; 
    replies?: { label: string, action: string }[];
}

export interface PhoneSettings {
    wallpaper: string;
    theme: 'dark' | 'light' | 'retro';
}

export interface ShopItem {
    id: string;
    name: string;
    category: 'CLOTHING' | 'ACCESSORY' | 'DECOR' | 'GEAR';
    price: number;
    description: string;
    icon: string;
    clothingId?: string; 
    clothingType?: 'TOP' | 'BOTTOM' | 'HAT';
    reqReputation?: number; 
}

export interface VideoContent {
    id: string;
    title: string;
    views: number;
    comments: number;
    likes: number;
    duration: string; // e.g. "4:20"
    thumbnailId: number;
    uploadedAt: number; // Timestamp
    uniform?: Uniform;
}

export type BattleMoveType = 'TECHNICAL' | 'LOUD' | 'HYPE' | 'DANCE';

export interface BattleMove {
    id: string;
    name: string;
    type: BattleMoveType;
    power: number; // Base score multiplier
    risk: number; // Chance to fail/miss
    description: string;
    icon: string;
    beats: BattleMoveType; // Rock paper scissors logic
    losesTo: BattleMoveType;
}

export interface Notification {
    id: string;
    title: string;
    icon: string;
    color: string;
}

export interface CustomAsset {
    id: string;
    type: 'HAIR' | 'HAT' | 'JACKET' | 'PANTS' | 'ACCESSORY';
    name: string;
    svgContent: string;
}

export interface Skin {
    id: string;
    name: string;
    description: string;
    type: 'TEXTURE' | 'COLOR_PALETTE';
    assetUrl: string;
}

export interface StaffMember {
    id: string;
    name: string;
    role: 'Assistant Director' | 'Equipment Manager' | 'Music Arranger' | 'Recruiter' | 'Percussion Instructor' | 'Guard Instructor' | 'Visual Tech' | 'Brass Caption Head';
    salary: number;
    skill: number;
}

export interface GameState {
  mode: GameMode; 
  funds: number;
  transactions: Transaction[]; 
  fans: number;
  reputation: number;
  bandName: string;
  style: BandStyle;
  members: BandMember[];
  staff: StaffMember[];
  recruitPool: BandMember[]; 
  career?: CareerState;

  drills: Drill[];
  activeDrillId: string;
  schedule: ScheduleEvent[];
  activeEventId: string | null;
  activeBuff: GameBuff; 
  quests: Quest[];
  achievements: Achievement[];
  musicLibrary: MusicTrack[];
  mediaFeed: MediaPost[];
  moments: Moment[];
  officeLayout?: number;
  messages: Message[]; 
  inbox: InboxMessage[];
  lastDailyReward?: number;
  tutorialStep: number;
  director: Director;
  identity: BandIdentity;
  rivalIdentity?: BandIdentity; // NEW: Specific Rival
  rivalDirector?: string; // NEW: Name of rival director
  rivalMembers?: BandMember[]; // NEW: Specific Rival Members
  uniforms: Uniform[];
  currentUniformId: string;
  dmUniformId?: string; 
  majoretteUniformId?: string;
  guardUniformId?: string; 
  instrumentDesigns: {
      brass: InstrumentDesign;
      woodwind: InstrumentDesign;
      percussion: InstrumentDesign;
      mace: MaceDesign;
  };
  settings: Settings;
  phoneSettings: PhoneSettings; 
  unlockedItems: string[];
  placedDecorations: string[]; 
  phoneGameHighScores: { career: number; director: number }; 
  lastSaveDate?: string;
  alumniDonations?: number;
  uploadedVideos: VideoContent[];
  clips: number; // NEW: Clips for video posting
  shownNotifications: string[]; // Track triggered popups
  activeBet?: { amount: number; type: 'FUNDS' | 'FANS'; eventId: string };
  trophies: string[]; // IDs of unlocked trophies
  assistant?: Assistant;
  isCreatorMode?: boolean;
  customShopItems?: ShopItem[];
  customAssets?: CustomAsset[];
  bandRoom?: BandRoomState;
  activeSkinId?: string;
  skins: Skin[];
  activeCrazyFeature?: 'BIG_HEAD' | 'DISCO' | 'SLOW_MO' | 'GRAVITY_SHIFT';
}



export interface Assistant {
    name: string;
    hiredDate: number;
    lastRecruitDate: number;
}

export interface RhythmNote {
  id: string;
  lane: number; 
  timestamp: number; 
  hit: boolean;
  type: 'TAP' | 'HOLD' | 'SWIPE';
  duration?: number; // For HOLD notes
  swipeDirection?: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'; // For SWIPE notes
}

export enum NoteResult {
  PERFECT = 'PERFECT',
  GOOD = 'GOOD',
  MISS = 'MISS',
  NONE = 'NONE'
}

export type WeatherCondition = 'CLEAR' | 'RAIN' | 'SNOW' | 'NIGHT';

export type CameraView = 'WIDE' | 'BAND' | 'FIELD' | 'DIRECTOR';

export interface CutsceneData {
    id: string;
    text: string;
    type: 'CLASS' | 'PRACTICE' | 'DINNER' | 'NAP' | 'START_HS' | 'START_COL' | 'HANGOUT' | 'PARTY' | 'WORK_BURGER' | 'WORK_BARISTA' | 'WORK_TUTOR' | 'CLUB' | 'STAFF_MEETING' | 'PAPERWORK' | 'RECORD_CLIP';
    duration: number;
    locationName?: string;
}

export interface BandRoomState {
    wallColor: string;
    floorColor: string;
    decorations: RoomDecoration[];
}

export interface RoomDecoration {
    id: string;
    type: 'POSTER' | 'TROPHY' | 'FURNITURE' | 'INSTRUMENT_RACK' | 'PLANT' | 'CHAIRS' | 'PODIUM' | 'SHELVES' | 'FRAT_LETTERS' | 'OLD_PICTURES' | 'BANNER';
    x: number;
    y: number;
    scale: number;
    rotation: number;
}