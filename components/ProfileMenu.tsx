import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification } from '../firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

import { InboxMessage } from '../types';

const CREATOR_EMAIL = 'andrewdann79@gmail.com';
const CREATOR_USERNAME = 'SosaDaGr8';
const CREATOR_PFP = "https://api.dicebear.com/7.x/bottts/svg?seed=Creator&backgroundColor=ffd700";

const CREATOR_MESSAGES: InboxMessage[] = [
    {
        id: 'welcome_gift_1',
        sender: 'SosaDaGr8 & AI',
        subject: 'Welcome to Marching Factory!',
        body: 'Thanks for playing! Here is a little something to get your band started.',
        timestamp: Date.now() - 86400000,
        read: false,
        gift: { type: 'FUNDS', amount: 5000 }
    },
    {
        id: 'rep_boost_1',
        sender: 'SosaDaGr8',
        subject: 'Keep up the good work!',
        body: 'Your band is looking great. Here is some reputation to help you out.',
        timestamp: Date.now() - 3600000,
        read: false,
        gift: { type: 'REPUTATION', amount: 10 }
    },
    {
        id: 'fan_boost_1',
        sender: 'SosaDaGr8',
        subject: 'Fans are loving it!',
        body: 'Your recent performances have caught the eye of some new fans. Keep it up!',
        timestamp: Date.now() - 1800000,
        read: false,
        gift: { type: 'FANS', amount: 500 }
    }
];

const PREMADE_PFPS = [
    // Classic Pixel
    "https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix",
    "https://api.dicebear.com/7.x/pixel-art/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/pixel-art/svg?seed=Milo",
    // Tough/Cool Adventurers
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Blade&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Shadow&backgroundColor=ffdfbf",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Destiny&backgroundColor=c0aede",
    // Cool Robots
    "https://api.dicebear.com/7.x/bottts/svg?seed=Titan&backgroundColor=ffdfbf",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Crusher&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Spike&backgroundColor=c0aede",
    // Stylish/Edgy
    "https://api.dicebear.com/7.x/micah/svg?seed=Ryder&backgroundColor=ffdfbf",
    "https://api.dicebear.com/7.x/micah/svg?seed=Jaxon&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/micah/svg?seed=Zane&backgroundColor=c0aede",
];

interface ProfileMenuProps {
    onClose: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ onClose }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Email/Password state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    // Profile editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editUsername, setEditUsername] = useState('');
    const [editPhotoURL, setEditPhotoURL] = useState('');
    const [editBio, setEditBio] = useState('');
    const [userProfileData, setUserProfileData] = useState<any>(null);
    const [syncing, setSyncing] = useState(false);
    const [syncSuccess, setSyncSuccess] = useState(false);
    const [cloudSaving, setCloudSaving] = useState(false);
    const [cloudLoading, setCloudLoading] = useState(false);
    const [cloudSaveSuccess, setCloudSaveSuccess] = useState(false);
    const [cloudLoadSuccess, setCloudLoadSuccess] = useState(false);
    
    const [exportCode, setExportCode] = useState<string | null>(null);
    const [importCode, setImportCode] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const [activeTab, setActiveTab] = useState<'PROFILE' | 'INBOX'>('PROFILE');
    const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>([]);

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'alert' | 'confirm';
        onConfirm?: () => void;
    }>({ isOpen: false, title: '', message: '', type: 'alert' });

    useEffect(() => {
        // Load inbox from local storage
        try {
            const savedData = localStorage.getItem('MF_GAME_STATE');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                let currentInbox: InboxMessage[] = parsed.inbox || [];
                
                // Add any missing creator messages
                let updated = false;
                CREATOR_MESSAGES.forEach(msg => {
                    if (!currentInbox.find(m => m.id === msg.id)) {
                        currentInbox.push(msg);
                        updated = true;
                    }
                });

                if (updated) {
                    parsed.inbox = currentInbox;
                    localStorage.setItem('MF_GAME_STATE', JSON.stringify(parsed));
                }
                
                setInboxMessages(currentInbox.sort((a, b) => b.timestamp - a.timestamp));
            }
        } catch (e) {
            console.error("Error loading inbox:", e);
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setEditUsername(currentUser.displayName || 'Marcher');
                setEditPhotoURL(currentUser.photoURL || '');
                // Ensure user profile exists in Firestore
                try {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (!userDoc.exists()) {
                        let finalUsername = currentUser.displayName || 'Marcher';
                        
                        // Check if default username is taken
                        const usernameDocRef = doc(db, 'usernames', finalUsername.toLowerCase());
                        const usernameDoc = await getDoc(usernameDocRef);
                        if (usernameDoc.exists() && usernameDoc.data()?.uid !== currentUser.uid) {
                            finalUsername = `${finalUsername}${Math.floor(Math.random() * 10000)}`;
                        }

                        const newProfile = {
                            uid: currentUser.uid,
                            displayName: finalUsername,
                            email: currentUser.email || '',
                            photoURL: currentUser.photoURL || '',
                            bio: '',
                            createdAt: Date.now()
                        };
                        await setDoc(userDocRef, newProfile);
                        await setDoc(doc(db, 'usernames', finalUsername.toLowerCase()), { uid: currentUser.uid });
                        setUserProfileData(newProfile);
                        setEditUsername(finalUsername);
                    } else {
                        const data = userDoc.data();
                        setUserProfileData(data);
                        setEditBio(data.bio || '');
                        if (data.photoURL) setEditPhotoURL(data.photoURL);
                    }
                } catch (err) {
                    console.error("Error setting up user profile:", err);
                }
            } else {
                setUser(null);
                setUserProfileData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err: any) {
            if (err.code === 'auth/popup-closed-by-user') {
                setError(null);
            } else {
                console.error("Login Error:", err);
                setError(err.message || "Failed to log in.");
            }
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isSignUp) {
                if (!username.trim()) throw new Error("Username is required.");
                if (username.trim().toLowerCase() === CREATOR_USERNAME.toLowerCase() && email.trim().toLowerCase() !== CREATOR_EMAIL.toLowerCase()) {
                    throw new Error("This username is reserved for the creator.");
                }
                
                // Check if username is taken
                const usernameDocRef = doc(db, 'usernames', username.trim().toLowerCase());
                const usernameDoc = await getDoc(usernameDocRef);
                if (usernameDoc.exists()) {
                    throw new Error("This username is already taken.");
                }

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCredential.user);
                await updateProfile(userCredential.user, { displayName: username });
                
                // Explicitly create the document here to ensure the username is saved immediately
                const userDocRef = doc(db, 'users', userCredential.user.uid);
                const newProfile = {
                    uid: userCredential.user.uid,
                    displayName: username,
                    email: userCredential.user.email || '',
                    photoURL: userCredential.user.photoURL || '',
                    bio: '',
                    createdAt: Date.now()
                };
                await setDoc(userDocRef, newProfile, { merge: true });
                await setDoc(usernameDocRef, { uid: userCredential.user.uid });
                
                // Force local state update
                setUser({ ...userCredential.user, displayName: username });
                setUserProfileData(newProfile);
                setEditUsername(username);
                setError("Account created! Please check your email to verify your account.");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            console.error("Auth Error:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError("This email is already in use by another account.");
            } else if (err.code === 'auth/operation-not-allowed') {
                setError("Email/Password login is not enabled. Please enable it in your Firebase Console under Authentication -> Sign-in method.");
            } else {
                setError(err.message || "Authentication failed.");
            }
        }
        setLoading(false);
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            if (!editUsername.trim()) throw new Error("Username cannot be empty.");
            if (editUsername.trim().toLowerCase() === CREATOR_USERNAME.toLowerCase() && user.email?.toLowerCase() !== CREATOR_EMAIL.toLowerCase()) {
                throw new Error("This username is reserved for the creator.");
            }
            
            // Check if username is taken
            if (editUsername.trim().toLowerCase() !== user.displayName?.toLowerCase()) {
                const usernameDocRef = doc(db, 'usernames', editUsername.trim().toLowerCase());
                const usernameDoc = await getDoc(usernameDocRef);
                if (usernameDoc.exists()) {
                    throw new Error("This username is already taken.");
                }
                
                // Delete old username
                if (user.displayName) {
                    await deleteDoc(doc(db, 'usernames', user.displayName.toLowerCase()));
                }
                // Claim new username
                await setDoc(usernameDocRef, { uid: user.uid });
            }
            
            // Update auth profile
            await updateProfile(user, { 
                displayName: editUsername,
                photoURL: editPhotoURL 
            });
            
            // Update firestore profile
            const userDocRef = doc(db, 'users', user.uid);
            const updates = { 
                displayName: editUsername,
                photoURL: editPhotoURL,
                bio: editBio
            };
            await setDoc(userDocRef, updates, { merge: true });
            
            setUser({ ...user, displayName: editUsername, photoURL: editPhotoURL });
            setUserProfileData({ ...userProfileData, ...updates });
            setIsEditing(false);
        } catch (err: any) {
            console.error("Profile Update Error:", err);
            setError(err.message || "Failed to update profile.");
        }
        setLoading(false);
    };

    const handleClaimGift = (messageId: string) => {
        try {
            const savedData = localStorage.getItem('MF_GAME_STATE');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                let currentInbox: InboxMessage[] = parsed.inbox || [];
                
                const msgIndex = currentInbox.findIndex(m => m.id === messageId);
                if (msgIndex !== -1 && currentInbox[msgIndex].gift && !currentInbox[msgIndex].claimed) {
                    const gift = currentInbox[msgIndex].gift;
                    if (gift) {
                        if (gift.type === 'FUNDS') parsed.funds = (parsed.funds || 0) + gift.amount;
                        if (gift.type === 'REPUTATION') parsed.reputation = Math.min(100, (parsed.reputation || 0) + gift.amount);
                        if (gift.type === 'FANS') parsed.fans = (parsed.fans || 0) + gift.amount;
                    }
                    
                    currentInbox[msgIndex].claimed = true;
                    currentInbox[msgIndex].read = true;
                    parsed.inbox = currentInbox;
                    
                    localStorage.setItem('MF_GAME_STATE', JSON.stringify(parsed));
                    setInboxMessages([...currentInbox].sort((a, b) => b.timestamp - a.timestamp));
                    
                    setModalConfig({
                        isOpen: true,
                        title: 'Gift Claimed!',
                        message: `You received ${gift?.amount} ${gift?.type}!`,
                        type: 'alert'
                    });
                }
            }
        } catch (e) {
            console.error("Error claiming gift:", e);
        }
    };

    const handleMarkRead = (messageId: string) => {
        try {
            const savedData = localStorage.getItem('MF_GAME_STATE');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                let currentInbox: InboxMessage[] = parsed.inbox || [];
                
                const msgIndex = currentInbox.findIndex(m => m.id === messageId);
                if (msgIndex !== -1 && !currentInbox[msgIndex].read) {
                    currentInbox[msgIndex].read = true;
                    parsed.inbox = currentInbox;
                    
                    localStorage.setItem('MF_GAME_STATE', JSON.stringify(parsed));
                    setInboxMessages([...currentInbox].sort((a, b) => b.timestamp - a.timestamp));
                }
            }
        } catch (e) {
            console.error("Error marking read:", e);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
        } catch (err: any) {
            console.error("Logout Error:", err);
            setError(err.message || "Failed to log out.");
            setLoading(false);
        }
    };

    const handleSyncBand = async () => {
        if (!user) return;
        setSyncing(true);
        setError(null);
        setSyncSuccess(false);

        try {
            const savedData = localStorage.getItem('MF_GAME_STATE');
            if (!savedData) {
                throw new Error("No active band found. Start a game first!");
            }

            const parsedData = JSON.parse(savedData);
            if (!parsedData.bandName) {
                throw new Error("Invalid band data.");
            }

            const bandDocRef = doc(db, 'community_bands', user.uid);
            
            // Extract only what we need to keep size down
            const bandDataToSave = {
                members: parsedData.members || [],
                uniforms: parsedData.uniforms || [],
                identity: parsedData.identity || {}
            };

            await setDoc(bandDocRef, {
                uid: user.uid,
                bandName: parsedData.bandName,
                directorName: parsedData.director?.name || user.displayName || 'Unknown Director',
                style: parsedData.style || 'Show-Style',
                reputation: parsedData.reputation || 0,
                fans: parsedData.fans || 0,
                bandData: JSON.stringify(bandDataToSave),
                updatedAt: Date.now()
            });

            setSyncSuccess(true);
            setTimeout(() => setSyncSuccess(false), 3000);
        } catch (err: any) {
            console.error("Sync Error:", err);
            setError(err.message || "Failed to sync band to cloud.");
        }
        setSyncing(false);
    };

    const handleCloudSave = async () => {
        if (!user) return;
        setCloudSaving(true);
        setError(null);
        setCloudSaveSuccess(false);

        try {
            const allSaves: Record<string, string | null> = {
                'MF_GAME_STATE': localStorage.getItem('MF_GAME_STATE')
            };
            for (let i = 1; i <= 5; i++) {
                allSaves[`MF_SAVE_${i}`] = localStorage.getItem(`MF_SAVE_${i}`);
            }

            const hasData = Object.values(allSaves).some(data => data !== null);
            if (!hasData) {
                throw new Error("No active band or save slots found to save. Start a game first!");
            }

            const saveDocRef = doc(db, 'user_saves', user.uid);
            await setDoc(saveDocRef, {
                uid: user.uid,
                saveData: JSON.stringify(allSaves),
                updatedAt: Date.now()
            });

            setCloudSaveSuccess(true);
            setModalConfig({
                isOpen: true,
                title: "Cloud Save Successful",
                message: "Your Auto Save and all 5 Save Slots have been securely backed up to the cloud.",
                type: 'alert'
            });
            setTimeout(() => setCloudSaveSuccess(false), 5000);
        } catch (err: any) {
            console.error("Cloud Save Error:", err);
            setError(err.message || "Failed to save game to cloud.");
            setModalConfig({
                isOpen: true,
                title: "Cloud Save Failed",
                message: err.message || "Failed to save game to cloud.",
                type: 'alert'
            });
        }
        setCloudSaving(false);
    };

    const handleCloudLoadClick = () => {
        if (!user) return;
        setModalConfig({
            isOpen: true,
            title: "Load Cloud Save",
            message: "Are you sure you want to load your cloud save? This will overwrite your current local Auto Save and all 5 Save Slots!",
            type: 'confirm',
            onConfirm: executeCloudLoad
        });
    };

    const executeCloudLoad = async () => {
        setModalConfig({ ...modalConfig, isOpen: false });
        if (!user) return;

        setCloudLoading(true);
        setError(null);
        setCloudLoadSuccess(false);

        try {
            const saveDocRef = doc(db, 'user_saves', user.uid);
            const saveDoc = await getDoc(saveDocRef);

            if (!saveDoc.exists()) {
                throw new Error("No cloud save found for this account.");
            }

            const data = saveDoc.data();
            if (!data.saveData) {
                throw new Error("Cloud save data is corrupted.");
            }

            try {
                const allSaves = JSON.parse(data.saveData);
                if (typeof allSaves === 'object' && allSaves !== null && !Array.isArray(allSaves) && (allSaves['MF_GAME_STATE'] !== undefined || allSaves['MF_SAVE_1'] !== undefined)) {
                    if (allSaves['MF_GAME_STATE']) localStorage.setItem('MF_GAME_STATE', allSaves['MF_GAME_STATE']);
                    for (let i = 1; i <= 5; i++) {
                        if (allSaves[`MF_SAVE_${i}`]) {
                            localStorage.setItem(`MF_SAVE_${i}`, allSaves[`MF_SAVE_${i}`]);
                        } else {
                            localStorage.removeItem(`MF_SAVE_${i}`);
                        }
                    }
                } else {
                    localStorage.setItem('MF_GAME_STATE', data.saveData);
                }
            } catch (e) {
                localStorage.setItem('MF_GAME_STATE', data.saveData);
            }

            setCloudLoadSuccess(true);
            setModalConfig({
                isOpen: true,
                title: "Cloud Load Successful",
                message: "Your game data has been restored from the cloud. The game will now reload.",
                type: 'alert',
                onConfirm: () => window.location.reload()
            });
            
        } catch (err: any) {
            console.error("Cloud Load Error:", err);
            setError(err.message || "Failed to load game from cloud.");
            setModalConfig({
                isOpen: true,
                title: "Cloud Load Failed",
                message: err.message || "Failed to load game from cloud.",
                type: 'alert'
            });
        }
        setCloudLoading(false);
    };

    const generateShareCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleExportSave = async () => {
        if (!user) return;
        setIsExporting(true);
        setError(null);
        setExportCode(null);

        try {
            const allSaves: Record<string, string | null> = {
                'MF_GAME_STATE': localStorage.getItem('MF_GAME_STATE')
            };
            for (let i = 1; i <= 5; i++) {
                allSaves[`MF_SAVE_${i}`] = localStorage.getItem(`MF_SAVE_${i}`);
            }

            const hasData = Object.values(allSaves).some(data => data !== null);
            if (!hasData) {
                throw new Error("No active band or save slots found to export. Start a game first!");
            }

            const code = generateShareCode();
            const saveDocRef = doc(db, 'shared_saves', code);
            
            await setDoc(saveDocRef, {
                code: code,
                saveData: JSON.stringify(allSaves),
                createdAt: Date.now()
            });

            setExportCode(code);
        } catch (err: any) {
            console.error("Export Save Error:", err);
            setError(err.message || "Failed to export save.");
            setModalConfig({
                isOpen: true,
                title: "Export Failed",
                message: err.message || "Failed to export save.",
                type: 'alert'
            });
        }
        setIsExporting(false);
    };

    const handleImportSaveClick = () => {
        if (!importCode.trim()) {
            setModalConfig({
                isOpen: true,
                title: "Invalid Code",
                message: "Please enter a 6-character share code.",
                type: 'alert'
            });
            return;
        }

        setModalConfig({
            isOpen: true,
            title: "Import Cloud Save",
            message: "Are you sure you want to import this save? This will overwrite your current local Auto Save and all 5 Save Slots!",
            type: 'confirm',
            onConfirm: executeImportSave
        });
    };

    const executeImportSave = async () => {
        setModalConfig({ ...modalConfig, isOpen: false });
        setIsImporting(true);
        setError(null);

        try {
            const code = importCode.trim().toUpperCase();
            const saveDocRef = doc(db, 'shared_saves', code);
            const saveDoc = await getDoc(saveDocRef);

            if (!saveDoc.exists()) {
                throw new Error("Invalid or expired share code.");
            }

            const data = saveDoc.data();
            if (!data.saveData) {
                throw new Error("Shared save data is corrupted.");
            }

            try {
                const allSaves = JSON.parse(data.saveData);
                if (typeof allSaves === 'object' && allSaves !== null && !Array.isArray(allSaves) && (allSaves['MF_GAME_STATE'] !== undefined || allSaves['MF_SAVE_1'] !== undefined)) {
                    if (allSaves['MF_GAME_STATE']) localStorage.setItem('MF_GAME_STATE', allSaves['MF_GAME_STATE']);
                    for (let i = 1; i <= 5; i++) {
                        if (allSaves[`MF_SAVE_${i}`]) {
                            localStorage.setItem(`MF_SAVE_${i}`, allSaves[`MF_SAVE_${i}`]);
                        } else {
                            localStorage.removeItem(`MF_SAVE_${i}`);
                        }
                    }
                } else {
                    localStorage.setItem('MF_GAME_STATE', data.saveData);
                }
            } catch (e) {
                localStorage.setItem('MF_GAME_STATE', data.saveData);
            }

            setImportCode('');
            setModalConfig({
                isOpen: true,
                title: "Import Successful",
                message: "Game data has been imported successfully. The game will now reload.",
                type: 'alert',
                onConfirm: () => window.location.reload()
            });
            
        } catch (err: any) {
            console.error("Import Save Error:", err);
            setError(err.message || "Failed to import save.");
            setModalConfig({
                isOpen: true,
                title: "Import Failed",
                message: err.message || "Failed to import save.",
                type: 'alert'
            });
        }
        setIsImporting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8">
            <div className="bg-slate-900 border-2 border-slate-600 p-8 max-w-md w-full max-h-full overflow-y-auto relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
                >
                    &times;
                </button>
                <h2 className="text-3xl font-bold text-white mb-6 font-pixel uppercase tracking-widest text-center">Profile</h2>
                
                {user && !isEditing && (
                    <div className="flex justify-center gap-4 mb-6 border-b border-slate-700 pb-2">
                        <button 
                            onClick={() => setActiveTab('PROFILE')}
                            className={`text-lg font-bold uppercase tracking-wider px-4 py-2 transition-colors ${activeTab === 'PROFILE' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Profile
                        </button>
                        <button 
                            onClick={() => setActiveTab('INBOX')}
                            className={`text-lg font-bold uppercase tracking-wider px-4 py-2 transition-colors relative ${activeTab === 'INBOX' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Inbox
                            {inboxMessages.some(m => !m.read) && (
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                            )}
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="text-center text-gray-400 py-8">Loading...</div>
                ) : user ? (
                    <div className="flex flex-col items-center gap-4">
                        {activeTab === 'INBOX' ? (
                            <div className="w-full flex flex-col gap-3">
                                {inboxMessages.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8 italic">No messages yet.</div>
                                ) : (
                                    inboxMessages.map(msg => (
                                        <div key={msg.id} className={`bg-slate-800/80 p-4 rounded-lg border ${msg.read ? 'border-slate-700' : 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]'} flex flex-col gap-2`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className={`font-bold ${msg.read ? 'text-gray-300' : 'text-white'}`}>{msg.subject}</h4>
                                                    <p className="text-xs text-gray-400">From: {msg.sender}</p>
                                                </div>
                                                <span className="text-[10px] text-gray-500">{new Date(msg.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 mt-2">{msg.body}</p>
                                            
                                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-700/50">
                                                {msg.gift ? (
                                                    <Button 
                                                        onClick={() => handleClaimGift(msg.id)} 
                                                        variant={msg.claimed ? 'secondary' : 'primary'}
                                                        disabled={msg.claimed}
                                                    >
                                                        {msg.claimed ? 'Claimed' : `Claim ${msg.gift.amount} ${msg.gift.type}`}
                                                    </Button>
                                                ) : (
                                                    <div />
                                                )}
                                                
                                                {!msg.read && (
                                                    <button onClick={() => handleMarkRead(msg.id)} className="text-xs text-blue-400 hover:text-blue-300">
                                                        Mark as Read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : isEditing ? (
                            <div className="w-full flex flex-col gap-3">
                                <div className="flex flex-col items-center gap-2 mb-2">
                                    {editPhotoURL ? (
                                        <img src={editPhotoURL} alt="Profile Preview" className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover" referrerPolicy="no-referrer" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-4xl border-4 border-blue-500">
                                            👤
                                        </div>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Profile Picture URL</label>
                                    <input 
                                        type="text" 
                                        value={editPhotoURL} 
                                        onChange={(e) => setEditPhotoURL(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <div className="mt-2">
                                        <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Or choose a premade avatar:</label>
                                        <div className="flex gap-2 flex-wrap justify-center">
                                            {PREMADE_PFPS.map((pfp, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setEditPhotoURL(pfp)}
                                                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${editPhotoURL === pfp ? 'border-blue-500 scale-110' : 'border-slate-600 hover:border-slate-400'}`}
                                                >
                                                    <img src={pfp} alt={`Premade ${idx}`} className="w-full h-full object-cover bg-slate-700" referrerPolicy="no-referrer" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {user.email?.toLowerCase() === CREATOR_EMAIL.toLowerCase() && (
                                        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                                            <label className="text-xs text-yellow-500 uppercase tracking-wider mb-2 block font-bold text-center">👑 Creator Exclusive Avatar</label>
                                            <div className="flex justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditPhotoURL(CREATOR_PFP)}
                                                    className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${editPhotoURL === CREATOR_PFP ? 'border-yellow-400 scale-110 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'border-yellow-700 hover:border-yellow-500'}`}
                                                >
                                                    <img src={CREATOR_PFP} alt="Creator PFP" className="w-full h-full object-cover bg-slate-800" referrerPolicy="no-referrer" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Username</label>
                                    <input 
                                        type="text" 
                                        value={editUsername} 
                                        onChange={(e) => setEditUsername(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white font-bold"
                                        placeholder="Username"
                                        maxLength={20}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Bio</label>
                                    <textarea 
                                        value={editBio} 
                                        onChange={(e) => setEditBio(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm min-h-[80px] resize-none"
                                        placeholder="Tell us about your coaching style..."
                                        maxLength={150}
                                    />
                                </div>

                                <div className="flex gap-2 justify-center mt-2">
                                    <Button onClick={handleSaveProfile} variant="primary">Save Changes</Button>
                                    <Button onClick={() => { 
                                        setIsEditing(false); 
                                        setEditUsername(user.displayName || 'Marcher'); 
                                        setEditPhotoURL(user.photoURL || '');
                                        setEditBio(userProfileData?.bio || '');
                                    }} variant="secondary">Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-4xl border-4 border-blue-500">
                                        👤
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-2">
                                    <h3 className="text-2xl font-bold text-white flex items-center">
                                        {user.displayName || 'Marcher'}
                                        {user.email?.toLowerCase() === CREATOR_EMAIL.toLowerCase() && (
                                            <span className="ml-2 text-yellow-400 text-xl" title="Creator">👑</span>
                                        )}
                                    </h3>
                                    <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white text-sm" title="Edit Profile">✏️</button>
                                </div>
                                
                                <p className="text-sm text-gray-400 -mt-2">{user.email}</p>

                                {userProfileData?.bio && (
                                    <div className="w-full bg-slate-800/50 p-3 rounded border border-slate-700/50 mt-2">
                                        <p className="text-sm text-gray-300 italic text-center">"{userProfileData.bio}"</p>
                                    </div>
                                )}

                                {userProfileData?.createdAt && (
                                    <div className="w-full flex justify-center mt-2">
                                        <span className="text-xs text-gray-500 font-mono uppercase tracking-wider bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                                            Account Founded: {new Date(userProfileData.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}

                                <div className="w-full mt-6 flex flex-col gap-2">
                                    <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 flex flex-col gap-3">
                                        <h4 className="text-white font-bold text-center text-sm uppercase tracking-wider mb-1">Cloud Saves</h4>
                                        <p className="text-xs text-gray-400 text-center mb-2">Back up your full game state to the cloud to play across devices.</p>
                                        
                                        <Button 
                                            onClick={handleCloudSave} 
                                            variant="primary" 
                                            className="w-full flex items-center justify-center gap-2"
                                            disabled={cloudSaving}
                                        >
                                            {cloudSaving ? 'Saving...' : '💾 Save Game to Cloud'}
                                        </Button>
                                        {cloudSaveSuccess && <div className="text-green-400 text-xs text-center">Game saved to cloud successfully!</div>}

                                        <Button 
                                            onClick={handleCloudLoadClick} 
                                            variant="secondary" 
                                            className="w-full flex items-center justify-center gap-2"
                                            disabled={cloudLoading}
                                        >
                                            {cloudLoading ? 'Loading...' : '📥 Load Game from Cloud'}
                                        </Button>
                                        {cloudLoadSuccess && <div className="text-green-400 text-xs text-center">Game loaded successfully! Reloading...</div>}
                                    </div>

                                    <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 flex flex-col gap-3 mt-2">
                                        <h4 className="text-white font-bold text-center text-sm uppercase tracking-wider mb-1">Share Save</h4>
                                        <p className="text-xs text-gray-400 text-center mb-2">Generate a code to share your save, or import a save using a code.</p>
                                        
                                        <Button 
                                            onClick={handleExportSave} 
                                            variant="secondary" 
                                            className="w-full flex items-center justify-center gap-2"
                                            disabled={isExporting}
                                        >
                                            {isExporting ? 'Generating Code...' : '📤 Generate Share Code'}
                                        </Button>
                                        {exportCode && (
                                            <div className="bg-slate-900 p-3 rounded border border-blue-500 text-center">
                                                <p className="text-xs text-gray-400 mb-1">Your Share Code:</p>
                                                <p className="text-2xl font-mono font-bold text-blue-400 tracking-widest">{exportCode}</p>
                                                <p className="text-[10px] text-gray-500 mt-1">Anyone with this code can import your save.</p>
                                            </div>
                                        )}

                                        <div className="flex gap-2 mt-2">
                                            <input 
                                                type="text" 
                                                placeholder="Enter 6-char code" 
                                                value={importCode}
                                                onChange={(e) => setImportCode(e.target.value.toUpperCase())}
                                                maxLength={6}
                                                className="flex-1 bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm font-mono uppercase text-center"
                                            />
                                            <Button 
                                                onClick={handleImportSaveClick} 
                                                variant="primary" 
                                                disabled={isImporting || importCode.length < 6}
                                            >
                                                {isImporting ? 'Importing...' : 'Import'}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 flex flex-col gap-3 mt-2">
                                        <h4 className="text-white font-bold text-center text-sm uppercase tracking-wider mb-1">Community</h4>
                                        <p className="text-xs text-gray-400 text-center mb-2">Upload your band's look and reputation to the Community Hub.</p>
                                        <Button 
                                            onClick={handleSyncBand} 
                                            variant="primary" 
                                            className="w-full flex items-center justify-center gap-2"
                                            disabled={syncing}
                                        >
                                            {syncing ? 'Uploading...' : '☁️ Upload Band to Community'}
                                        </Button>
                                        {syncSuccess && <div className="text-green-400 text-xs text-center">Band uploaded successfully!</div>}
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {error && <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded w-full mt-2">{error}</div>}

                        {!isEditing && (
                            <div className="mt-4 w-full flex justify-center">
                                <Button onClick={handleLogout} variant="danger">SIGN OUT</Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6 py-4">
                        <div className="text-center text-gray-300 text-sm">
                            <p className="mb-2">Log in to save your band's progress to the cloud, compete on leaderboards, and more!</p>
                        </div>
                        
                        {error && <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded w-full">{error}</div>}
                        
                        <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-3">
                            {isSignUp && (
                                <input 
                                    type="text" 
                                    placeholder="Username" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-white"
                                    required
                                />
                            )}
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-white"
                                required
                            />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-white"
                                required
                            />
                            <Button type="submit" variant="primary" className="w-full mt-2">
                                {isSignUp ? 'Create Account' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="text-sm text-gray-400">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            <button 
                                onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                                className="ml-2 text-blue-400 hover:text-blue-300 font-bold"
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </div>

                        <div className="w-full flex items-center gap-4 my-2">
                            <div className="h-px bg-slate-700 flex-grow"></div>
                            <span className="text-slate-500 text-sm font-bold">OR</span>
                            <div className="h-px bg-slate-700 flex-grow"></div>
                        </div>

                        <button 
                            onClick={handleGoogleLogin}
                            className="bg-white text-black font-bold py-3 px-6 rounded flex items-center gap-3 hover:bg-gray-200 transition-colors w-full justify-center"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign in with Google
                        </button>
                    </div>
                )}
            </div>
            {modalConfig.isOpen && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
                    <div className="bg-slate-900 border-2 border-slate-600 p-6 max-w-sm w-full relative">
                        <h3 className="text-xl font-bold text-white mb-4 font-pixel">{modalConfig.title}</h3>
                        <p className="text-gray-300 mb-6 text-sm">{modalConfig.message}</p>
                        <div className="flex justify-end gap-3">
                            {modalConfig.type === 'confirm' && (
                                <Button 
                                    onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} 
                                    variant="secondary"
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button 
                                onClick={() => {
                                    if (modalConfig.onConfirm) {
                                        modalConfig.onConfirm();
                                    } else {
                                        setModalConfig({ ...modalConfig, isOpen: false });
                                    }
                                }} 
                                variant="primary"
                            >
                                OK
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
