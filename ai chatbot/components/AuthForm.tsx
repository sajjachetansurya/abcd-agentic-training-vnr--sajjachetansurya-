
import React from 'react';

interface AuthFormProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  actions: React.ReactNode;
  isLoading?: boolean;
  error?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({ title, subtitle, children, onSubmit, actions, isLoading, error }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#121212] font-sans transition-colors duration-300 p-4">
      <div className="w-full max-w-[450px] bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-md p-8 md:p-12 transform transition-all duration-300 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        
        {/* Loading Progress Bar */}
        {isLoading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div className="h-full bg-blue-600 animate-progress"></div>
            </div>
        )}

        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-2xl font-normal text-gray-900 dark:text-gray-100">{title}</h1>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-5">
            {children}
          </div>
          
          {error && (
            <div className="flex items-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md animate-fade-in">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
            </div>
          )}

          <div className="pt-6 flex items-center justify-between gap-4">
             {actions}
          </div>
        </form>
      </div>
      
      <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
          <span className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">English (United States)</span>
          <span className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">Help</span>
          <span className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">Privacy</span>
          <span className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">Terms</span>
      </div>

      <style>{`
        @keyframes progress {
            0% { width: 0%; margin-left: 0%; }
            50% { width: 40%; margin-left: 30%; }
            100% { width: 100%; margin-left: 100%; }
        }
        .animate-progress {
            animation: progress 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => {
    // Generate a random ID if none provided to link label and input
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
        <div className="relative group">
            <input
                id={inputId}
                {...props}
                placeholder=" "
                className="block px-3 pb-2.5 pt-4 w-full text-base text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer border"
            />
            <label
                htmlFor={inputId}
                className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-[#1e1e1e] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-text pointer-events-none"
            >
                {label}
            </label>
        </div>
    );
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
    <div className="relative group">
        <label className="absolute -top-2 left-3 bg-white dark:bg-[#1e1e1e] px-1 text-xs text-blue-600 dark:text-blue-500 z-10">{label}</label>
        <select
            {...props}
            className="w-full px-3 py-3 text-base text-gray-900 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-600 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-600 dark:focus:border-blue-500 appearance-none"
        >
            {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
    </div>
);


export const Button: React.FC<{ children: React.ReactNode, type?: "button" | "submit" | "reset", onClick?: () => void, disabled?: boolean, variant?: 'primary' | 'text' }> = ({ children, variant = 'primary', ...props }) => {
    if (variant === 'text') {
        return (
            <button
                {...props}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none rounded px-2 py-1 transition-colors"
            >
                {children}
            </button>
        );
    }
    
    return (
        <button
            {...props}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full shadow-sm hover:shadow-md transition-all disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
            {children}
        </button>
    );
};
