import React, { useState } from 'react';
import { Button } from './Button';

interface FeedbackModalProps {
    onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose }) => {
    const [feedback, setFeedback] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        // In a real app, send this to a server
        console.log("Feedback submitted:", feedback);
        setSubmitted(true);
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-800 border-4 border-yellow-500 p-8 max-w-md w-full shadow-2xl relative">
                <h2 className="text-2xl font-black text-yellow-500 mb-6 uppercase border-b-2 border-gray-600 pb-2">Feedback & Suggestions</h2>
                
                {submitted ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4">✅</div>
                        <h3 className="text-xl font-bold text-white mb-2">Thank you!</h3>
                        <p className="text-gray-400 text-sm mb-6">We appreciate your input.</p>
                        <Button onClick={onClose} className="w-full">CLOSE</Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Your feedback</label>
                            <textarea 
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full h-32 bg-slate-900 border border-slate-600 text-white p-3 text-sm focus:border-yellow-500 outline-none resize-none"
                                placeholder="Tell us what you think or suggest a new feature..."
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button onClick={onClose} variant="secondary" className="flex-1">CANCEL</Button>
                            <Button 
                                onClick={handleSubmit} 
                                className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-black border-yellow-400"
                                disabled={!feedback.trim()}
                            >
                                SUBMIT
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
