
import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { JobCard, Checkpoint, QuoteLineItem, JobStatus, Employee } from '../types';
import { X, Save, Plus, Trash2, CheckCircle, AlertTriangle, FileText, DollarSign, PenTool, Camera, MapPin, Calendar, User, Phone, Mail, ArrowRight, Shield, Zap, Lock, Download, QrCode, Printer, HelpCircle, Info, Calculator, Percent, Clock, Cloud, Thermometer, Box, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, TextArea, Select, FileUpload } from './ui/AdminShared';

interface JobCardManagerProps {
    jobId: string;
    currentUser: Employee | null;
    onClose: () => void;
}

const COMMON_PESTS = ['German Cockroach', 'American Cockroach', 'Ants (Sugar)', 'Termites (Subterranean)', 'Rodents (Rat)', 'Rodents (Mouse)', 'Bed Bugs', 'Flies', 'Fleas'];
const COMMON_ROOT_CAUSES = ['Hygiene Issue', 'Structural Gaps', 'Imported Goods', 'Moisture Problem', 'Overgrown Vegetation', 'Waste Management', 'Neighboring Property'];
const COMMON_RECOMMENDATIONS = ['Seal Cracks', 'Improve Sanitation', 'Cut Back Trees', 'Install Door Sweeps', 'Remove Clutter', 'Clean Drains', 'Proofing Required'];
const COMMON_PPE = ['Gloves', 'Respirator Mask', 'Safety Goggles', 'Coveralls', 'Safety Boots', 'Ear Protection'];
const SAFETY_CHECKLIST_ITEMS = ["Pets Removed", "Food Covered/Removed", "Windows Closed", "Smoke Detectors Covered", "Aquariums Covered", "Children Away from Area"];

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
    const [newCheckpoint, setNewCheckpoint] = useState<Partial<Checkpoint>>({ 
        area: '', pestType: '', severity: 'Low', notes: '', photos: [], 
        rootCause: '', accessNotes: '', recommendation: '', 
        infestationLevel: 'Low', actionPriority: 'Routine' 
    });
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
            rootCause: newCheckpoint.rootCause || '',
            accessNotes: newCheckpoint.accessNotes || '',
            recommendation: newCheckpoint.recommendation || '',
            photos: newCheckpoint.photos || [],
            timestamp: new Date().toISOString(),
            isTreated: false,
            infestationLevel: newCheckpoint.infestationLevel as any || 'Low',
            actionPriority: newCheckpoint.actionPriority as any || 'Routine'
        };
        handleSaveJob({ checkpoints: [...job.checkpoints, checkpoint] });
        setNewCheckpoint({ area: '', pestType: '', severity: 'Low', notes: '', photos: [], rootCause: '', accessNotes: '', recommendation: '', infestationLevel: 'Low', actionPriority: 'Routine' });
    };

    const generatePrintDocument = (type: 'QUOTE' | 'INVOICE') => {
        // ... (Print Logic remains same)
        const win = window.open('', '', 'width=900,height=1200');
        if (!win) return;
        const company = content.company;
        const bank = content.bankDetails;
        const styles = `
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 40px; font-size: 14px; }
                .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #4CAF50; padding-bottom: 20px; }
                .logo { max-height: 80px; }
                .company-info { text-align: right; }
                .company-info h1 { margin: 0 0 5px 0; color: #4CAF50; }
                .bill-to { margin-bottom: 30px; }
                .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                .table th { background: #f0f0f0; text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }
                .table td { padding: 10px; border-bottom: 1px solid #ddd; }
                .totals { float: right; width: 300px; }
                .totals-row { display: flex; justify-content: space-between; padding: 5px 0; }
                .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
                .section-title { font-size: 16px; font-weight: bold; color: #4CAF50; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                .bank-details { margin-top: 40px; padding: 15px; background: #f9f9f9; border-left: 4px solid #4CAF50; font-size: 12px; }
                .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
                .findings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .finding-card { border: 1px solid #eee; padding: 10px; page-break-inside: avoid; }
                .status-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; color: white; }
                .status-high { background: #ef4444; }
                .status-med { background: #f59e0b; }
                .status-low { background: #10b981; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        `;
        // ... (rest of print logic unchanged for brevity as requested change is layout)
        const findingsHtml = job.checkpoints.map(cp => `
            <div class="finding-card">
                <strong>${cp.area}</strong> 
                <span class="status-badge status-${cp.severity === 'High' ? 'high' : cp.severity === 'Medium' ? 'med' : 'low'}">${cp.severity}</span>
                <br/>
                <small>Pest: ${cp.pestType} | Level: ${cp.infestationLevel}</small>
                <p style="margin: 5px 0; font-style:italic;">${cp.notes}</p>
                ${cp.recommendation ? `<p style="margin: 5px 0; color: #4CAF50;"><strong>Rec:</strong> ${cp.recommendation}</p>` : ''}
            </div>
        `).join('');

        const lineItemsHtml = job.quote.lineItems.map(item => `
            <tr>
                <td>${item.name}</td>
                <td style="text-align:center">${item.qty}</td>
                <td style="text-align:right">R ${item.unitPrice.toFixed(2)}</td>
                <td style="text-align:right">R ${item.total.toFixed(2)}</td>
            </tr>
        `).join('');

        win.document.write(`
            <html>
                <head><title>${type === 'QUOTE' ? 'Quotation' : 'Tax Invoice'} - ${job.refNumber}</title>${styles}</head>
                <body>
                    <div class="header">
                        <div>
                            ${company.logo ? `<img src="${company.logo}" class="logo"/>` : `<h2>${company.name}</h2>`}
                        </div>
                        <div class="company-info">
                            <h1>${type === 'QUOTE' ? 'QUOTATION' : 'TAX INVOICE'}</h1>
                            <p><strong>Ref:</strong> ${job.refNumber}</p>
                            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                            <p>${company.address}</p>
                            <p>${company.email} | ${company.phone}</p>
                            ${company.regNumber ? `<p>Reg: ${company.regNumber}</p>` : ''}
                            ${company.vatNumber ? `<p>VAT: ${company.vatNumber}</p>` : ''}
                        </div>
                    </div>

                    <div class="bill-to">
                        <h3>Bill To:</h3>
                        <p><strong>${job.clientName}</strong> ${job.clientCompanyName ? `(${job.clientCompanyName})` : ''}</p>
                        <p>${job.clientAddressDetails.street}, ${job.clientAddressDetails.suburb}</p>
                        <p>${job.clientAddressDetails.city}, ${job.clientAddressDetails.postalCode}</p>
                        <p>${job.email} | ${job.contactNumber}</p>
                        ${job.clientVatNumber ? `<p>Client VAT: ${job.clientVatNumber}</p>` : ''}
                    </div>

                    <table class="table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th style="text-align:center">Qty</th>
                                <th style="text-align:right">Unit Price</th>
                                <th style="text-align:right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${lineItemsHtml}
                        </tbody>
                    </table>

                    <div class="totals">
                        <div class="totals-row"><span>Subtotal:</span> <span>R ${job.quote.subtotal.toFixed(2)}</span></div>
                        <div class="totals-row"><span>VAT (${(job.quote.vatRate*100).toFixed(0)}%):</span> <span>R ${(job.quote.subtotal * job.quote.vatRate).toFixed(2)}</span></div>
                        <div class="totals-row grand-total"><span>TOTAL:</span> <span>R ${job.quote.total.toFixed(2)}</span></div>
                    </div>
                    <div style="clear:both;"></div>

                    ${type === 'QUOTE' ? `
                    <div class="bank-details">
                        <h4>Banking Details for Deposit</h4>
                        <p><strong>Bank:</strong> ${bank.bankName}</p>
                        <p><strong>Account Name:</strong> ${bank.accountName}</p>
                        <p><strong>Account No:</strong> ${bank.accountNumber}</p>
                        <p><strong>Branch Code:</strong> ${bank.branchCode}</p>
                        <p><strong>Reference:</strong> ${job.refNumber}</p>
                    </div>
                    ` : ''}

                    <div class="section-title">Site Assessment Report</div>
                    <p style="margin-bottom:15px;">The following findings were noted during our inspection of the property.</p>
                    <div class="findings-grid">
                        ${findingsHtml}
                    </div>

                    ${type === 'INVOICE' && job.status === 'Completed' ? `
                        <div class="section-title">Execution Report</div>
                        <p><strong>Technician:</strong> ${content.employees.find(e => e.id === job.technicianId)?.fullName || 'N/A'}</p>
                        <p><strong>Date Completed:</strong> ${new Date().toLocaleDateString()}</p>
                        <p><strong>Chemicals Used:</strong> ${job.checkpoints.map(c => c.chemicalUsed).filter(Boolean).join(', ') || 'Standard Application'}</p>
                    ` : ''}

                    <div class="footer">
                        <p>Terms & Conditions Apply. ${company.name} is a registered service provider.</p>
                        <p>Thank you for your business!</p>
                    </div>
                </body>
            </html>
        `);
        win.document.close();
    };

    const printQRCodes = () => {
         // ... (QR Print logic remains same)
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
        win.document.write(`<html><head><title>Print QR Codes</title></head><body>${qrHtml}<script>window.onload=function(){window.print()}</script></body></html>`);
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

    const SaveBar = ({ onSave }: { onSave: () => void }) => (
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between sticky bottom-0 bg-[#0f1110] pb-4 z-10">
            <span className="text-xs text-gray-500 italic flex items-center gap-1"><Info size={12}/> Changes are local until saved.</span>
            <button 
                onClick={onSave}
                className="bg-pestGreen hover:bg-white hover:text-pestGreen text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
            >
                <Save size={18} /> Save Details
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] bg-[#0f1110] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-300 font-sans w-screen">
            
            {/* Sidebar Navigation (Desktop) */}
            <aside className="hidden md:flex w-full md:w-64 bg-[#161817] border-r border-white/5 flex-col flex-shrink-0">
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

             {/* Mobile Header with Close */}
             <div className="md:hidden flex items-center justify-between p-4 bg-[#161817] border-b border-white/5">
                <div className="flex items-center gap-2">
                    <h2 className="text-white font-black text-sm">{job.refNumber}</h2>
                    <StatusBadge status={job.status} />
                </div>
                <button onClick={onClose} className="text-gray-500 bg-white/10 p-2 rounded-full"><X size={20}/></button>
            </div>

            {/* Mobile Tab Nav Horizontal */}
            <div className="md:hidden flex overflow-x-auto gap-2 p-2 bg-[#0f1110] border-b border-white/5 scrollbar-hide">
                 <button onClick={() => setActiveTab('overview')} className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold ${activeTab === 'overview' ? 'bg-pestGreen text-white' : 'bg-white/5 text-gray-400'}`}>Overview</button>
                 <button onClick={() => setActiveTab('assessment')} className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold ${activeTab === 'assessment' ? 'bg-pestGreen text-white' : 'bg-white/5 text-gray-400'}`}>Assessment</button>
                 <button onClick={() => setActiveTab('quote')} className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold ${activeTab === 'quote' ? 'bg-pestGreen text-white' : 'bg-white/5 text-gray-400'}`}>Quote</button>
                 {(['Job_Scheduled', 'Job_In_Progress', 'Job_Review', 'Invoiced', 'Completed'].includes(job.status)) && (
                    <button onClick={() => setActiveTab('execution')} className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold ${activeTab === 'execution' ? 'bg-pestGreen text-white' : 'bg-white/5 text-gray-400'}`}>Execution</button>
                 )}
                 <button onClick={() => setActiveTab('invoice')} className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold ${activeTab === 'invoice' ? 'bg-pestGreen text-white' : 'bg-white/5 text-gray-400'}`}>Invoice</button>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-[#0f1110] relative">
                
                <div className="max-w-5xl mx-auto p-4 md:p-12 pb-24">
                    
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <h1 className="text-3xl font-black text-white flex items-center gap-3">
                                Job Overview
                                {job.status === 'Assessment' && <button onClick={() => advanceStatus('Quote_Builder')} className="ml-auto bg-pestGreen text-white px-4 py-2 rounded-lg text-sm">Next: Quote</button>}
                            </h1>
                            
                            <div className="grid grid-cols-2 gap-3 md:gap-6">
                                {/* Client Info - 2 COL ON MOBILE */}
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-4 space-y-4 col-span-2 md:col-span-1">
                                    <h3 className="text-pestGreen font-bold uppercase text-xs tracking-wider flex items-center gap-2"><User size={14}/> Client Details</h3>
                                    <Input label="Client Name" value={job.clientName} onChange={(v: string) => handleSaveJob({ clientName: v })} />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input label="Email" value={job.email} onChange={(v: string) => handleSaveJob({ email: v })} />
                                        <Input label="Phone" value={job.contactNumber} onChange={(v: string) => handleSaveJob({ contactNumber: v })} />
                                    </div>
                                    <Input label="Alt Contact" value={job.contactNumberAlt || ''} onChange={(v: string) => handleSaveJob({ contactNumberAlt: v })} />
                                    <Input label="Business Name" value={job.clientCompanyName || ''} onChange={(v: string) => handleSaveJob({ clientCompanyName: v })} />
                                </div>

                                {/* Location Info - 2 COL ON MOBILE */}
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-4 space-y-4 col-span-2 md:col-span-1">
                                    <h3 className="text-pestGreen font-bold uppercase text-xs tracking-wider flex items-center gap-2"><MapPin size={14}/> Site Location</h3>
                                    <Input label="Street" value={job.clientAddressDetails.street} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, street: v } })} />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input label="Suburb" value={job.clientAddressDetails.suburb} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, suburb: v } })} />
                                        <Input label="City" value={job.clientAddressDetails.city} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, city: v } })} />
                                    </div>
                                    <Input label="Postal Code" value={job.clientAddressDetails.postalCode} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, postalCode: v } })} />
                                    <Input label="Gate Code" value={job.siteAccessCodes || ''} onChange={(v: string) => handleSaveJob({ siteAccessCodes: v })} />
                                </div>
                                
                                {/* Scheduling - FULL WIDTH (2 COL) */}
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-4 space-y-4 col-span-2">
                                    <h3 className="text-pestGreen font-bold uppercase text-xs tracking-wider flex items-center gap-2"><Calendar size={14}/> Schedule & Tech</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                                        <Input label="Assessment Date" type="date" value={job.assessmentDate.split('T')[0]} onChange={(v: string) => handleSaveJob({ assessmentDate: new Date(v).toISOString() })} />
                                        <Input label="Service Date" type="date" value={job.serviceDate ? job.serviceDate.split('T')[0] : ''} onChange={(v: string) => handleSaveJob({ serviceDate: new Date(v).toISOString() })} />
                                        <div className="space-y-1 col-span-2 md:col-span-1">
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
                                            <Printer size={14} /> Print QRs
                                        </button>
                                        <button onClick={() => setShowScanner(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg">
                                            <QrCode size={14} /> Scan QR
                                        </button>
                                     </div>
                                 </div>
                                 
                                 <div className="mb-6 space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Quick Select Pest</label>
                                    <div className="flex flex-wrap gap-2">
                                        {COMMON_PESTS.map(p => (
                                            <button key={p} onClick={() => setNewCheckpoint(prev => ({ ...prev, pestType: p }))} className={`text-xs px-3 py-1 rounded-full border transition-colors ${newCheckpoint.pestType === p ? 'bg-pestGreen text-white border-pestGreen' : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'}`}>
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                     <div className="col-span-1"><Input label="Area Name" value={newCheckpoint.area} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, area: v }))} placeholder="e.g. Kitchen Cupboard" /></div>
                                     <div className="col-span-1"><Input label="Pest Found" value={newCheckpoint.pestType} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, pestType: v }))} placeholder="e.g. German Cockroach" /></div>
                                     <div className="col-span-2 md:col-span-1"><Select label="Infestation Level" value={newCheckpoint.infestationLevel} options={[{label:'Trace',value:'Trace'},{label:'Low',value:'Low'},{label:'Medium',value:'Medium'},{label:'High',value:'High'},{label:'Severe',value:'Severe'}]} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, infestationLevel: v as any }))} /></div>
                                 </div>

                                 <div className="grid grid-cols-2 gap-4 mb-4">
                                     <div className="col-span-1">
                                         <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Root Cause</label>
                                         <select 
                                             value={newCheckpoint.rootCause || ''}
                                             onChange={(e) => setNewCheckpoint(prev => ({ ...prev, rootCause: e.target.value }))}
                                             className="w-full p-3 bg-[#0f1110] border border-white/10 rounded-xl text-white focus:border-pestGreen outline-none mb-2"
                                         >
                                             <option value="">Select Root Cause...</option>
                                             {COMMON_ROOT_CAUSES.map(rc => <option key={rc} value={rc}>{rc}</option>)}
                                         </select>
                                     </div>
                                     <div className="col-span-1">
                                         <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Recommendation</label>
                                         <select 
                                             value={newCheckpoint.recommendation || ''}
                                             onChange={(e) => setNewCheckpoint(prev => ({ ...prev, recommendation: e.target.value }))}
                                             className="w-full p-3 bg-[#0f1110] border border-white/10 rounded-xl text-white focus:border-pestGreen outline-none mb-2"
                                         >
                                             <option value="">Select Recommendation...</option>
                                             {COMMON_RECOMMENDATIONS.map(rc => <option key={rc} value={rc}>{rc}</option>)}
                                         </select>
                                     </div>
                                 </div>
                                 
                                 <div className="grid grid-cols-2 gap-4 mb-4">
                                     <div className="col-span-1"><Select label="Action Priority" value={newCheckpoint.actionPriority} options={[{label:'Routine',value:'Routine'},{label:'Urgent',value:'Urgent'},{label:'Critical',value:'Critical'}]} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, actionPriority: v as any }))} /></div>
                                     <div className="col-span-1"><Input label="Equipment Needed" value={job.equipmentNeeded ? job.equipmentNeeded.join(', ') : ''} onChange={(v: string) => handleSaveJob({ equipmentNeeded: v.split(',').map(s=>s.trim()) })} placeholder="e.g. Ladder, Thermal Camera..." /></div>
                                 </div>

                                 <div className="mb-4">
                                    <TextArea label="Detailed Notes" value={newCheckpoint.notes} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, notes: v }))} rows={2} placeholder="Describe infestation..." />
                                 </div>

                                 <div className="mb-6">
                                     <FileUpload 
                                        label="Photos" 
                                        value={newCheckpoint.photos} 
                                        onChange={(v: string[]) => setNewCheckpoint(prev => ({ ...prev, photos: v }))} 
                                        multiple={true}
                                        capture="environment"
                                     />
                                 </div>
                                 <button onClick={addCheckpoint} className="w-full bg-pestGreen hover:bg-white hover:text-pestGreen text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg">
                                     <Plus size={20}/> Add Finding
                                 </button>
                             </div>

                             {/* List Checkpoints - GRID 2 COL ON MOBILE */}
                             <div className="grid grid-cols-2 gap-3 md:gap-4">
                                 {job.checkpoints.map((cp, idx) => (
                                     <div key={cp.id} className="bg-[#161817] border-l-4 border-l-pestGreen border-y border-r border-white/5 rounded-r-xl p-4 relative flex flex-col gap-2 col-span-1">
                                         <button 
                                            onClick={() => { 
                                                const updated = job.checkpoints.filter(c => c.id !== cp.id);
                                                handleSaveJob({ checkpoints: updated });
                                            }} 
                                            className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                                         >
                                            <Trash2 size={16}/>
                                         </button>
                                         
                                         <div className="flex gap-2 items-start">
                                            <div className="flex-shrink-0 w-12 h-12 bg-white p-1 rounded-lg">
                                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cp.code}`} alt="QR" className="w-full h-full" />
                                            </div>

                                            <div className="flex-1 overflow-hidden">
                                                <h4 className="text-sm font-bold text-white truncate">{cp.area}</h4>
                                                <div className="flex gap-1 mt-1 flex-wrap">
                                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${cp.actionPriority === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{cp.actionPriority}</span>
                                                </div>
                                            </div>
                                         </div>
                                            
                                        <div className="text-[10px] text-gray-400 space-y-1">
                                            {cp.rootCause && <p><strong>Cause:</strong> {cp.rootCause}</p>}
                                        </div>

                                        <p className="text-gray-300 text-xs bg-white/5 p-2 rounded border border-white/5 line-clamp-2">{cp.notes}</p>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    )}

                    {/* QUOTE TAB - 2 COL ON MOBILE */}
                    {activeTab === 'quote' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                             <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-black text-white flex items-center gap-3"><DollarSign size={32} className="text-pestGreen"/> Quote Builder</h1>
                                {job.status === 'Quote_Builder' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => advanceStatus('Job_Scheduled')} className="bg-white text-pestBrown hover:bg-pestGreen hover:text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 text-sm">Schedule <ArrowRight size={14}/></button>
                                    </div>
                                )}
                             </div>

                             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                 {/* Builder Panel */}
                                 <div className="col-span-2 space-y-6">
                                     <div className="bg-[#161817] border border-white/5 rounded-2xl p-4">
                                        <h3 className="text-white font-bold mb-4">Add Line Item</h3>
                                        <div className="grid grid-cols-4 gap-3 items-end">
                                            <div className="col-span-2">
                                                <Input label="Description" value={newLineItem.name} onChange={(v: string) => setNewLineItem(prev => ({ ...prev, name: v }))} placeholder="Service..." />
                                            </div>
                                            <div className="col-span-1">
                                                <Input label="Qty" type="number" value={newLineItem.qty} onChange={(v: string) => setNewLineItem(prev => ({ ...prev, qty: parseInt(v) }))} />
                                            </div>
                                            <div className="col-span-1">
                                                <Input label="Price" type="number" value={newLineItem.unitPrice} onChange={(v: string) => setNewLineItem(prev => ({ ...prev, unitPrice: parseFloat(v) }))} />
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                if (!newLineItem.name || !newLineItem.unitPrice) return;
                                                const total = (newLineItem.qty || 1) * (newLineItem.unitPrice || 0);
                                                const newItem: QuoteLineItem = { id: Date.now().toString(), name: newLineItem.name!, qty: newLineItem.qty || 1, unitPrice: newLineItem.unitPrice || 0, total };
                                                const updatedItems = [...job.quote.lineItems, newItem];
                                                const subtotal = updatedItems.reduce((acc, i) => acc + i.total, 0);
                                                const totalWithVat = subtotal + (subtotal * job.quote.vatRate);
                                                handleSaveJob({ quote: { ...job.quote, lineItems: updatedItems, subtotal, total: totalWithVat } });
                                                setNewLineItem({ name: '', qty: 1, unitPrice: 0 });
                                            }}
                                            className="mt-4 w-full bg-pestGreen text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                                        >
                                            <Plus size={18} /> Add
                                        </button>
                                     </div>

                                     {/* Simple List for Mobile instead of Table */}
                                     <div className="space-y-2">
                                         {job.quote.lineItems.map((item) => (
                                             <div key={item.id} className="bg-[#161817] p-3 rounded-xl border border-white/5 flex justify-between items-center">
                                                 <div>
                                                     <p className="font-bold text-white text-sm">{item.name}</p>
                                                     <p className="text-xs text-gray-500">{item.qty} x R{item.unitPrice}</p>
                                                 </div>
                                                 <div className="text-right flex items-center gap-3">
                                                     <span className="font-bold text-pestGreen text-sm">R{item.total.toFixed(2)}</span>
                                                     <button onClick={() => {
                                                         const updatedItems = job.quote.lineItems.filter(i => i.id !== item.id);
                                                         const subtotal = updatedItems.reduce((acc, i) => acc + i.total, 0);
                                                         const totalWithVat = subtotal + (subtotal * job.quote.vatRate);
                                                         handleSaveJob({ quote: { ...job.quote, lineItems: updatedItems, subtotal, total: totalWithVat } });
                                                     }} className="text-red-500"><Trash2 size={16}/></button>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>

                                 {/* Totals Panel */}
                                 <div className="col-span-2 md:col-span-1 space-y-6">
                                     <div className="bg-[#161817] border border-white/5 rounded-2xl p-6">
                                         <h3 className="text-white font-bold mb-4">Total</h3>
                                         <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-black text-white">
                                             <span>Total</span>
                                             <span>R {job.quote.total.toFixed(2)}</span>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* EXECUTION TAB */}
                    {activeTab === 'execution' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-black text-white flex items-center gap-3"><Zap size={32} className="text-pestGreen"/> Job Execution</h1>
                                {job.status === 'Job_In_Progress' && <button onClick={() => advanceStatus('Job_Review')} className="bg-white text-pestBrown hover:bg-pestGreen hover:text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 text-sm">Finish <ArrowRight size={14}/></button>}
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:gap-6">
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-4 space-y-4 col-span-2 md:col-span-1">
                                    <h3 className="text-white font-bold border-b border-white/10 pb-2 flex items-center gap-2"><Cloud size={18}/> Log</h3>
                                    <Input label="Weather" value={job.weatherNotes || ''} onChange={(v: string) => handleSaveJob({ weatherNotes: v })} placeholder="e.g. Sunny" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input label="Temp" value={job.temperature || ''} onChange={(v: string) => handleSaveJob({ temperature: v })} />
                                        <Input label="Wind" value={job.windSpeed || ''} onChange={(v: string) => handleSaveJob({ windSpeed: v })} />
                                    </div>
                                </div>

                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-4 space-y-4 col-span-2 md:col-span-1">
                                    <h3 className="text-white font-bold border-b border-white/10 pb-2 flex items-center gap-2"><Shield size={18}/> PPE</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {COMMON_PPE.map(ppe => {
                                            const isActive = (job.ppeUsed || []).includes(ppe);
                                            return (
                                                <button 
                                                    key={ppe}
                                                    onClick={() => {
                                                        const current = job.ppeUsed || [];
                                                        const updated = isActive ? current.filter(p => p !== ppe) : [...current, ppe];
                                                        handleSaveJob({ ppeUsed: updated });
                                                    }}
                                                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${isActive ? 'bg-pestGreen text-white border-pestGreen' : 'bg-white/5 text-gray-400 border-white/10 hover:border-white'}`}
                                                >
                                                    {ppe}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            
                            <SaveBar onSave={() => alert('Execution Details Saved!')} />
                        </div>
                    )}

                    {/* INVOICE TAB */}
                    {activeTab === 'invoice' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <h1 className="text-3xl font-black text-white flex items-center gap-3"><FileCheck size={32} className="text-pestGreen"/> Finalize</h1>
                            <div className="bg-[#161817] border border-white/5 rounded-2xl p-8 text-center space-y-6">
                                <h2 className="text-2xl font-bold text-white">Job Ready</h2>
                                <div className="flex justify-center gap-4 flex-wrap">
                                     <button onClick={() => generatePrintDocument('INVOICE')} className="bg-white text-pestBrown hover:bg-gray-100 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                                         <Printer size={18}/> Print
                                     </button>
                                     <button 
                                        onClick={() => advanceStatus('Completed')}
                                        className="bg-pestGreen text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-neon transition-all"
                                     >
                                         <Lock size={18}/> Close
                                     </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
