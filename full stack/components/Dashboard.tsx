
import React, { useState, useRef, useEffect } from 'react';
import { User, College, ChatMessage } from '../types';
import { TELANGANA_COLLEGES } from '../constants';
import { generateChatResponse } from '../services/geminiService';
import { ThemeToggle } from './ThemeToggle';
import { CollegeDetailsModal } from './CollegeDetailsModal';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.5 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 18c-2.28 0-4.22-1.66-5-4h10c-.78 2.34-2.72 4-5 4z"/></svg>
);
const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
);

interface CollegeSelectorProps {
    colleges: College[];
    selectedCollege: College | null;
    onSelect: (college: College) => void;
}

const CollegeSelector: React.FC<CollegeSelectorProps> = ({ colleges, selectedCollege, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const filteredColleges = colleges.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative w-full" ref={wrapperRef}>
             <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
             >
                <span className="flex items-center truncate text-gray-900 dark:text-white max-w-full">
                    {selectedCollege ? (
                        <>
                            {selectedCollege.logo && <img src={selectedCollege.logo} alt="" className="w-6 h-6 rounded-full mr-2 object-cover flex-shrink-0" />}
                            <span className="truncate">{selectedCollege.name}</span>
                        </>
                    ) : (
                        "Select a College"
                    )}
                </span>
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''} flex-shrink-0 ml-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
             </button>

             {isOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-700 relative">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search colleges..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-2 py-1 pr-8 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <ul className="max-h-60 overflow-y-auto" role="listbox">
                        {filteredColleges.length > 0 ? (
                            filteredColleges.map(college => (
                                <li
                                    key={college.id}
                                    onClick={() => {
                                        onSelect(college);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    role="option"
                                    aria-selected={selectedCollege?.id === college.id}
                                    className={`flex items-center px-3 py-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors ${selectedCollege?.id === college.id ? 'bg-indigo-100 dark:bg-indigo-900/50' : ''}`}
                                >
                                    {college.logo && <img src={college.logo} alt="" className="w-8 h-8 rounded-full mr-3 object-cover flex-shrink-0" />}
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{college.name}</span>
                                </li>
                            ))
                        ) : (
                             <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">No colleges found</li>
                        )}
                    </ul>
                </div>
             )}
        </div>
    );
};


export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, theme, setTheme }) => {
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Real-time messages from Firestore
  useEffect(() => {
    const messagesPath = `users/${user.uid}/messages`;
    const q = query(
      collection(db, 'users', user.uid, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      
      if (msgs.length === 0) {
        // Add initial greeting if no messages exist
        const greeting = {
            uid: user.uid,
            text: `Hello ${user.name}! I'm your AI assistant. Select a college and ask me anything about its courses, syllabus, or campus life.`,
            role: 'assistant' as const,
            createdAt: serverTimestamp()
        };
        try {
          addDoc(collection(db, 'users', user.uid, 'messages'), greeting);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, messagesPath);
        }
      } else {
        setMessages(msgs);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, messagesPath);
    });

    return () => unsubscribe();
  }, [user.uid, user.name]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const messagesPath = `users/${user.uid}/messages`;
    const userMessage = {
      uid: user.uid,
      text: userInput,
      role: 'user' as const,
      createdAt: serverTimestamp(),
    };

    setUserInput('');
    setIsLoading(true);

    try {
      await addDoc(collection(db, 'users', user.uid, 'messages'), userMessage);

      const chatHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model' as const,
        parts: [{ text: msg.text }]
      }));

      const botResponseText = await generateChatResponse(userInput, selectedCollege, chatHistory);
      
      const botMessage = {
        uid: user.uid,
        text: botResponseText,
        role: 'assistant' as const,
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, 'users', user.uid, 'messages'), botMessage);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, messagesPath);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollegeSelect = (college: College) => {
        setSelectedCollege(college);
        const messagesPath = `users/${user.uid}/messages`;
        const botMessage = {
            uid: user.uid,
            text: `You have selected ${college.name}. How can I help you with this college?`,
            role: 'assistant' as const,
            createdAt: serverTimestamp()
        };
        try {
          addDoc(collection(db, 'users', user.uid, 'messages'), botMessage);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, messagesPath);
        }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          Telangana College AI Chatbot
        </h1>
        <div className="flex items-center space-x-4">
          <span className="hidden sm:block">Welcome, {user.name}!</span>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        <div className="md:w-80 flex-none flex flex-col space-y-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select a College
                </label>
                 <div className="flex items-start space-x-2">
                    <div className="flex-grow min-w-0">
                         <CollegeSelector 
                            colleges={TELANGANA_COLLEGES} 
                            selectedCollege={selectedCollege} 
                            onSelect={handleCollegeSelect} 
                        />
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        disabled={!selectedCollege}
                        className="flex-shrink-0 flex items-center justify-center px-4 py-2 mt-[1px] text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors h-[42px] shadow-sm ml-2"
                        title="View College Details"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="hidden sm:inline">Details</span>
                    </button>
                </div>
            </div>
            {selectedCollege && (
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow animate-fade-in overflow-hidden">
                    <div className="flex items-center space-x-3 mb-3">
                        {selectedCollege.logo && (
                            <img src={selectedCollege.logo} alt={`${selectedCollege.name} logo`} className="w-10 h-10 rounded-full object-cover flex-shrink-0"/>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight truncate">{selectedCollege.name}</h3>
                    </div>
                    
                    <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex justify-between items-center">
                            <span className="font-medium">Ranking:</span>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-xs font-bold text-right ml-2">
                                {selectedCollege.ranking}
                            </span>
                        </li>
                         <li className="flex flex-col text-left">
                            <span className="font-medium mb-1">Admission via:</span>
                            <p className="text-xs italic text-gray-600 dark:text-gray-400">
                                {selectedCollege.admissionProcess.split('.')[0]}.
                            </p>
                        </li>
                        {selectedCollege.placements && (
                            <>
                                <li className="flex justify-between items-center">
                                    <span className="font-medium">Placement Rate:</span>
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedCollege.placements.placementRate}</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="font-medium">Average Package:</span>
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedCollege.placements.averagePackage}</span>
                                </li>
                                <li className="flex flex-col">
                                    <span className="font-medium mb-2">Top Recruiters:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCollege.placements.topRecruiters.map((recruiter, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full text-xs font-medium">
                                                {recruiter}
                                            </span>
                                        ))}
                                    </div>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>

        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden min-w-0">
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                 {msg.role === 'assistant' && <BotIcon className="w-8 h-8 text-indigo-500 flex-shrink-0" />}
                <div className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
                 {msg.role === 'user' && <UserIcon className="w-8 h-8 text-gray-500 flex-shrink-0" />}
              </div>
            ))}
            {isLoading && (
               <div className="flex items-start gap-3">
                    <BotIcon className="w-8 h-8 text-indigo-500" />
                    <div className="max-w-xs px-4 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask about courses, syllabus, etc..."
                className="flex-1 w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !userInput.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </button>
            </div>
          </form>
        </div>
      </main>
      {isModalOpen && selectedCollege && (
        <CollegeDetailsModal college={selectedCollege} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};
