
import React, { useState, useEffect } from 'react';
import { User } from './types';
import { Dashboard } from './components/Dashboard';
import { AuthForm, Input, Button, Select } from './components/AuthForm';
import { Confetti } from './components/Confetti';
import { CryptoService } from './services/cryptoService';
import { DBService, UserDBRecord } from './services/dbService';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authPage, setAuthPage] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      // Theme
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      if (savedTheme) setTheme(savedTheme);

      // Session Check
      const session = DBService.getSession();
      if (session && session.expiry > Date.now()) {
        const users = DBService.getUsers();
        const user = users.find(u => u.id === session.userId);
        if (user) {
          setCurrentUser(user);
        } else {
          DBService.clearSession();
        }
      } else {
        DBService.clearSession();
      }
      setIsCheckingSession(false);
    };
    init();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    const user = DBService.findUserByUsername(username);
    if (!user) return false;

    const hashedPassword = await CryptoService.hashPassword(password, user.salt);
    if (user.passwordHash === hashedPassword) {
      const token = CryptoService.generateToken();
      DBService.setSession(token, user.id);
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleRegister = async (data: any): Promise<boolean> => {
    if (DBService.findUserByUsername(data.username)) return false;

    const salt = CryptoService.generateSalt();
    const passwordHash = await CryptoService.hashPassword(data.password, salt);

    const newUser: UserDBRecord = {
      ...data,
      id: Date.now().toString(),
      passwordHash,
      salt
    };

    DBService.saveUser(newUser);
    return true;
  };

  const handleResetPassword = async (username: string, newPassword: string): Promise<boolean> => {
    const user = DBService.findUserByUsername(username);
    if (!user) return false;

    const salt = CryptoService.generateSalt();
    const passwordHash = await CryptoService.hashPassword(newPassword, salt);
    
    DBService.updateUser({ ...user, passwordHash, salt });
    return true;
  };

  const handleLogout = () => {
    DBService.clearSession();
    setCurrentUser(null);
    setAuthPage('login');
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    if (authPage === 'forgotPassword') {
      return <ForgotPasswordPage onReset={handleResetPassword} onSwitchToLogin={() => setAuthPage('login')} />;
    }
    return authPage === 'login' ? (
      <LoginPage 
        onLogin={handleLogin} 
        onSwitchToRegister={() => setAuthPage('register')}
        onForgotPassword={() => setAuthPage('forgotPassword')}
        initialError={sessionError}
      />
    ) : (
      <RegisterPage onRegister={handleRegister} onSwitchToLogin={() => setAuthPage('login')} />
    );
  }

  return <Dashboard user={currentUser} onLogout={handleLogout} theme={theme} setTheme={setTheme} />;
};

// Sub-components (LoginPage, RegisterPage, ForgotPasswordPage) refactored for security

const LoginPage: React.FC<any> = ({ onLogin, onSwitchToRegister, onForgotPassword, initialError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await onLogin(username, password);
    setIsLoading(false);
    if (!success) setError('Invalid credentials.');
  };

  return (
    <AuthForm title="Sign In" subtitle="Welcome back" onSubmit={handleSubmit} isLoading={isLoading} error={error} actions={
      <><Button variant="text" type="button" onClick={onSwitchToRegister}>Create Account</Button><Button type="submit">Login</Button></>
    }>
      <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <div>
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="button" onClick={onForgotPassword} className="text-xs text-blue-600 mt-2">Forgot Password?</button>
      </div>
    </AuthForm>
  );
};

const RegisterPage: React.FC<any> = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', username: '', password: '', mobile: '', gender: '', dob: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const validatePassword = (pass: string) => pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(formData.password)) {
      setError('Password must be 8+ characters with an uppercase letter and a number.');
      return;
    }
    setIsLoading(true);
    const success = await onRegister(formData);
    setIsLoading(false);
    if (success) {
      setShowConfetti(true);
      setTimeout(onSwitchToLogin, 2500);
    } else {
      setError('Username already exists.');
    }
  };

  return (
    <>
      {showConfetti && <Confetti />}
      <AuthForm title="Register" subtitle="Secure your account" onSubmit={handleSubmit} isLoading={isLoading} error={error} actions={
        <><Button variant="text" type="button" onClick={onSwitchToLogin}>Sign In Instead</Button><Button type="submit">Register</Button></>
      }>
        <Input label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        <Input label="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
        <Input label="Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
        <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
      </AuthForm>
    </>
  );
};

const ForgotPasswordPage: React.FC<any> = ({ onReset, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (DBService.findUserByUsername(username)) setStep(2);
    else setError('User not found.');
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onReset(username, newPassword);
    if (success) onSwitchToLogin();
    else setError('Reset failed.');
  };

  return step === 1 ? (
    <AuthForm title="Recover" subtitle="Verify identity" onSubmit={handleNext} error={error} actions={<Button type="submit">Next</Button>}>
      <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
    </AuthForm>
  ) : (
    <AuthForm title="New Password" subtitle="Update security" onSubmit={handleReset} error={error} actions={<Button type="submit">Reset</Button>}>
      <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
    </AuthForm>
  );
};

export default App;
