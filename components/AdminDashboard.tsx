
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
    CreditCard, Bug, QrCode, FileStack, Edit, BookOpen, Workflow, Server, Cloud, Link, Circle, Code2, Terminal, Copy, Palette, Upload, Zap, Database, RotateCcw, Wifi, GitBranch, Globe2, Inbox, Activity, AlertTriangle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Employee, AdminMainTab, AdminSubTab, JobCard } from '../types';
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

const SectionHeader = ({ title, icon: Icon, help }: { title: string; icon: any; help?: { title: string; purpose: string; steps: string[]; tips?: string } }) => (
    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <div className="p-2 bg-pestGreen/10 rounded-lg text-pestGreen">
            <Icon size={24} />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h2>
        {help && <SectionHelp {...help} />}
    </div>
);

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
                     <h2 className="text-4xl font-black text-white leading-tight">Zero-to-Hero Masterclass</h2>
                     <p className="text-gray-400 text-lg">The 100% Free, Full Stack Deployment Guide (GitHub + Supabase + Render + Vercel).</p>
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
                        <p className="text-gray-400 text-xs">Enter your deployed server URL (Phase 3) here to connect the dashboard.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full relative">
                        <input 
                            type="text" 
                            value={tempUrl} 
                            onChange={(e) => setTempUrl(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pestGreen outline-none font-mono text-sm"
                            placeholder="https://pest-backend.onrender.com" 
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full ${apiUrl.includes('localhost') ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                             <span className="text-[10px] uppercase font-bold text-gray-500">{apiUrl.includes('localhost') ? 'Localhost' : 'Live Remote'}</span>
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
             
             {/* PHASE 1: GITHUB */}
             <div className="space-y-12 relative z-10">
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><GitBranch size={100}/></div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black text-sm font-bold">1</span>
                        Phase 1: Get Code on GitHub
                    </h3>
                    <div className="space-y-4 pl-4 border-l-2 border-white/10">
                        <p className="text-gray-300">We need to move your files from your computer (or AI editor) to the cloud.</p>
                        <ul className="list-disc list-inside text-sm text-gray-400 space-y-2">
                            <li><strong>Create Account:</strong> Go to <a href="https://github.com" target="_blank" className="text-pestGreen hover:underline">github.com</a> and sign up.</li>
                            <li><strong>New Repo:</strong> Click the <strong>+</strong> icon (top right) &rarr; <strong>New repository</strong>.</li>
                            <li><strong>Name It:</strong> Call it <code>pest-control-app</code>. Select <strong>Public</strong>. Click <strong>Create repository</strong>.</li>
                            <li><strong>Upload:</strong> Click "uploading an existing file" on the next screen. Drag and drop ALL project files (including <code>server.js</code>, <code>index.html</code>, <code>package.json</code>, etc.).</li>
                            <li><strong>Commit:</strong> Click "Commit changes" button at the bottom.</li>
                        </ul>
                    </div>
                </div>

                {/* PHASE 2: SUPABASE */}
                <div className="bg-green-900/10 border border-green-500/30 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Database size={100}/></div>
                    <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-black text-sm font-bold">2</span>
                        Phase 2: The Database (Supabase)
                    </h3>
                    <div className="space-y-4 pl-4 border-l-2 border-green-500/30">
                        <p className="text-gray-300 text-sm">Free servers like Render will delete your local files when they sleep. We need a real database to keep your data safe.</p>
                        <ol className="list-decimal list-inside text-sm text-gray-400 space-y-3">
                            <li>Go to <a href="https://supabase.com" target="_blank" className="text-green-400 hover:underline">supabase.com</a> and sign up.</li>
                            <li>Click <strong>New Project</strong>. Give it a name (e.g., <code>pest-db</code>) and a strong password.</li>
                            <li><strong>CRITICAL:</strong> Ignore the "Project API" screen with the "anon" key. That is for the frontend.</li>
                            <li>Go to <strong>Project Settings</strong> (Cog Icon in left sidebar) &rarr; <strong>Database</strong>.</li>
                            <li>Scroll down to the <strong>Connection String</strong> section.</li>
                            <li>Click <strong>Node.js</strong> and toggle <strong>"Use connection pooler"</strong> if available (Mode: Transaction).</li>
                            <li><strong>COPY THIS STRING.</strong> It looks like: <code>postgres://postgres.user...</code></li>
                            <li className="bg-black/30 p-2 rounded text-xs text-green-300">Tip: You must manually replace <code>[YOUR-PASSWORD]</code> in that string with the password you created in step 2.</li>
                        </ol>
                        
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mt-4">
                            <h4 className="text-red-400 font-bold flex items-center gap-2 mb-1"><AlertTriangle size={16}/> Common Problem: "ENOTFOUND"</h4>
                            <p className="text-xs text-red-200/70">
                                If you see an "ENOTFOUND" error in your Render logs, it means your Supabase project is <strong>PAUSED</strong> or still creating. 
                                Log in to Supabase and check if there is a "Restore" button on your project.
                            </p>
                        </div>
                    </div>
                </div>

                {/* PHASE 3: RENDER */}
                <div className="bg-purple-900/10 border border-purple-500/30 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Server size={100}/></div>
                    <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-black text-sm font-bold">3</span>
                        Phase 3: The Backend (Render)
                    </h3>
                    <div className="space-y-6">
                        <p className="text-gray-300 text-sm">This runs your Node.js server (the brain).</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <h4 className="text-white font-bold mb-2 text-sm uppercase">A. Setup Service</h4>
                                <ol className="list-decimal list-inside text-sm text-gray-400 space-y-2">
                                    <li>Go to <a href="https://render.com" target="_blank" className="text-purple-400 hover:underline">render.com</a>. Sign up with GitHub.</li>
                                    <li>Click <strong>New +</strong> &rarr; <strong>Web Service</strong>.</li>
                                    <li>Select your <code>pest-control-app</code> repo.</li>
                                    <li><strong>Name:</strong> <code>pest-backend</code></li>
                                    <li><strong>Runtime:</strong> <code>Node</code></li>
                                    <li><strong>Build Command:</strong> <code>npm install</code></li>
                                    <li><strong>Start Command:</strong> <code>node server.js</code></li>
                                    <li>Select <strong>Free</strong> instance type.</li>
                                </ol>
                             </div>
                             <div>
                                <h4 className="text-white font-bold mb-2 text-sm uppercase">B. Environment Variables</h4>
                                <p className="text-xs text-gray-500 mb-2">Scroll down to "Environment Variables" section.</p>
                                <div className="space-y-2 text-sm bg-black/40 p-4 rounded-xl border border-white/10 font-mono">
                                    <div className="flex flex-col gap-1 mb-2">
                                        <span className="text-purple-300 font-bold">Key:</span> <span>DATABASE_URL</span>
                                        <span className="text-purple-300 font-bold">Value:</span> <span className="text-green-400 text-xs break-all bg-green-500/10 p-1 rounded border border-green-500/20">postgresql://postgres:Ankeodendaal101@db.xgyopkivwfotoryhzviz.supabase.co:5432/postgres</span>
                                        <div className="text-[9px] text-green-300 mt-1 uppercase font-bold">Updated with your exact connection string</div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-purple-300 font-bold">Key:</span> <span>GMAIL_USER / GMAIL_PASS</span>
                                        <span className="text-gray-400 text-xs">(Optional: For email sending)</span>
                                    </div>
                                </div>
                             </div>
                        </div>
                        <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                            <strong className="text-white text-sm">Action:</strong> <span className="text-gray-300 text-sm">Click <strong>Create Web Service</strong>. Wait for it to say "Live". Copy the URL at the top (e.g. <code>https://pest-backend.onrender.com</code>).</span>
                        </div>
                    </div>
                </div>

                {/* PHASE 4: VERCEL */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Globe2 size={100}/></div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black text-sm font-bold">4</span>
                        Phase 4: The Frontend (Vercel)
                    </h3>
                    <div className="space-y-6">
                         <p className="text-gray-300 text-sm">This hosts the visual website.</p>
                         <ol className="list-decimal list-inside text-sm text-gray-400 space-y-2">
                            <li>Go to <a href="https://vercel.com" target="_blank" className="text-pestGreen hover:underline">vercel.com</a>. Sign up with GitHub.</li>
                            <li>Click <strong>Add New...</strong> &rarr; <strong>Project</strong>.</li>
                            <li>Import <code>pest-control-app</code>.</li>
                            <li><strong>Framework Preset:</strong> Select <strong>Vite</strong>.</li>
                            <li>Click <strong>Environment Variables</strong> to expand it.</li>
                         </ol>

                         <div className="bg-black/40 p-4 rounded-xl border border-white/20 space-y-4">
                            <div>
                                <h4 className="text-white font-bold text-sm mb-2">1. Link Frontend to Backend</h4>
                                <div className="grid grid-cols-1 gap-2 font-mono text-sm">
                                    <div><span className="text-gray-500">Key:</span> <span className="text-pestGreen">VITE_API_URL</span></div>
                                    <div><span className="text-gray-500">Value:</span> <span className="text-blue-300 break-all">https://pest-backend.onrender.com</span></div>
                                    <div className="text-[10px] text-red-400 mt-1 uppercase font-bold">Do NOT put a slash (/) at the end!</div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-white font-bold text-sm mb-2">2. Secure Your Admin Access</h4>
                                <p className="text-xs text-gray-400 mb-2">Set your custom login credentials here. This hides them from the source code.</p>
                                <div className="grid grid-cols-1 gap-2 font-mono text-sm">
                                    <div className="flex gap-2"><span className="text-gray-500 w-32">Key:</span> <span className="text-pestGreen">VITE_ADMIN_EMAIL</span></div>
                                    <div className="flex gap-2"><span className="text-gray-500 w-32">Value:</span> <span className="text-white">your-email@gmail.com</span></div>
                                    
                                    <div className="flex gap-2 mt-2"><span className="text-gray-500 w-32">Key:</span> <span className="text-pestGreen">VITE_ADMIN_PIN</span></div>
                                    <div className="flex gap-2"><span className="text-gray-500 w-32">Value:</span> <span className="text-white">1234</span></div>
                                </div>
                            </div>
                         </div>
                         
                         <button className="bg-white text-black font-bold px-6 py-3 rounded-lg text-sm w-full md:w-auto">
                            Click "Deploy"
                         </button>
                    </div>
                </div>

                {/* PHASE 5: CONNECT */}
                <div className="bg-pestGreen/20 border border-pestGreen/30 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-pestGreen mb-4 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pestGreen text-white text-sm font-bold">5</span>
                        Phase 5: Launch & Connect
                    </h3>
                    <div className="space-y-4 text-sm text-gray-300">
                        <p>You are now live for $0/month.</p>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>Visit your new Vercel URL (e.g., <code>https://pest-control-app.vercel.app</code>).</li>
                            <li>Log in to Admin (Use the Email/PIN you set in Phase 4).</li>
                            <li>Go to <strong>System Guide</strong> tab in dashboard.</li>
                            <li>Check the "Connection Status" light. It should be <span className="text-green-400 font-bold">Green</span>.</li>
                        </ol>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mt-4">
                            <h4 className="text-yellow-400 font-bold flex items-center gap-2 mb-1"><AlertCircle size={16}/> Note on Free Tier</h4>
                            <p className="text-xs text-yellow-200/70">
                                The Render free server "sleeps" after 15 minutes of inactivity. The first time you visit the site after a break, the backend might take 50 seconds to wake up. This is normal.
                            </p>
                        </div>
                    </div>
                </div>

                {/* PHASE 6: THE HACK */}
                <div className="bg-orange-900/10 border border-orange-500/30 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={100}/></div>
                    <h3 className="text-2xl font-bold text-orange-400 mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-black text-sm font-bold">6</span>
                        Bonus Phase: The "No-Sleep" Hack
                    </h3>
                    <div className="space-y-4 pl-4 border-l-2 border-orange-500/30">
                        <p className="text-gray-300 text-sm">Free servers go to "sleep" after 15 mins. The first visitor waits 50 seconds. Let's fix that.</p>
                        <ol className="list-decimal list-inside text-sm text-gray-400 space-y-3">
                            <li>Go to <a href="https://uptimerobot.com" target="_blank" className="text-orange-400 hover:underline">UptimeRobot.com</a> (Free).</li>
                            <li>Create a new <strong>HTTP(s)</strong> monitor.</li>
                            <li><strong>URL:</strong> Paste your Render Backend URL + <code>/api/init</code> (e.g., <code>https://...onrender.com/api/init</code>).</li>
                            <li><strong>Interval:</strong> Set to <strong>5 or 10 minutes</strong>.</li>
                            <li><strong>Start:</strong> This robot will now "poke" your server 24/7 so it never sleeps.</li>
                        </ol>
                    </div>
                </div>

                {/* Option D: Expert (VPS) */}
                <div className="bg-blue-900/10 border border-blue-500/30 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Terminal size={100}/></div>
                    <h3 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-black text-sm font-bold">7</span>
                        Option D (Expert): Self-Hosted VPS
                    </h3>
                    <div className="space-y-4 pl-4 border-l-2 border-blue-500/30">
                        <p className="text-gray-300 text-sm">For advanced users who have their own Linux VPS (Ubuntu/Debian) and want to use SQLite permanently without external databases.</p>
                        <ul className="list-disc list-inside text-sm text-gray-400 space-y-2 font-mono">
                            <li><strong>Connect:</strong> SSH into your server.</li>
                            <li><strong>Install Node:</strong> <code>curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs</code></li>
                            <li><strong>Clone:</strong> <code>git clone [YOUR_REPO_URL]</code></li>
                            <li><strong>Install PM2:</strong> <code>sudo npm install -g pm2</code></li>
                            <li><strong>Enter Dir:</strong> <code>cd pest-control-app</code></li>
                            <li><strong>Install Deps:</strong> <code>npm install</code></li>
                            <li><strong>Start:</strong> <code>pm2 start server.js --name "pest-api"</code></li>
                            <li><strong>Persist:</strong> <code>pm2 save && pm2 startup</code></li>
                            <li><strong>Cloudflare:</strong> Set up a Tunnel to point to <code>localhost:3001</code> for SSL.</li>
                        </ul>
                    </div>
                </div>

             </div>
         </div>
    </div>
    );
};

const SystemGuide = () => {
    const { apiUrl, resetSystem, clearSystem, downloadBackup, restoreBackup, dbType, connectionError, isConnecting, retryConnection } = useContent();
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

    const isRenderWithSqlite = dbType === 'sqlite' && !apiUrl.includes('localhost');

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

                     {/* CRITICAL WARNING FOR RENDER USERS */}
                     {isRenderWithSqlite && (
                         <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6 mb-8 animate-pulse">
                             <div className="flex items-start gap-4">
                                 <AlertTriangle className="text-red-500 shrink-0" size={32} />
                                 <div>
                                     <h3 className="text-xl font-black text-red-500 uppercase mb-2">CRITICAL: DATA LOSS RISK DETECTED</h3>
                                     <p className="text-white font-bold mb-2">You are running on a Live Render Server using a Local SQLite Database.</p>
                                     <p className="text-gray-300 text-sm mb-4">
                                         Render deletes local files every time the server restarts (sleeps). Any content you upload will be DELETED automatically. 
                                         You MUST connect Supabase (PostgreSQL) to save data permanently.
                                     </p>
                                     <a href="/?tab=deploymentGuide" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm inline-block">
                                         View Deployment Guide (Phase 2) to Fix This
                                     </a>
                                 </div>
                             </div>
                         </div>
                     )}

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                         <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                             <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                 <Link size={16} className={connectionError ? "text-red-500" : "text-pestGreen"}/> Connection Status
                             </h4>
                             <div className={`bg-black/30 p-3 rounded-lg border flex items-center justify-between mb-2 ${connectionError ? 'border-red-500/30 bg-red-500/10' : 'border-white/5'}`}>
                                <div className="flex-1 mr-2 overflow-hidden">
                                     <code className={`text-xs font-mono break-all block ${connectionError ? 'text-red-400' : 'text-pestGreen'}`}>{apiUrl}</code>
                                     {connectionError && (
                                         <span className="text-[10px] text-red-500 font-bold block mt-1 uppercase">Error: {connectionError}</span>
                                     )}
                                </div>
                                <div className={`w-3 h-3 rounded-full shadow-neon flex-shrink-0 ${isConnecting ? 'bg-yellow-500 animate-ping' : (connectionError ? 'bg-red-500' : 'bg-pestGreen animate-pulse')}`}></div>
                             </div>
                             <div className="flex justify-between items-center">
                                 <p className="text-[10px] text-gray-500">
                                     {connectionError 
                                        ? "Cannot reach server. Check URL or Wake Up server." 
                                        : `Connected via ${apiUrl.includes('localhost') ? 'Local Environment' : 'Live Remote Server'}`}
                                 </p>
                                 <button onClick={retryConnection} className="text-[10px] font-bold text-blue-400 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-1 rounded">
                                     <RefreshCw size={10} className={isConnecting ? 'animate-spin' : ''} /> Retry
                                 </button>
                             </div>
                         </div>

                         <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                             <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Database size={16} className="text-blue-400"/> Database Mode</h4>
                             <div className="flex items-center gap-3">
                                 {dbType === 'postgres' ? (
                                     <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-green-500/30 flex items-center gap-2">
                                         <CheckCircle size={12} /> Supabase (PostgreSQL) - Safe
                                     </span>
                                 ) : dbType === 'sqlite' ? (
                                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border flex items-center gap-2 ${isRenderWithSqlite ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                                         <AlertTriangle size={12} /> {isRenderWithSqlite ? 'SQLite (Ephemeral) - UNSAFE' : 'SQLite (Local) - Dev Mode'}
                                     </span>
                                 ) : (
                                     <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-gray-500/30 flex items-center gap-2">
                                         <HelpCircle size={12} /> Unknown Status
                                     </span>
                                 )}
                             </div>
                             <p className="text-[10px] text-gray-500 mt-2">
                                 {dbType === 'postgres' 
                                    ? "Your data is safely stored in the cloud." 
                                    : (isRenderWithSqlite ? "WARNING: Files will be deleted on restart." : (dbType === 'unknown' ? "Check connection above." : "Data stored in local file."))}
                             </p>
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

const PlaceholderEditor = ({ title }: { title: string }) => (
    <div className="p-12 text-center text-gray-500 bg-[#161817] rounded-2xl border border-white/5 flex flex-col items-center gap-4">
        <PenTool size={48} className="text-gray-600" />
        <div>
            <h2 className="text-xl font-bold text-white mb-2">{title} Editor</h2>
            <p>This content editor is currently under development.</p>
        </div>
    </div>
);

// --- MAIN ADMIN DASHBOARD ---

interface AdminDashboardProps {
  onLogout: () => void;
  loggedInUser: Employee | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, loggedInUser }) => {
  const { content } = useContent();
  const [activeMainTab, setActiveMainTab] = useState<AdminMainTab>('siteContent');
  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('systemGuide');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // If a job is selected, show the JobManager overlay instead of dashboard
  if (selectedJobId) {
      return <JobCardManager jobId={selectedJobId} currentUser={loggedInUser} onClose={() => setSelectedJobId(null)} />;
  }

  const SidebarItem = ({ id, label, icon: Icon, mainTab }: { id: AdminSubTab, label: string, icon: any, mainTab: AdminMainTab }) => (
      activeMainTab === mainTab ? (
        <button 
            onClick={() => setActiveSubTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeSubTab === id ? 'bg-pestGreen text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
            <Icon size={16} />
            <span>{label}</span>
            {activeSubTab === id && <ChevronRight size={14} className="ml-auto opacity-50" />}
        </button>
      ) : null
  );

  return (
    <div className="fixed inset-0 z-[60] bg-[#0f1110] flex overflow-hidden font-sans">
        
        {/* SIDEBAR */}
        <aside className="w-72 bg-[#161817] border-r border-white/5 flex flex-col flex-shrink-0">
            {/* Header */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-pestGreen rounded-xl flex items-center justify-center shadow-neon">
                        <Lock size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-white font-black text-lg leading-none">Admin</h2>
                        <span className="text-pestGreen text-xs font-bold uppercase tracking-wider">Dashboard</span>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex p-2 gap-1 border-b border-white/5">
                <button onClick={() => { setActiveMainTab('siteContent'); setActiveSubTab('systemGuide'); }} className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-all ${activeMainTab === 'siteContent' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                    <Globe size={18} /> Site
                </button>
                <button onClick={() => { setActiveMainTab('bookings'); setActiveSubTab('jobs'); }} className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-all ${activeMainTab === 'bookings' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                    <Briefcase size={18} /> Work
                </button>
                <button onClick={() => { setActiveMainTab('employees'); setActiveSubTab('employeeDirectory'); }} className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-all ${activeMainTab === 'employees' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                    <Users size={18} /> Team
                </button>
            </div>

            {/* Sub Tabs Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <div className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3 mt-2 px-2">Menu</div>
                
                {/* Site Content Subtabs */}
                <SidebarItem id="systemGuide" label="System Status" icon={Activity} mainTab="siteContent" />
                <SidebarItem id="deploymentGuide" label="Deployment Guide" icon={Cloud} mainTab="siteContent" />
                <div className="my-2 border-t border-white/5"></div>
                <SidebarItem id="company" label="Company Info" icon={Building2} mainTab="siteContent" />
                <SidebarItem id="hero" label="Hero Section" icon={Layout} mainTab="siteContent" />
                <SidebarItem id="about" label="About Us" icon={Info} mainTab="siteContent" />
                <SidebarItem id="services" label="Services" icon={Zap} mainTab="siteContent" />
                <SidebarItem id="process" label="Process" icon={Workflow} mainTab="siteContent" />
                <SidebarItem id="serviceArea" label="Service Area" icon={MapPin} mainTab="siteContent" />
                <SidebarItem id="safety" label="Safety & badges" icon={Shield} mainTab="siteContent" />
                <SidebarItem id="faq" label="FAQs" icon={HelpCircle} mainTab="siteContent" />
                <SidebarItem id="testimonials" label="Testimonials" icon={Star} mainTab="siteContent" />
                <SidebarItem id="seo" label="SEO Settings" icon={Search} mainTab="siteContent" />
                <SidebarItem id="creatorSettings" label="Creator Widget" icon={Code2} mainTab="siteContent" />

                {/* Work Subtabs */}
                <SidebarItem id="jobs" label="Job Cards" icon={Clipboard} mainTab="bookings" />
                <SidebarItem id="inquiries" label="Inquiries" icon={Inbox} mainTab="bookings" />

                {/* Team Subtabs */}
                <SidebarItem id="employeeDirectory" label="Staff Directory" icon={Users} mainTab="employees" />
            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-white/5 bg-[#0f1110]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-pestGreen/20 flex items-center justify-center border border-pestGreen/50 text-pestGreen font-bold">
                        {loggedInUser?.fullName.charAt(0) || 'A'}
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="text-white font-bold text-sm truncate">{loggedInUser?.fullName || 'Admin'}</h4>
                        <p className="text-gray-500 text-xs truncate">{loggedInUser?.email || 'System Owner'}</p>
                    </div>
                </div>
                <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-2 rounded-lg font-bold text-sm transition-all">
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#0f1110] relative">
            <div className="max-w-5xl mx-auto p-8 pb-24">
                {/* Header */}
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white">{
                            activeSubTab === 'systemGuide' ? 'System Status' : 
                            activeSubTab === 'deploymentGuide' ? 'Deployment' :
                            activeSubTab.replace(/([A-Z])/g, ' $1').trim()
                        }</h1>
                        <p className="text-gray-500">Manage your {activeSubTab} settings</p>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeSubTab === 'systemGuide' && <SystemGuide />}
                    {activeSubTab === 'deploymentGuide' && <DeploymentGuide />}
                    
                    {/* Job Management */}
                    {activeSubTab === 'jobs' && (
                        <div className="space-y-6">
                            <SectionHeader title="Active Job Cards" icon={Clipboard} />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {content.jobCards.map(job => (
                                    <div key={job.id} onClick={() => setSelectedJobId(job.id)} className="bg-[#161817] border border-white/5 hover:border-pestGreen/50 p-6 rounded-2xl cursor-pointer group transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-xs font-bold text-gray-500 font-mono">{job.refNumber}</span>
                                            <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold ${job.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {job.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-pestGreen transition-colors">{job.clientName}</h3>
                                        <p className="text-sm text-gray-400 mb-4 flex items-center gap-1"><MapPin size={12}/> {job.clientAddressDetails.suburb}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex -space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#161817] flex items-center justify-center text-xs text-white">
                                                    {content.employees.find(e => e.id === job.technicianId)?.fullName.charAt(0) || '?'}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500">{new Date(job.assessmentDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => {
                                        const newJob: JobCard = { 
                                            id: Date.now().toString(), 
                                            refNumber: `JOB-${new Date().getFullYear().toString().slice(-2)}${(content.jobCards.length + 1).toString().padStart(3, '0')}`,
                                            clientName: 'New Client', 
                                            clientAddressDetails: { street: '', suburb: '', city: 'Nelspruit', province: 'MP', postalCode: '' },
                                            contactNumber: '', email: '', propertyType: 'Residential', assessmentDate: new Date().toISOString(), technicianId: '', selectedServices: [], checkpoints: [], isFirstTimeService: true, treatmentRecommendation: '', quote: { lineItems: [], subtotal: 0, vatRate: 0.15, total: 0, notes: '' }, status: 'Assessment', history: [] 
                                        };
                                        // We need to add it to context first, then select it
                                        // This is a bit of a hack since addJobCard is async in context but sync here
                                        // Ideally we'd await, but for now we trust react state updates
                                        // In a real app we'd open a "New Job" modal first.
                                        alert("To create a new job, please use the Booking system or this feature will be fully implemented in the next update.");
                                    }} 
                                    className="bg-white/5 border border-dashed border-white/10 hover:border-pestGreen hover:bg-pestGreen/5 rounded-2xl flex flex-col items-center justify-center gap-4 min-h-[200px] transition-all"
                                >
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">
                                        <Plus size={24} />
                                    </div>
                                    <span className="font-bold text-white">Create New Job Card</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for missing editors */}
                    {!['systemGuide', 'deploymentGuide', 'jobs'].includes(activeSubTab) && (
                        <PlaceholderEditor title={activeSubTab} />
                    )}
                </div>
            </div>
        </main>
    </div>
  );
};
