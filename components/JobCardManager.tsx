
import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { JobCard, Checkpoint, QuoteLineItem, JobStatus, Employee, PaymentRecord, InventoryItem, MaterialUsage, CheckpointTask, RiskAssessment, WeatherConditions, ClientUser } from '../types';
import { X, Save, Plus, Trash2, CheckCircle, AlertTriangle, FileText, DollarSign, PenTool, Camera, MapPin, Calendar, User, Phone, Mail, ArrowRight, Shield, Zap, Lock, Download, QrCode, Printer, HelpCircle, Info, Calculator, Percent, Clock, Cloud, Thermometer, Box, FileCheck, ThumbsUp, Send, RefreshCw, CreditCard, Banknote, Coins, CheckSquare, Square, Repeat, FileX, Timer, LogIn, LogOut, Package, ClipboardList, ListPlus, Minus, Wind, Droplets, FlaskConical, AlertOctagon, Microscope, ScanLine, MessageCircle, MessageSquare, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, TextArea, Select, FileUpload } from './ui/AdminShared';
import { HelpButton } from './ui/HelpSystem';

interface JobCardManagerProps {
    jobId: string;
    currentUser: Employee | null;
    onClose: () => void;
}

export const JobCardManager: React.FC<JobCardManagerProps> = ({ jobId, currentUser, onClose }) => {
    const { content, updateJobCard, addJobCard, deleteJobCard, updateInventoryItem, addClientUser, updateClientUser } = useContent();
    const job = content.jobCards.find(j => j.id === jobId);
    
    // Determine permissions
    const isAdmin = currentUser === null || currentUser.permissions.isAdmin;
    const canInvoice = currentUser === null || currentUser.permissions.canInvoice;

    // Local state for the active tab in the manager
    const [activeTab, setActiveTab] = useState<'overview' | 'assessment' | 'quote' | 'execution' | 'invoice'>('overview');
    
    // Local state for adding new items
    const [newCheckpoint, setNewCheckpoint] = useState<Partial<Checkpoint>>({ 
        area: '', pestType: '', severity: 'Low', notes: '', photos: [], 
        rootCause: '', accessNotes: '', recommendation: '', 
        infestationLevel: 'Low', actionPriority: 'Routine', tasks: []
    });
    
    // Temp state for building specific tasks for a new checkpoint
    const [newTaskDescription, setNewTaskDescription] = useState('');

    // Quote State
    const [newLineItem, setNewLineItem] = useState<Partial<QuoteLineItem>>({ name: '', description: '', qty: 1, unitPrice: 0 });
    const [selectedInventoryForQuote, setSelectedInventoryForQuote] = useState<string>('');

    // Execution State
    const [materialUsageForm, setMaterialUsageForm] = useState<Partial<MaterialUsage>>({ 
        inventoryItemId: '', qtyUsed: 0, applicationMethod: 'Spray', dilutionRate: 'None', batchNumber: '' 
    });
    
    // PPE Acknowledgement State
    const [ppeCheck, setPpeCheck] = useState({ gloves: false, mask: false, boots: false, overall: false });
    const isPpeConfirmed = ppeCheck.gloves && ppeCheck.mask && ppeCheck.boots && ppeCheck.overall;

    // Payment State
    const [paymentForm, setPaymentForm] = useState<PaymentRecord>({ method: 'EFT', amount: 0, date: new Date().toISOString().split('T')[0], reference: '', notes: '' });

    // Scanner State
    const [showScanner, setShowScanner] = useState(false);
    const [scannerMode, setScannerMode] = useState<'start' | 'end' | 'verify' | 'add'>('verify');
    const [scannerError, setScannerError] = useState<string | null>(null);
    const [scanningCheckpointId, setScanningCheckpointId] = useState<string | null>(null);

    // Scheduling Modal
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduleForm, setScheduleForm] = useState({ date: '', time: '' });

    // Initial load effects
    useEffect(() => {
        if(job) {
            // Default payment amount to remaining total
            const paid = job.depositPaid || 0;
            const remaining = job.quote.total - paid;
            setPaymentForm(prev => ({ ...prev, amount: remaining > 0 ? remaining : 0 }));
            
            // Sync Schedule Form
            setScheduleForm({
                date: job.serviceDate ? job.serviceDate.split('T')[0] : '',
                time: job.serviceTime || ''
            });
        }
    }, [job?.id]);

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
                            handleScanSuccess(decodedText, scanner);
                        },
                        (errorMessage: string) => { /* ignore */ }
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
    }, [showScanner, scannerMode, scanningCheckpointId, activeTab]);

    const handleScanSuccess = (decodedText: string, scannerInstance: any) => {
        if (activeTab === 'assessment') {
            setNewCheckpoint(prev => ({ ...prev, area: decodedText })); 
            setShowScanner(false);
            scannerInstance.clear();
            return;
        }

        if (!job) return;

        // Find checkpoint based on context
        let cpIndex = -1;
        if (scanningCheckpointId) {
            cpIndex = job.checkpoints.findIndex(c => c.id === scanningCheckpointId);
        } else {
            cpIndex = job.checkpoints.findIndex(c => c.code === decodedText || c.area === decodedText);
        }

        if (cpIndex !== -1) {
            const newCps = [...job.checkpoints];
            const cp = newCps[cpIndex];

            // Verify Code Match if explicit
            if (scanningCheckpointId && (cp.code !== decodedText && cp.area !== decodedText)) {
                alert(`QR Mismatch! Scanned: ${decodedText}, Expected: ${cp.code} or ${cp.area}`);
                setShowScanner(false);
                scannerInstance.clear();
                return;
            }

            if (scannerMode === 'start') {
                newCps[cpIndex].scanStart = new Date().toISOString();
                newCps[cpIndex].verifiedCode = decodedText; // Link QR
                alert(`Started work at: ${cp.area}`);
            } else if (scannerMode === 'end') {
                // Validate checklist first?
                if (cp.tasks.some(t => !t.completed)) {
                    if(!confirm("Not all tasks are checked off. Finish anyway?")) {
                        setShowScanner(false);
                        scannerInstance.clear();
                        return;
                    }
                }
                newCps[cpIndex].scanEnd = new Date().toISOString();
                newCps[cpIndex].isTreated = true;
                alert(`Completed work at: ${cp.area}`);
            }

            handleSaveJob({ checkpoints: newCps });
            setShowScanner(false);
            scannerInstance.clear();
            setScanningCheckpointId(null);
        } else {
            alert(`QR Code '${decodedText}' not found in this job.`);
            setShowScanner(false);
            scannerInstance.clear();
        }
    };

    if (!job) return null;

    // --- ACTIONS ---

    const handleSaveJob = (updates: Partial<JobCard>) => {
        updateJobCard(jobId, updates);
    };

    // Helper to format SA numbers for international dial/links
    const formatPhoneNumber = (phone: string) => {
        if (!phone) return '';
        let clean = phone.replace(/[\s\-\(\)]/g, ''); // Remove spaces, dashes, parens
        if (clean.startsWith('0')) {
            clean = '+27' + clean.substring(1);
        }
        return clean;
    };

    const sendCommunication = (type: 'QUOTE' | 'BOOKING' | 'INVOICE' | 'REPORT', method: 'whatsapp' | 'sms' | 'email') => {
        if (!job.contactNumber && !job.email) {
            alert("No contact details found for this client.");
            return;
        }

        let messageBody = "";
        const ref = job.refNumber;

        // Login Link Logic (For Quote primarily, but useful for Invoice to view history)
        let loginMsg = "";
        if (job.email && (type === 'QUOTE' || type === 'INVOICE')) {
            const existingClient = content.clientUsers.find(c => c.email.toLowerCase() === job.email.toLowerCase());
            if (!existingClient && type === 'QUOTE') {
                const newPin = Math.floor(1000 + Math.random() * 9000).toString();
                const newClient: ClientUser = {
                    id: `client-${Date.now()}`,
                    fullName: job.clientName,
                    email: job.email,
                    phone: job.contactNumber,
                    pin: newPin,
                    address: job.clientAddressDetails.street,
                    linkedEmails: [job.email]
                };
                addClientUser(newClient);
                loginMsg = `\n\nLogin to portal: \nURL: ${window.location.origin} \nEmail: ${job.email} \nPIN: ${newPin}`;
            } else {
                loginMsg = `\n\nLogin to portal: ${window.location.origin}`;
            }
        }

        if (type === 'QUOTE') {
            const total = job.quote.total.toFixed(2);
            const services = job.selectedServices.map(s => {
                const serv = content.services.find(ser => ser.id === s);
                return serv ? serv.title : s;
            }).join(', ');
            messageBody = `Greetings from ${content.company.name}. \n\nHere is your quote for ${services}. \nRef: ${ref} \nTotal: R${total}. ${loginMsg}`;
        } else if (type === 'BOOKING') {
            const dateStr = new Date(job.serviceDate || job.assessmentDate).toLocaleDateString();
            const timeStr = job.serviceTime || '08:00';
            messageBody = `Booking Confirmed with ${content.company.name}. \n\nJob Ref: ${ref} \nDate: ${dateStr} \nTime: ${timeStr} \n\nTechnician will arrive within 30 mins of scheduled time.`;
        } else if (type === 'INVOICE') {
            const balance = job.quote.total - (job.depositPaid || 0);
            messageBody = `Invoice from ${content.company.name}. \n\nRef: ${ref} \nTotal: R${job.quote.total.toFixed(2)} \nBalance Due: R${balance.toFixed(2)}. \n\nBank: ${content.bankDetails.bankName} \nAcc: ${content.bankDetails.accountNumber} \nBranch: ${content.bankDetails.branchCode} \nRef: ${ref}`;
        } else if (type === 'REPORT') {
            messageBody = `Service Report from ${content.company.name}. \n\nRef: ${ref}. \nYour property has been treated. \nPlease view the full report and safety certificates on your client portal: ${window.location.origin}`;
        }
        
        if (method === 'whatsapp') {
            const phone = formatPhoneNumber(job.contactNumber);
            if (!phone) return alert("Invalid Phone Number");
            const url = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(messageBody)}`;
            window.open(url, '_blank');
        } else if (method === 'sms') {
            const phone = formatPhoneNumber(job.contactNumber);
            if (!phone) return alert("Invalid Phone Number");
            window.location.href = `sms:${phone}?body=${encodeURIComponent(messageBody)}`;
        } else if (method === 'email') {
            const email = job.email;
            if (!email) return alert("No email address found.");
            window.location.href = `mailto:${email}?subject=${type} ${ref}&body=${encodeURIComponent(messageBody)}`;
        }
    };

    const handleInvoiceNoteChange = (v: string) => {
        const currentInvoice = job.invoice || {
            invoiceNumber: job.refNumber,
            generatedDate: new Date().toISOString(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            lineItems: job.quote.lineItems,
            subtotal: job.quote.subtotal,
            vat: job.quote.subtotal * job.quote.vatRate,
            total: job.quote.total,
            status: 'Draft',
            notes: ''
        };
        handleSaveJob({ invoice: { ...currentInvoice, notes: v } });
    }

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

    const handleCloseJob = () => {
        const months = prompt("Set Follow-Up Reminder?\nEnter '3' for 3 months, '6' for 6 months, or '0' for none.");
        if (months) {
            const m = parseInt(months);
            if (!isNaN(m) && m > 0) {
                const nextDate = new Date();
                nextDate.setMonth(nextDate.getMonth() + m);
                
                // Update Client Record
                const client = content.clientUsers.find(c => c.email.toLowerCase() === job.email.toLowerCase()) || 
                               content.clientUsers.find(c => c.fullName.toLowerCase() === job.clientName.toLowerCase());
                
                if (client) {
                    updateClientUser(client.id, { nextFollowUpDate: nextDate.toISOString() });
                    alert(`Job Closed. Client follow-up set for ${nextDate.toLocaleDateString()}.`);
                } else {
                    alert(`Job Closed. Reminder: Follow up in ${m} months.`);
                }
            } else {
                alert("Job Closed. No follow-up set.");
            }
        }
        advanceStatus('Completed');
    };

    const handleApproveQuote = () => {
        setShowScheduleModal(true);
    };

    const confirmSchedule = () => {
        if (!scheduleForm.date) return alert("Please select a date.");
        
        // Save Schedule
        handleSaveJob({ 
            serviceDate: new Date(scheduleForm.date).toISOString(),
            serviceTime: scheduleForm.time,
            status: 'Job_Scheduled',
            history: [...job.history, { date: new Date().toISOString(), action: `Job Scheduled for ${scheduleForm.date} ${scheduleForm.time}`, user: currentUser?.fullName || 'Admin' }]
        });
        
        setShowScheduleModal(false);
        setActiveTab('overview'); 
        alert("Job Scheduled! Please send booking confirmation to client now.");
    };

    const loadServiceTemplate = (serviceId: string) => {
        const service = content.services.find(s => s.id === serviceId);
        if (!service || !service.assessmentTemplate || service.assessmentTemplate.length === 0) return alert("No template found for this service.");
        
        if (!confirm(`This will add ${service.assessmentTemplate.length} locations/checkpoints to the list. Proceed?`)) return;

        const newCheckpoints = service.assessmentTemplate.map(step => ({
            id: Date.now().toString() + Math.random(),
            code: `CHK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            area: step.areaName,
            pestType: step.defaultPest,
            severity: 'Low' as const,
            notes: '',
            rootCause: '',
            accessNotes: '',
            recommendation: '',
            photos: [],
            timestamp: new Date().toISOString(),
            isTreated: false,
            infestationLevel: 'Low' as const,
            actionPriority: 'Routine' as const,
            tasks: [{ id: `t-${Date.now()}`, description: step.defaultTask, completed: false }]
        }));

        handleSaveJob({ checkpoints: [...job.checkpoints, ...newCheckpoints] });
    };

    const addNewTaskToCheckpointBuilder = () => {
        if (!newTaskDescription.trim()) return;
        const newTask: CheckpointTask = {
            id: `task-${Date.now()}`,
            description: newTaskDescription,
            completed: false
        };
        setNewCheckpoint(prev => ({
            ...prev,
            tasks: [...(prev.tasks || []), newTask]
        }));
        setNewTaskDescription('');
    };

    const removeTaskFromBuilder = (taskId: string) => {
        setNewCheckpoint(prev => ({
            ...prev,
            tasks: (prev.tasks || []).filter(t => t.id !== taskId)
        }));
    };

    const addCheckpoint = () => {
        if (!newCheckpoint.area || !newCheckpoint.pestType) return alert("Area Name and Pest Found are required.");
        
        const defaultTasks = [
            { id: 't1', description: 'Inspect Area & Risks', completed: false },
            { id: 't2', description: 'Put on PPE', completed: false },
            { id: 't3', description: 'Apply Treatment', completed: false },
            { id: 't4', description: 'Clean Area', completed: false }
        ];

        const finalTasks = (newCheckpoint.tasks && newCheckpoint.tasks.length > 0) ? newCheckpoint.tasks : defaultTasks;

        const checkpoint: Checkpoint = {
            id: Date.now().toString(),
            code: `CHK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
            actionPriority: newCheckpoint.actionPriority as any || 'Routine',
            tasks: finalTasks,
            monitorData: { activity: 'None', baitCondition: 'Intact', stationStatus: 'Secure' }
        };
        handleSaveJob({ checkpoints: [...job.checkpoints, checkpoint] });
        setNewCheckpoint({ area: '', pestType: '', severity: 'Low', notes: '', photos: [], rootCause: '', accessNotes: '', recommendation: '', infestationLevel: 'Low', actionPriority: 'Routine', tasks: [] });
    };

    const handleAddInventoryToQuote = () => {
        const invItem = content.inventory.find(i => i.id === selectedInventoryForQuote);
        if (invItem) {
            setNewLineItem({
                name: invItem.name,
                description: `${invItem.category} - ${invItem.activeIngredient || ''}`,
                unitPrice: invItem.retailPricePerUnit || invItem.costPerUnit * 1.5, // Default markup if retail not set
                qty: 1,
                inventoryItemId: invItem.id
            });
        }
    };

    const handleRecordUsage = () => {
        const invItem = content.inventory.find(i => i.id === materialUsageForm.inventoryItemId);
        if (!invItem || (materialUsageForm.qtyUsed || 0) <= 0) return alert("Invalid item or quantity");

        const usage: MaterialUsage = {
            id: Date.now().toString(),
            inventoryItemId: invItem.id,
            itemName: invItem.name,
            qtyUsed: materialUsageForm.qtyUsed || 0,
            unit: invItem.unit,
            cost: invItem.costPerUnit * (materialUsageForm.qtyUsed || 0),
            date: new Date().toISOString(),
            batchNumber: materialUsageForm.batchNumber || invItem.batchNumber || 'N/A',
            applicationMethod: materialUsageForm.applicationMethod as any || 'Spray',
            dilutionRate: materialUsageForm.dilutionRate || 'Ready-to-Use',
            targetPest: materialUsageForm.targetPest || 'General'
        };

        updateInventoryItem(invItem.id, { stockLevel: invItem.stockLevel - (materialUsageForm.qtyUsed || 0) });

        const newUsageList = [...(job.materialUsage || []), usage];
        handleSaveJob({ materialUsage: newUsageList });
        setMaterialUsageForm({ inventoryItemId: '', qtyUsed: 0, batchNumber: '', applicationMethod: 'Spray', dilutionRate: 'None' });
        alert("Usage recorded and stock updated.");
    };

    const handleRecordPayment = () => {
        if (!canInvoice) return alert("Only Admins can record payment.");
        if (paymentForm.amount <= 0) return alert("Please enter a valid amount.");
        handleSaveJob({ 
            paymentRecord: paymentForm,
            history: [...job.history, { date: new Date().toISOString(), action: `Payment Recorded: R${paymentForm.amount}`, user: currentUser?.fullName || 'Admin' }]
        });
        alert("Payment Recorded Successfully.");
    };

    const handleRebook = () => {
        if(!confirm("Create a new Follow-Up Job for this client?")) return;
        
        const newJob: JobCard = {
            ...job,
            id: `job-${Date.now()}`,
            refNumber: `JOB-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
            status: 'Assessment',
            assessmentDate: new Date().toISOString(),
            serviceDate: undefined,
            quote: { lineItems: [], subtotal: 0, vatRate: 0.15, total: 0, notes: '' },
            invoice: undefined,
            paymentRecord: undefined,
            depositPaid: undefined,
            checkpoints: [], 
            isFirstTimeService: false,
            history: [{ date: new Date().toISOString(), action: `Follow-up created from ${job.refNumber}`, user: currentUser?.fullName || 'Admin' }]
        };
        addJobCard(newJob);
        alert(`Follow-up job ${newJob.refNumber} created!`);
        onClose(); 
    };

    const generatePrintDocument = (type: 'QUOTE' | 'INVOICE' | 'REPORT') => {
        const win = window.open('', '', 'width=900,height=1200');
        if (!win) return;
        const company = content.company;
        const bank = content.bankDetails;
        
        const depositAmount = job.quote.depositType === 'Percentage' 
            ? (job.quote.total * (job.quote.depositValue || 0) / 100)
            : (job.quote.depositValue || 0);

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
                .table td { padding: 10px; border-bottom: 1px solid #ddd; vertical-align: top; }
                .totals { float: right; width: 300px; }
                .totals-row { display: flex; justify-content: space-between; padding: 5px 0; }
                .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
                .section-title { font-size: 16px; font-weight: bold; color: #4CAF50; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                .bank-details { margin-top: 40px; padding: 15px; background: #f9f9f9; border-left: 4px solid #4CAF50; font-size: 12px; }
                .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
                .notes-box { margin-top: 20px; padding: 10px; background: #fffbe6; border: 1px solid #ffe58f; border-radius: 4px; font-size: 12px; }
                .desc-text { font-size: 11px; color: #666; margin-top: 4px; display: block; }
                .checkpoint-box { border: 1px solid #eee; padding: 15px; margin-bottom: 15px; border-radius: 8px; page-break-inside: avoid; }
                .checkpoint-header { background: #f9f9f9; padding: 5px 10px; font-weight: bold; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
                .photo-grid { display: flex; gap: 10px; margin-top: 10px; }
                .photo-item { width: 100px; height: 100px; object-fit: cover; border: 1px solid #ddd; }
            </style>
        `;
        
        const lineItemsHtml = job.quote.lineItems.map(item => `
            <tr>
                <td><strong>${item.name}</strong>${item.description ? `<span class="desc-text">${item.description}</span>` : ''}</td>
                <td style="text-align:center">${item.qty}</td>
                <td style="text-align:right">R ${item.unitPrice.toFixed(2)}</td>
                <td style="text-align:right">R ${item.total.toFixed(2)}</td>
            </tr>
        `).join('');

        const reportHtml = job.checkpoints.map(cp => `
            <div class="checkpoint-box">
                <div class="checkpoint-header">
                    <span>${cp.area}</span>
                    <span style="color: ${cp.actionPriority === 'Critical' ? 'red' : '#4CAF50'}">${cp.actionPriority} - ${cp.pestType}</span>
                </div>
                <div style="padding: 10px;">
                    <p><strong>Infestation Level:</strong> ${cp.infestationLevel}</p>
                    <p><strong>Treatment Notes:</strong> ${cp.treatmentNotes || 'Pending treatment'}</p>
                    ${cp.monitorData ? `<p style="font-size:11px;"><strong>Monitor:</strong> Activity: ${cp.monitorData.activity}, Bait: ${cp.monitorData.baitCondition}</p>` : ''}
                    <div style="margin-top:10px; font-size:11px; color:#555;">
                        <strong>Work Checklist:</strong>
                        <ul style="margin: 5px 0; padding-left: 20px;">
                            ${cp.tasks.map(t => `<li>[${t.completed ? 'X' : ' '}] ${t.description}</li>`).join('')}
                        </ul>
                    </div>
                    ${cp.photos.length > 0 ? `<div class="photo-grid">${cp.photos.map(p => `<img src="${p}" class="photo-item"/>`).join('')}</div>` : ''}
                </div>
            </div>
        `).join('');

        win.document.write(`
            <html>
                <head><title>${type === 'QUOTE' ? 'Quotation' : type === 'REPORT' ? 'Assessment Report' : 'Tax Invoice'} - ${job.refNumber}</title>${styles}</head>
                <body>
                    <div class="header">
                        <div>${company.logo ? `<img src="${company.logo}" class="logo"/>` : `<h2>${company.name}</h2>`}</div>
                        <div class="company-info">
                            <h1>${type === 'QUOTE' ? 'QUOTATION' : type === 'REPORT' ? 'SITE REPORT' : 'TAX INVOICE'}</h1>
                            <p><strong>Ref:</strong> ${job.refNumber}</p>
                            ${company.regNumber ? `<p><strong>Reg:</strong> ${company.regNumber}</p>` : ''}
                            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                            <p>${company.address}</p>
                            <p>${company.email} | ${company.phone}</p>
                        </div>
                    </div>
                    <div class="bill-to">
                        <h3>Client Details:</h3>
                        <p><strong>${job.clientName}</strong> ${job.clientCompanyName ? `(${job.clientCompanyName})` : ''}</p>
                        <p>${job.clientAddressDetails.street}, ${job.clientAddressDetails.suburb}</p>
                        <p>${job.email} | ${job.contactNumber}</p>
                        ${job.clientVatNumber ? `<p>Client VAT: ${job.clientVatNumber}</p>` : ''}
                    </div>
                    ${(type === 'REPORT' && job.weather) ? `<div class="notes-box" style="margin-bottom:20px;"><strong>Environmental Conditions:</strong><br/>Temp: ${job.weather.temperature}°C, Wind: ${job.weather.windSpeed}, Condition: ${job.weather.condition}</div>` : ''}
                    ${type !== 'REPORT' ? `
                    <table class="table"><thead><tr><th>Description</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit Price</th><th style="text-align:right">Total</th></tr></thead><tbody>${lineItemsHtml}</tbody></table>
                    <div class="totals">
                        <div class="totals-row"><span>Subtotal:</span> <span>R ${job.quote.subtotal.toFixed(2)}</span></div>
                        <div class="totals-row"><span>VAT (${(job.quote.vatRate*100).toFixed(0)}%):</span> <span>R ${(job.quote.subtotal * job.quote.vatRate).toFixed(2)}</span></div>
                        <div class="totals-row grand-total"><span>TOTAL:</span> <span>R ${job.quote.total.toFixed(2)}</span></div>
                        ${(type === 'QUOTE' && depositAmount > 0) ? `<div class="totals-row" style="color: #4CAF50; font-weight:bold; margin-top:10px;"><span>Deposit Required:</span> <span>R ${depositAmount.toFixed(2)}</span></div>` : ''}
                        ${(type === 'INVOICE' && job.depositPaid) ? `<div class="totals-row" style="color: #4CAF50;"><span>Less Deposit Paid:</span> <span>- R ${job.depositPaid.toFixed(2)}</span></div><div class="totals-row" style="font-weight:bold; border-top: 1px solid #ddd;"><span>Balance Due:</span> <span>R ${(job.quote.total - job.depositPaid).toFixed(2)}</span></div>` : ''}
                    </div><div style="clear:both;"></div>` : ''}
                    ${(type === 'REPORT' || type === 'QUOTE') && job.checkpoints.length > 0 ? `<div class="section-title">Site Assessment Findings</div>${reportHtml}` : ''}
                    ${type === 'QUOTE' && job.quote.notes ? `<div class="notes-box"><strong>Special Notes & Terms:</strong><br/>${job.quote.notes.replace(/\n/g, '<br/>')}</div>` : ''}
                    ${type === 'INVOICE' && (job.invoice?.notes) ? `<div class="notes-box"><strong>Invoice Notes:</strong><br/>${job.invoice.notes.replace(/\n/g, '<br/>')}</div>` : ''}
                    ${type !== 'REPORT' ? `<div class="bank-details"><h4>Banking Details</h4><p><strong>Bank:</strong> ${bank.bankName}</p><p><strong>Account Name:</strong> ${bank.accountName}</p><p><strong>Account No:</strong> ${bank.accountNumber}</p><p><strong>Branch Code:</strong> ${bank.branchCode}</p><p>Please use <strong>${job.refNumber}</strong> as payment reference.</p></div>` : ''}
                    <div class="footer"><p>Terms & Conditions Apply. Thank you for your business!</p></div>
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
            </div>
        `).join('');
        win.document.write(`<html><head><title>Print QR Codes</title></head><body>${qrHtml}<script>window.onload=function(){window.print()}</script></body></html>`);
        win.document.close();
    };

    const printMainQRCard = () => {
        const win = window.open('', '', 'width=600,height=800');
        if (!win) return;
        const qrDataUrl = `${window.location.origin}/?jobRef=${job.id}`;
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrDataUrl)}`;
        const html = `<!DOCTYPE html><html><head><title>Client Job QR</title><style>body { font-family: 'Helvetica', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0f0f0; } .card { background: white; padding: 40px; border-radius: 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); width: 400px; border: 2px solid #4CAF50; } .logo { max-height: 80px; margin-bottom: 20px; } h1 { margin: 0 0 5px 0; color: #333; font-size: 24px; text-transform: uppercase; } h2 { margin: 0 0 20px 0; color: #4CAF50; font-size: 16px; } .qr-container { background: #f9f9f9; padding: 20px; border-radius: 10px; display: inline-block; margin: 20px 0; border: 1px dashed #ccc; } .qr-code { width: 250px; height: 250px; } .info { margin-top: 20px; text-align: left; background: #f0f8f0; padding: 15px; border-radius: 10px; } .info p { margin: 5px 0; font-size: 14px; color: #555; } .footer { margin-top: 20px; font-size: 11px; color: #999; } @media print { body { background: white; } .card { box-shadow: none; width: 100%; border: none; } } </style></head><body><div class="card">${content.company.logo ? `<img src="${content.company.logo}" class="logo" />` : ''}<h1>${content.company.name}</h1><h2>Scan to View Reports & Certs</h2><div class="qr-container"><img src="${qrApiUrl}" class="qr-code" /></div><div class="info"><p><strong>Job Ref:</strong> ${job.refNumber}</p><p><strong>Reg No:</strong> ${content.company.regNumber || 'N/A'}</p><p><strong>Tel:</strong> ${content.company.phone}</p><p><strong>Email:</strong> ${content.company.email}</p></div><div class="footer">Scan this code with your phone camera to access your digital job card, reports, and certificates instantly.</div></div><script>window.onload = function() { window.print(); }</script></body></html>`;
        win.document.write(html);
        win.document.close();
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors: Record<string, string> = { 'Assessment': 'bg-blue-500/20 text-blue-400', 'Quote_Builder': 'bg-yellow-500/20 text-yellow-400', 'Quote_Sent': 'bg-purple-500/20 text-purple-400', 'Job_Scheduled': 'bg-orange-500/20 text-orange-400', 'Job_In_Progress': 'bg-red-500/20 text-red-400', 'Completed': 'bg-green-500/20 text-green-400', 'Cancelled': 'bg-red-900/50 text-red-200' };
        return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors[status] || 'bg-gray-500/20 text-gray-400'}`}>{status.replace(/_/g, ' ')}</span>;
    };

    const TabButton = ({ id, label, icon: Icon, disabled }: any) => (
        <button onClick={() => !disabled && setActiveTab(id)} disabled={disabled} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === id ? 'bg-pestGreen text-white shadow-lg' : disabled ? 'text-gray-600 cursor-not-allowed opacity-50' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Icon size={16} /> {label}{disabled && <Lock size={12} className="ml-auto" />}</button>
    );

    const SaveBar = ({ onSave }: { onSave: () => void }) => (
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between sticky bottom-0 bg-[#0f1110] pb-4 z-10">
            <span className="text-xs text-gray-500 italic flex items-center gap-1"><Info size={12}/> Changes are local until saved.</span>
            <button onClick={onSave} className="bg-pestGreen hover:bg-white hover:text-pestGreen text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"><Save size={18} /> Save Details</button>
        </div>
    );

    const isExecutionUnlocked = ['Job_Scheduled', 'Job_In_Progress', 'Job_Review', 'Invoiced', 'Completed'].includes(job.status);

    return (
        <div className="fixed inset-0 z-[100] bg-[#0f1110] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-300 font-sans w-full h-full">
            {/* Sidebar Navigation */}
            <aside className="hidden md:flex w-full md:w-64 bg-[#161817] border-r border-white/5 flex-col flex-shrink-0 h-full">
                <div className="p-6 border-b border-white/5 flex-shrink-0">
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
                    <TabButton id="execution" label="Execution" icon={Zap} disabled={!isExecutionUnlocked}/>
                    <TabButton id="invoice" label="Invoice & Close" icon={CheckCircle} disabled={!isExecutionUnlocked} />
                </div>
            </aside>

             {/* Mobile Header with Close */}
             <div className="md:hidden flex items-center justify-between p-4 bg-[#161817] border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <h2 className="text-white font-black text-sm">{job.refNumber}</h2>
                    <StatusBadge status={job.status} />
                </div>
                <button onClick={onClose} className="text-gray-500 bg-white/10 p-2 rounded-full"><X size={20}/></button>
            </div>

            {/* Mobile Tab Nav Horizontal */}
            <div className="md:hidden flex overflow-x-auto gap-2 p-2 bg-[#0f1110] border-b border-white/5 scrollbar-hide flex-shrink-0">
                 <button onClick={() => setActiveTab('overview')} className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold ${activeTab === 'overview' ? 'bg-pestGreen text-white' : 'bg-white/5 text-gray-400'}`}>Overview</button>
                 <button onClick={() => setActiveTab('assessment')} className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold ${activeTab === 'assessment' ? 'bg-pestGreen text-white' : 'bg-white/5 text-gray-400'}`}>Assessment</button>
                 <button onClick={() => setActiveTab('quote')} className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold ${activeTab === 'quote' ? 'bg-pestGreen text-white' : 'bg-white/5 text-gray-400'}`}>Quote</button>
                 <button onClick={() => isExecutionUnlocked && setActiveTab('execution')} disabled={!isExecutionUnlocked} className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold ${activeTab === 'execution' ? 'bg-pestGreen text-white' : 'bg-white/5 text-gray-400'} ${!isExecutionUnlocked && 'opacity-50'}`}>Execution</button>
                 <button onClick={() => isExecutionUnlocked && setActiveTab('invoice')} disabled={!isExecutionUnlocked} className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold ${activeTab === 'invoice' ? 'bg-pestGreen text-white' : 'bg-white/5 text-gray-400'} ${!isExecutionUnlocked && 'opacity-50'}`}>Invoice</button>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-[#0f1110] relative w-full h-full">
                <div className="w-full min-h-full p-6 md:p-10 pb-24">
                    {/* Booking Notification Panel in Overview if Scheduled */}
                    {job.status === 'Job_Scheduled' && activeTab === 'overview' && (
                        <div className="mb-8 bg-blue-500/10 border border-blue-500/30 p-6 rounded-2xl animate-in slide-in-from-top-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-blue-400 font-bold text-lg mb-2 flex items-center gap-2"><Calendar size={20}/> Job Scheduled & Approved</h3>
                                    <p className="text-gray-300 text-sm mb-4">
                                        Scheduled for: <strong className="text-white">{new Date(job.serviceDate || job.assessmentDate).toLocaleDateString()}</strong> at <strong className="text-white">{job.serviceTime || '08:00'}</strong>
                                    </p>
                                </div>
                                <button onClick={() => setShowScheduleModal(true)} className="bg-blue-500/20 text-blue-400 hover:text-white hover:bg-blue-500 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all">
                                    <Edit2 size={14}/> Reschedule
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <span className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center mr-2">Send Booking Confirmation:</span>
                                <button onClick={() => sendCommunication('BOOKING', 'whatsapp')} className="bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-2 border border-[#25D366]/30 transition-colors">
                                    <MessageCircle size={14}/> WhatsApp
                                </button>
                                <button onClick={() => sendCommunication('BOOKING', 'sms')} className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-2 border border-white/10 transition-colors">
                                    <MessageSquare size={14}/> SMS
                                </button>
                                <button onClick={() => sendCommunication('BOOKING', 'email')} className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-2 border border-white/10 transition-colors">
                                    <Mail size={14}/> Email
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ... Rest of components ... */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="flex justify-between items-center"><h1 className="text-3xl font-black text-white flex items-center gap-3">Job Overview<HelpButton topic="job-overview" /></h1>{job.status === 'Assessment' && <button onClick={() => advanceStatus('Quote_Builder')} className="ml-auto bg-pestGreen text-white px-4 py-2 rounded-lg text-sm">Next: Quote</button>}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 space-y-4"><h3 className="text-pestGreen font-bold uppercase text-xs tracking-wider flex items-center gap-2"><User size={14}/> Client Details</h3><Input label="Client Name" value={job.clientName} onChange={(v: string) => handleSaveJob({ clientName: v })} /><div className="grid grid-cols-2 gap-3"><Input label="Email" value={job.email} onChange={(v: string) => handleSaveJob({ email: v })} /><Input label="Phone" value={job.contactNumber} onChange={(v: string) => handleSaveJob({ contactNumber: v })} /></div><Input label="Alt Contact" value={job.contactNumberAlt || ''} onChange={(v: string) => handleSaveJob({ contactNumberAlt: v })} /><Input label="Business Name" value={job.clientCompanyName || ''} onChange={(v: string) => handleSaveJob({ clientCompanyName: v })} /></div>
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 space-y-4"><h3 className="text-pestGreen font-bold uppercase text-xs tracking-wider flex items-center gap-2"><MapPin size={14}/> Site Location</h3><Input label="Street" value={job.clientAddressDetails.street} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, street: v } })} /><div className="grid grid-cols-2 gap-3"><Input label="Suburb" value={job.clientAddressDetails.suburb} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, suburb: v } })} /><Input label="City" value={job.clientAddressDetails.city} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, city: v } })} /></div><Input label="Postal Code" value={job.clientAddressDetails.postalCode} onChange={(v: string) => handleSaveJob({ clientAddressDetails: { ...job.clientAddressDetails, postalCode: v } })} /><Input label="Gate Code" value={job.siteAccessCodes || ''} onChange={(v: string) => handleSaveJob({ siteAccessCodes: v })} /></div>
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 space-y-4"><h3 className="text-pestGreen font-bold uppercase text-xs tracking-wider flex items-center gap-2"><Calendar size={14}/> Schedule & Tech</h3><Input label="Assessment Date" type="date" value={job.assessmentDate.split('T')[0]} onChange={(v: string) => handleSaveJob({ assessmentDate: new Date(v).toISOString() })} /><div className="grid grid-cols-2 gap-3"><Input label="Service Date" type="date" value={job.serviceDate ? job.serviceDate.split('T')[0] : ''} onChange={(v: string) => handleSaveJob({ serviceDate: new Date(v).toISOString() })} /><Input label="Time" type="time" value={job.serviceTime || ''} onChange={(v: string) => handleSaveJob({ serviceTime: v })} /></div><div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Assigned Tech (Optional)</label><select value={job.technicianId} onChange={(e) => handleSaveJob({ technicianId: e.target.value })} className="w-full p-3 bg-[#0f1110] border border-white/10 rounded-xl text-white focus:border-pestGreen outline-none"><option value="">Select Technician...</option>{content.employees.filter(e => e.permissions.canExecuteJob).map(emp => (<option key={emp.id} value={emp.id}>{emp.fullName}</option>))}</select></div></div>
                            </div>
                            <SaveBar onSave={() => alert('Overview Details Saved!')} />
                        </div>
                    )}

                    {activeTab === 'assessment' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                             <div className="flex justify-between items-center"><h1 className="text-3xl font-black text-white flex items-center gap-3"><Shield size={32} className="text-pestGreen"/> Site Assessment<HelpButton topic="assessment" /></h1><div className="flex gap-2"><button onClick={() => generatePrintDocument('REPORT')} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-white/10"><Printer size={16}/> Print Report</button>{job.status === 'Assessment' && <button onClick={() => advanceStatus('Quote_Builder')} className="bg-white text-pestBrown hover:bg-pestGreen hover:text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">Complete & Quote <ArrowRight size={16}/></button>}</div></div>
                             {showScanner && (<div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-4"><button onClick={() => setShowScanner(false)} className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full"><X size={32}/></button><div id="reader" className="w-full max-w-sm bg-white rounded-lg overflow-hidden border-4 border-pestGreen"></div><p className="text-white mt-4 font-bold text-lg animate-pulse">{scannerMode === 'start' ? 'Scanning to Start...' : scannerMode === 'end' ? 'Scanning to Finish...' : 'Scanning...'}</p></div>)}
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 shadow-2xl"><h3 className="text-white font-bold mb-4 flex items-center gap-2"><Cloud size={18} className="text-blue-400"/> Weather & Environment (Law Requirement)</h3><div className="grid grid-cols-2 gap-4"><div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Temperature (°C)</label><div className="relative"><input type="number" className="w-full p-2 bg-black/30 border border-white/10 rounded text-white" value={job.weather?.temperature || ''} onChange={e => handleSaveJob({ weather: { ...job.weather!, temperature: e.target.value } })} placeholder="24" /><Thermometer size={14} className="absolute right-2 top-3 text-gray-500"/></div></div><div className="space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Wind Speed (km/h)</label><div className="relative"><input type="text" className="w-full p-2 bg-black/30 border border-white/10 rounded text-white" value={job.weather?.windSpeed || ''} onChange={e => handleSaveJob({ weather: { ...job.weather!, windSpeed: e.target.value } })} placeholder="10" /><Wind size={14} className="absolute right-2 top-3 text-gray-500"/></div></div><div className="col-span-2 space-y-1"><label className="text-xs font-bold text-gray-500 uppercase">Condition</label><div className="flex gap-2">{['Sunny', 'Cloudy', 'Rain', 'Windy'].map(c => (<button key={c} onClick={() => handleSaveJob({ weather: { ...job.weather!, condition: c as any } })} className={`flex-1 py-2 text-xs font-bold rounded border ${job.weather?.condition === c ? 'bg-pestGreen border-pestGreen text-white' : 'bg-black/20 border-white/10 text-gray-400'}`}>{c}</button>))}</div></div></div></div>
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 shadow-2xl"><h3 className="text-white font-bold mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-500"/> Site Risk Assessment</h3><div className="space-y-2">{[{ key: 'petsRemoved', label: 'Pets Removed / Safe' }, { key: 'foodCovered', label: 'Food Covered / Stored' }, { key: 'electricalHazards', label: 'Electrical Hazards Checked' }, { key: 'waterTanksCovered', label: 'Water Tanks / Fish Ponds Covered' }, { key: 'ventilationChecked', label: 'Ventilation Adequate' }].map(item => (<label key={item.key} className="flex items-center justify-between p-2 bg-black/20 rounded border border-white/5 cursor-pointer hover:border-pestGreen/50"><span className="text-sm text-gray-300">{item.label}</span><input type="checkbox" checked={(job.riskAssessment as any)?.[item.key] || false} onChange={e => handleSaveJob({ riskAssessment: { ...job.riskAssessment!, [item.key]: e.target.checked } })} className="w-5 h-5 accent-pestGreen"/></label>))}</div></div>
                             </div>
                             <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 shadow-2xl w-full mb-6"><h3 className="text-white font-bold mb-3">Overall Treatment Plan</h3><TextArea label="Treatment Recommendation" value={job.treatmentRecommendation} onChange={(v: string) => handleSaveJob({ treatmentRecommendation: v })} rows={3} placeholder="Based on findings, we recommend..." /></div>
                             <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 shadow-2xl w-full"><div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4"><div><h3 className="text-white font-bold text-lg">Add New Location / Area</h3><p className="text-xs text-gray-500">Establish specific location finding checkpoints for this job.</p></div><div className="flex gap-2 flex-wrap"><select onChange={(e) => { if(e.target.value) { loadServiceTemplate(e.target.value); e.target.value = ""; }}} className="bg-black/30 text-white text-xs border border-white/10 rounded-lg p-2"><option value="">Load Protocol Template...</option>{content.services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select><button onClick={printQRCodes} className="bg-white/10 hover:bg-white text-white hover:text-pestBrown px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-white/10"><Printer size={14} /> Print QRs</button><button onClick={() => { setScannerMode('add'); setShowScanner(true); }} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg"><QrCode size={14} /> Scan QR</button></div></div><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4"><div className="col-span-1"><Input label="Area Name / Location" value={newCheckpoint.area} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, area: v }))} placeholder="e.g. Kitchen Cupboard" /></div><div className="col-span-1"><Input label="Pest Found" value={newCheckpoint.pestType} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, pestType: v }))} placeholder="e.g. German Cockroach" /></div><div className="col-span-1"><Select label="Infestation Level" value={newCheckpoint.infestationLevel} options={[{label:'Trace',value:'Trace'},{label:'Low',value:'Low'},{label:'Medium',value:'Medium'},{label:'High',value:'High'},{label:'Severe',value:'Severe'}]} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, infestationLevel: v as any }))} /></div><div className="col-span-1"><Select label="Action Priority" value={newCheckpoint.actionPriority} options={[{label:'Routine',value:'Routine'},{label:'Urgent',value:'Urgent'},{label:'Critical',value:'Critical'}]} onChange={(v: string) => setNewCheckpoint(prev => ({ ...prev, actionPriority: v as any }))} /></div></div><div className="mb-6 bg-black/20 p-4 rounded-xl border border-white/5"><h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2"><ListPlus size={16}/> Specific Tasks / Checkdowns (1 by 1)</h4><p className="text-xs text-gray-500 mb-3">Add specific steps the technician must verify at this location.</p><div className="flex flex-col gap-2">{newCheckpoint.tasks && newCheckpoint.tasks.map((task) => (<div key={task.id} className="flex items-center justify-between bg-white/5 p-2 rounded-lg"><span className="text-sm text-gray-300">{task.description}</span><button onClick={() => removeTaskFromBuilder(task.id)} className="text-red-500 hover:text-white"><Trash2 size={14}/></button></div>))}{(!newCheckpoint.tasks || newCheckpoint.tasks.length === 0) && (<p className="text-xs text-gray-600 italic">No tasks added yet. Will use defaults if left empty.</p>)}</div><div className="flex gap-2 mt-3"><input type="text" value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addNewTaskToCheckpointBuilder()} placeholder="Add specific task (e.g., Check moisture meter)" className="flex-1 bg-[#0f1110] border border-white/10 rounded-lg p-2 text-sm text-white focus:border-pestGreen outline-none" /><button onClick={addNewTaskToCheckpointBuilder} className="bg-pestGreen text-white px-3 py-2 rounded-lg font-bold text-xs">Add Step</button></div></div><div className="mb-6"><FileUpload label="Photos" value={newCheckpoint.photos} onChange={(v: string[]) => setNewCheckpoint(prev => ({ ...prev, photos: v }))} multiple={true} capture="environment" /></div><button onClick={addCheckpoint} className="w-full bg-pestGreen hover:bg-white hover:text-pestGreen text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg"><Plus size={20}/> Add Location Checkpoint</button></div>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">{job.checkpoints.map((cp, idx) => (<div key={cp.id} className="bg-[#161817] border-l-4 border-l-pestGreen border-y border-r border-white/5 rounded-r-xl p-4 relative flex flex-col gap-2"><button onClick={() => { const updated = job.checkpoints.filter(c => c.id !== cp.id); handleSaveJob({ checkpoints: updated }); }} className="absolute top-2 right-2 text-gray-600 hover:text-red-500"><Trash2 size={16}/></button><div className="flex gap-2 items-start"><div className="flex-shrink-0 w-12 h-12 bg-white p-1 rounded-lg"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cp.code}`} alt="QR" className="w-full h-full" /></div><div className="flex-1 overflow-hidden"><h4 className="text-sm font-bold text-white truncate">{cp.area}</h4><p className="text-xs text-gray-400">{cp.code}</p><div className="flex items-center gap-1 mt-1"><span className="text-[10px] bg-white/10 px-1 rounded text-gray-400">{cp.pestType}</span><span className="text-[10px] bg-white/10 px-1 rounded text-gray-400">{cp.tasks.length} Tasks</span></div></div></div></div>))}</div>
                             <SaveBar onSave={() => alert('Assessment Saved!')} />
                        </div>
                    )}

                    {activeTab === 'quote' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                                    <DollarSign size={32} className="text-pestGreen"/> Quote Builder
                                    <HelpButton topic="quote-builder" />
                                </h1>
                                
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="text-xs font-bold uppercase text-gray-500 mr-2 hidden md:block">Send Quote:</span>
                                    <button onClick={() => sendCommunication('QUOTE', 'whatsapp')} className="bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm border border-[#25D366]/30 transition-colors shadow-sm" title="Send Quote via WhatsApp">
                                        <MessageCircle size={16}/> WhatsApp
                                    </button>
                                    <button onClick={() => sendCommunication('QUOTE', 'sms')} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm border border-white/10 transition-colors shadow-sm" title="Send Quote via SMS">
                                        <MessageSquare size={16}/> SMS
                                    </button>
                                    <button onClick={() => sendCommunication('QUOTE', 'email')} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm border border-white/10 transition-colors shadow-sm" title="Send Quote via Email">
                                        <Mail size={16}/> Email
                                    </button>

                                    <div className="w-px h-8 bg-white/20 mx-1"></div>

                                    {job.status === 'Quote_Builder' && (
                                        <button 
                                            onClick={() => { advanceStatus('Quote_Sent'); alert("Quote saved as Pending. Status updated to Quote Sent."); }} 
                                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 text-sm shadow-md"
                                        >
                                            <Send size={16}/> Save Status
                                        </button>
                                    )}

                                    {(job.status === 'Quote_Builder' || job.status === 'Quote_Sent') && (
                                        <button 
                                            onClick={handleApproveQuote}
                                            className="bg-pestGreen hover:bg-white hover:text-pestGreen text-white px-6 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 text-sm shadow-lg animate-pulse"
                                        >
                                            <ThumbsUp size={16}/> Approve & Schedule
                                        </button>
                                    )}
                                </div>
                             </div>

                             {showScheduleModal && (
                                <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                                    <div className="bg-[#1e201f] w-full max-w-md p-6 rounded-2xl border border-white/10 space-y-4 animate-in zoom-in-95">
                                        <h3 className="text-white font-bold text-xl flex items-center gap-2"><Calendar className="text-pestGreen"/> Schedule Job Execution</h3>
                                        <p className="text-sm text-gray-400">Client approved? Set the date and time for the team.</p>
                                        
                                        <Input label="Service Date" type="date" value={scheduleForm.date} onChange={(v: string) => setScheduleForm({...scheduleForm, date: v})} />
                                        <Input label="Arrival Time" type="time" value={scheduleForm.time} onChange={(v: string) => setScheduleForm({...scheduleForm, time: v})} />
                                        
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                            <button onClick={() => setShowScheduleModal(false)} className="flex-1 py-3 rounded-xl font-bold bg-white/5 text-gray-400 hover:text-white">Cancel</button>
                                            <button onClick={confirmSchedule} className="flex-1 py-3 rounded-xl font-bold bg-pestGreen text-white shadow-lg">Confirm & Book</button>
                                        </div>
                                    </div>
                                </div>
                             )}

                             {(!['Job_Scheduled', 'Job_In_Progress', 'Invoiced', 'Completed', 'Job_Review'].includes(job.status)) && (
                                 <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-center gap-3 text-yellow-500">
                                     <AlertTriangle size={20} />
                                     <span className="font-bold">Execution Tab is locked until quote is approved by client.</span>
                                 </div>
                             )}

                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                                 <div className="lg:col-span-2 space-y-6">
                                     <div className="bg-[#161817] border border-white/5 rounded-2xl p-4 flex gap-4 items-center">
                                         <div className="w-1/3">
                                            <Select label="Deposit Type" value={job.quote.depositType || 'None'} options={[{label:'None',value:'None'}, {label:'Percentage (%)',value:'Percentage'}, {label:'Fixed Amount (R)',value:'Fixed'}]} onChange={(v: string) => handleSaveJob({ quote: { ...job.quote, depositType: v as any } })} />
                                         </div>
                                         <div className="w-1/3">
                                             <Input label="Deposit Value" type="number" value={job.quote.depositValue || ''} onChange={(v: string) => handleSaveJob({ quote: { ...job.quote, depositValue: parseFloat(v) } })} />
                                         </div>
                                         <div className="flex-1 pt-4 text-sm text-gray-500">
                                             {job.quote.depositType === 'Percentage' ? `Requires ${(job.quote.depositValue || 0)}% of Total` : job.quote.depositType === 'Fixed' ? `Requires R${(job.quote.depositValue || 0)} flat` : 'No Deposit Required'}
                                         </div>
                                     </div>

                                     <div className="bg-[#161817] border border-white/5 rounded-2xl p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-white font-bold">Add Line Item</h3>
                                            <div className="flex gap-2">
                                                <select 
                                                    value={selectedInventoryForQuote}
                                                    onChange={(e) => setSelectedInventoryForQuote(e.target.value)}
                                                    className="bg-black/30 text-white border border-white/10 rounded-lg p-2 text-xs w-48"
                                                >
                                                    <option value="">Select from Inventory...</option>
                                                    {content.inventory.map(i => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                                                </select>
                                                <button onClick={handleAddInventoryToQuote} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10">
                                                    Load
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="col-span-2"><Input label="Item Name" value={newLineItem.name} onChange={(v: string) => setNewLineItem(prev => ({ ...prev, name: v }))} placeholder="Service Title..." /></div>
                                                <div className="col-span-1"><Input label="Price (Unit)" type="number" value={newLineItem.unitPrice} onChange={(v: string) => setNewLineItem(prev => ({ ...prev, unitPrice: parseFloat(v) }))} /></div>
                                            </div>
                                            <TextArea label="Detailed Description (Optional)" value={newLineItem.description} onChange={(v: string) => setNewLineItem(prev => ({ ...prev, description: v }))} rows={2} placeholder="Add detailed specs..." />
                                            <div className="flex justify-between items-center">
                                                <div className="w-24"><Input label="Qty" type="number" value={newLineItem.qty} onChange={(v: string) => setNewLineItem(prev => ({ ...prev, qty: parseInt(v) }))} /></div>
                                                <button 
                                                    onClick={() => {
                                                        if (!newLineItem.name || !newLineItem.unitPrice) return;
                                                        const total = (newLineItem.qty || 1) * (newLineItem.unitPrice || 0);
                                                        const newItem: QuoteLineItem = { 
                                                            id: Date.now().toString(), 
                                                            name: newLineItem.name!, 
                                                            description: newLineItem.description, 
                                                            qty: newLineItem.qty || 1, 
                                                            unitPrice: newLineItem.unitPrice || 0, 
                                                            total,
                                                            inventoryItemId: newLineItem.inventoryItemId
                                                        };
                                                        const updatedItems = [...job.quote.lineItems, newItem];
                                                        const subtotal = updatedItems.reduce((acc, i) => acc + i.total, 0);
                                                        const totalWithVat = subtotal + (subtotal * job.quote.vatRate);
                                                        handleSaveJob({ quote: { ...job.quote, lineItems: updatedItems, subtotal, total: totalWithVat } });
                                                        setNewLineItem({ name: '', description: '', qty: 1, unitPrice: 0 });
                                                        setSelectedInventoryForQuote('');
                                                    }}
                                                    className="bg-pestGreen text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 h-fit mt-auto"
                                                >
                                                    <Plus size={18} /> Add Item
                                                </button>
                                            </div>
                                        </div>
                                     </div>

                                     <div className="space-y-2">
                                         {job.quote.lineItems.map((item) => (
                                             <div key={item.id} className="bg-[#161817] p-4 rounded-xl border border-white/5 flex flex-col gap-2">
                                                 <div className="flex justify-between items-start">
                                                     <div>
                                                         <p className="font-bold text-white text-base">{item.name}</p>
                                                         {item.description && <p className="text-gray-400 text-xs mt-1">{item.description}</p>}
                                                     </div>
                                                     <div className="text-right">
                                                         <span className="font-bold text-pestGreen block">R{item.total.toFixed(2)}</span>
                                                         <span className="text-xs text-gray-500">{item.qty} x R{item.unitPrice}</span>
                                                     </div>
                                                 </div>
                                                 <div className="flex justify-end pt-2 border-t border-white/5">
                                                     <button onClick={() => {
                                                         const updatedItems = job.quote.lineItems.filter(i => i.id !== item.id);
                                                         const subtotal = updatedItems.reduce((acc, i) => acc + i.total, 0);
                                                         const totalWithVat = subtotal + (subtotal * job.quote.vatRate);
                                                         handleSaveJob({ quote: { ...job.quote, lineItems: updatedItems, subtotal, total: totalWithVat } });
                                                     }} className="text-red-500 hover:text-red-400 text-xs flex items-center gap-1"><Trash2 size={12}/> Remove</button>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>

                                 <div className="lg:col-span-1 space-y-6">
                                     <div className="bg-[#161817] border border-white/5 rounded-2xl p-6">
                                         <h3 className="text-white font-bold mb-4">Total</h3>
                                         <div className="space-y-2 text-sm text-gray-400">
                                             <div className="flex justify-between"><span>Subtotal</span><span>R {job.quote.subtotal.toFixed(2)}</span></div>
                                             <div className="flex justify-between"><span>VAT ({(job.quote.vatRate * 100).toFixed(0)}%)</span><span>R {(job.quote.subtotal * job.quote.vatRate).toFixed(2)}</span></div>
                                         </div>
                                         <div className="pt-4 border-t border-white/10 mt-4 flex justify-between text-xl font-black text-white">
                                             <span>Total</span>
                                             <span>R {job.quote.total.toFixed(2)}</span>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                             <SaveBar onSave={() => alert('Quote Details Saved!')} />
                        </div>
                    )}

                    {activeTab === 'execution' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="flex justify-between items-center"><h1 className="text-3xl font-black text-white flex items-center gap-3"><Zap size={32} className="text-pestGreen"/> Job Execution<HelpButton topic="execution" /></h1>{job.status === 'Job_In_Progress' && <button onClick={() => advanceStatus('Job_Review')} className="bg-white text-pestBrown hover:bg-pestGreen hover:text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 text-sm">Finish <ArrowRight size={14}/></button>}</div>
                            {!isPpeConfirmed && (<div className="bg-red-900/20 border border-red-500/30 p-6 rounded-2xl mb-6"><h3 className="text-red-400 font-bold mb-4 flex items-center gap-2"><AlertOctagon size={20}/> Pre-Work Safety Check (Mandatory)</h3><div className="flex flex-wrap gap-4">{[{key:'gloves', label:'Gloves'}, {key:'mask', label:'Respirator/Mask'}, {key:'boots', label:'Safety Boots'}, {key:'overall', label:'Overalls'}].map(p => (<label key={p.key} className="flex items-center gap-2 p-3 bg-black/30 rounded-lg cursor-pointer border border-white/10 hover:border-red-400"><input type="checkbox" checked={(ppeCheck as any)[p.key]} onChange={e => setPpeCheck(prev => ({...prev, [p.key]: e.target.checked}))} className="accent-red-500 w-5 h-5"/><span className="text-white font-bold">{p.label}</span></label>))}</div><p className="text-xs text-gray-400 mt-2">* By checking these, you confirm you are wearing appropriate PPE for the chemicals used.</p></div>)}
                            {showScanner && (<div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-4"><button onClick={() => setShowScanner(false)} className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full"><X size={32}/></button><div id="reader" className="w-full max-w-sm bg-white rounded-lg overflow-hidden border-4 border-pestGreen"></div><p className="text-white mt-4 font-bold text-lg animate-pulse">{scannerMode === 'start' ? 'Scanning Start Code...' : 'Scanning Finish Code...'}</p></div>)}
                            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${!isPpeConfirmed ? 'opacity-50 pointer-events-none filter blur-sm' : ''}`}>
                                <div className="lg:col-span-2 space-y-4">
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3 text-gray-300 text-sm"><Info size={16} className="text-pestGreen" /><span>Double-Scan Protocol: Scan QR to START tasks, Complete Checklist, then Scan AGAIN to Finish.</span></div>
                                    {job.checkpoints.map((cp, idx) => {
                                        const hasStarted = !!cp.scanStart; const hasEnded = !!cp.scanEnd;
                                        return (
                                            <div key={cp.id} className={`bg-[#161817] border rounded-2xl p-6 transition-all ${hasEnded ? 'border-pestGreen bg-pestGreen/5' : 'border-white/5'}`}><div className="flex flex-col md:flex-row gap-6 justify-between items-start"><div className="flex-1"><div className="flex items-center gap-3 mb-2"><h3 className="text-xl font-bold text-white">{cp.area}</h3><span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${cp.actionPriority === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{cp.actionPriority}</span></div><p className="text-sm text-gray-400 mb-1">Target: <span className="text-white">{cp.pestType}</span> | Severity: {cp.severity}</p><div className="mt-4 bg-blue-900/10 border border-blue-500/20 p-3 rounded-lg grid grid-cols-3 gap-2"><div className="flex flex-col"><span className="text-[10px] text-blue-300 font-bold uppercase">Activity</span><select disabled={!hasStarted || hasEnded} value={cp.monitorData?.activity || 'None'} onChange={e => { const newCps = [...job.checkpoints]; newCps[idx].monitorData = { ...newCps[idx].monitorData!, activity: e.target.value as any }; handleSaveJob({ checkpoints: newCps }); }} className="bg-black/20 text-white text-xs p-1 rounded border border-white/10"><option value="None">None</option><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div><div className="flex flex-col"><span className="text-[10px] text-blue-300 font-bold uppercase">Bait Cond.</span><select disabled={!hasStarted || hasEnded} value={cp.monitorData?.baitCondition || 'Intact'} onChange={e => { const newCps = [...job.checkpoints]; newCps[idx].monitorData = { ...newCps[idx].monitorData!, baitCondition: e.target.value as any }; handleSaveJob({ checkpoints: newCps }); }} className="bg-black/20 text-white text-xs p-1 rounded border border-white/10"><option value="Intact">Intact</option><option value="Moldy">Moldy</option><option value="Consumed">Consumed</option><option value="Missing">Missing</option></select></div><div className="flex flex-col"><span className="text-[10px] text-blue-300 font-bold uppercase">Station</span><select disabled={!hasStarted || hasEnded} value={cp.monitorData?.stationStatus || 'Secure'} onChange={e => { const newCps = [...job.checkpoints]; newCps[idx].monitorData = { ...newCps[idx].monitorData!, stationStatus: e.target.value as any }; handleSaveJob({ checkpoints: newCps }); }} className="bg-black/20 text-white text-xs p-1 rounded border border-white/10"><option value="Secure">Secure</option><option value="Damaged">Damaged</option><option value="Blocked">Blocked</option></select></div></div>{hasStarted && !hasEnded && (<div className="mt-4 bg-black/20 p-4 rounded-xl border border-white/5 space-y-2"><h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Execution Checklist</h4>{cp.tasks.map((task, tIdx) => (<label key={task.id} className="flex items-center gap-3 cursor-pointer group"><div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.completed ? 'bg-pestGreen border-pestGreen text-white' : 'bg-transparent border-gray-600 group-hover:border-pestGreen'}`}>{task.completed && <CheckCircle size={14}/>}</div><input type="checkbox" className="hidden" checked={task.completed} onChange={(e) => { const newCps = [...job.checkpoints]; newCps[idx].tasks[tIdx].completed = e.target.checked; if(e.target.checked) newCps[idx].tasks[tIdx].timestamp = new Date().toISOString(); handleSaveJob({ checkpoints: newCps }); }} /><span className={`text-sm ${task.completed ? 'text-white line-through opacity-50' : 'text-gray-300'}`}>{task.description}</span></label>))}</div>)}<div className="mt-4">{hasStarted && !hasEnded && (<input type="text" placeholder="Add any additional notes..." className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-4 text-sm text-white focus:border-pestGreen outline-none" value={cp.treatmentNotes || ''} onChange={(e) => { const newCps = [...job.checkpoints]; newCps[idx] = { ...newCps[idx], treatmentNotes: e.target.value }; handleSaveJob({ checkpoints: newCps }); }} />)}</div></div><div className="flex flex-col gap-3 min-w-[160px]">{!hasStarted && (<button onClick={() => { setScannerMode('start'); setScanningCheckpointId(cp.id); setShowScanner(true); }} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"><LogIn size={16}/> Scan to Start</button>)}{hasStarted && !hasEnded && (<><div className="w-full py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2 animate-pulse"><Timer size={14}/> In Progress...</div><button onClick={() => { setScannerMode('end'); setScanningCheckpointId(cp.id); setShowScanner(true); }} className="w-full py-3 bg-pestGreen hover:bg-white hover:text-pestGreen text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"><LogOut size={16}/> Scan to Finish</button></>)}{hasEnded && (<div className="w-full py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2"><CheckCircle size={14}/> Completed</div>)}</div></div></div>
                                        );
                                    })}
                                </div>
                                <div className="lg:col-span-1">
                                    <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 sticky top-6">
                                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><FlaskConical size={18} className="text-pestGreen"/> Chemical Application</h3>
                                        <div className="space-y-4 mb-6"><div><label className="text-xs text-gray-500 uppercase font-bold">Select Chemical</label><select value={materialUsageForm.inventoryItemId} onChange={(e) => setMaterialUsageForm({ ...materialUsageForm, inventoryItemId: e.target.value })} className="w-full p-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm"><option value="">Select inventory...</option>{content.inventory.map(i => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}</select></div><div className="grid grid-cols-2 gap-3"><Input label="Qty Used" type="number" value={materialUsageForm.qtyUsed} onChange={(v: string) => setMaterialUsageForm({ ...materialUsageForm, qtyUsed: parseFloat(v) })} /><Input label="Dilution" value={materialUsageForm.dilutionRate} onChange={(v: string) => setMaterialUsageForm({ ...materialUsageForm, dilutionRate: v })} placeholder="e.g. 5ml/1L" /></div><div><label className="text-xs text-gray-500 uppercase font-bold">Application Method</label><select value={materialUsageForm.applicationMethod} onChange={(e) => setMaterialUsageForm({ ...materialUsageForm, applicationMethod: e.target.value as any })} className="w-full p-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm"><option value="Spray">Spray</option><option value="Gel">Gel</option><option value="Dust">Dust</option><option value="Bait Station">Bait Station</option><option value="Gas">Gas/Fumigation</option></select></div><div><Input label="Batch Number" value={materialUsageForm.batchNumber} onChange={(v: string) => setMaterialUsageForm({ ...materialUsageForm, batchNumber: v })} placeholder="Required for Compliance" /></div><button onClick={handleRecordUsage} className="w-full bg-pestGreen text-white py-2 rounded-lg font-bold text-sm">Record Usage</button></div>
                                        <div className="space-y-2">{job.materialUsage?.map(usage => (<div key={usage.id} className="bg-black/20 p-3 rounded-lg border border-white/5 flex flex-col gap-1"><div className="flex justify-between items-center"><div className="font-bold text-white text-sm">{usage.itemName}</div><div className="text-white font-bold">{usage.qtyUsed} {usage.unit}</div></div><div className="text-xs text-gray-500 flex justify-between"><span>{usage.applicationMethod}</span><span>Batch: {usage.batchNumber || 'N/A'}</span></div></div>))}{(!job.materialUsage || job.materialUsage.length === 0) && <p className="text-gray-500 text-xs text-center">No materials recorded yet.</p>}</div>
                                    </div>
                                </div>
                            </div>
                            <SaveBar onSave={() => alert('Execution Data Saved!')} />
                        </div>
                    )}

                    {activeTab === 'invoice' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            {/* Invoice Tab content */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <h1 className="text-3xl font-black text-white flex items-center gap-3"><FileCheck size={32} className="text-pestGreen"/> Finalize & Payment<HelpButton topic="invoice-close" /></h1>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="flex gap-2">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Send Invoice</span>
                                            <div className="flex gap-1">
                                                <button onClick={() => sendCommunication('INVOICE', 'whatsapp')} className="bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1 border border-[#25D366]/30 transition-colors" title="Send Invoice via WhatsApp">
                                                    <MessageCircle size={14}/> WA
                                                </button>
                                                <button onClick={() => sendCommunication('INVOICE', 'email')} className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1 border border-white/10 transition-colors" title="Send Invoice via Email">
                                                    <Mail size={14}/> Email
                                                </button>
                                            </div>
                                        </div>
                                        <div className="w-px bg-white/20 mx-1"></div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Send Job Report</span>
                                            <div className="flex gap-1">
                                                <button onClick={() => sendCommunication('REPORT', 'whatsapp')} className="bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1 border border-[#25D366]/30 transition-colors" title="Send Report via WhatsApp">
                                                    <MessageCircle size={14}/> WA
                                                </button>
                                                <button onClick={() => sendCommunication('REPORT', 'email')} className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1 border border-white/10 transition-colors" title="Send Report via Email">
                                                    <Mail size={14}/> Email
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-[#161817] border border-white/5 rounded-2xl p-6"><h3 className="text-white font-bold mb-4">Invoice Notes</h3><TextArea label="Special Instructions / Terms" value={job.invoice?.notes || ''} onChange={handleInvoiceNoteChange} rows={3} placeholder="Banking details check..." /></div>
                                <div className="bg-[#161817] border border-pestGreen/30 rounded-2xl p-6 relative overflow-hidden"><div className="absolute top-0 right-0 p-4 opacity-10"><Banknote size={100} className="text-pestGreen"/></div><h3 className="text-white font-bold mb-4 flex items-center gap-2"><CreditCard size={20} className="text-pestGreen"/> Record Payment</h3>{job.paymentRecord ? (<div className="bg-green-500/20 border border-green-500/50 p-4 rounded-xl text-center"><CheckCircle size={40} className="text-green-500 mx-auto mb-2"/><h4 className="text-green-400 font-bold text-lg">Payment Recorded</h4><p className="text-white mt-1">R {job.paymentRecord.amount.toFixed(2)} via {job.paymentRecord.method}</p><p className="text-xs text-gray-400 mt-1">{new Date(job.paymentRecord.date).toLocaleDateString()}</p></div>) : (<div className="space-y-4 relative z-10"><div className="grid grid-cols-2 gap-4"><Select label="Method" value={paymentForm.method} options={[{label:'EFT',value:'EFT'},{label:'Card',value:'Card'},{label:'Cash',value:'Cash'},{label:'Other',value:'Other'}]} onChange={(v: string) => setPaymentForm(prev => ({ ...prev, method: v as any }))} /><Input label="Amount Paid" type="number" value={paymentForm.amount} onChange={(v: string) => setPaymentForm(prev => ({ ...prev, amount: parseFloat(v) }))} /></div><Input label="Reference / Notes" value={paymentForm.reference} onChange={(v: string) => setPaymentForm(prev => ({ ...prev, reference: v }))} placeholder="e.g. Inv 24010" /><button onClick={handleRecordPayment} className={`w-full bg-pestGreen text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-neon transition-all ${!canInvoice ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!canInvoice}>Confirm Payment {(!canInvoice) && '(Admin Only)'}</button></div>)}</div>
                            </div>
                            <div className="bg-[#161817] border border-white/5 rounded-2xl p-6 mt-6"><h3 className="text-white font-bold mb-4 flex items-center gap-2"><FileText size={20}/> Job Documentation</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-4"><p className="text-xs text-gray-400">Upload PDF Certificates (COC, Clearance) for the client to view online.</p><FileUpload label="Upload Certificates" value={job.jobCertificates || []} onChange={(urls: string[]) => handleSaveJob({ jobCertificates: urls })} multiple={true} accept=".pdf,.jpg,.jpeg,.png"/></div><div className="flex flex-col justify-end"><button onClick={printMainQRCard} className="bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 border border-white/10 transition-colors"><QrCode size={24}/> Print Client QR Card</button><p className="text-[10px] text-gray-500 mt-2 text-center">Generates a printable card for the client to scan. Links to Report & WhatsApp.</p></div></div></div>
                            <div className="bg-[#161817] border border-white/5 rounded-2xl p-8 text-center space-y-6 mt-6"><h2 className="text-2xl font-bold text-white">Job Actions</h2><div className="flex justify-center gap-4 flex-wrap">
                                <button onClick={() => generatePrintDocument('REPORT')} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-white/10"><FileText size={18}/> View & Print Full Job Report</button>
                                <button onClick={() => generatePrintDocument('INVOICE')} className="bg-white text-pestBrown hover:bg-gray-100 px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Printer size={18}/> Print Invoice</button>
                                <button onClick={handleRebook} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"><Repeat size={18}/> Book Follow-Up</button>
                                {canInvoice && <button onClick={handleCloseJob} className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-neon transition-all"><Lock size={18}/> Close Job</button>}</div></div>
                            <SaveBar onSave={() => alert('Invoice Details Saved!')} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
