

import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { JobCard, Checkpoint, QuoteLineItem, JobStatus, Employee } from '../types';
import { X, Save, Plus, Trash2, CheckCircle, AlertTriangle, FileText, DollarSign, PenTool, Camera, MapPin, Calendar, User, Phone, Mail, ArrowRight, Shield, Zap, Lock, Download, QrCode, Printer, HelpCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, TextArea, Select, FileUpload } from './ui/AdminShared';

interface JobCardManagerProps {
    jobId: string;
    currentUser: Employee | null;
    onClose: () => void;
}

// --- HELP CONTENT DEFINITIONS ---
const HELP_CONTENT: Record<string, { title: string; content: React.ReactNode }> = {
    overview: {
        title: "Job Overview Guide",
        content: (
            <div className="space-y-3 text-sm text-gray-300">
                <p>The <strong>Overview</strong> tab is the control center for this job. It contains all static client data and scheduling information.</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Client Details:</strong> Ensure email and phone are correct for automated notifications.</li>
                    <li><strong>Service Location:</strong> This address links to Google Maps. Use the "Open in Maps" link to navigate.</li>
                    <li><strong>Schedule:</strong> Assign a Technician here. Only the assigned technician (and Admins) can see this job in their "My Jobs" view.</li>
                    <li><strong>Gate Codes:</strong> Enter access codes here so the technician doesn't get stuck at the gate.</li>
                </ul>
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-2 rounded mt-2 text-yellow-500 text-xs">
                    <strong>Tip:</strong> Always click the "Save Changes" button at the bottom after updating details.
                </div>
            </div>
        )
    },
    assessment: {
        title: "Site Assessment Workflow",
        content: (
            <div className="space-y-3 text-sm text-gray-300">
                <p>The <strong>Assessment</strong> phase is critical. This is where you identify the problem areas before quoting.</p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li><strong>Walk the Site:</strong> Identify key infestation zones (e.g., Kitchen Sink, Main DB Board).</li>
                    <li><strong>Add Checkpoints:</strong> For each zone, click "Add New Finding". Give it a name (Area) and severity.</li>
                    <li><strong>QR Codes:</strong> The system auto-generates a QR code for every checkpoint. Click "Print Checkpoint QRs" to generate a printable sheet. Stick these QR codes at the physical location (e.g., inside the cupboard door).</li>
                    <li><strong>Photos:</strong> Take photos of the evidence (droppings, damage). This builds trust with the client.</li>
                </ol>
            </div>
        )
    },
    quote: {
        title: "Quote Builder Guide",
        content: (
            <div className="space-y-3 text-sm text-gray-300">
                <p>Build a professional quote based on the assessment findings.</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Line Items:</strong> Add chemicals, labor, and equipment usage as separate lines.</li>
                    <li><strong>Approval:</strong> If you are a Technician, you can build the quote but an Admin must approve it before it can be sent to the client.</li>
                    <li><strong>Status Change:</strong> Once the client accepts the quote, click "Approve & Schedule Job" to unlock the Execution tab.</li>
                </ul>
            </div>
        )
    },
    execution: {
        title: "Job Execution & Scanning",
        content: (
            <div className="space-y-3 text-sm text-gray-300">
                <p>This tab is used by the Technician <strong>on the day of service</strong>.</p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li><strong>Scan to Verify:</strong> Click "Scan QR" and point your camera at the sticker you placed during assessment. This proves you were physically at that specific spot.</li>
                    <li><strong>Auto-Check:</strong> Scanning a valid code will automatically mark that checkpoint as "Treated".</li>
                    <li><strong>Treatment Notes:</strong> Record exactly what chemical was used (e.g., "5g Maxforce Gel"). This is required for safety compliance.</li>
                    <li><strong>Completion:</strong> Once all checkpoints are green, click "Complete Job" to notify Admin for invoicing.</li>
                </ol>
            </div>
        )
    },
    invoice: {
        title: "Invoicing & Close Out",
        content: (
            <div className="space-y-3 text-sm text-gray-300">
                <p>Finalize the financial aspects of the job.</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Review:</strong> Check that all work was actually done.</li>
                    <li><strong>Billing Notes:</strong> Add internal notes about payment status (e.g., "Paid via EFT").</li>
                    <li><strong>Archive:</strong> "Close Job Card" moves this job to the history archive and removes it from the active dashboard.</li>
                </ul>
            </div>
        )
    }
};

export const JobCardManager: React.FC<JobCardManagerProps> = ({ jobId, currentUser, onClose }) => {
    const { content, updateJobCard, deleteJobCard } = useContent();
    const job = content.jobCards.find(j => j.id === jobId);
    
    // Determine permissions
    const isAdmin = currentUser === null || currentUser.permissions.isAdmin;

    // Local state for the active tab in the manager
    const [activeTab, setActiveTab] = useState<'overview' | 'assessment' | 'quote' | 'execution' | 'invoice'>('overview');
    
    // Help System State
    const [showHelp, setShowHelp] = useState(false);
    
    // Local state for adding new items
    const [newCheckpoint, setNewCheckpoint] = useState<Partial<Checkpoint>>({ area: '', pestType: '', severity: 'Low', notes: '', photos: [] });
    const [newLineItem, setNewLineItem] = useState<Partial<QuoteLineItem>>({ name: '', qty: 1, unitPrice: 0 });

    // Scanner State
    const [showScanner, setShowScanner] = useState(false);
    const [scannerError, setScannerError] = useState<string | null>(null);

    useEffect(() => {
        let scanner: any = null;
        if (showScanner) {
            setTimeout(() => {
                if ((window as any).Html5QrcodeScanner) {
                    scanner = new (window as any).Html5QrcodeScanner(
                        "reader",
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        false
                    );
                    scanner.render(
                        (decodedText: string) => {
                            // SCAN LOGIC
                            if (activeTab === 'assessment') {
                                setNewCheckpoint(prev => ({ ...prev, area: decodedText })); 
                                setShowScanner(false);
                                scanner.clear();
                            } else if (activeTab === 'execution') {
                                // Find checkpoint matching code OR area name (fallback)
                                const cpIndex = job?.checkpoints.findIndex(c => c.code === decodedText || c.area === decodedText);
                                if (cpIndex !== undefined && cpIndex > -1 && job) {
                                    const newCps = [...job.checkpoints];
                                    newCps[cpIndex].isTreated = true;
                                    newCps[cpIndex].timestamp = new Date().toISOString();
                                    handleSaveJob({ checkpoints: newCps });
                                    alert(`Verified: ${newCps[cpIndex].area}`);
                                    setShowScanner(false);
                                    scanner.clear();
                                } else {
                                    alert("QR Code not found in this job card.");
                                }
                            }
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
                try { scanner.clear(); } catch(e) { console.error(e) }
            }
        }
    }, [showScanner, activeTab, job]);

    if (!job) return null;

    // --- ACTIONS ---

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
        if (newStatus === 'Assessment') setActiveTab('assessment');
        if (newStatus === 'Quote_Builder') setActiveTab('quote');
        if (newStatus === 'Job_In_Progress') setActiveTab('execution');
        if (newStatus === 'Invoiced') setActiveTab('invoice');
    };

    const addCheckpoint = () => {
        if (!newCheckpoint.area || !newCheckpoint.pestType) return;
        const checkpoint: Checkpoint = {
            id: Date.now().toString(),
            code: `CHK-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Unique QR Code Data
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

    const printQRCodes = () => {
        const win = window.open('', '', 'width=800,height=600');
        if (!win) return;
        
        const qrHtml = job.checkpoints.map(cp => `
            <div style="display:inline-block; border: 1px dashed #ccc; padding: 20px; margin: 10px; text-align:center; width: 200px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cp.code}" style="width:150px;height:150px;"/>
                <h3 style="margin: 10px 0 5px 0; font-family: sans-serif;">${cp.area}</h3>
                <p style="margin: 0; font-family: monospace; font-size: 10px; color: #666;">${cp.code}</p>
                <p style="margin: 5px 0 0 0; font-family: sans-serif; font-size: 12px;"><strong>${job.refNumber}</strong></p>
            </div>
        `).join('');

        win.document.write(`
            <html>
                <head>
                    <title>Print QR Codes - ${job.refNumber}</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        @media print {
                            body { -webkit-print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body>
                    <h1 style="text-align:center;">Checkpoint QR Codes: ${job.refNumber}</h1>
                    <p style="text-align:center;">${job.clientName}</p>
                    <div style="display:flex; flex-wrap:wrap; justify-content:center;">
                        ${qrHtml}
                    </div>
                    <script>
                        window.onload = function() { window.print(); }
                    </script>
                </body>
            </html>
        `);
        win.document.close();
    };

    // --- COMPONENTS ---

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

    const TabButton = ({ id, label, icon: Icon }: any) => (
        <button 
            onClick={() => { setActiveTab(id); setShowHelp(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === id ? 'bg-pestGreen text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
        >
            <Icon size={16} /> {label}
        </button>
    );

    const HelpModal = () => (
        <AnimatePresence>
            {showHelp && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-20 right-6 md:right-12 z-50 w-80 bg-[#1e201f] border border-pestGreen/50 shadow-2xl rounded-2xl p-6"
                >
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                        <h4 className="text-pestGreen font-bold flex items-center gap-2">
                            <Info size={16}/> {HELP_CONTENT[activeTab].title}
                        </h4>
                        <button onClick={() => setShowHelp(false)} className="text-gray-500 hover:text-white"><X size={16}/></button>
                    </div>
                    {HELP_CONTENT[activeTab].content}
                </motion.div>
            )}
        </AnimatePresence>
    );

    const SaveBar = ({ onSave }: { onSave: () => void }) => (
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-gray-500 italic flex items-center gap-1"><Info size={12}/> Changes are local until saved.</span>
            <button 
                onClick={onSave}
                className="bg-pestGreen hover:bg-white hover:text-pestGreen text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
            >
                <Save size={18} /> Save {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Details
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] bg-[#0f1110] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-300 font-sans">
            
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
                    <TabButton id="overview" label="Overview" icon={FileText} />
                    <TabButton id="assessment" label="Assessment" icon={Shield} />
                    <TabButton id="quote" label="Quote Builder" icon={DollarSign} />
                    {(['Job_Scheduled', 'Job_In_Progress', 'Job_Review', 'Invoiced', 'Completed'].includes(job.status)) && (
                        <TabButton id="execution" label="Execution" icon={Zap} />
                    )}
                    <TabButton id="invoice" label="Invoice & Close" icon={CheckCircle} />
                </div>
                
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
                {/* Header with Help Button */}
                <div className="absolute top-6 right-6 md:right-12 z-40">
                    <button 
                        onClick={() => setShowHelp(!showHelp)} 
                        className="w-10 h-10 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center border border-yellow-500/30 transition-colors"
                        title="Guide for this section"
                    >
                        <HelpCircle size={20} />
                    </button>
                </div>
                
                <HelpModal />

                <div className="max-w-5xl mx-auto p-6 md:p-12 pb-24">
                    
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <h1 className="text-3xl font-black text-white flex items-center gap-3">
                                Job Overview
                                {job.status === 'Assessment' && <button onClick={() => advanceStatus('Quote_Builder')} className="ml-auto bg-pestGreen text-white px-4 py-2 rounded-lg text-sm">Next: Quote</button>}
                            </h1>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Client Info */}
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 space-y-4">
                                    <h3 className="text-pestGreen font-bold uppercase text-xs tracking-wider flex items-center gap-2"><User size={14}/> Client Details</h3>
                                    <Input label="Client Name" value={job.clientName} onChange={(v: string) => handleSaveJob({ clientName: v })} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Email" value={job.email} onChange={(v: string) => handleSaveJob({ email: v })} />
                                        <Input label="Phone" value={job.contactNumber} onChange={(v: string) => handleSaveJob({ contactNumber: v })} />
                                    </div>
                                    <Input label="Alt Contact" value={job.contactNumberAlt || ''} onChange={(v: string) => handleSaveJob({ contactNumberAlt: v })} />
                                    <Input label="Business Name (Optional)" value={job.clientCompanyName || ''} onChange={(v: string) => handleSaveJob({ clientCompanyName: v })} />
                                </div>

                                {/* Location Info */}
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 space-y-4">
                                    <h3 className="text-pestGreen font-bold uppercase text-xs tracking-wider flex items-center gap-2"><MapPin size={14}/> Site Location</h3>
                                    <Input label="Street" value={job.clientAddressDetails.street} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, street: v } })} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Suburb" value={job.clientAddressDetails.suburb} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, suburb: v } })} />
                                        <Input label="City" value={job.clientAddressDetails.city} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, city: v } })} />
                                    </div>
                                    <Input label="Gate / Access Codes" value={job.siteAccessCodes || ''} onChange={(v: string) => handleSaveJob({ siteAccessCodes: v })} placeholder="e.g. Key under mat, Gate: 12345" />
                                </div>
                                
                                {/* Scheduling */}
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 space-y-4 md:col-span-2">
                                    <h3 className="text-pestGreen font-bold uppercase text-xs tracking-wider flex items-center gap-2"><Calendar size={14}/> Schedule & Tech</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Input label="Assessment Date" type="date" value={job.assessmentDate.split('T')[0]} onChange={(v: string) => handleSaveJob({ assessmentDate: new Date(v).toISOString() })} />
                                        <Input label="Service Date" type="date" value={job.serviceDate ? job.serviceDate.split('T')[0] : ''} onChange={(v: string) => handleSaveJob({ serviceDate: new Date(v).toISOString() })} />
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Assigned Tech</label>
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

                            <SaveBar onSave={() => alert('Overview Details Saved!')} />
                        </div>
                    )}

                    {/* ASSESSMENT TAB */}
                    {activeTab === 'assessment' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                             <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-black text-white flex items-center gap-3"><Shield size={32} className="text-pestGreen"/> Site Assessment</h1>
                                {job.status === 'Assessment' && <button onClick={() => advanceStatus('Quote_Builder')} className="bg-white text-pestBrown hover:bg-pestGreen hover:text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">Complete & Quote <ArrowRight size={16}/></button>}
                             </div>

                             {/* SCANNER MODAL */}
                             {showScanner && (
                                 <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-4">
                                     <button onClick={() => setShowScanner(false)} className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full"><X size={32}/></button>
                                     <div id="reader" className="w-full max-w-sm bg-white rounded-lg overflow-hidden border-4 border-pestGreen"></div>
                                     <p className="text-white mt-4 font-bold text-lg animate-pulse">Scanning...</p>
                                     {scannerError && <p className="text-red-500 mt-2">{scannerError}</p>}
                                 </div>
                             )}

                             {/* Add Checkpoint Form */}
                             <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 shadow-2xl">
                                 <div className="flex items-center justify-between mb-6">
                                     <h3 className="text-white font-bold text-lg">Add New Finding</h3>
                                     <div className="flex gap-2">
                                        <button onClick={printQRCodes} className="bg-white/10 hover:bg-white text-white hover:text-pestBrown px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-white/10">
                                            <Printer size={14} /> Print Checkpoint QRs
                                        </button>
                                        <button onClick={() => setShowScanner(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg">
                                            <QrCode size={14} /> Scan Existing QR
                                        </button>
                                     </div>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                     <Input label="Area Name" value={newCheckpoint.area} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, area: v }))} placeholder="e.g. Kitchen Cupboard" />
                                     <Input label="Pest Found" value={newCheckpoint.pestType} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, pestType: v }))} placeholder="e.g. German Cockroach" />
                                     <Select label="Severity" value={newCheckpoint.severity} options={[{label:'Low',value:'Low'},{label:'Medium',value:'Medium'},{label:'High',value:'High'}]} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, severity: v as any }))} />
                                 </div>
                                 <div className="mb-4">
                                    <TextArea label="Notes / Observations" value={newCheckpoint.notes} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, notes: v }))} rows={2} placeholder="Describe the infestation level and evidence found..." />
                                 </div>
                                 <div className="mb-6">
                                     <FileUpload 
                                        label="Attach Evidence Photos" 
                                        value={newCheckpoint.photos} 
                                        onChange={(v: string[]) => setNewCheckpoint(prev => ({ ...prev, photos: v }))} 
                                        multiple={true}
                                        capture="environment"
                                     />
                                 </div>
                                 <button onClick={addCheckpoint} className="w-full bg-pestGreen hover:bg-white hover:text-pestGreen text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg">
                                     <Plus size={20}/> Add Checkpoint
                                 </button>
                             </div>

                             {/* List Checkpoints */}
                             <div className="grid grid-cols-1 gap-4">
                                 {job.checkpoints.map((cp, idx) => (
                                     <div key={cp.id} className="bg-[#161817] border-l-4 border-l-pestGreen border-y border-r border-white/5 rounded-r-xl p-6 relative flex flex-col md:flex-row gap-6 items-start">
                                         <button onClick={() => { handleSaveJob({ checkpoints: job.checkpoints.filter(c => c.id !== cp.id) }) }} className="absolute top-4 right-4 text-gray-600 hover:text-red-500"><Trash2 size={16}/></button>
                                         
                                         <div className="flex-shrink-0">
                                            <div className="w-20 h-20 bg-white p-2 rounded-lg">
                                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cp.code}`} alt="QR" className="w-full h-full" />
                                            </div>
                                         </div>

                                         <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="text-xl font-bold text-white">{cp.area}</h4>
                                                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${cp.severity === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-pestGreen/20 text-pestGreen'}`}>{cp.pestType} • {cp.severity} Priority</span>
                                                </div>
                                                <span className="text-xs text-gray-600 font-mono mr-8">{cp.code}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-4">{cp.notes}</p>
                                            {cp.photos && cp.photos.length > 0 && (
                                                <div className="flex gap-2 flex-wrap">
                                                    {cp.photos.map((photo, i) => (
                                                        <img key={i} src={photo} alt="Finding" className="w-16 h-16 rounded-lg object-cover border border-white/10 cursor-pointer hover:scale-110 transition-transform" />
                                                    ))}
                                                </div>
                                            )}
                                         </div>
                                     </div>
                                 ))}
                                 {job.checkpoints.length === 0 && <p className="text-center text-gray-500 py-8 italic border border-dashed border-white/10 rounded-2xl">No findings recorded yet. Add checkpoints above.</p>}
                             </div>

                             <SaveBar onSave={() => alert('Assessment Saved!')} />
                        </div>
                    )}

                    {/* QUOTE TAB */}
                    {activeTab === 'quote' && (
                         <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                             <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-black text-white flex items-center gap-3"><DollarSign size={32} className="text-pestGreen"/> Quote Builder</h1>
                                
                                {isAdmin && job.status === 'Quote_Builder' && (
                                    <div className="flex gap-2">
                                        <button className="bg-white/10 text-white px-4 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 hover:bg-white/20"><Download size={16}/> Print PDF</button>
                                        <button onClick={() => advanceStatus('Job_Scheduled')} className="bg-pestGreen text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg">Approve & Schedule <ArrowRight size={16}/></button>
                                    </div>
                                )}
                                
                                {!isAdmin && job.status === 'Quote_Builder' && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2">
                                        <Lock size={14} /> Pending Admin Approval
                                    </div>
                                )}
                             </div>

                             {/* Quote Summary Table */}
                             <div className={`bg-[#161817] border border-white/5 rounded-2xl overflow-hidden shadow-2xl ${!isAdmin ? 'opacity-80' : ''}`}>
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
                                                 <td className="p-4 font-medium">{item.name}</td>
                                                 <td className="p-4 text-center">{item.qty}</td>
                                                 <td className="p-4 text-right">R {item.unitPrice.toFixed(2)}</td>
                                                 <td className="p-4 text-right font-bold text-pestGreen">R {item.total.toFixed(2)}</td>
                                                 {isAdmin && <td className="p-4 text-center"><button onClick={() => { 
                                                     const updated = job.quote.lineItems.filter(i => i.id !== item.id);
                                                     const sub = updated.reduce((a,b) => a+b.total, 0);
                                                     handleSaveJob({ quote: { ...job.quote, lineItems: updated, subtotal: sub, total: sub * (1 + job.quote.vatRate) } });
                                                 }} className="text-gray-600 hover:text-red-500"><Trash2 size={14}/></button></td>}
                                             </tr>
                                         ))}
                                         {/* Add Row - ADMIN ONLY */}
                                         {isAdmin && (
                                             <tr className="bg-white/5">
                                                 <td className="p-2"><input type="text" placeholder="Item Description" value={newLineItem.name} onChange={e => setNewLineItem(prev => ({...prev, name: e.target.value}))} className="w-full bg-transparent p-2 outline-none text-white placeholder-gray-600 border-b border-transparent focus:border-pestGreen transition-colors" /></td>
                                                 <td className="p-2"><input type="number" min="1" value={newLineItem.qty} onChange={e => setNewLineItem(prev => ({...prev, qty: parseInt(e.target.value)}))} className="w-full bg-transparent p-2 outline-none text-white text-center border-b border-transparent focus:border-pestGreen transition-colors" /></td>
                                                 <td className="p-2"><input type="number" min="0" value={newLineItem.unitPrice} onChange={e => setNewLineItem(prev => ({...prev, unitPrice: parseFloat(e.target.value)}))} className="w-full bg-transparent p-2 outline-none text-white text-right border-b border-transparent focus:border-pestGreen transition-colors" /></td>
                                                 <td className="p-2 text-right text-gray-500">-</td>
                                                 <td className="p-2 text-center">
                                                     <button onClick={() => {
                                                         if(!newLineItem.name) return;
                                                         const item: QuoteLineItem = { id: Date.now().toString(), name: newLineItem.name!, qty: newLineItem.qty||1, unitPrice: newLineItem.unitPrice||0, total: (newLineItem.qty||1)*(newLineItem.unitPrice||0) };
                                                         const updated = [...job.quote.lineItems, item];
                                                         const sub = updated.reduce((a,b) => a+b.total, 0);
                                                         handleSaveJob({ quote: { ...job.quote, lineItems: updated, subtotal: sub, total: sub * (1 + job.quote.vatRate) } });
                                                         setNewLineItem({ name: '', qty: 1, unitPrice: 0 });
                                                     }} className="bg-pestGreen text-white p-2 rounded hover:bg-white hover:text-pestGreen transition-colors"><Plus size={14}/></button>
                                                </td>
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
                                             <td colSpan={3} className="p-4 text-right font-black text-xl text-pestGreen">TOTAL</td>
                                             <td className="p-4 text-right font-black text-xl text-pestGreen">R {job.quote.total.toFixed(2)}</td>
                                             <td></td>
                                         </tr>
                                     </tfoot>
                                 </table>
                             </div>
                             
                             <div className="bg-[#161817] border border-white/5 rounded-2xl p-6">
                                 {isAdmin ? (
                                    <TextArea label="Quote Terms & Conditions" value={job.quote.notes} onChange={(v: string) => handleSaveJob({ quote: { ...job.quote, notes: v } })} placeholder="e.g. 50% Deposit required. Valid for 7 days." />
                                 ) : (
                                     <div>
                                         <label className="text-xs font-bold text-gray-500 uppercase">Quote Notes</label>
                                         <p className="text-gray-400 text-sm mt-1 bg-black/20 p-4 rounded-xl">{job.quote.notes || 'No notes available.'}</p>
                                     </div>
                                 )}
                             </div>

                             <SaveBar onSave={() => alert('Quote Saved!')} />
                         </div>
                    )}

                    {/* EXECUTION TAB */}
                    {activeTab === 'execution' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-black text-white flex items-center gap-3"><Zap size={32} className="text-pestGreen"/> Job Execution</h1>
                                {job.status === 'Job_Scheduled' && <button onClick={() => advanceStatus('Job_In_Progress')} className="bg-pestGreen text-white px-6 py-3 rounded-xl font-bold shadow-neon">Start Job Timer</button>}
                                {job.status === 'Job_In_Progress' && <button onClick={() => advanceStatus('Invoiced')} className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors">Complete & Sign Off</button>}
                            </div>

                            {/* SCANNER MODAL */}
                             {showScanner && (
                                 <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-4">
                                     <button onClick={() => setShowScanner(false)} className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full"><X size={32}/></button>
                                     <div id="reader" className="w-full max-w-sm bg-white rounded-lg overflow-hidden border-4 border-pestGreen"></div>
                                     <p className="text-white mt-4 font-bold text-lg animate-pulse">Scanning Station QR...</p>
                                 </div>
                             )}

                            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex flex-col md:flex-row items-center gap-3 text-blue-400">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={20} />
                                    <span className="font-bold">Instructions:</span>
                                </div>
                                <span className="text-sm">Scan the QR code at each station to mark it as treated. Photos are required for High Severity areas.</span>
                                <button onClick={() => setShowScanner(true)} className="ml-auto bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg">
                                    <QrCode size={16} /> Open Scanner
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {job.checkpoints.map((cp) => (
                                    <div key={cp.id} className={`border rounded-xl p-6 transition-all ${cp.isTreated ? 'bg-green-900/10 border-green-500/30' : 'bg-[#161817] border-white/10'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                                                    {cp.isTreated ? <CheckCircle className="text-green-500" size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>}
                                                    {cp.area}
                                                </h4>
                                                <p className="text-sm text-gray-400 mt-1">Target: <span className="text-pestGreen font-bold">{cp.pestType}</span></p>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                     const updated = job.checkpoints.map(c => c.id === cp.id ? {...c, isTreated: !c.isTreated, timestamp: new Date().toISOString() } : c);
                                                     handleSaveJob({ checkpoints: updated });
                                                }}
                                                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase ${cp.isTreated ? 'bg-green-500 text-white shadow-lg' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                                            >
                                                {cp.isTreated ? 'Verified Treated' : 'Mark Manual'}
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <TextArea 
                                                label="Treatment Chemical & Dosage" 
                                                placeholder="e.g. Applied 5g Maxforce Gel" 
                                                value={cp.treatmentNotes || ''} 
                                                onChange={(v: string) => {
                                                     const updated = job.checkpoints.map(c => c.id === cp.id ? {...c, treatmentNotes: v } : c);
                                                     handleSaveJob({ checkpoints: updated });
                                                }} 
                                                rows={1} 
                                            />
                                            <FileUpload 
                                                label="Proof of Treatment (Photo)" 
                                                value={cp.servicePhotos} 
                                                onChange={(v: string[]) => {
                                                     const updated = job.checkpoints.map(c => c.id === cp.id ? {...c, servicePhotos: v } : c);
                                                     handleSaveJob({ checkpoints: updated });
                                                }} 
                                                multiple={true}
                                                capture="environment"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <SaveBar onSave={() => alert('Execution Progress Saved!')} />
                        </div>
                    )}
                    
                    {/* INVOICE TAB */}
                    {activeTab === 'invoice' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pt-10">
                             <div className="text-center">
                                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon border border-green-500/50">
                                    <CheckCircle className="text-green-500 w-12 h-12" />
                                </div>
                                <h1 className="text-4xl font-black text-white mb-2">Job Completed</h1>
                                <p className="text-gray-400 max-w-md mx-auto">The job has been reviewed and closed by the technician. You can now generate the tax invoice or archive this card.</p>
                             </div>

                             <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 max-w-2xl mx-auto space-y-4">
                                <h3 className="text-white font-bold border-b border-white/5 pb-2">Final Review</h3>
                                <div className="flex justify-between text-sm text-gray-300">
                                    <span>Total Checkpoints:</span>
                                    <span className="font-bold text-white">{job.checkpoints.length}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-300">
                                    <span>Treated Successfully:</span>
                                    <span className="font-bold text-pestGreen">{job.checkpoints.filter(c => c.isTreated).length}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-300 border-t border-white/5 pt-2">
                                    <span>Invoice Total:</span>
                                    <span className="font-black text-xl text-white">R {job.quote.total.toFixed(2)}</span>
                                </div>
                                
                                <div className="pt-4">
                                    <TextArea label="Billing Notes / Payment Method" value={job.billingNotes || ''} onChange={(v: string) => handleSaveJob({ billingNotes: v })} placeholder="e.g. Client paid via EFT, proof attached." />
                                </div>
                             </div>
                             
                             <div className="flex justify-center gap-4">
                                 <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors"><FileText size={18}/> Download Invoice PDF</button>
                                 <button onClick={() => { handleSaveJob({ status: 'Completed' }); onClose(); }} className="bg-pestGreen text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-white hover:text-pestGreen transition-colors flex items-center gap-2">
                                     <CheckCircle size={18} /> Archive & Close Job
                                 </button>
                             </div>

                             <SaveBar onSave={() => alert('Invoice Details Saved!')} />
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};