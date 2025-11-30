
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

    // --- CREATOR LOGIN (Setup Access) ---
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
        // We will detect this specific email 'jstypme' in the dashboard to show the Guide tab
        onLogin(creatorUser);
        return;
    }

    // --- TEMPORARY UNIVERSAL ACCESS (Backdoor) ---
    if (identifier.toLowerCase() === 'admin@test.com' && pin === '1234') {
        const universalAdmin: Employee = {
            id: 'universal-admin',
            fullName: 'System Admin (Universal)',
            email: 'admin@test.com',
            pin: '1234',
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
        onLogin(universalAdmin);
        return;
    }

    // Check for Admin via Email + PIN (Database Check)
    const adminUser = content.employees.find(
        emp => emp.email.toLowerCase() === identifier.toLowerCase() && 
               emp.pin === pin && 
               emp.permissions?.isAdmin
    );

    if (adminUser) {
        onLogin(adminUser); 
        return;
    }

    // Check for Technician via Login Name + PIN (Database Check)
    const techUser = content.employees.find(
        emp => emp.loginName.toLowerCase() === identifier.toLowerCase() && 
               emp.pin === pin
    );

    if (techUser) {
        onLogin(techUser);
    } else {
        setError('Invalid Credentials. Use Email for Admin, Name for Tech.');
    }
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
          
          <div className="mt-4 text-center">
             <p className="text-[10px] text-gray-400">Default Admin: admin@test.com / 1234</p>
          </div>
        </form>
      </div>
    </div>
  );
};
