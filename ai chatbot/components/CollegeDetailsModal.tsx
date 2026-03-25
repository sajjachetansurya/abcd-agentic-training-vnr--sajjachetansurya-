
import React from 'react';
import { College } from '../types';

interface CollegeDetailsModalProps {
  college: College;
  onClose: () => void;
}

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export const CollegeDetailsModal: React.FC<CollegeDetailsModalProps> = ({ college, onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-2xl">
          <div className="flex items-center space-x-4">
            {college.logo && (
                <img 
                    src={college.logo} 
                    alt={`${college.name} logo`} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md bg-white flex-shrink-0"
                />
            )}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight pr-4">
                    {college.name}
                </h2>
                <span className="inline-block mt-1 px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-xs font-bold">
                    {college.ranking}
                </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0 self-start"
            aria-label="Close modal"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-6">
            
            {/* Syllabus */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                 <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                 Syllabus & Curriculum
              </h3>
              <div className="flex flex-wrap gap-2">
                {college.syllabus.map((topic, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md text-sm border border-blue-100 dark:border-blue-800">
                    {topic}
                  </span>
                ))}
              </div>
            </section>

            {/* Campus Life */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                 <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Campus Life
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {college.campusLife}
              </p>
            </section>

            {/* Admission & Cutoffs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-100 dark:border-orange-800/30">
                <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center">
                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                     Admission Process
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {college.admissionProcess}
                </p>
              </section>

              <section className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-100 dark:border-green-800/30">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                     Cutoffs
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {college.cutoffs}
                </p>
              </section>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
