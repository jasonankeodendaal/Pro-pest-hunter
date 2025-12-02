
import React, { useState } from 'react';
import { HelpCircle, X, BookOpen, CheckCircle, Info, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Help Content Dictionary
export const HELP_CONTENT: Record<string, { title: string; subtitle: string; steps: string[] }> = {
    // --- ADMIN / WORKFLOW ---
    'job-overview': {
        title: "Job Overview Guide",
        subtitle: "How to manage client details and schedule technicians.",
        steps: [
            "1. **Client Details**: Ensure name, email, and phone are accurate. These are used for invoices and portal access.",
            "2. **Site Location**: Enter the precise address. If there is a gate code, add it here for the technician.",
            "3. **Scheduling**: Select an Assessment Date (for the initial visit) and assign a Technician if known.",
            "4. **Status**: The status bar at the top shows the current stage. Use the 'Next' buttons to progress the job.",
            "5. **Saving**: Always click 'Save Details' at the bottom right before leaving this tab."
        ]
    },
    'assessment': {
        title: "Site Assessment & Findings",
        subtitle: "Recording pest activity and planning treatment.",
        steps: [
            "1. **Treatment Plan**: Write a high-level summary of what needs to be done (e.g., 'Full perimeter spray and kitchen gel').",
            "2. **Adding Findings**: Use the form to record specific pest locations (Checkpoints).",
            "3. **QR Codes**: You can print QR codes for these checkpoints. Stick them at the physical location.",
            "4. **Scanning**: Use the 'Scan QR' button to quickly verify a location or add a new one by scanning.",
            "5. **Photos**: Take photos of the infestation to show the client in the report."
        ]
    },
    'quote-builder': {
        title: "Quote Builder Guide",
        subtitle: "Creating and sending professional quotations.",
        steps: [
            "1. **Line Items**: Add services or products. Include a clear description and unit price.",
            "2. **Deposit**: Configure if a deposit is required (Percentage or Fixed Amount). The system will prompt for this later.",
            "3. **Notes**: Add payment terms or banking details here.",
            "4. **Workflow**: \n   - Click 'Save (Pending)' to store the quote.\n   - Click 'Print Quote' to generate a PDF for the client.\n   - Once the client accepts, click 'Approve & Convert' to unlock the Execution tab."
        ]
    },
    'execution': {
        title: "Job Execution & QR Verification",
        subtitle: "The technician's workflow for treating the site.",
        steps: [
            "1. **Preparation**: Technician must check PPE requirements and record weather conditions.",
            "2. **Double-Scan System**: \n   - **Step 1 (Start)**: Scan the QR code at the checkpoint to confirm arrival at the specific spot.\n   - **Step 2 (Treat)**: Perform the treatment and add any notes.\n   - **Step 3 (Finish)**: Scan the QR code AGAIN to confirm work is done and close the checkpoint.",
            "3. **Completion**: Once all checkpoints are treated, click 'Finish' to move to the Invoice stage."
        ]
    },
    'invoice-close': {
        title: "Invoicing & Closing",
        subtitle: "Finalizing the job and recording payment.",
        steps: [
            "1. **Review**: Check that all costs are correct in the final invoice.",
            "2. **Payment**: Use the 'Record Payment' panel to log Cash, Card, or EFT payments. This marks the invoice as Paid.",
            "3. **Follow-Up**: Use the 'Book Follow-Up' button to instantly create a new job for this client with their details pre-filled.",
            "4. **Close**: Click 'Close Job' to archive it as Completed."
        ]
    },
    
    // --- DASHBOARD SECTIONS ---
    'clients': {
        title: "Client Management",
        subtitle: "Tracking history and portal access.",
        steps: [
            "1. **Search**: Find clients by name. The system groups all jobs under one client profile automatically based on email.",
            "2. **Portal Access**: You can generate a login for a client here. They will need their Email and the PIN you set.",
            "3. **Editing**: You can update a client's phone or address here, which updates their active jobs."
        ]
    },
    'bookings': {
        title: "Online Inquiries",
        subtitle: "Managing requests from the website.",
        steps: [
            "1. **New Bookings**: Appear here when a customer fills out the 'Book Now' form on the home page.",
            "2. **Action**: \n   - 'Mark Contacted': If you have called them but not scheduled yet.\n   - 'Convert to Job': Creates a full Job Card and moves the data over.",
            "3. **Archive**: Hides old or spam inquiries."
        ]
    },
    'editors': {
        title: "Website Content Editors",
        subtitle: "Updating your public website.",
        steps: [
            "1. **Live Updates**: Changes made here reflect immediately on the website.",
            "2. **Icons**: Use the icon picker to select symbols.",
            "3. **Images**: Upload high-quality images. Avoid huge files to keep the site fast.",
            "4. **SEO**: Update keywords and descriptions in the SEO tab to help Google find you."
        ]
    },

    // --- CLIENT PORTAL ---
    'client-dashboard': {
        title: "Client Dashboard Guide",
        subtitle: "How to use your personal portal.",
        steps: [
            "1. **Overview**: See your total spend and active job count.",
            "2. **My Jobs**: View history of all past services. You can download invoices here.",
            "3. **Profile**: Update your contact details or change your password/PIN.",
            "4. **Support**: Contact the admin if you see any discrepancies."
        ]
    }
};

interface HelpButtonProps {
    topic: string; // Key from HELP_CONTENT
    className?: string;
}

export const HelpButton: React.FC<HelpButtonProps> = ({ topic, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const content = HELP_CONTENT[topic];

    if (!content) return null;

    return (
        <>
            <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
                className={`flex items-center gap-2 text-pestGreen hover:text-white bg-pestGreen/10 hover:bg-pestGreen px-3 py-1.5 rounded-lg transition-all font-bold text-xs uppercase tracking-wide border border-pestGreen/20 ${className}`}
                title="Click for Guide"
            >
                <HelpCircle size={16} /> Help Guide
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#1a1a1a] w-full max-w-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-pestGreen p-6 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 text-pestBrown bg-white/20 px-3 py-1 rounded-full w-fit mb-3">
                                        <BookOpen size={16} />
                                        <span className="text-xs font-black uppercase tracking-wider">System Guide</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white leading-tight">{content.title}</h2>
                                    <p className="text-pestBrown/80 font-medium mt-1">{content.subtitle}</p>
                                </div>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-6">
                                    {content.steps.map((step, idx) => {
                                        // Simple markdown parsing for bolding
                                        const parts = step.split('**');
                                        return (
                                            <div key={idx} className="flex gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pestGreen/10 flex items-center justify-center text-pestGreen font-bold border border-pestGreen/20">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                                        {parts.map((part, i) => 
                                                            i % 2 === 1 ? <span key={i} className="font-bold text-white">{part}</span> : part
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-white/5 bg-white/5 flex justify-end">
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="bg-white text-pestBrown hover:bg-pestGreen hover:text-white px-6 py-2 rounded-xl font-bold transition-colors flex items-center gap-2"
                                >
                                    Got it <CheckCircle size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
