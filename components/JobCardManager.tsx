

import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { JobCard, Checkpoint, QuoteLineItem, JobStatus, Employee } from '../types';
import { X, Save, Plus, Trash2, CheckCircle, AlertTriangle, FileText, DollarSign, PenTool, Camera, MapPin, Calendar, User, Phone, Mail, ArrowRight, Shield, Zap, Lock, Download, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input, TextArea, Select, FileUpload } from './ui/AdminShared';

interface JobCardManagerProps {
    jobId: string;
    currentUser: Employee | null;
    onClose: () => void;
}

export const JobCardManager: React.FC<JobCardManagerProps> = ({ jobId, currentUser, onClose }) => {
    const { content, updateJobCard, deleteJobCard } = useContent();
    const job = content.jobCards.find(j => j.id === jobId);
    
    // Determine permissions
    const isAdmin = currentUser === null || currentUser.permissions.isAdmin; // Null assumes super admin in dev/default

    // Local state for the active tab in the manager
    const [activeTab, setActiveTab] = useState<'overview' | 'assessment' | 'quote' | 'execution' | 'invoice'>('overview');
    
    // Local state for adding new items (prevents partial updates to global state)
    const [newCheckpoint, setNewCheckpoint] = useState<Partial<Checkpoint>>({ area: '', pestType: '', severity: 'Low', notes: '', photos: [] });
    const [newLineItem, setNewLineItem] = useState<Partial<QuoteLineItem>>({ name: '', qty: 1, unitPrice: 0 });

    // Scanner State
    const [showScanner, setShowScanner] = useState(false);
    const [scannerError, setScannerError] = useState<string | null>(null);

    useEffect(() => {
        let scanner: any = null;
        if (showScanner) {
            // Using a timeout to ensure DOM element exists
            setTimeout(() => {
                if ((window as any).Html5QrcodeScanner) {
                    scanner = new (window as any).Html5QrcodeScanner(
                        "reader",
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        /* verbose= */ false
                    );
                    scanner.render(
                        (decodedText: string) => {
                            setNewCheckpoint(prev => ({ ...prev, area: decodedText })); // Populate Area with QR Code
                            setShowScanner(false);
                            scanner.clear();
                        },
                        (errorMessage: string) => {
                            // ignore console spam
                        }
                    );
                } else {
                    setScannerError("Scanner library not loaded. Check internet connection.");
                }
            }, 100);
        }

        return () => {
            if (scanner) {
                try {
                    scanner.clear();
                } catch(e) { console.error(e) }
            }
        }
    }, [showScanner]);

    if (!job) return null;

    // --- HELPER FUNCTIONS ---

    const handleSaveJob = (updates: Partial<JobCard>) => {
        updateJobCard(jobId, updates);
    };

    const handleDeleteJobCard = () => {
        if (window.confirm("Are you sure you want to delete this Job Card completely? This cannot be undone.")) {
            deleteJobCard(jobId);
            onClose();
        }
    };

    const advanceStatus = (newStatus: JobStatus) => {
        handleSaveJob({ 
            status: newStatus,
            history: [...job.history, { date: new Date().toISOString(), action: `Status changed to ${newStatus}`, user: currentUser?.fullName || 'System' }]
        });
        // Auto-switch tabs based on status
        if (newStatus === 'Assessment') setActiveTab('assessment');
        if (newStatus === 'Quote_Builder') setActiveTab('quote');
        if (newStatus === 'Job_In_Progress') setActiveTab('execution');
        if (newStatus === 'Invoiced') setActiveTab('invoice');
    };

    // --- CHECKPOINT LOGIC ---
    const addCheckpoint = () => {
        if (!newCheckpoint.area || !newCheckpoint.pestType) return;
        const checkpoint: Checkpoint = {
            id: Date.now().toString(),
            code: `CHK-${Date.now()}`,
            area: newCheckpoint.area!,
            pestType: newCheckpoint.pestType!,
            severity: newCheckpoint.severity as any,
            notes: newCheckpoint.notes || '',
            photos: newCheckpoint.photos || [],
            timestamp: new Date().toISOString(),
            isTreated: false
        };
        handleSaveJob({ checkpoints: [...job.checkpoints, checkpoint] });
        setNewCheckpoint({ area: '', pestType: '', severity: 'Low', notes: '', photos: [] });
    };

    const updateCheckpoint = (id: string, updates: Partial<Checkpoint>) => {
        const updated = job.checkpoints.map(cp => cp.id === id ? { ...cp, ...updates } : cp);
        handleSaveJob({ checkpoints: updated });
    };

    const deleteCheckpoint = (id: string) => {
        handleSaveJob({ checkpoints: job.checkpoints.filter(cp => cp.id !== id) });
    };

    // --- QUOTE LOGIC ---
    const addLineItem = () => {
        if (!newLineItem.name) return;
        const item: QuoteLineItem = {
            id: Date.now().toString(),
            name: newLineItem.name!,
            qty: newLineItem.qty || 1,
            unitPrice: newLineItem.unitPrice || 0,
            total: (newLineItem.qty || 1) * (newLineItem.unitPrice || 0)
        };
        const updatedItems = [...job.quote.lineItems, item];
        calculateQuoteTotal(updatedItems);
        setNewLineItem({ name: '', qty: 1, unitPrice: 0 });
    };

    const deleteLineItem = (id: string) => {
        const updatedItems = job.quote.lineItems.filter(i => i.id !== id);
        calculateQuoteTotal(updatedItems);
    };

    const calculateQuoteTotal = (items: QuoteLineItem[]) => {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const vat = subtotal * job.quote.vatRate;
        const total = subtotal + vat;
        
        handleSaveJob({
            quote: {
                ...job.quote,
                lineItems: items,
                subtotal,
                total
            }
        });
    };

    // --- RENDERERS ---

    const StatusBadge = ({ status }: { status: string }) => {
        const colors: Record<string, string> = {
            'Assessment': 'bg-blue-500/20 text-blue-400',
            'Quote_Builder': 'bg-yellow-500/20 text-yellow-400',
            'Job_Scheduled': 'bg-purple-500/20 text-purple-400',
            'Job_In_Progress': 'bg-orange-500/20 text-orange-400',
            'Completed': 'bg-green-500/20 text-green-400'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors[status] || 'bg-gray-500/20 text-gray-400'}`}>
                {status.replace(/_/g, ' ')}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#0f1110] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-300">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-[#161817] border-r border-white/5 flex flex-col flex-shrink-0">
                <div className="p-6 border-b border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-white font-black text-xl">{job.refNumber}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={20}/></button>
                    </div>
                    <StatusBadge status={job.status} />
                    <p className="text-gray-400 text-sm mt-4 font-medium truncate">{job.clientName}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <FileText size={16} /> Overview
                    </button>
                    <button onClick={() => setActiveTab('assessment')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'assessment' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <Shield size={16} /> Assessment
                    </button>
                    <button onClick={() => setActiveTab('quote')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'quote' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <DollarSign size={16} /> Quote {(!isAdmin && job.status === 'Quote_Builder') && <Lock size={12} className="ml-auto" />}
                    </button>
                    
                    {/* Execution Tab - Only unlocked if status allows */}
                    {(['Job_Scheduled', 'Job_In_Progress', 'Job_Review', 'Invoiced', 'Completed'].includes(job.status)) && (
                        <button onClick={() => setActiveTab('execution')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'execution' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                            <Zap size={16} /> Job Execution
                        </button>
                    )}
                    
                    <button onClick={() => setActiveTab('invoice')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'invoice' ? 'bg-pestGreen text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <CheckCircle size={16} /> Invoice & Close
                    </button>
                </div>
                
                {/* Delete Job Button (Admin Only) */}
                {isAdmin && (
                    <div className="p-4 border-t border-white/5">
                        <button onClick={handleDeleteJobCard} className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10 hover:text-red-400 py-3 rounded-xl font-bold text-sm transition-colors">
                            <Trash2 size={16} /> Delete Job Card
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-[#0f1110] relative">
                <div className="max-w-5xl mx-auto p-6 md:p-12 pb-24">
                    
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <h1 className="text-3xl font-black text-white flex items-center gap-3">
                                Job Overview
                                {job.status === 'Assessment' && <button onClick={() => advanceStatus('Quote_Builder')} className="ml-auto bg-pestGreen text-white px-4 py-2 rounded-lg text-sm">Start Quote</button>}
                            </h1>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Client Info */}
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 space-y-4">
                                    <h3 className="text-pestGreen font-bold uppercase text-xs tracking-wider flex items-center gap-2"><User size={14}/> Client Details</h3>
                                    <Input label="Client Name" value={job.clientName} onChange={(v: string) => handleSaveJob({ clientName: v })} />
                                    <Input label="Email" value={job.email} onChange={(v: string) => handleSaveJob({ email: v })} />
                                    <Input label="Phone" value={job.contactNumber} onChange={(v: string) => handleSaveJob({ contactNumber: v })} />
                                </div>

                                {/* Location Info */}
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 space-y-4">
                                    <h3 className="text-pestGreen font-bold uppercase text-xs tracking-wider flex items-center gap-2"><MapPin size={14}/> Service Location</h3>
                                    <Input label="Street" value={job.clientAddressDetails.street} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, street: v } })} />
                                    <Input label="Suburb" value={job.clientAddressDetails.suburb} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, suburb: v } })} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="City" value={job.clientAddressDetails.city} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, city: v } })} />
                                        <Input label="Postal Code" value={job.clientAddressDetails.postalCode} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, postalCode: v } })} />
                                    </div>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${job.clientAddressDetails.street}, ${job.clientAddressDetails.suburb}, ${job.clientAddressDetails.city}`)}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold hover:underline"
                                    >
                                        <MapPin size={12}/> Open in Google Maps
                                    </a>
                                </div>
                                
                                {/* Scheduling */}
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 space-y-4">
                                    <h3 className="text-pestGreen font-bold uppercase text-xs tracking-wider flex items-center gap-2"><Calendar size={14}/> Schedule</h3>
                                    <Input label="Assessment Date" type="date" value={job.assessmentDate.split('T')[0]} onChange={(v: string) => handleSaveJob({ assessmentDate: new Date(v).toISOString() })} />
                                    <Input label="Service Date" type="date" value={job.serviceDate ? job.serviceDate.split('T')[0] : ''} onChange={(v: string) => handleSaveJob({ serviceDate: new Date(v).toISOString() })} />
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Technician</label>
                                        <select 
                                            value={job.technicianId} 
                                            onChange={(e) => handleSaveJob({ technicianId: e.target.value })}
                                            className="w-full p-3 bg-[#0f1110] border border-white/10 rounded-xl text-white focus:border-pestGreen outline-none"
                                        >
                                            <option value="">Select Technician...</option>
                                            {content.employees.filter(e => e.permissions.canExecuteJob).map(emp => (
                                                <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ASSESSMENT TAB - Available to Everyone */}
                    {activeTab === 'assessment' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                             <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-black text-white flex items-center gap-3"><Shield size={32} className="text-pestGreen"/> Site Assessment</h1>
                                {job.status === 'Assessment' && <button onClick={() => advanceStatus('Quote_Builder')} className="bg-white text-pestBrown hover:bg-pestGreen hover:text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">Complete Assessment <ArrowRight size={16}/></button>}
                             </div>

                             {/* SCANNER MODAL */}
                             {showScanner && (
                                 <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
                                     <button onClick={() => setShowScanner(false)} className="absolute top-4 right-4 text-white"><X size={32}/></button>
                                     <div id="reader" className="w-full max-w-sm bg-white rounded-lg overflow-hidden"></div>
                                     <p className="text-white mt-4 font-bold">Scan QR Code on Station</p>
                                     {scannerError && <p className="text-red-500 mt-2">{scannerError}</p>}
                                 </div>
                             )}

                             {/* Add Checkpoint Form */}
                             <div className="bg-[#161817] border border-white/5 rounded-2xl p-6">
                                 <div className="flex items-center justify-between mb-4">
                                     <h3 className="text-white font-bold">Add New Finding</h3>
                                     <button onClick={() => setShowScanner(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                                         <QrCode size={14} /> Scan QR
                                     </button>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                     <Input label="Area / QR Code" value={newCheckpoint.area} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, area: v }))} />
                                     <Input label="Pest Found" value={newCheckpoint.pestType} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, pestType: v }))} />
                                     <Select label="Severity" value={newCheckpoint.severity} options={[{label:'Low',value:'Low'},{label:'Medium',value:'Medium'},{label:'High',value:'High'}]} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, severity: v as any }))} />
                                 </div>
                                 <div className="mb-4">
                                    <TextArea label="Notes / Observations" value={newCheckpoint.notes} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, notes: v }))} rows={2} />
                                 </div>
                                 <div className="mb-4">
                                     <FileUpload 
                                        label="Attach Photo" 
                                        value={newCheckpoint.photos} 
                                        onChange={(v: string[]) => setNewCheckpoint(prev => ({ ...prev, photos: v }))} 
                                        multiple={true}
                                        capture="environment" // Forces Camera on Mobile
                                     />
                                 </div>
                                 <button onClick={addCheckpoint} className="w-full bg-white/5 hover:bg-pestGreen text-white font-bold py-3 rounded-xl transition-colors border border-dashed border-white/20 hover:border-transparent flex items-center justify-center gap-2">
                                     <Plus size={16}/> Add Checkpoint
                                 </button>
                             </div>

                             {/* List Checkpoints */}
                             <div className="grid grid-cols-1 gap-4">
                                 {job.checkpoints.map((cp, idx) => (
                                     <div key={cp.id} className="bg-[#161817] border-l-4 border-l-pestGreen border-y border-r border-white/5 rounded-r-xl p-6 relative">
                                         <button onClick={() => deleteCheckpoint(cp.id)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500"><Trash2 size={16}/></button>
                                         <div className="flex justify-between items-start mb-2">
                                             <div>
                                                 <h4 className="text-xl font-bold text-white">{cp.area}</h4>
                                                 <span className="text-xs text-pestGreen font-bold uppercase tracking-wider">{cp.pestType} • {cp.severity} Priority</span>
                                             </div>
                                             <span className="text-xs text-gray-600 font-mono">{cp.code}</span>
                                         </div>
                                         <p className="text-gray-400 text-sm mb-4">{cp.notes}</p>
                                         {cp.photos && cp.photos.length > 0 && (
                                             <div className="flex gap-2">
                                                 {cp.photos.map((photo, i) => (
                                                     <img key={i} src={photo} alt="Finding" className="w-16 h-16 rounded-lg object-cover border border-white/10" />
                                                 ))}
                                             </div>
                                         )}
                                     </div>
                                 ))}
                                 {job.checkpoints.length === 0 && <p className="text-center text-gray-500 py-8 italic">No findings recorded yet.</p>}
                             </div>
                        </div>
                    )}

                    {/* QUOTE TAB - Permissions Applied */}
                    {activeTab === 'quote' && (
                         <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                             <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-black text-white flex items-center gap-3"><DollarSign size={32} className="text-pestGreen"/> Quote Builder</h1>
                                
                                {isAdmin && job.status === 'Quote_Builder' && (
                                    <div className="flex gap-2">
                                        <button className="bg-white/10 text-white px-4 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 hover:bg-white/20"><Download size={16}/> Download PDF</button>
                                        <button onClick={() => advanceStatus('Job_Scheduled')} className="bg-pestGreen text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">Approve & Schedule Job <ArrowRight size={16}/></button>
                                    </div>
                                )}
                                
                                {!isAdmin && job.status === 'Quote_Builder' && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2">
                                        <Lock size={14} /> Pending Admin Approval
                                    </div>
                                )}
                             </div>

                             {/* Quote Summary Table */}
                             <div className={`bg-[#161817] border border-white/5 rounded-2xl overflow-hidden ${!isAdmin ? 'opacity-80' : ''}`}>
                                 <table className="w-full text-left border-collapse">
                                     <thead>
                                         <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                             <th className="p-4">Description</th>
                                             <th className="p-4 w-24 text-center">Qty</th>
                                             <th className="p-4 w-32 text-right">Unit Price</th>
                                             <th className="p-4 w-32 text-right">Total</th>
                                             {isAdmin && <th className="p-4 w-12"></th>}
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-white/5">
                                         {job.quote.lineItems.map(item => (
                                             <tr key={item.id} className="text-white text-sm">
                                                 <td className="p-4">{item.name}</td>
                                                 <td className="p-4 text-center">{item.qty}</td>
                                                 <td className="p-4 text-right">R {item.unitPrice.toFixed(2)}</td>
                                                 <td className="p-4 text-right font-bold">R {item.total.toFixed(2)}</td>
                                                 {isAdmin && <td className="p-4 text-center"><button onClick={() => deleteLineItem(item.id)} className="text-gray-600 hover:text-red-500"><Trash2 size={14}/></button></td>}
                                             </tr>
                                         ))}
                                         {/* Add Row - ADMIN ONLY */}
                                         {isAdmin && (
                                             <tr className="bg-white/5">
                                                 <td className="p-2"><input type="text" placeholder="Item Description" value={newLineItem.name} onChange={e => setNewLineItem(prev => ({...prev, name: e.target.value}))} className="w-full bg-transparent p-2 outline-none text-white placeholder-gray-600" /></td>
                                                 <td className="p-2"><input type="number" min="1" value={newLineItem.qty} onChange={e => setNewLineItem(prev => ({...prev, qty: parseInt(e.target.value)}))} className="w-full bg-transparent p-2 outline-none text-white text-center" /></td>
                                                 <td className="p-2"><input type="number" min="0" value={newLineItem.unitPrice} onChange={e => setNewLineItem(prev => ({...prev, unitPrice: parseFloat(e.target.value)}))} className="w-full bg-transparent p-2 outline-none text-white text-right" /></td>
                                                 <td className="p-2 text-right text-gray-500">-</td>
                                                 <td className="p-2 text-center"><button onClick={addLineItem} className="bg-pestGreen text-white p-1.5 rounded hover:bg-white hover:text-pestGreen transition-colors"><Plus size={14}/></button></td>
                                             </tr>
                                         )}
                                     </tbody>
                                     <tfoot className="bg-white/5 text-white">
                                         <tr>
                                             <td colSpan={3} className="p-4 text-right font-bold text-gray-400">Subtotal</td>
                                             <td className="p-4 text-right font-bold">R {job.quote.subtotal.toFixed(2)}</td>
                                             <td></td>
                                         </tr>
                                         <tr>
                                             <td colSpan={3} className="p-4 text-right font-bold text-gray-400">VAT (15%)</td>
                                             <td className="p-4 text-right font-bold">R {(job.quote.subtotal * 0.15).toFixed(2)}</td>
                                             <td></td>
                                         </tr>
                                         <tr>
                                             <td colSpan={3} className="p-4 text-right font-black text-lg text-pestGreen">TOTAL</td>
                                             <td className="p-4 text-right font-black text-lg text-pestGreen">R {job.quote.total.toFixed(2)}</td>
                                             <td></td>
                                         </tr>
                                     </tfoot>
                                 </table>
                             </div>
                             
                             <div className="bg-[#161817] border border-white/5 rounded-2xl p-6">
                                 {isAdmin ? (
                                    <TextArea label="Quote Notes / Terms" value={job.quote.notes} onChange={(v: string) => handleSaveJob({ quote: { ...job.quote, notes: v } })} />
                                 ) : (
                                     <div>
                                         <label className="text-xs font-bold text-gray-500 uppercase">Quote Notes</label>
                                         <p className="text-gray-400 text-sm mt-1">{job.quote.notes || 'No notes available.'}</p>
                                     </div>
                                 )}
                             </div>
                         </div>
                    )}

                    {/* EXECUTION TAB - Visible to All IF status is correct */}
                    {activeTab === 'execution' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-black text-white flex items-center gap-3"><Zap size={32} className="text-pestGreen"/> Job Execution</h1>
                                {job.status === 'Job_Scheduled' && <button onClick={() => advanceStatus('Job_In_Progress')} className="bg-pestGreen text-white px-6 py-3 rounded-xl font-bold">Start Job Timer</button>}
                                {job.status === 'Job_In_Progress' && <button onClick={() => advanceStatus('Invoiced')} className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold">Complete Job</button>}
                            </div>

                            <div className="bg-pestGreen/10 border border-pestGreen/20 p-4 rounded-xl flex items-center gap-3 text-pestGreen">
                                <AlertTriangle size={20} />
                                <span className="font-bold">Technician Instruction: Mark each area as treated. Take photos of bait stations.</span>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {job.checkpoints.map((cp) => (
                                    <div key={cp.id} className={`border rounded-xl p-6 transition-all ${cp.isTreated ? 'bg-green-900/10 border-green-500/30 opacity-70' : 'bg-[#161817] border-white/10'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                                                    {cp.isTreated && <CheckCircle className="text-green-500" size={20} />}
                                                    {cp.area}
                                                </h4>
                                                <p className="text-sm text-gray-400">Target: <span className="text-pestGreen font-bold">{cp.pestType}</span></p>
                                            </div>
                                            <button 
                                                onClick={() => updateCheckpoint(cp.id, { isTreated: !cp.isTreated })}
                                                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase ${cp.isTreated ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                                            >
                                                {cp.isTreated ? 'Treated' : 'Mark Done'}
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <TextArea label="Treatment Notes" placeholder="e.g. Applied 5g Maxforce Gel" value={cp.treatmentNotes || ''} onChange={(v: string) => updateCheckpoint(cp.id, { treatmentNotes: v })} rows={1} />
                                            <FileUpload 
                                                label="Proof of Treatment (Photo)" 
                                                value={cp.servicePhotos} 
                                                onChange={(v: string[]) => updateCheckpoint(cp.id, { servicePhotos: v })} 
                                                multiple={true}
                                                capture="environment"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* INVOICE TAB - Visible to All */}
                    {activeTab === 'invoice' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 text-center pt-20">
                             <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                 <CheckCircle className="text-green-500 w-12 h-12" />
                             </div>
                             <h1 className="text-4xl font-black text-white">Job Completed</h1>
                             <p className="text-gray-400 max-w-md mx-auto">The job has been reviewed. You can now generate the tax invoice or archive this card.</p>
                             
                             <div className="flex justify-center gap-4">
                                 <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><FileText size={18}/> Download Invoice PDF</button>
                                 <button onClick={onClose} className="bg-pestGreen text-white px-6 py-3 rounded-xl font-bold">Close Job Card</button>
                             </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};
