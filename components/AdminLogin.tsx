
import React, { useState } from 'react';
import { Lock, User, Briefcase, ChevronRight, CheckCircle, Shield } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { Employee, ClientUser } from '../types';

interface AdminLoginProps {
  onLogin: (loggedInUser: Employee | ClientUser | null, type: 'employee' | 'client') => void; 
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
  const { content } = useContent();
  const [mode, setMode] = useState<'staff' | 'client'>('staff'); // Toggle state
  
  const [identifier, setIdentifier] = useState(''); // Email or Name
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 

    if (!identifier || !pin) {
        setError("Please enter all fields");
        return;
    }

    if (mode === 'staff') {
        // --- STAFF LOGIN LOGIC ---

        // Universal Test
        if (identifier === 'TEST' && pin === '1234') {
             const universalAdmin: Employee = {
                id: 'universal-test-admin',
                fullName: 'Test Admin',
                email: 'test@admin.com',
                pin: '1234',
                loginName: 'TEST',
                jobTitle: 'System Administrator',
                tel: '',
                idNumber: '',
                startDate: new Date().toISOString(),
                profileImage: null,
                documents: [],
                doctorsNumbers: [],
                permissions: { isAdmin: true, canDoAssessment: true, canCreateQuotes: true, canExecuteJob: true, canInvoice: true, canViewReports: true, canManageEmployees: true, canEditSiteContent: true }
            };
            onLogin(universalAdmin, 'employee');
            return;
        }

        // Creator Login
        if (identifier.toLowerCase() === 'jstypme' && pin === '1723') {
            const creatorUser: Employee = {
                id: 'creator-admin',
                fullName: 'Creator (System Architect)',
                email: 'jstypme',
                pin: '1723',
                loginName: 'jstypme',
                jobTitle: 'Site Architect',
                tel: '',
                idNumber: '',
                startDate: new Date().toISOString(),
                profileImage: null,
                documents: [],
                doctorsNumbers: [],
                permissions: { isAdmin: true, canDoAssessment: true, canCreateQuotes: true, canExecuteJob: true, canInvoice: true, canViewReports: true, canManageEmployees: true, canEditSiteContent: true }
            };
            onLogin(creatorUser, 'employee');
            return;
        }

        // DB Check
        const dbUser = content.employees.find(e => 
            (e.email && e.email.toLowerCase() === identifier.toLowerCase()) || 
            (e.loginName && e.loginName.toLowerCase() === identifier.toLowerCase())
        );

        if (dbUser) {
            if (dbUser.pin === pin) {
                onLogin(dbUser, 'employee');
                return;
            } else {
                setError('Invalid Staff Credentials.');
                return;
            }
        }

        // Fallback
        const envEmail = (import.meta as any).env.VITE_ADMIN_EMAIL || 'propesthunters@gmail.com';
        const envPin = (import.meta as any).env.VITE_ADMIN_PIN || '2025';
        if (identifier.toLowerCase() === envEmail.toLowerCase() && pin === envPin) {
             const recoveryAdmin: Employee = {
                id: 'recovery-admin',
                fullName: 'Master Admin (Recovery)',
                email: envEmail,
                pin: envPin,
                loginName: 'admin',
                jobTitle: 'System Administrator',
                tel: '',
                idNumber: '',
                startDate: new Date().toISOString(),
                profileImage: null,
                documents: [],
                doctorsNumbers: [],
                permissions: { isAdmin: true, canDoAssessment: true, canCreateQuotes: true, canExecuteJob: true, canInvoice: true, canViewReports: true, canManageEmployees: true, canEditSiteContent: true }
            };
            onLogin(recoveryAdmin, 'employee');
            return;
        }
        
        setError('Invalid Staff Credentials.');

    } else {
        // --- CLIENT LOGIN LOGIC ---
        const clientUser = content.clientUsers.find(c => c.email.toLowerCase() === identifier.toLowerCase());
        
        if (clientUser) {
            if (clientUser.pin === pin) {
                onLogin(clientUser, 'client');
                return;
            } else {
                setError('Invalid Password.');
                return;
            }
        }
        setError('Client account not found.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-pestBrown/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-pestStone w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
        
        {/* Toggle Header */}
        <div className="flex bg-black/20 p-1 rounded-xl mb-8 relative">
            <div className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow-md transition-all duration-300 ${mode === 'client' ? 'left-[calc(50%-4px)] translate-x-1' : 'left-1'}`}></div>
            <button 
                onClick={() => setMode('staff')} 
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold relative z-10 transition-colors ${mode === 'staff' ? 'text-pestBrown' : 'text-gray-400 hover:text-white'}`}
            >
                <Shield size={16}/> Staff Access
            </button>
            <button 
                onClick={() => setMode('client')} 
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold relative z-10 transition-colors ${mode === 'client' ? 'text-pestBrown' : 'text-gray-400 hover:text-white'}`}
            >
                <Briefcase size={16}/> Client Portal
            </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors ${mode === 'staff' ? 'bg-pestGreen/20 text-pestGreen' : 'bg-blue-500/20 text-blue-500'}`}>
            {mode === 'staff' ? <Lock size={32} /> : <User size={32} />}
          </div>
          <h2 className="text-2xl font-black text-pestBrown uppercase tracking-tight">
              {mode === 'staff' ? 'System Login' : 'Client Dashboard'}
          </h2>
          <p className="text-gray-500 text-sm font-medium">
              {mode === 'staff' ? 'Enter staff credentials' : 'Log in to view your jobs & quotes'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                {mode === 'staff' ? 'Username or Email' : 'Email Address'}
            </label>
            <div className="relative">
                <input 
                type={mode === 'client' ? 'email' : 'text'} 
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="w-full pl-10 p-4 border-2 border-transparent bg-pestLight rounded-xl focus:outline-none focus:border-pestGreen text-pestBrown font-medium placeholder-gray-400 transition-all"
                placeholder={mode === 'staff' ? 'admin' : 'name@example.com'}
                autoFocus
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                {mode === 'staff' ? 'PIN Code' : 'Password'}
            </label>
             <div className="relative">
                <input 
                type="password" 
                value={pin}
                onChange={e => setPin(e.target.value)}
                className="w-full pl-10 p-4 border-2 border-transparent bg-pestLight rounded-xl focus:outline-none focus:border-pestGreen text-pestBrown font-medium placeholder-gray-400 transition-all"
                placeholder="******"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          
          {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl border border-red-100 animate-pulse">
                  <span className="block w-2 h-2 bg-red-500 rounded-full"></span> {error}
              </div>
          )}

          <div className="flex gap-4 mt-8">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 py-4 text-gray-500 hover:bg-gray-200 rounded-xl font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`flex-1 py-4 text-white rounded-xl font-bold shadow-xl hover:shadow-none hover:translate-y-1 transition-all flex items-center justify-center gap-2
                ${mode === 'staff' ? 'bg-pestGreen hover:bg-pestDarkGreen' : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              Access Portal <ChevronRight size={18}/>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
