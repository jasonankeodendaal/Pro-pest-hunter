
import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { ClientUser, JobCard, Booking, QuoteLineItem } from '../types';
import { LogOut, LayoutDashboard, FileText, CheckCircle, User, Briefcase, ChevronRight, Download, MapPin, Calendar, Mail, Phone, Edit, Save, Lock, Wallet } from 'lucide-react';
import { Input, FileUpload } from './ui/AdminShared';
import { HelpButton } from './ui/HelpSystem';

interface ClientPortalProps {
    client: ClientUser;
    onLogout: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ client, onLogout }) => {
    const { content, updateClientUser } = useContent();
    const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'quotes' | 'profile'>('overview');
    
    // Local profile edit state
    const [profileForm, setProfileForm] = useState<Partial<ClientUser>>({ ...client });

    // Filter Jobs for this client (Match email or linked emails)
    const clientJobs = content.jobCards.filter(job => 
        (job.email && job.email.toLowerCase() === client.email.toLowerCase()) ||
        (client.linkedEmails && client.linkedEmails.includes(job.email))
    );

    // Calculate totals
    const totalSpend = clientJobs
        .filter(j => j.status === 'Completed' || j.status === 'Invoiced')
        .reduce((sum, j) => sum + (j.quote?.total || 0), 0);
    
    const activeJobsCount = clientJobs.filter(j => !['Completed', 'Cancelled', 'Invoiced'].includes(j.status)).length;

    const handleUpdateProfile = () => {
        if(confirm("Save profile changes?")) {
            updateClientUser(client.id, profileForm);
            alert("Profile updated successfully.");
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors: Record<string, string> = {
            'Assessment': 'bg-blue-500/20 text-blue-400',
            'Quote_Builder': 'bg-yellow-500/20 text-yellow-400',
            'Quote_Sent': 'bg-purple-500/20 text-purple-400',
            'Job_Scheduled': 'bg-orange-500/20 text-orange-400',
            'Job_In_Progress': 'bg-red-500/20 text-red-400',
            'Completed': 'bg-green-500/20 text-green-400',
            'Cancelled': 'bg-red-900/50 text-red-200'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors[status] || 'bg-gray-500/20 text-gray-400'}`}>
                {status.replace(/_/g, ' ')}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#0f1110] flex text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#161817] border-r border-white/5 flex flex-col h-full flex-shrink-0">
                <div className="p-8 border-b border-white/5 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 mx-auto mb-4 overflow-hidden border-2 border-pestGreen shadow-neon">
                        {client.profileImage ? (
                            <img src={client.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-full h-full p-4 text-gray-400" />
                        )}
                    </div>
                    <h2 className="font-bold text-white text-lg truncate">{client.fullName}</h2>
                    {client.companyName && <p className="text-xs text-pestGreen font-bold uppercase tracking-wider">{client.companyName}</p>}
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-pestGreen text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <LayoutDashboard size={18}/> Dashboard
                    </button>
                    <button onClick={() => setActiveTab('jobs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'jobs' ? 'bg-pestGreen text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Briefcase size={18}/> My Jobs <span className="ml-auto bg-white/10 text-xs px-2 py-0.5 rounded-full">{clientJobs.length}</span>
                    </button>
                    <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'profile' ? 'bg-pestGreen text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <User size={18}/> My Profile
                    </button>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-600 text-red-400 hover:text-white py-3 rounded-xl font-bold transition-all border border-red-500/20">
                        <LogOut size={16}/> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 bg-[#0f1110]">
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-black text-white">Welcome Back, {client.fullName.split(' ')[0]}</h1>
                            <HelpButton topic="client-dashboard" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 shadow-lg">
                                <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Spend</h4>
                                <p className="text-3xl font-black text-white">R {totalSpend.toFixed(2)}</p>
                            </div>
                            <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 shadow-lg">
                                <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Active Jobs</h4>
                                <p className="text-3xl font-black text-pestGreen">{activeJobsCount}</p>
                            </div>
                            <div className="bg-[#161817] p-6 rounded-2xl border border-white/5 shadow-lg">
                                <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Member Since</h4>
                                <p className="text-xl font-bold text-white">2024</p>
                            </div>
                        </div>

                        <div className="bg-[#161817] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h3 className="font-bold text-white text-lg">Recent Activity</h3>
                            </div>
                            <div>
                                {clientJobs.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">No jobs recorded yet.</div>
                                ) : (
                                    clientJobs.slice(0, 5).map(job => (
                                        <div key={job.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-white">{job.refNumber}</span>
                                                    <StatusBadge status={job.status} />
                                                </div>
                                                <p className="text-xs text-gray-400">{new Date(job.assessmentDate).toLocaleDateString()} - {job.selectedServices.join(', ')}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-bold text-white block">R {job.quote.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'jobs' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-black text-white">My Jobs History</h1>
                            <HelpButton topic="client-dashboard" />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {clientJobs.map(job => (
                                <div key={job.id} className="bg-[#161817] p-6 rounded-2xl border border-white/5 hover:border-pestGreen/50 transition-all shadow-lg flex flex-col md:flex-row justify-between gap-6">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black text-white">{job.refNumber}</h3>
                                            <StatusBadge status={job.status} />
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                            <span className="flex items-center gap-2"><Calendar size={14}/> {new Date(job.assessmentDate).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-2"><MapPin size={14}/> {job.clientAddressDetails.street}, {job.clientAddressDetails.suburb}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 italic">"{job.treatmentRecommendation}"</p>
                                        
                                        <div className="flex gap-2 mt-2">
                                            {job.selectedServices.map(s => (
                                                <span key={s} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400 border border-white/5">{s}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 justify-center min-w-[200px]">
                                        <div className="text-right mb-2">
                                            <span className="block text-xs text-gray-500 font-bold uppercase">Total Value</span>
                                            <span className="text-2xl font-black text-pestGreen">R {job.quote.total.toFixed(2)}</span>
                                        </div>
                                        <button className="bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 border border-white/10 transition-colors">
                                            <FileText size={16}/> View Quote
                                        </button>
                                        {(job.status === 'Invoiced' || job.status === 'Completed') && (
                                            <button className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 border border-blue-500/20 transition-all">
                                                <Download size={16}/> Download Invoice
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="space-y-8 animate-in fade-in max-w-4xl">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-black text-white">Edit Profile</h1>
                            <HelpButton topic="client-dashboard" />
                        </div>
                        
                        <div className="bg-[#161817] p-8 rounded-2xl border border-white/5 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Full Name" value={profileForm.fullName} onChange={(v:string)=>setProfileForm({...profileForm, fullName: v})}/>
                                <Input label="Company Name" value={profileForm.companyName || ''} onChange={(v:string)=>setProfileForm({...profileForm, companyName: v})}/>
                                <Input label="Email Address" value={profileForm.email} onChange={(v:string)=>setProfileForm({...profileForm, email: v})} disabled={true}/>
                                <Input label="Phone Number" value={profileForm.phone} onChange={(v:string)=>setProfileForm({...profileForm, phone: v})}/>
                                <div className="col-span-2">
                                    <Input label="Physical Address" value={profileForm.address} onChange={(v:string)=>setProfileForm({...profileForm, address: v})}/>
                                </div>
                            </div>

                            <div className="bg-black/20 p-6 rounded-xl border border-white/5 mt-6">
                                <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Lock size={16}/> Security</h4>
                                <div className="max-w-md">
                                    <Input label="New Password / PIN" type="password" value={profileForm.pin} onChange={(v:string)=>setProfileForm({...profileForm, pin: v})} placeholder="Enter new password"/>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button onClick={handleUpdateProfile} className="bg-pestGreen hover:bg-white hover:text-pestGreen text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
                                    <Save size={18}/> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
