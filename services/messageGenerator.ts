
import { Message, GameMode, GameState } from '../types';

export const INITIAL_DIRECTOR_MESSAGES: Message[] = [
    {
        id: 'msg-init-1',
        contactId: 'principal',
        sender: 'Principal Skinner',
        text: 'Welcome to the program. The board expects results this year. Do not disappoint us.',
        timestamp: '9:00 AM',
        read: false,
        type: 'TEXT',
        replies: [
            { label: 'We will succeed.', action: 'REPLY_POSITIVE' },
            { label: 'Understood.', action: 'REPLY_NEUTRAL' }
        ]
    },
    {
        id: 'msg-init-2',
        contactId: 'staff',
        sender: 'Assistant Coach',
        text: 'The equipment truck has a flat tire. Might be late for the opener.',
        timestamp: '9:15 AM',
        read: false,
        type: 'DECISION',
        replies: [
            { label: 'Fix it now ($100)', action: 'FIX_TIRE' },
            { label: 'We march anyway', action: 'IGNORE_TIRE' }
        ]
    }
];

export const INITIAL_CAREER_MESSAGES: Message[] = [
    {
        id: 'msg-init-c1',
        contactId: 'mom',
        sender: 'Mom ❤️',
        text: 'So proud of you starting band! Don\'t forget to eat your vegetables at camp.',
        timestamp: '8:30 AM',
        read: false,
        type: 'TEXT',
        replies: [
            { label: 'Thanks Mom!', action: 'REPLY_POSITIVE' },
            { label: 'Ugh, Mom...', action: 'REPLY_NEGATIVE' }
        ]
    },
    {
        id: 'msg-init-c2',
        contactId: 'section_lead',
        sender: 'Section Leader Mike',
        text: 'Yo rookie, welcome to the line. Don\'t mess up the cadence.',
        timestamp: '10:00 AM',
        read: false,
        type: 'TEXT',
        replies: [
            { label: 'I got this.', action: 'REPLY_CONFIDENT' },
            { label: 'I\'ll do my best.', action: 'REPLY_NEUTRAL' }
        ]
    }
];

export const generateRandomMessage = (state: GameState): Message | null => {
    // Increased probability to 20%
    if (Math.random() > 0.2) return null;

    const id = `msg-${Date.now()}`;
    const timestamp = 'Now';
    
    if (state.mode === 'CAREER') {
        const types = ['FRIEND', 'ROMANCE', 'DIRECTOR', 'SECTION', 'DRAMA', 'FAMILY'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'FRIEND') {
            return {
                id,
                contactId: 'friend_jay',
                sender: 'Jay (Bass)',
                text: 'We are grabbing pizza at the student center. You down?',
                timestamp,
                read: false,
                type: 'INVITE',
                data: { location: 'Student Center', duration: 3000 },
                replies: [
                    { label: 'I\'m there! (Hangout)', action: 'ACCEPT_HANGOUT' },
                    { label: 'Can\'t, studying.', action: 'DECLINE_HANGOUT' }
                ]
            };
        }
        
        if (type === 'ROMANCE') {
             return {
                id,
                contactId: 'crush_sam',
                sender: 'Sam (Clarinet)',
                text: Math.random() > 0.5 ? 'You looked really cool during the drill today. 👀' : 'Are you going to the after party?',
                timestamp,
                read: false,
                type: 'TEXT',
                replies: [
                    { label: 'Thanks! You too.', action: 'REPLY_FLIRT' },
                    { label: 'Just doing my job.', action: 'REPLY_NEUTRAL' }
                ]
            };
        }

        if (type === 'SECTION') {
             return {
                id,
                contactId: 'section_lead',
                sender: 'Section Leader Mike',
                text: 'Sectionals tonight at 6. Be there early.',
                timestamp,
                read: false,
                type: 'TEXT',
                replies: [
                    { label: 'On my way!', action: 'REPLY_POSITIVE' },
                    { label: 'Might be late.', action: 'REPLY_NEGATIVE' }
                ]
            };
        }

        if (type === 'DRAMA') {
            return {
                id,
                contactId: 'gossip_tina',
                sender: 'Tina (Flute)',
                text: 'Did you hear what the trumpets did? The Director is furious.',
                timestamp,
                read: false,
                type: 'TEXT',
                replies: [
                    { label: 'Spill the tea.', action: 'REPLY_GOSSIP' },
                    { label: 'I stay out of it.', action: 'REPLY_NEUTRAL' }
                ]
            };
        }

        if (type === 'FAMILY') {
            return {
                id,
                contactId: 'dad',
                sender: 'Dad',
                text: 'How are classes going? Are you keeping your grades up?',
                timestamp,
                read: false,
                type: 'TEXT',
                replies: [
                    { label: 'Yes, doing great.', action: 'REPLY_POSITIVE' },
                    { label: 'It is hard.', action: 'REPLY_NEGATIVE' }
                ]
            };
        }

    } else {
         // Director Mode Randoms
         const roll = Math.random();
         if (roll > 0.7) {
             return {
                id,
                contactId: 'booster',
                sender: 'Booster Club Prez',
                text: 'We raised some extra money selling popcorn! Adding to funds.',
                timestamp,
                read: false,
                type: 'TEXT',
                replies: [
                    { label: 'Great work!', action: 'REPLY_POSITIVE' }
                ]
            };
         } else if (roll > 0.4) {
             return {
                id,
                contactId: 'parent_karen',
                sender: 'Mrs. Johnson',
                text: 'Why isn\'t my son playing the solo? He is clearly the best.',
                timestamp,
                read: false,
                type: 'TEXT',
                replies: [
                    { label: 'He needs to practice more.', action: 'REPLY_NEGATIVE' },
                    { label: 'I make the decisions.', action: 'REPLY_NEUTRAL' }
                ]
            };
         } else {
             return {
                 id,
                 contactId: 'admin_dean',
                 sender: 'Dean of Students',
                 text: 'Noise complaints from the library about your drumline practice. Keep it down.',
                 timestamp,
                 read: false,
                 type: 'TEXT',
                 replies: [
                     { label: 'We will move further away.', action: 'REPLY_APOLOGETIC' },
                     { label: 'This is art!', action: 'REPLY_DEFENSIVE' }
                 ]
             };
         }
    }

    return null;
};
