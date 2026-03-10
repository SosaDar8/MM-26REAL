import React, { useState } from 'react';
import { Button } from './Button';
import { SCHOOLS_DATA, DEFAULT_APPEARANCE, GREEK_ORGS, generateProceduralLogo } from '../constants';
import { CareerState, InstrumentType, Appearance, Director, DirectorTrait } from '../types';
import { AvatarEditor } from './AvatarEditor';

interface CareerSetupProps {
    onComplete: (careerState: CareerState, identity: any) => void;
    onBack: () => void;
}

export const CareerSetup: React.FC<CareerSetupProps> = ({ onComplete, onBack }) => {
    const [step, setStep] = useState<'PATH' | 'CHARACTER' | 'SCHOOL' | 'SOCIAL'>('PATH');
    const [careerPath, setCareerPath] = useState<'HS' | 'COLLEGE'>('HS');
    
    // Character State
    const [name, setName] = useState('Player One');
    const [gender, setGender] = useState<'Male'|'Female'|'Non-Binary'>('Male');
    const [socialGroup, setSocialGroup] = useState<string>('');
    const [bandName, setBandName] = useState('');
    const [customMascot, setCustomMascot] = useState('');
    const [location, setLocation] = useState('');
    const [instrument, setInstrument] = useState<InstrumentType>(InstrumentType.SNARE);
    const [appearance, setAppearance] = useState<Appearance>(DEFAULT_APPEARANCE);
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
    
    // Mock director for editing visuals
    const mockDirector: Director = {
        name: name,
        gender: gender === 'Female' ? 'FEMALE' : 'MALE',
        trait: DirectorTrait.SHOWMAN,
        appearance: appearance,
        currentOutfitId: 'casual',
        outfits: [{ id: 'casual', name: 'Casual', topColor: '#ffffff', bottomColor: '#000000', style: 'casual' }]
    };

    const handleAvatarSave = (d: Director) => {
        setAppearance(d.appearance);
        setStep('SCHOOL');
    };

    const handleSchoolSelect = (schoolId: string) => {
        setSelectedSchoolId(schoolId);
        // If college, go to social group selection
        if (careerPath === 'COLLEGE') {
            setStep('SOCIAL');
        } else {
            finalizeSetup(schoolId, '');
        }
    };

    const finalizeSetup = (schoolId: string, group: string) => {
        const school = SCHOOLS_DATA.find(s => s.id === schoolId);
        if (!school) return;

        const initialState: CareerState = {
            playerName: name,
            gender: gender,
            socialGroup: group,
            playerAppearance: appearance,
            instrument: instrument,
            level: careerPath === 'HS' ? 'Freshman' : 'Senior',
            schoolId: school.id,
            energy: 100,
            academics: 80,
            skill: careerPath === 'HS' ? 20 : 60,
            xp: 0,
            directorTrust: 50,
            sectionHype: 50,
            rank: 'ROOKIE',
            rankIndex: 0, // Start at bottom
            week: 1,
            timeSlots: 5,
            seenTutorial: false,
            casualOutfit: {
                id: 'casual_starter',
                name: 'Casual Fit',
                topColor: '#ffffff',
                bottomColor: '#000000',
                style: 'casual',
                topId: 'top_basic_tee',
                bottomId: 'bot_jeans'
            },
            currentLocation: 'DORM',
            wallet: 50,
            perks: [], // Will be inited in Hub
            skillPoints: 0,
            history: ['Started career']
        };

        // Auto-generate logo if not present
        const initials = (bandName || school.name).split(' ').map(w => w[0]).join('').substring(0, 2);
        const schoolLogo = generateProceduralLogo(school.colors[0], school.colors[1], initials);

        const identity = {
            schoolName: school.name,
            schoolType: school.type,
            foundingYear: 1881,
            mascot: customMascot || 'Mascot',
            primaryColor: school.colors[0],
            secondaryColor: school.colors[1],
            schoolLogo: schoolLogo,
            bandLogo: schoolLogo,
            useSchoolLogo: true
        };

        onComplete(initialState, identity);
    };

    return (
        <div className="h-full bg-slate-900 text-white font-mono flex flex-col overflow-hidden">
            {step === 'PATH' && (
                <div className="flex-grow flex flex-col items-center justify-center p-8">
                    <h1 className="text-5xl font-black text-yellow-400 mb-8">CHOOSE YOUR PATH</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                        <div 
                            onClick={() => { setCareerPath('HS'); setStep('CHARACTER'); }}
                            className="bg-slate-800 border-4 border-white p-8 hover:bg-slate-700 cursor-pointer transition-transform hover:scale-105"
                        >
                            <h2 className="text-3xl font-bold mb-2">HIGH SCHOOL</h2>
                            <p className="text-green-400 mb-4">START AS AN 8TH GRADER</p>
                            <ul className="text-sm space-y-2 text-gray-300">
                                <li>• Learn the fundamentals</li>
                                <li>• 4 Years of Progression</li>
                                <li>• Sectionals & Small Events</li>
                                <li>• Goal: Earn a Scholarship</li>
                            </ul>
                        </div>
                        <div 
                            onClick={() => { setCareerPath('COLLEGE'); setStep('CHARACTER'); }}
                            className="bg-slate-800 border-4 border-yellow-500 p-8 hover:bg-slate-700 cursor-pointer transition-transform hover:scale-105"
                        >
                            <h2 className="text-3xl font-bold mb-2">COLLEGE</h2>
                            <p className="text-yellow-400 mb-4">START AS A FRESHMAN</p>
                            <ul className="text-sm space-y-2 text-gray-300">
                                <li>• Elite Performance Level</li>
                                <li>• Fight for your spot on the line</li>
                                <li>• Huge Stadiums & TV Broadcasts</li>
                                <li>• Goal: Become Drum Major</li>
                            </ul>
                        </div>
                    </div>
                    <Button onClick={onBack} variant="secondary" className="mt-12">CANCEL</Button>
                </div>
            )}

            {step === 'CHARACTER' && (
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="bg-black p-4 border-b border-gray-700 flex flex-col gap-2 z-50 flex-shrink-0 shadow-md">
                        <h2 className="text-2xl text-yellow-400">CREATE BAND MEMBER</h2>
                        <div className="flex flex-wrap gap-4">
                            <input 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className="bg-gray-800 border border-gray-600 px-2 py-1 text-white"
                                placeholder="Enter Name"
                            />
                            <select 
                                value={gender}
                                onChange={(e) => setGender(e.target.value as any)}
                                className="bg-gray-800 border border-gray-600 px-2 py-1 text-white"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-Binary">Non-Binary</option>
                            </select>
                            <select 
                                value={instrument}
                                onChange={(e) => setInstrument(e.target.value as InstrumentType)}
                                className="bg-gray-800 border border-gray-600 px-2 py-1 text-white"
                            >
                                {Object.values(InstrumentType).filter(i => i !== InstrumentType.MACE && i !== InstrumentType.GUARD && i !== InstrumentType.MAJORETTE).map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    {/* Editor Container - Flex Grow to take remaining height */}
                    <div className="flex-grow relative overflow-hidden">
                        <AvatarEditor 
                            director={mockDirector} 
                            onBack={() => setStep('PATH')}
                            onSave={handleAvatarSave}
                        />
                    </div>
                </div>
            )}

            {step === 'SCHOOL' && (
                <div className="flex-grow p-8 overflow-y-auto">
                    <h1 className="text-4xl text-center text-white mb-8">SELECT YOUR {careerPath === 'HS' ? 'HIGH SCHOOL' : 'COLLEGE'}</h1>
                    
                    <div className="max-w-2xl mx-auto mb-8 bg-black p-4 border border-gray-600">
                        <label className="block text-gray-400 text-sm mb-1">CUSTOM MASCOT (Optional)</label>
                        <input 
                            value={customMascot}
                            onChange={(e) => setCustomMascot(e.target.value)}
                            className="w-full bg-gray-800 p-2 text-white border border-gray-600 mb-4"
                            placeholder="e.g. Fighting Pickles"
                        />
                         <label className="block text-gray-400 text-sm mb-1">BAND NAME (Optional)</label>
                        <input 
                            value={bandName}
                            onChange={(e) => setBandName(e.target.value)}
                            className="w-full bg-gray-800 p-2 text-white border border-gray-600 mb-4"
                            placeholder="e.g. The Sonic Boom"
                        />
                        <label className="block text-gray-400 text-sm mb-1">LOCATION (Optional)</label>
                        <input 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-gray-800 p-2 text-white border border-gray-600"
                            placeholder="e.g. Atlanta, GA"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {SCHOOLS_DATA.filter(s => careerPath === 'HS' ? s.type === 'High School' : s.type === 'College').map(school => (
                            <div key={school.id} className="bg-slate-800 border-4 hover:border-white p-6 flex flex-col gap-4 shadow-lg transition-all group">
                                <div className="h-32 w-full mb-2 relative overflow-hidden" style={{ backgroundColor: school.colors[0] }}>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    <div className="absolute bottom-0 right-0 p-4">
                                        <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg" style={{ backgroundColor: school.colors[1] }}></div>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{school.name}</h2>
                                    <div className="flex gap-2 mb-2">
                                        {[...Array(school.prestige)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
                                    </div>
                                    <p className="text-sm text-gray-300 h-16">{school.description}</p>
                                </div>
                                <div className="mt-auto">
                                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Band Style: <span className="text-white font-bold">{school.style}</span></div>
                                    <Button onClick={() => handleSchoolSelect(school.id)} className="w-full" variant="success">SELECT SCHOOL</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <Button onClick={() => setStep('CHARACTER')} variant="secondary">BACK</Button>
                    </div>
                </div>
            )}

            {step === 'SOCIAL' && (
                <div className="flex-grow p-8 flex flex-col items-center justify-center">
                    <h1 className="text-4xl text-center text-white mb-8">SELECT SOCIAL ORGANIZATION</h1>
                    <p className="text-gray-400 mb-8 max-w-lg text-center">
                        Joining a Fraternity or Sorority provides social buffs and networking, but requires time commitment.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-center text-blue-400 border-b border-blue-500 pb-2">
                                {gender === 'Female' ? 'SORORITIES' : 'FRATERNITIES'}
                            </h2>
                            <div className="space-y-2">
                                {(gender === 'Female' ? GREEK_ORGS.SORORITIES : GREEK_ORGS.FRATERNITIES).map(org => (
                                    <button 
                                        key={org}
                                        onClick={() => finalizeSetup(selectedSchoolId, org)}
                                        className="w-full p-4 bg-slate-800 border-2 border-slate-600 hover:border-white hover:bg-slate-700 text-left transition-colors font-serif font-bold text-xl"
                                    >
                                        {org}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                             <h2 className="text-2xl font-bold text-center text-purple-400 border-b border-purple-500 pb-2">
                                BAND HONORARY
                            </h2>
                            <div className="space-y-2">
                                {GREEK_ORGS.COED.map(org => (
                                    <button 
                                        key={org}
                                        onClick={() => finalizeSetup(selectedSchoolId, org)}
                                        className="w-full p-4 bg-slate-800 border-2 border-slate-600 hover:border-white hover:bg-slate-700 text-left transition-colors font-serif font-bold text-xl"
                                    >
                                        {org}
                                    </button>
                                ))}
                                <button 
                                    onClick={() => finalizeSetup(selectedSchoolId, '')}
                                    className="w-full p-4 bg-gray-900 border-2 border-gray-700 hover:border-gray-500 text-left text-gray-400 mt-8"
                                >
                                    Skip Social Organization
                                </button>
                            </div>
                        </div>
                    </div>
                     <div className="mt-8 text-center">
                        <Button onClick={() => setStep('SCHOOL')} variant="secondary">BACK</Button>
                    </div>
                </div>
            )}
        </div>
    );
};