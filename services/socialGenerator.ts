
import { MediaPost, EventType } from '../types';

const FAN_HANDLES = ['@band_geek99', '@marching_life', '@drumline_king', '@brass_fanatic', '@halftime_hero', '@stadium_eats'];
const RIVAL_HANDLES = ['@rival_tracker', '@band_destroyer', '@real_music_only', '@hater_central'];
const NEWS_HANDLES = ['@BandInsider', '@MarchingDaily', '@LocalSports', '@TheScoreboard'];

const POSITIVE_TEMPLATES = [
    "Okay, that halftime show just CHANGED MY LIFE. 🔥 #marchingfrenzy",
    "Did y'all see that formation?! Cleanest lines I've seen all season.",
    "The drumline is absolutely eating today. NO CRUMBS. 🥁",
    "Respect to {bandName}, they really brought the energy tonight.",
    "My ears are ringing but my soul is happy. What a sound!",
    "That trumpet solo... I have chills. Literal chills.",
    "UNDEFEATED aura coming from the band section right now.",
    "{bandName} > everyone else. Don't @ me."
];

const NEGATIVE_TEMPLATES = [
    "Someone tell {bandName} to practice more... that was rough. 😬",
    "Lines looking like spaghetti out there. Fix the spacing!",
    "Imagine paying for a ticket to see THAT performance. Yikes.",
    "The trumpet section is fighting for their lives right now.",
    "Low energy. Boring visuals. We deserve better.",
    "Did they even rehearse? #messy",
    "{bandName} falling off? Hate to see it.",
    "Rival band definitely cleared them today. Not even close."
];

const GAME_REACTION_WIN = [
    "Good job {bandName}! Helped us secure the W!",
    "The energy from the band definitely pushed the team to win.",
    "Man, if the band didn't play that defense chant, we might have lost!",
    "Great game, great music. Perfect night."
];

const GAME_REACTION_LOSS = [
    "Man we woulda won if the {mascot} hadn't fumbled that play...",
    "At least the band sounded good, even if the team lost.",
    "Tough loss today. Band tried to hype them up but no luck.",
    "Team played like trash. Band was okay I guess."
];

const RIVAL_TRASH_TALK = [
    "See you on the field, {bandName}. Try to keep up.",
    "Hearing a lot of hype about {bandName}. Can't wait to silence it.",
    "Cute uniforms, {bandName}. Shame about the playing though.",
    "We run this state. {bandName} is just visiting.",
    "Prepare to get blown off the field. 🎺💨"
];

const RIVAL_RESPECT = [
    "Okay, I'll admit it... {bandName} actually cooked today.",
    "Gotta respect the grind. Good battle, {bandName}.",
    "We'll get you next time. Nice show."
];

const NEWS_TEMPLATES_WIN = [
    "BREAKING: {bandName} stuns the crowd with an electric performance!",
    "Crowd meter hits 100% as {bandName} dominates halftime.",
    "Is this the best band in the conference? {bandName} makes a strong case.",
    "Local Legends: {bandName} secures another massive victory."
];

const NEWS_TEMPLATES_LOSS = [
    "Disappointing showing from {bandName} today amidst high expectations.",
    "Crowd left silent after lackluster performance by {bandName}.",
    "Technical difficulties? {bandName} struggles to find their rhythm.",
    "An off day for the usually consistent {bandName}."
];

export const generatePost = (
    bandName: string,
    rivalName: string | undefined,
    type: 'WIN' | 'LOSS' | 'HYPE' | 'TRASH',
    score?: number,
    mascot: string = "Team"
): MediaPost => {
    let content = "";
    let author = "";
    let handle = "";
    let postType: MediaPost['type'] = 'SOCIAL';
    let sentiment: MediaPost['sentiment'] = 'NEUTRAL';
    let likes = 0;
    let shares = 0;
    let avatarColor = '#cccccc';

    const timestamp = "Just now";

    switch (type) {
        case 'WIN':
            if (Math.random() > 0.5) {
                // Game Reaction (Win)
                content = GAME_REACTION_WIN[Math.floor(Math.random() * GAME_REACTION_WIN.length)]
                    .replace("{bandName}", bandName)
                    .replace("{mascot}", mascot);
                author = "SuperFan " + Math.floor(Math.random() * 100);
                handle = FAN_HANDLES[Math.floor(Math.random() * FAN_HANDLES.length)];
                postType = 'FAN_REACTION';
                sentiment = 'POSITIVE';
                likes = Math.floor(Math.random() * 500) + 100;
                avatarColor = '#22c55e';
            } else if (Math.random() > 0.3) {
                // News Coverage
                content = NEWS_TEMPLATES_WIN[Math.floor(Math.random() * NEWS_TEMPLATES_WIN.length)].replace("{bandName}", bandName);
                author = "Band News Network";
                handle = NEWS_HANDLES[Math.floor(Math.random() * NEWS_HANDLES.length)];
                postType = 'NEWS';
                sentiment = 'POSITIVE';
                likes = Math.floor(Math.random() * 2000) + 500;
                shares = Math.floor(Math.random() * 500);
                avatarColor = '#3b82f6';
            } else {
                content = POSITIVE_TEMPLATES[Math.floor(Math.random() * POSITIVE_TEMPLATES.length)].replace("{bandName}", bandName);
                author = "Band Geek";
                handle = FAN_HANDLES[0];
                likes = 150;
            }
            break;

        case 'LOSS':
            if (Math.random() > 0.5) {
                // Game Reaction (Loss)
                content = GAME_REACTION_LOSS[Math.floor(Math.random() * GAME_REACTION_LOSS.length)]
                    .replace("{bandName}", bandName)
                    .replace("{mascot}", mascot);
                author = "Disappointed Fan";
                handle = FAN_HANDLES[Math.floor(Math.random() * FAN_HANDLES.length)];
                postType = 'FAN_REACTION';
                sentiment = 'NEGATIVE';
                likes = Math.floor(Math.random() * 100) + 10;
                avatarColor = '#f97316';
            } else {
                // Negative Perf Review
                content = NEGATIVE_TEMPLATES[Math.floor(Math.random() * NEGATIVE_TEMPLATES.length)].replace("{bandName}", bandName);
                author = "Critic";
                handle = RIVAL_HANDLES[0];
                sentiment = 'NEGATIVE';
                likes = 40;
            }
            break;

        case 'TRASH':
            content = RIVAL_TRASH_TALK[Math.floor(Math.random() * RIVAL_TRASH_TALK.length)].replace("{bandName}", bandName);
            author = (rivalName || "Rival") + " Official";
            handle = RIVAL_HANDLES[Math.floor(Math.random() * RIVAL_HANDLES.length)];
            postType = 'RIVAL';
            sentiment = 'NEGATIVE';
            likes = Math.floor(Math.random() * 300);
            avatarColor = '#ef4444';
            break;
            
        case 'HYPE':
            content = `Can't wait to see ${bandName} take the field! #gameday`;
            author = "Band Mom";
            handle = "@proud_mom_42";
            postType = 'SOCIAL';
            sentiment = 'POSITIVE';
            likes = 50;
            avatarColor = '#eab308';
            break;
    }

    return {
        id: `post-${Date.now()}-${Math.random()}`,
        author,
        handle,
        content,
        likes,
        shares,
        timestamp,
        type: postType,
        sentiment,
        avatarColor
    };
};

export const generateBatchPosts = (
    count: number,
    bandName: string,
    rivalName: string | undefined,
    result: 'WIN' | 'LOSS' | 'HYPE',
    mascot?: string
): MediaPost[] => {
    const posts: MediaPost[] = [];
    for (let i = 0; i < count; i++) {
        const type = result === 'HYPE' 
            ? (Math.random() > 0.5 ? 'HYPE' : 'TRASH') 
            : result;
        posts.push(generatePost(bandName, rivalName, type as any, undefined, mascot));
    }
    return posts;
};
