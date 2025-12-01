





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
        const win = window.open('', '', 'width=900,height=1200');
        if (!win) return;
    
        const company = content.company;
        const bank = content.bankDetails;
        
        // CSS for print layout
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
                                    <Input label="VAT Number (Optional)" value={job.clientVatNumber || ''} onChange={(v: string) => handleSaveJob({ clientVatNumber: v })} />
                                </div>

                                {/* Location Info */}
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 space-y-4">
                                    <h3 className="text-pestGreen font-bold uppercase text-xs tracking-wider flex items-center gap-2"><MapPin size={14}/> Site Location</h3>
                                    <Input label="Street" value={job.clientAddressDetails.street} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, street: v } })} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Suburb" value={job.clientAddressDetails.suburb} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, suburb: v } })} />
                                        <Input label="City" value={job.clientAddressDetails.city} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, city: v } })} />
                                    </div>
                                    <Input label="Postal Code" value={job.clientAddressDetails.postalCode} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, postalCode: v } })} />
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
                                 
                                 {/* Quick Add Buttons */}
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

                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                     <Input label="Area Name" value={newCheckpoint.area} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, area: v }))} placeholder="e.g. Kitchen Cupboard" />
                                     <Input label="Pest Found" value={newCheckpoint.pestType} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, pestType: v }))} placeholder="e.g. German Cockroach" />
                                     <Select label="Infestation Level" value={newCheckpoint.infestationLevel} options={[{label:'Trace',value:'Trace'},{label:'Low',value:'Low'},{label:'Medium',value:'Medium'},{label:'High',value:'High'},{label:'Severe',value:'Severe'}]} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, infestationLevel: v as any }))} />
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                     <div>
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
                                     <div>
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
                                 
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                     <Select label="Action Priority" value={newCheckpoint.actionPriority} options={[{label:'Routine',value:'Routine'},{label:'Urgent',value:'Urgent'},{label:'Critical',value:'Critical'}]} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, actionPriority: v as any }))} />
                                     <Input label="Equipment Needed" value={job.equipmentNeeded ? job.equipmentNeeded.join(', ') : ''} onChange={(v: string) => handleSaveJob({ equipmentNeeded: v.split(',').map(s=>s.trim()) })} placeholder="e.g. Ladder, Thermal Camera..." />
                                 </div>

                                 <div className="mb-4">
                                    <TextArea label="Detailed Notes / Observations" value={newCheckpoint.notes} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, notes: v }))} rows={2} placeholder="Describe the infestation level and evidence found..." />
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
                                     <Plus size={20}/> Add Finding
                                 </button>
                             </div>

                             {/* List Checkpoints */}
                             <div className="grid grid-cols-1 gap-4">
                                 {job.checkpoints.map((cp, idx) => (
                                     <div key={cp.id} className="bg-[#161817] border-l-4 border-l-pestGreen border-y border-r border-white/5 rounded-r-xl p-6 relative flex flex-col md:flex-row gap-6 items-start">
                                         <button 
                                            onClick={() => { 
                                                const updated = job.checkpoints.filter(c => c.id !== cp.id);
                                                handleSaveJob({ checkpoints: updated });
                                            }} 
                                            className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
                                         >
                                            <Trash2 size={16}/>
                                         </button>
                                         
                                         <div className="flex-shrink-0">
                                            <div className="w-20 h-20 bg-white p-2 rounded-lg">
                                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cp.code}`} alt="QR" className="w-full h-full" />
                                            </div>
                                         </div>

                                         <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="text-xl font-bold text-white">{cp.area}</h4>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${cp.actionPriority === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{cp.actionPriority}</span>
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${cp.infestationLevel === 'Severe' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>Level: {cp.infestationLevel}</span>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-600 font-mono mr-8">{cp.code}</span>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400 mb-2">
                                                {cp.rootCause && <p><strong>Root Cause:</strong> {cp.rootCause}</p>}
                                                {cp.recommendation && <p><strong>Rec:</strong> {cp.recommendation}</p>}
                                            </div>

                                            <p className="text-gray-300 text-sm mb-4 bg-white/5 p-2 rounded border border-white/5">{cp.notes}</p>
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
                                
                                <div className="flex gap-2">
                                    <button onClick={() => generatePrintDocument('QUOTE')} className="bg-white/10 text-white px-4 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 hover:bg-white/20">
                                        <Printer size={16}/> Print Quote
                                    </button>
                                    
                                    {isAdmin && job.status === 'Quote_Builder' && (
                                        <button onClick={() => advanceStatus('Job_Scheduled')} className="bg-pestGreen text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg">
                                            Approve & Schedule <ArrowRight size={16}/>
                                        </button>
                                    )}
                                </div>
                             </div>

                             {/* Quote Summary Table */}
                             <div className={`bg-[#161817] border border-white/5 rounded-2xl overflow-hidden shadow-2xl ${!isAdmin ? 'opacity-80' : ''}`}>
                                 <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                                    <h3 className="text-white font-bold">Line Items</h3>
                                    {isAdmin && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-400 uppercase">VAT Rate:</span>
                                            <input 
                                                type="number" 
                                                step="0.01"
                                                value={job.quote.vatRate * 100}
                                                onChange={(e) => {
                                                    const newRate = parseFloat(e.target.value) / 100;
                                                    const sub = job.quote.subtotal;
                                                    handleSaveJob({ quote: { ...job.quote, vatRate: newRate, total: sub * (1 + newRate) } });
                                                }}
                                                className="w-16 bg-black/30 border border-white/10 rounded px-2 py-1 text-white text-xs text-center"
                                            />
                                            <span className="text-gray-500">%</span>
                                        </div>
                                    )}
                                 </div>
                                 <table className="w-full text-left border-collapse">
                                     <thead>
                                         <tr className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
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
                                             <tr className="bg-pestGreen/5">
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
                                             <td colSpan={3} className="p-4 text-right font-bold text-gray-400">VAT ({(job.quote.vatRate * 100).toFixed(0)}%)</td>
                                             <td className="p-4 text-right font-bold">R {(job.quote.subtotal * job.quote.vatRate).toFixed(2)}</td>
                                             <td></td>
                                         </tr>
                                         <tr className="bg-pestGreen/10">
                                             <td colSpan={3} className="p-4 text-right font-black text-xl text-pestGreen">TOTAL</td>
                                             <td className="p-4 text-right font-black text-xl text-pestGreen">R {job.quote.total.toFixed(2)}</td>
                                             <td></td>
                                         </tr>
                                     </tfoot>
                                 </table>
                             </div>
                             
                             {/* DETAILED QUOTE TERMS */}
                             <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                    <h4 className="text-white font-bold mb-4">Terms of Service</h4>
                                    {isAdmin ? (
                                        <div className="space-y-4">
                                            <Input label="Deposit Required (%)" type="number" value={job.quote.depositRequired || 0} onChange={(v: string) => handleSaveJob({ quote: { ...job.quote, depositRequired: parseInt(v) } })} />
                                            <Input label="Warranty Period" value={job.quote.warranty || ''} onChange={(v: string) => handleSaveJob({ quote: { ...job.quote, warranty: v } })} placeholder="e.g. 3 Months" />
                                            <Input label="Quote Valid Until" type="date" value={job.quote.validUntil || ''} onChange={(v: string) => handleSaveJob({ quote: { ...job.quote, validUntil: v } })} />
                                        </div>
                                    ) : (
                                        <ul className="space-y-2 text-sm text-gray-300">
                                            <li><strong>Deposit:</strong> {job.quote.depositRequired ? `${job.quote.depositRequired}%` : 'None'}</li>
                                            <li><strong>Warranty:</strong> {job.quote.warranty || 'Standard'}</li>
                                            <li><strong>Valid Until:</strong> {job.quote.validUntil || 'N/A'}</li>
                                        </ul>
                                    )}
                                 </div>
                                 <div>
                                     <h4 className="text-white font-bold mb-4">Notes & Duration</h4>
                                     {isAdmin ? (
                                        <div className="space-y-4">
                                             <Input label="Est. Duration" value={job.quote.estimatedDuration || ''} onChange={(v: string) => handleSaveJob({ quote: { ...job.quote, estimatedDuration: v } })} placeholder="e.g. 2 Hours" />
                                             <TextArea label="Additional Notes" value={job.quote.notes} onChange={(v: string) => handleSaveJob({ quote: { ...job.quote, notes: v } })} placeholder="e.g. 50% Deposit required. Valid for 7 days." />
                                        </div>
                                     ) : (
                                        <div className="bg-black/20 p-4 rounded-xl text-gray-400 text-sm">
                                            <p className="mb-2"><strong>Duration:</strong> {job.quote.estimatedDuration || 'TBD'}</p>
                                            <p>{job.quote.notes || 'No notes available.'}</p>
                                        </div>
                                     )}
                                 </div>
                             </div>

                             <SaveBar onSave={() => alert('Quote Saved!')} />
                         </div>
                    )}

                    {/* EXECUTION TAB */}
                    {activeTab === 'execution' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-black text-white flex items-center gap-3"><Zap size={32} className="text-pestGreen"/> Job Execution</h1>
                                {job.status === 'Job_Scheduled' && <button onClick={() => {
                                    handleSaveJob({ timeStarted: new Date().toLocaleTimeString() });
                                    advanceStatus('Job_In_Progress');
                                }} className="bg-pestGreen text-white px-6 py-3 rounded-xl font-bold shadow-neon">Start Job Timer</button>}
                                {job.status === 'Job_In_Progress' && <button onClick={() => {
                                    handleSaveJob({ timeFinished: new Date().toLocaleTimeString() });
                                    advanceStatus('Invoiced');
                                }} className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors">Complete & Sign Off</button>}
                            </div>

                            {/* Job Conditions Form (NEW) */}
                            <div className="bg-[#161817] border border-white/5 rounded-2xl p-6">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Cloud size={16}/> Site Conditions & Compliance</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                     <Input label="Weather" value={job.weatherNotes || ''} onChange={(v: string) => handleSaveJob({ weatherNotes: v })} placeholder="e.g. Sunny" />
                                     <Input label="Wind Speed" value={job.windSpeed || ''} onChange={(v: string) => handleSaveJob({ windSpeed: v })} placeholder="e.g. 5 km/h" />
                                     <Input label="Temperature" value={job.temperature || ''} onChange={(v: string) => handleSaveJob({ temperature: v })} placeholder="e.g. 26 C" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                     <Input label="Chemical Batch #" value={job.chemicalBatchNumbers || ''} onChange={(v: string) => handleSaveJob({ chemicalBatchNumbers: v })} placeholder="e.g. BATCH-00123" />
                                     <div className="flex gap-2 items-end">
                                        <div className="flex-1">
                                            <Input label="Time Started" type="time" value={job.timeStarted || ''} onChange={(v: string) => handleSaveJob({ timeStarted: v })} />
                                        </div>
                                        <div className="flex-1">
                                            <Input label="Time Finished" type="time" value={job.timeFinished || ''} onChange={(v: string) => handleSaveJob({ timeFinished: v })} />
                                        </div>
                                     </div>
                                </div>
                                
                                {/* Safety Checklist (NEW) */}
                                <div className="mb-4 space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Pre-Treatment Safety Checklist</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {SAFETY_CHECKLIST_ITEMS.map(item => {
                                            const isChecked = (job.safetyChecklist || []).includes(item);
                                            return (
                                                <button 
                                                    key={item} 
                                                    onClick={() => {
                                                        const current = job.safetyChecklist || [];
                                                        const updated = isChecked ? current.filter(i => i !== item) : [...current, item];
                                                        handleSaveJob({ safetyChecklist: updated });
                                                    }}
                                                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors flex items-center gap-2 ${isChecked ? 'bg-green-500/20 text-green-400 border-green-500' : 'bg-black/30 text-gray-500 border-white/10'}`}
                                                >
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                                                        {isChecked && <CheckCircle size={12} className="text-white" />}
                                                    </div>
                                                    {item}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">PPE Used</label>
                                    <div className="flex flex-wrap gap-2">
                                        {COMMON_PPE.map(ppe => {
                                            const isSelected = (job.ppeUsed || []).includes(ppe);
                                            return (
                                                <button 
                                                    key={ppe} 
                                                    onClick={() => {
                                                        const current = job.ppeUsed || [];
                                                        const updated = isSelected ? current.filter(p => p !== ppe) : [...current, ppe];
                                                        handleSaveJob({ ppeUsed: updated });
                                                    }}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${isSelected ? 'bg-pestGreen text-white border-pestGreen' : 'bg-black/30 text-gray-500 border-white/10'}`}
                                                >
                                                    {ppe}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
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
                                                {cp.recommendation && <p className="text-xs text-blue-400 mt-1">Note: {cp.recommendation}</p>}
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
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <TextArea 
                                                    label="Treatment Chemical Used" 
                                                    placeholder="e.g. Maxforce Gel" 
                                                    value={cp.chemicalUsed || ''} 
                                                    onChange={(v: string) => {
                                                        const updated = job.checkpoints.map(c => c.id === cp.id ? {...c, chemicalUsed: v } : c);
                                                        handleSaveJob({ checkpoints: updated });
                                                    }} 
                                                    rows={1} 
                                                />
                                                <TextArea 
                                                    label="Dosage / Notes" 
                                                    placeholder="e.g. 5g applied to hinges" 
                                                    value={cp.treatmentNotes || ''} 
                                                    onChange={(v: string) => {
                                                        const updated = job.checkpoints.map(c => c.id === cp.id ? {...c, treatmentNotes: v } : c);
                                                        handleSaveJob({ checkpoints: updated });
                                                    }} 
                                                    rows={1} 
                                                />
                                            </div>
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
                                    <span>Invoice Total (Incl. VAT):</span>
                                    <span className="font-black text-xl text-white">R {job.quote.total.toFixed(2)}</span>
                                </div>
                                
                                <div className="pt-4">
                                    <TextArea label="Billing Notes / Payment Method" value={job.billingNotes || ''} onChange={(v: string) => handleSaveJob({ billingNotes: v })} placeholder="e.g. Client paid via EFT, proof attached." />
                                </div>
                             </div>
                             
                             <div className="flex justify-center gap-4">
                                 <button onClick={() => generatePrintDocument('INVOICE')} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
                                    <Printer size={18}/> Print Invoice & Report
                                 </button>
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