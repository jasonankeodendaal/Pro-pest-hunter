

import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { 
    Save, Image as ImageIcon, X, Plus, Trash2, LogOut, CheckCircle, 
    Layout, Info, Briefcase, Star, List, MapPin, Shield, Megaphone, 
    Phone, Settings, Globe, Clock, Eye, EyeOff, MoveUp, MoveDown,
    BarChart3, Users, Calendar, AlertCircle, Search, ChevronRight, Video, Youtube, Image,
    User, HardHat, Mail, PhoneCall, Cake, Lock, FileText, Stethoscope, Heart, Clipboard, PlusCircle, Building2,
    MessageSquare, HelpCircle, MousePointerClick, FilePlus, PenTool, DollarSign, Download, Camera, ScanLine, Hash,
    Printer, CheckSquare, FileCheck, ArrowRightCircle, Send, ToggleLeft, ToggleRight,
    CreditCard, Bug, QrCode, FileStack, Edit, BookOpen, Workflow, Server, Cloud, Link, Circle, Code2, Terminal, Copy, Palette, Upload, Zap, Database, RotateCcw, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Employee, AdminMainTab, AdminSubTab } from '../types';
import { Input, TextArea, Select, FileUpload } from './ui/AdminShared';
import { JobCardManager } from './JobCardManager';

// --- HELPER COMPONENTS ---

const InfoBlock = ({ title, text }: { title: string; text: string }) => (
  <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-start gap-4 shadow-sm">
      <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 shrink-0 mt-0.5">
        <Info size={20} />
      </div>
      <div>
        <h4 className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
            {title}
        </h4>
        <p className="text-blue-100/80 text-xs leading-relaxed font-medium tracking-wide">
            {text}
        </p>
      </div>
  </div>
);

const SectionHelp = ({ title, purpose, steps, tips }: { title: string; purpose: string; steps: string[]; tips?: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="ml-3 p-1 text-gray-500 hover:text-pestGreen hover:bg-pestGreen/10 rounded-full transition-all"
                title="Help & Instructions"
            >
                <HelpCircle size={16} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#161817] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="bg-pestGreen p-4 flex justify-between items-center">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2"><BookOpen size={20}/> {title} Guide</h3>
                                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1 rounded-full"><X size={18}/></button>
                            </div>
                            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div>
                                    <h4 className="text-pestGreen text-xs font-bold uppercase tracking-wider mb-2">Why This Matters (Purpose)</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-white/10 pl-3">{purpose}</p>
                                </div>
                                <div>
                                    <h4 className="text-pestGreen text-xs font-bold uppercase tracking-wider mb-2">Step-by-Step Instructions</h4>
                                    <ul className="space-y-4">
                                        {steps.map((step, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-400">
                                                <span className="bg-white/5 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0 border border-white/10">{i+1}</span>
                                                <span className="leading-snug">{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {tips && (
                                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                                        <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Zap size={12}/> Pro Strategy Tip</h4>
                                        <p className="text-blue-200/70 text-xs italic">"{tips}"</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

// --- DEPLOYMENT GUIDE (CREATOR ONLY) ---
const DeploymentGuide = () => {
    const { apiUrl, setApiUrl } = useContent();
    const [tempUrl, setTempUrl] = useState(apiUrl);

    return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
         <div className="bg-[#161817] border border-pestGreen/30 rounded-2xl p-8 relative overflow-hidden">
             {/* Header */}
             <div className="absolute -top-10 -right-10 w-64 h-64 bg-pestGreen/10 rounded-full blur-3xl"></div>
             <div className="flex items-center gap-4 mb-8 relative z-10">
                 <div className="w-20 h-20 bg-pestGreen rounded-2xl flex items-center justify-center shadow-neon shrink-0">
                     <Code2 size={40} className="text-white" />
                 </div>
                 <div>
                     <h2 className="text-4xl font-black text-white leading-tight">Deployment Master Class</h2>
                     <p className="text-gray-400 text-lg">The comprehensive, beginner-friendly guide to going live.</p>
                 </div>
             </div>
             
             {/* LIVE CONNECTION TOOL */}
             <div className="bg-gray-900 border border-pestGreen p-6 rounded-2xl mb-12 relative z-20 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-pestGreen/20 rounded-lg text-pestGreen animate-pulse">
                        <Wifi size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Live API Connection</h3>
                        <p className="text-gray-400 text-xs">Enter your deployed server URL here to connect the dashboard.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full relative">
                        <input 
                            type="text" 
                            value={tempUrl} 
                            onChange={(e) => setTempUrl(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pestGreen outline-none font-mono text-sm"
                            placeholder="https://your-api.onrender.com" 
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full ${apiUrl.includes('localhost') ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                             <span className="text-[10px] uppercase font-bold text-gray-500">{apiUrl.includes('localhost') ? 'Local' : 'Live'}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setApiUrl(tempUrl)} 
                        className="w-full md:w-auto bg-pestGreen hover:bg-white hover:text-pestGreen text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        <Server size={18} /> Connect & Reload
                    </button>
                </div>
             </div>

             {/* INTRO */}
             <div className="prose prose-invert max-w-none mb-12">
                <p className="text-gray-300 text-lg leading-relaxed">
                    Welcome, Architect. You are about to move your application from a "local simulation" to the real internet. 
                    This requires setting up two separate servers: one for the <strong>Brain</strong> (Backend) and one for the <strong>Face</strong> (Frontend).
                </p>
             </div>
             
             {/* STEP 1 */}
             <div className="space-y-12 relative z-10">
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Server size={100}/></div>
                    <h3 className="text-2xl font-bold text-pestGreen mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pestGreen text-white text-sm font-bold">1</span>
                        Prerequisites (The Luggage)
                    </h3>
                    <div className="space-y-4 pl-4 border-l-2 border-white/10">
                        <p className="text-gray-300">Before we fly, ensure you have these accounts ready. They all offer free tiers.</p>
                        <ul className="list-disc list-inside text-gray-400 space-y-2">
                            <li><strong className="text-white">GitHub Account:</strong> To store your code.</li>
                            <li><strong className="text-white">Render.com Account:</strong> To host the Backend (Server).</li>
                            <li><strong className="text-white">Vercel.com Account:</strong> To host the Frontend (Website).</li>
                        </ul>
                        <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl mt-4">
                            <h4 className="text-blue-400 font-bold text-sm flex items-center gap-2 mb-2"><Info size={16}/> The "Split Stack" Concept</h4>
                            <p className="text-xs text-blue-200/70">
                                Beginners often ask: "Why two hosts?"<br/>
                                1. <strong>Backend (Node.js):</strong> Needs a server that runs 24/7 to process logins and data. Vercel cannot do this easily.<br/>
                                2. <strong>Frontend (React):</strong> Is just static files. Vercel is the fastest in the world at serving these.
                            </p>
                        </div>
                    </div>
                </div>

                {/* STEP 2 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-orange-400 mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-400 text-black text-sm font-bold">2</span>
                        Deploying the Backend (Render)
                    </h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <h4 className="text-white font-bold mb-2">A. Create the Service</h4>
                                <ol className="list-decimal list-inside text-sm text-gray-400 space-y-2">
                                    <li>Log in to <strong>Render.com</strong>.</li>
                                    <li>Click <strong>New +</strong> -> <strong>Web Service</strong>.</li>
                                    <li>Connect your GitHub repository.</li>
                                    <li>Give it a name (e.g., <code className="text-orange-300">propest-backend</code>).</li>
                                </ol>
                             </div>
                             <div>
                                <h4 className="text-white font-bold mb-2">B. Configure Settings</h4>
                                <p className="text-xs text-gray-500 mb-2">Copy these exactly. Case sensitive.</p>
                                <ul className="space-y-2 text-sm bg-black/40 p-4 rounded-xl border border-white/10 font-mono">
                                    <li className="flex justify-between"><span>Runtime:</span> <span className="text-green-400">Node</span></li>
                                    <li className="flex justify-between"><span>Build Command:</span> <span className="text-green-400">npm install</span></li>
                                    <li className="flex justify-between"><span>Start Command:</span> <span className="text-green-400">node server.js</span></li>
                                </ul>
                             </div>
                        </div>

                        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl">
                            <h4 className="text-orange-400 font-bold text-sm mb-2">C. Environment Variables</h4>
                            <p className="text-xs text-gray-400 mb-2">Scroll down to "Environment Variables" and add these keys:</p>
                            <div className="space-y-2 font-mono text-xs">
                                <div className="flex gap-4 border-b border-white/5 pb-1">
                                    <span className="text-orange-300 w-32">GMAIL_USER</span>
                                    <span className="text-gray-500">your-email@gmail.com</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-orange-300 w-32">GMAIL_PASS</span>
                                    <span className="text-gray-500">your-app-password (Not your normal password!)</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button className="bg-orange-500 text-black font-bold px-4 py-2 rounded-lg text-sm w-full md:w-auto">
                                Click "Create Web Service" on Render
                            </button>
                            <p className="text-xs text-gray-500 mt-2">Wait 2-3 minutes. Once it says "Live", copy the URL (e.g., <code>https://propest-backend.onrender.com</code>). You need this for the next step.</p>
                        </div>
                    </div>
                </div>

                {/* STEP 3 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-400 text-black text-sm font-bold">3</span>
                        Deploying the Frontend (Vercel)
                    </h3>
                    <div className="space-y-6">
                         <div>
                            <h4 className="text-white font-bold mb-2">A. Import Project</h4>
                            <ol className="list-decimal list-inside text-sm text-gray-400 space-y-2">
                                <li>Log in to <strong>Vercel.com</strong>.</li>
                                <li>Click <strong>Add New...</strong> -> <strong>Project</strong>.</li>
                                <li>Select the SAME GitHub repository as before.</li>
                                <li>Framework Preset: Vercel usually detects <strong>Vite</strong> automatically. If not, select it.</li>
                            </ol>
                         </div>

                         <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl">
                            <h4 className="text-purple-300 font-bold text-sm mb-2">B. The Critical Connection</h4>
                            <p className="text-xs text-gray-300 mb-3">
                                This is where beginners fail. You must tell the frontend where the backend lives.
                            </p>
                            <div className="bg-black/40 p-3 rounded-lg border border-purple-500/30">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Environment Variable Name</p>
                                <p className="text-green-400 font-mono text-sm mb-3">VITE_API_URL</p>
                                
                                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Value (Example)</p>
                                <p className="text-blue-300 font-mono text-sm mb-1">https://propest-backend.onrender.com</p>
                                <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">DO NOT ADD A TRAILING SLASH ( / ) AT THE END!</p>
                            </div>
                        </div>

                         <div>
                            <button className="bg-purple-500 text-white font-bold px-4 py-2 rounded-lg text-sm w-full md:w-auto">
                                Click "Deploy" on Vercel
                            </button>
                        </div>
                    </div>
                </div>

                {/* STEP 4 */}
                <div className="bg-red-900/10 border border-red-500/30 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-400 text-black text-sm font-bold"><AlertCircle size={20}/></span>
                        The "Data Wipe" Warning & Solutions
                    </h3>
                    <div className="text-sm text-gray-300 space-y-6">
                        <div>
                            <p>
                                By default, this app uses <strong>SQLite</strong> (a file-based database).
                                Cloud services like Render Free Tier treat the file system as "Ephemeral" (Temporary).
                            </p>
                            <div className="bg-black/40 p-4 rounded-xl border border-red-500/20 mt-2">
                                <strong className="text-white block mb-2">What this means:</strong>
                                <ul className="list-disc list-inside space-y-1 text-gray-400">
                                    <li>Every time you deploy new code... <strong>The database resets.</strong></li>
                                    <li>If the free server "sleeps" due to inactivity... <strong>The database resets.</strong></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-6">
                            <h4 className="text-lg font-bold text-white mb-4">Choose Your Solution:</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <h5 className="font-bold text-white mb-2">Option A: Paid Render Disk (Easy)</h5>
                                    <p className="text-xs text-gray-400 mb-2">Upgrade Render to "Starter" plan ($7/mo) and attach a Persistent Disk. No code changes needed.</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <h5 className="font-bold text-white mb-2">Option B: Free Demo Mode</h5>
                                    <p className="text-xs text-gray-400 mb-2">Accept that data wipes. Good for showing the client, bad for actual use.</p>
                                </div>
                            </div>

                            {/* OPTION C - SUPABASE */}
                            <div className="mt-6 bg-green-900/10 border border-green-500/30 p-6 rounded-xl">
                                <h5 className="font-bold text-green-400 text-lg mb-4 flex items-center gap-2">
                                    <Database size={20} /> Option C (Advanced): External Database (Supabase)
                                </h5>
                                <p className="text-sm text-gray-300 mb-4">
                                    The server code has been updated to support PostgreSQL! If you provide a connection string, it will automatically switch from SQLite to Postgres.
                                </p>
                                <ol className="list-decimal list-inside space-y-3 text-sm text-gray-400">
                                    <li>Go to <strong>Supabase.com</strong> and create a free project.</li>
                                    <li>Go to Project Settings -> Database -> Connection String (Node.js).</li>
                                    <li>It looks like: <code>postgres://postgres.user:pass@host:5432/postgres</code></li>
                                    <li>Copy this string (replace the password placeholder with your actual DB password).</li>
                                    <li>Go to <strong>Render Dashboard</strong> -> Your Web Service -> Environment Variables.</li>
                                    <li>Add a new variable:
                                        <div className="bg-black/40 p-2 rounded border border-green-500/20 mt-1 font-mono text-green-300">
                                            Key: DATABASE_URL<br/>
                                            Value: [Paste your Supabase string here]
                                        </div>
                                    </li>
                                    <li><strong>Important:</strong> You must add <code>"pg": "^8.11.0"</code> to your <code>package.json</code> dependencies manually in GitHub, or run <code>npm install pg</code> locally and push.</li>
                                </ol>
                            </div>

                            {/* OPTION D - VPS/PM2 */}
                            <div className="mt-6 bg-cyan-900/10 border border-cyan-500/30 p-6 rounded-xl">
                                <h5 className="font-bold text-cyan-400 text-lg mb-4 flex items-center gap-2">
                                    <Terminal size={20} /> Option D (Expert): The "Forever" Server (VPS + PM2)
                                </h5>
                                <p className="text-sm text-gray-300 mb-4">
                                   This is for users who want to keep using <strong>SQLite</strong> but want data to persist. 
                                   You will rent a small server ($5/mo), giving you full control over the file system.
                                </p>
                                <div className="space-y-4">
                                     {/* Step 1 */}
                                     <div>
                                        <strong className="text-white text-sm block mb-1">1. Get a VPS (Ubuntu)</strong>
                                        <p className="text-xs text-gray-400">Rent a small Ubuntu server from DigitalOcean, Hetzner, or Linode. You'll get an IP address.</p>
                                     </div>
                                     {/* Step 2 */}
                                     <div>
                                        <strong className="text-white text-sm block mb-1">2. Install Node.js & PM2 (Process Manager)</strong>
                                        <div className="bg-black/40 p-3 rounded border border-cyan-500/20 font-mono text-xs text-cyan-300">
                                            sudo apt update<br/>
                                            sudo apt install nodejs npm<br/>
                                            sudo npm install -g pm2
                                        </div>
                                     </div>
                                     {/* Step 3 */}
                                     <div>
                                        <strong className="text-white text-sm block mb-1">3. Deploy & Run</strong>
                                        <p className="text-xs text-gray-400 mb-2">Clone your repo onto the VPS, install dependencies, then use PM2 to keep the server alive forever:</p>
                                        <code className="bg-black/40 px-2 py-1 rounded text-cyan-300 text-xs">pm2 start server.js --name "api"</code>
                                        <p className="text-xs text-gray-500 mt-1">PM2 automatically restarts the app if it crashes. Your SQLite file stays safe on the disk.</p>
                                     </div>
                                     {/* Step 4 */}
                                     <div>
                                        <strong className="text-white text-sm block mb-1">4. Cloudflare (The Security Layer)</strong>
                                        <p className="text-xs text-gray-400">
                                            Don't expose your IP directly. Create a <strong>Cloudflare Account</strong>.<br/>
                                            Go to DNS -> Add Record -> Type: <strong>A</strong>, Name: <strong>api</strong>, Content: <strong>[Your VPS IP]</strong>.<br/>
                                            Set SSL/TLS mode to "Flexible". Your API URL is now <code>https://api.yourdomain.com</code>.
                                        </p>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

             </div>
         </div>
    </div>
    );
};

const SystemGuide = () => {
    const { apiUrl, resetSystem, clearSystem, downloadBackup, restoreBackup } = useContent();
    const [confirmClear, setConfirmClear] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            if (window.confirm("WARNING: This will overwrite ALL current data with the backup file. Are you sure?")) {
                const success = await restoreBackup(e.target.files[0]);
                if (success) alert("System restored successfully.");
                else alert("Restore failed. Check file format.");
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* SETUP & STATUS SECTION */}
            <div className="bg-[#161817] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
                 <div className="relative z-10">
                     <SectionHeader 
                        title="System Status" 
                        icon={Server} 
                        help={{ 
                            title: "System Dashboard", 
                            purpose: "This is your mission control. It shows if the website is connected to the database and allows you to save your data.", 
                            steps: [
                                "Status Light: Ensure the green light is pulsing. This means the server is online.",
                                "Backups: Before making big changes, always click 'Download Full Backup'. This saves a file to your computer.",
                                "Restore: If you make a mistake, upload that file to 'Restore' to go back in time."
                            ], 
                            tips: "Download a backup once a week to ensure you never lose client data." 
                        }} 
                    />

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                         <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                             <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Link size={16} className="text-pestGreen"/> Connection Status</h4>
                             <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex items-center justify-between mb-2">
                                <code className="text-xs text-pestGreen font-mono break-all">{apiUrl}</code>
                                <div className="w-2 h-2 bg-pestGreen rounded-full animate-pulse shadow-neon"></div>
                             </div>
                             <p className="text-[10px] text-gray-500">Connected via {apiUrl.includes('localhost') ? 'Local Environment' : 'Live Remote Server'}</p>
                         </div>
                     </div>
                     
                     {/* BACKUP & RESTORE SECTION */}
                     <div className="border-t border-white/10 pt-8 mb-8">
                         <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Cloud size={20} className="text-blue-400"/> Data Backup & Restore
                         </h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl">
                                <h4 className="font-bold text-blue-100 mb-2">Create Backup</h4>
                                <p className="text-xs text-gray-400 mb-4">Download a JSON snapshot of the entire database (Employees, Jobs, Settings).</p>
                                <button onClick={downloadBackup} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors w-full justify-center">
                                    <Download size={16} /> Download Full Backup
                                </button>
                            </div>
                            
                            <div className="bg-purple-500/5 border border-purple-500/20 p-6 rounded-2xl">
                                <h4 className="font-bold text-purple-100 mb-2">Restore Backup</h4>
                                <p className="text-xs text-gray-400 mb-4">Upload a previously saved JSON backup file to overwrite current data.</p>
                                <button onClick={() => fileInputRef.current?.click()} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors w-full justify-center">
                                    <Upload size={16} /> Restore from File
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleRestore} accept=".json" className="hidden" />
                            </div>
                         </div>
                     </div>

                     <div className="border-t border-white/10 pt-8">
                         <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Database size={20} className="text-red-400"/> Data Management (Danger Zone)
                         </h3>
                         <div className="flex gap-4 items-center flex-wrap">
                             <button 
                                onClick={() => { if(window.confirm("This will replace all current data with a fresh set of Pro Pest Hunters mock data. Continue?")) resetSystem(); }}
                                className="bg-pestGreen/20 hover:bg-pestGreen text-pestGreen hover:text-white border border-pestGreen/50 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                             >
                                 <RotateCcw size={18} /> Load Mock Data
                             </button>
                             
                             {!confirmClear ? (
                                <button 
                                    onClick={() => setConfirmClear(true)}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                                >
                                    <Trash2 size={18} /> Delete All Data
                                </button>
                             ) : (
                                 <div className="flex items-center gap-2 animate-in fade-in">
                                     <span className="text-red-400 text-xs font-bold uppercase mr-2">Are you sure? This cannot be undone.</span>
                                     <button onClick={() => { clearSystem(); setConfirmClear(false); }} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Yes, Nuke It</button>
                                     <button onClick={() => setConfirmClear(false)} className="bg-white/10 text-white px-4 py-2 rounded-lg font-bold text-sm">Cancel</button>
                                 </div>
                             )}
                         </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

const SectionHeader = ({ title, icon: Icon, help }: { title: string; icon: any; help?: { title: string, purpose: string, steps: string[], tips?: string } }) => (
  <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-pestGreen/10 rounded-lg text-pestGreen">
        <Icon size={20} />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {help && <SectionHelp {...help} />}
      </div>
  </div>
);

const IconPickerModal = ({ onClose, onSelect }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
    const icons = Object.keys(Icons).filter((k: string) => (k as string).toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#161817] w-full max-w-2xl h-[80vh] rounded-2xl flex flex-col border border-white/10 shadow-2xl">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">Select Icon</h3>
                    <button onClick={onClose}><X className="text-gray-500 hover:text-white" /></button>
                </div>
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search icons (e.g. 'Shield', 'Bug')..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 p-3 bg-[#0f1110] border border-white/10 rounded-xl text-white focus:border-pestGreen outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-6 gap-4 content-start scrollbar-thin">
                    {icons.slice(0, 100).map(iconName => {
                         const Icon = (Icons as any)[iconName];
                         return (
                             <button 
                                key={iconName}
                                onClick={() => onSelect(iconName)}
                                className="flex flex-col items-center gap-2 p-3 hover:bg-white/5 rounded-xl transition-colors group"
                             >
                                 <Icon className="text-gray-400 group-hover:text-pestGreen" />
                                 <span className="text-[10px] text-gray-500 truncate w-full text-center group-hover:text-white">{iconName}</span>
                             </button>
                         )
                    })}
                </div>
            </div>
        </div>
    );
};

const EmployeeEditModal = ({ employee, onSave, onClose, canDelete, onDelete, isSelfEdit }: any) => {
    const [data, setData] = useState<Employee>(employee);
    
    const handleChange = (field: keyof Employee, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handlePermissionChange = (field: keyof Employee['permissions'], value: boolean) => {
        setData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [field]: value
            }
        }));
    };

    return (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#161817] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 p-6 scrollbar-thin shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-white">{employee.id ? 'Edit Profile' : 'New Employee'}</h3>
                    <button onClick={onClose}><X className="text-gray-500 hover:text-white" /></button>
                </div>
                
                <div className="space-y-6">
                    {!isSelfEdit && (
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <h4 className="text-pestGreen font-bold mb-4 flex items-center gap-2"><Lock size={16}/> System Permissions</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={data.permissions?.isAdmin || false} onChange={(e) => handlePermissionChange('isAdmin', e.target.checked)} className="accent-pestGreen" />
                                    <span className="text-sm text-white font-bold">Admin Access (Full Control)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={data.permissions?.canExecuteJob || false} onChange={(e) => handlePermissionChange('canExecuteJob', e.target.checked)} className="accent-pestGreen" />
                                    <span className="text-sm text-white font-bold">Technician (Can Execute Jobs)</span>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Full Name" value={data.fullName} onChange={(v: string) => handleChange('fullName', v)} />
                        <Input label="Job Title" value={data.jobTitle} onChange={(v: string) => handleChange('jobTitle', v)} />
                        <Input label="Email" value={data.email} onChange={(v: string) => handleChange('email', v)} />
                        <Input label="Phone" value={data.tel} onChange={(v: string) => handleChange('tel', v)} />
                        <Input label="Login Name" value={data.loginName} onChange={(v: string) => handleChange('loginName', v)} />
                        <Input label="PIN Code" value={data.pin} onChange={(v: string) => handleChange('pin', v)} />
                    </div>
                    
                    <FileUpload 
                        label="Profile Image" 
                        value={data.profileImage} 
                        onChange={(v: string) => handleChange('profileImage', v)} 
                        onClear={() => handleChange('profileImage', null)}
                    />

                     <div className="flex gap-4 pt-6 border-t border-white/10">
                         {canDelete && !isSelfEdit && employee.id && (
                             <button onClick={() => { onDelete(employee.id); onClose(); }} className="px-4 py-3 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500/20"><Trash2 size={18} /></button>
                         )}
                         <div className="flex-1 flex gap-4 justify-end">
                             <button onClick={onClose} className="px-6 py-3 text-gray-400 hover:text-white font-bold">Cancel</button>
                             <button onClick={() => onSave(data)} className="px-8 py-3 bg-pestGreen text-white rounded-xl font-bold hover:bg-pestDarkGreen transition-all shadow-lg">Save Profile</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface AdminDashboardProps {
  onLogout: () => void;
  loggedInUser: Employee | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, loggedInUser }) => {
  const { 
      content, updateContent, updateService, updateWhyChooseUsItems, 
      updateProcessSteps, updateAboutItems, addEmployee, updateEmployee, deleteEmployee,
      updateLocations, updateFaqs, updateBooking, addJobCard, updateJobCard, deleteJobCard
  } = useContent();
  
  const isAdmin = loggedInUser === null || loggedInUser.permissions?.isAdmin;
  const isCreator = loggedInUser?.email === 'jstypme';

  const permissions = loggedInUser ? loggedInUser.permissions : { isAdmin: true, canEditSiteContent: true, canManageEmployees: true, canDoAssessment: true, canCreateQuotes: true, canExecuteJob: true, canInvoice: true, canViewReports: true };

  const [mainTab, setMainTab] = useState<AdminMainTab>(isAdmin ? 'siteContent' : 'bookings');
  const [subTab, setSubTab] = useState<AdminSubTab | 'deploymentGuide' | 'creatorSettings'>(isCreator ? 'deploymentGuide' : (isAdmin ? 'systemGuide' : 'jobs'));
  const [iconPickerOpen, setIconPickerOpen] = useState<{isOpen: boolean, callback: (name: string) => void} | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const siteContentSubTabs = [
    ...(isCreator ? [
        { id: 'deploymentGuide', label: 'Creator Deployment', icon: Code2 },
        { id: 'creatorSettings', label: 'Creator Widget', icon: Palette }
    ] : []),
    { id: 'systemGuide', label: 'System Guide', icon: BookOpen },
    { id: 'company', label: 'Company Info', icon: Briefcase },
    { id: 'locations', label: 'Locations / Shops', icon: Building2 },
    { id: 'hero', label: 'Hero Banner', icon: Star },
    { id: 'about', label: 'About & Story', icon: Info },
    { id: 'services', label: 'Service Catalog', icon: List },
    { id: 'whyChooseUs', label: 'Why Choose Us', icon: CheckCircle },
    { id: 'process', label: 'Process Workflow', icon: Layout },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'serviceArea', label: 'Service Area Map', icon: MapPin },
    { id: 'safety', label: 'Safety & Compliance', icon: Shield },
    { id: 'inquiriesContact', label: 'Inquiries & Contact', icon: Phone },
    { id: 'seo', label: 'SEO & Meta', icon: Globe },
  ];
  
  const employeeSubTabs = [{ id: 'employeeDirectory', label: 'Directory', icon: User }];
  const bookingSubTabs = [{ id: 'inquiries', label: 'Inquiries & Online Quotes', icon: MessageSquare }, { id: 'jobs', label: 'Job Workflow', icon: Clipboard }];
  
  const handleOpenIconPicker = (callback: (name: string) => void) => { setIconPickerOpen({ isOpen: true, callback }); };
  const handleSaveEmployee = (employee: Employee) => { 
      if(content.employees.find(e => e.id === employee.id)) updateEmployee(employee.id, employee);
      else addEmployee({ ...employee, id: Date.now().toString() });
      setEditingEmployee(null); 
  };
  const handleDeleteEmployee = (id: string) => { deleteEmployee(id); };
  
  // Generic update Helpers
  const updateItem = <T extends Record<string, any>>(items: T[], updateFn: (items: T[]) => void, index: number, field: keyof T, value: any) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      updateFn(newItems);
  };
  const deleteItem = <T extends any>(items: T[], updateFn: (items: T[]) => void, index: number) => {
      const newItems = items.filter((_, i) => i !== index);
      updateFn(newItems);
  };
  const addItem = <T extends any>(items: T[], updateFn: (items: T[]) => void, newItem: T) => {
      updateFn([...items, newItem]);
  }

  // --- MANUAL SAVE HANDLER ---
  const handleSaveCurrentTab = () => {
    // Re-trigger update to ensure persistence (even though auto-save exists)
    // This satisfies user request for a manual "Save" confirmation
    switch(subTab) {
        case 'company': updateContent('company', content.company); break;
        case 'hero': updateContent('hero', content.hero); break;
        case 'about': updateContent('about', content.about); break;
        case 'serviceArea': updateContent('serviceArea', content.serviceArea); break;
        case 'safety': updateContent('safety', content.safety); break;
        case 'inquiriesContact': updateContent('contact', content.contact); break;
        case 'seo': updateContent('seo', content.seo); break;
        case 'creatorSettings': updateContent('creatorWidget', content.creatorWidget); break;
        
        case 'locations': updateLocations(content.locations); break;
        case 'services': updateService(content.services); break;
        case 'whyChooseUs': updateWhyChooseUsItems(content.whyChooseUs.items); break;
        case 'process': updateProcessSteps(content.process.steps); break;
        case 'faq': updateFaqs(content.faqs); break;
    }
    
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const SavePageButton = () => (
    <div className="mt-8 flex justify-end border-t border-white/10 pt-6">
        <button 
            onClick={handleSaveCurrentTab}
            className="bg-pestGreen hover:bg-pestDarkGreen text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
        >
            <Save size={20} /> Save Changes
        </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[90] bg-[#0f1110] flex font-sans overflow-hidden selection:bg-pestGreen selection:text-white text-gray-300">
      <aside className="w-64 bg-[#161817] border-r border-white/5 flex-shrink-0 flex flex-col">
          {/* Sidebar Header */}
         <div className="p-6 border-b border-white/5">
             <div className="flex items-center gap-3 mb-1">
                 <div className="w-8 h-8 bg-pestGreen rounded-lg flex items-center justify-center shadow-neon">
                    <Settings className="text-white w-5 h-5" />
                 </div>
                 <h1 className="font-black text-lg uppercase tracking-wider text-white leading-none">
                    Pro<span className="text-pestGreen">Admin</span>
                 </h1>
             </div>
             <p className="text-gray-500 uppercase tracking-widest ml-11" style={{ fontSize: '9px' }}>
                 {isCreator ? "Architect Mode" : (isAdmin ? "Control Panel v2.1" : `Tech: ${loggedInUser?.fullName.split(' ')[0] || 'Guest'}`)}
             </p>
         </div>
         {/* Sidebar Tabs */}
         <div className="flex-1 overflow-y-auto py-4 space-y-2 px-3 scrollbar-thin">
             {/* Site Content Group */}
             <div className="mb-2">
                <button
                    onClick={() => {
                        if(permissions.canEditSiteContent) {
                            setMainTab('siteContent');
                            if (mainTab !== 'siteContent') setSubTab(isCreator ? 'deploymentGuide' : 'systemGuide');
                        }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl font-bold transition-all group ${mainTab === 'siteContent' ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <div className="flex items-center gap-3"><Layout size={18} className={mainTab === 'siteContent' ? 'text-pestGreen' : ''} /> <span>Site Content</span></div>
                    <ChevronRight size={14} className={`transition-transform duration-300 ${mainTab === 'siteContent' ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                    {mainTab === 'siteContent' && permissions.canEditSiteContent && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4 space-y-1 mt-1">
                            {siteContentSubTabs.map(tab => (
                                <button key={tab.id} onClick={() => setSubTab(tab.id as any)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-all rounded-xl ${subTab === tab.id ? 'text-white bg-pestGreen/10 border border-pestGreen/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                                    <tab.icon size={14} /> {tab.label}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>
             {/* Bookings & Jobs Group */}
             <div className="mb-2">
                <button onClick={() => { setMainTab('bookings'); if (mainTab !== 'bookings') setSubTab('jobs'); }} className={`w-full flex items-center justify-between px-3 py-3 rounded-xl font-bold transition-all group ${mainTab === 'bookings' ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`} disabled={!permissions.canViewReports}>
                    <div className="flex items-center gap-3"><Clipboard size={18} className={mainTab === 'bookings' ? 'text-pestGreen' : ''} /> <span>Bookings & Jobs</span></div>
                    <ChevronRight size={14} className={`transition-transform duration-300 ${mainTab === 'bookings' ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                    {mainTab === 'bookings' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4 space-y-1 mt-1">
                            {bookingSubTabs.map(tab => (
                                <button key={tab.id} onClick={() => setSubTab(tab.id as any)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-all rounded-xl ${subTab === tab.id ? 'text-white bg-pestGreen/10 border border-pestGreen/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                                    <tab.icon size={14} /> {tab.label}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>
             {/* Employees Group */}
             <div>
                <button onClick={() => { if(permissions.canManageEmployees) { setMainTab('employees'); if (mainTab !== 'employees') setSubTab('employeeDirectory'); } }} className={`w-full flex items-center justify-between px-3 py-3 rounded-xl font-bold transition-all group ${mainTab === 'employees' ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`} disabled={!permissions.canManageEmployees}>
                    <div className="flex items-center gap-3"><Users size={18} className={mainTab === 'employees' ? 'text-pestGreen' : ''} /> <span>Employees</span></div>
                    <ChevronRight size={14} className={`transition-transform duration-300 ${mainTab === 'employees' ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                    {mainTab === 'employees' && permissions.canManageEmployees && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4 space-y-1 mt-1">
                            {employeeSubTabs.map(tab => (
                                <button key={tab.id} onClick={() => setSubTab(tab.id as any)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-all rounded-xl ${subTab === tab.id ? 'text-white bg-pestGreen/10 border border-pestGreen/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                                    <tab.icon size={14} /> {tab.label}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>
         </div>
         <div className="p-4 border-t border-white/5">
            <button onClick={onLogout} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-red-500/20"><LogOut size={14} /> Logout Session</button>
         </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#0f1110]">
         <header className="h-16 border-b border-white/5 bg-[#0f1110] flex items-center px-8 flex-shrink-0 z-20 justify-between">
             <div className="flex items-center gap-2 text-gray-400 text-sm">
                 <span className="opacity-50 font-medium">Admin Panel</span>
                 <ChevronRight size={14} />
                 <span className="text-white font-bold bg-white/5 px-3 py-1 rounded-lg">
                    {subTab}
                 </span>
             </div>
             {loggedInUser && ( 
                 <div className="flex items-center gap-3">
                     <div className="text-right"><p className="text-white font-bold text-sm">{loggedInUser.fullName}</p><p className="text-pestGreen text-xs uppercase">{loggedInUser.jobTitle}</p></div>
                     <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">{loggedInUser.profileImage ? <img src={loggedInUser.profileImage} className="w-full h-full rounded-full object-cover"/> : <User size={20} className="text-white"/>}</div>
                 </div>
             )}
         </header>

         <div className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-thin">
            <AnimatePresence mode="wait">
                <motion.div key={subTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="max-w-6xl mx-auto pb-20">
                    
                    {/* CREATOR GUIDE */}
                    {subTab === 'deploymentGuide' && isCreator && <DeploymentGuide />}

                    {/* CREATOR SETTINGS */}
                    {subTab === 'creatorSettings' && isCreator && (
                        <div className="space-y-6">
                            <InfoBlock title="Architect Settings" text="Customize the floating widget." />
                            <SectionHeader title="Creator Widget" icon={Palette} />
                            <div className="bg-[#161817] border border-white/5 rounded-2xl p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FileUpload label="Creator Logo" value={content.creatorWidget.logo} onChange={(v: string) => updateContent('creatorWidget', { logo: v })} onClear={() => updateContent('creatorWidget', { logo: '' })} />
                                    <FileUpload label="Background Image" value={content.creatorWidget.background} onChange={(v: string) => updateContent('creatorWidget', { background: v })} onClear={() => updateContent('creatorWidget', { background: '' })} />
                                    <Input label="Slogan" value={content.creatorWidget.slogan} onChange={(v: string) => updateContent('creatorWidget', { slogan: v })} />
                                    <Input label="Call to Action" value={content.creatorWidget.ctaText} onChange={(v: string) => updateContent('creatorWidget', { ctaText: v })} />
                                    <FileUpload label="WhatsApp Icon" value={content.creatorWidget.whatsappIcon} onChange={(v: string) => updateContent('creatorWidget', { whatsappIcon: v })} onClear={() => updateContent('creatorWidget', { whatsappIcon: '' })} />
                                    <FileUpload label="Email Icon" value={content.creatorWidget.emailIcon} onChange={(v: string) => updateContent('creatorWidget', { emailIcon: v })} onClear={() => updateContent('creatorWidget', { emailIcon: '' })} />
                                </div>
                                <SavePageButton />
                            </div>
                        </div>
                    )}

                    {/* SITE CONTENT TABS */}
                    {permissions.canEditSiteContent && mainTab === 'siteContent' && (
                        <>
                            {subTab === 'systemGuide' && <SystemGuide />}
                            
                            {subTab === 'company' && (
                                <div className="space-y-6">
                                    <SectionHeader 
                                        title="Company Info" 
                                        icon={Briefcase} 
                                        help={{ 
                                            title: "Company Information", 
                                            purpose: "This information forms the core identity of your digital presence. It appears in the website header, footer, official invoices, and search engine results. Accuracy here is critical for legal compliance and customer trust.", 
                                            steps: [
                                                "Fill in your legal entity name (e.g., Pty Ltd) for invoices.",
                                                "Add VAT and Reg numbers so your corporate clients can claim back tax.",
                                                "Upload a high-resolution logo (Transparent PNG works best).",
                                                "Set the email address where you want to receive new job leads."
                                            ],
                                            tips: "Your contact email is the most important field here. Ensure it is an address you check daily."
                                        }} 
                                    />
                                    <div className="bg-[#161817] border border-white/5 rounded-2xl p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input label="Name" value={content.company.name} onChange={(v: string) => updateContent('company', { name: v })} />
                                            <Input label="Reg Number" value={content.company.regNumber} onChange={(v: string) => updateContent('company', { regNumber: v })} />
                                            <Input label="VAT Number" value={content.company.vatNumber} onChange={(v: string) => updateContent('company', { vatNumber: v })} />
                                            <Input label="Phone" value={content.company.phone} onChange={(v: string) => updateContent('company', { phone: v })} />
                                            <Input label="Email" value={content.company.email} onChange={(v: string) => updateContent('company', { email: v })} />
                                            <TextArea label="Address" value={content.company.address} onChange={(v: string) => updateContent('company', { address: v })} />
                                            <FileUpload label="Company Logo" value={content.company.logo} onChange={(v: string) => updateContent('company', { logo: v })} onClear={() => updateContent('company', { logo: null })} />
                                        </div>
                                        <SavePageButton />
                                    </div>
                                </div>
                            )}

                            {subTab === 'locations' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <SectionHeader 
                                            title="Locations / Shops" 
                                            icon={Building2} 
                                            help={{ 
                                                title: "Location Management", 
                                                purpose: "Clients search for local businesses. Displaying your physical presence in White River, Nelspruit, etc., builds massive trust and improves Local SEO rankings.", 
                                                steps: [
                                                    "Click 'Add Location' to create a new branch entry.",
                                                    "Mark one location as 'Head Office' (this will be highlighted).",
                                                    "Upload a photo of the shop front so clients recognize it.",
                                                    "Ensure phone numbers are correct for that specific branch."
                                                ], 
                                                tips: "If you don't have a shop front, use a high-quality photo of your branded vehicle in that area." 
                                            }} 
                                        />
                                        <button onClick={() => updateLocations([...content.locations, { id: Date.now().toString(), name: 'New Shop', address: '', phone: '', email: '', isHeadOffice: false, image: null }])} className="bg-pestGreen text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={14}/> Add Location</button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        {content.locations.map((loc, idx) => (
                                            <div key={loc.id} className="bg-[#161817] border border-white/5 rounded-2xl p-6 relative">
                                                <button onClick={() => deleteItem(content.locations, updateLocations, idx)} className="absolute top-4 right-4 text-red-500 hover:bg-white/5 p-2 rounded-lg"><Trash2 size={16}/></button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <Input label="Location Name" value={loc.name} onChange={(v: string) => updateItem(content.locations, updateLocations, idx, 'name', v)} />
                                                    <Input label="Address" value={loc.address} onChange={(v: string) => updateItem(content.locations, updateLocations, idx, 'address', v)} />
                                                    <Input label="Phone" value={loc.phone} onChange={(v: string) => updateItem(content.locations, updateLocations, idx, 'phone', v)} />
                                                    <Input label="Email" value={loc.email} onChange={(v: string) => updateItem(content.locations, updateLocations, idx, 'email', v)} />
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer text-white font-bold text-sm"><input type="checkbox" checked={loc.isHeadOffice} onChange={(e) => updateItem(content.locations, updateLocations, idx, 'isHeadOffice', e.target.checked)} className="accent-pestGreen" /> Is Head Office?</label>
                                                </div>
                                                <div className="mt-4"><FileUpload label="Shop Image" value={loc.image} onChange={(v: string) => updateItem(content.locations, updateLocations, idx, 'image', v)} onClear={() => updateItem(content.locations, updateLocations, idx, 'image', null)} /></div>
                                            </div>
                                        ))}
                                    </div>
                                    <SavePageButton />
                                </div>
                            )}

                            {subTab === 'hero' && (
                                <div className="space-y-6">
                                    <SectionHeader 
                                        title="Hero Banner" 
                                        icon={Star} 
                                        help={{ 
                                            title: "Hero Section", 
                                            purpose: "This is the very first thing people see. It determines if they stay or leave. A video background has been proven to increase time-on-site by over 40%.", 
                                            steps: [
                                                "Headline: Keep it under 6 words. Focus on the result (e.g. 'Pest Free').",
                                                "Video: Upload a landscape MP4 video. It should be high quality but not too large (under 20MB is best for speed).",
                                                "Button Text: Use action words like 'Get Quote' or 'Book Now'."
                                            ], 
                                            tips: "If you don't have a video, use a high-quality image of a technician working. Avoid generic stock photos if possible." 
                                        }} 
                                    />
                                    <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 space-y-6">
                                        <Input label="Headline" value={content.hero.headline} onChange={(v: string) => updateContent('hero', { headline: v })} />
                                        <Input label="Subheadline" value={content.hero.subheadline} onChange={(v: string) => updateContent('hero', { subheadline: v })} />
                                        <Input label="Button Text" value={content.hero.buttonText} onChange={(v: string) => updateContent('hero', { buttonText: v })} />
                                        <FileUpload label="Background Image (Fallback)" value={content.hero.bgImage} onChange={(v: string) => updateContent('hero', { bgImage: v })} onClear={() => updateContent('hero', { bgImage: null })} />
                                        <FileUpload 
                                            label="Hero Video (MP4)" 
                                            value={content.hero.mediaVideo} 
                                            onChange={(v: string) => updateContent('hero', { mediaVideo: v })} 
                                            onClear={() => updateContent('hero', { mediaVideo: null })} 
                                            accept="video/mp4,video/webm,video/quicktime"
                                        />
                                        <SavePageButton />
                                    </div>
                                </div>
                            )}

                            {subTab === 'about' && (
                                <div className="space-y-6">
                                    <SectionHeader 
                                        title="About Us" 
                                        icon={Info} 
                                        help={{ 
                                            title: "About Section", 
                                            purpose: "Clients hire people, not logos. This section builds the emotional connection and establishes your authority in the Lowveld.", 
                                            steps: [
                                                "Title: Make it punchy (e.g., 'Protecting Homes Since 2006').",
                                                "Text: Tell your story. Mention your experience and your local roots.",
                                                "Owner Image: A photo of the owner or the team is mandatory for trust."
                                            ], 
                                            tips: "Mentioning specific local areas (like White River or Nelspruit) in your story helps with SEO." 
                                        }} 
                                    />
                                    <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 space-y-4">
                                        <Input label="Title" value={content.about.title} onChange={(v: string) => updateContent('about', { title: v })} />
                                        <TextArea label="Story Text" value={content.about.text} onChange={(v: string) => updateContent('about', { text: v })} />
                                        <Input label="Mission Title" value={content.about.missionTitle} onChange={(v: string) => updateContent('about', { missionTitle: v })} />
                                        <TextArea label="Mission Text" value={content.about.missionText} onChange={(v: string) => updateContent('about', { missionText: v })} rows={2} />
                                        <FileUpload label="Owner Image" value={content.about.ownerImage} onChange={(v: string) => updateContent('about', { ownerImage: v })} onClear={() => updateContent('about', { ownerImage: null })} />
                                        <SavePageButton />
                                    </div>
                                </div>
                            )}

                            {subTab === 'services' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <SectionHeader 
                                            title="Services" 
                                            icon={List} 
                                            help={{ 
                                                title: "Service Catalog", 
                                                purpose: "This is your menu. It defines what you sell and how much it costs. Clear services reduce unnecessary phone calls.", 
                                                steps: [
                                                    "Title: Use standard terms people search for (e.g., 'Termite Control').",
                                                    "Short Desc: 1 sentence summary for the card view.",
                                                    "Full Desc: Detailed explanation for the pop-up panel.",
                                                    "Price: 'From R850' or 'Quote on Request'. Transparency filters out cheap leads."
                                                ], 
                                                tips: "Mark your most profitable services as 'Featured' to put them at the top of the list." 
                                            }} 
                                        />
                                        <button onClick={() => updateService([...content.services, { id: Date.now().toString(), title: 'New Service', description: 'Brief', fullDescription: 'Full details...', details: [], iconName: 'Bug', visible: true, featured: false, price: 'Quote', image: null }])} className="bg-pestGreen text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={14}/> Add Service</button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        {content.services.map((service, idx) => (
                                            <div key={service.id} className="bg-[#161817] border border-white/5 rounded-2xl p-6 relative">
                                                <button onClick={() => deleteItem(content.services, updateService, idx)} className="absolute top-4 right-4 text-red-500 hover:bg-white/5 p-2 rounded-lg"><Trash2 size={16}/></button>
                                                <div className="flex gap-4 mb-2">
                                                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10" onClick={() => handleOpenIconPicker((name) => updateItem(content.services, updateService, idx, 'iconName', name))}>{(Icons as any)[service.iconName] ? React.createElement((Icons as any)[service.iconName]) : <Bug />}</div>
                                                    <div className="flex-1"><Input label="Service Title" value={service.title} onChange={(v: string) => updateItem(content.services, updateService, idx, 'title', v)} /></div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 mb-2">
                                                    <Input label="Price" value={service.price} onChange={(v: string) => updateItem(content.services, updateService, idx, 'price', v)} />
                                                    <div className="flex items-center pt-6"><label className="flex items-center gap-2 text-white font-bold text-xs"><input type="checkbox" checked={service.visible} onChange={(e) => updateItem(content.services, updateService, idx, 'visible', e.target.checked)} /> Visible</label><label className="flex items-center gap-2 text-white font-bold text-xs ml-4"><input type="checkbox" checked={service.featured} onChange={(e) => updateItem(content.services, updateService, idx, 'featured', e.target.checked)} /> Featured</label></div>
                                                </div>
                                                <TextArea label="Short Desc" value={service.description} onChange={(v: string) => updateItem(content.services, updateService, idx, 'description', v)} rows={2} />
                                                <TextArea label="Full Desc" value={service.fullDescription} onChange={(v: string) => updateItem(content.services, updateService, idx, 'fullDescription', v)} rows={4} />
                                                
                                                {/* Details List Manager */}
                                                <div className="mt-4">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Bullet Points</label>
                                                    <div className="space-y-2">
                                                        {(service.details || []).map((det, dIdx) => (
                                                            <div key={dIdx} className="flex gap-2">
                                                                <input type="text" value={det} onChange={(e) => {
                                                                    const newDetails = [...(service.details || [])];
                                                                    newDetails[dIdx] = e.target.value;
                                                                    updateItem(content.services, updateService, idx, 'details', newDetails);
                                                                }} className="flex-1 bg-black/20 border border-white/10 rounded p-2 text-sm text-white" />
                                                                <button onClick={() => {
                                                                    const newDetails = [...(service.details || [])].filter((_, i) => i !== dIdx);
                                                                    updateItem(content.services, updateService, idx, 'details', newDetails);
                                                                }} className="text-red-500 hover:bg-white/5 p-2 rounded"><X size={14}/></button>
                                                            </div>
                                                        ))}
                                                        <button onClick={() => {
                                                            const newDetails = [...(service.details || []), "New Point"];
                                                            updateItem(content.services, updateService, idx, 'details', newDetails);
                                                        }} className="text-xs text-pestGreen font-bold flex items-center gap-1">+ Add Point</button>
                                                    </div>
                                                </div>

                                                <div className="mt-4"><FileUpload label="Service Image" value={service.image} onChange={(v: string) => updateItem(content.services, updateService, idx, 'image', v)} onClear={() => updateItem(content.services, updateService, idx, 'image', null)} /></div>
                                            </div>
                                        ))}
                                    </div>
                                    <SavePageButton />
                                </div>
                            )}

                            {subTab === 'whyChooseUs' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <SectionHeader 
                                            title="Why Choose Us" 
                                            icon={CheckCircle} 
                                            help={{ 
                                                title: "Value Proposition", 
                                                purpose: "This section answers the question: 'Why should I pick you instead of the other guy?'. It closes the deal.", 
                                                steps: [
                                                    "Title: Short and punchy (e.g. 'Pet Safe').",
                                                    "Text: One sentence explanation.",
                                                    "Icons: Choose icons that visually represent the benefit."
                                                ], 
                                                tips: "Focus on pain points: Safety, Speed, and Price." 
                                            }} 
                                        />
                                        <button onClick={() => addItem(content.whyChooseUs.items, updateWhyChooseUsItems, { title: 'New Reason', text: 'Explanation', iconName: 'Star' })} className="bg-pestGreen text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={14}/> Add Item</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-full bg-[#161817] p-4 rounded-xl border border-white/5"><Input label="Section Title" value={content.whyChooseUs.title} onChange={(v: string) => updateContent('whyChooseUs', { title: v })} /></div>
                                        {content.whyChooseUs.items.map((item, idx) => (
                                            <div key={idx} className="bg-[#161817] border border-white/5 rounded-2xl p-6 relative">
                                                <button onClick={() => deleteItem(content.whyChooseUs.items, updateWhyChooseUsItems, idx)} className="absolute top-2 right-2 text-red-500 hover:bg-white/5 p-1 rounded"><Trash2 size={14}/></button>
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center cursor-pointer" onClick={() => handleOpenIconPicker((name) => updateItem(content.whyChooseUs.items, updateWhyChooseUsItems, idx, 'iconName', name))}>{(Icons as any)[item.iconName] ? React.createElement((Icons as any)[item.iconName]) : <Star />}</div>
                                                    <div className="flex-1"><Input label="Title" value={item.title} onChange={(v: string) => updateItem(content.whyChooseUs.items, updateWhyChooseUsItems, idx, 'title', v)} /></div>
                                                </div>
                                                <TextArea label="Text" value={item.text} onChange={(v: string) => updateItem(content.whyChooseUs.items, updateWhyChooseUsItems, idx, 'text', v)} rows={2} />
                                            </div>
                                        ))}
                                    </div>
                                    <SavePageButton />
                                </div>
                            )}

                            {subTab === 'process' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <SectionHeader 
                                            title="Process Workflow" 
                                            icon={Layout} 
                                            help={{ 
                                                title: "Our Process", 
                                                purpose: "Clients are often anxious about strangers coming into their home. This section explains the workflow to put them at ease.", 
                                                steps: [
                                                    "Step 1: Always 'Inspection' or 'Contact'.",
                                                    "Step 2: 'Treatment Plan'.",
                                                    "Step 3: 'Execution'.",
                                                    "Step 4: 'Aftercare' or 'Prevention'."
                                                ], 
                                                tips: "Keep descriptions brief. The goal is to show organization and professionalism." 
                                            }} 
                                        />
                                        <button onClick={() => addItem(content.process.steps, updateProcessSteps, { step: content.process.steps.length + 1, title: 'Step', description: 'Desc', iconName: 'Zap' })} className="bg-pestGreen text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={14}/> Add Step</button>
                                    </div>
                                    <div className="space-y-4">
                                        {content.process.steps.map((step, idx) => (
                                            <div key={idx} className="bg-[#161817] border border-white/5 rounded-2xl p-4 flex gap-4 items-center relative">
                                                <button onClick={() => deleteItem(content.process.steps, updateProcessSteps, idx)} className="absolute top-2 right-2 text-red-500"><Trash2 size={14}/></button>
                                                <div className="text-2xl font-black text-white/20">#{step.step}</div>
                                                <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center cursor-pointer shrink-0" onClick={() => handleOpenIconPicker((name) => updateItem(content.process.steps, updateProcessSteps, idx, 'iconName', name))}>{(Icons as any)[step.iconName] ? React.createElement((Icons as any)[step.iconName]) : <Zap />}</div>
                                                <div className="flex-1 space-y-2">
                                                    <Input label="Title" value={step.title} onChange={(v: string) => updateItem(content.process.steps, updateProcessSteps, idx, 'title', v)} />
                                                    <Input label="Description" value={step.description} onChange={(v: string) => updateItem(content.process.steps, updateProcessSteps, idx, 'description', v)} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <SavePageButton />
                                </div>
                            )}

                            {subTab === 'faq' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <SectionHeader 
                                            title="FAQ" 
                                            icon={HelpCircle} 
                                            help={{ 
                                                title: "Frequently Asked Questions", 
                                                purpose: "Answer questions before they are asked. This saves you time on the phone.", 
                                                steps: [
                                                    "Q: Is it safe for pets? (Crucial question)",
                                                    "Q: How long does it take?",
                                                    "Q: Do I need to leave the house?",
                                                    "Q: Is there a guarantee?"
                                                ], 
                                                tips: "Address 'Safety' and 'Cost' in the first two questions." 
                                            }} 
                                        />
                                        <button onClick={() => updateFaqs([...content.faqs, { id: Date.now().toString(), question: 'Question?', answer: 'Answer.' }])} className="bg-pestGreen text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={14}/> Add FAQ</button>
                                    </div>
                                    {content.faqs.map((faq, idx) => (
                                        <div key={faq.id} className="bg-[#161817] border border-white/5 rounded-2xl p-6 relative">
                                            <button onClick={() => deleteItem(content.faqs, updateFaqs, idx)} className="absolute top-4 right-4 text-red-500"><Trash2 size={16}/></button>
                                            <Input label="Question" value={faq.question} onChange={(v: string) => updateItem(content.faqs, updateFaqs, idx, 'question', v)} />
                                            <div className="mt-2"><TextArea label="Answer" value={faq.answer} onChange={(v: string) => updateItem(content.faqs, updateFaqs, idx, 'answer', v)} rows={2} /></div>
                                        </div>
                                    ))}
                                    <SavePageButton />
                                </div>
                            )}

                            {subTab === 'serviceArea' && (
                                <div className="space-y-6">
                                    <SectionHeader 
                                        title="Service Area" 
                                        icon={MapPin} 
                                        help={{ 
                                            title: "Service Area Configuration", 
                                            purpose: "Defining your service area prevents calls from people you can't help and improves Google rankings for specific towns.", 
                                            steps: [
                                                "Towns: List every major town you cover (e.g. White River, Barberton).",
                                                "Map Image: Upload a simple map graphic showing your radius.",
                                                "Description: Briefly mention travel fees if applicable for far areas."
                                            ], 
                                            tips: "Listing individual towns (e.g., 'Nelspruit', 'White River') is better for SEO than just saying 'Lowveld'." 
                                        }} 
                                    />
                                    <div className="bg-[#161