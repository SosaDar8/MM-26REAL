
import React, { useState } from 'react';
import { GameState, Message } from '../types';
import { Button } from './Button';

interface MessageAppProps {
    gameState: GameState;
    onSendMessage: (text: string, contactId: string) => void;
    onAction: (action: string, message: Message) => void;
    onBack: () => void;
}

export const MessageApp: React.FC<MessageAppProps> = ({ gameState, onSendMessage, onAction, onBack }) => {
    const [view, setView] = useState<'MESSAGES' | 'EMAIL'>('MESSAGES');
    const [activeContactId, setActiveContactId] = useState<string | null>(null);

    // Group messages by contact
    const threads: { [key: string]: Message[] } = {};
    const emails: Message[] = [];

    gameState.messages.forEach(m => {
        if (m.type === 'EMAIL') {
            emails.push(m);
        } else {
            if (!threads[m.contactId]) threads[m.contactId] = [];
            threads[m.contactId].push(m);
        }
    });

    // Sort threads by latest message
    const sortedContactIds = Object.keys(threads).sort((a, b) => {
        const lastA = threads[a][threads[a].length - 1];
        const lastB = threads[b][threads[b].length - 1];
        return parseInt(lastB.id.split('-')[1] || '0') - parseInt(lastA.id.split('-')[1] || '0');
    });

    const renderEmailList = () => (
        <div className="h-full flex flex-col bg-white">
            <div className="bg-gray-100 p-2 border-b border-gray-300 font-bold text-gray-700 text-sm">INBOX ({emails.filter(e => !e.read).length})</div>
            <div className="flex-grow overflow-y-auto">
                {emails.map(email => (
                    <div key={email.id} className="p-3 border-b border-gray-200 hover:bg-blue-50 cursor-pointer">
                        <div className="font-bold text-sm text-black">{email.sender}</div>
                        <div className="text-xs font-bold text-blue-800">{email.subject || 'No Subject'}</div>
                        <div className="text-xs text-gray-500 line-clamp-2">{email.text}</div>
                    </div>
                ))}
                {emails.length === 0 && <div className="p-4 text-center text-gray-400 text-xs">No emails.</div>}
            </div>
        </div>
    );

    const renderThreadList = () => (
        <div className="h-full flex flex-col bg-slate-100">
             <div className="flex-grow overflow-y-auto">
                 {sortedContactIds.length === 0 && (
                     <div className="p-8 text-center text-gray-400">No messages yet.</div>
                 )}
                 {sortedContactIds.map(contactId => {
                     const msgs = threads[contactId];
                     const lastMsg = msgs[msgs.length - 1];
                     const unread = msgs.some(m => !m.read && !m.isReply);
                     
                     return (
                         <div 
                            key={contactId}
                            onClick={() => setActiveContactId(contactId)}
                            className={`p-4 border-b border-gray-200 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${unread ? 'bg-blue-50' : ''}`}
                         >
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getContactColor(contactId)}`}>
                                 {lastMsg.sender[0]}
                             </div>
                             <div className="flex-grow min-w-0">
                                 <div className="flex justify-between items-baseline">
                                     <span className={`font-bold text-sm truncate ${unread ? 'text-black' : 'text-gray-700'}`}>{lastMsg.sender}</span>
                                     <span className="text-xs text-gray-400">{lastMsg.timestamp}</span>
                                 </div>
                                 <div className={`text-xs truncate ${unread ? 'font-bold text-black' : 'text-gray-500'}`}>
                                     {lastMsg.isReply ? `You: ${lastMsg.text}` : lastMsg.text}
                                 </div>
                             </div>
                             {unread && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                         </div>
                     );
                 })}
             </div>
        </div>
    );

    const renderChat = () => {
        if (!activeContactId) return null;
        const messages = threads[activeContactId];
        const contactName = messages[0].sender;

        // Check if last message needs reply
        const lastMsg = messages[messages.length - 1];
        const needsReply = !lastMsg.isReply && lastMsg.replies && lastMsg.replies.length > 0 && !messages.some(m => m.isReply && m.id > lastMsg.id); // Simple check

        return (
            <div className="h-full flex flex-col bg-slate-200">
                {/* Header */}
                <div className="bg-white/90 backdrop-blur-sm border-b border-gray-300 p-3 flex items-center gap-2 shadow-sm z-10">
                    <button onClick={() => setActiveContactId(null)} className="text-blue-500 text-2xl pr-2">‹</button>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getContactColor(activeContactId)}`}>
                         {contactName[0]}
                    </div>
                    <div className="font-bold text-black text-sm">{contactName}</div>
                </div>

                {/* Chat Area */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex flex-col ${m.isReply ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                                m.isReply 
                                ? 'bg-blue-500 text-white rounded-br-none' 
                                : 'bg-white text-black rounded-bl-none border border-gray-200'
                            }`}>
                                {m.text}
                            </div>
                            
                            {/* Actions / Replies - Only show if it's the latest message AND hasn't been replied to */}
                            {!m.isReply && m.replies && i === messages.length - 1 && !messages[i+1]?.isReply && (
                                <div className="mt-2 flex flex-col gap-2 w-full max-w-[80%]">
                                    {m.replies.map((reply, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => onAction(reply.action, m)}
                                            className="bg-white border-2 border-blue-500 text-blue-600 font-bold py-2 px-4 rounded-xl text-xs hover:bg-blue-50 transition-colors"
                                        >
                                            {reply.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <span className="text-[10px] text-gray-500 mt-1 px-1">{m.timestamp}</span>
                        </div>
                    ))}
                </div>

                {/* Input Placeholder */}
                <div className="bg-white p-3 border-t border-gray-300 flex gap-2">
                    <input 
                        type="text" 
                        placeholder="iMessage" 
                        className="flex-grow bg-gray-100 rounded-full px-4 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 text-black"
                        disabled
                    />
                    <button className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold pb-1">↑</button>
                </div>
            </div>
        );
    };

    const getContactColor = (id: string) => {
        if (id.includes('mom')) return 'bg-pink-500';
        if (id.includes('principal')) return 'bg-slate-700';
        if (id.includes('coach')) return 'bg-red-600';
        if (id.includes('friend')) return 'bg-green-500';
        return 'bg-gray-400';
    };

    if (activeContactId) return renderChat();

    return (
        <div className="h-full flex flex-col">
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-10">
                 <div className="flex gap-4">
                     <button onClick={() => setView('MESSAGES')} className={`font-bold text-sm ${view === 'MESSAGES' ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}>MSG</button>
                     <button onClick={() => setView('EMAIL')} className={`font-bold text-sm ${view === 'EMAIL' ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}>MAIL</button>
                 </div>
                 <button onClick={onBack} className="text-blue-500 font-bold text-sm">Close</button>
             </div>
             {view === 'MESSAGES' ? renderThreadList() : renderEmailList()}
        </div>
    );
};
