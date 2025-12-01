
import React, { useState } from 'react';
import { Lock, User, Mail } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { Employee } from '../types';

interface AdminLoginProps {
  onLogin: (loggedInEmployee: Employee | null) => void; // null for admin, Employee object for employee
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
  const { content } = useContent();
  const [identifier, setIdentifier] = useState(''); // Can be Name or Email
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 

    if (!identifier || !pin) {
        setError("Please enter all fields");
        return;
    }

    // --- UNIVERSAL FALLBACK (Test Access) ---
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
            permissions: {
                isAdmin: true,
                canDoAssessment: true,
                canCreateQuotes: true,
                canExecuteJob: true,
                canInvoice: true,
                canViewReports: true,
                canManageEmployees: true,
                canEditSiteContent: true
            }
        };
        onLogin(universalAdmin);
        return;
    }

    // --- CREATOR LOGIN (System Access) ---
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
            permissions: {
                isAdmin: true,
                canDoAssessment: true,
                canCreateQuotes: true,
                canExecuteJob: true,
                canInvoice: true,
                canViewReports: true,
                canManageEmployees: true,
                canEditSiteContent: true
            }
        };
        onLogin(creatorUser);
        return;
    }

    // --- CREDENTIAL CHECK LOGIC ---
    
    // 1. Get Environment Variable Defaults (Fallback Only)
    const envEmail = (import.meta as any).env.VITE_ADMIN_EMAIL || 'propesthunters@gmail.com';
    const envPin = (import.meta as any).env.VITE_ADMIN_PIN || '2025';

    // 2. Check Database for matching User (by email or login name)
    // We prioritize the database record. If the user exists in DB, we MUST use the DB pin.
    const dbUser = content.employees.find(e => 
        (e.email && e.email.toLowerCase() === identifier.toLowerCase()) || 
        (e.loginName && e.loginName.toLowerCase() === identifier.toLowerCase())
    );

    if (dbUser) {
        // User found in DB. Validate PIN against DB record.
        if (dbUser.pin === pin) {
            onLogin(dbUser);
            return;
        } else {
            // User exists but PIN is wrong.
            // SECURITY: Do NOT allow Env Var override if the user exists in DB. 
            // This ensures that if 'Ruaan' changed his PIN in dashboard, '2025' stops working.
            setError('Invalid Credentials.');
            return;
        }
    }

    // 3. Fallback: Master Admin (Only if user NOT found in DB)
    // This allows initial login/recovery if the database is empty or the admin user was deleted.
    if (identifier.toLowerCase() === envEmail.toLowerCase() && pin === envPin) {
         console.warn("Using Environment Fallback Credentials. User not found in DB.");
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
            permissions: {
                isAdmin: true,
                canDoAssessment: true,
                canCreateQuotes: true,
                canExecuteJob: true,
                canInvoice: true,
                canViewReports: true,
                canManageEmployees: true,
                canEditSiteContent: true
            }
        };
        onLogin(recoveryAdmin);
        return;
    }

    // 4. No match found
    setError('Invalid Credentials.');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-pestBrown/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-pestStone w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-pestGreen/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-pestGreen" />
          </div>
          <h2 className="text-2xl font-bold text-pestBrown">System Access</h2>
          <p className="text-gray-500 text-sm">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Email (Admin) or Name (Tech)
            </label>
            <div className="relative">
                <input 
                type="text" 
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pestGreen bg-pestLight text-pestBrown"
                placeholder="Enter login name"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">PIN Code</label>
             <div className="relative">
                <input 
                type="password" 
                value={pin}
                onChange={e => setPin(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pestGreen bg-pestLight text-pestBrown"
                placeholder="Enter 4-digit PIN"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center font-semibold bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>}

          <div className="flex gap-4 mt-6">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 py-3 text-gray-500 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-pestGreen text-white rounded-lg font-bold shadow-lg hover:bg-pestDarkGreen transition-colors"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
